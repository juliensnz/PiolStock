import {imagesRepository} from '@/infrastructure/ImageRepository';
import {useCallback, useEffect, useState} from 'react';

const useImages = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const imagesResult = await imagesRepository.findAll();

      if (imagesResult.isError()) throw imagesResult.getError();

      setImages(imagesResult.get());
    };

    fetchImages();
  }, []);

  return images;
};

const useUploadImage = () => {
  return useCallback(async (file: File, fileName: string): Promise<string> => {
    const result = await imagesRepository.upload(file, fileName);

    if (result.isError()) throw result.getError();

    return result.get();
  }, []);
};

export {useImages, useUploadImage};
