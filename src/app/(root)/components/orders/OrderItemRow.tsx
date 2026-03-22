'use client';

import {FormatIcon} from '@/app/(root)/components/FormatIcon';
import type {EnrichedOrderItem} from '@/domain/model/Order';
import {cn} from '@/lib/utils';
import {Check, Printer} from 'lucide-react';

const IMAGE_BASE_URL = 'https://firebasestorage.googleapis.com/v0/b/piolstock.appspot.com/o/images%2F';

type OrderItemRowProps = {
  item: EnrichedOrderItem;
  readonly?: boolean;
};

const StatusBadge = ({item}: {item: EnrichedOrderItem}) => {
  if (item.quantityToPrint === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
        <Check className="h-3 w-3" />
        In stock
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
      <Printer className="h-3 w-3" />
      To print ({item.quantityToPrint})
    </span>
  );
};

const OrderItemRow = ({item}: OrderItemRowProps) => {
  return (
    <div className={cn('flex items-center gap-3 rounded-lg border border-border px-3 py-2', item.quantityToPrint === 0 ? 'bg-muted/30' : 'bg-white')}>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <FormatIcon format={item.format} imageUrl={item.productImage ? `${IMAGE_BASE_URL}${item.productImage}?alt=media` : null} />
        <span className="truncate text-sm font-medium">{item.productName}</span>
        <span className="shrink-0 text-sm text-muted-foreground">x{item.quantity}</span>
      </div>
      <StatusBadge item={item} />
    </div>
  );
};

export {OrderItemRow};
