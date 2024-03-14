import {Product, ProductId} from '@/domain/model/Product';
import {Either, Error, Result} from '@/domain/model/common/Result';
import {RuntimeError} from '@/domain/model/common/RuntimeError';
import {firebaseApp} from '@/lib/firebase';
import {
  getFirestore,
  doc,
  setDoc,
  Firestore,
  query,
  collection,
  onSnapshot,
  orderBy,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import {v4 as uuidv4} from 'uuid';

const db = getFirestore(firebaseApp);

const productRepositoryCreator = ({db}: {db: Firestore}) => ({
  addProducts: async (product: Omit<Product, 'id'>[]): Promise<Either<Product[], RuntimeError>> => {
    try {
      const productResults = await Promise.all(
        product.map(async (product): Promise<Either<Product, RuntimeError>> => {
          const id = uuidv4();
          const productToCreate = {...product, id};

          await setDoc(doc(db, 'products', id), productToCreate);

          return Result.Ok(productToCreate);
        })
      );

      if (!Result.isAllOk(productResults)) {
        return Result.Error({
          type: 'product_repository.add_products',
          message: 'Error adding products',
          payload: {
            errors: productResults
              .filter(result => result.isError())
              .map(result => (result as Error<Product, RuntimeError>).getError()),
          },
        });
      }

      return Result.allOk(productResults);
    } catch (error) {
      return Result.Error({
        type: 'product_repository.add_product',
        message: 'Error adding product',
        payload: {product, error},
      });
    }
  },
  updateStock: async (productId: ProductId, stock: number): Promise<Either<void, RuntimeError>> => {
    try {
      await updateDoc(doc(db, 'products', productId), {stock});

      return Result.Ok();
    } catch (error) {
      return Result.Error({
        type: 'product_repository.update_stock',
        message: 'Error updating stock',
        payload: {productId, stock, error},
      });
    }
  },
  deleteProduct: async (productId: ProductId) => {
    try {
      await deleteDoc(doc(db, 'products', productId));

      return Result.Ok();
    } catch (error) {
      return Result.Error({
        type: 'product_repository.delete_product',
        message: 'Error deleteing product',
        payload: {productId, error},
      });
    }
  },
  getRef: () => {
    try {
      const q = query(collection(db, 'products'), orderBy('format', 'asc'));

      return Result.Ok(q);
    } catch (error) {
      return Result.Error({
        type: 'product_repository.get_query',
        message: 'Error query products',
        payload: {error},
      });
    }
  },
  streamProducts: (updateProducts: (products: Product[]) => void) => {
    try {
      const q = query(collection(db, 'products'), orderBy('format', 'asc'));
      const unsubscribe = onSnapshot(q, querySnapshot => {
        const products: Product[] = [];
        querySnapshot.forEach(doc => {
          products.push(doc.data() as Product);
        });

        updateProducts(products);
      });

      return Result.Ok(unsubscribe);
    } catch (error) {
      return Result.Error({
        type: 'product_repository.stream_products',
        message: 'Error streaming products',
        payload: {error},
      });
    }
  },
});

const productRepository = productRepositoryCreator({db});

export {productRepository};
