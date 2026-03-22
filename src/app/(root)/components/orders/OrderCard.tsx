'use client';

import {EditOrderButton} from '@/app/(root)/components/orders/EditOrderButton';
import {OrderItemRow} from '@/app/(root)/components/orders/OrderItemRow';
import {useShipOrder, useDeleteOrder} from '@/app/(root)/components/hooks/useOrders';
import {COMPUTED_STATUS_LABEL} from '@/domain/model/Order';
import type {EnrichedOrder} from '@/domain/model/Order';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {MapPin, Package, Trash2, Truck} from 'lucide-react';
import {useCallback} from 'react';

type OrderCardProps = {
  order: EnrichedOrder;
};

const STATUS_COLORS: Record<string, string> = {
  PREPARING: 'border-amber-300 bg-amber-50',
  READY_TO_SHIP: 'border-green-300 bg-green-50',
  SHIPPED: 'border-muted bg-muted/30',
};

const OrderCard = ({order}: OrderCardProps) => {
  const shipOrder = useShipOrder();
  const deleteOrder = useDeleteOrder();

  const handleShip = useCallback(() => {
    shipOrder(order);
  }, [order, shipOrder]);

  const handleDelete = useCallback(() => {
    if (!window.confirm(`Delete order #${order.orderNumber} for "${order.customerName}"?`)) return;
    const {computedStatus: _, ...baseOrder} = order;
    const baseItems = baseOrder.items.map(({quantityInStock: _qi, quantityToPrint: _qp, ...rest}) => rest);
    deleteOrder(order.id, {...baseOrder, items: baseItems});
  }, [order, deleteOrder]);

  const isShipped = order.computedStatus === 'SHIPPED';
  const canShip = order.computedStatus === 'READY_TO_SHIP';

  const itemsToPrint = order.items.filter(i => i.quantityToPrint > 0);
  const itemsReady = order.items.length - itemsToPrint.length;

  return (
    <div className={cn('rounded-xl border-2 p-4 shadow-sm transition-colors', STATUS_COLORS[order.computedStatus] ?? 'border-border bg-white')}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold">{order.customerName}</h3>
            <span className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
              order.computedStatus === 'PREPARING' && 'bg-amber-200 text-amber-800',
              order.computedStatus === 'READY_TO_SHIP' && 'bg-green-200 text-green-800',
              order.computedStatus === 'SHIPPED' && 'bg-muted text-muted-foreground',
            )}>
              {COMPUTED_STATUS_LABEL[order.computedStatus]}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>#{order.orderNumber}</span>
            <span>{order.orderDate}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {!isShipped && <EditOrderButton order={order} />}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span>
            {order.shippingAddress.city}, {order.shippingAddress.country}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Package className="h-3 w-3" />
          <span>
            {itemsReady}/{order.items.length} ready
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {order.items.map(item => (
          <OrderItemRow key={item.id} item={item} readonly={isShipped} />
        ))}
      </div>

      {!isShipped && (
        <div className="mt-3 flex justify-end">
          <Button onClick={handleShip} disabled={!canShip} size="sm" className="gap-1.5">
            <Truck className="h-4 w-4" />
            Ship order
          </Button>
        </div>
      )}
    </div>
  );
};

export {OrderCard};
