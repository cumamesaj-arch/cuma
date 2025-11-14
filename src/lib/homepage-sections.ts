export interface HomepageButton {
  text: string;
  link: string;
  icon: string;
  visible: boolean;
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'custom';
  bgColor?: string;
  textColor?: string;
  order?: number;
  showOnHomepage?: boolean;
  defaultSection?: 'latest' | 'featured' | 'random'; // Ana Sayfa Açılışta gösterilecek bölüm
}

export type HeroOverlayMessage = {
  text?: string;
  color?: string;
  fontSize?: string;
};

export interface HomepageHero {
  title: string;
  description: string;
  backgroundImage: string;
  backgroundImageHint: string;
  button1: HomepageButton;
  button2: HomepageButton;
  activePage?: 1 | 2 | 3;
  page1Enabled?: boolean;
  page1Images?: {
    imageUrl: string;
    text?: string;
    duration?: number;
    message1?: HeroOverlayMessage;
    message2?: HeroOverlayMessage;
    objectPosition?: string; // Görselin hangi bölümünün görüneceği (örn: "center", "top", "bottom", "50% 30%")
    zoom?: number; // Görsel büyütme/küçültme (1.0 = normal, 1.5 = %150, 0.5 = %50)
    panX?: number; // Yatay kaydırma (-100 ile 100 arası, 0 = merkez)
    panY?: number; // Dikey kaydırma (-100 ile 100 arası, 0 = merkez)
  }[];
  page2Random?: {
    enabled: boolean;
    folderSlug?: string;
  };
  page3Patient?: {
    enabled?: boolean;
    mode?: 'text' | 'image';
    text?: string;
    imageUrls?: string[];
  };
}

export interface SectionDisplaySettings {
  postCount?: number;
  layout?: '1x12' | '2x6' | '3x4' | '4x3'; // Grid layout: columns x rows
  sortBy?: 'number' | 'image' | 'title' | 'status' | 'category' | 'createdAt';
  sortDirection?: 'asc' | 'desc' | 'random';
}

export interface HomepageSection {
  title: string;
  subtitle?: string;
  description?: string;
  showViewAll?: boolean;
  viewAllLink?: string; // Deprecated: use viewAllLinks instead
  viewAllLinks?: string[]; // Array of category slugs/links to show
  visible: boolean;
  postCount?: number;
  layout?: '1x12' | '2x6' | '3x4' | '4x3'; // Grid layout: columns x rows
  // Homepage featured posts sort options
  sortBy?: 'number' | 'image' | 'title' | 'status' | 'category' | 'createdAt';
  sortDirection?: 'asc' | 'desc' | 'random';
  // Optional action buttons rendered under hero
  buttons?: HomepageButton[];
  // Ana sayfa açılışta gösterilecek bölüm ve gösterme şekli
  defaultDisplayMode?: 'featured' | 'latest' | 'random';
  // Her bölüm için ayrı ayarlar
  sectionSettings?: {
    latest?: SectionDisplaySettings;
    featured?: SectionDisplaySettings;
    random?: SectionDisplaySettings;
  };
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
  featuredTitleStyle?: { color?: string; fontSize?: string; fontFamily?: string };
  randomButtonTextStyle?: { color?: string; fontSize?: string };
  buttonStyles?: {
    featured?: { textColor?: string; bgColor?: string; fontFamily?: string; fontSize?: string };
    random?: { textColor?: string; bgColor?: string; fontFamily?: string; fontSize?: string };
    ai?: { textColor?: string; bgColor?: string; fontFamily?: string; fontSize?: string };
    latest?: { textColor?: string; bgColor?: string; fontFamily?: string; fontSize?: string };
  };
}

export interface HomepageSections {
  branding: SiteBranding;
  hero: HomepageHero;
  topSection: HomepageSection;
  middleSection: HomepageSection;
  bottomSection: HomepageSection;
  categoriesSection?: {
    title: string;
    visible: boolean;
    showSubcategories: boolean;
    selectedCategories?: string[]; // category IDs
  };
  announcement?: {
    enabled: boolean;
    message: string;
    durationMs: number;
    position?: 'top-right' | 'bottom-right';
    bgColor?: string;
    textColor?: string;
  };
  footer?: {
    title?: string;
    text: string;
    showYear: boolean;
    showSocials: boolean;
    links?: Array<{
      label: string;
      url: string;
    }>; // Up to 5 web pages
  };
  analytics?: {
    title: string;
    visible: boolean;
    showTotal: boolean;
    showPublished: boolean;
    showDraft: boolean;
    googleAnalytics?: {
      enabled: boolean;
      measurementId: string;
    };
    yandexMetrica?: {
      enabled: boolean;
      counterId: string;
    };
  };
}

