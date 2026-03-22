const FORMAT = {
  A2: 'A2',
  A3: 'A3',
  A4: 'A4',
  A5: 'A5',
  A6: 'A6',
  UNISIZE: 'UNISIZE',
} as const;

type Format = (typeof FORMAT)[keyof typeof FORMAT];

type ProductId = string;
type Product = {id: ProductId; format: Format; name: string; image: string; stock: number};

const createProducts = (name: string, image: string): Product[] =>
  Object.values(FORMAT).map(format => createProduct(name, image, format));

const createProduct = (name: string, image: string, format: Format): Product => ({
  id: crypto.randomUUID(),
  format,
  name,
  image,
  stock: 0,
});

export type {Product, ProductId, Format};
export {createProducts, createProduct};
