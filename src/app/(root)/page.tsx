'use client';

import {AddProductButton} from '@/app/(root)/components/AddProductButton';
import {FormatIcon} from '@/app/(root)/components/FormatIcon';
import {Stock} from '@/app/(root)/components/Stock';
import {useProducts, useUpdateStock} from '@/app/(root)/components/hooks/useProducts';
import {Product, sortVariantsBySize} from '@/domain/model/Product';
import {Input} from '@/components/ui/input';
import {Search} from 'lucide-react';
import Image from 'next/image';
import {useCallback, useMemo, useState} from 'react';

export default function Home() {
  const {data} = useProducts();
  const updateStock = useUpdateStock();
  const [search, setSearch] = useState('');

  const updateVariantStock = useCallback(
    (productId: string, variantId: string) => (stock: number) => updateStock(productId, variantId, stock),
    [updateStock]
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
    return null;
  }

  return (
    <div className="m-2.5 flex-1 bg-white">
      <div className="sticky top-0 z-10 mb-8 flex flex-col justify-between bg-white pt-5">
        <div className="flex w-full">
          <h1 className="text-2xl font-bold text-primary">Product stock</h1>
          <div className="flex-1" />
          <AddProductButton onAddProduct={handleAddProduct} />
        </div>
      </div>
      <div className="relative mb-6 w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-24" />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          {variantCount} results
        </span>
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
              <h2 className="mb-3 text-lg font-semibold">{product.name}</h2>
              <div className="flex flex-col gap-2">
                {sortVariantsBySize(product.variants).map(variant => (
                  <div key={variant.id} className="flex items-center justify-end gap-3">
                    <FormatIcon format={variant.format} />
                    <Stock value={variant.stock} onChange={updateVariantStock(product.id, variant.id)} increment={4} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
