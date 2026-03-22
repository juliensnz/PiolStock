'use client';

import {useUploadImage} from '@/app/(root)/components/hooks/useImages';
import {useUpdateProduct} from '@/app/(root)/components/hooks/useProducts';
import {FORMAT, createVariant, type Product, type Format} from '@/domain/model/Product';
import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Checkbox} from '@/components/ui/checkbox';
import {ImagePlus, Loader2, Pencil} from 'lucide-react';
import {useCallback, useMemo, useRef, useState} from 'react';

const IMAGE_BASE_URL = 'https://firebasestorage.googleapis.com/v0/b/piolstock.appspot.com/o/images%2F';

const EditProductButton = ({product}: {product: Product}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(true)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <EditProductModal product={product} handleClose={() => setIsOpen(false)} />
      </Dialog>
    </>
  );
};

const EditProductModal = ({product, handleClose}: {product: Product; handleClose: () => void}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState(product.name);
  const [selectedFormats, setSelectedFormats] = useState<Set<Format>>(
    () => new Set(product.variants.map(v => v.format))
  );
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = useUploadImage();
  const updateProduct = useUpdateProduct();

  const currentImageUrl = useMemo(
    () => `${IMAGE_BASE_URL}${product.image}?alt=media`,
    [product.image]
  );

  const handleFileChange = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  }, []);

  const toggleFormat = useCallback((format: Format) => {
    setSelectedFormats(prev => {
      const next = new Set(prev);
      if (next.has(format)) {
        if (next.size > 1) next.delete(format);
      } else {
        next.add(format);
      }
      return next;
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (!name || selectedFormats.size === 0) return;

    setIsSaving(true);
    try {
      let image = product.image;
      if (file) {
        image = await uploadImage(file, file.name);
      }

      const existingByFormat = new Map(product.variants.map(v => [v.format, v]));
      const variants = [...selectedFormats].map(format =>
        existingByFormat.get(format) ?? createVariant(format)
      );

      await updateProduct({...product, name, image, variants}, product);
      handleClose();
    } finally {
      setIsSaving(false);
    }
  }, [product, name, file, selectedFormats, uploadImage, updateProduct, handleClose]);

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Edit Product</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-[220px] w-[220px] cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-muted-foreground/50"
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <img src={currentImageUrl} alt={product.name} className="h-full w-full object-cover" />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) handleFileChange(selectedFile);
          }}
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-name-input">Name</Label>
          <Input id="edit-name-input" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Formats</Label>
          <div className="flex flex-wrap gap-3">
            {Object.values(FORMAT).map(format => (
              <label key={format} className="flex items-center gap-1.5 cursor-pointer">
                <Checkbox
                  checked={selectedFormats.has(format)}
                  onCheckedChange={() => toggleFormat(format)}
                />
                <span className="text-sm">{format}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={handleClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!name || selectedFormats.size === 0 || isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save'
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export {EditProductButton};
