const FORMAT = {
  A2: 'A2',
  A3: 'A3',
  A4: 'A4',
  A5: 'A5',
  A6: 'A6',
  UNISIZE: 'UNISIZE',
} as const;

type Format = (typeof FORMAT)[keyof typeof FORMAT];

type VariantId = string;
type ProductVariant = {id: VariantId; format: Format; stock: number};

type ProductId = string;
type Product = {id: ProductId; name: string; image: string; variants: ProductVariant[]};

const createVariant = (format: Format): ProductVariant => ({
  id: crypto.randomUUID(),
  format,
  stock: 0,
});

const createProduct = (name: string, image: string, format: Format): Product => ({
  id: crypto.randomUUID(),
  name,
  image,
  variants: [createVariant(format)],
});

const createProductWithAllFormats = (name: string, image: string): Product => ({
  id: crypto.randomUUID(),
  name,
  image,
  variants: Object.values(FORMAT).map(createVariant),
});

const FORMAT_SIZE_ORDER: Record<Format, number> = {
  A2: 0,
  A3: 1,
  A4: 2,
  A5: 3,
  A6: 4,
  UNISIZE: 5,
};

const sortVariantsBySize = (variants: ProductVariant[]): ProductVariant[] =>
  [...variants].sort((a, b) => FORMAT_SIZE_ORDER[a.format] - FORMAT_SIZE_ORDER[b.format]);

export type {Product, ProductId, ProductVariant, VariantId, Format};
export {FORMAT, createVariant, createProduct, createProductWithAllFormats, sortVariantsBySize};
