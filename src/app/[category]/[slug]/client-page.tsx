'use client';

import * as React from 'react';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { SocialLink, SharePlatform, Category } from '@/lib/types';
import { getSocialLinksAction, getShareLinksAction, getCategoriesAction } from '@/app/actions';
import type { Post } from '@/lib/types';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { useImages } from '@/contexts/ImagesContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, ExternalLink, Facebook, Instagram, Youtube, Linkedin, Send, Mail } from 'lucide-react';
import { CommentSection } from '@/components/posts/CommentSection';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SocialIcons } from '@/components/shared/SocialIcons';
import { trackPostView, trackShare } from '@/lib/analytics';

const PinterestIcon = (props: { className?: string }) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.5 12c0-2.5-1.5-5-5-5-3.5 0-5 2.5-5 5 0 2.2 1.2 4.4 2.8 5.2.2.1.3.1.4-.1.1-.2.2-1 .3-1.2.1-.3.1-.4-.2-.7-1-1.2-1.5-2.8-1.5-4.3 0-3.3 2.5-6.5 7-6.5 4.1 0 6.5 2.8 6.5 6 0 4-2.2 7.5-5.5 7.5-1.7 0-3-1.4-2.6-3 .5-2 1.5-4 1.5-5.5 0-1-1.3-2-2.5-2s-2.5 1-2.5 2c0 1.2.7 2.2.7 2.2-.4 1.8-1.8 4-2.2 5.5-.3 1.2-.2 2.5.3 3.3.4.6 1.3.8 2 .8 2.5 0 4.5-2.5 4.5-5.5 0-1.5-1.2-2.5-2.5-2.5-1.5 0-2.5 1-2.5 2.5 0 .2.1.5.2.7l-1.3 4.5c0 .3.1.7.5.7.9 0 3-3.2 3-5.5z" />
    </svg>
  );

// X (Twitter) logo component
const XIcon = (props: { className?: string }) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// NextSosyal logo component
const NextSosyalIcon = (props: { className?: string }) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M7 3h10v18H7V3zm2 2v14h6V5H9zm2 2h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
    <path d="M9 5h6v14H9V5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 7h2v10h-2V7z" fill="currentColor"/>
  </svg>
);

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    Facebook,
    Twitter: XIcon,
    Instagram,
    YouTube: Youtube,
    Pinterest: PinterestIcon,
    WhatsApp: MessageCircle,
    LinkedIn: Linkedin,
    Bip: Send,
    Email: Mail,
    NextSosyal: NextSosyalIcon,
    Nextsosyal: NextSosyalIcon,
};

const shareUrlMap: { [key: string]: string } = {
    Facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
    Twitter: 'https://twitter.com/intent/tweet?url=',
    WhatsApp: 'https://api.whatsapp.com/send?text=',
    Pinterest: 'https://pinterest.com/pin/create/button/?url=',
    LinkedIn: 'https://www.linkedin.com/shareArticle?mini=true&url=',
    Bip: 'https://bip.com/share?text=',
    Email: 'mailto:',
    NextSosyal: 'https://nextsosyal.com/share?url=',
    Nextsosyal: 'https://nextsosyal.com/share?url=',
};

// Renk haritası - her platform için renk sınıfları
const iconColorMap: { [key: string]: string } = {
    Facebook: 'text-blue-600',
    Twitter: 'text-black dark:text-white',
    Instagram: 'text-pink-500',
    YouTube: 'text-red-600',
    Pinterest: 'text-red-700',
    WhatsApp: 'text-green-500',
    LinkedIn: 'text-blue-700',
    Bip: 'text-blue-500',
    Email: 'text-gray-600',
    NextSosyal: 'text-purple-600',
    Nextsosyal: 'text-purple-600',
};


