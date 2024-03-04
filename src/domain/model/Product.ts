const FORMATS_A2 = 'A2';
const FORMATS_A3 = 'A3';
const FORMATS_A4 = 'A4';
const FORMATS_A5 = 'A5';
const FORMATS_A6 = 'A6';
const UNISIZE = 'UNISIZE';

const FORMATS = [FORMATS_A2, FORMATS_A3, FORMATS_A4, FORMATS_A5, FORMATS_A6] as const;
type Format = typeof FORMATS[number] | typeof UNISIZE;

type ProductId = string;
type Product = {id: ProductId; format: Format; name: string; image: string; stock: number};

const createProducts = (name: string, image: string): Product[] =>
  FORMATS.map(format => createProduct(name, image, format));

const createProduct = (name: string, image: string, format: Format): Product => ({
  id: crypto.randomUUID(),
  format,
  name,
  image,
  stock: 0,
});

export type {Product, ProductId, Format};
export {createProducts, createProduct};
