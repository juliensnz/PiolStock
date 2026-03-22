'use client';

import {AddProductButton} from '@/app/(root)/components/AddProductButton';
import {EditProductButton} from '@/app/(root)/components/EditProductButton';
import {FormatIcon} from '@/app/(root)/components/FormatIcon';
import {Stock} from '@/app/(root)/components/Stock';
import {useProducts, useUpdateStock} from '@/app/(root)/components/hooks/useProducts';
import {useReservedStock} from '@/app/(root)/components/hooks/useOrders';
import {Product, sortVariantsBySize} from '@/domain/model/Product';
import {Input} from '@/components/ui/input';
import {Loader2, Search} from 'lucide-react';
import Image from 'next/image';
import {useCallback, useMemo, useRef, useState} from 'react';

export default function Home() {
  const {data} = useProducts();
  const updateStock = useUpdateStock();
  const reservedStock = useReservedStock();
  const [search, setSearch] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const focusSearch = useCallback(() => {
    searchRef.current?.focus();
    searchRef.current?.select();
  }, []);

  const updateVariantStock = useCallback(
    (productId: string, variantId: string) => (stock: number) => {
      updateStock(productId, variantId, stock);
      focusSearch();
    },
    [updateStock, focusSearch]
  );

  const products = useMemo(() => data?.docs.map(doc => doc.data() as Product), [data]);
  const filteredProducts = useMemo(
    () => products?.filter(product => product.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [],
    [products, search]
  );

  const variantCount = useMemo(
    () => filteredProducts.reduce((sum, product) => sum + product.variants.length, 0),
    [filteredProducts]
  );

  const handleAddProduct = useCallback(
    (productName: string) => {
      setSearch(productName);
    },
    [setSearch]
  );

  if (undefined === products) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-2.5 flex-1 bg-white">
      <div className="sticky top-0 z-10 mb-6 flex flex-col gap-4 bg-white pt-5 pb-2">
        <div className="flex w-full">
          <h1 className="text-2xl font-bold text-primary">Product stock</h1>
          <div className="flex-1" />
          <AddProductButton onAddProduct={handleAddProduct} />
        </div>
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input ref={searchRef} placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-24" />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {variantCount} results
          </span>
        </div>
      </div>
      <div className="grid gap-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="flex gap-5 rounded-xl border border-border bg-white p-4 shadow-sm">
            <Image
              className="shrink-0 self-start rounded-lg border border-border shadow-sm"
              src={`https://firebasestorage.googleapis.com/v0/b/piolstock.appspot.com/o/images%2F${product.image}?alt=media`}
              alt={product.name}
              width={100}
              height={100}
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <EditProductButton product={product} />
              </div>
              <div className="flex flex-col gap-2">
                {sortVariantsBySize(product.variants).map(variant => {
                  const reserved = reservedStock.get(variant.id) ?? 0;
                  return (
                    <div key={variant.id} className="flex items-center justify-end gap-3">
                      {reserved > 0 && (
                        <span className="inline-flex items-center whitespace-nowrap rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                          {reserved} reserved
                        </span>
                      )}
                      <FormatIcon format={variant.format} />
                      <Stock value={variant.stock} onChange={updateVariantStock(product.id, variant.id)} increment={4} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
