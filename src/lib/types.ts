import type { LucideIcon } from "lucide-react";

export interface Category {
  id: string;
  title: string;
  slug: string;
  icon: LucideIcon;
  subcategories?: Category[];
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  category: string; // slug of the category
  imageId?: string; // from placeholder-images.json (legacy support)
  imageIds?: string[]; // from placeholder-images.json (multiple images)
  content: {
    meal: string;
    mealleri: string;
    tefsir: string;
    kisaTefsir: string;
  };
  youtubeVideoId?: string; // legacy support
  youtubeVideoIds?: string[]; // multiple YouTube video IDs
  createdAt: string;
  customMessage?: string;
  status?: 'published' | 'draft'; // Yayında or Yayında Değil
  order?: number; // Sıralama numarası (düşük sayı = üstte)
  seo?: {
    metaTitle?: string; // SEO başlık (varsayılan: title)
    metaDescription?: string; // SEO açıklama
    keywords?: string[]; // Anahtar kelimeler
    ogImage?: string; // Open Graph görsel URL
  };
}

export interface SocialLink {
  name: string;
  url: string;
  color?: string;
  active: boolean;
}

export interface ShareLink {
    name: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
}


export interface Comment {
  id: string;
  postId?: string; // Hangi gönderiye ait (opsiyonel, genel yorumlar için)
  author: string;
  text: string;
  createdAt: string;
}

export interface VisitorMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // Hashed password (only for new users)
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}

export type SharePlatform = {
  name: string;
  active: boolean;
};

export interface HomepageButton {
  text: string;
  link: string;
  icon: string;
  visible: boolean;
  order?: number; // Satırda dizilim sırası
  showOnHomepage?: boolean; // Ana sayfada gösterilecek
}

export interface HeroOverlayMessage {
  text?: string;
  color?: string;
  fontSize?: string;
}

export interface HomepageHero {
  title: string;
  description: string;
  backgroundImage: string;
  backgroundImageHint: string;
  button1: HomepageButton;
  button2: HomepageButton;
  activePage?: 1 | 2 | 3; // hangi sayfa gösterilecek
  page1Enabled?: boolean;
  page1Images?: { imageUrl: string; text?: string; duration?: number; message1?: HeroOverlayMessage; message2?: HeroOverlayMessage; objectPosition?: string; zoom?: number; panX?: number; panY?: number }[]; // duration in milliseconds, objectPosition görselin hangi bölümünün görüneceğini belirler, zoom büyütme/küçültme, panX/panY kaydırma
  page2Random?: {
    enabled: boolean;
    folderSlug?: string; // hangi klasörden rastgele görsel
  };
  page3Patient?: {
    enabled?: boolean;
    mode?: 'text' | 'image';
    text?: string;
    imageUrls?: string[];
  };
}

export interface HomepageSection {
  title: string;
  subtitle?: string;
  description?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
  visible: boolean;
  postCount?: number;
}

export interface SiteBranding {
  siteName: string;
  useLogo: boolean;
  logoUrl?: string;
  logoAlt?: string;
  textColor?: string;
  fontFamily?: string;
  fontSize?: string;
  metaTitle?: string; // Sayfa başlığı (metadata title)
  metaDescription?: string; // Sayfa açıklaması (metadata description)
}

export interface HomepageSections {
  branding: SiteBranding;
  hero: HomepageHero;
  topSection: HomepageSection;
  middleSection: HomepageSection;
  bottomSection: HomepageSection;
  announcement?: {
    enabled: boolean;
    message: string;
    durationMs: number; // 0 or negative means sticky until closed
    position?: 'top-right' | 'bottom-right';
    bgColor?: string; // e.g. #2563eb
    textColor?: string; // e.g. #ffffff
  };
  footer?: {
    title?: string;
    text: string;
    showYear: boolean;
    showSocials: boolean;
  };
}

export interface CustomMenu {
  id: string;
  label: string;
  href: string;
  visible: boolean;
  order: number;
}

export interface CategorySettings {
  categoryId: string;
  visible: boolean;
  order: number;
  customTitle?: string; // Menü Ayarları'ndan özelleştirilmiş başlık
  customSlug?: string; // Menü Ayarları'ndan özelleştirilmiş slug
}

export interface MenuGlobalConfig {
  categoryPagePostCount: number; // menü sayfasında gösterilecek gönderi adedi
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string; // ISO date string
  isDone: boolean; // Yapıldı
  isTodo: boolean; // Yapılacak
  isImportant: boolean; // Önemli
  createdAt: string;
  updatedAt: string;
}

export interface SocialMediaAPI {
  platform: string; // Facebook, Twitter, LinkedIn, Instagram, Pinterest, etc.
  enabled: boolean;
  // Facebook API
  facebookAppId?: string;
  facebookAppSecret?: string;
  facebookAccessToken?: string;
  facebookPageId?: string;
  // Twitter/X API
  twitterApiKey?: string;
  twitterApiSecret?: string;
  twitterBearerToken?: string;
  twitterAccessToken?: string;
  twitterAccessTokenSecret?: string;
  // LinkedIn API
  linkedinClientId?: string;
  linkedinClientSecret?: string;
  linkedinAccessToken?: string;
  // Instagram API
  instagramAccessToken?: string;
  instagramUserId?: string;
  // Pinterest API
  pinterestAccessToken?: string;
  pinterestBoardId?: string;
  // Generic fields
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  // Additional notes
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

  facebookAppId?: string;
  facebookAppSecret?: string;
  facebookAccessToken?: string;
  facebookPageId?: string;
  // Twitter/X API
  twitterApiKey?: string;
  twitterApiSecret?: string;
  twitterBearerToken?: string;
  twitterAccessToken?: string;
  twitterAccessTokenSecret?: string;
  // LinkedIn API
  linkedinClientId?: string;
  linkedinClientSecret?: string;
  linkedinAccessToken?: string;
  // Instagram API
  instagramAccessToken?: string;
  instagramUserId?: string;
  // Pinterest API
  pinterestAccessToken?: string;
  pinterestBoardId?: string;
  // Generic fields
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  // Additional notes
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
