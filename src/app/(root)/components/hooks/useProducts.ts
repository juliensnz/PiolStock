import {Product} from '@/domain/model/Product';
import {productRepository} from '@/infrastructure/ProductRepository';
import {useFirestoreQuery} from '@/lib/useFirestoreQuery/useFirestoreQuery';
import {useCallback} from 'react';

const useProducts = () => {
  const ref = productRepository.getRef();

  if (ref.isError()) throw ref.getError();

  const query = useFirestoreQuery(['products'], ref.get(), {subscribe: true});

  return query;
};

const useAddProduct = () => {
  return useCallback(async (product: Omit<Product, 'id'>): Promise<Product> => {
    const result = await productRepository.addProduct(product);

    if (result.isError()) throw result.getError();

    return result.get();
  }, []);
};

export {useProducts, useAddProduct};
