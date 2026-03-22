import {Order, ORDER_STATUS, enrichOrdersWithStock} from '@/domain/model/Order';
import type {EnrichedOrder} from '@/domain/model/Order';
import type {Product, VariantId} from '@/domain/model/Product';
import {orderRepository} from '@/infrastructure/OrderRepository';
import {productRepository} from '@/infrastructure/ProductRepository';
import {useFirestoreQuery} from '@/lib/useFirestoreQuery/useFirestoreQuery';
import {useProducts} from '@/app/(root)/components/hooks/useProducts';
import {useCallback, useMemo} from 'react';
import {toast} from 'sonner';

const useOrders = () => {
  const ref = orderRepository.getRef();

  if (ref.isError()) throw ref.getError();

  const query = useFirestoreQuery(['orders'], ref.get(), {subscribe: true});

  return query;
};

const useEnrichedOrders = (): EnrichedOrder[] => {
  const {data: ordersData} = useOrders();
  const {data: productsData} = useProducts();

  return useMemo(() => {
    const orders = ordersData?.docs.map(doc => doc.data() as Order) ?? [];
    const products = productsData?.docs.map(doc => doc.data() as Product) ?? [];
    return enrichOrdersWithStock(orders, products);
  }, [ordersData, productsData]);
};

const useAddOrders = () => {
  return useCallback(async (orders: Order[]): Promise<Order[]> => {
    const result = await orderRepository.addOrders(orders);
    if (result.isError()) throw result.getError();

    const created = result.get();
    const label = created.length === 1
      ? `Order for "${created[0].customerName}" created`
      : `${created.length} orders imported`;

    toast(label, {
      action: {
        label: 'Undo',
        onClick: () => {
          Promise.all(created.map(order => orderRepository.deleteOrder(order.id)));
        },
      },
    });

    return created;
  }, []);
};

const useUpdateOrder = () => {
  return useCallback(async (order: Order, previousOrder?: Order): Promise<void> => {
    const result = await orderRepository.updateOrder(order);
    if (result.isError()) throw result.getError();

    if (previousOrder) {
      toast(`Order #${order.orderNumber} updated`, {
        action: {
          label: 'Undo',
          onClick: () => {
            orderRepository.updateOrder(previousOrder);
          },
        },
      });
    }
  }, []);
};

const useDeleteOrder = () => {
  return useCallback(async (orderId: string, orderSnapshot?: Order): Promise<void> => {
    const result = await orderRepository.deleteOrder(orderId);
    if (result.isError()) throw result.getError();

    if (orderSnapshot) {
      toast(`Order #${orderSnapshot.orderNumber} deleted`, {
        action: {
          label: 'Undo',
          onClick: () => {
            orderRepository.addOrders([orderSnapshot]);
          },
        },
      });
    }
  }, []);
};

const useShipOrder = () => {
  return useCallback(async (order: EnrichedOrder): Promise<void> => {
    const stockDecrements: {productId: string; variantId: string; amount: number}[] = [];

    for (const item of order.items) {
      if (!item.productId || !item.variantId || item.quantityInStock <= 0) continue;
      stockDecrements.push({productId: item.productId, variantId: item.variantId, amount: item.quantityInStock});
      const result = await productRepository.decrementStock(item.productId, item.variantId, item.quantityInStock);
      if (result.isError()) throw result.getError();
    }

    const {computedStatus: _, ...baseOrder} = order;
    const baseItems = baseOrder.items.map(({quantityInStock: _qi, quantityToPrint: _qp, ...rest}) => rest);
    const previousOrder: Order = {...baseOrder, items: baseItems};
    const shippedOrder: Order = {...baseOrder, items: baseItems, status: ORDER_STATUS.SHIPPED};

    const result = await orderRepository.updateOrder(shippedOrder);
    if (result.isError()) throw result.getError();

    toast(`Order #${order.orderNumber} shipped`, {
      action: {
        label: 'Undo',
        onClick: async () => {
          await orderRepository.updateOrder(previousOrder);
          await Promise.all(
            stockDecrements.map(({productId, variantId, amount}) =>
              productRepository.incrementStock(productId, variantId, amount)
            )
          );
        },
      },
    });
  }, []);
};

const useReservedStock = () => {
  const enrichedOrders = useEnrichedOrders();

  return useMemo(() => {
    const reserved = new Map<VariantId, number>();

    for (const order of enrichedOrders) {
      if (order.status === ORDER_STATUS.SHIPPED) continue;
      for (const item of order.items) {
        if (!item.variantId) continue;
        const current = reserved.get(item.variantId) ?? 0;
        reserved.set(item.variantId, current + item.quantityInStock);
      }
    }

    return reserved;
  }, [enrichedOrders]);
};

export {useOrders, useEnrichedOrders, useAddOrders, useUpdateOrder, useDeleteOrder, useShipOrder, useReservedStock};
