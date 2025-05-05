import React, { ComponentProps, useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';

type RemoteImageProps = {
  path?: string | null;
  fallback: string;
} & Omit<ComponentProps<typeof Image>, 'src'>;

const RemoteImage = ({ path, fallback, ...imageProps }: RemoteImageProps) => {
  const [image, setImage] = useState('');

  useEffect(() => {
    if (!path) return;

    (async () => {
      setImage('');
      const { data, error } = await supabase.storage
        .from('restaurant-items')
        .download(path);

      if (error) {
        console.error('Error downloading image:', error);
        return;
      }

      if (data) {
        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
          setImage(fr.result as string);
        };
      }
    })();
  }, [path]);

  return (
    <Image
      src={image || fallback}
      alt="Restaurant item image"
      width={120}
      height={120}
      className='w-32 h-32 mx-auto mb-4 rounded-full shadow-md object-cover'
      {...imageProps}
    />
  );
};

export default RemoteImage;