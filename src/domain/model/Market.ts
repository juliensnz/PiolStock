import {Product} from '@/domain/model/Product';

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
  date: string;
  finished: boolean;
  sales: Sale[];
};

const createMarket = (name: string, date: string): Market => ({
  id: crypto.randomUUID(),
  name,
  date,
  finished: false,
  sales: [],
});

const createSale = (items: Item) => ({
  id: crypto.randomUUID(),
  items: [],
});

const createItem = (product: Product, quantity: number = 1) => ({
  id: crypto.randomUUID(),
  product,
  quantity,
});

const addItem = (sale: Sale, item: Item): Sale => ({
  ...sale,
  items: [...sale.items, item],
});

const removeItem = (sale: Sale, itemId: ItemId): Sale => ({
  ...sale,
  items: sale.items.filter(item => item.id !== itemId),
});

export {removeItem, addItem, createMarket, createSale, createItem};
export type {Market, MarketId, Sale};
