import {FORMAT, type Format} from './Product';
import {createOrder, createOrderItem, type Order, type OrderItem, type ShippingAddress} from './Order';

type FaireCsvRow = {
  orderDate: string;
  orderNumber: string;
  customerName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  productName: string;
  optionName: string;
  quantity: number;
};

const FORMAT_PATTERN = /\(A[2-6]\)/;

const parseFormatFromOption = (optionName: string): Format | null => {
  const match = optionName.match(FORMAT_PATTERN);
  if (!match) return null;
  const format = match[0].slice(1, -1) as Format;
  return Object.values(FORMAT).includes(format) ? format : null;
};

const parseCsvLine = (line: string): string[] => {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        fields.push(current);
        current = '';
      } else {
        current += char;
      }
    }
  }
  fields.push(current);
  return fields;
};

const parseFaireCsv = (csvContent: string): FaireCsvRow[] => {
  const lines = csvContent.split('\n').filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  return lines.slice(1).map(line => {
    const fields = parseCsvLine(line);
    return {
      orderDate: fields[0] ?? '',
      orderNumber: fields[1] ?? '',
      customerName: fields[3] ?? '',
      address1: fields[4] ?? '',
      address2: fields[5] ?? '',
      city: fields[6] ?? '',
      state: fields[7] ?? '',
      postalCode: fields[8] ?? '',
      country: fields[9] ?? '',
      productName: fields[10] ?? '',
      optionName: fields[11] ?? '',
      quantity: parseInt(fields[15] ?? '1', 10) || 1,
    };
  });
};

const groupRowsIntoOrders = (rows: FaireCsvRow[]): Order[] => {
  const grouped = new Map<string, FaireCsvRow[]>();

  for (const row of rows) {
    const existing = grouped.get(row.orderNumber) ?? [];
    existing.push(row);
    grouped.set(row.orderNumber, existing);
  }

  return Array.from(grouped.entries()).map(([, orderRows]) => {
    const first = orderRows[0];
    const address: ShippingAddress = {
      address1: first.address1,
      ...(first.address2 ? {address2: first.address2} : {}),
      city: first.city,
      ...(first.state ? {state: first.state} : {}),
      postalCode: first.postalCode,
      country: first.country,
    };

    const items: OrderItem[] = orderRows.map(row => {
      const format = parseFormatFromOption(row.optionName) ?? 'A4';
      return createOrderItem(row.productName, format, row.quantity);
    });

    return createOrder(first.orderNumber, first.orderDate, first.customerName, address, items);
  });
};

const parseOrdersFromCsv = (csvContent: string): Order[] => {
  const rows = parseFaireCsv(csvContent);
  return groupRowsIntoOrders(rows);
};

export {parseOrdersFromCsv, parseFormatFromOption, parseFaireCsv, groupRowsIntoOrders};
