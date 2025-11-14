'use client';

import React from 'react';
import type { ComponentType, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { updateHomepageSectionsAction } from '@/app/actions';
import { BookOpen, Bot, Layout, Eye, ZoomIn, ZoomOut, Move, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import homepageSectionsData, { type HomepageSections, type SectionDisplaySettings } from '@/lib/homepage-sections';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import Image from 'next/image';
import { CategoriesSection } from './CategoriesSection';
import { getCategorySettingsAction, getCustomMenusAction, getCategoriesAction } from '@/app/actions';
import type { CategorySettings, CustomMenu, Category } from '@/lib/types';

const iconMap: { [key: string]: ComponentType<{ className?: string }> } = {
  BookOpen,
  Bot,
};

const fontSizeOptions = ['text-sm','text-base','text-lg','text-xl','text-2xl','text-3xl'];

export default function HomepagePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [sections, setSections] = React.useState<HomepageSections>(() => {
    // Ensure branding exists
    const initialSections = homepageSectionsData || {
      branding: {
        siteName: "Cuma Mesajları",
        useLogo: false,
        logoUrl: "",
        logoAlt: "Cuma Mesajları Logo",
        textColor: "#FFD700",
        fontFamily: "Playfair Display",
        fontSize: "2xl",
        metaTitle: "Cuma Mesajları - İslami Mesajlar ve İçerik",
        metaDescription: "İslami Mesajlar, Videolar ve İçerik. Kur'an Mealleri, Tefsirler, Cuma Mesajları ve daha fazlası."
      },
      hero: {
        title: "",
        description: "",
        backgroundImage: "",
        backgroundImageHint: "",
        button1: { text: "", link: "", icon: "", visible: false },
        button2: { text: "", link: "", icon: "", visible: false }
      },
      topSection: { title: "", visible: false },
      middleSection: { title: "", visible: false },
      bottomSection: { title: "", visible: false },
      announcement: {
        enabled: false,
        message: "Hoş geldiniz!",
        durationMs: 8000,
        position: 'top-right'
      }
    };
    
    if (!initialSections.branding) {
      initialSections.branding = {
        siteName: "Cuma Mesajları",
        useLogo: false,
        logoUrl: "",
        logoAlt: "Cuma Mesajları Logo",
        textColor: "#FFD700",
        fontFamily: "Playfair Display",
        fontSize: "2xl",
        metaTitle: "Cuma Mesajları - İslami Mesajlar ve İçerik",
        metaDescription: "İslami Mesajlar, Videolar ve İçerik. Kur'an Mealleri, Tefsirler, Cuma Mesajları ve daha fazlası."
      };
    }
    
    return initialSections;
  });

  const [categorySettings, setCategorySettings] = React.useState<CategorySettings[]>([]);
  const [customMenus, setCustomMenus] = React.useState<CustomMenu[]>([]);

  // Load latest persisted sections from static JSON file (static export için)
  React.useEffect(() => {
    // Debug: PlaceHolderImages kontrolü
    console.log('PlaceHolderImages yüklendi:', PlaceHolderImages?.length || 0, 'görsel');
    
    (async () => {
      try {
        // Firebase'den ana sayfa bölümlerini çek
        const { getHomepageSectionsAction } = await import('@/app/actions');
        const data = await getHomepageSectionsAction();
        if (data && data.hero && data.branding) {
          // Migrate viewAllLink to viewAllLinks if needed
          if (data.topSection?.viewAllLink && !data.topSection?.viewAllLinks) {
            data.topSection.viewAllLinks = [data.topSection.viewAllLink];
          }
          setSections((prev) => ({ ...prev, ...data }));
        }
      } catch (e) {
        // ignore and keep current state
        console.warn('Failed to load homepage sections from JSON:', e);
      }
    })();
    getCategorySettingsAction().then(setCategorySettings);
    getCustomMenusAction().then(setCustomMenus);
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    startTransition(async () => {
      const result = await updateHomepageSectionsAction(sections);
      
      if (result.success) {
        toast({
          title: "Ana Sayfa Güncellendi!",
          description: "Ana sayfa bölümlerini başarıyla güncellendi.",
        });
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Güncelleme Başarısız!",
          description: result.error || "Ana sayfa güncellenirken bir hata oluştu.",
        });
      }
    });
  };

  const updateAnnouncement = (field: keyof NonNullable<HomepageSections['announcement']>, value: any) => {
    setSections(prev => ({
      ...prev,
      announcement: { ...(prev.announcement || { enabled: false, message: '', durationMs: 8000, position: 'top-right' }), [field]: value }
    }));
  };

  const updateHero = (field: keyof HomepageSections['hero'], value: any) => {
    setSections(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  const updateButton = (buttonNumber: 1 | 2, field: string, value: any) => {
    setSections(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [`button${buttonNumber}`]: {
          ...prev.hero[`button${buttonNumber}` as keyof typeof prev.hero] as any,
          [field]: value
        }
      }
    }));
  };

  const updateSection = (sectionName: 'topSection' | 'middleSection' | 'bottomSection', field: string, value: any) => {
    setSections(prev => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        [field]: value
      }
    }));
  };

  const selectBackgroundImage = (imageUrl: string, imageHint: string) => {
    updateHero('backgroundImage', imageUrl);
    updateHero('backgroundImageHint', imageHint);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ana Sayfa Düzenleme</h1>
          <p className="text-muted-foreground">Ana sayfa bölümlerini özelleştirin.</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.push('/')} asChild>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Eye className="mr-2 h-4 w-4" />
              Önizleme
            </a>
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList>
          <TabsTrigger value="branding">Site Markası</TabsTrigger>
          <TabsTrigger value="hero">Hero Bölümü</TabsTrigger>
          <TabsTrigger value="top">Üst Bölüm</TabsTrigger>
          <TabsTrigger value="categories">Kategoriler</TabsTrigger>
          <TabsTrigger value="middle">Orta Bölüm</TabsTrigger>
          <TabsTrigger value="bottom">Alt Bölüm</TabsTrigger>
          <TabsTrigger value="announcement">Açılış Mesajı</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="analytics">Analiz</TabsTrigger>
        </TabsList>

        {/* Site Markası Bölümü */}
        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Markası - Logo ve Başlık</CardTitle>
              <CardDescription>
                Site adını ve logo ayarlarını düzenleyin. Logo, header ve footer'da görüntülenir.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3">
                <Switch
                  checked={!!sections.branding?.useLogo}
                  onCheckedChange={(checked)=> setSections(prev=> ({...prev, branding: { ...(prev.branding||{}), useLogo: checked }}))}
                />
                <Label>Logo Kullan</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Adı</Label>
                <Input
                  id="site-name"
                  value={sections.branding?.siteName || ''}
                  onChange={(e) => {
                    setSections(prev => ({
                      ...prev,
                      branding: {
                        ...prev.branding || {
                          siteName: "Cuma Mesajları",
                          useLogo: false,
                          logoUrl: "",
                          logoAlt: "Cuma Mesajları Logo",
                          textColor: "#FFD700",
                          fontFamily: "Playfair Display",
                          fontSize: "2xl"
                        },
                        siteName: e.target.value
                      }
                    }));
                  }}
                  placeholder="Cuma Mesajları"
                />
                <p className="text-sm text-muted-foreground">
                  Logo kullanılmazsa bu metin görüntülenir.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-title">Sayfa Başlığı (Meta Title)</Label>
                <Input
                  id="meta-title"
                  value={sections.branding?.metaTitle || ''}
                  onChange={(e) => {
                    setSections(prev => ({
                      ...prev,
                      branding: {
                        ...prev.branding || {
                          siteName: "Cuma Mesajları",
                          useLogo: false,
                          logoUrl: "",
                          logoAlt: "Cuma Mesajları Logo",
                          textColor: "#FFD700",
                          fontFamily: "Playfair Display",
                          fontSize: "2xl"
                        },
                        metaTitle: e.target.value
                      }
                    }));
                  }}
                  placeholder="Cuma Mesajları - İslami Mesajlar ve İçerik"
                />
                <p className="text-sm text-muted-foreground">
                  Web sayfası başlığı (tarayıcı sekmesinde görünen). SEO için önemlidir.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-description">Sayfa Açıklaması (Meta Description)</Label>
                <Textarea
                  id="meta-description"
                  value={sections.branding?.metaDescription || ''}
                  onChange={(e) => {
                    setSections(prev => ({
                      ...prev,
                      branding: {
                        ...prev.branding || {
                          siteName: "Cuma Mesajları",
                          useLogo: false,
                          logoUrl: "",
                          logoAlt: "Cuma Mesajları Logo",
                          textColor: "#FFD700",
                          fontFamily: "Playfair Display",
                          fontSize: "2xl"
                        },
                        metaDescription: e.target.value
                      }
                    }));
                  }}
                  placeholder="İslami Mesajlar, Videolar ve İçerik. Kur'an Mealleri, Tefsirler, Cuma Mesajları ve daha fazlası."
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  Arama motorlarında görünen açıklama metni. SEO için önemlidir.
                </p>
              </div>

              {!sections.branding?.useLogo && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="text-color">Metin Rengi</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="text-color"
                        type="color"
                        value={sections.branding?.textColor || '#FFD700'}
                        onChange={(e) => {
                          setSections(prev => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              textColor: e.target.value
                            }
                          }));
                        }}
                        className="w-20 h-10"
                      />
                      <Input
                        type="text"
                        value={sections.branding?.textColor || '#FFD700'}
                        onChange={(e) => {
                          setSections(prev => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              textColor: e.target.value
                            }
                          }));
                        }}
                        placeholder="#FFD700"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="font-family">Font Ailesi</Label>
                    <Select
                      value={sections.branding?.fontFamily || 'Playfair Display'}
                      onValueChange={(value) => {
                        setSections(prev => ({
                          ...prev,
                          branding: {
                            ...prev.branding,
                            fontFamily: value
                          }
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Font seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                        <SelectItem value="PT Sans">PT Sans</SelectItem>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Lato">Lato</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                        <SelectItem value="Raleway">Raleway</SelectItem>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="font-size">Font Büyüklüğü</Label>
                    <Select
                      value={sections.branding?.fontSize || '2xl'}
                      onValueChange={(value) => {
                        setSections(prev => ({
                          ...prev,
                          branding: {
                            ...prev.branding,
                            fontSize: value
                          }
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Font büyüklüğü seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="xs">Çok Küçük (xs)</SelectItem>
                        <SelectItem value="sm">Küçük (sm)</SelectItem>
                        <SelectItem value="base">Normal (base)</SelectItem>
                        <SelectItem value="lg">Büyük (lg)</SelectItem>
                        <SelectItem value="xl">Daha Büyük (xl)</SelectItem>
                        <SelectItem value="2xl">2x Büyük (2xl)</SelectItem>
                        <SelectItem value="3xl">3x Büyük (3xl)</SelectItem>
                        <SelectItem value="4xl">4x Büyük (4xl)</SelectItem>
                        <SelectItem value="5xl">5x Büyük (5xl)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  checked={sections.branding?.useLogo || false}
                  onCheckedChange={(checked) => {
                    setSections(prev => ({
                      ...prev,
                      branding: {
                        ...prev.branding,
                        useLogo: checked
                      }
                    }));
                  }}
                />
                <Label>Logo Kullan</Label>
              </div>

              {sections.branding?.useLogo && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="logo-url">Logo URL</Label>
                    <div className="flex items-center gap-4">
                      {sections.branding?.logoUrl && (
                        <div className="relative w-32 h-20 rounded-md overflow-hidden border">
                          <Image
                            src={sections.branding.logoUrl}
                            alt="Logo preview"
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      <Input
                        id="logo-url"
                        type="url"
                        value={sections.branding?.logoUrl || ''}
                        onChange={(e) => {
                          setSections(prev => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              logoUrl: e.target.value
                            }
                          }));
                        }}
                        placeholder="https://example.com/logo.png"
                        className="flex-1"
                      />
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline">
                            <Layout className="mr-2 h-4 w-4" />
                            Galeriden Seç
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Logo Seç</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto p-4">
                            {PlaceHolderImages.map(image => (
                              <DialogClose key={image.id} asChild>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSections(prev => ({
                                      ...prev,
                                      branding: {
                                        ...prev.branding,
                                        logoUrl: image.imageUrl,
                                        logoAlt: image.description
                                      }
                                    }));
                                  }}
                                  className="group relative focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
                                >
                                  <Image
                                    src={image.imageUrl}
                                    alt={image.description}
                                    width={200}
                                    height={120}
                                    className="aspect-video w-full rounded-md object-cover transition-transform group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                                    <span className="text-white text-sm font-semibold">Seç</span>
                                  </div>
                                </button>
                              </DialogClose>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo-alt">Logo Alt Metni</Label>
                    <Input
                      id="logo-alt"
                      value={sections.branding?.logoAlt || ''}
                      onChange={(e) => {
                        setSections(prev => ({
                          ...prev,
                          branding: {
                            ...prev.branding,
                            logoAlt: e.target.value
                          }
                        }));
                      }}
                      placeholder="Site logosu"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

        </TabsContent>

        {/* Footer Ayarları */}
        <TabsContent value="footer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Footer</CardTitle>
              <CardDescription>Sayfanın alt kısmında görünen bilgileri yönetin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="footer-title">Başlık</Label>
                <Input
                  id="footer-title"
                  value={sections.footer?.title || ''}
                  onChange={(e) => setSections(prev => ({
                    ...prev,
                    footer: {
                      title: e.target.value,
                      text: prev.footer?.text || 'Tüm hakları saklıdır.',
                      showYear: prev.footer?.showYear ?? true,
                      showSocials: prev.footer?.showSocials ?? true,
                      links: prev.footer?.links || [],
                    }
                  }))}
                  placeholder="Sosyal Medya Linklerim"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footer-text">Footer Metni</Label>
                <Input
                  id="footer-text"
                  value={sections.footer?.text || ''}
                  onChange={(e) => setSections(prev => ({
                    ...prev,
                    footer: {
                      title: prev.footer?.title || 'Sosyal Medya Linklerim',
                      text: e.target.value,
                      showYear: prev.footer?.showYear ?? true,
                      showSocials: prev.footer?.showSocials ?? true,
                      links: prev.footer?.links || [],
                    }
                  }))}
                  placeholder="Tüm hakları saklıdır."
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={sections.footer?.showYear ?? true}
                    onCheckedChange={(checked) => setSections(prev => ({
                      ...prev,
                      footer: {
                        title: prev.footer?.title || 'Sosyal Medya Linklerim',
                        text: prev.footer?.text || 'Tüm hakları saklıdır.',
                        showYear: checked,
                        showSocials: prev.footer?.showSocials ?? true,
                        links: prev.footer?.links || [],
                      }
                    }))}
                  />
                  <Label>Yılı Göster</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={sections.footer?.showSocials ?? true}
                    onCheckedChange={(checked) => setSections(prev => ({
                      ...prev,
                      footer: {
                        title: prev.footer?.title || 'Sosyal Medya Linklerim',
                        text: prev.footer?.text || 'Tüm hakları saklıdır.',
                        showYear: prev.footer?.showYear ?? true,
                        showSocials: checked,
                        links: prev.footer?.links || [],
                      }
                    }))}
                  />
                  <Label>Sosyal İkonları Göster</Label>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Web Sayfaları (Maksimum 5)</Label>
                </div>
                <div className="space-y-4">
                  {Array.from({ length: 5 }, (_, index) => {
                    const links = sections.footer?.links || [];
                    const link = links[index] || { label: '', url: '' };
                    
                    return (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
                        <div className="space-y-2">
                          <Label htmlFor={`footer-link-label-${index}`}>Sayfa Adı {index + 1}</Label>
                          <Input
                            id={`footer-link-label-${index}`}
                            value={link.label}
                            onChange={(e) => {
                              const currentLinks = sections.footer?.links || [];
                              const updatedLinks = [...currentLinks];
                              updatedLinks[index] = { ...link, label: e.target.value };
                              // Keep only valid links (with at least a label or url)
                              const validLinks = updatedLinks.filter(l => l.label || l.url);
                              
                              setSections(prev => ({
                                ...prev,
                                footer: {
                                  title: prev.footer?.title || 'Sosyal Medya Linklerim',
                                  text: prev.footer?.text || 'Tüm hakları saklıdır.',
                                  showYear: prev.footer?.showYear ?? true,
                                  showSocials: prev.footer?.showSocials ?? true,
                                  links: validLinks,
                                }
                              }));
                            }}
                            placeholder={`Sayfa adı ${index + 1}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`footer-link-url-${index}`}>URL {index + 1}</Label>
                          <Input
                            id={`footer-link-url-${index}`}
                            type="url"
                            value={link.url}
                            onChange={(e) => {
                              const currentLinks = sections.footer?.links || [];
                              const updatedLinks = [...currentLinks];
                              updatedLinks[index] = { ...link, url: e.target.value };
                              // Keep only valid links (with at least a label or url)
                              const validLinks = updatedLinks.filter(l => l.label || l.url);
                              
                              setSections(prev => ({
                                ...prev,
                                footer: {
                                  title: prev.footer?.title || 'Sosyal Medya Linklerim',
                                  text: prev.footer?.text || 'Tüm hakları saklıdır.',
                                  showYear: prev.footer?.showYear ?? true,
                                  showSocials: prev.footer?.showSocials ?? true,
                                  links: validLinks,
                                }
                              }));
                            }}
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Announcement settings */}
        <TabsContent value="announcement">
          <Card>
            <CardHeader>
              <CardTitle>Açılış Mesajı (Baloncuk)</CardTitle>
              <CardDescription>Sayfa açılışında sağda görünecek şeffaf mesaj kutusunu yönetin.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Aktif</Label>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={!!sections.announcement?.enabled}
                      onCheckedChange={(v) => updateAnnouncement('enabled', v)}
                    />
                    <span className="text-sm text-muted-foreground">Mesaj baloncuğunu göster</span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Süre (ms)</Label>
                  <Input
                    type="number"
                    value={sections.announcement?.durationMs ?? 8000}
                    onChange={(e) => updateAnnouncement('durationMs', Number(e.target.value))}
                    placeholder="8000"
                  />
                  <p className="text-xs text-muted-foreground">0 yazarsanız kullanıcı kapatana kadar ekranda kalır.</p>
                </div>
                <div className="grid gap-2">
                  <Label>Arkaplan Rengi</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={sections.announcement?.bgColor ?? '#111827'}
                      onChange={(e) => updateAnnouncement('bgColor', e.target.value)}
                      className="h-9 w-12 cursor-pointer rounded-md border"
                      aria-label="Arkaplan rengi seç"
                    />
                    <Input
                      type="text"
                      value={sections.announcement?.bgColor ?? ''}
                      onChange={(e) => updateAnnouncement('bgColor', e.target.value)}
                      placeholder="#111827"
                      className="w-40"
                    />
                    <span
                      className="inline-block h-9 w-9 rounded-md border"
                      style={{ backgroundColor: sections.announcement?.bgColor || '#111827' }}
                      aria-hidden
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Yazı Rengi</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={sections.announcement?.textColor ?? '#ffffff'}
                      onChange={(e) => updateAnnouncement('textColor', e.target.value)}
                      className="h-9 w-12 cursor-pointer rounded-md border"
                      aria-label="Yazı rengi seç"
                    />
                    <Input
                      type="text"
                      value={sections.announcement?.textColor ?? ''}
                      onChange={(e) => updateAnnouncement('textColor', e.target.value)}
                      placeholder="#ffffff"
                      className="w-40"
                    />
                    <span
                      className="inline-block h-9 w-9 rounded-md border"
                      style={{ backgroundColor: sections.announcement?.textColor || '#ffffff' }}
                      aria-hidden
                    />
                  </div>
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <Label>Mesaj Metni</Label>
                  <Textarea
                    value={sections.announcement?.message ?? ''}
                    onChange={(e) => updateAnnouncement('message', e.target.value)}
                    placeholder="Ziyaretçilere göstermek istediğiniz karşılama mesajı..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hero Bölümü */}
        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Bölümü - Manevi Huzurun Buluşma Noktası</CardTitle>
              <CardDescription>
                Ana sayfanın üst kısmındaki büyük banner bölümünü düzenleyin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-center gap-3">
                <Switch
                  checked={sections.hero.page1Enabled ?? true}
                  onCheckedChange={(v)=>setSections(prev=>({...prev, hero:{...prev.hero, page1Enabled: v}}))}
                />
                <div>
                  <Label className="font-medium">Hero Altı Görsel Slaytı</Label>
                  <p className="text-sm text-muted-foreground">Kapalı olduğunda hero altında dönüşümlü görseller gösterilmez.</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-3">
                  <Label className="font-medium text-lg">Sayfa 1</Label>
                  <div className="space-y-2">
                    <Label className="font-medium">Slaytta Gösterilecek Sayfa</Label>
                    <Select
                      value={String(sections.hero.activePage || 1)}
                      onValueChange={(value) => setSections(prev => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          activePage: Number(value) as 1 | 2 | 3
                        }
                      }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sayfa seçiniz" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Sayfa 1 - Görsel Slaytı</SelectItem>
                        <SelectItem value="2">Sayfa 2 - Rastgele Görsel</SelectItem>
                        <SelectItem value="3">Sayfa 3 - Haftanın Mesajı</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Görsel Listesi</Label>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline" size="sm">
                        <Layout className="mr-2 h-4 w-4" />
                        Yeni Slayt Görseli Ekle
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-7xl">
                      <DialogHeader>
                        <DialogTitle>Yeni Slayt Görseli Seç</DialogTitle>
                      </DialogHeader>
                      {PlaceHolderImages && PlaceHolderImages.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 max-h-[75vh] overflow-y-auto p-6">
                          {PlaceHolderImages.map(image => {
                            const selected = (sections.hero.page1Images||[]).some(i=>i.imageUrl===image.imageUrl);
                            return (
                              <button
                                key={image.id}
                                type="button"
                                onClick={()=>setSections(prev=>({
                                  ...prev,
                                  hero:{
                                    ...prev.hero,
                                    page1Images: selected
                                      ? (prev.hero.page1Images||[]).filter(img => img.imageUrl !== image.imageUrl)
                                      : [ ...(prev.hero.page1Images||[]), { imageUrl: image.imageUrl, duration: 5000, objectPosition: 'center', zoom: 1, panX: 0, panY: 0 } ]
                                  }
                                }))}
                                className={`group relative rounded-md border overflow-hidden aspect-video w-full ${selected ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-primary'}`}
                              >
                                <div className="relative w-full h-full">
                                  <Image 
                                    src={image.imageUrl} 
                                    alt={image.description} 
                                    fill
                                    className="object-cover rounded-md" 
                                  />
                                </div>
                                {selected && <span className="absolute right-1 top-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded z-10">Seçili</span>}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-8 text-center text-muted-foreground">
                          <p>Görsel bulunamadı. Lütfen placeholder-images.json dosyasını kontrol edin.</p>
                        </div>
                      )}
                      <div className="flex justify-end p-4 pt-0">
                        <DialogClose asChild>
                          <Button type="button">Tamam</Button>
                        </DialogClose>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex flex-col gap-3">
                  {(sections.hero.page1Images || []).length === 0 && (
                    <p className="text-sm text-muted-foreground">Henüz görsel eklenmedi. Yukarıdaki butondan yeni slayt görseli ekleyebilirsiniz.</p>
                  )}

                  {(sections.hero.page1Images || []).map((it, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-3 p-3 border rounded-md hover:bg-muted/50"
                    >
                      <div className="flex flex-col gap-2 shrink-0">
                        <div 
                          className="relative w-32 h-20 rounded-md overflow-hidden border group"
                        >
                          <Image src={it.imageUrl} alt={`bg-${idx}`} fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                        </div>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (idx > 0) {
                                setSections(prev => {
                                  const newImages = [...(prev.hero.page1Images || [])];
                                  [newImages[idx - 1], newImages[idx]] = [newImages[idx], newImages[idx - 1]];
                                  return {
                                    ...prev,
                                    hero: {
                                      ...prev.hero,
                                      page1Images: newImages
                                    }
                                  };
                                });
                              }
                            }}
                            disabled={idx === 0}
                            className="flex-1"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const images = sections.hero.page1Images || [];
                              if (idx < images.length - 1) {
                                setSections(prev => {
                                  const newImages = [...(prev.hero.page1Images || [])];
                                  [newImages[idx], newImages[idx + 1]] = [newImages[idx + 1], newImages[idx]];
                                  return {
                                    ...prev,
                                    hero: {
                                      ...prev.hero,
                                      page1Images: newImages
                                    }
                                  };
                                });
                              }
                            }}
                            disabled={idx === (sections.hero.page1Images || []).length - 1}
                            className="flex-1"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              className="w-full"
                            >
                              <Layout className="mr-2 h-4 w-4" />
                              Görsel Değiştir
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-7xl">
                            <DialogHeader>
                              <DialogTitle>Slayt {idx + 1} - Görsel Değiştir</DialogTitle>
                            </DialogHeader>
                            {PlaceHolderImages && PlaceHolderImages.length > 0 ? (
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 max-h-[75vh] overflow-y-auto p-6">
                                {PlaceHolderImages.map(image => {
                                  const isCurrentImage = it.imageUrl === image.imageUrl;
                                  const isUsedInOtherSlide = (sections.hero.page1Images||[]).some((img, i) => i !== idx && img.imageUrl === image.imageUrl);
                                  return (
                                    <button
                                      key={image.id}
                                      type="button"
                                      onClick={()=>setSections(prev=>({
                                        ...prev,
                                        hero:{
                                          ...prev.hero,
                                          page1Images: (prev.hero.page1Images||[]).map((img, i) => 
                                            i === idx ? { ...img, imageUrl: image.imageUrl } : img
                                          )
                                        }
                                      }))}
                                      disabled={isCurrentImage || isUsedInOtherSlide}
                                      className={`group relative rounded-md border overflow-hidden aspect-video w-full ${
                                        isCurrentImage 
                                          ? 'ring-2 ring-primary' 
                                          : isUsedInOtherSlide 
                                          ? 'opacity-50 cursor-not-allowed' 
                                          : 'hover:ring-2 hover:ring-primary'
                                      }`}
                                    >
                                      <div className="relative w-full h-full">
                                        <Image 
                                          src={image.imageUrl} 
                                          alt={image.description} 
                                          fill
                                          className="object-cover rounded-md" 
                                        />
                                      </div>
                                      {isCurrentImage && <span className="absolute right-1 top-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded z-10">Mevcut</span>}
                                      {isUsedInOtherSlide && !isCurrentImage && <span className="absolute right-1 top-1 bg-muted text-muted-foreground text-xs px-1.5 py-0.5 rounded z-10">Kullanılıyor</span>}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="p-8 text-center text-muted-foreground">
                                <p>Görsel bulunamadı. Lütfen placeholder-images.json dosyasını kontrol edin.</p>
                              </div>
                            )}
                            <div className="flex justify-end p-4 pt-0">
                              <DialogClose asChild>
                                <Button type="button">Tamam</Button>
                              </DialogClose>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            if (confirm(`Slayt ${idx + 1} görselini silmek istediğinize emin misiniz?`)) {
                              setSections(prev => ({
                                ...prev,
                                hero: {
                                  ...prev.hero,
                                  page1Images: (prev.hero.page1Images || []).filter((_, i) => i !== idx)
                                }
                              }));
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Slaytı Sil
                        </Button>
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="font-medium">Mesaj 1 (Üst Sol)</Label>
                          </div>
                          <Textarea
                            placeholder="Görsel üst mesajı (Enter ile satır oluşturabilirsiniz)"
                            value={it.message1?.text || ''}
                            onChange={(e)=>setSections(prev=>({
                              ...prev,
                              hero:{
                                ...prev.hero,
                                page1Images: (prev.hero.page1Images||[]).map((img,i)=> i===idx ? { ...img, message1: { ...(img.message1 || {}), text: e.target.value } } : img)
                              }
                            }))}
                            rows={4}
                            className="w-full resize-y"
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label>Yazı Rengi</Label>
                              <div className="flex items-center gap-3">
                                <Input
                                  type="color"
                                  value={it.message1?.color || '#ffffff'}
                                  onChange={(e)=>setSections(prev=>({
                                    ...prev,
                                    hero:{
                                      ...prev.hero,
                                      page1Images: (prev.hero.page1Images||[]).map((img,i)=> i===idx ? { ...img, message1: { ...(img.message1 || {}), color: e.target.value } } : img)
                                      }
                                  }))}
                                  className="h-10 w-14 p-1"
                                />
                                <Input
                                  value={it.message1?.color || ''}
                                  onChange={(e)=>setSections(prev=>({
                                    ...prev,
                                    hero:{
                                      ...prev.hero,
                                      page1Images: (prev.hero.page1Images||[]).map((img,i)=> i===idx ? { ...img, message1: { ...(img.message1 || {}), color: e.target.value } } : img)
                                    }
                                  }))}
                                  placeholder="#ffffff"
                                  className="flex-1"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Yazı Boyutu</Label>
                              <Select
                                value={it.message1?.fontSize || 'text-3xl'}
                                onValueChange={(value)=>setSections(prev=>({
                                  ...prev,
                                  hero:{
                                    ...prev.hero,
                                    page1Images: (prev.hero.page1Images||[]).map((img,i)=> i===idx ? { ...img, message1: { ...(img.message1 || {}), fontSize: value } } : img)
                                  }
                                }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seçiniz" />
                                </SelectTrigger>
                                <SelectContent>
                                  {fontSizeOptions.map(opt => (
                                    <SelectItem key={opt} value={opt}>{opt.replace('text-','').toUpperCase()}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="font-medium">Mesaj 2 (Alt Sol)</Label>
                          </div>
                          <Input
                            placeholder="Görsel alt mesajı"
                            value={it.message2?.text || ''}
                            onChange={(e)=>setSections(prev=>({
                              ...prev,
                              hero:{
                                ...prev.hero,
                                page1Images: (prev.hero.page1Images||[]).map((img,i)=> i===idx ? { ...img, message2: { ...(img.message2 || {}), text: e.target.value } } : img)
                              }
                            }))}
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label>Yazı Rengi</Label>
                              <div className="flex items-center gap-3">
                                <Input
                                  type="color"
                                  value={it.message2?.color || '#ffffff'}
                                  onChange={(e)=>setSections(prev=>({
                                    ...prev,
                                    hero:{
                                      ...prev.hero,
                                      page1Images: (prev.hero.page1Images||[]).map((img,i)=> i===idx ? { ...img, message2: { ...(img.message2 || {}), color: e.target.value } } : img)
                                    }
                                  }))}
                                  className="h-10 w-14 p-1"
                                />
                                <Input
                                  value={it.message2?.color || ''}
                                  onChange={(e)=>setSections(prev=>({
                                    ...prev,
                                    hero:{
                                      ...prev.hero,
                                      page1Images: (prev.hero.page1Images||[]).map((img,i)=> i===idx ? { ...img, message2: { ...(img.message2 || {}), color: e.target.value } } : img)
                                    }
                                  }))}
                                  placeholder="#ffffff"
                                  className="flex-1"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Yazı Boyutu</Label>
                              <Select
                                value={it.message2?.fontSize || 'text-xl'}
                                onValueChange={(value)=>setSections(prev=>({
                                  ...prev,
                                  hero:{
                                    ...prev.hero,
                                    page1Images: (prev.hero.page1Images||[]).map((img,i)=> i===idx ? { ...img, message2: { ...(img.message2 || {}), fontSize: value } } : img)
                                  }
                                }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seçiniz" />
                                </SelectTrigger>
                                <SelectContent>
                                  {fontSizeOptions.map(opt => (
                                    <SelectItem key={opt} value={opt}>{opt.replace('text-','').toUpperCase()}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Süre (saniye)</Label>
                          <Input
                            type="number"
                            min="1"
                            max="60"
                            className="w-28"
                            placeholder="5"
                            value={it.duration ? String(it.duration / 1000) : ''}
                            onChange={(e)=>setSections(prev=>({
                              ...prev,
                              hero:{
                                ...prev.hero,
                                page1Images: (prev.hero.page1Images||[]).map((img,i)=> i===idx ? { ...img, duration: e.target.value ? Number(e.target.value) * 1000 : undefined } : img)
                              }
                            }))}
                          />
                        </div>

                        <div className="space-y-4 border-t pt-4">
                          <Label className="text-base font-semibold">Görsel Düzenleme</Label>
                          <p className="text-xs text-muted-foreground mb-4">
                            Görseli büyütüp küçültebilir ve kaydırarak slaytta görünecek bölümü ayarlayabilirsiniz.
                          </p>
                          
                          {/* Görsel Önizleme Kutusu */}
                          <div className="relative w-full h-64 border-2 border-dashed rounded-lg overflow-hidden bg-muted/20">
                            <div 
                              className="relative w-full h-full cursor-move"
                              style={{
                                backgroundImage: `url('${it.imageUrl}')`,
                                backgroundSize: `${(it.zoom || 1) * 100}%`,
                                backgroundPosition: `${50 + (it.panX || 0) * 0.5}% ${50 + (it.panY || 0) * 0.5}%`,
                                backgroundRepeat: 'no-repeat',
                                transition: 'background-position 0.1s ease-out, background-size 0.1s ease-out'
                              }}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const rect = e.currentTarget.getBoundingClientRect();
                                const startX = e.clientX;
                                const startY = e.clientY;
                                const startPanX = it.panX || 0;
                                const startPanY = it.panY || 0;
                                
                                const handleMouseMove = (moveEvent: MouseEvent) => {
                                  const deltaX = ((moveEvent.clientX - startX) / rect.width) * 200;
                                  const deltaY = ((moveEvent.clientY - startY) / rect.height) * 200;
                                  const newPanX = Math.max(-100, Math.min(100, startPanX + deltaX));
                                  const newPanY = Math.max(-100, Math.min(100, startPanY + deltaY));
                                  
                                  setSections(prev => ({
                                    ...prev,
                                    hero: {
                                      ...prev.hero,
                                      page1Images: (prev.hero.page1Images||[]).map((img, i) => 
                                        i === idx ? { ...img, panX: newPanX, panY: newPanY } : img
                                      )
                                    }
                                  }));
                                };
                                
                                const handleMouseUp = () => {
                                  document.removeEventListener('mousemove', handleMouseMove);
                                  document.removeEventListener('mouseup', handleMouseUp);
                                };
                                
                                document.addEventListener('mousemove', handleMouseMove);
                                document.addEventListener('mouseup', handleMouseUp);
                              }}
                            />
                          </div>

                          {/* Zoom Kontrolü */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="flex items-center gap-2">
                                <ZoomIn className="h-4 w-4" />
                                Büyütme/Küçültme
                              </Label>
                              <span className="text-sm text-muted-foreground">
                                {Math.round((it.zoom || 1) * 100)}%
                              </span>
                            </div>
                            <Slider
                              value={[it.zoom || 1]}
                              onValueChange={(values) => {
                                setSections(prev => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    page1Images: (prev.hero.page1Images||[]).map((img, i) => 
                                      i === idx ? { ...img, zoom: values[0] } : img
                                    )
                                  }
                                }));
                              }}
                              min={0.5}
                              max={3}
                              step={0.1}
                              className="w-full"
                            />
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>50%</span>
                              <span>100%</span>
                              <span>200%</span>
                              <span>300%</span>
                            </div>
                          </div>

                          {/* Pan Kontrolü (Yatay) */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="flex items-center gap-2">
                                <Move className="h-4 w-4" />
                                Yatay Kaydırma
                              </Label>
                              <span className="text-sm text-muted-foreground">
                                {Math.round(it.panX || 0)}%
                              </span>
                            </div>
                            <Slider
                              value={[it.panX || 0]}
                              onValueChange={(values) => {
                                setSections(prev => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    page1Images: (prev.hero.page1Images||[]).map((img, i) => 
                                      i === idx ? { ...img, panX: values[0] } : img
                                    )
                                  }
                                }));
                              }}
                              min={-100}
                              max={100}
                              step={1}
                              className="w-full"
                            />
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Sol (-100%)</span>
                              <span>Merkez (0%)</span>
                              <span>Sağ (100%)</span>
                            </div>
                          </div>

                          {/* Pan Kontrolü (Dikey) */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="flex items-center gap-2">
                                <Move className="h-4 w-4 rotate-90" />
                                Dikey Kaydırma
                              </Label>
                              <span className="text-sm text-muted-foreground">
                                {Math.round(it.panY || 0)}%
                              </span>
                            </div>
                            <Slider
                              value={[it.panY || 0]}
                              onValueChange={(values) => {
                                setSections(prev => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    page1Images: (prev.hero.page1Images||[]).map((img, i) => 
                                      i === idx ? { ...img, panY: values[0] } : img
                                    )
                                  }
                                }));
                              }}
                              min={-100}
                              max={100}
                              step={1}
                              className="w-full"
                            />
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Üst (-100%)</span>
                              <span>Merkez (0%)</span>
                              <span>Alt (100%)</span>
                            </div>
                          </div>

                          {/* Butonlar */}
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={async () => {
                                // Görsel boyutlarını al
                                const imgElement = document.createElement('img');
                                imgElement.src = it.imageUrl;
                                await new Promise((resolve, reject) => {
                                  imgElement.onload = resolve;
                                  imgElement.onerror = reject;
                                });
                                
                                const containerWidth = 256; // Önizleme kutusu genişliği (h-64 = 256px)
                                const containerHeight = 256; // Önizleme kutusu yüksekliği
                                const imageWidth = imgElement.naturalWidth;
                                const imageHeight = imgElement.naturalHeight;
                                
                                // Container'a sığacak zoom değerini hesapla
                                const scaleX = containerWidth / imageWidth;
                                const scaleY = containerHeight / imageHeight;
                                const fitZoom = Math.min(scaleX, scaleY);
                                
                                setSections(prev => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    page1Images: (prev.hero.page1Images||[]).map((img, i) => 
                                      i === idx ? { ...img, zoom: fitZoom, panX: 0, panY: 0, objectPosition: 'center' } : img
                                    )
                                  }
                                }));
                              }}
                            >
                              Sığdır
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                setSections(prev => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    page1Images: (prev.hero.page1Images||[]).map((img, i) => 
                                      i === idx ? { ...img, zoom: 1, panX: 0, panY: 0, objectPosition: 'center' } : img
                                    )
                                  }
                                }));
                              }}
                            >
                              Sıfırla
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={()=>setSections(prev=>({
                          ...prev,
                          hero:{...prev.hero, page1Images:(prev.hero.page1Images||[]).filter((_,i)=>i!==idx)}
                        }))}
                        aria-label="Görseli kaldır"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-title">Hero Başlığı</Label>
                  <Input
                    id="hero-title"
                    value={sections.hero.title}
                    onChange={(e) => updateHero('title', e.target.value)}
                    placeholder="Ana başlık"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-description">Hero Açıklaması</Label>
                  <Textarea
                    id="hero-description"
                    value={sections.hero.description}
                    onChange={(e) => updateHero('description', e.target.value)}
                    placeholder="Açıklama metni"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid gap-4 border-t pt-6">
                <h3 className="font-semibold">Sayfa 2: Rastgele Görseller</h3>
                <div className="flex items-center gap-2">
                  <Switch checked={!!sections.hero.page2Random?.enabled} onCheckedChange={(v)=>setSections(prev=>({...prev, hero:{...prev.hero, page2Random:{enabled:v, folderSlug: prev.hero.page2Random?.folderSlug || 'cuma-mesajlari'}}}))} />
                  <Label>Aktif</Label>
                </div>
                <div className="space-y-2">
                  <Label>Kaynak Klasör (slug)</Label>
                  <Input value={sections.hero.page2Random?.folderSlug || ''} onChange={(e)=>setSections(prev=>({...prev, hero:{...prev.hero, page2Random:{enabled: prev.hero.page2Random?.enabled ?? true, folderSlug: e.target.value}}}))} placeholder="cuma-mesajlari" />
                </div>
                <h3 className="font-semibold">Sayfa 3: Haftanın Mesajı</h3>
                <div className="flex items-center gap-2">
                  <Switch checked={!!sections.hero.page3Patient?.enabled} onCheckedChange={(v)=>setSections(prev=>({...prev, hero:{...prev.hero, page3Patient:{enabled:v, mode: prev.hero.page3Patient?.mode || 'text', text: prev.hero.page3Patient?.text || ''}}}))} />
                  <Label>Aktif</Label>
                </div>
                <div className="space-y-2">
                  <Label>Mod</Label>
                  <Select value={sections.hero.page3Patient?.mode || 'text'} onValueChange={(val)=>setSections(prev=>({...prev, hero:{...prev.hero, page3Patient:{...prev.hero.page3Patient, mode: val as 'text'|'image', enabled: prev.hero.page3Patient?.enabled ?? true}}}))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Mesaj (Metin)</SelectItem>
                      <SelectItem value="image">Görsel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {sections.hero.page3Patient?.mode === 'text' ? (
                  <div className="space-y-2">
                  <Label>Haftanın Mesajı</Label>
                    <Textarea value={sections.hero.page3Patient?.text || ''} onChange={(e)=>setSections(prev=>({...prev, hero:{...prev.hero, page3Patient:{...prev.hero.page3Patient, text: e.target.value}}}))} rows={3} />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Label>Görseller</Label>
                    <div className="flex flex-wrap gap-2">
                      {(sections.hero.page3Patient?.imageUrls || []).map((url, idx) => (
                        <div key={idx} className="relative w-24 h-16 rounded overflow-hidden border">
                          <Image src={url} alt="haftanin" fill className="object-cover" />
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full h-6 w-6"
                            onClick={() => setSections(prev=>({
                              ...prev,
                              hero: {
                                ...prev.hero,
                                page3Patient: {
                                  ...prev.hero.page3Patient,
                                  imageUrls: (prev.hero.page3Patient?.imageUrls || []).filter((u)=>u!==url)
                                }
                              }
                            }))}
                            aria-label="Kaldır"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline">
                          <Layout className="mr-2 h-4 w-4" />
                          Galeriden Seç
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Görsel Seç (Bir veya Birden Fazla)</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto p-2">
                          {PlaceHolderImages.map(image => {
                            const selected = (sections.hero.page3Patient?.imageUrls || []).includes(image.imageUrl);
                            return (
                              <button
                                key={image.id}
                                type="button"
                                onClick={() => setSections(prev=>({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    page3Patient: {
                                      ...prev.hero.page3Patient,
                                      imageUrls: selected
                                        ? (prev.hero.page3Patient?.imageUrls || []).filter(u=>u!==image.imageUrl)
                                        : [...(prev.hero.page3Patient?.imageUrls || []), image.imageUrl]
                                    }
                                  }
                                }))}
                                className={`group relative focus:outline-none rounded-md border ${selected ? 'ring-2 ring-primary' : ''}`}
                              >
                                <Image src={image.imageUrl} alt={image.description} width={200} height={120} className="aspect-video w-full rounded-md object-cover" />
                                {selected && <span className="absolute right-1 top-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">Seçili</span>}
                              </button>
                            )
                          })}
                        </div>
                        <div className="flex justify-end p-4 pt-0">
                          <DialogClose asChild>
                            <Button type="button">Tamam</Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>

              {/* Yapay Zeka butonu ayarları kaldırıldı */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Üst Bölüm */}
        <TabsContent value="top" className="space-y-6">
          {/* Ana Sayfada Gösterilecek Bölüm */}
          <Card>
            <CardHeader>
              <CardTitle>Ana Sayfada Gösterilecek Bölüm</CardTitle>
              <CardDescription>
                Ana sayfa slayt altında gösterilecek bölümü ve ayarlarını düzenleyin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={sections.topSection?.visible ?? true}
                    onCheckedChange={(checked) => updateSection('topSection', 'visible', checked)}
                  />
                  <div>
                    <Label className="font-medium">Ana Sayfada Göster</Label>
                    <p className="text-sm text-muted-foreground">Kapalı olduğunda bu bölüm ana sayfada gösterilmez.</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Gösterilecek Bölüm</Label>
                  <Select
                    value={sections.topSection?.defaultDisplayMode || 
                           sections.topSection?.buttons?.[0]?.defaultSection || 
                           sections.topSection?.buttons?.[1]?.defaultSection || 
                           'featured'}
                    onValueChange={(value: 'latest' | 'featured' | 'random') => {
                      // Seçilen bölüme göre ilgili butonun defaultSection'ını güncelle
                      const buttons = sections.topSection?.buttons || [];
                      const updatedButtons = buttons.map((btn, index) => {
                        if (value === 'latest' && index === 0) {
                          return { ...btn, defaultSection: 'latest' };
                        } else if (value === 'featured' && index === 1) {
                          return { ...btn, defaultSection: 'featured' };
                        } else if (value === 'random' && index === 2) {
                          return { ...btn, defaultSection: 'random' };
                        }
                        return btn;
                      });
                      // Eğer butonlar yoksa, oluştur
                      if (updatedButtons.length === 0) {
                        if (value === 'latest') {
                          updatedButtons.push({ text: 'Son Gönderiler', link: '#featured', icon: 'History', visible: true, order: 1, defaultSection: 'latest' });
                        } else if (value === 'featured') {
                          updatedButtons.push({ text: 'Öne Çıkan Gönderiler', link: '#featured', icon: 'LayoutGrid', visible: true, order: 2, defaultSection: 'featured' });
                        }
                      }
                      updateSection('topSection', 'defaultDisplayMode', value);
                      if (updatedButtons.length > 0) {
                        updateSection('topSection', 'buttons', updatedButtons);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.topSection?.buttons?.[0]?.text ? (
                        <SelectItem value="latest">{sections.topSection.buttons[0].text}</SelectItem>
                      ) : (
                        <SelectItem value="latest">Son Gönderiler</SelectItem>
                      )}
                      {sections.topSection?.buttons?.[1]?.text ? (
                        <SelectItem value="featured">{sections.topSection.buttons[1].text}</SelectItem>
                      ) : (
                        <SelectItem value="featured">Öne Çıkan Gönderiler</SelectItem>
                      )}
                      {sections.hero?.button1?.text ? (
                        <SelectItem value="random">{sections.hero.button1.text}</SelectItem>
                      ) : (
                        <SelectItem value="random">Rastgele Mesajları Keşfet</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Ana sayfa ilk açılışta gösterilecek bölümü seçin. Bu seçim, Butonlar Bölümü'ndeki butonlarla entegre çalışır.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Gösterilecek Gönderi Sayısı</Label>
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      value={sections.topSection?.postCount || 12}
                      onChange={(e) => updateSection('topSection', 'postCount', parseInt(e.target.value) || 12)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Yerleşim (Sütun x Satır)</Label>
                    <Select
                      value={sections.topSection?.layout || '3x4'}
                      onValueChange={(value) => updateSection('topSection', 'layout', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1x12">1x12 (1 sütun, 12 satır)</SelectItem>
                        <SelectItem value="2x6">2x6 (2 sütun, 6 satır)</SelectItem>
                        <SelectItem value="3x4">3x4 (3 sütun, 4 satır)</SelectItem>
                        <SelectItem value="4x3">4x3 (4 sütun, 3 satır)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Sıralama Kriteri</Label>
                    <Select
                      value={sections.topSection?.sortBy || 'createdAt'}
                      onValueChange={(value) => updateSection('topSection', 'sortBy', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="createdAt">Oluşturulma</SelectItem>
                        <SelectItem value="title">Başlık</SelectItem>
                        <SelectItem value="category">Kategori</SelectItem>
                        <SelectItem value="number">Numara</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Sıralama</Label>
                    <Select
                      value={sections.topSection?.sortDirection || 'desc'}
                      onValueChange={(value) => updateSection('topSection', 'sortDirection', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Artan</SelectItem>
                        <SelectItem value="desc">Azalan</SelectItem>
                        <SelectItem value="random">Rastgele</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Butonlar Bölümü - Kutu İçinde */}
          <Card>
            <CardHeader>
              <CardTitle>Butonlar Bölümü</CardTitle>
              <CardDescription>
                Ana sayfada gösterilecek butonları düzenleyin. Satırda dizilim sırasına göre sıralanır.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tüm butonları birleştir ve sırala */}
              {[
                { id: 'button1', label: 'Buton 1 - Son Gönderiler', button: sections.topSection.buttons?.[0] || { text: 'Son Gönderiler', link: '#featured', icon: 'History', visible: true, order: 1, defaultSection: 'latest' }, type: 'topSection' as const, index: 0 },
                { id: 'button2', label: 'Buton 2 - Öne Çıkan Gönderiler', button: sections.topSection.buttons?.[1] || { text: 'Öne Çıkan Gönderiler', link: '#featured', icon: 'LayoutGrid', visible: true, order: 2, defaultSection: 'featured' }, type: 'topSection' as const, index: 1 },
                { id: 'button3', label: 'Buton 3 - Rastgele Mesajları Keşfet', button: sections.hero.button1, type: 'hero' as const, heroKey: 'button1' },
                { id: 'button4', label: 'Buton 4 - Yapay Zeka', button: sections.hero.button2, type: 'hero' as const, heroKey: 'button2' },
              ]
                .sort((a, b) => {
                  const orderA = a.button.order ?? (a.id === 'button1' ? 1 : a.id === 'button2' ? 2 : a.id === 'button3' ? 3 : 4);
                  const orderB = b.button.order ?? (b.id === 'button1' ? 1 : b.id === 'button2' ? 2 : b.id === 'button3' ? 3 : 4);
                  return orderA - orderB;
                })
              .map((item, index) => (
                <div key={item.id} className="space-y-4 p-4 border rounded-md">
                  {item.id !== 'button4' && (
                    <div className="-mb-2">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Hero Altı Liste: {item.id === 'button1' ? 'Son Gönderiler' : item.id === 'button2' ? 'Öne Çıkan Gönderiler' : 'Rastgele Mesajlar'}
                      </span>
                    </div>
                  )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold">
                          {index + 1}
                        </div>
                        <h4 className="font-medium">{item.label}</h4>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor={`showOnHomepage-${item.id}`} className="text-sm">Ana Sayfada Göster</Label>
                          <Switch
                            id={`showOnHomepage-${item.id}`}
                            checked={item.button.showOnHomepage !== false}
                            onCheckedChange={(checked) => {
                              if (item.type === 'hero') {
                                const buttonKey = (item as any).heroKey;
                                updateHero(buttonKey, { ...item.button, showOnHomepage: checked });
                              } else {
                                const buttons = sections.topSection.buttons && sections.topSection.buttons.length > 0
                                  ? [...sections.topSection.buttons]
                                  : [];
                                const buttonIndex = (item as any).index || 0;
                                while (buttons.length <= buttonIndex) {
                                  buttons.push({ text: '', link: '#featured', icon: 'LayoutGrid', visible: true, showOnHomepage: true });
                                }
                                buttons[buttonIndex] = { ...buttons[buttonIndex], showOnHomepage: checked };
                                updateSection('topSection', 'buttons', buttons);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Buton Metni</Label>
                        <Input
                          value={item.button.text || ''}
                          onChange={(e) => {
                            if (item.type === 'hero') {
                              const buttonKey = (item as any).heroKey;
                              updateHero(buttonKey, { ...item.button, text: e.target.value });
                            } else {
                              const buttons = sections.topSection.buttons && sections.topSection.buttons.length > 0
                                ? [...sections.topSection.buttons]
                                : [];
                              const buttonIndex = (item as any).index || 0;
                              while (buttons.length <= buttonIndex) {
                                buttons.push({ text: '', link: '#featured', icon: 'LayoutGrid', visible: true });
                              }
                              buttons[buttonIndex] = { ...buttons[buttonIndex], text: e.target.value };
                              updateSection('topSection', 'buttons', buttons);
                            }
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Buton Linki</Label>
                        <Input
                          value={item.button.link || ''}
                          onChange={(e) => {
                            if (item.type === 'hero') {
                              const buttonKey = (item as any).heroKey;
                              updateHero(buttonKey, { ...item.button, link: e.target.value });
                            } else {
                              const buttons = sections.topSection.buttons && sections.topSection.buttons.length > 0
                                ? [...sections.topSection.buttons]
                                : [];
                              const buttonIndex = (item as any).index || 0;
                              while (buttons.length <= buttonIndex) {
                                buttons.push({ text: '', link: '#featured', icon: 'LayoutGrid', visible: true });
                              }
                              buttons[buttonIndex] = { ...buttons[buttonIndex], link: e.target.value };
                              updateSection('topSection', 'buttons', buttons);
                            }
                          }}
                          placeholder={item.id === 'button1' ? '#featured' : item.id === 'button2' ? '#featured' : item.id === 'button3' ? '#featured' : '/admin/ai-capabilities'}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Satırda Dizilim Sırası</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.button.order ?? (item.id === 'button1' ? 1 : item.id === 'button2' ? 2 : item.id === 'button3' ? 3 : 4)}
                          onChange={(e) => {
                            const order = parseInt(e.target.value) || 1;
                            if (item.type === 'hero') {
                              const buttonKey = (item as any).heroKey;
                              updateHero(buttonKey, { ...item.button, order });
                            } else {
                              const buttons = sections.topSection.buttons && sections.topSection.buttons.length > 0
                                ? [...sections.topSection.buttons]
                                : [];
                              const buttonIndex = (item as any).index || 0;
                              while (buttons.length <= buttonIndex) {
                                buttons.push({ text: '', link: '#featured', icon: 'LayoutGrid', visible: true });
                              }
                              buttons[buttonIndex] = { ...buttons[buttonIndex], order };
                              updateSection('topSection', 'buttons', buttons);
                            }
                          }}
                        />
                      </div>
                    </div>
                    {item.id === 'button4' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Varyant</Label>
                          <Select
                            value={(sections as any).hero?.button2?.variant || 'secondary'}
                            onValueChange={(value) => updateHero('button2', { ...sections.hero.button2, variant: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Buton stili" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="primary">Primary</SelectItem>
                              <SelectItem value="secondary">Secondary</SelectItem>
                              <SelectItem value="outline">Outline</SelectItem>
                              <SelectItem value="ghost">Ghost</SelectItem>
                              <SelectItem value="custom">Özel Renk</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Arkaplan Rengi</Label>
                          <Input
                            type="color"
                            value={(sections as any).hero?.button2?.bgColor || '#111827'}
                            onChange={(e) => updateHero('button2', { ...sections.hero.button2, bgColor: e.target.value, variant: 'custom' })}
                            className="w-16 h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Yazı Rengi</Label>
                          <Input
                            type="color"
                            value={(sections as any).hero?.button2?.textColor || '#ffffff'}
                            onChange={(e) => updateHero('button2', { ...sections.hero.button2, textColor: e.target.value, variant: 'custom' })}
                            className="w-16 h-10"
                          />
                        </div>
                      </div>
                    )}
                    {item.id === 'button4' && (
                      <div className="mt-2">
                        <span className="text-sm text-muted-foreground">(Not: Bu buton sadece admin kullanıcılar tarafından görünür)</span>
                      </div>
                    )}
                  </div>
                ))}
            </CardContent>
          </Card>

        </TabsContent>

        {/* Kategoriler Bölümü */}
        <TabsContent value="categories" className="space-y-6">
          <CategoriesSection 
            sections={sections} 
            setSections={setSections}
          />
        </TabsContent>

        {/* Orta Bölüm */}
        <TabsContent value="middle" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Orta Bölüm - Ziyaretçi Mesaj Kutusu</CardTitle>
              <CardDescription>
                Ana sayfanın alt kısmındaki ziyaretçi mesaj formu bölümünü düzenleyin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="middle-title">Başlık</Label>
                <Input
                  id="middle-title"
                  value={sections.middleSection.title}
                  onChange={(e) => updateSection('middleSection', 'title', e.target.value)}
                  placeholder="Bölüm başlığı"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="middle-description">Açıklama</Label>
                <Textarea
                  id="middle-description"
                  value={sections.middleSection.description || ''}
                  onChange={(e) => updateSection('middleSection', 'description', e.target.value)}
                  placeholder="Bölüm açıklaması"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={sections.middleSection.visible}
                  onCheckedChange={(checked) => updateSection('middleSection', 'visible', checked)}
                />
                <Label>Bu Bölümü Göster</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alt Bölüm */}
        <TabsContent value="bottom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alt Bölüm</CardTitle>
              <CardDescription>
                Ana sayfanın en alt kısmındaki ekstra içerik bölümünü düzenleyin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bottom-title">Başlık</Label>
                <Input
                  id="bottom-title"
                  value={sections.bottomSection.title}
                  onChange={(e) => updateSection('bottomSection', 'title', e.target.value)}
                  placeholder="Bölüm başlığı"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bottom-description">Açıklama</Label>
                <Textarea
                  id="bottom-description"
                  value={sections.bottomSection.description || ''}
                  onChange={(e) => updateSection('bottomSection', 'description', e.target.value)}
                  placeholder="Bölüm açıklaması"
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={sections.bottomSection.visible}
                  onCheckedChange={(checked) => updateSection('bottomSection', 'visible', checked)}
                />
                <Label>Bu Bölümü Göster</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analiz Ayarları */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analiz Ayarları</CardTitle>
              <CardDescription>Ana sayfadaki analiz kutusunun görünümünü ve içeriğini özelleştirin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="analytics-title">Başlık</Label>
                <Input
                  id="analytics-title"
                  value={sections.analytics?.title || 'Analiz'}
                  onChange={(e) => setSections(prev => ({
                    ...prev,
                    analytics: {
                      ...prev.analytics || {
                        title: 'Analiz',
                        visible: true,
                        showPublished: true,
                        showDraft: true,
                        showTotal: true,
                      },
                      title: e.target.value
                    }
                  }))}
                  placeholder="Analiz"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={sections.analytics?.visible ?? true}
                    onCheckedChange={(checked) => setSections(prev => ({
                      ...prev,
                      analytics: {
                        ...prev.analytics || {
                          title: 'Analiz',
                          visible: true,
                          showPublished: true,
                          showDraft: true,
                          showTotal: true,
                        },
                        visible: checked
                      }
                    }))}
                  />
                  <Label>Analiz Kutusunu Göster</Label>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-medium">Gösterilecek İstatistikler</h3>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={sections.analytics?.showTotal ?? true}
                    onCheckedChange={(checked) => setSections(prev => ({
                      ...prev,
                      analytics: {
                        ...prev.analytics || {
                          title: 'Analiz',
                          visible: true,
                          showPublished: true,
                          showDraft: true,
                          showTotal: true,
                          googleAnalytics: { enabled: false, measurementId: '' },
                          yandexMetrica: { enabled: false, counterId: '' },
                        },
                        showTotal: checked
                      }
                    }))}
                  />
                  <Label>Toplam Gönderi Sayısını Göster</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={sections.analytics?.showPublished ?? true}
                    onCheckedChange={(checked) => setSections(prev => ({
                      ...prev,
                      analytics: {
                        ...prev.analytics || {
                          title: 'Analiz',
                          visible: true,
                          showPublished: true,
                          showDraft: true,
                          showTotal: true,
                          googleAnalytics: { enabled: false, measurementId: '' },
                          yandexMetrica: { enabled: false, counterId: '' },
                        },
                        showPublished: checked
                      }
                    }))}
                  />
                  <Label>Yayında Olan Gönderi Sayısını Göster</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={sections.analytics?.showDraft ?? true}
                    onCheckedChange={(checked) => setSections(prev => ({
                      ...prev,
                      analytics: {
                        ...prev.analytics || {
                          title: 'Analiz',
                          visible: true,
                          showPublished: true,
                          showDraft: true,
                          showTotal: true,
                          googleAnalytics: { enabled: false, measurementId: '' },
                          yandexMetrica: { enabled: false, counterId: '' },
                        },
                        showDraft: checked
                      }
                    }))}
                  />
                  <Label>Taslak Gönderi Sayısını Göster</Label>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t">
                <h3 className="text-sm font-medium">Ziyaretçi Analizleri</h3>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Google Analytics</CardTitle>
                    <CardDescription>Google Analytics 4 (GA4) entegrasyonu</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={sections.analytics?.googleAnalytics?.enabled ?? false}
                        onCheckedChange={(checked) => setSections(prev => ({
                          ...prev,
                          analytics: {
                            ...prev.analytics || {
                              title: 'Analiz',
                              visible: true,
                              showPublished: true,
                              showDraft: true,
                              showTotal: true,
                              googleAnalytics: { enabled: false, measurementId: '' },
                              yandexMetrica: { enabled: false, counterId: '' },
                            },
                            googleAnalytics: {
                              enabled: checked,
                              measurementId: prev.analytics?.googleAnalytics?.measurementId || '',
                            }
                          }
                        }))}
                      />
                      <Label>Google Analytics'i Etkinleştir</Label>
                    </div>

                    {sections.analytics?.googleAnalytics?.enabled && (
                      <div className="space-y-2">
                        <Label htmlFor="ga-measurement-id">Measurement ID (G-XXXXXXXXXX)</Label>
                        <Input
                          id="ga-measurement-id"
                          value={sections.analytics?.googleAnalytics?.measurementId || ''}
                          onChange={(e) => setSections(prev => ({
                            ...prev,
                            analytics: {
                              ...prev.analytics || {
                                title: 'Analiz',
                                visible: true,
                                showPublished: true,
                                showDraft: true,
                                showTotal: true,
                                googleAnalytics: { enabled: false, measurementId: '' },
                                yandexMetrica: { enabled: false, counterId: '' },
                              },
                              googleAnalytics: {
                                enabled: prev.analytics?.googleAnalytics?.enabled ?? false,
                                measurementId: e.target.value,
                              }
                            }
                          }))}
                          placeholder="G-XXXXXXXXXX"
                        />
                        <p className="text-xs text-muted-foreground">
                          Google Analytics hesabınızdan alacağınız Measurement ID (G ile başlayan ID)
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Yandex Metrica</CardTitle>
                    <CardDescription>Yandex Metrica entegrasyonu</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={sections.analytics?.yandexMetrica?.enabled ?? false}
                        onCheckedChange={(checked) => setSections(prev => ({
                          ...prev,
                          analytics: {
                            ...prev.analytics || {
                              title: 'Analiz',
                              visible: true,
                              showPublished: true,
                              showDraft: true,
                              showTotal: true,
                              googleAnalytics: { enabled: false, measurementId: '' },
                              yandexMetrica: { enabled: false, counterId: '' },
                            },
                            yandexMetrica: {
                              enabled: checked,
                              counterId: prev.analytics?.yandexMetrica?.counterId || '',
                            }
                          }
                        }))}
                      />
                      <Label>Yandex Metrica'yı Etkinleştir</Label>
                    </div>

                    {sections.analytics?.yandexMetrica?.enabled && (
                      <div className="space-y-2">
                        <Label htmlFor="ym-counter-id">Counter ID</Label>
                        <Input
                          id="ym-counter-id"
                          type="number"
                          value={sections.analytics?.yandexMetrica?.counterId || ''}
                          onChange={(e) => setSections(prev => ({
                            ...prev,
                            analytics: {
                              ...prev.analytics || {
                                title: 'Analiz',
                                visible: true,
                                showPublished: true,
                                showDraft: true,
                                showTotal: true,
                                googleAnalytics: { enabled: false, measurementId: '' },
                                yandexMetrica: { enabled: false, counterId: '' },
                              },
                              yandexMetrica: {
                                enabled: prev.analytics?.yandexMetrica?.enabled ?? false,
                                counterId: e.target.value,
                              }
                            }
                          }))}
                          placeholder="12345678"
                        />
                        <p className="text-xs text-muted-foreground">
                          Yandex Metrica hesabınızdan alacağınız Counter ID (sadece rakamlar)
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
}


                              }}
                              min={-100}
                              max={100}
                              step={1}
                              className="w-full"
                            />
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Üst (-100%)</span>
                              <span>Merkez (0%)</span>
                              <span>Alt (100%)</span>
                            </div>
                          </div>

                          {/* Butonlar */}
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={async () => {
                                // Görsel boyutlarını al
                                const imgElement = document.createElement('img');
                                imgElement.src = it.imageUrl;
                                await new Promise((resolve, reject) => {
                                  imgElement.onload = resolve;
                                  imgElement.onerror = reject;
                                });
                                
                                const containerWidth = 256; // Önizleme kutusu genişliği (h-64 = 256px)
                                const containerHeight = 256; // Önizleme kutusu yüksekliği
                                const imageWidth = imgElement.naturalWidth;
                                const imageHeight = imgElement.naturalHeight;
                                
                                // Container'a sığacak zoom değerini hesapla
                                const scaleX = containerWidth / imageWidth;
                                const scaleY = containerHeight / imageHeight;
                                const fitZoom = Math.min(scaleX, scaleY);
                                
                                setSections(prev => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    page1Images: (prev.hero.page1Images||[]).map((img, i) => 
                                      i === idx ? { ...img, zoom: fitZoom, panX: 0, panY: 0, objectPosition: 'center' } : img
                                    )
                                  }
                                }));
                              }}
                            >
                              Sığdır
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                setSections(prev => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    page1Images: (prev.hero.page1Images||[]).map((img, i) => 
                                      i === idx ? { ...img, zoom: 1, panX: 0, panY: 0, objectPosition: 'center' } : img
                                    )
                                  }
                                }));
                              }}
                            >
                              Sıfırla
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={()=>setSections(prev=>({
                          ...prev,
                          hero:{...prev.hero, page1Images:(prev.hero.page1Images||[]).filter((_,i)=>i!==idx)}
                        }))}
                        aria-label="Görseli kaldır"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-title">Hero Başlığı</Label>
                  <Input
                    id="hero-title"
                    value={sections.hero.title}
                    onChange={(e) => updateHero('title', e.target.value)}
                    placeholder="Ana başlık"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-description">Hero Açıklaması</Label>
                  <Textarea
                    id="hero-description"
                    value={sections.hero.description}
                    onChange={(e) => updateHero('description', e.target.value)}
                    placeholder="Açıklama metni"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid gap-4 border-t pt-6">
                <h3 className="font-semibold">Sayfa 2: Rastgele Görseller</h3>
                <div className="flex items-center gap-2">
                  <Switch checked={!!sections.hero.page2Random?.enabled} onCheckedChange={(v)=>setSections(prev=>({...prev, hero:{...prev.hero, page2Random:{enabled:v, folderSlug: prev.hero.page2Random?.folderSlug || 'cuma-mesajlari'}}}))} />
                  <Label>Aktif</Label>
                </div>
                <div className="space-y-2">
                  <Label>Kaynak Klasör (slug)</Label>
                  <Input value={sections.hero.page2Random?.folderSlug || ''} onChange={(e)=>setSections(prev=>({...prev, hero:{...prev.hero, page2Random:{enabled: prev.hero.page2Random?.enabled ?? true, folderSlug: e.target.value}}}))} placeholder="cuma-mesajlari" />
                </div>
                <h3 className="font-semibold">Sayfa 3: Haftanın Mesajı</h3>
                <div className="flex items-center gap-2">
                  <Switch checked={!!sections.hero.page3Patient?.enabled} onCheckedChange={(v)=>setSections(prev=>({...prev, hero:{...prev.hero, page3Patient:{enabled:v, mode: prev.hero.page3Patient?.mode || 'text', text: prev.hero.page3Patient?.text || ''}}}))} />
                  <Label>Aktif</Label>
                </div>
                <div className="space-y-2">
                  <Label>Mod</Label>
                  <Select value={sections.hero.page3Patient?.mode || 'text'} onValueChange={(val)=>setSections(prev=>({...prev, hero:{...prev.hero, page3Patient:{...prev.hero.page3Patient, mode: val as 'text'|'image', enabled: prev.hero.page3Patient?.enabled ?? true}}}))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Mesaj (Metin)</SelectItem>
                      <SelectItem value="image">Görsel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {sections.hero.page3Patient?.mode === 'text' ? (
                  <div className="space-y-2">
                  <Label>Haftanın Mesajı</Label>
                    <Textarea value={sections.hero.page3Patient?.text || ''} onChange={(e)=>setSections(prev=>({...prev, hero:{...prev.hero, page3Patient:{...prev.hero.page3Patient, text: e.target.value}}}))} rows={3} />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Label>Görseller</Label>
                    <div className="flex flex-wrap gap-2">
                      {(sections.hero.page3Patient?.imageUrls || []).map((url, idx) => (
                        <div key={idx} className="relative w-24 h-16 rounded overflow-hidden border">
                          <Image src={url} alt="haftanin" fill className="object-cover" />
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full h-6 w-6"
                            onClick={() => setSections(prev=>({
                              ...prev,
                              hero: {
                                ...prev.hero,
                                page3Patient: {
                                  ...prev.hero.page3Patient,
                                  imageUrls: (prev.hero.page3Patient?.imageUrls || []).filter((u)=>u!==url)
                                }
                              }
                            }))}
                            aria-label="Kaldır"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline">
                          <Layout className="mr-2 h-4 w-4" />
                          Galeriden Seç
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Görsel Seç (Bir veya Birden Fazla)</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto p-2">
                          {PlaceHolderImages.map(image => {
                            const selected = (sections.hero.page3Patient?.imageUrls || []).includes(image.imageUrl);
                            return (
                              <button
                                key={image.id}
                                type="button"
                                onClick={() => setSections(prev=>({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    page3Patient: {
                                      ...prev.hero.page3Patient,
                                      imageUrls: selected
                                        ? (prev.hero.page3Patient?.imageUrls || []).filter(u=>u!==image.imageUrl)
                                        : [...(prev.hero.page3Patient?.imageUrls || []), image.imageUrl]
                                    }
                                  }
                                }))}
                                className={`group relative focus:outline-none rounded-md border ${selected ? 'ring-2 ring-primary' : ''}`}
                              >
                                <Image src={image.imageUrl} alt={image.description} width={200} height={120} className="aspect-video w-full rounded-md object-cover" />
                                {selected && <span className="absolute right-1 top-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">Seçili</span>}
                              </button>
                            )
                          })}
                        </div>
                        <div className="flex justify-end p-4 pt-0">
                          <DialogClose asChild>
                            <Button type="button">Tamam</Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>

              {/* Yapay Zeka butonu ayarları kaldırıldı */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Üst Bölüm */}
        <TabsContent value="top" className="space-y-6">
          {/* Ana Sayfada Gösterilecek Bölüm */}
          <Card>
            <CardHeader>
              <CardTitle>Ana Sayfada Gösterilecek Bölüm</CardTitle>
              <CardDescription>
                Ana sayfa slayt altında gösterilecek bölümü ve ayarlarını düzenleyin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={sections.topSection?.visible ?? true}
                    onCheckedChange={(checked) => updateSection('topSection', 'visible', checked)}
                  />
                  <div>
                    <Label className="font-medium">Ana Sayfada Göster</Label>
                    <p className="text-sm text-muted-foreground">Kapalı olduğunda bu bölüm ana sayfada gösterilmez.</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Gösterilecek Bölüm</Label>
                  <Select
                    value={sections.topSection?.defaultDisplayMode || 
                           sections.topSection?.buttons?.[0]?.defaultSection || 
                           sections.topSection?.buttons?.[1]?.defaultSection || 
                           'featured'}
                    onValueChange={(value: 'latest' | 'featured' | 'random') => {
                      // Seçilen bölüme göre ilgili butonun defaultSection'ını güncelle
                      const buttons = sections.topSection?.buttons || [];
                      const updatedButtons = buttons.map((btn, index) => {
                        if (value === 'latest' && index === 0) {
                          return { ...btn, defaultSection: 'latest' };
                        } else if (value === 'featured' && index === 1) {
                          return { ...btn, defaultSection: 'featured' };
                        } else if (value === 'random' && index === 2) {
                          return { ...btn, defaultSection: 'random' };
                        }
                        return btn;
                      });
                      // Eğer butonlar yoksa, oluştur
                      if (updatedButtons.length === 0) {
                        if (value === 'latest') {
                          updatedButtons.push({ text: 'Son Gönderiler', link: '#featured', icon: 'History', visible: true, order: 1, defaultSection: 'latest' });
                        } else if (value === 'featured') {
                          updatedButtons.push({ text: 'Öne Çıkan Gönderiler', link: '#featured', icon: 'LayoutGrid', visible: true, order: 2, defaultSection: 'featured' });
                        }
                      }
                      updateSection('topSection', 'defaultDisplayMode', value);
                      if (updatedButtons.length > 0) {
                        updateSection('topSection', 'buttons', updatedButtons);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.topSection?.buttons?.[0]?.text ? (
                        <SelectItem value="latest">{sections.topSection.buttons[0].text}</SelectItem>
                      ) : (
                        <SelectItem value="latest">Son Gönderiler</SelectItem>
                      )}
                      {sections.topSection?.buttons?.[1]?.text ? (
                        <SelectItem value="featured">{sections.topSection.buttons[1].text}</SelectItem>
                      ) : (
                        <SelectItem value="featured">Öne Çıkan Gönderiler</SelectItem>
                      )}
                      {sections.hero?.button1?.text ? (
                        <SelectItem value="random">{sections.hero.button1.text}</SelectItem>
                      ) : (
                        <SelectItem value="random">Rastgele Mesajları Keşfet</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Ana sayfa ilk açılışta gösterilecek bölümü seçin. Bu seçim, Butonlar Bölümü'ndeki butonlarla entegre çalışır.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Gösterilecek Gönderi Sayısı</Label>
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      value={sections.topSection?.postCount || 12}
                      onChange={(e) => updateSection('topSection', 'postCount', parseInt(e.target.value) || 12)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Yerleşim (Sütun x Satır)</Label>
                    <Select
                      value={sections.topSection?.layout || '3x4'}
                      onValueChange={(value) => updateSection('topSection', 'layout', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1x12">1x12 (1 sütun, 12 satır)</SelectItem>
                        <SelectItem value="2x6">2x6 (2 sütun, 6 satır)</SelectItem>
                        <SelectItem value="3x4">3x4 (3 sütun, 4 satır)</SelectItem>
                        <SelectItem value="4x3">4x3 (4 sütun, 3 satır)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Sıralama Kriteri</Label>
                    <Select
                      value={sections.topSection?.sortBy || 'createdAt'}
                      onValueChange={(value) => updateSection('topSection', 'sortBy', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="createdAt">Oluşturulma</SelectItem>
                        <SelectItem value="title">Başlık</SelectItem>
                        <SelectItem value="category">Kategori</SelectItem>
                        <SelectItem value="number">Numara</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Sıralama</Label>
                    <Select
                      value={sections.topSection?.sortDirection || 'desc'}
                      onValueChange={(value) => updateSection('topSection', 'sortDirection', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Artan</SelectItem>
                        <SelectItem value="desc">Azalan</SelectItem>
                        <SelectItem value="random">Rastgele</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Butonlar Bölümü - Kutu İçinde */}
          <Card>
            <CardHeader>
              <CardTitle>Butonlar Bölümü</CardTitle>
              <CardDescription>
                Ana sayfada gösterilecek butonları düzenleyin. Satırda dizilim sırasına göre sıralanır.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tüm butonları birleştir ve sırala */}
              {[
                { id: 'button1', label: 'Buton 1 - Son Gönderiler', button: sections.topSection.buttons?.[0] || { text: 'Son Gönderiler', link: '#featured', icon: 'History', visible: true, order: 1, defaultSection: 'latest' }, type: 'topSection' as const, index: 0 },
                { id: 'button2', label: 'Buton 2 - Öne Çıkan Gönderiler', button: sections.topSection.buttons?.[1] || { text: 'Öne Çıkan Gönderiler', link: '#featured', icon: 'LayoutGrid', visible: true, order: 2, defaultSection: 'featured' }, type: 'topSection' as const, index: 1 },
                { id: 'button3', label: 'Buton 3 - Rastgele Mesajları Keşfet', button: sections.hero.button1, type: 'hero' as const, heroKey: 'button1' },
                { id: 'button4', label: 'Buton 4 - Yapay Zeka', button: sections.hero.button2, type: 'hero' as const, heroKey: 'button2' },
              ]
                .sort((a, b) => {
                  const orderA = a.button.order ?? (a.id === 'button1' ? 1 : a.id === 'button2' ? 2 : a.id === 'button3' ? 3 : 4);
                  const orderB = b.button.order ?? (b.id === 'button1' ? 1 : b.id === 'button2' ? 2 : b.id === 'button3' ? 3 : 4);
                  return orderA - orderB;
                })
              .map((item, index) => (
                <div key={item.id} className="space-y-4 p-4 border rounded-md">
                  {item.id !== 'button4' && (
                    <div className="-mb-2">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Hero Altı Liste: {item.id === 'button1' ? 'Son Gönderiler' : item.id === 'button2' ? 'Öne Çıkan Gönderiler' : 'Rastgele Mesajlar'}
                      </span>
                    </div>
                  )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold">
                          {index + 1}
                        </div>
                        <h4 className="font-medium">{item.label}</h4>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor={`showOnHomepage-${item.id}`} className="text-sm">Ana Sayfada Göster</Label>
                          <Switch
                            id={`showOnHomepage-${item.id}`}
                            checked={item.button.showOnHomepage !== false}
                            onCheckedChange={(checked) => {
                              if (item.type === 'hero') {
                                const buttonKey = (item as any).heroKey;
                                updateHero(buttonKey, { ...item.button, showOnHomepage: checked });
                              } else {
                                const buttons = sections.topSection.buttons && sections.topSection.buttons.length > 0
                                  ? [...sections.topSection.buttons]
                                  : [];
                                const buttonIndex = (item as any).index || 0;
                                while (buttons.length <= buttonIndex) {
                                  buttons.push({ text: '', link: '#featured', icon: 'LayoutGrid', visible: true, showOnHomepage: true });
                                }
                                buttons[buttonIndex] = { ...buttons[buttonIndex], showOnHomepage: checked };
                                updateSection('topSection', 'buttons', buttons);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Buton Metni</Label>
                        <Input
                          value={item.button.text || ''}
                          onChange={(e) => {
                            if (item.type === 'hero') {
                              const buttonKey = (item as any).heroKey;
                              updateHero(buttonKey, { ...item.button, text: e.target.value });
                            } else {
                              const buttons = sections.topSection.buttons && sections.topSection.buttons.length > 0
                                ? [...sections.topSection.buttons]
                                : [];
                              const buttonIndex = (item as any).index || 0;
                              while (buttons.length <= buttonIndex) {
                                buttons.push({ text: '', link: '#featured', icon: 'LayoutGrid', visible: true });
                              }
                              buttons[buttonIndex] = { ...buttons[buttonIndex], text: e.target.value };
                              updateSection('topSection', 'buttons', buttons);
                            }
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Buton Linki</Label>
                        <Input
                          value={item.button.link || ''}
                          onChange={(e) => {
                            if (item.type === 'hero') {
                              const buttonKey = (item as any).heroKey;
                              updateHero(buttonKey, { ...item.button, link: e.target.value });
                            } else {
                              const buttons = sections.topSection.buttons && sections.topSection.buttons.length > 0
                                ? [...sections.topSection.buttons]
                                : [];
                              const buttonIndex = (item as any).index || 0;
                              while (buttons.length <= buttonIndex) {
                                buttons.push({ text: '', link: '#featured', icon: 'LayoutGrid', visible: true });
                              }
                              buttons[buttonIndex] = { ...buttons[buttonIndex], link: e.target.value };
                              updateSection('topSection', 'buttons', buttons);
                            }
                          }}
                          placeholder={item.id === 'button1' ? '#featured' : item.id === 'button2' ? '#featured' : item.id === 'button3' ? '#featured' : '/admin/ai-capabilities'}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Satırda Dizilim Sırası</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.button.order ?? (item.id === 'button1' ? 1 : item.id === 'button2' ? 2 : item.id === 'button3' ? 3 : 4)}
                          onChange={(e) => {
                            const order = parseInt(e.target.value) || 1;
                            if (item.type === 'hero') {
                              const buttonKey = (item as any).heroKey;
                              updateHero(buttonKey, { ...item.button, order });
                            } else {
                              const buttons = sections.topSection.buttons && sections.topSection.buttons.length > 0
                                ? [...sections.topSection.buttons]
                                : [];
                              const buttonIndex = (item as any).index || 0;
                              while (buttons.length <= buttonIndex) {
                                buttons.push({ text: '', link: '#featured', icon: 'LayoutGrid', visible: true });
                              }
                              buttons[buttonIndex] = { ...buttons[buttonIndex], order };
                              updateSection('topSection', 'buttons', buttons);
                            }
                          }}
                        />
                      </div>
                    </div>
                    {item.id === 'button4' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Varyant</Label>
                          <Select
                            value={(sections as any).hero?.button2?.variant || 'secondary'}
                            onValueChange={(value) => updateHero('button2', { ...sections.hero.button2, variant: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Buton stili" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="primary">Primary</SelectItem>
                              <SelectItem value="secondary">Secondary</SelectItem>
                              <SelectItem value="outline">Outline</SelectItem>
                              <SelectItem value="ghost">Ghost</SelectItem>
                              <SelectItem value="custom">Özel Renk</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Arkaplan Rengi</Label>
                          <Input
                            type="color"
                            value={(sections as any).hero?.button2?.bgColor || '#111827'}
                            onChange={(e) => updateHero('button2', { ...sections.hero.button2, bgColor: e.target.value, variant: 'custom' })}
                            className="w-16 h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Yazı Rengi</Label>
                          <Input
                            type="color"
                            value={(sections as any).hero?.button2?.textColor || '#ffffff'}
                            onChange={(e) => updateHero('button2', { ...sections.hero.button2, textColor: e.target.value, variant: 'custom' })}
                            className="w-16 h-10"
                          />
                        </div>
                      </div>
                    )}
                    {item.id === 'button4' && (
                      <div className="mt-2">
                        <span className="text-sm text-muted-foreground">(Not: Bu buton sadece admin kullanıcılar tarafından görünür)</span>
                      </div>
                    )}
                  </div>
                ))}
            </CardContent>
          </Card>

        </TabsContent>

        {/* Kategoriler Bölümü */}
        <TabsContent value="categories" className="space-y-6">
          <CategoriesSection 
            sections={sections} 
            setSections={setSections}
          />
        </TabsContent>

        {/* Orta Bölüm */}
        <TabsContent value="middle" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Orta Bölüm - Ziyaretçi Mesaj Kutusu</CardTitle>
              <CardDescription>
                Ana sayfanın alt kısmındaki ziyaretçi mesaj formu bölümünü düzenleyin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="middle-title">Başlık</Label>
                <Input
                  id="middle-title"
                  value={sections.middleSection.title}
                  onChange={(e) => updateSection('middleSection', 'title', e.target.value)}
                  placeholder="Bölüm başlığı"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="middle-description">Açıklama</Label>
                <Textarea
                  id="middle-description"
                  value={sections.middleSection.description || ''}
                  onChange={(e) => updateSection('middleSection', 'description', e.target.value)}
                  placeholder="Bölüm açıklaması"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={sections.middleSection.visible}
                  onCheckedChange={(checked) => updateSection('middleSection', 'visible', checked)}
                />
                <Label>Bu Bölümü Göster</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alt Bölüm */}
        <TabsContent value="bottom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alt Bölüm</CardTitle>
              <CardDescription>
                Ana sayfanın en alt kısmındaki ekstra içerik bölümünü düzenleyin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bottom-title">Başlık</Label>
                <Input
                  id="bottom-title"
                  value={sections.bottomSection.title}
                  onChange={(e) => updateSection('bottomSection', 'title', e.target.value)}
                  placeholder="Bölüm başlığı"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bottom-description">Açıklama</Label>
                <Textarea
                  id="bottom-description"
                  value={sections.bottomSection.description || ''}
                  onChange={(e) => updateSection('bottomSection', 'description', e.target.value)}
                  placeholder="Bölüm açıklaması"
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={sections.bottomSection.visible}
                  onCheckedChange={(checked) => updateSection('bottomSection', 'visible', checked)}
                />
                <Label>Bu Bölümü Göster</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analiz Ayarları */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analiz Ayarları</CardTitle>
              <CardDescription>Ana sayfadaki analiz kutusunun görünümünü ve içeriğini özelleştirin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="analytics-title">Başlık</Label>
                <Input
                  id="analytics-title"
                  value={sections.analytics?.title || 'Analiz'}
                  onChange={(e) => setSections(prev => ({
                    ...prev,
                    analytics: {
                      ...prev.analytics || {
                        title: 'Analiz',
                        visible: true,
                        showPublished: true,
                        showDraft: true,
                        showTotal: true,
                      },
                      title: e.target.value
                    }
                  }))}
                  placeholder="Analiz"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={sections.analytics?.visible ?? true}
                    onCheckedChange={(checked) => setSections(prev => ({
                      ...prev,
                      analytics: {
                        ...prev.analytics || {
                          title: 'Analiz',
                          visible: true,
                          showPublished: true,
                          showDraft: true,
                          showTotal: true,
                        },
                        visible: checked
                      }
                    }))}
                  />
                  <Label>Analiz Kutusunu Göster</Label>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-medium">Gösterilecek İstatistikler</h3>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={sections.analytics?.showTotal ?? true}
                    onCheckedChange={(checked) => setSections(prev => ({
                      ...prev,
                      analytics: {
                        ...prev.analytics || {
                          title: 'Analiz',
                          visible: true,
                          showPublished: true,
                          showDraft: true,
                          showTotal: true,
                          googleAnalytics: { enabled: false, measurementId: '' },
                          yandexMetrica: { enabled: false, counterId: '' },
                        },
                        showTotal: checked
                      }
                    }))}
                  />
                  <Label>Toplam Gönderi Sayısını Göster</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={sections.analytics?.showPublished ?? true}
                    onCheckedChange={(checked) => setSections(prev => ({
                      ...prev,
                      analytics: {
                        ...prev.analytics || {
                          title: 'Analiz',
                          visible: true,
                          showPublished: true,
                          showDraft: true,
                          showTotal: true,
                          googleAnalytics: { enabled: false, measurementId: '' },
                          yandexMetrica: { enabled: false, counterId: '' },
                        },
                        showPublished: checked
                      }
                    }))}
                  />
                  <Label>Yayında Olan Gönderi Sayısını Göster</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={sections.analytics?.showDraft ?? true}
                    onCheckedChange={(checked) => setSections(prev => ({
                      ...prev,
                      analytics: {
                        ...prev.analytics || {
                          title: 'Analiz',
                          visible: true,
                          showPublished: true,
                          showDraft: true,
                          showTotal: true,
                          googleAnalytics: { enabled: false, measurementId: '' },
                          yandexMetrica: { enabled: false, counterId: '' },
                        },
                        showDraft: checked
                      }
                    }))}
                  />
                  <Label>Taslak Gönderi Sayısını Göster</Label>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t">
                <h3 className="text-sm font-medium">Ziyaretçi Analizleri</h3>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Google Analytics</CardTitle>
                    <CardDescription>Google Analytics 4 (GA4) entegrasyonu</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={sections.analytics?.googleAnalytics?.enabled ?? false}
                        onCheckedChange={(checked) => setSections(prev => ({
                          ...prev,
                          analytics: {
                            ...prev.analytics || {
                              title: 'Analiz',
                              visible: true,
                              showPublished: true,
                              showDraft: true,
                              showTotal: true,
                              googleAnalytics: { enabled: false, measurementId: '' },
                              yandexMetrica: { enabled: false, counterId: '' },
                            },
                            googleAnalytics: {
                              enabled: checked,
                              measurementId: prev.analytics?.googleAnalytics?.measurementId || '',
                            }
                          }
                        }))}
                      />
                      <Label>Google Analytics'i Etkinleştir</Label>
                    </div>

                    {sections.analytics?.googleAnalytics?.enabled && (
                      <div className="space-y-2">
                        <Label htmlFor="ga-measurement-id">Measurement ID (G-XXXXXXXXXX)</Label>
                        <Input
                          id="ga-measurement-id"
                          value={sections.analytics?.googleAnalytics?.measurementId || ''}
                          onChange={(e) => setSections(prev => ({
                            ...prev,
                            analytics: {
                              ...prev.analytics || {
                                title: 'Analiz',
                                visible: true,
                                showPublished: true,
                                showDraft: true,
                                showTotal: true,
                                googleAnalytics: { enabled: false, measurementId: '' },
                                yandexMetrica: { enabled: false, counterId: '' },
                              },
                              googleAnalytics: {
                                enabled: prev.analytics?.googleAnalytics?.enabled ?? false,
                                measurementId: e.target.value,
                              }
                            }
                          }))}
                          placeholder="G-XXXXXXXXXX"
                        />
                        <p className="text-xs text-muted-foreground">
                          Google Analytics hesabınızdan alacağınız Measurement ID (G ile başlayan ID)
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Yandex Metrica</CardTitle>
                    <CardDescription>Yandex Metrica entegrasyonu</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={sections.analytics?.yandexMetrica?.enabled ?? false}
                        onCheckedChange={(checked) => setSections(prev => ({
                          ...prev,
                          analytics: {
                            ...prev.analytics || {
                              title: 'Analiz',
                              visible: true,
                              showPublished: true,
                              showDraft: true,
                              showTotal: true,
                              googleAnalytics: { enabled: false, measurementId: '' },
                              yandexMetrica: { enabled: false, counterId: '' },
                            },
                            yandexMetrica: {
                              enabled: checked,
                              counterId: prev.analytics?.yandexMetrica?.counterId || '',
                            }
                          }
                        }))}
                      />
                      <Label>Yandex Metrica'yı Etkinleştir</Label>
                    </div>

                    {sections.analytics?.yandexMetrica?.enabled && (
                      <div className="space-y-2">
                        <Label htmlFor="ym-counter-id">Counter ID</Label>
                        <Input
                          id="ym-counter-id"
                          type="number"
                          value={sections.analytics?.yandexMetrica?.counterId || ''}
                          onChange={(e) => setSections(prev => ({
                            ...prev,
                            analytics: {
                              ...prev.analytics || {
                                title: 'Analiz',
                                visible: true,
                                showPublished: true,
                                showDraft: true,
                                showTotal: true,
                                googleAnalytics: { enabled: false, measurementId: '' },
                                yandexMetrica: { enabled: false, counterId: '' },
                              },
                              yandexMetrica: {
                                enabled: prev.analytics?.yandexMetrica?.enabled ?? false,
                                counterId: e.target.value,
                              }
                            }
                          }))}
                          placeholder="12345678"
                        />
                        <p className="text-xs text-muted-foreground">
                          Yandex Metrica hesabınızdan alacağınız Counter ID (sadece rakamlar)
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
}

