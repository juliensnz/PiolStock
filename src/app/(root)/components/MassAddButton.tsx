'use client';

import {useProducts, useUpdateStock} from '@/app/(root)/components/hooks/useProducts';
import {Product, sortVariantsBySize} from '@/domain/model/Product';
import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {FormatIcon} from '@/app/(root)/components/FormatIcon';
import {productRepository} from '@/infrastructure/ProductRepository';
import {Loader2, PackagePlus, Search} from 'lucide-react';
import Image from 'next/image';
import {useCallback, useMemo, useState} from 'react';
import {toast} from 'sonner';
import {cn} from '@/lib/utils';

const IMAGE_BASE_URL = 'https://firebasestorage.googleapis.com/v0/b/piolstock.appspot.com/o/images%2F';

type Deltas = Record<string, Record<string, number>>;

const MassAddButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <PackagePlus className="h-4 w-4" />
        Mass Add
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {isOpen && <MassAddModal handleClose={() => setIsOpen(false)} />}
      </Dialog>
    </>
  );
};

const MassAddModal = ({handleClose}: {handleClose: () => void}) => {
  const {data} = useProducts();
  const updateStock = useUpdateStock();
  const [search, setSearch] = useState('');
  const [deltas, setDeltas] = useState<Deltas>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const products = useMemo(() => data?.docs.map(doc => doc.data() as Product) ?? [], [data]);

  const filteredProducts = useMemo(
    () => products.filter(p => p.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())),
    [products, search]
  );

  const getDelta = useCallback(
    (productId: string, variantId: string) => deltas[productId]?.[variantId] ?? 0,
    [deltas]
  );

  const increment = useCallback((productId: string, variantId: string) => {
    setDeltas(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [variantId]: (prev[productId]?.[variantId] ?? 0) + 1,
      },
    }));
  }, []);

  const decrement = useCallback((productId: string, variantId: string) => {
    setDeltas(prev => {
      const current = prev[productId]?.[variantId] ?? 0;
      if (current <= 0) return prev;
      const newDelta = current - 1;
      const productDeltas = {...prev[productId], [variantId]: newDelta};
      if (newDelta === 0) delete productDeltas[variantId];
      const next = {...prev, [productId]: productDeltas};
      if (Object.keys(next[productId]).length === 0) delete next[productId];
      return next;
    });
  }, []);

  const changedProducts = useMemo(() => {
    return products
      .filter(p => deltas[p.id] && Object.keys(deltas[p.id]).length > 0)
      .map(p => ({
        product: p,
        changes: sortVariantsBySize(
          p.variants.filter(v => (deltas[p.id]?.[v.id] ?? 0) > 0)
        ).map(v => ({variant: v, delta: deltas[p.id][v.id]})),
      }));
  }, [products, deltas]);

  const totalChanges = useMemo(
    () => changedProducts.reduce((sum, {changes}) => sum + changes.reduce((s, c) => s + c.delta, 0), 0),
    [changedProducts]
  );

  const handleConfirm = useCallback(async () => {
    if (changedProducts.length === 0) return;
    setIsSubmitting(true);
    try {
      const updates = changedProducts.flatMap(({product, changes}) =>
        changes.map(({variant, delta}) => ({
          productId: product.id,
          variantId: variant.id,
          previousStock: variant.stock,
          newStock: variant.stock + delta,
        }))
      );
      await Promise.all(
        updates.map(({productId, variantId, newStock}) => updateStock(productId, variantId, newStock))
      );

      toast(`Added stock to ${changedProducts.length} product(s) (+${totalChanges})`, {
        action: {
          label: 'Undo',
          onClick: () => {
            Promise.all(
              updates.map(({productId, variantId, previousStock}) =>
                productRepository.updateStock(productId, variantId, previousStock)
              )
            );
          },
        },
      });

      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  }, [changedProducts, totalChanges, updateStock, handleClose]);

  return (
    <DialogContent className="flex h-[90vh] flex-col sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>Mass Add Stock</DialogTitle>
      </DialogHeader>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="-mx-6 flex-1 overflow-y-auto px-6">
        <div className="flex flex-col gap-2">
          {filteredProducts.map(product => {
            const hasChanges = deltas[product.id] && Object.keys(deltas[product.id]).length > 0;
            return (
              <div
                key={product.id}
                className={cn(
                  'flex items-center gap-3 rounded-lg border p-3 transition-colors',
                  hasChanges ? 'border-primary/30 bg-primary/5' : 'border-border'
                )}
              >
                <Image
                  className="shrink-0 rounded-md border border-border"
                  src={`${IMAGE_BASE_URL}${product.image}?alt=media`}
                  alt={product.name}
                  width={48}
                  height={48}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{product.name}</p>
                  <div className="mt-1.5 flex gap-2">
                    {sortVariantsBySize(product.variants).map(variant => {
                      const delta = getDelta(product.id, variant.id);
                      return (
                        <div key={variant.id} className="relative">
                          <button
                            type="button"
                            onClick={() => increment(product.id, variant.id)}
                            className={cn(
                              'rounded-lg border p-1.5 transition-colors',
                              delta > 0
                                ? 'border-primary/30 bg-primary/5'
                                : 'border-transparent hover:bg-muted/50'
                            )}
                          >
                            <FormatIcon format={variant.format} />
                            {delta > 0 && (
                              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold leading-none text-primary-foreground">
                                +{delta}
                              </span>
                            )}
                          </button>
                          {delta > 0 && (
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                decrement(product.id, variant.id);
                              }}
                              className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold leading-none text-white transition-colors hover:bg-red-600"
                            >
                              -
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {changedProducts.length > 0 && (
        <div className="border-t pt-3">
          <p className="mb-2 text-sm font-medium">
            Summary ({totalChanges} item{totalChanges !== 1 ? 's' : ''})
          </p>
          <div className="flex flex-wrap gap-2">
            {changedProducts.flatMap(({product, changes}) =>
              changes.map(({variant, delta}) => (
                <div key={variant.id} className="relative">
                  <FormatIcon
                    format={variant.format}
                    imageUrl={`${IMAGE_BASE_URL}${product.image}?alt=media`}
                    showLabel={false}
                  />
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground">
                    +{delta}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <DialogFooter>
        <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} disabled={changedProducts.length === 0 || isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            `Confirm${totalChanges > 0 ? ` (${totalChanges})` : ''}`
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export {MassAddButton};
