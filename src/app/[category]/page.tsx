import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getCategoriesData, getPostsData } from '@/lib/data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCustomMenusAction } from '@/app/actions';
import { CategoryContent } from './category-content';

export async function generateStaticParams() {
  const customMenus = await getCustomMenusAction();
  const categories = await getCategoriesData();
  const customMenuSlugs = customMenus
    .filter(menu => menu.href) // Sadece href'i olan menüleri al
    .map(menu => {
      // Extract slug from href (remove leading slash)
      const slug = (menu.href || '').replace(/^\//, '').toLowerCase();
      return { category: slug };
    });
  
  return categories.map((category) => ({
    category: category.slug,
  }))
  .concat(categories.flatMap(c => c.subcategories || []).map(s => ({ category: s.slug })))
  .concat(customMenuSlugs);
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const customMenus = await getCustomMenusAction();
  const categories = await getCategoriesData();
  const posts = await getPostsData();
  
  // Check if it's a custom menu (case-insensitive and URL decode)
  const customMenu = customMenus.find(menu => {
    if (!menu.href) return false;
    const menuSlug = menu.href.replace(/^\//, '').trim().toLowerCase();
    const decodedCategorySlug = decodeURIComponent(categorySlug).trim();
    // Case-insensitive comparison
    return menuSlug.toLowerCase() === decodedCategorySlug.toLowerCase() || 
           menuSlug === decodedCategorySlug ||
           menu.label === decodedCategorySlug;
  });
  
  const category = categories.find((c) => c.slug === categorySlug) || 
                    categories.flatMap(c => c.subcategories || []).find(s => s.slug === categorySlug) ||
                    (customMenu ? { title: customMenu.label, slug: categorySlug } : null);
  
  if (!category) {
    return {
      title: 'Kategori Bulunamadı',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mujdeportal.com';
  const categoryUrl = `${siteUrl}/${categorySlug}`;
  const postsCount = posts.filter(post => {
    // Match posts by category slug or custom menu label
    return (post.category === categorySlug || post.category === customMenu?.label) && post.status !== 'draft';
  }).length;

  const categoryTitle = customMenu?.label || category.title;

  return {
    title: `${categoryTitle} - Cuma Mesajları`,
    description: `${categoryTitle} kategorisindeki İslami içerikler. ${postsCount} gönderi bulunmaktadır.`,
    openGraph: {
      title: `${categoryTitle} - Cuma Mesajları`,
      description: `${categoryTitle} kategorisindeki İslami içerikler`,
      url: categoryUrl,
      siteName: 'Cuma Mesajları',
      locale: 'tr_TR',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${categoryTitle} - Cuma Mesajları`,
      description: `${categoryTitle} kategorisindeki İslami içerikler`,
    },
    alternates: {
      canonical: categoryUrl,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  const customMenus = await getCustomMenusAction();
  const categories = await getCategoriesData();
  const normalize = (v?: string) => String(v || '').trim().replace(/^\//,'').toLowerCase();
  
  // Check if it's a custom menu (case-insensitive and URL decode)
  const customMenu = customMenus.find(menu => {
    if (!menu.href) return false;
    const menuSlug = normalize(menu.href);
    const decodedCategorySlug = normalize(decodeURIComponent(categorySlug));
    return menuSlug === decodedCategorySlug || normalize(menu.label) === decodedCategorySlug;
  });
  
  const category = categories.find((c) => c.slug === categorySlug) || 
                    categories.flatMap(c => c.subcategories || []).find(s => s.slug === categorySlug) ||
                    (customMenu ? { title: customMenu.label, slug: categorySlug } : null);
  
  if (!category) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-24 bg-secondary/30">
          <div className="container">
            <h1 className="font-headline text-4xl md:text-5xl font-bold">{category.title}</h1>
            <p className="mt-2 text-lg text-muted-foreground">Bu kategorideki tüm gönderiler.</p>
          </div>
        </section>
        
        <CategoryContent 
          categorySlug={categorySlug} 
          categoryTitle={category.title}
          customMenu={customMenu}
        />
      </main>
      <Footer />
    </div>
  );
}
