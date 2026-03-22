'use client';

import {useEnrichedOrders} from '@/app/(root)/components/hooks/useOrders';
import {OrderCard} from '@/app/(root)/components/orders/OrderCard';
import {ImportOrderButton} from '@/app/(root)/components/orders/ImportOrderButton';
import {CreateOrderButton} from '@/app/(root)/components/orders/CreateOrderButton';
import type {ComputedStatus} from '@/domain/model/Order';
import {useMemo, useState} from 'react';

type StatusFilter = 'ALL' | ComputedStatus;

const FILTER_OPTIONS: {value: StatusFilter; label: string}[] = [
  {value: 'ALL', label: 'All'},
  {value: 'PREPARING', label: 'Preparing'},
  {value: 'READY_TO_SHIP', label: 'Ready to ship'},
  {value: 'SHIPPED', label: 'Shipped'},
];

export default function OrdersPage() {
  const enrichedOrders = useEnrichedOrders();
  const [filter, setFilter] = useState<StatusFilter>('ALL');

  const filteredOrders = useMemo(
    () => (filter === 'ALL' ? enrichedOrders : enrichedOrders.filter(o => o.computedStatus === filter)),
    [enrichedOrders, filter]
  );

  const preparingCount = enrichedOrders.filter(o => o.computedStatus === 'PREPARING').length;
  const readyCount = enrichedOrders.filter(o => o.computedStatus === 'READY_TO_SHIP').length;

  return (
    <div className="mx-2.5 flex-1 bg-white">
      <div className="sticky top-0 z-10 mb-6 flex flex-col gap-4 bg-white pt-5 pb-2">
        <div className="flex w-full items-center">
          <h1 className="text-2xl font-bold text-primary">Orders</h1>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <ImportOrderButton />
            <CreateOrderButton />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {FILTER_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  filter === opt.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex gap-3 text-xs text-muted-foreground">
            {preparingCount > 0 && <span className="text-amber-600 font-medium">{preparingCount} preparing</span>}
            {readyCount > 0 && <span className="text-green-600 font-medium">{readyCount} ready</span>}
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <p className="text-lg">No orders</p>
          <p className="text-sm">Import a CSV or create a new order to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 pb-6">
          {filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
