'use client';

import {AddProductButton} from '@/app/(root)/components/AddProductButton';
import {Stock} from '@/app/(root)/components/Stock';
import {useProducts, useUpdateStock} from '@/app/(root)/components/hooks/useProducts';
import {Product} from '@/domain/model/Product';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Input} from '@/components/ui/input';
import {Search} from 'lucide-react';
import Image from 'next/image';
import {useCallback, useMemo, useState} from 'react';

export default function Home() {
  const {data} = useProducts();
  const updateStock = useUpdateStock();
  const [search, setSearch] = useState('');

  const updateProductStock = useCallback(
    (productId: string) => (stock: number) => updateStock(productId, stock),
    [updateStock]
  );

  const products = useMemo(() => data?.docs.map(doc => doc.data() as Product), [data]);
  const filteredProducts = useMemo(
    () => products?.filter(product => product.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [],
    [products, search]
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
      <div className="relative mb-4 w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-24" />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          {filteredProducts.length} results
        </span>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Illustration</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Format</TableHead>
            <TableHead className="text-right">Stock</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map(product => {
            return (
              <TableRow key={product.id}>
                <TableCell className="w-[150px]">
                  <Image
                    src={`https://firebasestorage.googleapis.com/v0/b/piolstock.appspot.com/o/images%2F${product.image}?alt=media`}
                    alt="Illustration image"
                    width={100}
                    height={100}
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.format}</TableCell>
                <TableCell className="text-right">
                  <Stock value={product.stock} onChange={updateProductStock(product.id)} increment={4} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
