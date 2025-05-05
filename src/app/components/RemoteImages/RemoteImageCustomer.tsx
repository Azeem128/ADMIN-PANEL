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
        .from('profile-images')
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
      alt="Remote Image"
      // width={120}
      // height={120}
      // className="mb-3 rounded-full shadow-lg border"
      {...imageProps}
    />
  );
};

export default RemoteImage;