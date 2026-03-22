'use client';

import {useAddOrders} from '@/app/(root)/components/hooks/useOrders';
import {useProducts} from '@/app/(root)/components/hooks/useProducts';
import {createOrder, createOrderItem} from '@/domain/model/Order';
import type {OrderItem, ShippingAddress} from '@/domain/model/Order';
import {FORMAT, type Format, type Product} from '@/domain/model/Product';
import {ProductCombobox} from '@/app/(root)/components/orders/ProductCombobox';
import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Loader2, Plus, Trash2} from 'lucide-react';
import {useCallback, useState} from 'react';

type DraftItem = {
  key: string;
  productId: string;
  format: Format;
  quantity: number;
};

const CreateOrderButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-1.5">
        <Plus className="h-4 w-4" />
        New Order
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <CreateOrderModal handleClose={() => setIsOpen(false)} />
      </Dialog>
    </>
  );
};

const CreateOrderModal = ({handleClose}: {handleClose: () => void}) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [address1, setAddress1] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('France');
  const [draftItems, setDraftItems] = useState<DraftItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const {data: productsData} = useProducts();
  const addOrders = useAddOrders();

  const products = productsData?.docs.map(doc => doc.data() as Product) ?? [];

  const addItem = useCallback(() => {
    setDraftItems(prev => [...prev, {key: crypto.randomUUID(), productId: '', format: FORMAT.A4, quantity: 1}]);
  }, []);

  const removeItem = useCallback((key: string) => {
    setDraftItems(prev => prev.filter(i => i.key !== key));
  }, []);

  const updateItem = useCallback((key: string, updates: Partial<DraftItem>) => {
    setDraftItems(prev => prev.map(i => (i.key === key ? {...i, ...updates} : i)));
  }, []);

  const handleCreate = useCallback(async () => {
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

      const order = createOrder(
        orderNumber || `M-${Date.now().toString(36).toUpperCase()}`,
        new Date().toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'}),
        customerName,
        address,
        items
      );

      await addOrders([order]);
      handleClose();
    } finally {
      setIsSaving(false);
    }
  }, [customerName, orderNumber, address1, city, postalCode, country, draftItems, products, addOrders, handleClose]);

  const getAvailableFormats = (productId: string): Format[] => {
    const product = products.find(p => p.id === productId);
    return product?.variants.map(v => v.format) ?? [];
  };

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>New Order</DialogTitle>
      </DialogHeader>

      <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 flex flex-col gap-1.5">
            <Label htmlFor="customer-name">Customer name</Label>
            <Input
              id="customer-name"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="Name"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="order-number">Order number (optional)</Label>
            <Input
              id="order-number"
              value={orderNumber}
              onChange={e => setOrderNumber(e.target.value)}
              placeholder="Auto-generated"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="country">Country</Label>
            <Input id="country" value={country} onChange={e => setCountry(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={address1} onChange={e => setAddress1(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="city">City</Label>
            <Input id="city" value={city} onChange={e => setCity(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="postal-code">Postal code</Label>
            <Input id="postal-code" value={postalCode} onChange={e => setPostalCode(e.target.value)} />
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
            <p className="py-4 text-center text-sm text-muted-foreground">
              No items yet. Click &quot;Add item&quot; to start.
            </p>
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
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 text-destructive"
                onClick={() => removeItem(item.key)}
              >
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
        <Button onClick={handleCreate} disabled={!customerName || draftItems.length === 0 || isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create order'
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export {CreateOrderButton};
