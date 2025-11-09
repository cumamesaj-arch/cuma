'use client';

import React, { useEffect, useState, useMemo, useCallback, type ComponentType, type FormEvent } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { POSTS } from '@/lib/data';
import { PostCard } from '@/components/posts/PostCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, BookOpen, Bot, History } from 'lucide-react';
import Link from 'next/link';
import homepageSectionsData, { type HomepageSections, type HeroOverlayMessage } from '@/lib/homepage-sections';
import { trackButtonClick } from '@/lib/analytics';
import { addVisitorMessageAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import type { VisitorMessage } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// Icon mapping
const iconMap: { [key: string]: ComponentType<{ className?: string }> } = {
  BookOpen,
  Bot,
  History,
};

function VisitorMessageForm({ title, description }: { title?: string; description?: string }) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const message = formData.get('message') as string;

        if (!name.trim() || !email.trim() || !message.trim()) {
            toast({
                variant: "destructive",
                title: "Eksik Bilgi!",
                description: "Lütfen tüm alanları doldurun.",
            });
            return;
        }

        const newMessage: VisitorMessage = {
            id: `visitor-message-${Date.now()}`,
            name,
            email,
            message,
            createdAt: new Date().toISOString(),
        };

        const form = e.currentTarget;

        startTransition(async () => {
            const result = await addVisitorMessageAction(newMessage);
            if (result.success) {
                toast({
                    title: "Mesaj Gönderildi!",
                    description: "Mesajınız başarıyla gönderildi. Teşekkür ederiz.",
                });
                form.reset();
            } else {
                toast({
                    variant: "destructive",
                    title: "Mesaj Gönderilemedi!",
                    description: result.error || "Bir hata oluştu.",
                });
            }
        });
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className='font-headline'>{title || 'Ziyaretçi Not Mesaj Kutusu'}</CardTitle>
                <CardDescription>{description || 'Bize bir mesaj bırakın.'}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">İsim</Label>
                            <Input id="name" name="name" placeholder="Adınız" required disabled={isPending} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="E-posta adresiniz" required disabled={isPending} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Mesajınız</Label>
                        <Textarea id="message" name="message" placeholder="Mesajınızı buraya yazın..." required disabled={isPending} />
                    </div>
                    <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={isPending}>
                        {isPending ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default function Home() {
  const [sections, setSections] = useState<HomepageSections>(homepageSectionsData);
  const [sectionsLoaded, setSectionsLoaded] = useState(true); // İlk render'da hemen göster, sonra güncelle
  
  // Başlangıç state'lerini homepageSectionsData'dan al
  // Önce defaultDisplayMode'u kontrol et, yoksa butonların defaultSection'ını kullan
  const initialDefaultMode = homepageSectionsData.topSection?.defaultDisplayMode || homepageSectionsData.topSection?.buttons?.[0]?.defaultSection || 'featured';
  const [showRandomPosts, setShowRandomPosts] = useState(initialDefaultMode === 'random');
  const [showLatestPosts, setShowLatestPosts] = useState(initialDefaultMode === 'latest');
  const [randomPosts, setRandomPosts] = useState<typeof POSTS>([]);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);

  // Load homepage sections from JSON file (runtime) - slayt için gerekli
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let controller: AbortController | null = null;
    
    const loadSections = async () => {
      try {
        // Timeout için AbortController kullan (2 saniye - daha hızlı)
        controller = new AbortController();
        timeoutId = setTimeout(() => {
          if (controller) {
            controller.abort();
          }
        }, 2000);
        
        const response = await fetch('/api/homepage-sections', { 
          signal: controller.signal,
          cache: 'default' // Use browser cache
        });
        
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        
        if (response.ok) {
          const data = await response.json();
          setSections(data);
          setSectionsLoaded(true);
          
          // Hero görsellerini kontrol et ve index'i sıfırla
          if (data.hero?.page1Images && data.hero.page1Images.length > 0) {
            setCurrentHeroImageIndex(0);
          }
          
          // Ana sayfa açılışta gösterilecek bölüm ayarlarını uygula
          // Önce defaultDisplayMode'u kontrol et, yoksa butonların defaultSection'ını kullan
          const defaultMode = data.topSection?.defaultDisplayMode || data.topSection?.buttons?.[0]?.defaultSection || 'featured';
          
          if (defaultMode === 'latest') {
            setShowLatestPosts(true);
            setShowRandomPosts(false);
          } else if (defaultMode === 'random') {
            setShowRandomPosts(true);
            setShowLatestPosts(false);
          } else {
            setShowLatestPosts(false);
            setShowRandomPosts(false);
          }
          
          if (data.announcement && data.announcement.enabled) {
            setShowAnnouncement(true);
            const d = Number(data.announcement.durationMs || 0);
            if (d > 0) {
              setTimeout(() => setShowAnnouncement(false), d);
            }
          }
        } else {
          // API başarısız oldu, default kullan
          setSections(homepageSectionsData);
          setSectionsLoaded(true);
          
          if (homepageSectionsData.hero?.page1Images && homepageSectionsData.hero.page1Images.length > 0) {
            setCurrentHeroImageIndex(0);
          }
        }
      } catch (error) {
        // AbortError normal bir durum (timeout veya component unmount), sadece log'la
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        // Diğer hatalar için fallback kullan (production'da log yok)
        setSections(homepageSectionsData);
        setSectionsLoaded(true);
        
        if (homepageSectionsData.hero?.page1Images && homepageSectionsData.hero.page1Images.length > 0) {
          setCurrentHeroImageIndex(0);
        }
      }
    };

    loadSections();

    // Cleanup: component unmount olduğunda timeout ve fetch'i iptal et
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (controller) {
        controller.abort();
      }
    };
  }, []);

  // Memoize published posts to avoid filtering on every render
  const publishedPosts = useMemo(() => {
    return POSTS.filter(post => !post.status || post.status === 'published');
  }, [POSTS]);

  // Function to get random posts from all published posts - optimized with useCallback
  const getRandomPosts = useCallback(() => {
    const postCount = sections.topSection?.postCount || 9;
    
    // Shuffle array and get random posts based on postCount setting
    const shuffled = [...publishedPosts].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(postCount, shuffled.length));
    
    setRandomPosts(selected);
    setShowRandomPosts(true);
    
    // Scroll to the posts section
    setTimeout(() => {
      const postsSection = document.getElementById('random-posts-section');
      if (postsSection) {
        postsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }, [publishedPosts, sections.topSection?.postCount]);

  const handleRandomPostsClick = useCallback(() => {
    trackButtonClick(sections.hero.button1.text, 'hero');
    getRandomPosts();
  }, [sections.hero.button1.text, getRandomPosts]);

  const [homePage, setHomePage] = useState(1);
  
  // Hero sayfası seçimi - useMemo ile hesapla
  const activePage = useMemo(() => {
    const page = sections.hero.activePage || 1;
    if (page === 1 && sections.hero.page1Enabled === false) {
      if (sections.hero.page2Random?.enabled) return 2;
      if (sections.hero.page3Patient?.enabled) return 3;
    }
    return page;
  }, [sections.hero.activePage, sections.hero.page1Enabled, sections.hero.page2Random?.enabled, sections.hero.page3Patient?.enabled]);
  
  // Hero carousel timer - slayt geçişleri için
  useEffect(() => {
    // Sections yüklenene kadar bekle
    if (!sectionsLoaded) {
      return;
    }

    const page1Enabled = sections.hero.page1Enabled ?? true;
    const hasImages = sections.hero.page1Images && sections.hero.page1Images.length > 0;
    
    if (activePage === 1 && page1Enabled && hasImages) {
      // Index'i geçerli sınırlar içinde tut
      if (currentHeroImageIndex >= sections.hero.page1Images!.length) {
        setCurrentHeroImageIndex(0);
        return;
      }
      
      // Birden fazla görsel varsa carousel çalışsın
      if (sections.hero.page1Images!.length > 1) {
        const currentImage = sections.hero.page1Images![currentHeroImageIndex];
        const duration = currentImage?.duration || 5000; // Default 5 saniye
        
        const timer = setTimeout(() => {
          setCurrentHeroImageIndex((prev) => {
            const nextIndex = (prev + 1) % sections.hero.page1Images!.length;
            return nextIndex;
          });
        }, duration);

        return () => clearTimeout(timer);
      } else {
        // Tek görsel varsa index'i 0'da tut, carousel çalışmasın
        setCurrentHeroImageIndex(0);
      }
    } else {
      // Carousel kapalıysa veya görsel yoksa index'i 0'da tut
      setCurrentHeroImageIndex(0);
    }
  }, [activePage, currentHeroImageIndex, sections.hero.page1Enabled, sections.hero.page1Images, sectionsLoaded]);
  
  // Sort POSTS according to homepage settings (fallback to ID for stability) - optimized
  const sortedPosts = useMemo(() => {
    // Use published posts instead of all POSTS for better performance
    // Create a new array with order property only when needed
    const base = publishedPosts.map((p, index) => ({ ...p, order: p.order ?? index + 1 }));
    
    // Üst Bölüm ayarlarını kullan (sectionSettings kaldırıldı)
    const sortBy = sections.topSection?.sortBy || 'createdAt';
    const direction = sections.topSection?.sortDirection || 'desc';
    if (direction === 'random') {
      // For random, create a shuffled copy without mutating original
      return [...base].sort(() => Math.random() - 0.5);
    }
    const dir = direction === 'asc' ? 1 : -1;

    const toDate = (value?: string) => {
      const d = value ? new Date(value) : new Date(0);
      return isNaN(d.getTime()) ? new Date(0) : d;
    };

    const hasImage = (p: typeof base[number]) => Boolean(p.imageId || (p.imageIds && p.imageIds.length > 0));

    const getComparable = (p: typeof base[number]) => {
      switch (sortBy) {
        case 'number':
          return p.order || 0;
        case 'image':
          return hasImage(p) ? 1 : 0;
        case 'title':
          return (p.title || '').toLowerCase();
        case 'status':
          return (p.status || 'published') === 'published' ? 1 : 0;
        case 'category':
          return (p.category || '').toLowerCase();
        case 'createdAt':
        default:
          return toDate(p.createdAt).getTime();
      }
    };

    // Create a sorted copy instead of mutating the original array
    return [...base].sort((a, b) => {
      const av = getComparable(a);
      const bv = getComparable(b);
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      // Ties: fallback to id to keep stable
      const aId = a.id || '';
      const bId = b.id || '';
      return aId.localeCompare(bId);
    });
  }, [publishedPosts, sections.topSection?.sortBy, sections.topSection?.sortDirection]);
  
  // Üst Bölüm ayarlarını kullan (sectionSettings kaldırıldı)
  const [limit, setLimit] = useState(homepageSectionsData.topSection?.postCount || 12);
  
  // Update limit when sections are loaded or active section changes
  useEffect(() => {
    // Üst Bölüm ayarlarını kullan (sectionSettings kaldırıldı)
    const postCount = sections.topSection?.postCount || 12;
    setLimit(postCount);
  }, [sections.topSection?.postCount, showLatestPosts, showRandomPosts]);
  
  // Memoize latest posts to avoid recalculating on every render
  const latestPosts = useMemo(() => {
    const postCount = sections.topSection?.postCount || 12;
    return [...publishedPosts]
      .sort((a,b)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, postCount);
  }, [publishedPosts, sections.topSection?.postCount]);
  
  const dataSource = showRandomPosts ? randomPosts : sortedPosts;
  const totalHomePages = Math.max(1, Math.ceil(dataSource.length / limit));
  const safeHomePage = Math.min(homePage, totalHomePages);
  const startIndex = (safeHomePage - 1) * limit;
  const recentPosts = dataSource.slice(startIndex, startIndex + limit);
  const Button1Icon = sections.hero.button1.icon ? iconMap[sections.hero.button1.icon] || BookOpen : BookOpen;
  const Button2Icon = sections.hero.button2.icon ? iconMap[sections.hero.button2.icon] || Bot : Bot;

  // Hero background ve mesajlar - useMemo ile hesapla (carousel ile slayt gösterimi)
  const heroData = useMemo(() => {
    let heroBackground = '';
  let heroTitle = sections.hero.title;
  let heroDesc = sections.hero.description;
  let showHeroButtons = true;
    let heroMessage1: HeroOverlayMessage | undefined;
    let heroMessage2: HeroOverlayMessage | undefined;
    let heroObjectPosition = 'center';
    let heroZoom = 1;
    let heroPanX = 0;
    let heroPanY = 0;

    if (activePage === 1 && (sections.hero.page1Enabled ?? true) && sections.hero.page1Images && sections.hero.page1Images.length > 0) {
      // Carousel için currentHeroImageIndex kullan
      const safeIndex = currentHeroImageIndex < sections.hero.page1Images.length ? currentHeroImageIndex : 0;
      const currentImage = sections.hero.page1Images[safeIndex];
      
      if (currentImage && currentImage.imageUrl) {
        heroBackground = currentImage.imageUrl;
        heroObjectPosition = currentImage.objectPosition || 'center';
        heroZoom = currentImage.zoom || 1;
        heroPanX = currentImage.panX || 0;
        heroPanY = currentImage.panY || 0;
        // heroTitle ve heroDesc sadece sections.hero.title ve sections.hero.description'dan alınır
        // page1Images içindeki text veya message1.text kullanılmaz
        heroMessage1 = currentImage.message1;
        heroMessage2 = currentImage.message2;
    } else {
        // Görsel URL'i boşsa, fallback olarak backgroundImage kullan
        heroBackground = sections.hero.backgroundImage || '';
      }
  } else if (activePage === 2 && sections.hero.page2Random?.enabled) {
    // Klasör bazlı rastgele: basit yaklaşım - ilgili kategorideki ilk görsel ya da placeholder
    const folder = sections.hero.page2Random.folderSlug || '';
    const candidates = publishedPosts.filter(p => p.category === folder);
    if (candidates.length > 0) {
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      if (pick.imageIds && pick.imageIds.length > 0) {
        // Not ideal: gerçek URL'ler media deposunda; burada yine de hero background aynı kalır
        // Kullanıcı verisi olmadan URL'e erişim yok; metin güncelliyoruz
        heroTitle = pick.title;
      }
    }
    heroDesc = 'Seçilen klasörden rastgele içerikler';
  } else if (activePage === 3 && sections.hero.page3Patient?.enabled) {
    showHeroButtons = false;
    if (sections.hero.page3Patient.mode === 'text') {
      heroTitle = sections.hero.page3Patient.text || heroTitle;
      heroDesc = '';
    } else if (sections.hero.page3Patient.mode === 'image') {
      const first = sections.hero.page3Patient.imageUrls && sections.hero.page3Patient.imageUrls[0];
      heroBackground = first || '';
      heroTitle = 'Haftanın Mesajı';
    }
  }

    return { heroBackground, heroTitle, heroDesc, showHeroButtons, heroMessage1, heroMessage2, heroObjectPosition, heroZoom, heroPanX, heroPanY };
  }, [activePage, currentHeroImageIndex, sections.hero, publishedPosts]);

  const { heroBackground, heroTitle, heroDesc, showHeroButtons, heroMessage1, heroMessage2, heroObjectPosition, heroZoom, heroPanX, heroPanY } = heroData;

  // TopSection buttons rendered under hero (symmetry row)
  // Butonları order değerine göre sırala ve showOnHomepage kontrolü yap
  // Son Gönderiler sol başta, Yapay Zeka sağ başta olacak şekilde sırala
  // Selected mode for featured section style sync
  const selectedMode: 'featured' | 'random' | 'latest' = showLatestPosts ? 'latest' : (showRandomPosts ? 'random' : 'featured');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Açılış Mesajı Baloncuğu */}
        {sections.announcement?.enabled && showAnnouncement && (
          <div
            className={`pointer-events-auto fixed z-50 ${sections.announcement.position === 'bottom-right' ? 'bottom-6' : 'top-6'} right-6 max-w-md`}
            role="status"
            aria-live="polite"
          >
            <div
              className="relative rounded-xl backdrop-blur-md border shadow-xl"
              style={{
                backgroundColor: sections.announcement.bgColor || 'rgba(17,24,39,0.7)',
                color: sections.announcement.textColor || 'white',
                borderColor: (sections.announcement.bgColor || '#ffffff') + '33'
              }}
            >
              <button
                className="absolute right-2 top-2 h-7 w-7 inline-flex items-center justify-center rounded-md hover:opacity-80"
                aria-label="Kapat"
                onClick={() => setShowAnnouncement(false)}
              >
                ×
              </button>
              <div className="p-4 pr-10">
                <div className="text-sm leading-relaxed whitespace-pre-line">
                  {sections.announcement.message}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Hero Bölümü - 3 Sayfa */}
        <section className="relative h-[60vh] min-h-[400px]">
          <div className="absolute inset-0">
            {activePage === 1 && (sections.hero.page1Enabled ?? true) && sections.hero.page1Images && sections.hero.page1Images.length > 0 && (
              <>
                {heroBackground ? (
                <div 
                    key={currentHeroImageIndex}
                  className="absolute inset-0 transition-opacity duration-1000 ease-in-out" 
                  style={{
                    backgroundImage: `url('${heroBackground}')`,
                    backgroundPosition: `${50 + (heroPanX || 0) * 0.5}% ${50 + (heroPanY || 0) * 0.5}%`,
                    backgroundSize: `${(heroZoom || 1) * 100}%`,
                    backgroundRepeat: 'no-repeat'
                  }} 
                  data-ai-hint={sections.hero.backgroundImageHint}
                />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900" />
                )}
                <div className="absolute inset-0 bg-black/30" />
              </>
            )}
            {activePage === 3 && sections.hero.page3Patient?.enabled && sections.hero.page3Patient.mode === 'image' && sections.hero.page3Patient.imageUrls && sections.hero.page3Patient.imageUrls[0] && (
              <>
                <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url('${sections.hero.page3Patient.imageUrls[0]}')`}} />
                <div className="absolute inset-0 bg-black/30" />
              </>
            )}
          </div>
          {activePage === 1 && (sections.hero.page1Enabled ?? true) && (heroMessage1?.text || heroMessage2?.text) && (
            <div className="pointer-events-none absolute inset-0 z-10">
              {heroMessage1?.text && (
                <div
                  className={`absolute left-8 top-10 max-w-xl font-semibold tracking-tight ${heroMessage1.fontSize || 'text-3xl'}`}
                  style={{ color: heroMessage1.color || '#ffffff' }}
                >
                  {heroMessage1.text}
                </div>
              )}
              {heroMessage2?.text && (
                <div
                  className={`absolute left-8 bottom-12 max-w-xl font-medium ${heroMessage2.fontSize || 'text-xl'}`}
                  style={{ color: heroMessage2.color || '#ffffff' }}
                >
                  {heroMessage2.text}
                </div>
              )}
            </div>
            )}
          <div className="container relative z-10 flex h-full flex-col items-start justify-center text-left text-white">
            {heroTitle && <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">{heroTitle}</h1>}
            {heroDesc && <p className="mt-4 max-w-2xl text-lg text-white/90">{heroDesc}</p>}
            {/* Hero butonları kaldırıldı (Yapay Zeka butonu gösterilmiyor) */}
          </div>
          {/* Sayfa 2 ve 3 için basit pager */}
          {/* pager gizlendi */}
        </section>
        
        {/* Butonlar Bölümü - Slayt ile Gönderiler Arası */}
        {(() => {
          // Butonlar Bölümü'nden butonları al - varsayılan değerlerle
          const allButtons = [
            { 
              id: 'button1', 
              button: sections.topSection.buttons?.[0] || { 
                text: 'Son Gönderiler', 
                link: '#featured', 
                icon: 'History', 
                visible: true, 
                order: 1, 
                defaultSection: 'latest',
                showOnHomepage: true
              }, 
              type: 'topSection' as const, 
              index: 0 
            },
            { 
              id: 'button2', 
              button: sections.topSection.buttons?.[1] || { 
                text: 'Öne Çıkan Gönderiler', 
                link: '#featured', 
                icon: 'LayoutGrid', 
                visible: true, 
                order: 2, 
                defaultSection: 'featured',
                showOnHomepage: true
              }, 
              type: 'topSection' as const, 
              index: 1 
            },
            { 
              id: 'button3', 
              button: sections.hero?.button1 || { 
                text: 'Rastgele Mesajları Keşfet', 
                link: '#featured', 
                icon: 'BookOpen', 
                visible: true, 
                order: 3, 
                defaultSection: 'random',
                showOnHomepage: true
              }, 
              type: 'hero' as const, 
              heroKey: 'button1' 
            },
            { 
              id: 'button4', 
              button: sections.hero?.button2 || { 
                text: 'Yapay Zeka', 
                link: '/admin/ai-capabilities', 
                icon: 'Bot', 
                visible: true, 
                order: 4,
                showOnHomepage: true
              }, 
              type: 'hero' as const, 
              heroKey: 'button2' 
            },
          ]
            .filter(item => {
              const btn = item.button;
              // Eğer buton tanımlı değilse varsayılan olarak göster
              if (!btn) return false;
              // showOnHomepage false ise gösterme
              if (btn.showOnHomepage === false) return false;
              // visible false ise gösterme
              if (btn.visible === false) return false;
              return true;
            })
            .sort((a, b) => {
              const orderA = a.button?.order ?? (a.id === 'button1' ? 1 : a.id === 'button2' ? 2 : a.id === 'button3' ? 3 : 4);
              const orderB = b.button?.order ?? (b.id === 'button1' ? 1 : b.id === 'button2' ? 2 : b.id === 'button3' ? 3 : 4);
              return orderA - orderB;
            });

          // Yapay Zeka butonu sadece admin kullanıcılar için
          const filteredButtons = allButtons.filter(item => {
            if (item.id === 'button4') {
              // TODO: Admin kontrolü eklenecek
              return true; // Şimdilik tüm kullanıcılar görebilir
            }
            return true;
          });

          // Eğer hiç buton yoksa varsayılan butonları göster
          if (filteredButtons.length === 0) {
            return (
              <section className="py-6 md:py-8 bg-background">
                <div className="container">
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <div className="text-muted-foreground">Butonlar yükleniyor...</div>
                  </div>
                </div>
              </section>
            );
          }

          return (
            <section className="py-6 md:py-8 bg-background">
              <div className="container">
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {filteredButtons.map((item) => {
                    const button = item.button!;
                    const href = button.link || '#featured';
                    const isAnchor = href.startsWith('#');
                    
                    const handleClick = (e: React.MouseEvent) => {
                      if (isAnchor) {
                        e.preventDefault();
                        const targetId = href.substring(1);
                        const targetElement = document.getElementById(targetId);
                        if (targetElement) {
                          targetElement.scrollIntoView({ behavior: 'smooth' });
                        }
                      }
                      
                      // Buton tıklama işlemleri
                      if (item.id === 'button1' && button.defaultSection === 'latest') {
                        setShowLatestPosts(true);
                        setShowRandomPosts(false);
                      } else if (item.id === 'button2' && button.defaultSection === 'featured') {
                        setShowLatestPosts(false);
                        setShowRandomPosts(false);
                      } else if (item.id === 'button3' && button.defaultSection === 'random') {
                        setShowRandomPosts(true);
                        setShowLatestPosts(false);
                        getRandomPosts();
                      } else if (item.id === 'button2') {
                        // Buton 2'ye tıklandığında Öne Çıkan Gönderiler göster
                        setShowLatestPosts(false);
                        setShowRandomPosts(false);
                      }
                    };

                    const Icon = iconMap[button.icon] || BookOpen;
                    
                    return (
                      <div key={item.id} className="relative group">
                        {/* Buton - İkon/Görsel ve Metin ile */}
                        <Button
                          asChild={!isAnchor}
                          variant={button.variant === 'primary' ? 'default' : button.variant === 'custom' ? 'default' : (button.variant || 'outline') as 'default' | 'outline' | 'secondary' | 'ghost' | 'link'}
                          className="relative min-w-[200px] h-auto py-3 px-6 flex flex-row items-center justify-center gap-2"
                          style={button.variant === 'custom' ? {
                            backgroundColor: button.bgColor || '#111827',
                            color: button.textColor || '#ffffff',
                          } : undefined}
                          onClick={isAnchor ? handleClick : undefined}
                        >
                          {isAnchor ? (
                            <span className="flex flex-row items-center justify-center gap-2">
                              <Icon className="w-5 h-5" />
                              {button.text && (
                                <span className="text-sm font-medium">{button.text}</span>
                              )}
                            </span>
                          ) : (
                            <Link href={href} className="flex flex-row items-center justify-center gap-2">
                              <Icon className="w-5 h-5" />
                              {button.text && (
                                <span className="text-sm font-medium">{button.text}</span>
                              )}
                            </Link>
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })()}
        
        {/* Üst Bölüm - Öne Çıkan Gönderiler */}
        {sections.topSection?.visible && (
            <section id="featured" className="pt-4 md:pt-8 pb-12 md:pb-20">
                <div className="container">
                    {/* Gösterim Metni - Aktif bölüme göre */}
                    <div className="mb-6 text-center">
                      <h2 className="text-2xl md:text-3xl font-bold">
                        {showLatestPosts 
                          ? 'Son Gönderiler' 
                          : showRandomPosts 
                            ? 'Rastgele Mesajları Keşfet' 
                            : 'Öne Çıkan Gönderiler'}
                        </h2>
                    </div>
                    
                    {(() => {
                        if (showLatestPosts) {
                          return (
                            <div className="flex flex-col gap-4 mb-8">
                              {latestPosts.map((post) => {
                                const imageId = post.imageId || (post.imageIds && post.imageIds[0]);
                                const image = imageId ? PlaceHolderImages.find(img => img.id === imageId) : undefined;
                                // Video gönderileri için küçük resim
                                const videoId = (post as any).youtubeVideoId || ((post as any).youtubeVideoIds && (post as any).youtubeVideoIds[0]);
                                const videoThumb = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '';
                                const imgSrc = image?.imageUrl || videoThumb || '';
                                const href = `/${post.category}/${post.slug}`;
                                return (
                                  <article key={post.id} className="rounded-md border bg-card/60 p-4 flex gap-6 items-start">
                                    {imgSrc && (
                                      <img src={imgSrc} alt={post.title} className="h-44 w-80 object-cover rounded-md border" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-semibold mb-1 truncate">{post.title}</h3>
                                      <p className="text-xs text-muted-foreground mb-3">{new Date(post.createdAt).toLocaleString('tr-TR')}</p>
                                      <Link href={href} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border hover:bg-muted transition-colors">
                                        Gönderi İçeriği Hakkında Daha Fazla İçin
                                      </Link>
                                    </div>
                                  </article>
                                );
                              })}
                              <div className="pt-2 text-center">
                                {(() => {
                                  const links = (sections.topSection?.viewAllLinks && sections.topSection.viewAllLinks.length > 0)
                                    ? sections.topSection.viewAllLinks
                                    : ['/cuma-mesajlari'];
                                  const to = links[0].startsWith('/') ? links[0] : `/${links[0]}`;
                                  return (
                                    <Button asChild variant="outline" size="lg">
                                      <Link href={to}>Tüm Gönderileri Gör</Link>
                                    </Button>
                                  );
                                })()}
                              </div>
                            </div>
                          );
                        }
                        const layout = sections.topSection?.layout || '3x4';
                        const getGridCols = () => {
                            switch (layout) {
                                case '1x12':
                                    return 'grid-cols-1';
                                case '2x6':
                                    return 'grid-cols-1 md:grid-cols-2';
                                case '3x4':
                                    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
                                case '4x3':
                                    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
                                default:
                                    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
                            }
                        };
                        return (
                            <div className={`grid ${getGridCols()} gap-6 mb-8`}>
                        {recentPosts.length > 0 ? (
                            recentPosts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8">
                                <p className="text-muted-foreground">Henüz gönderi bulunmuyor.</p>
                            </div>
                        )}
                    </div>
                        );
                    })()}
                    {showRandomPosts && (
                        <div className="flex justify-center gap-4">
                            <Button 
                                variant="outline" 
                                size="lg"
                                onClick={() => {
                                    setShowRandomPosts(false);
                                    setRandomPosts([]);
                                }}
                            >
                                Normal Görünüme Dön
                            </Button>
                            <Button 
                                variant="outline" 
                                size="lg"
                                onClick={getRandomPosts}
                            >
                                Yeni Rastgele Mesajlar
                            </Button>
                        </div>
                    )}
                    {!showRandomPosts && !showLatestPosts && (
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center flex-wrap gap-2">
                          <Button variant="outline" onClick={() => setHomePage(Math.max(1, safeHomePage - 1))} disabled={safeHomePage <= 1}>Önceki</Button>
                          {Array.from({ length: totalHomePages }, (_, i) => i + 1).map((p) => (
                            <Button key={p} variant={p === safeHomePage ? 'default' : 'outline'} onClick={() => setHomePage(p)}>{p}</Button>
                          ))}
                          <Button variant="outline" onClick={() => setHomePage(Math.min(totalHomePages, safeHomePage + 1))} disabled={safeHomePage >= totalHomePages}>Sonraki</Button>
                        </div>
                        {sections.topSection?.showViewAll && sections.topSection?.viewAllLink && (
                          <div className="ml-auto">
                            <Button variant="outline" asChild>
                              <Link href={sections.topSection.viewAllLink}>Tümünü Gör</Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                </div>
            </section>
        )}

        {/* Orta Bölüm - Ziyaretçi Mesaj Kutusu */}
        {sections.middleSection.visible && (
            <section className="py-12 md:py-24 bg-secondary/50">
                <div className="container max-w-4xl">
                    <VisitorMessageForm 
                        title={sections.middleSection.title}
                        description={sections.middleSection.description || ''}
                    />
                </div>
            </section>
        )}

        {/* Alt Bölüm */}
        {sections.bottomSection.visible && (
            <section className="py-12 md:py-24">
                <div className="container max-w-4xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">{sections.bottomSection.title}</CardTitle>
                            {sections.bottomSection.description && (
                                <CardDescription>{sections.bottomSection.description}</CardDescription>
                            )}
                        </CardHeader>
                    </Card>
                </div>
            </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
