'use client';

import {useUploadImage} from '@/app/(root)/components/hooks/useImages';
import {useAddProduct} from '@/app/(root)/components/hooks/useProducts';
import {FORMAT, createVariant, type Format} from '@/domain/model/Product';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {ImagePlus, Loader2} from 'lucide-react';
import {useCallback, useRef, useState} from 'react';

const DEFAULT_FORMATS = new Set<Format>(
  Object.values(FORMAT).filter(f => f !== 'UNISIZE')
);

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
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [selectedFormats, setSelectedFormats] = useState<Set<Format>>(() => new Set(DEFAULT_FORMATS));
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = useUploadImage();
  const addProduct = useAddProduct();

  const handleFileChange = useCallback(
    (selectedFile: File) => {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      if (!name) {
        setName(capitalize(selectedFile.name.split('.')[0].replace(/_/g, ' ')));
      }
    },
    [name],
  );

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

  const handleCreateProduct = useCallback(async () => {
    if (!name || !file || selectedFormats.size === 0) {
      return;
    }

    setIsUploading(true);
    try {
      const fileName = await uploadImage(file, file.name);
      const product = {
        id: crypto.randomUUID(),
        name,
        image: fileName,
        variants: [...selectedFormats].map(createVariant),
      };

      await addProduct(product);
      onAddProduct(name);
      handleClose();
    } finally {
      setIsUploading(false);
    }
  }, [onAddProduct, addProduct, uploadImage, file, selectedFormats, name, handleClose]);

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add Product</DialogTitle>
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
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImagePlus className="h-10 w-10" />
              <span className="text-sm">Click to upload</span>
            </div>
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
          <Label htmlFor="name-input">Name</Label>
          <Input id="name-input" value={name} onChange={e => setName(e.target.value)} placeholder="Plage" />
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
        <Button variant="outline" onClick={handleClose} disabled={isUploading}>
          Cancel
        </Button>
        <Button onClick={handleCreateProduct} disabled={!name || !file || selectedFormats.size === 0 || isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            'Confirm'
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export {AddProductButton};
