import {Market, MarketId, Sale} from '@/domain/model/Market';
import {Either, Result} from '@/domain/model/common/Result';
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
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

const db = getFirestore(firebaseApp);

const marketRepositoryCreator = ({db}: {db: Firestore}) => ({
  createMarket: async (market: Market): Promise<Either<void, RuntimeError>> => {
    try {
      await setDoc(doc(db, 'markets', market.id), market);

      return Result.Ok();
    } catch (error) {
      return Result.Error({
        type: 'market_repository.add_market',
        message: 'Error adding market',
        payload: {market, error},
      });
    }
  },
  addSale: async (marketId: MarketId, sale: Sale): Promise<Either<void, RuntimeError>> => {
    try {
      await setDoc(doc(db, 'markets', marketId), {sales: arrayUnion(sale)}, {merge: true});

      return Result.Ok();
    } catch (error) {
      return Result.Error({
        type: 'market_repository.add_sale',
        message: 'Error adding sale',
        payload: {marketId, sale, error},
      });
    }
  },
  removeSale: async (marketId: MarketId, sale: Sale): Promise<Either<void, RuntimeError>> => {
    try {
      await setDoc(doc(db, 'markets', marketId), {sales: arrayRemove(sale)}, {merge: true});

      return Result.Ok();
    } catch (error) {
      return Result.Error({
        type: 'market_repository.remove_sale',
        message: 'Error removing sale',
        payload: {marketId, sale, error},
      });
    }
  },
  finishMarket: async (marketId: MarketId): Promise<Either<void, RuntimeError>> => {
    try {
      await setDoc(doc(db, 'markets', marketId), {finished: true}, {merge: true});

      return Result.Ok();
    } catch (error) {
      return Result.Error({
        type: 'market_repository.finish_market',
        message: 'Error finishing market',
        payload: {marketId, error},
      });
    }
  },
  deleteMarket: async (marketId: MarketId) => {
    try {
      await deleteDoc(doc(db, 'markets', marketId));

      return Result.Ok();
    } catch (error) {
      return Result.Error({
        type: 'market_repository.delete_market',
        message: 'Error deleteing market',
        payload: {marketId, error},
      });
    }
  },
  getRef: () => {
    try {
      const q = query(collection(db, 'markets'), orderBy('date', 'desc'));

      return Result.Ok(q);
    } catch (error) {
      return Result.Error({
        type: 'market_repository.get_query',
        message: 'Error query markets',
        payload: {error},
      });
    }
  },
  streamMarkets: (updateMarkets: (markets: Market[]) => void) => {
    try {
      const q = query(collection(db, 'markets'), orderBy('date', 'desc'));
      const unsubscribe = onSnapshot(q, querySnapshot => {
        const markets: Market[] = [];
        querySnapshot.forEach(doc => {
          markets.push(doc.data() as Market);
        });

        updateMarkets(markets);
      });

      return Result.Ok(unsubscribe);
    } catch (error) {
      return Result.Error({
        type: 'market_repository.stream_markets',
        message: 'Error streaming markets',
        payload: {error},
      });
    }
  },
});

const marketRepository = marketRepositoryCreator({db});

export {marketRepository};
