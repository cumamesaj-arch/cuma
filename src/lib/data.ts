/**
 * Data Access Layer - Firebase Backend
 * 
 * Bu dosya POSTS ve CATEGORIES verilerini Firebase'den çeker.
 * Eski statik array'ler kaldırıldı, artık tüm veriler Firebase'den geliyor.
 * 
 * NOT: Bu dosya sadece server-side'da kullanılmalıdır (Firebase Admin SDK kullanır).
 * Client component'ler için action'ları kullanın: getPostsAction, getCategoriesAction
 * 
 * NOT: 'use server' kullanmıyoruz çünkü backward compatibility için const export'ları koruyoruz.
 */

import type { Category, Post } from '@/lib/types';
import { getPosts, getAllPosts, getCategories } from '@/lib/firestore';
import { 
  Star, Moon, Heart, Rss, Video, Camera, Hand, 
  Facebook, Instagram, MessageCircle, Twitter 
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Icon string'lerini LucideIcon component'lerine çevirir
 */
const iconMap: Record<string, LucideIcon> = {
  Star,
  Moon,
  Heart,
  Rss,
  Video,
  Camera,
  Hand,
  Facebook,
  Instagram,
  MessageCircle,
  Twitter,
};

/**
 * Icon string'ini LucideIcon component'ine çevirir
 */
function mapIcon(iconName: string | undefined): LucideIcon {
  if (!iconName) return Hand;
  const Icon = iconMap[iconName];
  return Icon || Hand;
}

/**
 * Firebase'den tüm kategorileri getirir
 * Icon'ları string'den LucideIcon'a çevirir
 */
export async function getCategoriesData(): Promise<Category[]> {
  try {
    const categories = await getCategories();
    // Icon'ları map et
    return categories.map(cat => ({
      ...cat,
      icon: typeof cat.icon === 'string' ? mapIcon(cat.icon) : cat.icon,
      subcategories: cat.subcategories?.map(sub => ({
        ...sub,
        icon: typeof sub.icon === 'string' ? mapIcon(sub.icon) : sub.icon,
      })),
    }));
  } catch (error) {
    console.error('Error loading categories from Firebase:', error);
    // Fallback: Boş array döndür
    return [];
  }
}

/**
 * Firebase'den tüm gönderileri getirir (published)
 */
export async function getPostsData(): Promise<Post[]> {
  try {
    return await getPosts({ status: 'published' });
  } catch (error) {
    console.error('Error loading posts from Firebase:', error);
    return [];
  }
}

/**
 * Firebase'den tüm gönderileri getirir (admin için - status filtresi olmadan)
 */
export async function getAllPostsData(): Promise<Post[]> {
  try {
    return await getAllPosts();
  } catch (error) {
    console.error('Error loading all posts from Firebase:', error);
    return [];
  }
}

/**
 * @deprecated Bu const'lar artık kullanılmıyor. getCategoriesAction() ve getPostsAction() kullanın.
 * Backward compatibility için boş array'ler export ediliyor.
 * NOT: 'use server' dosyalarında const export yapılamaz, bu yüzden bu dosyayı 'use server' olmadan bırakıyoruz.
 */
export const CATEGORIES: Category[] = [];
export const POSTS: Post[] = [];
