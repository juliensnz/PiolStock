import {Product, ProductId, VariantId} from '@/domain/model/Product';
import {Either, Result} from '@/domain/model/common/Result';
import {RuntimeError} from '@/domain/model/common/RuntimeError';
import {firebaseApp} from '@/lib/firebase';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  Firestore,
  query,
  collection,
  onSnapshot,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';
import {v4 as uuidv4} from 'uuid';

const PRODUCTS_COLLECTION = 'products_with_variants';

const db = getFirestore(firebaseApp);

const productRepositoryCreator = ({db}: {db: Firestore}) => ({
  addProduct: async (product: Omit<Product, 'id'>): Promise<Either<Product, RuntimeError>> => {
    try {
      const id = uuidv4();
      const productToCreate = {...product, id};

      await setDoc(doc(db, PRODUCTS_COLLECTION, id), productToCreate);

      return Result.Ok(productToCreate);
    } catch (error) {
      return Result.Error({
        type: 'product_repository.add_product',
        message: 'Error adding product',
        payload: {product, error},
      });
    }
  },
  updateStock: async (
    productId: ProductId,
    variantId: VariantId,
    stock: number
  ): Promise<Either<void, RuntimeError>> => {
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      const snapshot = await getDoc(productRef);

      if (!snapshot.exists()) {
        return Result.Error({
          type: 'product_repository.update_stock',
          message: 'Product not found',
          payload: {productId, variantId, stock},
        });
      }

      const product = snapshot.data() as Product;
      const updatedVariants = product.variants.map(variant =>
        variant.id === variantId ? {...variant, stock} : variant
      );

      await setDoc(productRef, {...product, variants: updatedVariants});

      return Result.Ok();
    } catch (error) {
      return Result.Error({
        type: 'product_repository.update_stock',
        message: 'Error updating stock',
        payload: {productId, variantId, stock, error},
      });
    }
  },
  deleteProduct: async (productId: ProductId) => {
    try {
      await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));

      return Result.Ok();
    } catch (error) {
      return Result.Error({
        type: 'product_repository.delete_product',
        message: 'Error deleting product',
        payload: {productId, error},
      });
    }
  },
  getRef: () => {
    try {
      const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('name', 'asc'));

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
      const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('name', 'asc'));
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
