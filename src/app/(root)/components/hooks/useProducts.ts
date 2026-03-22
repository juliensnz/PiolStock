import {Product, ProductId, VariantId} from '@/domain/model/Product';
import {productRepository} from '@/infrastructure/ProductRepository';
import {useFirestoreQuery} from '@/lib/useFirestoreQuery/useFirestoreQuery';
import {useCallback} from 'react';
import {toast} from 'sonner';

type StockUndoMeta = {
  previousStock: number;
  productName: string;
  format: string;
};

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

    const created = result.get();

    toast(`Product "${created.name}" created`, {
      action: {
        label: 'Undo',
        onClick: () => {
          productRepository.deleteProduct(created.id);
        },
      },
    });

    return created;
  }, []);
};

const useUpdateStock = () => {
  return useCallback(async (productId: ProductId, variantId: VariantId, stock: number, undoMeta?: StockUndoMeta): Promise<void> => {
    const result = await productRepository.updateStock(productId, variantId, stock);

    if (result.isError()) throw result.getError();

    if (undoMeta) {
      toast(`${undoMeta.productName} (${undoMeta.format}): ${undoMeta.previousStock} → ${stock}`, {
        id: 'stock-update',
        action: {
          label: 'Undo',
          onClick: () => {
            productRepository.updateStock(productId, variantId, undoMeta.previousStock);
          },
        },
      });
    }
  }, []);
};

const useUpdateProduct = () => {
  return useCallback(async (product: Product, previousProduct?: Product): Promise<void> => {
    const result = await productRepository.updateProduct(product);

    if (result.isError()) throw result.getError();

    if (previousProduct) {
      toast(`Product "${product.name}" updated`, {
        action: {
          label: 'Undo',
          onClick: () => {
            productRepository.updateProduct(previousProduct);
          },
        },
      });
    }
  }, []);
};

export {useProducts, useUpdateStock, useAddProduct, useUpdateProduct};
export type {StockUndoMeta};
