import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { POSTS, CATEGORIES } from '@/lib/data';
import { PostCard } from '@/components/posts/PostCard';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { normalizeTurkish, matchesSearch as matchesSearchText } from '@/lib/search-utils';

// Arama fonksiyonu - normalize edilmiş metinlerde arama yapar
function matchesSearch(post: typeof POSTS[0], query: string): boolean {
  // Başlık araması
  if (matchesSearchText(post.title, query)) {
    return true;
  }

  // Slug araması
  if (matchesSearchText(post.slug, query)) {
    return true;
  }

  // İçerik araması (tüm alanlar)
  const contentFields = [
    post.content.meal,
    post.content.mealleri,
    post.content.tefsir,
    post.content.kisaTefsir,
    post.customMessage || ''
  ];

  for (const field of contentFields) {
    if (matchesSearchText(field, query)) {
      return true;
    }
  }

  // SEO alanları
  if (post.seo?.metaTitle && matchesSearchText(post.seo.metaTitle, query)) {
    return true;
  }

  if (post.seo?.metaDescription && matchesSearchText(post.seo.metaDescription, query)) {
    return true;
  }

  // SEO anahtar kelimeleri
  if (post.seo?.keywords) {
    for (const keyword of post.seo.keywords) {
      if (matchesSearchText(keyword, query)) {
        return true;
      }
    }
  }

  // Kategori adı araması
  const category = CATEGORIES.find(c => c.slug === post.category) || 
                   CATEGORIES.flatMap(c => c.subcategories || []).find(s => s.slug === post.category);
  if (category && matchesSearchText(category.title, query)) {
    return true;
  }

  return false;
}

export async function generateMetadata({ searchParams }: { searchParams?: Promise<{ q?: string }> }): Promise<Metadata> {
  const sp = searchParams ? await searchParams : {};
  const query = sp.q || '';
  
  return {
    title: query ? `"${query}" için Arama Sonuçları - Cuma Mesajları` : 'Arama - Cuma Mesajları',
    description: query ? `"${query}" için arama sonuçları` : 'İçerik arayın',
  };
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string }> }) {
  const sp = searchParams ? await searchParams : {};
  const query = (sp.q || '').trim();

  // Filter published posts by search query
  const publishedPosts = POSTS.filter(post => !post.status || post.status === 'published');
  
  const searchResults = query
    ? publishedPosts.filter(post => matchesSearch(post, query))
    : [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-24 bg-secondary/30">
          <div className="container">
            <h1 className="font-headline text-4xl md:text-5xl font-bold">
              {query ? `"${query}" için Arama Sonuçları` : 'Arama'}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {query 
                ? `${searchResults.length} sonuç bulundu` 
                : 'Arama yapmak için üst menüdeki arama kutusunu kullanın'}
            </p>
          </div>
        </section>
        
        <section className="py-12 md:py-16">
          <div className="container">
            {!query ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Lütfen arama yapmak için üst menüdeki arama kutusunu kullanın.</p>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
                  {searchResults.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold">Sonuç bulunamadı</h2>
                <p className="text-muted-foreground mt-2">
                  &quot;{query}&quot; için hiçbir sonuç bulunamadı. Farklı bir arama terimi deneyin.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

