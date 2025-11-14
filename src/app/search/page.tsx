'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { POSTS, CATEGORIES } from '@/lib/data';
import { PostCard } from '@/components/posts/PostCard';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, Suspense } from 'react';
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

function SearchContent() {
  const searchParams = useSearchParams();
  const query = (searchParams.get('q') || '').trim();

  // Filter published posts by search query
  const publishedPosts = useMemo(() => {
    return POSTS.filter(post => !post.status || post.status === 'published');
  }, []);
  
  const searchResults = useMemo(() => {
    if (!query) return [];
    return publishedPosts.filter(post => matchesSearch(post, query));
  }, [query, publishedPosts]);

  // Update document title
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = query 
        ? `"${query}" için Arama Sonuçları - Cuma Mesajları` 
        : 'Arama - Cuma Mesajları';
    }
  }, [query]);

  return (
    <>
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
                {searchResults.map((post, index) => (
                  <PostCard key={post.id} post={post} priority={index < 8} />
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
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={
          <section className="py-12 md:py-24 bg-secondary/30">
            <div className="container">
              <h1 className="font-headline text-4xl md:text-5xl font-bold">Arama</h1>
              <p className="mt-2 text-lg text-muted-foreground">Yükleniyor...</p>
            </div>
          </section>
        }>
          <SearchContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

