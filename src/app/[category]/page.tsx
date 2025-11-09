import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { POSTS, CATEGORIES } from '@/lib/data';
import { PostCard } from '@/components/posts/PostCard';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { getCustomMenusAction, getMenuGlobalConfigAction } from '@/app/actions';
import type { CustomMenu } from '@/lib/types';

export async function generateStaticParams() {
  const customMenus = await getCustomMenusAction();
  const customMenuSlugs = customMenus.map(menu => {
    // Extract slug from href (remove leading slash)
    const slug = menu.href.replace(/^\//, '').toLowerCase();
    return { category: slug };
  });
  
  return CATEGORIES.map((category) => ({
    category: category.slug,
  }))
  .concat(CATEGORIES.flatMap(c => c.subcategories || []).map(s => ({ category: s.slug })))
  .concat(customMenuSlugs);
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const customMenus = await getCustomMenusAction();
  
  // Check if it's a custom menu (case-insensitive and URL decode)
  const customMenu = customMenus.find(menu => {
    const menuSlug = menu.href.replace(/^\//, '').trim().toLowerCase();
    const decodedCategorySlug = decodeURIComponent(categorySlug).trim();
    // Case-insensitive comparison
    return menuSlug.toLowerCase() === decodedCategorySlug.toLowerCase() || 
           menuSlug === decodedCategorySlug ||
           menu.label === decodedCategorySlug;
  });
  
  const category = CATEGORIES.find((c) => c.slug === categorySlug) || 
                    CATEGORIES.flatMap(c => c.subcategories || []).find(s => s.slug === categorySlug) ||
                    (customMenu ? { title: customMenu.label, slug: categorySlug } : null);
  
  if (!category) {
    return {
      title: 'Kategori Bulunamadı',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mujdeportal.com';
  const categoryUrl = `${siteUrl}/${categorySlug}`;
  const postsCount = POSTS.filter(post => {
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

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ category: string }>, searchParams?: Promise<Record<string, string>> }) {
  const { category: categorySlug } = await params;
  const sp = searchParams ? await searchParams : {};
  const page = Math.max(1, parseInt((sp && sp['page']) || '1', 10));
  const showAll = sp && (sp['all'] === '1' || sp['all'] === 'true');
  const customMenus = await getCustomMenusAction();
  const menuConfig = await getMenuGlobalConfigAction();
  const normalize = (v?: string) => String(v || '').trim().replace(/^\//,'').toLowerCase();
  
  // Check if it's a custom menu (case-insensitive and URL decode)
  const customMenu = customMenus.find(menu => {
    const menuSlug = normalize(menu.href);
    const decodedCategorySlug = normalize(decodeURIComponent(categorySlug));
    return menuSlug === decodedCategorySlug || normalize(menu.label) === decodedCategorySlug;
  });
  
  const category = CATEGORIES.find((c) => c.slug === categorySlug) || 
                    CATEGORIES.flatMap(c => c.subcategories || []).find(s => s.slug === categorySlug) ||
                    (customMenu ? { title: customMenu.label, slug: categorySlug } : null);
  
  if (!category) {
    notFound();
  }

  // Filter posts - check both slug and custom menu label, only show published posts
  const catSlugNorm = normalize(categorySlug);
  const allPostsInCategory = POSTS.filter(post => {
    const postNorm = normalize(post.category);
    const menuHrefNorm = normalize(customMenu?.href);
    const menuLabelNorm = normalize(customMenu?.label);
    return (!post.status || post.status === 'published') &&
           (postNorm === catSlugNorm || postNorm === menuHrefNorm || postNorm === menuLabelNorm);
  });
  const limit = 9;
  const total = allPostsInCategory.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * limit;
  const postsInCategory = showAll ? allPostsInCategory : allPostsInCategory.slice(start, start + limit);

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
        
        <section className="py-12 md:py-16">
            <div className="container">
                {postsInCategory.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
                            {postsInCategory.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                        <div className="flex flex-col gap-4 mt-8">
                            {/* Üstte: Ana Sayfaya Dön */}
                            <div className="flex justify-center">
                              <Button variant="outline" size="lg" asChild>
                                  <Link href="/">
                                      Ana Sayfaya Dön <ArrowRight className="ml-2 h-4 w-4" />
                                  </Link>
                              </Button>
                            </div>
                            {/* Altta: numaralı sayfalama + sağda Tümünü Gör */}
                            {!showAll && total > 0 && (
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center flex-wrap gap-2">
                                  <Button variant="outline" asChild disabled={currentPage <= 1}>
                                    <Link href={`/${categorySlug}?page=${currentPage - 1}`}>Önceki</Link>
                                  </Button>
                                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <Button key={p} variant={p === currentPage ? 'default' : 'outline'} asChild>
                                      <Link href={`/${categorySlug}?page=${p}`}>{p}</Link>
                                    </Button>
                                  ))}
                                  <Button variant="outline" asChild disabled={currentPage >= totalPages}>
                                    <Link href={`/${categorySlug}?page=${currentPage + 1}`}>Sonraki</Link>
                                  </Button>
                                </div>
                                <div className="ml-auto">
                                  <Button variant="outline" asChild>
                                    <Link href={`/${categorySlug}?all=1`}>Tümünü Gör</Link>
                                  </Button>
                                </div>
                              </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-bold">Henüz gönderi yok.</h2>
                        <p className="text-muted-foreground mt-2">Bu kategoride henüz hiç gönderi oluşturulmadı.</p>
                    </div>
                )}
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
