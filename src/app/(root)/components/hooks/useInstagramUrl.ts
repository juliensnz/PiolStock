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
        const url = debouncedUrl.split('?')[0];
        const response = await fetch(`${url}?__a=1&__d=dis` as string, {
          headers: {},
        });
        const data = await response.json();

        setInstagramUrl(data.graphql.shortcode_media.display_url);
      } catch (error) {
        setInstagramUrl(null);
      }
    };

    fetchInstagramUrl();
  }, [debouncedUrl]);

  return instagramUrl;
};

export {useInstagramUrl};
