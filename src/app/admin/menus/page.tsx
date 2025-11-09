'use client';

import * as React from 'react';
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
import { CATEGORIES, POSTS } from '@/lib/data';
import type { SocialLink, SharePlatform, CustomMenu, CategorySettings, MenuGlobalConfig } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  updateSocialLinksAction, 
  updateShareLinksAction,
  getCustomMenusAction,
  createCustomMenuAction,
  updateCustomMenuAction,
  deleteCustomMenuAction,
  getCategorySettingsAction,
  updateCategorySettingsAction,
  createSocialLinkAction,
  deleteSocialLinkAction,
  createSharePlatformAction,
  deleteSharePlatformAction,
  createSubcategoryAction,
  updateSubcategoryAction,
  deleteSubcategoryAction,
  deleteCategoryAction,
  getMenuGlobalConfigAction,
  updateMenuGlobalConfigAction
} from '@/app/actions';
import { useRouter } from 'next/navigation';
import initialSocialLinks from '@/lib/social-links.json';
import initialShareLinks from '@/lib/share-links.json';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

export default function MenusPage() {
  const [socialLinks, setSocialLinks] = React.useState<SocialLink[]>(initialSocialLinks);
  const [sharePlatforms, setSharePlatforms] = React.useState<SharePlatform[]>(initialShareLinks);
  const [customMenus, setCustomMenus] = React.useState<CustomMenu[]>([]);
  const [categorySettings, setCategorySettings] = React.useState<CategorySettings[]>([]);

  const [editingLink, setEditingLink] = React.useState<string | null>(null);
  const [urlValue, setUrlValue] = React.useState('');
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();
  const router = useRouter();

  // Custom menu states
  const [isMenuDialogOpen, setIsMenuDialogOpen] = React.useState(false);
  const [editingMenuId, setEditingMenuId] = React.useState<string | null>(null);
  const [menuLabel, setMenuLabel] = React.useState('');
  const [menuHref, setMenuHref] = React.useState('');
  const [menuVisible, setMenuVisible] = React.useState(true);
  const [menuOrder, setMenuOrder] = React.useState(0);

  // Category dialog states
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = React.useState(false);
  const [editingCategoryId, setEditingCategoryId] = React.useState<string | null>(null);
  const [categoryVisible, setCategoryVisible] = React.useState(true);
  const [categoryOrder, setCategoryOrder] = React.useState(0);
  const [categoryCustomTitle, setCategoryCustomTitle] = React.useState('');
  const [categoryCustomSlug, setCategoryCustomSlug] = React.useState('');

  // Social link dialog states
  const [isSocialLinkDialogOpen, setIsSocialLinkDialogOpen] = React.useState(false);
  const [socialLinkName, setSocialLinkName] = React.useState('');
  const [socialLinkUrl, setSocialLinkUrl] = React.useState('');
  const [socialLinkColor, setSocialLinkColor] = React.useState('');
  const [socialLinkActive, setSocialLinkActive] = React.useState(true);

  // Share platform dialog states
  const [isSharePlatformDialogOpen, setIsSharePlatformDialogOpen] = React.useState(false);
  const [sharePlatformName, setSharePlatformName] = React.useState('');
  const [sharePlatformActive, setSharePlatformActive] = React.useState(true);

  // Subcategory dialog states
  const [isSubcategoryDialogOpen, setIsSubcategoryDialogOpen] = React.useState(false);
  const [editingSubcategoryId, setEditingSubcategoryId] = React.useState<string | null>(null);
  const [parentCategoryId, setParentCategoryId] = React.useState<string>('');
  const [subcategoryTitle, setSubcategoryTitle] = React.useState('');
  const [subcategorySlug, setSubcategorySlug] = React.useState('');

  // Global menu config
  const [menuConfig, setMenuConfig] = React.useState<MenuGlobalConfig>({ categoryPagePostCount: 12 });

  React.useEffect(() => {
    // Load custom menus and category settings
    getCustomMenusAction().then(setCustomMenus);
    getCategorySettingsAction().then(setCategorySettings);
    getMenuGlobalConfigAction().then(setMenuConfig);
  }, []);

  const getCategorySetting = (categoryId: string): CategorySettings | undefined => {
    return categorySettings.find(s => s.categoryId === categoryId);
  };

  const handleEditClick = (link: SocialLink) => {
    setEditingLink(link.name);
    setUrlValue(link.url);
  };

  const handleSaveUrlClick = (linkName: string) => {
    const newLinks = socialLinks.map((link) =>
      link.name === linkName ? { ...link, url: urlValue } : link
    );
    updateLinks(newLinks);
    setEditingLink(null);
  };
  
  const handleToggleActive = (linkName: string, active: boolean) => {
    const newLinks = socialLinks.map((link) =>
      link.name === linkName ? { ...link, active: active } : link
    );
    updateLinks(newLinks);
  };

  const handleToggleShareActive = (platformName: string, active: boolean) => {
    const newPlatforms = sharePlatforms.map((platform) =>
      platform.name === platformName ? { ...platform, active: active } : platform
    );
     startTransition(async () => {
      const result = await updateShareLinksAction(newPlatforms);
      if (result.success) {
        setSharePlatforms(newPlatforms);
        toast({
          title: 'Kaydedildi!',
          description: 'Paylaşım ayarlarınız güncellendi.',
        });
        router.refresh(); 
      } else {
        toast({
          variant: 'destructive',
          title: 'Kaydetme Başarısız!',
          description: result.error || 'Bir hata oluştu.',
        });
      }
    });
  }

  const updateLinks = (newLinks: SocialLink[]) => {
      startTransition(async () => {
      const result = await updateSocialLinksAction(newLinks);
      if (result.success) {
        setSocialLinks(newLinks);
        toast({
          title: 'Kaydedildi!',
          description: 'Sosyal medya bağlantılarınız güncellendi.',
        });
        router.refresh(); 
      } else {
        toast({
          variant: 'destructive',
          title: 'Kaydetme Başarısız!',
          description: result.error || 'Bir hata oluştu.',
        });
      }
    });
  }

  // Custom menu handlers
  const handleOpenMenuDialog = (menu?: CustomMenu) => {
    if (menu) {
      setEditingMenuId(menu.id);
      setMenuLabel(menu.label);
      setMenuHref(menu.href);
      setMenuVisible(menu.visible);
      setMenuOrder(menu.order);
    } else {
      setEditingMenuId(null);
      setMenuLabel('');
      setMenuHref('');
      setMenuVisible(true);
      setMenuOrder(customMenus.length > 0 ? Math.max(...customMenus.map(m => m.order)) + 1 : 0);
    }
    setIsMenuDialogOpen(true);
  };

  const handleCloseMenuDialog = () => {
    setIsMenuDialogOpen(false);
    setEditingMenuId(null);
    setMenuLabel('');
    setMenuHref('');
    setMenuVisible(true);
    setMenuOrder(0);
  };

  const handleSaveMenu = () => {
    if (!menuLabel || !menuHref) {
      toast({
        variant: 'destructive',
        title: 'Eksik Bilgi!',
        description: 'Lütfen menü etiketi ve yol bilgilerini doldurun.',
      });
      return;
    }

    startTransition(async () => {
      if (editingMenuId) {
        // Update existing menu
        const result = await updateCustomMenuAction(editingMenuId, {
          label: menuLabel,
          href: menuHref,
          visible: menuVisible,
          order: menuOrder,
        });

        if (result.success) {
          const updatedMenus = await getCustomMenusAction();
          setCustomMenus(updatedMenus);
          toast({
            title: 'Menü Güncellendi!',
            description: 'Menü başarıyla güncellendi.',
          });
          handleCloseMenuDialog();
          router.refresh();
        } else {
          toast({
            variant: 'destructive',
            title: 'Güncelleme Başarısız!',
            description: result.error || 'Bir hata oluştu.',
          });
        }
      } else {
        // Create new menu
        const result = await createCustomMenuAction({
          label: menuLabel,
          href: menuHref,
          visible: menuVisible,
          order: menuOrder,
        });

        if (result.success && result.menu) {
          const updatedMenus = await getCustomMenusAction();
          setCustomMenus(updatedMenus);
          toast({
            title: 'Menü Eklendi!',
            description: 'Yeni menü başarıyla eklendi.',
          });
          handleCloseMenuDialog();
          router.refresh();
        } else {
          toast({
            variant: 'destructive',
            title: 'Ekleme Başarısız!',
            description: result.error || 'Bir hata oluştu.',
          });
        }
      }
    });
  };

  const handleDeleteMenu = (menuId: string) => {
    startTransition(async () => {
      const result = await deleteCustomMenuAction(menuId);
      if (result.success) {
        const updatedMenus = await getCustomMenusAction();
        setCustomMenus(updatedMenus);
        toast({
          title: 'Menü Silindi!',
          description: 'Menü başarıyla silindi.',
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

  // Social link handlers
  const handleOpenSocialLinkDialog = () => {
    setSocialLinkName('');
    setSocialLinkUrl('');
    setSocialLinkColor('');
    setSocialLinkActive(true);
    setIsSocialLinkDialogOpen(true);
  };

  const handleSaveSocialLink = () => {
    if (!socialLinkName) {
      toast({
        variant: 'destructive',
        title: 'Eksik Bilgi!',
        description: 'Lütfen sosyal medya adını girin.',
      });
      return;
    }

    startTransition(async () => {
      const result = await createSocialLinkAction({
        name: socialLinkName,
        url: socialLinkUrl,
        color: socialLinkColor || undefined,
        active: socialLinkActive,
      });

      if (result.success && result.link) {
        setSocialLinks([...socialLinks, result.link]);
        toast({
          title: 'Sosyal Medya Linki Eklendi!',
          description: 'Yeni sosyal medya linki başarıyla eklendi.',
        });
        setIsSocialLinkDialogOpen(false);
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: 'Ekleme Başarısız!',
          description: result.error || 'Bir hata oluştu.',
        });
      }
    });
  };

  const handleDeleteSocialLink = (linkName: string) => {
    startTransition(async () => {
      const result = await deleteSocialLinkAction(linkName);
      if (result.success) {
        const updatedLinks = socialLinks.filter(l => l.name !== linkName);
        setSocialLinks(updatedLinks);
        toast({
          title: 'Sosyal Medya Linki Silindi!',
          description: 'Sosyal medya linki başarıyla silindi.',
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

  // Share platform handlers
  const handleOpenSharePlatformDialog = () => {
    setSharePlatformName('');
    setSharePlatformActive(true);
    setIsSharePlatformDialogOpen(true);
  };

  const handleSaveSharePlatform = () => {
    if (!sharePlatformName) {
      toast({
        variant: 'destructive',
        title: 'Eksik Bilgi!',
        description: 'Lütfen platform adını girin.',
      });
      return;
    }

    startTransition(async () => {
      const result = await createSharePlatformAction({
        name: sharePlatformName,
        active: sharePlatformActive,
      });

      if (result.success && result.platform) {
        setSharePlatforms([...sharePlatforms, result.platform]);
        toast({
          title: 'Paylaşım Platformu Eklendi!',
          description: 'Yeni paylaşım platformu başarıyla eklendi.',
        });
        setIsSharePlatformDialogOpen(false);
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: 'Ekleme Başarısız!',
          description: result.error || 'Bir hata oluştu.',
        });
      }
    });
  };

  const handleDeleteSharePlatform = (platformName: string) => {
    startTransition(async () => {
      const result = await deleteSharePlatformAction(platformName);
      if (result.success) {
        const updatedPlatforms = sharePlatforms.filter(p => p.name !== platformName);
        setSharePlatforms(updatedPlatforms);
        toast({
          title: 'Paylaşım Platformu Silindi!',
          description: 'Paylaşım platformu başarıyla silindi.',
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

  // Subcategory handlers
  const handleOpenSubcategoryDialog = (categoryId?: string, subcategory?: any) => {
    if (subcategory && categoryId) {
      setEditingSubcategoryId(subcategory.id);
      setParentCategoryId(categoryId);
      setSubcategoryTitle(subcategory.title);
      setSubcategorySlug(subcategory.slug);
    } else if (categoryId) {
      setEditingSubcategoryId(null);
      setParentCategoryId(categoryId);
      setSubcategoryTitle('');
      setSubcategorySlug('');
    }
    setIsSubcategoryDialogOpen(true);
  };

  const handleCloseSubcategoryDialog = () => {
    setIsSubcategoryDialogOpen(false);
    setEditingSubcategoryId(null);
    setParentCategoryId('');
    setSubcategoryTitle('');
    setSubcategorySlug('');
  };

  const handleSaveSubcategory = () => {
    if (!subcategoryTitle || !parentCategoryId) {
      toast({
        variant: 'destructive',
        title: 'Eksik Bilgi!',
        description: 'Lütfen alt klasör adını ve üst kategoriyi seçin.',
      });
      return;
    }

    startTransition(async () => {
      if (editingSubcategoryId) {
        // Update existing subcategory
        const result = await updateSubcategoryAction(parentCategoryId, editingSubcategoryId, {
          title: subcategoryTitle,
          slug: subcategorySlug || undefined,
        });

        if (result.success) {
          toast({
            title: 'Alt Klasör Güncellendi!',
            description: 'Alt klasör başarıyla güncellendi.',
          });
          handleCloseSubcategoryDialog();
          router.refresh();
        } else {
          toast({
            variant: 'destructive',
            title: 'Güncelleme Başarısız!',
            description: result.error || 'Bir hata oluştu.',
          });
        }
      } else {
        // Create new subcategory
        const result = await createSubcategoryAction(parentCategoryId, {
          title: subcategoryTitle,
          slug: subcategorySlug || undefined,
        });

        if (result.success) {
          toast({
            title: 'Alt Klasör Eklendi!',
            description: 'Yeni alt klasör başarıyla eklendi.',
          });
          handleCloseSubcategoryDialog();
          router.refresh();
        } else {
          toast({
            variant: 'destructive',
            title: 'Ekleme Başarısız!',
            description: result.error || 'Bir hata oluştu.',
          });
        }
      }
    });
  };

  const handleDeleteSubcategory = (categoryId: string, subcategoryId: string) => {
    startTransition(async () => {
      const result = await deleteSubcategoryAction(categoryId, subcategoryId);
      if (result.success) {
        toast({
          title: 'Alt Klasör Silindi!',
          description: 'Alt klasör başarıyla silindi.',
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
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Menü Ayarları</CardTitle>
              <CardDescription>Sitenin navigasyon menüsünü yönetin.</CardDescription>
            </div>
            <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenMenuDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni Menü Ekle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingMenuId ? 'Menüyü Düzenle' : 'Yeni Menü Ekle'}</DialogTitle>
                  <DialogDescription>
                    Menü bilgilerini girin. Bu menü header'da görüntülenecektir.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="menu-label">Menü Etiketi</Label>
                    <Input
                      id="menu-label"
                      value={menuLabel}
                      onChange={(e) => setMenuLabel(e.target.value)}
                      placeholder="Örn: Hakkımızda"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="menu-href">Yol (href)</Label>
                    <Input
                      id="menu-href"
                      value={menuHref}
                      onChange={(e) => setMenuHref(e.target.value)}
                      placeholder="/hakkimizda veya https://example.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="menu-order">Sıra (Order)</Label>
                    <Input
                      id="menu-order"
                      type="number"
                      value={menuOrder}
                      onChange={(e) => setMenuOrder(parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="menu-visible"
                      checked={menuVisible}
                      onCheckedChange={setMenuVisible}
                    />
                    <Label htmlFor="menu-visible">Menüyü Göster</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={handleCloseMenuDialog}>
                    İptal
                  </Button>
                  <Button onClick={handleSaveMenu} disabled={isPending}>
                    {isPending ? 'Kaydediliyor...' : editingMenuId ? 'Güncelle' : 'Ekle'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 mb-8">
            <div className="grid gap-2 max-w-xs">
              <Label htmlFor="categoryPagePostCount">Kategori Sayfası Gönderi Adedi</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="categoryPagePostCount"
                  type="number"
                  min={3}
                  value={menuConfig.categoryPagePostCount}
                  onChange={(e) => setMenuConfig({ categoryPagePostCount: Math.max(3, Number(e.target.value || 0)) })}
                />
                <Button
                  type="button"
                  onClick={() => {
                    startTransition(async () => {
                      const res = await updateMenuGlobalConfigAction({ categoryPagePostCount: menuConfig.categoryPagePostCount });
                      if (res.success) {
                        toast({ title: 'Ayar Kaydedildi', description: 'Kategori sayfası gösterim adedi güncellendi.' });
                        router.refresh();
                      } else {
                        toast({ variant: 'destructive', title: 'Kaydetme Başarısız', description: res.error || 'Bilinmeyen hata' });
                      }
                    });
                  }}
                >
                  Kaydet
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Tüm menüler (klasörler) için geçerli olur.</p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-4">Kategoriler (Sabit Menüler)</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alt Klasör Adı</TableHead>
                    <TableHead>Yol (slug)</TableHead>
                    <TableHead className="w-[80px] text-center">Gönderi</TableHead>
                    <TableHead className="w-[100px]">Görünür</TableHead>
                    <TableHead className="w-[100px]">Sıra</TableHead>
                    <TableHead className="text-right w-[150px]">Eylemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CATEGORIES.map((cat) => {
                    const setting = getCategorySetting(cat.id);
                    const visible = setting?.visible ?? true;
                    const order = setting?.order ?? 0;
                    const categorySlug = setting?.customSlug || cat.slug;
                    const postCount = POSTS.filter(p => p.category === categorySlug).length;
                    
                    return (
                      <React.Fragment key={cat.id}>
                        <TableRow>
                          <TableCell className="font-medium">
                            {setting?.customTitle || cat.title}
                          </TableCell>
                          <TableCell>{`/${categorySlug}`}</TableCell>
                          <TableCell className="text-center">
                            <span className="text-sm font-semibold">{postCount}</span>
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={visible}
                              onCheckedChange={(checked) => {
                                startTransition(async () => {
                                  const result = await updateCategorySettingsAction(cat.id, { visible: checked });
                                  if (result.success) {
                                    const updatedSettings = await getCategorySettingsAction();
                                    setCategorySettings(updatedSettings);
                                    toast({
                                      title: 'Güncellendi!',
                                      description: 'Kategori görünürlüğü güncellendi.',
                                    });
                                    router.refresh();
                                  }
                                });
                              }}
                              disabled={isPending}
                            />
                          </TableCell>
                          <TableCell>{order}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const setting = getCategorySetting(cat.id);
                                  setEditingCategoryId(cat.id);
                                  setCategoryVisible(visible);
                                  setCategoryOrder(order);
                                  setCategoryCustomTitle(setting?.customTitle || '');
                                  setCategoryCustomSlug(setting?.customSlug || '');
                                  setIsCategoryDialogOpen(true);
                                }}
                                disabled={isPending}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={isPending}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Kategoriyi Silmek İstediğinizden Emin misiniz?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Bu işlem geri alınamaz. Kategori kalıcı olarak silinecektir.
                                      {cat.subcategories && cat.subcategories.length > 0 && (
                                        <span className="block mt-2 text-yellow-600 font-semibold">
                                          Uyarı: Bu kategorinin {cat.subcategories.length} adet alt klasörü var. Kategori silindiğinde alt klasörler de silinecektir.
                                        </span>
                                      )}
                                      <span className="block mt-2 font-semibold">
                                        Kategori: {setting?.customTitle || cat.title}
                                      </span>
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isPending}>İptal</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => {
                                        startTransition(async () => {
                                          const result = await deleteCategoryAction(cat.id);
                                          if (result.success) {
                                            toast({
                                              title: 'Kategori Silindi!',
                                              description: 'Kategori başarıyla silindi.',
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
                                      }}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      disabled={isPending}
                                    >
                                      {isPending ? 'Siliniyor...' : 'Sil'}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                        {cat.subcategories && (cat.id === '5' || cat.id === '4') && (
                          <TableRow>
                            <TableCell colSpan={6} className="p-0">
                              <div className="pl-8 pr-4 py-4 bg-muted/30">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="text-sm font-semibold">Alt Klasörler</h4>
                                  <Dialog open={isSubcategoryDialogOpen} onOpenChange={setIsSubcategoryDialogOpen}>
                                    <DialogTrigger asChild>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => handleOpenSubcategoryDialog(cat.id)}
                                      >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Alt Klasör Ekle
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>{editingSubcategoryId ? 'Alt Klasörü Düzenle' : 'Yeni Alt Klasör Ekle'}</DialogTitle>
                                        <DialogDescription>
                                          {cat.title} kategorisine yeni bir alt klasör ekleyin.
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                          <Label htmlFor="subcategory-title">Alt Klasör Adı</Label>
                                          <Input
                                            id="subcategory-title"
                                            value={subcategoryTitle}
                                            onChange={(e) => {
                                              setSubcategoryTitle(e.target.value);
                                              if (!editingSubcategoryId) {
                                                // Auto-generate slug from title
                                                const slug = e.target.value
                                                  .toString()
                                                  .toLowerCase()
                                                  .replace(/\s+/g, '-')
                                                  .replace(/[^\w\-]+/g, '')
                                                  .replace(/\-\-+/g, '-')
                                                  .replace(/^-+/, '')
                                                  .replace(/-+$/, '');
                                                setSubcategorySlug(slug);
                                              }
                                            }}
                                            placeholder="Örn: Kur'an Videoları"
                                          />
                                        </div>
                                        <div className="grid gap-2">
                                          <Label htmlFor="subcategory-slug">Slug (Yol)</Label>
                                          <Input
                                            id="subcategory-slug"
                                            value={subcategorySlug}
                                            onChange={(e) => setSubcategorySlug(e.target.value)}
                                            placeholder="kuran-videolari"
                                          />
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button variant="outline" onClick={handleCloseSubcategoryDialog}>
                                          İptal
                                        </Button>
                                        <Button onClick={handleSaveSubcategory} disabled={isPending}>
                                          {isPending ? 'Kaydediliyor...' : editingSubcategoryId ? 'Güncelle' : 'Ekle'}
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Alt Klasör Adı</TableHead>
                                      <TableHead>Yol (slug)</TableHead>
                                      <TableHead className="w-[80px] text-center">Gönderi</TableHead>
                                      <TableHead className="text-right w-[150px]">Eylemler</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {cat.subcategories.map((sub) => {
                                      const subPostCount = POSTS.filter(p => p.category === sub.slug).length;
                                      return (
                                        <TableRow key={sub.id}>
                                          <TableCell className="font-medium">{sub.title}</TableCell>
                                          <TableCell>{`/${sub.slug}`}</TableCell>
                                          <TableCell className="text-center">
                                            <span className="text-sm font-semibold">{subPostCount}</span>
                                          </TableCell>
                                          <TableCell className="text-right">
                                          <div className="flex justify-end gap-2">
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => handleOpenSubcategoryDialog(cat.id, sub)}
                                              disabled={isPending}
                                            >
                                              <Pencil className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                              <AlertDialogTrigger asChild>
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  disabled={isPending}
                                                  className="text-destructive hover:text-destructive"
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </Button>
                                              </AlertDialogTrigger>
                                              <AlertDialogContent>
                                                <AlertDialogHeader>
                                                  <AlertDialogTitle>Alt Klasörü Silmek İstediğinizden Emin misiniz?</AlertDialogTitle>
                                                  <AlertDialogDescription>
                                                    Bu işlem geri alınamaz. Alt klasör kalıcı olarak silinecektir.
                                                    <span className="block mt-2 font-semibold">
                                                      Alt Klasör: {sub.title}
                                                    </span>
                                                  </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                  <AlertDialogCancel disabled={isPending}>İptal</AlertDialogCancel>
                                                  <AlertDialogAction
                                                    onClick={() => handleDeleteSubcategory(cat.id, sub.id)}
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    disabled={isPending}
                                                  >
                                                    {isPending ? 'Siliniyor...' : 'Sil'}
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
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                  
                  {/* Özel Menüler */}
                  {customMenus.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        Henüz özel menü eklenmemiş. Yeni menü eklemek için yukarıdaki "Yeni Menü Ekle" butonunu kullanın.
                      </TableCell>
                    </TableRow>
                  ) : (
                    customMenus.map((menu) => {
                      // Extract category slug from href (e.g., "/fotograflar" -> "fotograflar")
                      const hrefSlug = menu.href.replace(/^\//, '').toLowerCase();
                      const menuPostCount = POSTS.filter(p => {
                        const postCategory = p.category.toLowerCase();
                        return postCategory === hrefSlug || postCategory === menu.href.replace(/^\//, '');
                      }).length;
                      
                      return (
                        <TableRow key={menu.id}>
                          <TableCell className="font-medium">{menu.label}</TableCell>
                          <TableCell>{menu.href}</TableCell>
                          <TableCell className="text-center">
                            <span className="text-sm font-semibold">{menuPostCount}</span>
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={menu.visible}
                              onCheckedChange={(checked) => {
                                startTransition(async () => {
                                  const result = await updateCustomMenuAction(menu.id, { visible: checked });
                                  if (result.success) {
                                    const updatedMenus = await getCustomMenusAction();
                                    setCustomMenus(updatedMenus);
                                    toast({
                                      title: 'Güncellendi!',
                                      description: 'Menü görünürlüğü güncellendi.',
                                    });
                                    router.refresh();
                                  }
                                });
                              }}
                              disabled={isPending}
                            />
                          </TableCell>
                          <TableCell>{menu.order}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenMenuDialog(menu)}
                              disabled={isPending}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={isPending}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Menüyü Silmek İstediğinizden Emin misiniz?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bu işlem geri alınamaz. Menü kalıcı olarak silinecek.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel disabled={isPending}>İptal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteMenu(menu.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    disabled={isPending}
                                  >
                                    {isPending ? 'Siliniyor...' : 'Sil'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Category Settings Dialog */}
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Kategori Ayarlarını Düzenle</DialogTitle>
                  <DialogDescription>
                    Kategori görünürlük ve sıra ayarlarını düzenleyin.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {editingCategoryId && (
                    <>
                      <div className="grid gap-2">
                        <Label>Kategori (Orijinal)</Label>
                        <Input
                          value={CATEGORIES.find(c => c.id === editingCategoryId)?.title || ''}
                          disabled
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="category-custom-title">Menü Etiketi (Özelleştirilmiş)</Label>
                        <Input
                          id="category-custom-title"
                          value={categoryCustomTitle}
                          onChange={(e) => setCategoryCustomTitle(e.target.value)}
                          placeholder={CATEGORIES.find(c => c.id === editingCategoryId)?.title || ''}
                        />
                        <p className="text-xs text-muted-foreground">
                          Boş bırakılırsa orijinal kategori adı kullanılır.
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="category-custom-slug">Yol (slug) (Özelleştirilmiş)</Label>
                        <Input
                          id="category-custom-slug"
                          value={categoryCustomSlug}
                          onChange={(e) => setCategoryCustomSlug(e.target.value)}
                          placeholder={CATEGORIES.find(c => c.id === editingCategoryId)?.slug || ''}
                        />
                        <p className="text-xs text-muted-foreground">
                          Boş bırakılırsa orijinal slug kullanılır.
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="category-order">Sıra (Order)</Label>
                        <Input
                          id="category-order"
                          type="number"
                          inputMode="numeric"
                          min={0}
                          step={1}
                          value={Number.isFinite(categoryOrder as number) ? categoryOrder : 0}
                          onChange={(e) => {
                            const raw = e.target.value;
                            // Allow empty while typing; set state to 0 on blur/save
                            const next = raw === '' ? NaN : parseInt(raw, 10);
                            setCategoryOrder(Number.isFinite(next) && next >= 0 ? next : 0);
                          }}
                          onBlur={(e) => {
                            const raw = e.target.value;
                            const next = raw === '' ? NaN : parseInt(raw, 10);
                            setCategoryOrder(Number.isFinite(next) && next >= 0 ? next : 0);
                          }}
                          placeholder="0"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="category-visible"
                          checked={categoryVisible}
                          onCheckedChange={setCategoryVisible}
                        />
                        <Label htmlFor="category-visible">Kategoriyi Göster</Label>
                      </div>
                    </>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                    İptal
                  </Button>
                  <Button
                    onClick={() => {
                      if (!editingCategoryId) return;
                      const safeOrder = Number.isFinite(categoryOrder as number) && (categoryOrder as number) >= 0 ? (categoryOrder as number) : 0;
                      startTransition(async () => {
                        const result = await updateCategorySettingsAction(editingCategoryId, {
                          visible: categoryVisible,
                          order: safeOrder,
                          customTitle: categoryCustomTitle || undefined,
                          customSlug: categoryCustomSlug || undefined,
                        });
                        if (result.success) {
                          const updatedSettings = await getCategorySettingsAction();
                          setCategorySettings(updatedSettings);
                          toast({
                            title: 'Güncellendi!',
                            description: 'Kategori ayarları güncellendi.',
                          });
                          setIsCategoryDialogOpen(false);
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
                    {isPending ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sosyal Medya Linklerim</CardTitle>
              <CardDescription>
                Sitenizin sosyal medya profillerini yönetin. Bu linkler üst menüde ve alt bilgide görünür.
              </CardDescription>
            </div>
            <Dialog open={isSocialLinkDialogOpen} onOpenChange={setIsSocialLinkDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleOpenSocialLinkDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni Link Ekle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yeni Sosyal Medya Linki Ekle</DialogTitle>
                  <DialogDescription>
                    Yeni bir sosyal medya platformu ekleyin.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="social-link-name">Platform Adı</Label>
                    <Input
                      id="social-link-name"
                      value={socialLinkName}
                      onChange={(e) => setSocialLinkName(e.target.value)}
                      placeholder="Örn: TikTok"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="social-link-url">Profil URL'si</Label>
                    <Input
                      id="social-link-url"
                      type="url"
                      value={socialLinkUrl}
                      onChange={(e) => setSocialLinkUrl(e.target.value)}
                      placeholder="https://tiktok.com/@username"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="social-link-color">Renk (Opsiyonel)</Label>
                    <Input
                      id="social-link-color"
                      value={socialLinkColor}
                      onChange={(e) => setSocialLinkColor(e.target.value)}
                      placeholder="text-blue-600"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="social-link-active"
                      checked={socialLinkActive}
                      onCheckedChange={setSocialLinkActive}
                    />
                    <Label htmlFor="social-link-active">Aktif</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsSocialLinkDialogOpen(false)}>
                    İptal
                  </Button>
                  <Button onClick={handleSaveSocialLink} disabled={isPending}>
                    {isPending ? 'Ekleniyor...' : 'Ekle'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Sosyal Medya</TableHead>
                <TableHead className="min-w-[300px]">Profil Adresi</TableHead>
                <TableHead className="w-[100px] text-center">Aktif</TableHead>
                <TableHead className="text-right w-[120px]">Eylemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {socialLinks.map((link) => (
                <TableRow key={link.name}>
                  <TableCell className="font-medium w-[150px]">{link.name}</TableCell>
                  <TableCell className="min-w-[300px]">
                    {editingLink === link.name ? (
                      <Input
                        type="url"
                        value={urlValue}
                        onChange={(e) => setUrlValue(e.target.value)}
                        className="max-w-md"
                      />
                    ) : (
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">
                        {link.url}
                      </a>
                    )}
                  </TableCell>
                  <TableCell className="w-[100px]">
                    <div className="flex justify-center items-center">
                      <Switch
                          checked={link.active}
                          onCheckedChange={(checked) => handleToggleActive(link.name, checked)}
                          disabled={isPending}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right w-[120px]">
                    <div className="flex justify-end gap-2">
                      {editingLink === link.name ? (
                        <Button size="sm" onClick={() => handleSaveUrlClick(link.name)} disabled={isPending}>
                          {isPending ? 'Kaydediliyor...' : 'Kaydet'}
                        </Button>
                      ) : (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleEditClick(link)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isPending}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Sosyal Medya Linkini Silmek İstediğinizden Emin misiniz?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bu işlem geri alınamaz. Sosyal medya linki kalıcı olarak silinecektir.
                                  <span className="block mt-2 font-semibold">
                                    Link: {link.name}
                                  </span>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel disabled={isPending}>İptal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteSocialLink(link.name)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  disabled={isPending}
                                >
                                  {isPending ? 'Siliniyor...' : 'Sil'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Görseli Paylaş Ayarları</CardTitle>
              <CardDescription>
                Gönderi sayfalarındaki "Görseli Paylaş" bölümünde hangi platformların görüneceğini seçin.
              </CardDescription>
            </div>
            <Dialog open={isSharePlatformDialogOpen} onOpenChange={setIsSharePlatformDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleOpenSharePlatformDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni Platform Ekle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yeni Paylaşım Platformu Ekle</DialogTitle>
                  <DialogDescription>
                    Yeni bir paylaşım platformu ekleyin.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="share-platform-name">Platform Adı</Label>
                    <Input
                      id="share-platform-name"
                      value={sharePlatformName}
                      onChange={(e) => setSharePlatformName(e.target.value)}
                      placeholder="Örn: Telegram"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="share-platform-active"
                      checked={sharePlatformActive}
                      onCheckedChange={setSharePlatformActive}
                    />
                    <Label htmlFor="share-platform-active">Aktif</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsSharePlatformDialogOpen(false)}>
                    İptal
                  </Button>
                  <Button onClick={handleSaveSharePlatform} disabled={isPending}>
                    {isPending ? 'Ekleniyor...' : 'Ekle'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sosyal Medya</TableHead>
                <TableHead className="w-[100px]">Aktif</TableHead>
                <TableHead className="text-right w-[100px]">Eylemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sharePlatforms.map((platform) => (
                <TableRow key={platform.name}>
                  <TableCell className="font-medium">{platform.name}</TableCell>
                  <TableCell>
                    <Switch
                        checked={platform.active}
                        onCheckedChange={(checked) => handleToggleShareActive(platform.name, checked)}
                        disabled={isPending}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isPending}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Paylaşım Platformunu Silmek İstediğinizden Emin misiniz?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bu işlem geri alınamaz. Paylaşım platformu kalıcı olarak silinecektir.
                            <span className="block mt-2 font-semibold">
                              Platform: {platform.name}
                            </span>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isPending}>İptal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteSharePlatform(platform.name)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isPending}
                          >
                            {isPending ? 'Siliniyor...' : 'Sil'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
    </div>
  );
}
