export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// Placeholder images data removed due to large file size (91.56 MB)
// Using empty array - images should be loaded from Firebase Storage or external sources
export const PlaceHolderImages: ImagePlaceholder[] = [];
