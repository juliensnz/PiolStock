import type {Format, Product} from './Product';

const ORDER_STATUS = {
  PREPARING: 'PREPARING',
  SHIPPED: 'SHIPPED',
} as const;

type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

type ComputedStatus = 'PREPARING' | 'READY_TO_SHIP' | 'SHIPPED';

type OrderItemId = string;

type OrderItem = {
  id: OrderItemId;
  productName: string;
  productId: string | null;
  variantId: string | null;
  productImage: string | null;
  format: Format;
  quantity: number;
};

type EnrichedOrderItem = OrderItem & {
  quantityInStock: number;
  quantityToPrint: number;
};

type OrderId = string;

type ShippingAddress = {
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
};

type Order = {
  id: OrderId;
  orderNumber: string;
  orderDate: string;
  customerName: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
};

type EnrichedOrder = Omit<Order, 'items'> & {
  items: EnrichedOrderItem[];
  computedStatus: ComputedStatus;
};

const createOrderItem = (
  productName: string,
  format: Format,
  quantity: number,
  productId: string | null = null,
  variantId: string | null = null,
  productImage: string | null = null
): OrderItem => ({
  id: crypto.randomUUID(),
  productName,
  productId,
  variantId,
  productImage,
  format,
  quantity,
});

const createOrder = (
  orderNumber: string,
  orderDate: string,
  customerName: string,
  shippingAddress: ShippingAddress,
  items: OrderItem[]
): Order => ({
  id: crypto.randomUUID(),
  orderNumber,
  orderDate,
  customerName,
  shippingAddress,
  items,
  status: ORDER_STATUS.PREPARING,
  createdAt: new Date().toISOString(),
});

const enrichOrdersWithStock = (orders: Order[], products: Product[]): EnrichedOrder[] => {
  const availableStock = new Map<string, number>();
  for (const product of products) {
    for (const variant of product.variants) {
      availableStock.set(variant.id, variant.stock);
    }
  }

  const sorted = [...orders].sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  return sorted.map(order => {
    if (order.status === ORDER_STATUS.SHIPPED) {
      return {
        ...order,
        items: order.items.map(item => ({...item, quantityInStock: item.quantity, quantityToPrint: 0})),
        computedStatus: 'SHIPPED' as const,
      };
    }

    const enrichedItems: EnrichedOrderItem[] = order.items.map(item => {
      if (!item.variantId) {
        return {...item, quantityInStock: 0, quantityToPrint: item.quantity};
      }

      const available = availableStock.get(item.variantId) ?? 0;
      const fromStock = Math.min(item.quantity, available);
      const toPrint = item.quantity - fromStock;
      availableStock.set(item.variantId, available - fromStock);

      return {...item, quantityInStock: fromStock, quantityToPrint: toPrint};
    });

    const allReady = enrichedItems.every(i => i.quantityToPrint === 0);

    return {
      ...order,
      items: enrichedItems,
      computedStatus: allReady ? ('READY_TO_SHIP' as const) : ('PREPARING' as const),
    };
  });
};

const COMPUTED_STATUS_LABEL: Record<ComputedStatus, string> = {
  PREPARING: 'Preparing',
  READY_TO_SHIP: 'Ready to ship',
  SHIPPED: 'Shipped',
};

export type {Order, OrderId, OrderItem, OrderItemId, OrderStatus, EnrichedOrder, EnrichedOrderItem, ComputedStatus, ShippingAddress};
export {ORDER_STATUS, createOrderItem, createOrder, enrichOrdersWithStock, COMPUTED_STATUS_LABEL};
