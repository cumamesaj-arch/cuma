'use client';

import Link from "next/link"
import * as React from "react"
import {
  ChevronLeft,
  Upload,
  Plus,
  X,
  Trash2,
  Check,
} from "lucide-react"
import { useRouter } from "next/navigation";

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
import { CATEGORIES } from "@/lib/data"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import type { Post } from "@/lib/types";
import { createPostAction, getCategorySettingsAction, getCustomMenusAction, generateSEOKeywordsAction, getPlaceholderImagesAction, uploadPlaceholderFilesAction } from "@/app/actions";
import { Skeleton } from "@/components/ui/skeleton";
import type { CategorySettings, CustomMenu } from "@/lib/types";


function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

function extractYouTubeVideoId(url: string): string {
  if (!url) return '';
  
  // https://www.youtube.com/watch?v=VIDEO_ID
  const match1 = url.match(/[?&]v=([^&]+)/);
  if (match1) return match1[1];
  
  // https://youtu.be/VIDEO_ID
  const match2 = url.match(/youtu\.be\/([^?]+)/);
  if (match2) return match2[1];
  
  // https://www.youtube.com/embed/VIDEO_ID
  const match3 = url.match(/embed\/([^?]+)/);
  if (match3) return match3[1];
  
  return '';
}


export default function NewPostPage() {
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("cuma-mesajlari");
  const [selectedImages, setSelectedImages] = React.useState<string[]>([]); // Array of image IDs
  const [youtubeVideoUrls, setYoutubeVideoUrls] = React.useState<string[]>(['']); // Array of YouTube URLs
  const [isPending, startTransition] = React.useTransition();
  const [categorySettings, setCategorySettings] = React.useState<CategorySettings[]>([]);
  const [customMenus, setCustomMenus] = React.useState<CustomMenu[]>([]);
  const [availableImages, setAvailableImages] = React.useState<typeof PlaceHolderImages>(PlaceHolderImages);
  const [isImageDialogOpen, setIsImageDialogOpen] = React.useState(false);
  const [isUploadingImages, setIsUploadingImages] = React.useState(false);
  const [meal, setMeal] = React.useState("");
  const socialPlatforms = ["Facebook", "X", "Instagram", "Pinterest", "YouTube", "WhatsApp"];
  const { toast } = useToast();
  const router = useRouter();

  // SEO states
  const [metaTitle, setMetaTitle] = React.useState("");
  const [metaDescription, setMetaDescription] = React.useState("");
  const [keywords, setKeywords] = React.useState<string[]>([]);
  const [keywordInput, setKeywordInput] = React.useState("");
  const [ogImage, setOgImage] = React.useState("");
  const [isGeneratingSEO, setIsGeneratingSEO] = React.useState(false);

  React.useEffect(() => {
    // Load category settings and custom menus to filter visible categories
    getCategorySettingsAction().then(setCategorySettings);
    getCustomMenusAction().then(setCustomMenus);
  }, []);

  // Load images immediately on page load to prevent delay
  React.useEffect(() => {
    getPlaceholderImagesAction().then(setAvailableImages);
  }, []);

  // Refresh images when dialog opens (optional, for latest images)
  React.useEffect(() => {
    if (isImageDialogOpen) {
      getPlaceholderImagesAction().then(setAvailableImages);
    }
  }, [isImageDialogOpen]);

  const handleUploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploadingImages(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach(f => fd.append('files', f));
      const res = await uploadPlaceholderFilesAction(fd);
      if (res.success && res.images) {
        setAvailableImages(prev => [...res.images!, ...prev]);
        setSelectedImages(prev => [...res.images!.map(i => i.id), ...prev]);
      }
    } finally {
      setIsUploadingImages(false);
    }
  };

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
    // Custom menus have href like "/Fotograflar", we need to check if category matches
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
  const visibleCategories = CATEGORIES.map(cat => {
    const setting = getCategorySetting(cat.id);
    return {
      ...cat,
      visible: setting?.visible ?? true,
      order: setting?.order ?? 0
    };
  })
    .filter(cat => cat.visible)
    .sort((a, b) => a.order - b.order); // Sort by order from Menü Ayarları

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

  // Update default category if current one is not visible
  React.useEffect(() => {
    if (allMenuItems.length > 0) {
      const currentCategoryExists = allMenuItems.some(item => 
        item.displaySlug === category || (item.subcategories && item.subcategories.some(sub => sub.slug === category))
      );
      if (!currentCategoryExists) {
        // Set to first available visible menu item
        const firstItem = allMenuItems[0];
        if (firstItem.subcategories && firstItem.subcategories.length > 0) {
          setCategory(firstItem.subcategories[0].slug);
        } else {
          setCategory(firstItem.displaySlug);
        }
      }
    }
  }, [allMenuItems, category]);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const titleValue = formData.get("title") as string;
    const mealValue = formData.get("meal") as string || '';
    const mealleriUrl = formData.get("mealleri_url") as string || '';
    const tefsirUrl = formData.get("tefsir_url") as string || '';
    const kisaTefsirUrl = formData.get("kisa_tefsir_url") as string || '';
    
    // Basic validation: title and category are always required
    if (!titleValue || !category) {
      toast({
        variant: "destructive",
        title: "Eksik Bilgi!",
        description: "Lütfen başlık ve kategori bilgilerini doldurun.",
      });
      return;
    }

    // Meal is only required if meal fields are visible
    if (!shouldHideMealFields && !mealValue) {
      toast({
        variant: "destructive",
        title: "Eksik Bilgi!",
        description: "Lütfen meal bilgisini doldurun.",
      });
      return;
    }

    // Extract YouTube video IDs from URLs
    const youtubeVideoIds = youtubeVideoUrls
      .map(url => extractYouTubeVideoId(url))
      .filter(id => id !== '');

    // Log selected images before creating newPost
    console.log('[NEW POST PAGE] Selected images before save:', selectedImages);
    console.log('[NEW POST PAGE] Selected images length:', selectedImages.length);
    console.log('[NEW POST PAGE] Available images count:', availableImages.length);

    // Prepare post data
    const newPost: Post = {
        id: `post-${Date.now()}`,
        title: titleValue,
        slug: slugify(titleValue),
        category: category,
        ...(selectedImages.length > 0 && { imageIds: selectedImages }),
        ...(selectedImages.length === 1 && { imageId: selectedImages[0] }), // Legacy support
        content: {
            meal: shouldHideMealFields ? '' : mealValue,
            mealleri: shouldHideMealFields ? '' : mealleriUrl,
            tefsir: shouldHideMealFields ? '' : tefsirUrl,
            kisaTefsir: shouldHideMealFields ? '' : kisaTefsirUrl,
        },
        ...(youtubeVideoIds.length > 0 && { youtubeVideoIds: youtubeVideoIds }),
        ...(youtubeVideoIds.length === 1 && { youtubeVideoId: youtubeVideoIds[0] }), // Legacy support
        createdAt: new Date().toISOString(),
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

    // Log newPost to see what's being sent
    console.log('[NEW POST PAGE] New post object:', {
        id: newPost.id,
        title: newPost.title,
        imageIds: newPost.imageIds,
        imageId: newPost.imageId,
        hasImageIds: !!newPost.imageIds,
        hasImageId: !!newPost.imageId,
    });

    startTransition(async () => {
        try {
            console.log('[NEW POST PAGE] Calling createPostAction with:', {
                imageIds: newPost.imageIds,
                imageId: newPost.imageId,
            });
            const result = await createPostAction(newPost);
            console.log('[NEW POST PAGE] createPostAction result:', result);
            if (result.success) {
                console.log('[NEW POST PAGE] Post created successfully!');
                toast({
                    title: "Gönderi Kaydedildi!",
                    description: `${newPost.title} başlıklı gönderiniz başarıyla oluşturuldu.`,
                });
                router.push('/admin/posts');
            } else {
                console.error('[NEW POST PAGE] Post creation failed:', result.error);
                toast({
                    variant: "destructive",
                    title: "Kaydetme Başarısız!",
                    description: result.error || "Gönderi oluşturulurken bir hata oluştu.",
                });
            }
        } catch (error) {
            console.error('[NEW POST PAGE] Error in startTransition:', error);
            toast({
                variant: "destructive",
                title: "Hata!",
                description: error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.",
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
          Yeni Gönderi Oluştur
        </h1>
        <Badge variant="outline" className="ml-auto sm:ml-0">
          Yayında
        </Badge>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm" type="button" onClick={() => router.push('/admin/posts')}>
            Vazgeç
          </Button>
          <Button size="sm" type="submit" disabled={isPending}>
            {isPending ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Gönderi Detayları</CardTitle>
              <CardDescription>
                Gönderinizin başlığını, içeriğini ve diğer detaylarını girin.
              </CardDescription>
            </CardHeader>
            <CardContent>
             {isPending ? (
                <div className="grid gap-6">
                    <Skeleton className="h-10 w-full" />
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
                  <Label htmlFor="category">Gönderi Kategorisi</Label>
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
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="tefsir-link">{title ? `${title} Tefsiri` : 'Tefsiri'}</Label>
                      <Input
                        id="tefsir-link"
                        name="tefsir_url"
                        type="url"
                        placeholder="URL girin..."
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="kisa-tefsir-link">{title ? `${title} Kısa Tefsiri` : 'Kısa Tefsiri'}</Label>
                      <Input
                        id="kisa-tefsir-link"
                        name="kisa_tefsir_url"
                        type="url"
                        placeholder="URL girin..."
                      />
                    </div>
                  </>
                )}
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="youtube_url_0">YouTube Video Linkleri</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setYoutubeVideoUrls([...youtubeVideoUrls, ''])}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Link Ekle
                    </Button>
                  </div>
                  {youtubeVideoUrls.map((url, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        id={`youtube_url_${index}`}
                        name={`youtube_url_${index}`}
                        type="url"
                        value={url}
                        onChange={(e) => {
                          const newUrls = [...youtubeVideoUrls];
                          newUrls[index] = e.target.value;
                          setYoutubeVideoUrls(newUrls);
                        }}
                        className="flex-1"
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                      {youtubeVideoUrls.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const newUrls = youtubeVideoUrls.filter((_, i) => i !== index);
                            setYoutubeVideoUrls(newUrls);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
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
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Görseller</CardTitle>
                  <CardDescription>
                    Gönderi için bir veya birden fazla görsel seçin.
                  </CardDescription>
                </div>
                <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Görsel Ekle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Medya Galerisi</DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Input type="file" accept="image/*" multiple onChange={(e) => handleUploadImages(e.target.files)} />
                        {isUploadingImages && <span className="text-sm text-muted-foreground">Yükleniyor…</span>}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto p-4">
                      {availableImages.map(image => (
                        <button
                          key={image.id}
                          type="button"
                          onClick={() => {
                            if (!selectedImages.includes(image.id)) {
                              setSelectedImages([...selectedImages, image.id]);
                            }
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
                        <Button type="button">
                          Tamam
                        </Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">
                          Kapat
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {selectedImages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Upload className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Henüz görsel seçilmedi</p>
                    <p className="text-sm">Yukarıdaki "Görsel Ekle" butonuna tıklayarak görsel seçin</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedImages.map((imageId) => {
                      const image = availableImages.find(img => img.id === imageId);
                      if (!image) return null;
                      return (
                        <div key={imageId} className="relative group">
                          <Image
                            alt={image.description}
                            className="aspect-square w-full rounded-md object-cover"
                            height={150}
                            src={image.imageUrl}
                            width={150}
                            data-ai-hint={image.imageHint}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              setSelectedImages(selectedImages.filter(id => id !== imageId));
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <input type="hidden" name={`imageIds[]`} value={imageId} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 md:hidden">
        <Button variant="outline" size="sm" type="button" onClick={() => router.push('/admin/posts')}>
          Vazgeç
        </Button>
        <Button size="sm" type="submit" disabled={isPending}>
            {isPending ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </div>
    </form>
  )
}
