"use client";

import React from "react";

interface RemoteImageRiderDocsProps {
  path: string | null;
  bucket: string;
  fallback: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const RemoteImageRiderDocs: React.FC<RemoteImageRiderDocsProps> = ({
  path,
  bucket,
  fallback,
  alt,
  width,
  height,
  className,
}) => {
  const baseUrl = `https://crnpzsowxkvttgmdaaed.supabase.co/storage/v1/object/public/${bucket}/`;
  const imageUrl = path ? `${baseUrl}${path}` : fallback;

  return path ? (
    <a
      href={imageUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      title={alt}
    >
      <img
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        className="rounded-lg object-cover"
      />
    </a>
  ) : (
    <img
      src={fallback}
      alt="Fallback"
      width={width}
      height={height}
      className={`${className} rounded-lg object-cover`}
    />
  );
};

export default RemoteImageRiderDocs;