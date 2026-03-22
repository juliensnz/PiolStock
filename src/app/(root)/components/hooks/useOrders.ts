import {Order, ORDER_STATUS, enrichOrdersWithStock} from '@/domain/model/Order';
import type {EnrichedOrder} from '@/domain/model/Order';
import type {Product, VariantId} from '@/domain/model/Product';
import {orderRepository} from '@/infrastructure/OrderRepository';
import {productRepository} from '@/infrastructure/ProductRepository';
import {useFirestoreQuery} from '@/lib/useFirestoreQuery/useFirestoreQuery';
import {useProducts} from '@/app/(root)/components/hooks/useProducts';
import {useCallback, useMemo} from 'react';

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
    return result.get();
  }, []);
};

const useUpdateOrder = () => {
  return useCallback(async (order: Order): Promise<void> => {
    const result = await orderRepository.updateOrder(order);
    if (result.isError()) throw result.getError();
  }, []);
};

const useDeleteOrder = () => {
  return useCallback(async (orderId: string): Promise<void> => {
    const result = await orderRepository.deleteOrder(orderId);
    if (result.isError()) throw result.getError();
  }, []);
};

const useShipOrder = () => {
  return useCallback(async (order: EnrichedOrder): Promise<void> => {
    for (const item of order.items) {
      if (!item.productId || !item.variantId || item.quantityInStock <= 0) continue;
      const result = await productRepository.decrementStock(item.productId, item.variantId, item.quantityInStock);
      if (result.isError()) throw result.getError();
    }

    const {computedStatus: _, ...baseOrder} = order;
    const baseItems = baseOrder.items.map(({quantityInStock: _qi, quantityToPrint: _qp, ...rest}) => rest);
    const result = await orderRepository.updateOrder({...baseOrder, items: baseItems, status: ORDER_STATUS.SHIPPED});
    if (result.isError()) throw result.getError();
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
