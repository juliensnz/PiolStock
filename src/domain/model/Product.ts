import {UUID} from 'crypto';

const FORMATS_A2 = 'A2';
const FORMATS_A3 = 'A3';
const FORMATS_A4 = 'A4';
const FORMATS_A5 = 'A5';
const FORMATS_A6 = 'A6';

const FORMATS = [FORMATS_A2, FORMATS_A3, FORMATS_A4, FORMATS_A5, FORMATS_A6] as const;
type Format = typeof FORMATS[number];

type ProductId = UUID;
type Product = {id: ProductId; format: Format};

export type {Product, ProductId, Format};
