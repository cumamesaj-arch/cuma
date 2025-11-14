import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPostsData, getCategoriesData } from '@/lib/data';
import { getPostBySlug } from '@/lib/firestore';
import PostClientPage from './client-page';

export async function generateStaticParams() {
  // Firebase'den tüm published post'ları getir
  const posts = await getPostsData();
  return posts
    .filter(post => post.status !== 'draft')
    .map(post => ({
      category: post.category,
      slug: post.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // Don't show metadata for draft posts
  if (!post || post.status === 'draft') {
    return {
      title: 'Gönderi Bulunamadı',
    };
  }

  const categories = await getCategoriesData();
  const category = categories.find(c => c.slug === post.category) || 
                    categories.flatMap(c => c.subcategories || []).find(s => s.slug === post.category);
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mujdeportal.com';
  const postUrl = `${siteUrl}/${post.category}/${post.slug}`;
  const ogImage = post.seo?.ogImage || (post.imageId ? `/api/image/${post.imageId}` : `${siteUrl}/og-default.jpg`);
  
  const metaTitle = post.seo?.metaTitle || post.title;
  const metaDescription = post.seo?.metaDescription || post.content.meal.substring(0, 160);
  const keywords = post.seo?.keywords || [];

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: keywords.join(', '),
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: postUrl,
      siteName: 'Cuma Mesajları',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'tr_TR',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // Don't show draft posts - return 404
  if (!post || post.status === 'draft') {
    notFound();
  }

  return <PostClientPage post={post} />;
}
