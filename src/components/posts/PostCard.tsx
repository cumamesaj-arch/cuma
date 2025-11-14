'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Post } from '@/lib/types';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import type { Category } from '@/lib/types';
import { useImages } from '@/contexts/ImagesContext';
import { getCategoriesAction } from '@/app/actions';
import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface PostCardProps {
  post: Post;
  availableImages?: ImagePlaceholder[]; // Optional prop for explicit override
  priority?: boolean;
}

export function PostCard({ post, availableImages: propAvailableImages, priority = false }: PostCardProps) {
  // Use context images by default, but allow prop override
  const { images: contextImages } = useImages();
  const availableImages = propAvailableImages || contextImages;
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategoriesAction().then(setCategories);
  }, []);

  const category = categories.find((c) => c.slug === post.category) || (categories.flatMap(c => c.subcategories || []).find(s => s.slug === post.category));
  // Resolve primary image from post images
  const primaryImageId = post.imageId || (post.imageIds && post.imageIds[0]) || undefined;
  const image = primaryImageId ? availableImages.find((img) => img.id === primaryImageId) : undefined;
  const imageUrl = image?.imageUrl; // only real image url
  const hasImage = !!imageUrl;
  // Determine YouTube video id if present
  const youTubeId = (post.youtubeVideoIds && post.youtubeVideoIds.find((id) => id && id.trim().length > 0)) || post.youtubeVideoId;
  const videoThumbnail = youTubeId ? `https://img.youtube.com/vi/${youTubeId}/hqdefault.jpg` : undefined;

  const postUrl = `/${category?.slug}/${post.slug}`;
  const preferImageCategories = new Set(['cuma-mesajlari', 'kandil-mesajlari', 'bayram-mesajlari', 'diger']);
  const preferImage = preferImageCategories.has(category?.slug || '');

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <Link href={postUrl} className="relative block h-48 w-full">
          {preferImage ? (
            hasImage && imageUrl ? (
              <Image src={imageUrl} alt={post.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={image?.imageHint} unoptimized priority={priority} loading="eager" />
            ) : youTubeId ? (
              <>
                <Image src={videoThumbnail as string} alt={post.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" priority={priority} loading="eager" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-red-600 rounded-full p-4">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 bg-muted" />
            )
          ) : (
            youTubeId ? (
              <>
                <Image src={videoThumbnail as string} alt={post.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" priority={priority} loading="eager" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-red-600 rounded-full p-4">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </>
            ) : hasImage && imageUrl ? (
              <Image src={imageUrl} alt={post.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={image?.imageHint} unoptimized priority={priority} loading="eager" />
            ) : (
              <div className="absolute inset-0 bg-muted" />
            )
          )}
          <div className="absolute inset-0 bg-black/20"></div>
          <ArrowUpRight className="absolute top-4 right-4 h-6 w-6 text-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        {category && (
          <Badge variant="secondary" className="mb-2">
            {category.title}
          </Badge>
        )}
        <h3 className="font-headline text-lg font-bold leading-tight">
          <Link href={postUrl} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </h3>
      </CardContent>
    </Card>
  );
}

      <CardContent className="p-4">
        {category && (
          <Badge variant="secondary" className="mb-2">
            {category.title}
          </Badge>
        )}
        <h3 className="font-headline text-lg font-bold leading-tight">
          <Link href={postUrl} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </h3>
      </CardContent>
    </Card>
  );
}
