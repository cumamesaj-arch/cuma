'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getPostsAction } from '@/app/actions';
import type { Post } from '@/lib/types';
import { PostCardList } from '@/components/posts/PostCardList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Suspense } from 'react';

interface CategoryContentProps {
  categorySlug: string;
  categoryTitle: string;
  customMenu?: { label: string; href: string } | null;
}

function CategoryContentInner({ categorySlug, categoryTitle, customMenu }: CategoryContentProps) {
  const searchParams = useSearchParams();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const showAll = searchParams.get('all') === '1' || searchParams.get('all') === 'true';
  const [posts, setPosts] = useState<Post[]>([]);
  
  // Load posts from Firebase - Optimize: Sadece bu kategori için postları yükle
  useEffect(() => {
    async function loadPosts() {
      // Kategori slug'ına göre filtrele ve limit uygula
      const loadedPosts = await getPostsAction({ 
        status: 'published',
        category: categorySlug,
        limit: showAll ? 1000 : 50, // Sayfalama için yeterli sayıda yükle
        orderBy: 'createdAt',
        orderDirection: 'desc'
      });
      setPosts(loadedPosts);
    }
    loadPosts();
  }, [categorySlug, showAll]);
  
  const normalize = (v?: string) => String(v || '').trim().replace(/^\//, '').toLowerCase();
  
  // Filter posts - check both slug and custom menu label, only show published posts
  const catSlugNorm = normalize(categorySlug);
  const allPostsInCategory = posts.filter(post => {
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
    <section className="py-12 md:py-16">
      <div className="container">
        <h1 className="text-3xl font-bold mb-8 text-center">{categoryTitle}</h1>
        {postsInCategory.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
              <PostCardList posts={postsInCategory} priorityCount={9} />
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
  );
}

export function CategoryContent(props: CategoryContentProps) {
  return (
    <Suspense fallback={
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="text-center py-16">
            <p className="text-muted-foreground">Yükleniyor...</p>
          </div>
        </div>
      </section>
    }>
      <CategoryContentInner {...props} />
    </Suspense>
  );
}