const defaultSections: HomepageSections = {
  branding: {
    siteName: "Cuma Mesajları",
    useLogo: false,
    logoUrl: "",
    logoAlt: "Cuma Mesajları Logo",
    textColor: "#FFD700",
    fontFamily: "Playfair Display",
    fontSize: "2xl",
    metaTitle: "Cuma Mesajları - İslami Mesajlar ve İçerik",
    metaDescription: "İslami Mesajlar, Videolar ve İçerik. Kur'an Mealleri, Tefsirler, Cuma Mesajları ve daha fazlası.",
    featuredTitleStyle: { color: '#111827', fontSize: 'text-4xl', fontFamily: 'Playfair Display' },
    randomButtonTextStyle: { color: '#111827', fontSize: 'text-base' },
    buttonStyles: {
      featured: { textColor: '#111827', bgColor: '#ffffff', fontSize: 'text-sm', fontFamily: 'Inter' },
      random: { textColor: '#111827', bgColor: '#fff8dc', fontSize: 'text-sm', fontFamily: 'Inter' },
      ai: { textColor: '#ffffff', bgColor: '#111827', fontSize: 'text-sm', fontFamily: 'Inter' },
      latest: { textColor: '#ffffff', bgColor: '#0ea5e9', fontSize: 'text-sm', fontFamily: 'Inter' }
    }
  },
  hero: {
    title: "",
    description: "",
    backgroundImage: "https://picsum.photos/seed/hero/1920/1080",
    backgroundImageHint: "mosque sunset",
    button1: {
      text: "Rastgele Mesajları Keşfet",
      link: "/cuma-mesajlari",
      icon: "BookOpen",
      visible: true
    },
    button2: {
      text: "Yapay Zeka ile Neler Yapabiliriz?",
      link: "/admin/ai-capabilities",
      icon: "Bot",
      visible: true
    },
    activePage: 1,
    page1Enabled: true,
    page1Images: [],
    page2Random: { enabled: false, folderSlug: 'cuma-mesajlari' },
    page3Patient: { enabled: false, mode: 'text', text: '', imageUrls: [] }
  },
  topSection: {
    title: "Öne Çıkan Gönderiler",
    subtitle: "",
    showViewAll: true,
    viewAllLink: "/cuma-mesajlari",
    viewAllLinks: ["/cuma-mesajlari"],
    visible: true,
    postCount: 10,
    layout: '3x4', // Default: 3 columns, 4 rows
    sortBy: 'createdAt',
    sortDirection: 'desc',
    buttons: [
      { text: 'Öne Çıkan Gönderiler', link: '#featured', icon: 'LayoutGrid', visible: true },
    ]
  },
  middleSection: {
    title: "Ziyaretçi Not Mesaj Kutusu",
    description: "Bize bir mesaj bırakın.",
    visible: true
  },
  bottomSection: {
    title: "",
    description: "",
    visible: true
  },
  announcement: {
    enabled: false,
    message: "Hoş geldiniz! Cuma'nız mübarek olsun.",
    durationMs: 8000,
    position: 'top-right',
    bgColor: '#111827',
    textColor: '#ffffff'
  },
  footer: {
    title: 'Sosyal Medya Linklerim',
    text: 'Tüm hakları saklıdır.',
    showYear: true,
    showSocials: true,
  },
  analytics: {
    title: 'Analiz',
    visible: true,
    showTotal: true,
    showPublished: true,
    showDraft: true,
    googleAnalytics: {
      enabled: false,
      measurementId: '',
    },
    yandexMetrica: {
      enabled: false,
      counterId: '',
    },
  }
};

// Server-side: Load from Firebase
export async function loadHomepageSections(): Promise<HomepageSections> {
  if (typeof window === 'undefined') {
    // Server-side: read from Firebase
    try {
      const { getHomepageSections } = await import('@/lib/firestore');
      const sections = await getHomepageSections();
      return sections || defaultSections;
    } catch (error) {
      console.error('Error loading homepage sections from Firebase:', error);
      return defaultSections;
    }
  }
  // Client-side: return default
  return defaultSections;
}

export const getHomepageSections = (): HomepageSections => {
  return defaultSections;
};

export default defaultSections;

