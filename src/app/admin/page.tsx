'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  PlusCircle,
  Users,
  Video,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { POSTS, CATEGORIES } from '@/lib/data';
import { deletePostAction, getUsersAction, updatePostAction, updatePostStatusAction, getCustomMenusAction } from '@/app/actions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { getCategorySettingsAction } from '@/app/actions';
import type { CategorySettings, CustomMenu } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import type { User } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { matchesSearch } from '@/lib/search-utils';

function AnalyticsLogos() {
  return (
    <div className="mt-4 pt-4 border-t">
      <p className="text-xs text-muted-foreground mb-2">Analiz Sonuçları</p>
      <div className="flex items-center gap-3">
        <Link
          href="https://analytics.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          <span className="text-xs font-medium underline">Google Analytics</span>
        </Link>
        <Link
          href="https://metrica.yandex.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#FC3F1D"/>
              <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="#FC3F1D"/>
              <circle cx="12" cy="12" r="2" fill="#FC3F1D"/>
            </svg>
          <span className="text-xs font-medium underline">Yandex Metrica</span>
        </Link>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  // Hydration uyarılarını önlemek için istatistikleri sadece client mount sonrası göster
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [categorySettings, setCategorySettings] = useState<CategorySettings[]>([]);
  const [customMenus, setCustomMenus] = useState<CustomMenu[]>([]);
  const normalizeSlug = (value?: string) => String(value || '')
    .trim()
    .replace(/^\//, '')
    .toLowerCase();
  const [searchQuery, setSearchQuery] = useState('');
  const uniquePosts = Array.from(new Map(POSTS.map((p) => [p.id, p])).values());

  // Görünür menülerin (sabit + özel) ve görünür sabit menü alt klasörlerinin slug listesi
  const visibleCategorySlugs = (() => {
    const baseVisible = CATEGORIES
      .filter(cat => (categorySettings.find(s => s.categoryId === cat.id)?.visible ?? true))
      .map(cat => cat.slug);
    const subVisible = CATEGORIES
      .filter(cat => (categorySettings.find(s => s.categoryId === cat.id)?.visible ?? true))
      .flatMap(cat => (cat.subcategories?.map(sub => sub.slug) ?? []));
    const customVisible = customMenus.filter(m => m.visible).map(m => m.href.replace(/^\//, ''));
    return new Set<string>([...baseVisible, ...subVisible, ...customVisible]);
  })();

  // Yalnızca görünür menülere bağlı gönderiler
  const totalPosts = uniquePosts.filter(p => visibleCategorySlugs.has(p.category)).length;
  // Görünür sabit kategoriler + görünür özel menüler
  const totalCategories = useState(0)[0];
  const visibleCategoryCount = (categorySettings && customMenus)
    ? (CATEGORIES.filter(cat => (categorySettings.find(s => s.categoryId === cat.id)?.visible ?? true)).length
       + customMenus.filter(m => m.visible).length)
    : CATEGORIES.length;

  // Slug setleri: görünür üst kategoriler ve bunların alt klasörleri
  const baseCategorySlugSet = new Set(
    CATEGORIES
      .filter(cat => (categorySettings.find(s => s.categoryId === cat.id)?.visible ?? true))
      .map(cat => cat.slug)
  );
  const subcategorySlugSet = new Set(
    CATEGORIES
      .filter(cat => (categorySettings.find(s => s.categoryId === cat.id)?.visible ?? true))
      .flatMap(cat => (cat.subcategories?.map(sub => sub.slug) ?? []))
  );

  // Gönderi adetleri: üst kategorilerdeki ve alt klasörlerdeki gönderiler
  const baseCategoryPostsCount = uniquePosts.filter(p => baseCategorySlugSet.has(p.category)).length;
  const subcategoryPostsCount = uniquePosts.filter(p => subcategorySlugSet.has(p.category)).length;

  // Görsel bilgi için alt klasör toplam sayısı değil, gönderi sayısını göstereceğiz.
  const totalSubcategories = CATEGORIES.reduce((sum, cat) => sum + ((cat.subcategories?.length) ?? 0), 0);

  // Her kategori ve alt klasör için gönderi sayılarını hesapla
  const categoryPostCounts = CATEGORIES.map(cat => {
    const setting = categorySettings.find(s => s.categoryId === cat.id);
    const categorySlug = setting?.customSlug || cat.slug;
    const categoryTitle = setting?.customTitle || cat.title;
    const isVisible = setting?.visible ?? true;
    
    if (!isVisible) return null;
    
    // Ana kategorideki gönderi sayısı
    const categoryPosts = uniquePosts.filter(p => p.category === categorySlug).length;
    
    // Alt klasörlerdeki gönderi sayıları
    const subcategoryCounts = (cat.subcategories || []).map(sub => {
      const subPosts = uniquePosts.filter(p => p.category === sub.slug).length;
      return {
        title: sub.title,
        slug: sub.slug,
        count: subPosts
      };
    });
    
    const subcategoryTotal = subcategoryCounts.reduce((sum, sub) => sum + sub.count, 0);
    const total = categoryPosts + subcategoryTotal;
    
    return {
      title: categoryTitle,
      slug: categorySlug,
      count: categoryPosts,
      subcategories: subcategoryCounts,
      subcategoryTotal,
      total
    };
  }).filter(Boolean) as Array<{
    title: string;
    slug: string;
    count: number;
    subcategories: Array<{ title: string; slug: string; count: number }>;
    subcategoryTotal: number;
    total: number;
  }>;
  
  // Analiz için gönderi sayıları (görünür kategorilerdeki)
  const visiblePosts = uniquePosts.filter(p => visibleCategorySlugs.has(p.category));
  const publishedPosts = visiblePosts.filter(p => !p.status || p.status === 'published');
  const draftPosts = visiblePosts.filter(p => p.status === 'draft');
  const totalVisiblePosts = visiblePosts.length;

  // Filter posts by search query, then take first 5
  const filteredPosts = uniquePosts.filter(post => 
    searchQuery === '' || matchesSearch(post.title, searchQuery)
  );
  const recentPosts = filteredPosts.slice(0, 5);

  // Load users
  useEffect(() => {
    loadUsers();
    getCategorySettingsAction().then(setCategorySettings);
    getCustomMenusAction().then(setCustomMenus);
  }, []);

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const usersList = await getUsersAction();
      setUsers(usersList);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Calculate user statistics
  const adminCount = users.filter(u => u.role === 'admin' && u.active).length;
  const otherUsersCount = users.filter(u => u.role !== 'admin' && u.active).length;
  const totalUsers = adminCount + otherUsersCount;

  const handleDelete = (postId: string, postTitle: string) => {
    startTransition(async () => {
      const result = await deletePostAction(postId);
      
      if (result.success) {
        toast({
          title: "Gönderi Silindi!",
          description: `${postTitle} başlıklı gönderi çöp kutusuna taşındı.`,
        });
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Silme Başarısız!",
          description: result.error || "Gönderi silinirken bir hata oluştu.",
        });
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Gönderi</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" suppressHydrationWarning>{mounted ? totalPosts : ''}</div>
            <p className="text-xs text-muted-foreground mb-2">
              Tüm kategorilerdeki gönderi sayısı
            </p>
            <div className="mt-3 space-y-2 max-h-[300px] overflow-y-auto">
              {mounted && categoryPostCounts.map((cat) => (
                <div key={cat.slug} className="border-b pb-2 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{cat.title}</span>
                    <span className="text-xs font-semibold text-muted-foreground">{cat.count}</span>
                  </div>
                  {cat.subcategories.length > 0 && (
                    <div className="ml-3 mt-1 space-y-1">
                      {cat.subcategories.map((sub) => (
                        <div key={sub.slug} className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">• {sub.title}</span>
                          <span className="text-xs font-semibold text-muted-foreground">{sub.count}</span>
                        </div>
                      ))}
                      {cat.subcategoryTotal > 0 && (
                        <div className="flex items-center justify-between mt-1 pt-1 border-t">
                          <span className="text-xs font-medium text-muted-foreground">Alt Klasörler Toplamı</span>
                          <span className="text-xs font-semibold">{cat.subcategoryTotal}</span>
                        </div>
                      )}
                      {cat.total > cat.count && (
                        <div className="flex items-center justify-between mt-1 pt-1 border-t border-dashed">
                          <span className="text-xs font-semibold">{cat.title} Toplamı</span>
                          <span className="text-xs font-bold">{cat.total}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategoriler</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" suppressHydrationWarning>{mounted ? visibleCategoryCount : ''}</div>
            <p className="text-xs text-muted-foreground">
              Ana menüdeki kategori sayısı
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Alt klasörler: <span className="font-semibold" suppressHydrationWarning>{mounted ? totalSubcategories : ''}</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kullanıcılar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <div className="text-2xl font-bold">...</div>
            ) : (
              <>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold">{adminCount}</span> Yönetici
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold">{otherUsersCount}</span> Diğer Kullanıcı
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analiz</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" suppressHydrationWarning>
              {mounted ? totalVisiblePosts : ''}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <span className="font-semibold" suppressHydrationWarning>
                {mounted ? publishedPosts.length : ''}
              </span> Yayında
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold" suppressHydrationWarning>
                {mounted ? draftPosts.length : ''}
              </span> Yayında Değil
            </p>
            <p className="text-xs text-muted-foreground mt-1 pt-1 border-t">
              <span className="font-semibold" suppressHydrationWarning>
                {mounted ? totalVisiblePosts : ''}
              </span> Toplam
            </p>
            <Button size="sm" variant="outline" className="mt-3 w-full" asChild>
              <Link href="/admin/homepage">
                <Pencil className="h-4 w-4 mr-2"/>
                Analiz Ayarları
              </Link>
            </Button>
            <AnalyticsLogos />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yeni Oluştur</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button size="sm" asChild>
                <Link href="/admin/posts/new">
                    <PlusCircle className="h-4 w-4 mr-2"/>
                    Yeni Gönderi
                </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Son Gönderiler</CardTitle>
            <CardDescription>
              Siteye en son eklenen gönderiler.
            </CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="/admin/posts">
              Tümünü Gör
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Gönderilerde ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Table className="w-full table-fixed">
            <TableHeader>
                <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell"><span className="sr-only">Görsel</span></TableHead>
                <TableHead className="w-[35%]">Başlık</TableHead>
                <TableHead className="w-[120px] whitespace-nowrap">Durum</TableHead>
                <TableHead className="hidden md:table-cell w-[180px] whitespace-nowrap">Kategori</TableHead>
                <TableHead className="hidden md:table-cell w-[180px] whitespace-nowrap">Oluşturulma</TableHead>
                <TableHead>
                  <span className="sr-only">Eylemler</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPosts.map((post) => {
                  // Find category by slug (check both original and custom slugs)
                  let category = CATEGORIES.find(c => c.slug === post.category) || 
                                 CATEGORIES.flatMap(c => c.subcategories || []).find(s => s.slug === post.category);
                  
                  // If not found, check custom slugs
                  if (!category) {
                    const categoryWithCustomSlug = CATEGORIES.find(c => {
                      const setting = categorySettings.find(s => s.categoryId === c.id);
                      return setting?.customSlug === post.category;
                    });
                    if (categoryWithCustomSlug) {
                      category = categoryWithCustomSlug;
                    }
                  }
                  
                  // Get category/menu setting for display
                  const categorySetting = category ? categorySettings.find(s => s.categoryId === category.id) : undefined;
                  let displayTitle = categorySetting?.customTitle || category?.title;
                  if (!displayTitle) {
                    const postCatLc = normalizeSlug(post.category);
                    const menuMatch = customMenus.find(m => {
                      if (!m.visible || !m.href) return false;
                      const hrefSlug = normalizeSlug(m.href);
                      return hrefSlug === postCatLc;
                    });
                    if (menuMatch) {
                      displayTitle = menuMatch.label;
                    }
                  }
                  if (!displayTitle) {
                    const slug = normalizeSlug(post.category);
                    if (slug === 'fotograflar') {
                      displayTitle = 'Fotograflar';
                    }
                  }
                  displayTitle = displayTitle || 'Bilinmeyen';
                  
                  const primaryImageId = post.imageId || (post.imageIds && post.imageIds.length > 0 ? post.imageIds[0] : undefined);
                  const image = primaryImageId ? PlaceHolderImages.find(img => img.id === primaryImageId) : undefined;
                  return (
                    <TableRow key={post.id}>
                        <TableCell className="hidden sm:table-cell">
                          {image && (
                            <Link href={`/admin/posts/${post.id}/edit`}>
                              <Image
                                alt={post.title}
                                className="aspect-square rounded-md object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                height="48"
                                src={image.imageUrl}
                                width="48"
                                data-ai-hint={image.imageHint}
                                unoptimized={image.imageUrl.startsWith('/uploads/')}
                              />
                            </Link>
                          )}
                        </TableCell>
                        <TableCell className="font-medium max-w-[320px] truncate">
                          {(() => {
                            const anyPost:any = post as any;
                            const videoId = anyPost.youtubeVideoId || (anyPost.youtubeVideoIds && anyPost.youtubeVideoIds[0]);
                            const videoThumb = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '';
                            return (
                              <Link href={`/admin/posts/${post.id}/edit`} className="hover:text-primary transition-colors inline-flex items-center gap-2">
                                {videoThumb && (
                                  <img src={videoThumb} alt="video" className="h-8 w-12 object-cover rounded-sm border" />
                                )}
                                <span className="truncate">{post.title}</span>
                              </Link>
                            );
                          })()}
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={post.status || 'published'}
                            onValueChange={(value: 'published' | 'draft') => {
                              startTransition(async () => {
                                const result = await updatePostStatusAction(post.id, value);
                                if (result.success) {
                                  toast({
                                    title: 'Durum Güncellendi!',
                                    description: `Gönderi durumu "${value === 'published' ? 'Yayında' : 'Yayında Değil'}" olarak güncellendi.`,
                                  });
                                  router.refresh();
                                } else {
                                  toast({
                                    variant: 'destructive',
                                    title: 'Güncelleme Başarısız!',
                                    description: result.error || 'Bir hata oluştu.',
                                  });
                                }
                              });
                            }}
                            disabled={isPending}
                          >
                            <SelectTrigger 
                              className={`min-w-[110px] w-auto px-2 whitespace-nowrap ${
                                post.status === 'draft' 
                                  ? 'bg-red-600 text-white hover:bg-red-700 border-red-600' 
                                  : 'bg-green-600 text-white hover:bg-green-700 border-green-600'
                              }`}
                            >
                              <SelectValue>
                                {post.status === 'draft' ? 'Yayında Değil' : 'Yayında'}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="published">Yayında</SelectItem>
                              <SelectItem value="draft">Yayında Değil</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Select
                            value={post.category}
                            onValueChange={(newCat) => {
                              startTransition(async () => {
                                const updated = { ...post, category: newCat } as typeof post;
                                const res = await updatePostAction(updated);
                                if (res.success) {
                                  toast({ title: 'Kategori Güncellendi', description: 'Gönderi kategorisi değiştirildi.' });
                                  router.refresh();
                                } else {
                                  toast({ variant: 'destructive', title: 'Güncelleme Başarısız', description: res.error || 'Bir hata oluştu.' });
                                }
                              });
                            }}
                            disabled={isPending}
                          >
                            <SelectTrigger className="min-w-[140px] w-auto px-2 whitespace-nowrap">
                              <SelectValue>{displayTitle}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES
                                .map(cat => {
                                  const setting = categorySettings.find(s => s.categoryId === cat.id);
                                  return {
                                    ...cat,
                                    title: setting?.customTitle || cat.title,
                                    slug: setting?.customSlug || cat.slug,
                                    visible: setting?.visible ?? true,
                                    order: setting?.order ?? 0,
                                  };
                                })
                                .filter(cat => cat.visible)
                                .sort((a, b) => a.order - b.order)
                                .map(cat => (
                                  <SelectItem key={cat.id} value={normalizeSlug(cat.slug)}>{cat.title}</SelectItem>
                                ))}
                              {customMenus
                                .filter(m => m.visible)
                                .sort((a,b) => a.order - b.order)
                                .map(menu => {
                                  const slug = menu.href.replace(/^\//, '').toLowerCase();
                                  return (
                                    <SelectItem key={menu.id} value={slug}>{menu.label}</SelectItem>
                                  );
                                })}
                              {CATEGORIES.flatMap(c => {
                                const parentSetting = categorySettings.find(s => s.categoryId === c.id);
                                return (c.subcategories || []).map(sub => ({
                                  ...sub,
                                  title: sub.title,
                                  slug: sub.slug,
                                }));
                              }).map(sub => (
                                <SelectItem key={sub.id} value={normalizeSlug(sub.slug)}>{sub.title}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="hidden md:table-cell whitespace-nowrap">
                          {(() => {
                            try {
                              const date = new Date(post.createdAt);
                              const dateValue = isNaN(date.getTime()) ? '' : date.toISOString().slice(0,16);
                              return (
                                <input
                                  type="datetime-local"
                                  className="border rounded-md px-2 py-1 text-sm w-[180px] no-picker"
                                  value={dateValue}
                                  onChange={(e) => {
                                    if (!e.target.value) return;
                                    
                                    const date = new Date(e.target.value);
                                    if (isNaN(date.getTime())) {
                                      toast({
                                        variant: 'destructive',
                                        title: 'Geçersiz Tarih',
                                        description: 'Lütfen geçerli bir tarih seçin.',
                                      });
                                      return;
                                    }
                                    
                                    const iso = date.toISOString();
                                    startTransition(async () => {
                                      const res = await updatePostAction({ ...post, createdAt: iso } as typeof post);
                                      if (res.success) {
                                        toast({ title: 'Tarih Güncellendi', description: 'Oluşturulma tarihi güncellendi.' });
                                        router.refresh();
                                      } else {
                                        toast({ variant: 'destructive', title: 'Güncelleme Başarısız', description: res.error || 'Bir hata oluştu.' });
                                      }
                                    });
                                  }}
                                  disabled={isPending}
                                />
                              );
                            } catch (error) {
                              return (
                                <input
                                  type="datetime-local"
                                  className="border rounded-md px-2 py-1 text-sm w-[180px] no-picker"
                                  value=""
                                  disabled
                                />
                              );
                            }
                          })()}
                        </TableCell>
                        
                        <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Eylemler</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/posts/${post.id}/edit`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Düzenle
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <Link href={`/${post.category}/${post.slug}`} target="_blank" rel="noopener noreferrer">
                                    <ArrowUpRight className="mr-2 h-4 w-4" />
                                    Görüntüle
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                      className="text-destructive focus:text-destructive"
                                      onSelect={(e) => e.preventDefault()}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Kaldır
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Gönderiyi Kaldırmak İstediğinizden Emin misiniz?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Bu işlem geri alınamaz. Gönderi kalıcı olarak silinecektir.
                                        <span className="block mt-2 font-semibold">
                                          Gönderi: {post.title}
                                        </span>
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel disabled={isPending}>İptal</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(post.id, post.title)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        disabled={isPending}
                                      >
                                        {isPending ? 'Siliniyor...' : 'Kaldır'}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                  )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
