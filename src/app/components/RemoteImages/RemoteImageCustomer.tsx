// import React, { ComponentProps, useEffect, useState } from 'react';
// import Image from 'next/image';
// import { supabase } from '@/lib/supabaseClient';

// type RemoteImageProps = {
//   path?: string | null;
//   fallback: string;
// } & Omit<ComponentProps<typeof Image>, 'src'>;

// const RemoteImage = ({ path, fallback, ...imageProps }: RemoteImageProps) => {
//   const [image, setImage] = useState('');

//   useEffect(() => {
//     if (!path) return;

//     (async () => {
//       setImage('');
//       const { data, error } = await supabase.storage
//         .from('profile-images')
//         .download(path);

//       if (error) {
//         console.error('Error downloading image:', error);
//         return;
//       }

//       if (data) {
//         const fr = new FileReader();
//         fr.readAsDataURL(data);
//         fr.onload = () => {
//           setImage(fr.result as string);
//         };
//       }
//     })();
//   }, [path]);

//   return (
//     <Image
//       src={image || fallback}
//       alt="Remote Image"
//       // width={120}
//       // height={120}
//       // className="mb-3 rounded-full shadow-lg border"
//       {...imageProps}
//     />
//   );
// };

// export default RemoteImage;


// src/app/RemoteImages/RemoteImageCustomer.tsx
// "use client";

// import { useEffect, useState, useRef } from "react";
// import { supabase } from "@/lib/supabaseClient";

// interface RemoteImageProps {
//   path: string;
//   fallback: string;
//   alt: string;
//   width: number | string;
//   height: number | string;
//   className?: string;
// }

// export default function RemoteImage({
//   path,
//   fallback,
//   alt,
//   width,
//   height,
//   className,
// }: RemoteImageProps) {
//   const [imageUrl, setImageUrl] = useState<string | null>(null);
//   const imageUrlRef = useRef<string | null>(null);

//   useEffect(() => {
//     let isMounted = true;

//     const downloadImage = async () => {
//       try {
//         const { data, error } = await supabase.storage
//           .from("profile-images") // Hardcoded bucket; adjust if dynamic
//           .download(path);
//         if (error) throw new Error(error.message);
//         if (isMounted) {
//           const url = URL.createObjectURL(data);
//           imageUrlRef.current = url;
//           setImageUrl(url);
//         }
//       } catch (error) {
//         console.error("Error downloading image:", (error as Error).message);
//         if (isMounted) setImageUrl(fallback);
//       }
//     };

//     if (path) {
//       downloadImage();
//     } else {
//       setImageUrl(fallback);
//     }

//     return () => {
//       isMounted = false;
//       if (imageUrlRef.current) {
//         URL.revokeObjectURL(imageUrlRef.current);
//       }
//     };
//   }, [path, fallback]);

//   return (
//     <img
//       src={imageUrl || fallback}
//       alt={alt}
//       width={width}
//       height={height}
//       className={className}
//     />
//   );
// }


// components/RemoteImages/RemoteImageCustomer.tsx
"use client";

import React, { useState, useEffect } from "react";

interface RemoteImageProps {
  path: string | null;
  fallback: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const RemoteImage: React.FC<RemoteImageProps> = ({ path, fallback, alt, width, height, className }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const downloadImage = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (err: any) {
      console.error("Error downloading image:", { message: err.message, url });
      setError(err.message);
      return null;
    }
  };

  useEffect(() => {
    if (!path) {
      setImageSrc(fallback);
      return;
    }

    let isMounted = true;
    const loadImage = async () => {
      const src = await downloadImage(path);
      if (isMounted && src) setImageSrc(src);
    };

    loadImage();

    return () => {
      isMounted = false;
      if (imageSrc) URL.revokeObjectURL(imageSrc); // Cleanup
    };
  }, [path, fallback]);

  if (error) {
    return (
      <div className={className}>
        <p className="text-red-500 text-sm">Error loading image: {error}</p>
        <img src={fallback} alt={alt} width={width} height={height} className="rounded-lg object-cover" />
      </div>
    );
  }

  return <img src={imageSrc || fallback} alt={alt} width={width} height={height} className={className} />;
};

export default RemoteImage;