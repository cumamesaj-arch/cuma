'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { getPlaceholderImagesAction } from '@/app/actions';

interface ImagesContextType {
  images: ImagePlaceholder[];
  isLoading: boolean;
}

const ImagesContext = createContext<ImagesContextType>({
  images: PlaceHolderImages,
  isLoading: false,
});

export function ImagesProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<ImagePlaceholder[]>(PlaceHolderImages);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load images in background, but start with PlaceHolderImages for immediate display
    setIsLoading(true);
    getPlaceholderImagesAction().then((loadedImages) => {
      setImages(loadedImages);
      setIsLoading(false);
    });
  }, []);

  return (
    <ImagesContext.Provider value={{ images, isLoading }}>
      {children}
    </ImagesContext.Provider>
  );
}

export function useImages() {
  const context = useContext(ImagesContext);
  if (context === undefined) {
    // Fallback to default values if context is not available
    return {
      images: PlaceHolderImages,
      isLoading: false,
    };
  }
  return context;
}


