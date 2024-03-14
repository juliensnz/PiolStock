import {imagesRepository} from '@/infrastructure/ImageRepository';
import {useEffect, useState} from 'react';

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

export {useImages};
