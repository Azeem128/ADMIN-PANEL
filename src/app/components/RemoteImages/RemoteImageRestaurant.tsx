"use client";

import React from "react";

const RemoteImageRestaurant = ({ path, bucket, fallback = "/null-icon.png", alt, width, height, className, onError }) => {
  const baseUrl = `https://crnpzsowxkvttgmdaaed.supabase.co/storage/v1/object/public/${bucket}/`;
  const imageUrl = path ? `${baseUrl}public/${path}` : fallback;

  return (
    <img
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={(e) => {
        console.log(`Failed to load image from ${bucket}:`, path);
        if (onError) onError(e);
      }}
    />
  );
};

export default RemoteImageRestaurant;