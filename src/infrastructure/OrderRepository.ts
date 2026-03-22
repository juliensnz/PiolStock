import {Order, OrderId} from '@/domain/model/Order';
import {Either, Result} from '@/domain/model/common/Result';
import {RuntimeError} from '@/domain/model/common/RuntimeError';
import {firebaseApp} from '@/lib/firebase';
import {getFirestore, doc, setDoc, Firestore, query, collection, orderBy, deleteDoc} from 'firebase/firestore';
import {v4 as uuidv4} from 'uuid';

const ORDERS_COLLECTION = 'orders';

const db = getFirestore(firebaseApp);

const orderRepositoryCreator = ({db}: {db: Firestore}) => ({
  addOrder: async (order: Omit<Order, 'id'>): Promise<Either<Order, RuntimeError>> => {
    try {
      const id = uuidv4();
      const orderToCreate = {...order, id};

      await setDoc(doc(db, ORDERS_COLLECTION, id), orderToCreate);

      return Result.Ok(orderToCreate);
    } catch (error) {
      return Result.Error({
        type: 'order_repository.add_order',
        message: 'Error adding order',
        payload: {order, error},
      });
    }
  },

  addOrders: async (orders: Order[]): Promise<Either<Order[], RuntimeError>> => {
    try {
      await Promise.all(orders.map(order => setDoc(doc(db, ORDERS_COLLECTION, order.id), order)));

      return Result.Ok(orders);
    } catch (error) {
      return Result.Error({
        type: 'order_repository.add_orders',
        message: 'Error adding orders',
        payload: {error},
      });
    }
  },

  updateOrder: async (order: Order): Promise<Either<void, RuntimeError>> => {
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, order.id);
      await setDoc(orderRef, order);
      return Result.Ok();
    } catch (error) {
      return Result.Error({
        type: 'order_repository.update_order',
        message: 'Error updating order',
        payload: {order, error},
      });
    }
  },

  deleteOrder: async (orderId: OrderId): Promise<Either<void, RuntimeError>> => {
    try {
      await deleteDoc(doc(db, ORDERS_COLLECTION, orderId));
      return Result.Ok();
    } catch (error) {
      return Result.Error({
        type: 'order_repository.delete_order',
        message: 'Error deleting order',
        payload: {orderId, error},
      });
    }
  },

  getRef: () => {
    try {
      const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
      return Result.Ok(q);
    } catch (error) {
      return Result.Error({
        type: 'order_repository.get_query',
        message: 'Error querying orders',
        payload: {error},
      });
    }
  },
});

const orderRepository = orderRepositoryCreator({db});

export {orderRepository};
