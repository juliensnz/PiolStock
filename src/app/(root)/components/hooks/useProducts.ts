import {Product, ProductId} from '@/domain/model/Product';
import {productRepository} from '@/infrastructure/ProductRepository';
import {useFirestoreQuery} from '@/lib/useFirestoreQuery/useFirestoreQuery';
import {useCallback} from 'react';

const useProducts = () => {
  const ref = productRepository.getRef();

  if (ref.isError()) throw ref.getError();

  const query = useFirestoreQuery(['products'], ref.get(), {subscribe: true});

  return query;
};

const useAddProducts = () => {
  return useCallback(async (products: Omit<Product, 'id'>[]): Promise<Product[]> => {
    const result = await productRepository.addProducts(products);

    if (result.isError()) throw result.getError();

    return result.get();
  }, []);
};
const useUpdateStock = () => {
  return useCallback(async (productId: ProductId, stock: number): Promise<void> => {
    const result = await productRepository.updateStock(productId, stock);

    if (result.isError()) throw result.getError();

    return;
  }, []);
};

export {useProducts, useUpdateStock, useAddProducts};
