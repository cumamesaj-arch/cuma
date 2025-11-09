'use client';

import Link from "next/link"
import * as React from "react"
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Plus,
  X,
  Check,
} from "lucide-react"
import { POSTS, CATEGORIES } from "@/lib/data"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import type { Post } from "@/lib/types";
import { updatePostAction, getCategorySettingsAction, getCustomMenusAction, generateSEOKeywordsAction, getPlaceholderImagesAction } from "@/app/actions";
import { Skeleton } from "@/components/ui/skeleton";
import type { CategorySettings, CustomMenu } from "@/lib/types";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function extractYouTubeVideoId(url: string): string {
  if (!url) return '';
  
  const match1 = url.match(/[?&]v=([^&]+)/);
  if (match1) return match1[1];
  
  const match2 = url.match(/youtu\.be\/([^?]+)/);
  if (match2) return match2[1];
  
  const match3 = url.match(/embed\/([^?]+)/);
  if (match3) return match3[1];
  
  return '';
}

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = React.use(params);
  const post = POSTS.find(p => p.id === id);
  
  // Find previous and next posts
  const currentIndex = POSTS.findIndex(p => p.id === id);
  const previousPost = currentIndex > 0 ? POSTS[currentIndex - 1] : null;
  const nextPost = currentIndex < POSTS.length - 1 ? POSTS[currentIndex + 1] : null;

  // Initialize all states with default values first
  const [title, setTitle] = React.useState(post?.title || '');
  const [category, setCategory] = React.useState(post?.category || '');
  // Support multiple selected images (fallback to legacy single imageId)
  const initialImageIds: string[] = post
    ? (post.imageIds && post.imageIds.length > 0
        ? post.imageIds
        : (post.imageId ? [post.imageId] : []))
    : [];
  const [selectedImages, setSelectedImages] = React.useState<string[]>(initialImageIds);
  const [meal, setMeal] = React.useState(post?.content.meal || '');
  const [mealleriUrl, setMealleriUrl] = React.useState(post?.content.mealleri || '');
  const [tefsirUrl, setTefsirUrl] = React.useState(post?.content.tefsir || '');
  const [kisaTefsirUrl, setKisaTefsirUrl] = React.useState(post?.content.kisaTefsir || '');
  const [youtubeUrl, setYoutubeUrl] = React.useState(
    post?.youtubeVideoId ? `https://www.youtube.com/watch?v=${post.youtubeVideoId}` : ''
  );
  
  const [isPending, startTransition] = React.useTransition();
  const [categorySettings, setCategorySettings] = React.useState<CategorySettings[]>([]);
  const [customMenus, setCustomMenus] = React.useState<CustomMenu[]>([]);
  const [availableImages, setAvailableImages] = React.useState<typeof PlaceHolderImages>(PlaceHolderImages);
  const [isImageDialogOpen, setIsImageDialogOpen] = React.useState(false);
  const socialPlatforms = ["Facebook", "X", "Instagram", "Pinterest", "YouTube", "WhatsApp"];

  // SEO states
  const [metaTitle, setMetaTitle] = React.useState(post?.seo?.metaTitle || "");
  const [metaDescription, setMetaDescription] = React.useState(post?.seo?.metaDescription || "");
  const [keywords, setKeywords] = React.useState<string[]>(post?.seo?.keywords || []);
  const [keywordInput, setKeywordInput] = React.useState("");
  const [ogImage, setOgImage] = React.useState(post?.seo?.ogImage || "");
  const [isGeneratingSEO, setIsGeneratingSEO] = React.useState(false);

  React.useEffect(() => {
    // Load category settings and custom menus to filter visible categories
    getCategorySettingsAction().then(setCategorySettings);
    getCustomMenusAction().then(setCustomMenus);
  }, []);

  // Load images when dialog opens
  React.useEffect(() => {
    if (isImageDialogOpen) {
      getPlaceholderImagesAction().then(setAvailableImages);
    }
  }, [isImageDialogOpen]);

  // Check if selected category should hide meal/tefsir fields
  // Hide for: "Diğer" (diger), "Videolar" subcategories, "Fotograflar" (custom menu)
  const shouldHideMealFields = React.useMemo(() => {
    if (category === 'diger') return true; // Diğer category
    
    // Check if it's a Videolar subcategory
    const videosCategory = CATEGORIES.find(cat => cat.slug === 'videolar');
    if (videosCategory?.subcategories) {
      const isVideoSubcategory = videosCategory.subcategories.some(sub => sub.slug === category);
      if (isVideoSubcategory) return true;
    }
    
    // Check if it's Fotograflar (custom menu)
    const normalizedCategory = category.startsWith('/') ? category.slice(1) : category;
    const fotoMenu = customMenus.find(menu => {
      const menuHref = menu.href.startsWith('/') ? menu.href.slice(1) : menu.href;
      return menuHref === normalizedCategory && menu.label.toLowerCase().includes('foto');
    });
    if (fotoMenu) return true;
    
    // Also check common variations as fallback
    const fotoSlug = category.toLowerCase().replace(/[\/]/g, '');
    if (fotoSlug === 'fotograflar' || fotoSlug === 'fotoğraflar') {
      return true;
    }
    
    return false;
  }, [category, customMenus]);

  const getCategorySetting = (categoryId: string): CategorySettings | undefined => {
    return categorySettings.find(s => s.categoryId === categoryId);
  };

  // Filter and sort categories based on visibility and order settings from Menü Ayarları
  // Always include the current post's category even if it's hidden
  const visibleCategories = CATEGORIES.map(cat => {
    const setting = getCategorySetting(cat.id);
    return {
      ...cat,
      visible: setting?.visible ?? true,
      order: setting?.order ?? 0
    };
  })
    .filter(cat => cat.visible || cat.slug === post?.category)
    .sort((a, b) => {
      // If one is the current post's category, prioritize it
      if (a.slug === post?.category) return -1;
      if (b.slug === post?.category) return 1;
      // Otherwise sort by order from Menü Ayarları
      return a.order - b.order;
    });

  // Get visible custom menus and sort by order
  const visibleCustomMenus = customMenus
    .filter(m => m.visible)
    .sort((a, b) => a.order - b.order);

  // Combine categories and custom menus for the dropdown
  // Custom menus need to be converted to category-like format
  const allMenuItems = [
    ...visibleCategories.map(cat => ({
      ...cat,
      type: 'category' as const,
      displayTitle: cat.title,
      displaySlug: cat.slug
    })),
    ...visibleCustomMenus.map(menu => ({
      id: menu.id,
      title: menu.label,
      slug: menu.href.startsWith('/') ? menu.href.slice(1) : menu.href,
      displayTitle: menu.label,
      displaySlug: menu.href.startsWith('/') ? menu.href.slice(1) : menu.href,
      type: 'custom' as const,
      // For custom menus, we don't have subcategories
      subcategories: undefined
    }))
  ].sort((a, b) => {
    // If current post's category, prioritize it
    if (a.displaySlug === post?.category) return -1;
    if (b.displaySlug === post?.category) return 1;
    // Sort categories first (by their order), then custom menus (by their order)
    if (a.type === 'category' && b.type === 'custom') return -1;
    if (a.type === 'custom' && b.type === 'category') return 1;
    // Both same type, sort by order
    const aOrder = a.type === 'category' 
      ? (getCategorySetting(a.id)?.order ?? 0)
      : (customMenus.find(m => m.id === a.id)?.order ?? 0);
    const bOrder = b.type === 'category'
      ? (getCategorySetting(b.id)?.order ?? 0)
      : (customMenus.find(m => m.id === b.id)?.order ?? 0);
    return aOrder - bOrder;
  });

  React.useEffect(() => {
    if (!post) {
      toast({
        variant: "destructive",
        title: "Gönderi Bulunamadı!",
        description: "Düzenlemek istediğiniz gönderi bulunamadı.",
      });
      router.push('/admin/posts');
    } else {
      // Update states when post is found
      setTitle(post.title);
      setCategory(post.category);
      const imageIds = post.imageIds && post.imageIds.length > 0
        ? post.imageIds
        : (post.imageId ? [post.imageId] : []);
      setSelectedImages(imageIds);
      setMeal(post.content.meal);
      setMealleriUrl(post.content.mealleri || '');
      setTefsirUrl(post.content.tefsir || '');
      setKisaTefsirUrl(post.content.kisaTefsir || '');
      setYoutubeUrl(post.youtubeVideoId ? `https://www.youtube.com/watch?v=${post.youtubeVideoId}` : '');
      // Update SEO fields
      setMetaTitle(post.seo?.metaTitle || "");
      setMetaDescription(post.seo?.metaDescription || "");
      setKeywords(post.seo?.keywords || []);
      setOgImage(post.seo?.ogImage || "");
    }
  }, [post, router, toast]);

  // Auto-generate SEO keywords
  const handleGenerateSEO = async () => {
    if (!title || !meal) {
      toast({
        variant: "destructive",
        title: "Eksik Bilgi!",
        description: "SEO önerileri için başlık ve içerik gerekli.",
      });
      return;
    }

    setIsGeneratingSEO(true);
    try {
      const categoryObj = CATEGORIES.find(c => c.slug === category) || 
                          CATEGORIES.flatMap(c => c.subcategories || []).find(s => s.slug === category);
      const categoryName = categoryObj?.title || category;
      
      const result = await generateSEOKeywordsAction(title, meal, categoryName);
      if (result.success) {
        setMetaTitle(result.metaTitle || "");
        setMetaDescription(result.metaDescription || "");
        setKeywords(result.keywords || []);
        
        // Fallback kullanıldıysa bilgilendirici mesaj göster
        if (result.error) {
          toast({
            title: "SEO Önerileri Oluşturuldu (Otomatik)",
            description: result.error,
            variant: "default",
          });
        } else {
          toast({
            title: "SEO Önerileri Oluşturuldu!",
            description: "Anahtar kelimeler ve SEO önerileri başarıyla oluşturuldu.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "SEO Üretilemedi!",
          description: result.error || "Anahtar kelime üretilirken bir hata oluştu.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "SEO önerileri oluşturulurken bir hata oluştu.",
      });
    } finally {
      setIsGeneratingSEO(false);
    }
  };

  // Add keyword
  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  // Remove keyword
  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Gönderi yükleniyor...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!title || !category) {
      toast({
        variant: "destructive",
        title: "Eksik Bilgi!",
        description: "Lütfen başlık ve kategori bilgilerini doldurun.",
      });
      return;
    }

    // For non-meal categories, meal is optional
    if (!shouldHideMealFields && !meal) {
      toast({
        variant: "destructive",
        title: "Eksik Bilgi!",
        description: "Lütfen meal bilgisini doldurun.",
      });
      return;
    }
    
    const updatedPost: Post = {
        id: post.id, // Keep original ID
        title: title,
        slug: slugify(title),
        category: category,
        ...(selectedImages.length > 0 && { imageIds: selectedImages }),
        ...(selectedImages.length === 1 && { imageId: selectedImages[0] }),
        content: {
            meal: shouldHideMealFields ? '' : meal,
            mealleri: shouldHideMealFields ? '' : mealleriUrl,
            tefsir: shouldHideMealFields ? '' : tefsirUrl,
            kisaTefsir: shouldHideMealFields ? '' : kisaTefsirUrl,
        },
        youtubeVideoId: extractYouTubeVideoId(youtubeUrl),
        createdAt: post.createdAt, // Keep original creation date
        ...(category === 'cuma-mesajlari' && { customMessage: "CUMA'NIN HAYR VE BEREKETİ ÜZERİNİZE OLSUN" }),
        ...((metaTitle || metaDescription || keywords.length > 0 || ogImage) && {
            seo: {
                ...(metaTitle && { metaTitle }),
                ...(metaDescription && { metaDescription }),
                ...(keywords.length > 0 && { keywords }),
                ...(ogImage && { ogImage }),
            }
        })
    };

    startTransition(async () => {
        try {
            const result = await updatePostAction(updatedPost);
            if (result.success) {
                toast({
                    title: "Gönderi Güncellendi!",
                    description: `${updatedPost.title} başlıklı gönderiniz başarıyla güncellendi. Değişiklikler tüm sayfalarda güncellendi.`,
                });
                // Refresh all pages to show changes
                router.refresh();
            } else {
                toast({
                    variant: "destructive",
                    title: "Güncelleme Başarısız!",
                    description: result.error || "Gönderi güncellenirken bir hata oluştu.",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Güncelleme Başarısız!",
                description: "Gönderi güncellenirken bir hata oluştu.",
            });
        }
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/admin/posts">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Gönderiyi Düzenle
        </h1>
        <Badge 
          variant="outline" 
          className={`ml-auto sm:ml-0 ${
            (post.status || 'published') === 'draft' 
              ? 'bg-red-600 text-white border-red-600 hover:bg-red-700' 
              : 'bg-green-600 text-white border-green-600 hover:bg-green-700'
          }`}
        >
          {(post.status || 'published') === 'draft' ? 'Yayında Değil' : 'Yayında'}
        </Badge>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          {previousPost && (
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => {
                router.push(`/admin/posts/${previousPost.id}/edit`);
              }}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Önceki
            </Button>
          )}
          {nextPost && (
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => {
                router.push(`/admin/posts/${nextPost.id}/edit`);
              }}
            >
              Sonraki
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
          <Button variant="outline" size="sm" type="button" onClick={() => router.push('/admin/posts')}>
            Vazgeç
          </Button>
          <Button size="sm" type="submit" disabled={isPending}>
            {isPending ? 'Güncelleniyor...' : 'Güncelle'}
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Gönderi Detayları</CardTitle>
              <CardDescription>
                Gönderinizin başlığını, içeriğini ve diğer detaylarını güncelleyin.
              </CardDescription>
            </CardHeader>
            <CardContent>
             {isPending ? (
                <div className="grid gap-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
             ) : (
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Başlık</Label>
                  <Input
                    id="name"
                    name="title"
                    type="text"
                    className="w-full"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Gönderi başlığını girin..."
                  />
                </div>
                {!shouldHideMealFields && (
                  <>
                    <div className="grid gap-3">
                      <Label htmlFor="meal-message">Meali</Label>
                      <Textarea
                        id="meal-message"
                        name="meal"
                        placeholder="Meal mesajını buraya girin..."
                        value={meal}
                        onChange={(e) => setMeal(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="mealleri-link">{title ? `${title} Mealleri` : 'Mealleri'}</Label>
                      <Input
                        id="mealleri-link"
                        name="mealleri_url"
                        type="url"
                        placeholder="URL girin..."
                        value={mealleriUrl}
                        onChange={(e) => setMealleriUrl(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="tefsir-link">{title ? `${title} Tefsiri` : 'Tefsiri'}</Label>
                      <Input
                        id="tefsir-link"
                        name="tefsir_url"
                        type="url"
                        placeholder="URL girin..."
                        value={tefsirUrl}
                        onChange={(e) => setTefsirUrl(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="kisa-tefsir-link">{title ? `${title} Kısa Tefsiri` : 'Kısa Tefsiri'}</Label>
                      <Input
                        id="kisa-tefsir-link"
                        name="kisa_tefsir_url"
                        type="url"
                        placeholder="URL girin..."
                        value={kisaTefsirUrl}
                        onChange={(e) => setKisaTefsirUrl(e.target.value)}
                      />
                    </div>
                  </>
                )}
                <div className="grid gap-3">
                  <Label htmlFor="youtube-link">YouTube Video Linki</Label>
                  <Input
                    id="youtube-link"
                    name="youtube_url"
                    type="url"
                    className="w-full"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                  />
                </div>
              </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>SEO Optimizasyonu</CardTitle>
                  <CardDescription>
                    Arama motorları için içeriğinizi optimize edin. Daha fazla kişiye ulaşın.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateSEO}
                  disabled={isGeneratingSEO || !title || !meal}
                >
                  {isGeneratingSEO ? 'Üretiliyor...' : 'Otomatik Oluştur (AI)'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="meta-title">SEO Başlık (Meta Title)</Label>
                <Input
                  id="meta-title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="SEO optimizasyonlu başlık (55-60 karakter önerilir)"
                  maxLength={70}
                />
                <p className="text-xs text-muted-foreground">
                  {metaTitle.length}/70 karakter {metaTitle.length > 60 && "(Uzun!)"}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="meta-description">SEO Açıklaması (Meta Description)</Label>
                <Textarea
                  id="meta-description"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Arama motorları için açıklama (150-160 karakter önerilir)"
                  maxLength={170}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {metaDescription.length}/170 karakter {metaDescription.length > 160 && "(Uzun!)"}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="keywords">Anahtar Kelimeler</Label>
                <div className="flex gap-2">
                  <Input
                    id="keywords"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                    placeholder="Anahtar kelime ekle ve Enter'a bas"
                  />
                  <Button type="button" variant="outline" onClick={handleAddKeyword}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {keyword}
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(keyword)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="og-image">Open Graph Görsel URL</Label>
                <Input
                  id="og-image"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="Sosyal medya paylaşımları için görsel URL (opsiyonel)"
                  type="url"
                />
              </div>
            </CardContent>
          </Card>
           <Card>
                <CardHeader>
                  <CardTitle>Paylaşılacak Sosyal Medya Platformları</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {socialPlatforms.map(platform => (
                      <div className="flex items-center space-x-2" key={platform}>
                        <Checkbox 
                          id={platform}
                          name={`social_${platform.toLowerCase()}`}
                          defaultChecked={platform !== "YouTube" && platform !== "WhatsApp"}
                        />
                        <label
                          htmlFor={platform}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {platform}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
            </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Gönderi Kategorisi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="category">Klasör (Menü)</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category" aria-label="Kategori Seç">
                      <SelectValue placeholder="Kategori Seç" />
                    </SelectTrigger>
                    <SelectContent>
                      {allMenuItems.map(item => (
                        item.subcategories ? (
                            <React.Fragment key={item.id}>
                                <SelectItem value={item.displaySlug} disabled>{item.displayTitle}</SelectItem>
                                {item.subcategories.map(sub => (
                                     <SelectItem key={sub.id} value={sub.slug}>&nbsp;&nbsp;&nbsp;{sub.title}</SelectItem>
                                ))}
                            </React.Fragment>
                        ) : (
                             <SelectItem key={item.id} value={item.displaySlug}>{item.displayTitle}</SelectItem>
                        )
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Görseller</CardTitle>
              <CardDescription>
                Gönderi için bir veya birden fazla görsel seçin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {selectedImages.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    Henüz görsel seçilmedi
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {selectedImages.map((imageId) => {
                      const image = availableImages.find(img => img.id === imageId);
                      if (!image) return null;
                      return (
                        <div key={imageId} className="relative group">
                          <Image
                            alt={image.description}
                            className="aspect-square w-full rounded-md object-cover max-w-md mx-auto"
                            height={300}
                            src={image.imageUrl}
                            width={300}
                            data-ai-hint={image.imageHint}
                          />
                          <button
                            type="button"
                            className="absolute top-2 right-2 h-7 w-7 inline-flex items-center justify-center rounded-md bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setSelectedImages(prev => prev.filter(id => id !== imageId))}
                            aria-label="Görseli kaldır"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                       <Upload className="mr-2 h-4 w-4" />
                       Görsel Ekle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Medya Galerisi</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto p-4">
                      {availableImages.map(image => (
                        <button
                          key={image.id}
                          type="button"
                          onClick={() => {
                            setSelectedImages(prev => prev.includes(image.id) ? prev : [...prev, image.id]);
                          }}
                          className={`group relative focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md border-2 ${
                            selectedImages.includes(image.id) ? 'border-primary' : 'border-transparent'
                          }`}
                        >
                          <Image
                            src={image.imageUrl}
                            alt={image.description}
                            width={200}
                            height={200}
                            className="aspect-square w-full rounded-md object-cover transition-transform group-hover:scale-105"
                            data-ai-hint={image.imageHint}
                          />
                          {selectedImages.includes(image.id) && (
                            <span className="absolute top-2 right-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white shadow-md">
                              <Check className="h-4 w-4" />
                            </span>
                          )}
                          <div className={`absolute inset-0 bg-black/50 ${selectedImages.includes(image.id) ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 group-focus:opacity-100 transition-opacity flex items-center justify-center`}>
                            {selectedImages.includes(image.id) ? (
                              <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-green-500 text-white shadow-lg">
                                <Check className="h-6 w-6" />
                              </span>
                            ) : (
                              <span className="text-white text-sm font-semibold">Seç</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-end gap-2">
                      <DialogClose asChild>
                        <Button type="button">Tamam</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">Kapat</Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 md:hidden">
        {previousPost && (
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => {
              router.push(`/admin/posts/${previousPost.id}/edit`);
            }}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Önceki
          </Button>
        )}
        {nextPost && (
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => {
              router.push(`/admin/posts/${nextPost.id}/edit`);
            }}
          >
            Sonraki
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
        <Button variant="outline" size="sm" type="button" onClick={() => router.push('/admin/posts')}>
          Vazgeç
        </Button>
        <Button size="sm" type="submit" disabled={isPending}>
            {isPending ? 'Güncelleniyor...' : 'Güncelle'}
        </Button>
      </div>
    </form>
  )
}

