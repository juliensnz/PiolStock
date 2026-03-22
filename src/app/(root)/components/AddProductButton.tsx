'use client';

import {useImages} from '@/app/(root)/components/hooks/useImages';
import {useAddProducts} from '@/app/(root)/components/hooks/useProducts';
import {createProduct, createProducts} from '@/domain/model/Product';
import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Switch} from '@/components/ui/switch';
import Image from 'next/image';
import {useCallback, useState} from 'react';

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const AddProductButton = ({onAddProduct}: {onAddProduct: (productName: string) => void}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add Product</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <AddProductModal onAddProduct={onAddProduct} handleClose={() => setIsOpen(false)} />
      </Dialog>
    </>
  );
};

const AddProductModal = ({
  handleClose,
  onAddProduct,
}: {
  handleClose: () => void;
  onAddProduct: (productName: string) => void;
}) => {
  const [imageName, setImageName] = useState('');
  const [name, setName] = useState('');
  const [multipleSizes, setMultipleSizes] = useState(true);
  const images = useImages();

  const addProducts = useAddProducts();

  const handleCreateProduct = useCallback(async () => {
    if (!name || !imageName) {
      return;
    }

    const products = multipleSizes ? createProducts(name, imageName) : [createProduct(name, imageName, 'UNISIZE')];

    await addProducts(products);
    onAddProduct(name);
    handleClose();
  }, [onAddProduct, addProducts, imageName, multipleSizes, name, handleClose]);

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add Product</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center gap-4">
        {imageName ? (
          <Image
            src={`https://firebasestorage.googleapis.com/v0/b/piolstock.appspot.com/o/images%2F${imageName}?alt=media`}
            width={220}
            height={220}
            alt="Illustration image"
            className="rounded-md"
          />
        ) : (
          <div className="flex h-[220px] w-[220px] items-center justify-center rounded-md bg-muted text-muted-foreground">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="image-select">Image</Label>
          <Select
            value={imageName}
            onValueChange={value => {
              setImageName(value);
              if (!name) {
                setName(capitalize(value.split('.')[0].replace('_', ' ')));
              }
            }}
          >
            <SelectTrigger id="image-select" className="w-full">
              <SelectValue placeholder="Please choose an image" />
            </SelectTrigger>
            <SelectContent>
              {images.map(image => (
                <SelectItem key={image} value={image}>
                  <div className="flex items-center gap-2.5">
                    <Image
                      src={`https://firebasestorage.googleapis.com/v0/b/piolstock.appspot.com/o/images%2F${image}?alt=media`}
                      width={30}
                      height={30}
                      alt="Illustration image"
                    />
                    {capitalize(image.split('.')[0].replace('_', ' '))}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name-input">Name</Label>
          <Input id="name-input" value={name} onChange={e => setName(e.target.value)} placeholder="Plage" />
        </div>
        <div className="flex items-center gap-2">
          <Switch id="multiple-sizes" checked={multipleSizes} onCheckedChange={setMultipleSizes} />
          <Label htmlFor="multiple-sizes">Multiple sizes</Label>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleCreateProduct}>Confirm</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export {AddProductButton};
