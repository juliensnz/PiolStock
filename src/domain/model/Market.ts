import {Product} from '@/domain/model/Product';
import {createDate} from '@/domain/model/common/date';

type ItemId = string;
type Item = {
  id: ItemId;
  product: Product;
};

type SaleId = string;
type Sale = {
  id: SaleId;
  items: Item[];
};

type MarketId = string;
type Market = {
  id: MarketId;
  name: string;
  date: number;
  finished: boolean;
  sales: Sale[];
};

const createMarket = (name: string, date: number): Market => ({
  id: crypto.randomUUID(),
  name,
  date,
  finished: false,
  sales: [],
});

const createSale = () => ({
  id: crypto.randomUUID(),
  date: new Date().getTime(),
  items: [],
});

const createItem = (product: Product) => ({
  id: crypto.randomUUID(),
  product,
});

const addItem = (sale: Sale, product: Product): Sale => ({
  ...sale,
  items: [...sale.items, createItem(product)],
});

const removeItem = (sale: Sale, product: Product): Sale => {
  const itemToRemove = sale.items.find(item => item.product.id === product.id);
  if (undefined === itemToRemove) return sale;

  return {
    ...sale,
    items: sale.items.toSpliced(sale.items.indexOf(itemToRemove), 1),
  };
};

export {removeItem, addItem, createMarket, createSale, createItem};
export type {Market, MarketId, Sale};
