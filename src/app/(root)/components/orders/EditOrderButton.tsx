'use client';

import {useUpdateOrder} from '@/app/(root)/components/hooks/useOrders';
import {useProducts} from '@/app/(root)/components/hooks/useProducts';
import {ProductCombobox} from '@/app/(root)/components/orders/ProductCombobox';
import {createOrderItem} from '@/domain/model/Order';
import type {Order, OrderItem, ShippingAddress} from '@/domain/model/Order';
import {FORMAT, type Format, type Product} from '@/domain/model/Product';
import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Loader2, Pencil, Plus, Trash2} from 'lucide-react';
import {useCallback, useState} from 'react';

type DraftItem = {
  key: string;
  productId: string;
  format: Format;
  quantity: number;
  originalItemId?: string;
};

const orderItemsToDraftItems = (items: OrderItem[], products: Product[]): DraftItem[] =>
  items.map(item => ({
    key: crypto.randomUUID(),
    productId: item.productId ?? products.find(p => p.name === item.productName)?.id ?? '',
    format: item.format,
    quantity: item.quantity,
    originalItemId: item.id,
  }));

const EditOrderButton = ({order}: {order: Order}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(true)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {isOpen && <EditOrderModal order={order} handleClose={() => setIsOpen(false)} />}
      </Dialog>
    </>
  );
};

const EditOrderModal = ({order, handleClose}: {order: Order; handleClose: () => void}) => {
  const {data: productsData} = useProducts();
  const updateOrder = useUpdateOrder();
  const products = productsData?.docs.map(doc => doc.data() as Product) ?? [];

  const [orderNumber, setOrderNumber] = useState(order.orderNumber);
  const [customerName, setCustomerName] = useState(order.customerName);
  const [address1, setAddress1] = useState(order.shippingAddress.address1);
  const [city, setCity] = useState(order.shippingAddress.city);
  const [postalCode, setPostalCode] = useState(order.shippingAddress.postalCode);
  const [country, setCountry] = useState(order.shippingAddress.country);
  const [draftItems, setDraftItems] = useState<DraftItem[]>(() => orderItemsToDraftItems(order.items, products));
  const [isSaving, setIsSaving] = useState(false);

  const addItem = useCallback(() => {
    setDraftItems(prev => [
      ...prev,
      {key: crypto.randomUUID(), productId: '', format: FORMAT.A4, quantity: 1},
    ]);
  }, []);

  const removeItem = useCallback((key: string) => {
    setDraftItems(prev => prev.filter(i => i.key !== key));
  }, []);

  const updateItem = useCallback((key: string, updates: Partial<DraftItem>) => {
    setDraftItems(prev => prev.map(i => (i.key === key ? {...i, ...updates} : i)));
  }, []);

  const handleSave = useCallback(async () => {
    if (!customerName || draftItems.length === 0) return;

    setIsSaving(true);
    try {
      const address: ShippingAddress = {address1, city, postalCode, country};

      const items: OrderItem[] = draftItems.map(draft => {
        const product = products.find(p => p.id === draft.productId);
        const variant = product?.variants.find(v => v.format === draft.format);
        return createOrderItem(
          product?.name ?? 'Unknown',
          draft.format,
          draft.quantity,
          product?.id ?? null,
          variant?.id ?? null,
          product?.image ?? null
        );
      });

      await updateOrder(
        {
          ...order,
          orderNumber,
          customerName,
          shippingAddress: address,
          items,
        },
        order
      );
      handleClose();
    } finally {
      setIsSaving(false);
    }
  }, [order, customerName, orderNumber, address1, city, postalCode, country, draftItems, products, updateOrder, handleClose]);

  const getAvailableFormats = (productId: string): Format[] => {
    const product = products.find(p => p.id === productId);
    return product?.variants.map(v => v.format) ?? [];
  };

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Edit Order</DialogTitle>
      </DialogHeader>

      <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 flex flex-col gap-1.5">
            <Label htmlFor="edit-customer-name">Customer name</Label>
            <Input id="edit-customer-name" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Name" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-order-number">Order number</Label>
            <Input id="edit-order-number" value={orderNumber} onChange={e => setOrderNumber(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-country">Country</Label>
            <Input id="edit-country" value={country} onChange={e => setCountry(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-address">Address</Label>
            <Input id="edit-address" value={address1} onChange={e => setAddress1(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-city">City</Label>
            <Input id="edit-city" value={city} onChange={e => setCity(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-postal-code">Postal code</Label>
            <Input id="edit-postal-code" value={postalCode} onChange={e => setPostalCode(e.target.value)} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label>Items</Label>
            <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-1 h-7 text-xs">
              <Plus className="h-3 w-3" />
              Add item
            </Button>
          </div>

          {draftItems.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">No items yet. Click &quot;Add item&quot; to start.</p>
          )}

          {draftItems.map(item => (
            <div key={item.key} className="flex items-end gap-2 rounded-lg border border-border p-2">
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Label className="text-xs">Product</Label>
                <ProductCombobox
                  products={products}
                  value={item.productId}
                  onSelect={v => updateItem(item.key, {productId: v, format: getAvailableFormats(v)[0] ?? FORMAT.A4})}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Format</Label>
                <Select value={item.format} onValueChange={v => updateItem(item.key, {format: v as Format})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(item.productId ? getAvailableFormats(item.productId) : Object.values(FORMAT)).map(f => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-16 flex-col gap-1.5">
                <Label className="text-xs">Qty</Label>
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={e => updateItem(item.key, {quantity: Math.max(1, parseInt(e.target.value) || 1)})}
                />
              </div>
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-destructive" onClick={() => removeItem(item.key)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={handleClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!customerName || draftItems.length === 0 || isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save changes'
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export {EditOrderButton};
