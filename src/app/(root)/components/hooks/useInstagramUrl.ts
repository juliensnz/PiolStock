import {useDebounce} from 'akeneo-design-system';
import {useEffect, useState} from 'react';

const useInstagramUrl = (url: string) => {
  const [instagramUrl, setInstagramUrl] = useState<string | null>(null);

  const debouncedUrl = useDebounce(url);

  useEffect(() => {
    if ('' === debouncedUrl) {
      return;
    }

    const fetchInstagramUrl = async () => {
      try {
        const result = await fetch(`/api/image/?url=${debouncedUrl.split('?')[0]}`);
        const data = await result.json();

        setInstagramUrl(data.url);
      } catch (error) {
        setInstagramUrl(null);
      }
    };

    fetchInstagramUrl();
  }, [debouncedUrl]);

  return instagramUrl;
};

export {useInstagramUrl};
