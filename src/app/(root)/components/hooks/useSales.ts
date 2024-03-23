import {Sale, SaleId} from '@/domain/model/Sale';
import {saleRepository} from '@/infrastructure/SaleRepository';
import {useFirestoreQuery} from '@/lib/useFirestoreQuery/useFirestoreQuery';
import {useCallback} from 'react';

const useSales = () => {
  const ref = saleRepository.getRef();

  if (ref.isError()) throw ref.getError();

  const query = useFirestoreQuery(['products'], ref.get(), {subscribe: true});

  return query;
};

const useAddSales = () => {
  return useCallback(async (products: Omit<Sale, 'id'>[]): Promise<Sale[]> => {
    const result = await saleRepository.addSales(products);

    if (result.isError()) throw result.getError();

    return result.get();
  }, []);
};
const useUpdateStock = () => {
  return useCallback(async (productId: SaleId, stock: number): Promise<void> => {
    const result = await saleRepository.updateStock(productId, stock);

    if (result.isError()) throw result.getError();

    return;
  }, []);
};

export {useSales, useUpdateStock, useAddSales};
