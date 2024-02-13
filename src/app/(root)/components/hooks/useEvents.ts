import {Format, Product} from '@/domain/model/Product';
import {productRepository} from '@/infrastructure/ProductRepository';
import {useFirestoreQuery} from '@/lib/useFirestoreQuery/useFirestoreQuery';
import {useCallback} from 'react';

const useProducts = (formats: Format[]) => {
  const ref = productRepository.getRef(formats);

  if (ref.isError()) throw ref.getError();

  const query = useFirestoreQuery(['prodcuts', ...formats], ref.get(), {subscribe: true});

  return query;
};

const useAddProduct = () => {
  return useCallback(async (prodcut: Omit<Product, 'id'>): Promise<Product> => {
    const result = await productRepository.addProduct(prodcut);

    if (result.isError()) throw result.getError();

    return result.get();
  }, []);
};

export {useProducts, useAddProduct};
