export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// Import from TypeScript file instead of JSON to avoid Turbopack HMR warnings
import { placeholderImagesData } from './placeholder-images-data';

export const PlaceHolderImages: ImagePlaceholder[] = placeholderImagesData.placeholderImages || [];
