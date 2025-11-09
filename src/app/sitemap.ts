import { MetadataRoute } from 'next';
import { POSTS, CATEGORIES } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mujdeportal.com';
  
  const routes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  // Add category pages
  CATEGORIES.forEach(category => {
    if (category.slug) {
      routes.push({
        url: `${siteUrl}/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      });
    }

    // Add subcategory pages
    if (category.subcategories) {
      category.subcategories.forEach(subcategory => {
        routes.push({
          url: `${siteUrl}/${subcategory.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });
    }
  });

  // Add post pages (only published posts)
  POSTS.filter(post => post.status !== 'draft').forEach(post => {
    // Validate date before using it
    const postDate = post.createdAt ? new Date(post.createdAt) : new Date();
    const lastModified = isNaN(postDate.getTime()) ? new Date() : postDate;
    
    routes.push({
      url: `${siteUrl}/${post.category}/${post.slug}`,
      lastModified: lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  });

  return routes;
}





