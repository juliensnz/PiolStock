import {Product, ProductId} from '@/domain/model/Product';
import {Either, Result} from '@/domain/model/Result';
import {RuntimeError} from '@/domain/model/RuntimeError';
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
} from 'firebase/firestore';
import {v4 as uuidv4} from 'uuid';

const db = getFirestore(firebaseApp);

const productRepositoryCreator = ({db}: {db: Firestore}) => ({
  addProduct: async (product: Omit<Product, 'id'>): Promise<Either<Product, RuntimeError>> => {
    try {
      const id = uuidv4();
      const newProduct = {...product, id};
      await setDoc(doc(db, 'products', id), newProduct);

      return Result.Ok(newProduct as Product);
    } catch (error) {
      return Result.Error({
        type: 'product_repository.add_product',
        message: 'Error adding product',
        payload: {product, error},
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
