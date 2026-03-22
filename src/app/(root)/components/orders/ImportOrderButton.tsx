'use client';

import {useAddOrders} from '@/app/(root)/components/hooks/useOrders';
import {useProducts} from '@/app/(root)/components/hooks/useProducts';
import type {Order} from '@/domain/model/Order';
import type {Product} from '@/domain/model/Product';
import {parseOrdersFromCsv} from '@/domain/model/parseOrders';
import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {FileUp, Loader2} from 'lucide-react';
import {useCallback, useRef, useState} from 'react';
import {FormatIcon} from '@/app/(root)/components/FormatIcon';
import Image from 'next/image';

const IMAGE_BASE_URL = 'https://firebasestorage.googleapis.com/v0/b/piolstock.appspot.com/o/images%2F';

const matchProductsToOrders = (orders: Order[], products: Product[]): Order[] => {
  return orders.map(order => ({
    ...order,
    items: order.items.map(item => {
      const product = products.find(p => p.name.toLocaleLowerCase() === item.productName.toLocaleLowerCase());
      if (!product) return item;

      const variant = product.variants.find(v => v.format === item.format);
      if (!variant) return {...item, productId: product.id, productImage: product.image};

      return {
        ...item,
        productId: product.id,
        variantId: variant.id,
        productImage: product.image,
      };
    }),
  }));
};

const ImportOrderButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)} className="gap-1.5">
        <FileUp className="h-4 w-4" />
        Import CSV
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <ImportOrderModal handleClose={() => setIsOpen(false)} />
      </Dialog>
    </>
  );
};

const ImportOrderModal = ({handleClose}: {handleClose: () => void}) => {
  const [parsedOrders, setParsedOrders] = useState<Order[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {data: productsData} = useProducts();
  const addOrders = useAddOrders();

  const products = productsData?.docs.map(doc => doc.data() as Product) ?? [];

  const handleFileChange = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = e => {
        const csv = e.target?.result as string;
        let orders = parseOrdersFromCsv(csv);
        orders = matchProductsToOrders(orders, products);
        setParsedOrders(orders);
      };
      reader.readAsText(file);
    },
    [products]
  );

  const matchedOrders = parsedOrders
    .map(order => ({...order, items: order.items.filter(item => item.productId !== null)}))
    .filter(order => order.items.length > 0);

  const handleImport = useCallback(async () => {
    if (matchedOrders.length === 0) return;

    setIsImporting(true);
    try {
      await addOrders(matchedOrders);
      handleClose();
    } finally {
      setIsImporting(false);
    }
  }, [matchedOrders, addOrders, handleClose]);

  const totalItems = parsedOrders.reduce((sum, o) => sum + o.items.length, 0);
  const matchedItems = matchedOrders.reduce((sum, o) => sum + o.items.length, 0);

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Import Orders from CSV</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-24 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-muted-foreground/50"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileUp className="h-5 w-5" />
            <span className="text-sm">Click to select a Faire CSV file</span>
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={e => {
            const f = e.target.files?.[0];
            if (f) handleFileChange(f);
          }}
        />

        {parsedOrders.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{matchedOrders.length}/{parsedOrders.length} order(s) matched</span>
              <span>{matchedItems}/{totalItems} item(s) matched</span>
            </div>

            <div className="max-h-64 overflow-y-auto rounded-md border border-border">
              {parsedOrders.map(order => (
                <div key={order.id} className="border-b border-border p-3 last:border-b-0">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold">{order.customerName}</span>
                    <span className="text-xs text-muted-foreground">#{order.orderNumber}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {order.items.map(item => {
                      const matched = item.productId !== null;
                      return (
                        <div key={item.id} className={`flex items-center gap-2 text-sm ${matched ? '' : 'opacity-40 line-through'}`}>
                          {item.productImage && (
                            <Image
                              className="shrink-0 rounded border border-border"
                              src={`${IMAGE_BASE_URL}${item.productImage}?alt=media`}
                              alt={item.productName}
                              width={28}
                              height={28}
                            />
                          )}
                          <FormatIcon format={item.format} />
                          <span className="truncate">{item.productName}</span>
                          <span className="ml-auto shrink-0 text-muted-foreground">x{item.quantity}</span>
                          {!matched && (
                            <span className="shrink-0 text-xs text-red-500 no-underline">skipped</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={handleClose} disabled={isImporting}>
          Cancel
        </Button>
        <Button onClick={handleImport} disabled={matchedOrders.length === 0 || isImporting}>
          {isImporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            `Import ${matchedOrders.length} order(s)`
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export {ImportOrderButton, matchProductsToOrders};