export default function PostClientPage({ post }: { post: Post }) {
  const [postUrl, setPostUrl] = React.useState('');
  // Fotoğraflar galerisi için durumlar
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const { images: availableImages } = useImages();
  const [socialLinks, setSocialLinks] = React.useState<SocialLink[]>([]);
  const [shareLinks, setShareLinks] = React.useState<SharePlatform[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setPostUrl(window.location.href);
    }
    
    // Track post view
    if (post && categories.length > 0) {
      const category = categories.find(c => c.slug === post.category) || 
                        categories.flatMap(c => c.subcategories || []).find(s => s.slug === post.category);
      trackPostView(post.id, post.title, category?.title || post.category);
    }

    // Admin olup olmadığını kontrol et
    const checkAdminStatus = () => {
      const adminReferrer = typeof window !== 'undefined' && document.referrer.includes('/admin');
      const adminFlag = typeof window !== 'undefined' && localStorage.getItem('isAdmin') === 'true';
      const adminCookie = typeof document !== 'undefined' && 
        document.cookie.split(';').some(c => c.trim().startsWith('isAdmin=true'));
      const adminSession = typeof window !== 'undefined' && 
        sessionStorage.getItem('isAdmin') === 'true';
      
      setIsAdmin(adminReferrer || adminFlag || adminCookie || adminSession);
    };

    checkAdminStatus();

    if (typeof window !== 'undefined') {
      const referrer = document.referrer;
      if (referrer.includes('/admin')) {
        localStorage.setItem('isAdmin', 'true');
        sessionStorage.setItem('isAdmin', 'true');
        setIsAdmin(true);
      }
    }
  }, [post]);

  // Firebase'den sosyal medya, paylaşım linklerini ve kategorileri yükle
  React.useEffect(() => {
    async function loadLinks() {
      const [social, share, cats] = await Promise.all([
        getSocialLinksAction(),
        getShareLinksAction(),
        getCategoriesAction(),
      ]);
      setSocialLinks(social);
      setShareLinks(share);
      setCategories(cats);
    }
    loadLinks();
  }, []);

  if (!post) {
    notFound();
  }

  const category = categories.find((c) => c.slug === post.category) || categories.flatMap(c => c.subcategories || []).find(s => s.slug === post.category);
  // Support both imageId and imageIds
  const primaryImageId = post.imageId || (post.imageIds && post.imageIds[0]);
  const image = primaryImageId ? availableImages.find((img) => img.id === primaryImageId) : undefined;
  const activeShareLinks = shareLinks.filter(link => link.active);
  const activeSocialLinks = socialLinks.filter(link => link.active);

  // Check if this is a category that should show special content (Diğer, Videolar, Fotograflar)
  const videosCategory = categories.find(c => c.slug === 'videolar');
  // More robust check for video categories including "Diğer Videolar"
  const isVideosCategory = category?.slug === 'videolar' || 
                           (videosCategory?.subcategories?.some(s => s.slug === post.category)) ||
                           post.category === 'diger-videolar' ||
                           post.category?.toLowerCase().includes('videolar') || 
                           post.category?.toLowerCase().includes('video') ||
                           (category && category.title?.toLowerCase().includes('video'));
  const isFotograflarimCategory = post.category === 'fotograflar' || 
                                   post.category === 'fotoğraflar' || 
                                   post.category === 'Fotograflar' ||
                                   post.category?.toLowerCase().includes('fotoğraf') || 
                                   post.category?.toLowerCase().includes('fotograf');
  const isSpecialCategory = post.category === 'diger' || isVideosCategory || isFotograflarimCategory;
  
  // Get multiple images if available
  const postImages = post.imageIds && post.imageIds.length > 0
    ? post.imageIds.map(id => availableImages.find(img => img.id === id)).filter(Boolean) as ImagePlaceholder[]
    : image ? [image] : [];

  // Klavye ile gezinme (sağ/sol ok)
  React.useEffect(() => {
    if ((!isFotograflarimCategory && post.category !== 'diger') || postImages.length === 0) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setCurrentImageIndex((i) => (i + 1) % postImages.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentImageIndex((i) => (i - 1 + postImages.length) % postImages.length);
      } else if (e.key === 'Escape') {
        setIsZoomed(false);
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isFotograflarimCategory, post.category, postImages.length]);
  
  // Get multiple YouTube videos if available
  const youtubeVideoIds = post.youtubeVideoIds && post.youtubeVideoIds.length > 0
    ? post.youtubeVideoIds.filter(id => id && id.trim() !== '')
    : post.youtubeVideoId && post.youtubeVideoId.trim() !== '' ? [post.youtubeVideoId] : [];


  const CumaMessage = () => {
    if (post.category === 'cuma-mesajlari' && post.customMessage) {
      return (
        <div className="text-center space-y-4">
          <p className="font-semibold text-xl font-headline">{post.title}</p>
          <p className="text-base text-foreground/80 leading-relaxed">{post.content.meal}</p>
          <p className="font-bold text-accent text-lg">{post.customMessage}</p>
        </div>
      );
    }
    return (
      <p className="text-base text-foreground/80 leading-relaxed">{post.content.meal}</p>
    );
  };

  const createExternalLink = (url: string, label: string) => {
    try {
      new URL(url); // Check if it's a valid URL
      return (
        <div className="border-b py-4">
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 text-xl font-semibold font-headline hover:text-primary hover:underline"
            >
              {label}
              <ExternalLink className="h-5 w-5" />
            </a>
        </div>
      );
    } catch (e) {
      // If it's not a valid URL, just return it as text in a similar structure
      return (
         <div className="border-b py-4">
            <p className="text-xl font-semibold font-headline">{label}</p>
            <p className="text-base text-foreground/80 leading-relaxed mt-2">{url}</p>
        </div>
      )
    }
  };
  
  const getShareUrl = (name: string) => {
    const baseUrl = shareUrlMap[name] || '#';
    if (!baseUrl) return '#';
    
    const shareText = encodeURIComponent(`${post.title} - ${postUrl}`);

    if (name === 'WhatsApp' || name === 'Bip') {
      return `${baseUrl}${shareText}`;
    }
     if (name === 'Email') {
      return `${baseUrl}?subject=${encodeURIComponent(post.title)}&body=${shareText}`;
    }
    if (name === 'Pinterest' && image) {
      return `${baseUrl}${encodeURIComponent(postUrl)}&media=${encodeURIComponent(image.imageUrl)}&description=${encodeURIComponent(post.title)}`;
    }
     if (name === 'LinkedIn') {
      return `${baseUrl}${encodeURIComponent(postUrl)}&title=${encodeURIComponent(post.title)}`;
    }
    return `${baseUrl}${encodeURIComponent(postUrl)}`;
  };


  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <article>
            <div className="container max-w-4xl mx-auto">
                <header className="pt-8 md:pt-12 pb-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Button variant="outline" onClick={() => router.back()}>Önceki</Button>
                      {isAdmin && (
                        <Button 
                          size="sm" 
                          onClick={() => router.push(`/admin/posts/${post.id}/edit`)}
                        >
                          Güncelle
                        </Button>
                      )}
                    </div>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            {category && (
                                <Link href={`/${category.slug}`}>
                                    <Badge variant="secondary" className="mb-4">{category.title}</Badge>
                                </Link>
                            )}
                            <h1 className="font-headline text-4xl md:text-5xl font-bold">{post.title}</h1>
                            
                            {/* Show additional info for special categories */}
                            {isSpecialCategory && (
                              <div className="mt-4 space-y-4">
                                {/* Fotograflar: büyük önizleme + sağ/sol oklar + tıklayınca zoom */}
                                {isFotograflarimCategory && postImages.length > 0 && (
                                  <div className="space-y-3">
                                    <h2 className="text-lg font-semibold">Fotoğraflar ({postImages.length})</h2>
                                    <div className="relative w-full overflow-hidden rounded-lg border">
                                      <div
                                        className={cn('relative w-full cursor-pointer')}
                                        style={{ height: 'min(85vh, 820px)' }}
                                        onClick={() => { setIsLightboxOpen(true); setIsZoomed(false); }}
                                      >
                                        <Image
                                          src={postImages[currentImageIndex].imageUrl}
                                          alt={postImages[currentImageIndex].description || post.title}
                                          fill
                                          className='object-contain'
                                          unoptimized={postImages[currentImageIndex].imageUrl.startsWith('/uploads/')}
                                          loading="eager"
                                          priority
                                        />
                                      </div>
                                      {postImages.length > 1 && (
                                        <>
                                          <button
                                            type="button"
                                            aria-label="Önceki"
                                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background/90 border rounded-full px-3 py-2 shadow"
                                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => (i - 1 + postImages.length) % postImages.length); }}
                                          >
                                            ◀
                                          </button>
                                          <button
                                            type="button"
                                            aria-label="Sonraki"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background/90 border rounded-full px-3 py-2 shadow"
                                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => (i + 1) % postImages.length); }}
                                          >
                                            ▶
                                          </button>
                                        </>
                                      )}
                                    </div>
                                    {postImages.length > 1 && (
                                      <div className="flex gap-3 flex-wrap">
                                        {postImages.map((img, idx) => (
                                          <button
                                            key={img.id}
                                            type="button"
                                            className={cn('relative h-16 w-16 md:h-20 md:w-20 rounded border overflow-hidden', idx===currentImageIndex ? 'ring-2 ring-primary' : '')}
                                            onClick={() => { setCurrentImageIndex(idx); setIsZoomed(false); }}
                                          >
                                            <Image src={img.imageUrl} alt={img.description || post.title} fill className="object-cover" loading="eager" priority={idx === currentImageIndex} />
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Diğer kategorisi: küçük grid görünümü */}
                                {post.category === 'diger' && postImages.length > 0 && (
                                  <div className="space-y-2">
                                    <h2 className="text-lg font-semibold">Eklenen Fotoğraflar ({postImages.length})</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                      {postImages.map((img) => (
                                        <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden">
                                          <Image src={img.imageUrl} alt={img.description || post.title} fill className="object-cover" loading="eager" priority />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Show videos for Videolar category and Diğer if videos exist */}
                                {isVideosCategory && youtubeVideoIds.length > 0 && (
                                  <div className="space-y-2">
                                    <h2 className="text-lg font-semibold">Eklenen Videolar ({youtubeVideoIds.length})</h2>
                                    <div className="grid gap-4">
                                      {youtubeVideoIds.map((videoId, index) => (
                                        <div key={index} className="aspect-video">
                                          <iframe
                                            className="w-full h-full rounded-lg"
                                            src={`https://www.youtube.com/embed/${videoId}`}
                                            title={`YouTube video ${index + 1}`}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                          ></iframe>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Show videos for Diğer category if videos exist */}
                                {post.category === 'diger' && youtubeVideoIds.length > 0 && (
                                  <div className="space-y-2">
                                    <h2 className="text-lg font-semibold">Eklenen Videolar ({youtubeVideoIds.length})</h2>
                                    <div className="grid gap-4">
                                      {youtubeVideoIds.map((videoId, index) => (
                                        <div key={index} className="aspect-video">
                                          <iframe
                                            className="w-full h-full rounded-lg"
                                            src={`https://www.youtube.com/embed/${videoId}`}
                                            title={`YouTube video ${index + 1}`}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                          ></iframe>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                        </div>
                        <Button size="icon" variant="outline" className="bg-green-500 hover:bg-green-600 text-white shrink-0" asChild>
                            <a 
                                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + " - " + postUrl)}`} 
                                target='_blank' 
                                rel="noopener noreferrer"
                                onClick={() => trackShare('WhatsApp', post.title)}
                            >
                                <MessageCircle className="h-5 w-5"/>
                                <span className="sr-only">WhatsApp'ta Paylaş</span>
                            </a>
                        </Button>
                    </div>
                     <div className="flex items-center justify-between mt-6">
                        <div>
                            <p className="text-xs text-muted-foreground">Oluşturulma tarihi:</p>
                            <p className="text-base font-semibold">
                                {new Date(post.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                           <h3 className="text-sm font-semibold text-center">Sosyal Medya Linklerim</h3>
                           <SocialIcons iconSize="h-5 w-5" />
                        </div>
                    </div>
                </header>
                
                {/* Show single image only if not special category (special categories show images in header) */}
                {image && image.imageUrl && !isSpecialCategory && (
                    <div className="my-4">
                        <div className="relative w-full aspect-video">
                            <Image
                                src={image.imageUrl}
                                alt={post.title}
                                fill
                                className="object-contain rounded-lg"
                                priority
                                loading="eager"
                                data-ai-hint={image.imageHint}
                                unoptimized
                            />
                        </div>
                    </div>
                )}
                
                <div className="my-6 border-y py-4">
                    <h3 className="text-center font-headline text-lg mb-3">Görseli Paylaş</h3>
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        {activeShareLinks.map((link) => {
                            const Icon = iconMap[link.name];
                            if (!Icon) return null;
                            const shareUrl = getShareUrl(link.name);
                            const iconColor = iconColorMap[link.name] || 'text-gray-600';
                            return (
                                <Button key={link.name} variant="outline" size="sm" asChild className="flex items-center justify-start gap-2 text-xs">
                                    <a 
                                        href={shareUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        onClick={() => trackShare(link.name, post.title)}
                                    >
                                        <Icon className={cn("h-4 w-4", iconColor)} />
                                        <span>{link.name}</span>
                                    </a>
                                </Button>
                            );
                        })}
                    </div>
                </div>

            </div>
            
          <div className="bg-muted/30 py-8">
            <div className="container max-w-4xl mx-auto">
                <div className="grid md:grid-cols-1 gap-8">
                    <div className="space-y-6">
                        {/* Only show meal/tefsir sections if they exist and category is not special */}
                        {!isSpecialCategory && post.content.meal && (
                          <>
                            <div className="border-b pb-4">
                            <h2 className="text-xl font-semibold font-headline">Meali</h2>
                            <div className="pt-2">
                                <CumaMessage />
                            </div>
                            </div>
                            {post.content.mealleri && createExternalLink(post.content.mealleri, `${post.title} Mealleri`)}
                            {post.content.tefsir && createExternalLink(post.content.tefsir, `${post.title} Tefsiri`)}
                            {post.content.kisaTefsir && createExternalLink(post.content.kisaTefsir, `${post.title} Kısa Tefsiri`)}
                          </>
                        )}
                        
                        {/* Show YouTube videos in main content only if not special category (special categories show videos in header) */}
                        {!isSpecialCategory && youtubeVideoIds.length > 0 && (
                            <div className="space-y-4 pt-4">
                                <h2 className="font-headline text-2xl font-bold">
                                    {youtubeVideoIds.length === 1 ? 'İlgili Video' : `İlgili Videolar (${youtubeVideoIds.length})`}
                                </h2>
                                <div className="grid gap-4">
                                    {youtubeVideoIds.map((videoId, index) => (
                                        <div key={index} className="aspect-video">
                                            <iframe
                                                className="w-full h-full rounded-lg"
                                                src={`https://www.youtube.com/embed/${videoId}`}
                                                title={`YouTube video ${index + 1}`}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                 <div className='pt-8'>
                    <CommentSection />
                </div>
            </div>
        </div>


        </article>

        {/* Lightbox (tam ekran) */}
        {isLightboxOpen && postImages.length > 0 && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => { setIsLightboxOpen(false); setIsZoomed(false); }}
          >
            <button
              type="button"
              aria-label="Kapat"
              className="absolute top-4 right-4 text-white/90 hover:text-white text-2xl"
              onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); setIsZoomed(false); }}
            >
              ✕
            </button>
            <div
              className={cn('relative w-full h-full max-w-6xl mx-auto px-6', isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in')}
              onClick={(e) => { e.stopPropagation(); setIsZoomed(z => !z); }}
            >
              <Image
                src={postImages[currentImageIndex].imageUrl}
                alt={postImages[currentImageIndex].description || post.title}
                fill
                className={cn('object-contain transition-transform duration-200', isZoomed ? 'scale-[1.6]' : 'scale-100')}
                unoptimized={postImages[currentImageIndex].imageUrl.startsWith('/uploads/')}
                loading="eager"
                priority
              />
            </div>
            {postImages.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Önceki"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full px-4 py-3"
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => (i - 1 + postImages.length) % postImages.length); }}
                >
                  ◀
                </button>
                <button
                  type="button"
                  aria-label="Sonraki"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full px-4 py-3"
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => (i + 1) % postImages.length); }}
                >
                  ▶
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/90 text-sm">
                  {currentImageIndex + 1} / {postImages.length}
                </div>
              </>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

    

    

