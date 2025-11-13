'use client';

import Image from "next/image"
import Link from "next/link"
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Trash2,
  RotateCcw,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import * as React from "react";
import { POSTS, CATEGORIES } from "@/lib/data"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import type { ImagePlaceholder } from "@/lib/placeholder-images"
import { 
  getDeletedPostsAction, 
  restorePostAction, 
  permanentlyDeletePostAction,
  deletePostAction,
  updatePostStatusAction,
  updatePostAction,
  updatePostOrderAction,
  swapPostDatesAction,
  emptyDeletedPostsAction,
  getPlaceholderImagesAction
} from "@/app/actions";
import { getCategorySettingsAction, getCustomMenusAction } from "@/app/actions";
import initialCustomMenus from "@/lib/custom-menus.json";
import initialCategorySettings from "@/lib/category-settings.json";
import type { CategorySettings, CustomMenu } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
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
} from "@/components/ui/alert-dialog";
import type { Post } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { matchesSearch } from "@/lib/search-utils";

export default function AdminPostsPage() {
  const [deletedPosts, setDeletedPosts] = React.useState<(Post & { deletedAt: string })[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const [categorySettings, setCategorySettings] = React.useState<CategorySettings[]>(() => {
    try { return (initialCategorySettings as unknown as CategorySettings[]).slice().sort((a,b)=>a.order-b.order); } catch { return []; }
  });
  const [customMenus, setCustomMenus] = React.useState<CustomMenu[]>(() => {
    try { return (initialCustomMenus as unknown as CustomMenu[]).slice().sort((a,b)=>a.order-b.order); } catch { return []; }
  });
  const [availableImages, setAvailableImages] = React.useState<ImagePlaceholder[]>(PlaceHolderImages);
  const [searchQuery, setSearchQuery] = React.useState('');
  // Pagination: 50 items per page
  const pageSize = 50;
  const [page, setPage] = React.useState(0);
  const [showAll, setShowAll] = React.useState(false);
  
  // Sorting state
  const [sortColumn, setSortColumn] = React.useState<'title' | 'status' | 'category' | 'createdAt' | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  
  // Drag & drop state for reordering
  const [draggingPostId, setDraggingPostId] = React.useState<string | null>(null);

  // Export posts function
  const handleExportPosts = () => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        totalPosts: POSTS.length,
        posts: POSTS,
        categories: CATEGORIES
      };
      
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      link.download = `gonderiler-yedek-${timestamp}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Yedek Alındı',
        description: `${POSTS.length} gönderi başarıyla yedeklendi.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Yedek alma işlemi başarısız oldu.',
      });
    }
  };

  const movePost = (postId: string, direction: 'up' | 'down', currentOrder: number) => {
    // Swap createdAt with neighbor in the current visible list
    const list = showAll ? filteredPosts : pagedPosts;
    const idx = list.findIndex(p => p.id === postId);
    if (idx < 0) return;
    const neighborIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (neighborIdx < 0 || neighborIdx >= list.length) return;
    const neighbor = list[neighborIdx];
    startTransition(async () => {
      const res = await swapPostDatesAction(postId, neighbor.id);
      if (res.success) {
        toast({ title: 'Sıra Güncellendi', description: 'Oluşturulma tarihleri takas edildi.' });
        router.refresh();
      } else {
        toast({ variant: 'destructive', title: 'Güncelleme Başarısız', description: res.error || 'Bir hata oluştu.' });
      }
    });
  };
  
  // Filter and sort posts by search query and status
  const filteredPosts = React.useMemo(() => {
    let posts = POSTS.map((post) => ({ ...post }));

    // Filter by search query
    if (searchQuery !== '') {
      posts = posts.filter(post => matchesSearch(post.title, searchQuery));
    }
    
    // Sort posts by selected column, otherwise default to createdAt DESC
    if (sortColumn) {
      posts.sort((a, b) => {
        let aValue: any;
        let bValue: any;
        
        switch (sortColumn) {
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case 'status':
            aValue = a.status || 'published';
            bValue = b.status || 'published';
            break;
          case 'category':
            aValue = a.category.toLowerCase();
            bValue = b.category.toLowerCase();
            break;
          case 'createdAt':
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          default:
            return 0;
        }
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      posts.sort((a, b) => {
        const at = new Date(a.createdAt).getTime();
        const bt = new Date(b.createdAt).getTime();
        return (isNaN(bt) ? 0 : bt) - (isNaN(at) ? 0 : at);
      });
    }
    
    return posts;
  }, [searchQuery, sortColumn, sortDirection]);
  
  // Filter deleted posts by search query
  const filteredDeletedPosts = React.useMemo(() => {
    if (searchQuery === '') return deletedPosts;
    return deletedPosts.filter(post => matchesSearch(post.title, searchQuery));
  }, [searchQuery, deletedPosts]);

  // Pagination slices for main list
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedPosts = React.useMemo(() => filteredPosts.slice(startIndex, endIndex), [filteredPosts, startIndex, endIndex]);

  const getCategorySetting = (categoryId: string): CategorySettings | undefined => {
    return categorySettings.find(s => s.categoryId === categoryId);
  };

  const normalizeSlug = (value?: string) => String(value || '')
    .trim()
    .replace(/^\//, '')
    .toLowerCase();
  
  // Sorting handler
  const handleSort = (column: 'title' | 'status' | 'category' | 'createdAt') => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column with ascending direction
      setSortColumn(column);
      setSortDirection('asc');
    }
    setPage(0); // Reset to first page when sorting changes
  };
  
  // Get sort icon
  const getSortIcon = (column: 'title' | 'status' | 'category' | 'createdAt') => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-3 w-3 ml-1" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-3 w-3 ml-1" />
      : <ArrowDown className="h-3 w-3 ml-1" />;
  };

  const visibleCategories = React.useMemo(() => {
    return CATEGORIES
      .map(cat => {
        const setting = getCategorySetting(cat.id);
        return {
        ...cat,
          title: setting?.customTitle || cat.title,
          slug: setting?.customSlug || cat.slug,
          visible: setting?.visible ?? true,
          order: setting?.order ?? 0,
        };
      })
      .filter(cat => cat.visible)
      .sort((a, b) => a.order - b.order);
  }, [categorySettings]);

  React.useEffect(() => {
    getDeletedPostsAction().then(setDeletedPosts);
    getCategorySettingsAction().then(setCategorySettings);
    getCustomMenusAction().then(setCustomMenus);
    getPlaceholderImagesAction().then(setAvailableImages);
  }, []);

  const handleRestore = (postId: string) => {
    startTransition(async () => {
      const result = await restorePostAction(postId);
      if (result.success) {
        setDeletedPosts(deletedPosts.filter(p => p.id !== postId));
        toast({
          title: 'Gönderi Geri Yüklendi!',
          description: 'Gönderi başarıyla geri yüklendi.',
        });
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: 'Geri Yükleme Başarısız!',
          description: result.error || 'Bir hata oluştu.',
        });
      }
    });
  };

  const handleOrderChange = async (postId: string, newOrder: number) => {
    if (newOrder < 1) {
      toast({
        variant: 'destructive',
        title: 'Geçersiz Sıra!',
        description: 'Sıra numarası 1\'den küçük olamaz.',
      });
      return;
    }

    startTransition(async () => {
      const result = await updatePostOrderAction(postId, newOrder);
      if (result.success) {
        toast({
          title: 'Sıra Güncellendi!',
          description: 'Gönderi sırası başarıyla güncellendi.',
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
  };

  const handleDelete = (postId: string, postTitle: string) => {
    startTransition(async () => {
      const result = await deletePostAction(postId);
      if (result.success) {
        getDeletedPostsAction().then(setDeletedPosts);
        toast({
          title: 'Gönderi Silindi!',
          description: `${postTitle} başlıklı gönderi çöp kutusuna taşındı.`,
        });
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: 'Silme Başarısız!',
          description: result.error || 'Bir hata oluştu.',
        });
      }
    });
  };

  const handlePermanentlyDelete = (postId: string) => {
    startTransition(async () => {
      const result = await permanentlyDeletePostAction(postId);
      if (result.success) {
        setDeletedPosts(deletedPosts.filter(p => p.id !== postId));
        toast({
          title: 'Gönderi Kalıcı Olarak Silindi!',
          description: 'Gönderi kalıcı olarak silindi.',
        });
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: 'Silme Başarısız!',
          description: result.error || 'Bir hata oluştu.',
        });
      }
    });
  };

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">Tümü</TabsTrigger>
          <TabsTrigger value="active">Yayında</TabsTrigger>
          <TabsTrigger value="draft">Taslak</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Arşivlenmiş
          </TabsTrigger>
          <TabsTrigger value="trash">
            <Trash2 className="h-4 w-4 mr-2" />
            Çöp Kutusu ({deletedPosts.length})
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filtrele
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Kategoriye göre filtrele</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {CATEGORIES.map(cat => (
                 <DropdownMenuCheckboxItem key={cat.id}>{cat.title}</DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 gap-1"
            onClick={handleExportPosts}
            disabled={isPending || POSTS.length === 0}
          >
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Dışa Aktar
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1" asChild>
            <Link href="/admin/posts/new">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Yeni Gönderi
              </span>
            </Link>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Gönderiler</CardTitle>
            <CardDescription>
              Sitenizdeki gönderileri yönetin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Gönderilerde ara... (tüm gönderilerde)"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                    className="pl-9"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setShowAll(true); }}
                >
                  Tümünü Gör
                </Button>
                {showAll && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setShowAll(false); }}
                  >
                    Standart Görünüm
                  </Button>
                )}
              </div>
            </div>
            {/* Üst navigasyon: Önceki/Sonraki 50 (grubun üstünde) */}
            <div className="flex items-center justify-between mb-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0 || showAll}
              >
                Önceki 50
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage(prev => prev + 1)}
                disabled={endIndex >= filteredPosts.length || showAll}
              >
                Sonraki 50
              </Button>
            </div>

            <Table className="w-full table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px] text-center">
                    <span className="sr-only">Sırala</span>
                  </TableHead>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Görsel</span>
                  </TableHead>
                  <TableHead className="w-[35%]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('title')}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      Başlık
                      {getSortIcon('title')}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[120px] whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('status')}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      Durum
                      {getSortIcon('status')}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell w-[180px] whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('category')}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      Kategori
                      {getSortIcon('category')}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell w-[180px] whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('createdAt')}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      Oluşturulma
                      {getSortIcon('createdAt')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Eylemler</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(showAll ? filteredPosts : pagedPosts).map((post, idx) => {
                     const rowNumber = startIndex + idx + 1;
                     const primaryImageId = post.imageId || (post.imageIds && post.imageIds.length > 0 ? post.imageIds[0] : undefined);
                     const image = primaryImageId ? availableImages.find(img => img.id === primaryImageId) : undefined;
                     
                     // Find category by slug (check both original and custom slugs)
                     let category = CATEGORIES.find(c => c.slug === post.category) || 
                                    CATEGORIES.flatMap(c => c.subcategories || []).find(s => s.slug === post.category);
                     
                     // If not found, check custom slugs
                     if (!category) {
                       const categoryWithCustomSlug = CATEGORIES.find(c => {
                         const setting = getCategorySetting(c.id);
                         return setting?.customSlug === post.category;
                       });
                       if (categoryWithCustomSlug) {
                         category = categoryWithCustomSlug;
                       }
                     }
                     
                    // Get category/menu setting for display
                    const categorySetting = category ? getCategorySetting(category.id) : undefined;
                    let displayTitle = categorySetting?.customTitle || category?.title;
                    if (!displayTitle) {
                      const postCatNormalized = normalizeSlug(post.category);
                      const menuMatch = customMenus.find(m => {
                        if (!m.visible || !m.href) return false;
                        const menuSlug = normalizeSlug(m.href);
                        return menuSlug === postCatNormalized;
                      });
                      if (menuMatch) {
                        displayTitle = menuMatch.label;
                      }
                    }
                    displayTitle = displayTitle || 'Bilinmeyen';
                     
                     const currentOrder = post.order ?? rowNumber;
                     
                     return (
                        <TableRow 
                          key={post.id}
                          draggable
                          onDragStart={() => setDraggingPostId(post.id)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (!draggingPostId || draggingPostId === post.id) return;
                            // Kaynak ve hedef sıraları bul
                            const list = (showAll ? filteredPosts : pagedPosts);
                            const sourceIndex = list.findIndex(p => p.id === draggingPostId);
                            const source = sourceIndex >= 0 ? list[sourceIndex] : undefined;
                            const target = post;
                            const computedSourceOrder = source ? (source.order ?? (startIndex + sourceIndex + 1)) : 0;
                            const targetOrder = (target?.order ?? currentOrder) || currentOrder;
                            if (computedSourceOrder && targetOrder && computedSourceOrder !== targetOrder) {
                              handleOrderChange(draggingPostId, targetOrder);
                            }
                            setDraggingPostId(null);
                          }}
                          className={draggingPostId === post.id ? "opacity-60" : ""}
                        >
                            <TableCell className="text-center">
                              <div className="inline-flex flex-col items-center gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6"
                                  title="Yukarı taşı"
                                  onClick={() => movePost(post.id, 'up', currentOrder)}
                                >
                                  <ArrowUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6"
                                  title="Aşağı taşı"
                                  onClick={() => movePost(post.id, 'down', currentOrder)}
                                >
                                  <ArrowDown className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                {image && <Image
                                alt={post.title}
                                className="aspect-square rounded-md object-cover"
                                height="48"
                                src={image.imageUrl}
                                width="48"
                                data-ai-hint={image.imageHint}
                                unoptimized={image.imageUrl.startsWith('/uploads/')}
                                />}
                            </TableCell>
                            <TableCell className="font-medium max-w-[320px] truncate">
                                {(() => {
                                  const videoId = (post as any).youtubeVideoId || ((post as any).youtubeVideoIds && (post as any).youtubeVideoIds[0]);
                                  const videoThumb = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '';
                                  return (
                                    <Link href={`/admin/posts/${post.id}/edit`} className="hover:text-primary transition-colors inline-flex items-center gap-2">
                                      {videoThumb && (
                                        // Video gönderileri için küçük önizleme
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
                                      const updated = { ...post, category: newCat } as Post;
                                      const res = await updatePostAction(updated);
                                      if (res.success) {
                                        toast({ title: 'Kategori Güncellendi', description: 'Gönderi kategorisi değiştirildi.' });
                                        router.refresh();
                                      } else {
                                        toast({ variant: 'destructive', title: 'Güncelleme Başarısız', description: res.error || 'Bir hata oluştu.' });
                                      }
                                    });
                                  }}
                                >
                                  <SelectTrigger className="min-w-[140px] w-auto px-2 whitespace-nowrap">
                                    <SelectValue>
                                      {(() => {
                                        // Find category by slug (check both original and custom slugs)
                                        let foundCategory = CATEGORIES.find(c => c.slug === post.category) || 
                                                             CATEGORIES.flatMap(c => c.subcategories || []).find(s => s.slug === post.category);
                                        
                                        if (!foundCategory) {
                                          const categoryWithCustomSlug = CATEGORIES.find(c => {
                                            const setting = getCategorySetting(c.id);
                                            return setting?.customSlug === post.category;
                                          });
                                          if (categoryWithCustomSlug) {
                                            foundCategory = categoryWithCustomSlug;
                                          }
                                        }
                                        
                                        // Check custom menus if category not found
                                        if (!foundCategory) {
                                          const postCatNormalized = normalizeSlug(post.category);
                                          const menuMatch = customMenus.find(m => {
                                            if (!m.visible || !m.href) return false;
                                            const menuSlug = normalizeSlug(m.href);
                                            return menuSlug === postCatNormalized;
                                          });
                                          if (menuMatch) {
                                            return menuMatch.label;
                                          }
                                        }
                                        
                                        const categorySetting = foundCategory ? getCategorySetting(foundCategory.id) : undefined;
                                        return categorySetting?.customTitle || foundCategory?.title || 'Bilinmeyen';
                                      })()}
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {visibleCategories.map(cat => (
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
                                    {CATEGORIES.flatMap(c => c.subcategories || []).map(sub => (
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
                                      className="border rounded-md px-2 py-1 text-sm w-[180px] no-picker cursor-text"
                                      value={dateValue}
                                      onChange={(e) => {
                                        // Sadece input değerini güncelle, kaydetme
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          const value = e.currentTarget.value;
                                          if (!value) return;
                                          
                                          const date = new Date(value);
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
                                            const res = await updatePostAction({ ...post, createdAt: iso } as Post);
                                            if (res.success) {
                                              toast({ title: 'Tarih Güncellendi', description: 'Oluşturulma tarihi güncellendi.' });
                                              router.refresh();
                                            } else {
                                              toast({ variant: 'destructive', title: 'Güncelleme Başarısız', description: res.error || 'Bir hata oluştu.' });
                                            }
                                          });
                                          e.currentTarget.blur();
                                        }
                                      }}
                                      onBlur={(e) => {
                                        const value = e.currentTarget.value;
                                        if (value && value !== dateValue) {
                                          const date = new Date(value);
                                          if (!isNaN(date.getTime())) {
                                            const iso = date.toISOString();
                                            startTransition(async () => {
                                              const res = await updatePostAction({ ...post, createdAt: iso } as Post);
                                              if (res.success) {
                                                toast({ title: 'Tarih Güncellendi', description: 'Oluşturulma tarihi güncellendi.' });
                                                router.refresh();
                                              } else {
                                                toast({ variant: 'destructive', title: 'Güncelleme Başarısız', description: res.error || 'Bir hata oluştu.' });
                                              }
                                            });
                                          }
                                        }
                                      }}
                                      onClick={(e) => {
                                        e.currentTarget.focus();
                                        e.currentTarget.select();
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
                                            Düzenle
                                        </Link>
                                    </DropdownMenuItem>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem 
                                          className="text-destructive focus:text-destructive"
                                          onSelect={(e) => e.preventDefault()}
                                        >
                                          Sil
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Gönderiyi Silmek İstediğinizden Emin misiniz?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Gönderi çöp kutusuna taşınacaktır. Daha sonra geri yükleyebilir veya kalıcı olarak silebilirsiniz.
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
                                            {isPending ? 'Siliniyor...' : 'Sil'}
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
            <div className="flex items-center justify-between mt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0 || showAll}
              >
                Önceki 50
              </Button>
              <div className="text-xs text-muted-foreground">
                {filteredPosts.length > 0 && (
                  <>Gösterilen: {Math.min(endIndex, filteredPosts.length)} / {filteredPosts.length}</>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => setPage(0)} disabled={page === 0 || showAll}>
                  En Başa Dön
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={endIndex >= filteredPosts.length || showAll}
                >
                  Sonraki 50
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              <strong>{filteredPosts.length}</strong> / {POSTS.length} gönderi gösteriliyor
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="active">
        <Card>
          <CardHeader>
            <CardTitle>Yayında Olan Gönderiler</CardTitle>
            <CardDescription>
              Yayında olan gönderileri yönetin.
            </CardDescription>
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
                  <TableHead className="w-[60px] text-center">
                    <span className="sr-only">Sırala</span>
                  </TableHead>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Görsel</span>
                  </TableHead>
                  <TableHead className="w-[35%]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('title')}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      Başlık
                      {getSortIcon('title')}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[120px] whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('status')}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      Durum
                      {getSortIcon('status')}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell w-[180px] whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('category')}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      Kategori
                      {getSortIcon('category')}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell w-[180px] whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('createdAt')}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      Oluşturulma
                      {getSortIcon('createdAt')}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[60px] text-center">
                    <span className="sr-only">Sırala</span>
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Eylemler</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.filter(post => !post.status || post.status === 'published').map(post => {
                     const primaryImageId = post.imageId || (post.imageIds && post.imageIds.length > 0 ? post.imageIds[0] : undefined);
                     const image = primaryImageId ? availableImages.find(img => img.id === primaryImageId) : undefined;
                     const category = CATEGORIES.find(c => c.slug === post.category) || CATEGORIES.flatMap(c => c.subcategories || []).find(s => s.slug === post.category);
                    return (
                        <TableRow key={post.id}>
                            <TableCell className="text-center">
                              <div className="inline-flex flex-col items-center gap-1">
                                <Button size="icon" variant="ghost" className="h-6 w-6" title="Yukarı taşı" onClick={() => movePost(post.id, 'up', (post as any).order ?? 0)}>
                                  <ArrowUp className="h-3 w-3" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-6 w-6" title="Aşağı taşı" onClick={() => movePost(post.id, 'down', (post as any).order ?? 0)}>
                                  <ArrowDown className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                {image && <Image
                                alt={post.title}
                                className="aspect-square rounded-md object-cover"
                                height="48"
                                src={image.imageUrl}
                                width="48"
                                data-ai-hint={image.imageHint}
                                unoptimized={image.imageUrl.startsWith('/uploads/')}
                                />}
                            </TableCell>
                            <TableCell className="font-medium max-w-[320px] truncate">
                                <Link href={`/admin/posts/${post.id}/edit`} className="hover:text-primary transition-colors">
                                {post.title}
                                </Link>
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
                                      const updated = { ...post, category: newCat } as Post;
                                      const res = await updatePostAction(updated);
                                      if (res.success) {
                                        toast({ title: 'Kategori Güncellendi', description: 'Gönderi kategorisi değiştirildi.' });
                                        router.refresh();
                                      } else {
                                        toast({ variant: 'destructive', title: 'Güncelleme Başarısız', description: res.error || 'Bir hata oluştu.' });
                                      }
                                    });
                                  }}
                                >
                                  <SelectTrigger className="min-w-[140px] w-auto px-2 whitespace-nowrap">
                                    <SelectValue>
                                      {(() => {
                                        // Find category by slug (check both original and custom slugs)
                                        let foundCategory = CATEGORIES.find(c => c.slug === post.category) || 
                                                             CATEGORIES.flatMap(c => c.subcategories || []).find(s => s.slug === post.category);
                                        
                                        if (!foundCategory) {
                                          const categoryWithCustomSlug = CATEGORIES.find(c => {
                                            const setting = getCategorySetting(c.id);
                                            return setting?.customSlug === post.category;
                                          });
                                          if (categoryWithCustomSlug) {
                                            foundCategory = categoryWithCustomSlug;
                                          }
                                        }
                                        
                                        // Check custom menus if category not found
                                        if (!foundCategory) {
                                          const postCatNormalized = normalizeSlug(post.category);
                                          const menuMatch = customMenus.find(m => {
                                            if (!m.visible || !m.href) return false;
                                            const menuSlug = normalizeSlug(m.href);
                                            return menuSlug === postCatNormalized;
                                          });
                                          if (menuMatch) {
                                            return menuMatch.label;
                                          }
                                        }
                                        
                                        const categorySetting = foundCategory ? getCategorySetting(foundCategory.id) : undefined;
                                        return categorySetting?.customTitle || foundCategory?.title || 'Bilinmeyen';
                                      })()}
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {visibleCategories.map(cat => (
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
                                    {CATEGORIES.flatMap(c => c.subcategories || []).map(sub => (
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
                                      className="border rounded-md px-2 py-1 text-sm w-[180px] no-picker cursor-text"
                                      value={dateValue}
                                      onChange={(e) => {
                                        // Sadece input değerini güncelle, kaydetme
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          const value = e.currentTarget.value;
                                          if (!value) return;
                                          
                                          const date = new Date(value);
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
                                            const res = await updatePostAction({ ...post, createdAt: iso } as Post);
                                            if (res.success) {
                                              toast({ title: 'Tarih Güncellendi', description: 'Oluşturulma tarihi güncellendi.' });
                                              router.refresh();
                                            } else {
                                              toast({ variant: 'destructive', title: 'Güncelleme Başarısız', description: res.error || 'Bir hata oluştu.' });
                                            }
                                          });
                                          e.currentTarget.blur();
                                        }
                                      }}
                                      onBlur={(e) => {
                                        const value = e.currentTarget.value;
                                        if (value && value !== dateValue) {
                                          const date = new Date(value);
                                          if (!isNaN(date.getTime())) {
                                            const iso = date.toISOString();
                                            startTransition(async () => {
                                              const res = await updatePostAction({ ...post, createdAt: iso } as Post);
                                              if (res.success) {
                                                toast({ title: 'Tarih Güncellendi', description: 'Oluşturulma tarihi güncellendi.' });
                                                router.refresh();
                                              } else {
                                                toast({ variant: 'destructive', title: 'Güncelleme Başarısız', description: res.error || 'Bir hata oluştu.' });
                                              }
                                            });
                                          }
                                        }
                                      }}
                                      onClick={(e) => {
                                        e.currentTarget.focus();
                                        e.currentTarget.select();
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
                                            Düzenle
                                        </Link>
                                    </DropdownMenuItem>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem 
                                          className="text-destructive focus:text-destructive"
                                          onSelect={(e) => e.preventDefault()}
                                        >
                                          Sil
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Gönderiyi Silmek İstediğinizden Emin misiniz?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Gönderi çöp kutusuna taşınacaktır. Daha sonra geri yükleyebilir veya kalıcı olarak silebilirsiniz.
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
                                            {isPending ? 'Siliniyor...' : 'Sil'}
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
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              <strong>{filteredPosts.filter(post => !post.status || post.status === 'published').length}</strong> / {POSTS.filter(post => !post.status || post.status === 'published').length} gönderi gösteriliyor
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="draft">
        <Card>
          <CardHeader>
            <CardTitle>Taslak Gönderiler</CardTitle>
            <CardDescription>
              Taslak gönderileri yönetin.
            </CardDescription>
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
                  <TableHead className="w-[60px] text-center">
                    <span className="sr-only">Sırala</span>
                  </TableHead>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Görsel</span>
                  </TableHead>
                  <TableHead className="w-[35%]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('title')}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      Başlık
                      {getSortIcon('title')}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[120px] whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('status')}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      Durum
                      {getSortIcon('status')}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell w-[180px] whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('category')}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      Kategori
                      {getSortIcon('category')}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell w-[180px] whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('createdAt')}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      Oluşturulma
                      {getSortIcon('createdAt')}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[60px] text-center">
                    <span className="sr-only">Sırala</span>
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Eylemler</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.filter(post => post.status === 'draft').map(post => {
                     const primaryImageId = post.imageId || (post.imageIds && post.imageIds.length > 0 ? post.imageIds[0] : undefined);
                     const image = primaryImageId ? availableImages.find(img => img.id === primaryImageId) : undefined;
                     
                     // Find category by slug (check both original and custom slugs)
                     let category = CATEGORIES.find(c => c.slug === post.category) || 
                                    CATEGORIES.flatMap(c => c.subcategories || []).find(s => s.slug === post.category);
                     
                     // If not found, check custom slugs
                     if (!category) {
                       const categoryWithCustomSlug = CATEGORIES.find(c => {
                         const setting = getCategorySetting(c.id);
                         return setting?.customSlug === post.category;
                       });
                       if (categoryWithCustomSlug) {
                         category = categoryWithCustomSlug;
                       }
                     }
                     
                     // Get category setting for display
                     const categorySetting = category ? getCategorySetting(category.id) : undefined;
                     let displayTitle = categorySetting?.customTitle || category?.title;
                     if (!displayTitle) {
                       const postCatNormalized = normalizeSlug(post.category);
                       const menuMatch = customMenus.find(m => {
                         if (!m.visible || !m.href) return false;
                         const menuSlug = normalizeSlug(m.href);
                         return menuSlug === postCatNormalized;
                       });
                       if (menuMatch) {
                         displayTitle = menuMatch.label;
                       }
                     }
                     displayTitle = displayTitle || 'Bilinmeyen';
                     
                     return (
                        <TableRow key={post.id}>
                            <TableCell className="text-center">
                              <div className="inline-flex flex-col items-center gap-1">
                                <Button size="icon" variant="ghost" className="h-6 w-6" title="Yukarı taşı" onClick={() => movePost(post.id, 'up', (post as any).order ?? 0)}>
                                  <ArrowUp className="h-3 w-3" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-6 w-6" title="Aşağı taşı" onClick={() => movePost(post.id, 'down', (post as any).order ?? 0)}>
                                  <ArrowDown className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                {image && <Image
                                alt={post.title}
                                className="aspect-square rounded-md object-cover"
                                height="48"
                                src={image.imageUrl}
                                width="48"
                                data-ai-hint={image.imageHint}
                                unoptimized={image.imageUrl.startsWith('/uploads/')}
                                />}
                            </TableCell>
                            <TableCell className="font-medium max-w-[320px] truncate">
                                <Link href={`/admin/posts/${post.id}/edit`} className="hover:text-primary transition-colors">
                                    {post.title}
                                </Link>
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
                                      const updated = { ...post, category: newCat } as Post;
                                      const res = await updatePostAction(updated);
                                      if (res.success) {
                                        toast({ title: 'Kategori Güncellendi', description: 'Gönderi kategorisi değiştirildi.' });
                                        router.refresh();
                                      } else {
                                        toast({ variant: 'destructive', title: 'Güncelleme Başarısız', description: res.error || 'Bir hata oluştu.' });
                                      }
                                    });
                                  }}
                                >
                                  <SelectTrigger className="min-w-[140px] w-auto px-2 whitespace-nowrap">
                                    <SelectValue>
                                      {(() => {
                                        // Find category by slug (check both original and custom slugs)
                                        let foundCategory = CATEGORIES.find(c => c.slug === post.category) || 
                                                             CATEGORIES.flatMap(c => c.subcategories || []).find(s => s.slug === post.category);
                                        
                                        if (!foundCategory) {
                                          const categoryWithCustomSlug = CATEGORIES.find(c => {
                                            const setting = getCategorySetting(c.id);
                                            return setting?.customSlug === post.category;
                                          });
                                          if (categoryWithCustomSlug) {
                                            foundCategory = categoryWithCustomSlug;
                                          }
                                        }
                                        
                                        // Check custom menus if category not found
                                        if (!foundCategory) {
                                          const postCatNormalized = normalizeSlug(post.category);
                                          const menuMatch = customMenus.find(m => {
                                            if (!m.visible || !m.href) return false;
                                            const menuSlug = normalizeSlug(m.href);
                                            return menuSlug === postCatNormalized;
                                          });
                                          if (menuMatch) {
                                            return menuMatch.label;
                                          }
                                        }
                                        
                                        const categorySetting = foundCategory ? getCategorySetting(foundCategory.id) : undefined;
                                        return categorySetting?.customTitle || foundCategory?.title || 'Bilinmeyen';
                                      })()}
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {visibleCategories.map(cat => (
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
                                    {CATEGORIES.flatMap(c => c.subcategories || []).map(sub => (
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
                                      className="border rounded-md px-2 py-1 text-sm w-[180px] no-picker cursor-text"
                                      value={dateValue}
                                      onChange={(e) => {
                                        // Sadece input değerini güncelle, kaydetme
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          const value = e.currentTarget.value;
                                          if (!value) return;
                                          
                                          const date = new Date(value);
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
                                            const res = await updatePostAction({ ...post, createdAt: iso } as Post);
                                            if (res.success) {
                                              toast({ title: 'Tarih Güncellendi', description: 'Oluşturulma tarihi güncellendi.' });
                                              router.refresh();
                                            } else {
                                              toast({ variant: 'destructive', title: 'Güncelleme Başarısız', description: res.error || 'Bir hata oluştu.' });
                                            }
                                          });
                                          e.currentTarget.blur();
                                        }
                                      }}
                                      onBlur={(e) => {
                                        const value = e.currentTarget.value;
                                        if (value && value !== dateValue) {
                                          const date = new Date(value);
                                          if (!isNaN(date.getTime())) {
                                            const iso = date.toISOString();
                                            startTransition(async () => {
                                              const res = await updatePostAction({ ...post, createdAt: iso } as Post);
                                              if (res.success) {
                                                toast({ title: 'Tarih Güncellendi', description: 'Oluşturulma tarihi güncellendi.' });
                                                router.refresh();
                                              } else {
                                                toast({ variant: 'destructive', title: 'Güncelleme Başarısız', description: res.error || 'Bir hata oluştu.' });
                                              }
                                            });
                                          }
                                        }
                                      }}
                                      onClick={(e) => {
                                        e.currentTarget.focus();
                                        e.currentTarget.select();
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
                                            Düzenle
                                        </Link>
                                    </DropdownMenuItem>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem 
                                          className="text-destructive focus:text-destructive"
                                          onSelect={(e) => e.preventDefault()}
                                        >
                                          Sil
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Gönderiyi Silmek İstediğinizden Emin misiniz?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Gönderi çöp kutusuna taşınacaktır. Daha sonra geri yükleyebilir veya kalıcı olarak silebilirsiniz.
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
                                            {isPending ? 'Siliniyor...' : 'Sil'}
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
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              <strong>{filteredPosts.filter(post => post.status === 'draft').length}</strong> / {POSTS.filter(post => post.status === 'draft').length} gönderi gösteriliyor
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="trash">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Çöp Kutusu</CardTitle>
                <CardDescription>
                  Silinen gönderileri buradan geri yükleyebilir veya kalıcı olarak silebilirsiniz. {searchQuery ? `${filteredDeletedPosts.length} / ` : ''}Toplam {deletedPosts.length} gönderi.
                </CardDescription>
              </div>
              {deletedPosts.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" /> Tümünü Boşalt
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tüm gönderileri kalıcı olarak silmek istiyor musunuz?</AlertDialogTitle>
                      <AlertDialogDescription>Bu işlem geri alınamaz. Çöp kutusundaki tüm gönderiler kalıcı olarak silinecek.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>İptal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          startTransition(async () => {
                            const res = await emptyDeletedPostsAction();
                            if (res.success) {
                              setDeletedPosts([]);
                              toast({ title: 'Çöp Kutusu Boşaltıldı', description: 'Tüm gönderiler kalıcı olarak silindi.' });
                              router.refresh();
                            } else {
                              toast({ variant: 'destructive', title: 'İşlem Başarısız', description: res.error || 'Bir hata oluştu.' });
                            }
                          })
                        }}
                      >
                        Evet, Boşalt
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
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
            {filteredDeletedPosts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Trash2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Çöp kutusu boş</p>
                <p className="text-sm">Silinen gönderi yok</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Başlık</TableHead>
                    <TableHead className="hidden md:table-cell">Kategori</TableHead>
                    <TableHead className="hidden md:table-cell">Silinme Tarihi</TableHead>
                    <TableHead className="text-right">Eylemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeletedPosts.map(post => {
                    // Find category by slug (check both original and custom slugs)
                    let category = CATEGORIES.find(c => c.slug === post.category) || 
                                   CATEGORIES.flatMap(c => c.subcategories || []).find(s => s.slug === post.category);
                    
                    // If not found, check custom slugs
                    if (!category) {
                      const categoryWithCustomSlug = CATEGORIES.find(c => {
                        const setting = getCategorySetting(c.id);
                        return setting?.customSlug === post.category;
                      });
                      if (categoryWithCustomSlug) {
                        category = categoryWithCustomSlug;
                      }
                    }
                    
                    // Get category/menu setting for display
                    const categorySetting = category ? getCategorySetting(category.id) : undefined;
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
                    displayTitle = displayTitle || 'Bilinmiyor';
                    
                    return (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell className="hidden md:table-cell">{displayTitle}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(post.deletedAt).toLocaleString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRestore(post.id)}
                              disabled={isPending}
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Geri Yükle
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  disabled={isPending}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Kalıcı Olarak Sil
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Gönderiyi Kalıcı Olarak Silmek İstediğinizden Emin misiniz?</AlertDialogTitle>
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
                                    onClick={() => handlePermanentlyDelete(post.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    disabled={isPending}
                                  >
                                    {isPending ? 'Siliniyor...' : 'Kalıcı Olarak Sil'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
