import {Market, MarketId, Sale} from '@/domain/model/Market';
import {marketRepository} from '@/infrastructure/MarketRepository';
import {useFirestoreQuery} from '@/lib/useFirestoreQuery/useFirestoreQuery';
import {useCallback, useMemo} from 'react';

const useMarkets = () => {
  const ref = marketRepository.getRef();

  if (ref.isError()) throw ref.getError();

  const query = useFirestoreQuery(['markets'], ref.get(), {subscribe: true});

  return query;
};

const useMarketUpdater = () => {
  const marketUpdater = useMemo(
    () => ({
      createMarket: async (market: Market): Promise<void> => {
        const result = await marketRepository.createMarket(market);
        if (result.isError()) throw result.getError();

        return result.get();
      },
      addSale: async (marketId: MarketId, sale: Sale): Promise<void> => {
        const result = await marketRepository.addSale(marketId, sale);
        if (result.isError()) throw result.getError();
        return result.get();
      },
      removeSale: async (marketId: MarketId, sale: Sale): Promise<void> => {
        const result = await marketRepository.removeSale(marketId, sale);
        if (result.isError()) throw result.getError();
        return result.get();
      },
      finishMarket: async (marketId: MarketId): Promise<void> => {
        const result = await marketRepository.finishMarket(marketId);
        if (result.isError()) throw result.getError();
        return result.get();
      },
      deleteMarket: async (marketId: MarketId): Promise<void> => {
        const result = await marketRepository.deleteMarket(marketId);
        if (result.isError()) throw result.getError();
        return result.get();
      },
    }),
    []
  );

  return marketUpdater;
};

export {useMarkets, useMarketUpdater};
