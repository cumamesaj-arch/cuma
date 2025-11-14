
'use server';

import * as fs from 'fs/promises';
import path from 'path';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import type { Post, Comment, VisitorMessage, SocialLink, SharePlatform, HomepageSections, CustomMenu, CategorySettings, User, UserRole, SocialMediaAPI, MenuGlobalConfig, Note, Category } from '@/lib/types';
import { generateImage } from '@/ai/flows/generate-image-flow';
import { generateImageEdit } from '@/ai/flows/generate-image-edit-flow';
import { generateImageCaption } from '@/ai/flows/generate-image-caption-flow';
import { revalidatePath } from 'next/cache';
import { generateSEOKeywords } from '@/ai/flows/generate-seo-keywords-flow';
import crypto from 'crypto';
// Firebase imports
import {
  getImages,
  getImageById,
  createImage,
  createImages,
  updateImage,
  deleteImage,
  restoreImage,
  permanentlyDeleteImage,
  getDeletedImages,
  emptyDeletedImages,
  getPosts,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  restorePost,
  permanentlyDeletePost,
  getDeletedPosts,
  emptyDeletedPosts,
  updatePostOrder,
  swapPostDates,
  updatePostStatus,
  getComments,
  createComment,
  updateComment,
  deleteComment,
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  getVisitorMessages,
  createVisitorMessage,
  deleteVisitorMessage,
  getCustomMenus,
  createCustomMenu,
  updateCustomMenu,
  deleteCustomMenu,
  getCategories,
  createSubcategory,
  updateSubcategory,
  deleteCategory,
  deleteSubcategory,
  getCategorySettings,
  updateCategorySetting,
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  getShareLinks,
  createSharePlatform,
  deleteSharePlatform,
  getHomepageSections,
  updateHomepageSections,
  getMenuConfig,
  updateMenuConfig,
  getSocialMediaAPIs,
  createSocialMediaAPI,
  updateSocialMediaAPI,
  deleteSocialMediaAPI,
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from '@/lib/firestore';

// ==================== Posts Actions ====================

export async function getPostsAction(filters?: {
  category?: string;
  status?: 'published' | 'draft';
  limit?: number;
  orderBy?: 'createdAt' | 'order' | 'title';
  orderDirection?: 'asc' | 'desc';
}): Promise<Post[]> {
  try {
    const posts = await getPosts(filters);
    // Serialize to avoid stream issues
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error('Error getting posts:', error);
    return [];
  }
}

export async function getAllPostsAction(): Promise<Post[]> {
  try {
    const posts = await getAllPosts();
    // Serialize to avoid stream issues
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error('Error getting all posts:', error);
            return [];
  }
}

// ==================== Categories Actions ====================

export async function getCategoriesAction(): Promise<Category[]> {
  try {
    const categories = await getCategories();
    // Serialize to avoid stream issues
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
}

// ==================== Images Actions ====================

export async function getPlaceholderImagesAction(): Promise<ImagePlaceholder[]> {
    try {
        // Firebase'den görselleri getir
        const images = await getImages();
        // Serialize to avoid stream issues
        return JSON.parse(JSON.stringify(images));
    } catch (error) {
        console.error('Error reading placeholder images:', error);
        return [];
    }
}

export async function uploadPlaceholderFilesAction(formData: FormData): Promise<{ success: boolean; images?: ImagePlaceholder[]; error?: string }>{
  try {
    const files = formData.getAll('files') as unknown as File[];
    if (!files || files.length === 0) {
      return { success: false, error: 'Dosya bulunamadı' };
    }

    const publicDir = path.join(process.cwd(), 'public');
    const uploadsDir = path.join(publicDir, 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Process all files in parallel for better performance
    const filePromises = files.map(async (f) => {
      // @ts-ignore - File in server action supports arrayBuffer
      const arrayBuf = await f.arrayBuffer();
      const buf = Buffer.from(arrayBuf);
      const ext = (f.name && f.name.includes('.')) ? ('.' + f.name.split('.').pop()) : '.jpg';
      const timestamp = Date.now();
      const random = Math.floor(Math.random()*1e6);
      const fileName = `upload_${timestamp}_${random}${ext}`;
      const abs = path.join(uploadsDir, fileName);
      await fs.writeFile(abs, buf);
      const imageUrl = `/uploads/${fileName}`;
      const image: ImagePlaceholder = {
        id: `upload-${timestamp}-${random}`,
        imageUrl,
        description: f.name.substring(0, 100),
        imageHint: 'uploaded',
      };
      return image;
    });
    
    const processedImages = await Promise.all(filePromises);

    // Firebase'e kaydet
    const saved = await createImages(processedImages);

    revalidatePath('/admin/posts/new');
    revalidatePath('/admin/media');
    return { success: true, images: saved };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Yükleme hatası' };
  }
}

export async function uploadImageAction(newImage: ImagePlaceholder) {
    try {
        // Firebase'e kaydet
        const createdImage = await createImage(newImage);

        // Revalidate pages that use images
        revalidatePath('/admin/media');
        revalidatePath('/admin/posts/new');

        return { success: true, image: createdImage };
    } catch (error) {
        console.error('Error updating placeholder images:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}

export async function deleteImageAction(imageId: string) {
    try {
        // Firebase'de görseli sil (çöp kutusuna taşı)
        await deleteImage(imageId);

        // Revalidate pages that use images
        revalidatePath('/admin/media');
        revalidatePath('/admin/posts/new');

        return { success: true };
    } catch (error) {
        console.error('Error deleting image:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}


// Helper function to escape strings for TypeScript/JavaScript code (for template literals)
function escapeForTemplateLiteral(str: string): string {
  return str
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/`/g, '\\`')    // Escape backticks
    .replace(/\$/g, '\\$')   // Escape dollar signs (for template literals)
    .replace(/\n/g, '\\n')   // Escape newlines
    .replace(/\r/g, '\\r')   // Escape carriage returns
    .replace(/\t/g, '\\t');  // Escape tabs
}

// Helper function to escape strings for single quotes (URLs and simple strings)
function escapeForSingleQuote(str: string): string {
  return str
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/'/g, "\\'")    // Escape single quotes
    .replace(/\n/g, '\\n')   // Escape newlines
    .replace(/\r/g, '\\r')   // Escape carriage returns
    .replace(/\t/g, '\\t');  // Escape tabs
}

export async function createPostAction(postData: Post) {
    try {
        // Firebase'e gönderi oluştur
        const createdPost = await createPost(postData);

        revalidatePath('/');
        revalidatePath('/[category]', 'layout');
        revalidatePath('/[category]/[slug]', 'layout');
        revalidatePath('/admin/posts');

        return { success: true, post: createdPost };
    } catch (error) {
        console.error('Error creating post:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}

// Update existing post by id
export async function updatePostAction(postData: Post) {
  try {
    // Firebase'de gönderiyi güncelle
    await updatePost(postData.id, postData);

    revalidatePath('/');
    revalidatePath('/[category]', 'layout');
    revalidatePath('/[category]/[slug]', 'layout');
    revalidatePath('/admin/posts');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error updating post:', error);
    if (error instanceof Error) return { success: false, error: error.message };
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function updatePostOrderAction(postId: string, newOrder: number) {
  try {
    // Firebase'de gönderi sırasını güncelle
    await updatePostOrder(postId, newOrder);
    
    revalidatePath('/');
    revalidatePath('/[category]', 'layout');
    revalidatePath('/[category]/[slug]', 'layout');
    revalidatePath('/admin/posts');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error updating post order:', error);
    if (error instanceof Error) return { success: false, error: error.message };
    return { success: false, error: 'An unknown error occurred' };
  }
}

// Swap createdAt between two posts (simpler ordering by date)
export async function swapPostDatesAction(postIdA: string, postIdB: string) {
  try {
    // Firebase'de gönderi tarihlerini değiştir
    await swapPostDates(postIdA, postIdB);
    
    revalidatePath('/');
    revalidatePath('/admin/posts');
    revalidatePath('/admin');
    return { success: true };
  } catch (e) {
    console.error('Error swapping post dates:', e);
    return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

// ===== Menu Global Config =====
export async function getMenuGlobalConfigAction(): Promise<MenuGlobalConfig> {
  try {
    // Firebase'den menü yapılandırmasını getir
    const config = await getMenuConfig();
    const result = config || { categoryPagePostCount: 12 };
    // Serialize to avoid stream issues
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error('Error getting menu config:', error);
    return { categoryPagePostCount: 12 };
  }
}

export async function updateMenuGlobalConfigAction(config: Partial<MenuGlobalConfig>): Promise<{ success: boolean; error?: string }> {
  try {
    // Firebase'de menü yapılandırmasını güncelle
    const current = await getMenuConfig();
    const defaultConfig: MenuGlobalConfig = { categoryPagePostCount: 12 };
    const next: MenuGlobalConfig = {
      categoryPagePostCount: typeof config.categoryPagePostCount === 'number' && config.categoryPagePostCount > 0
        ? Math.floor(config.categoryPagePostCount)
        : (current?.categoryPagePostCount || defaultConfig.categoryPagePostCount),
    };
    await updateMenuConfig(next);
    
    revalidatePath('/[category]');
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Config yazılamadı' };
  }
}

export async function deletePostAction(postId: string) {
    try {
        // Firebase'de gönderiyi sil (çöp kutusuna taşı)
        await deletePost(postId);

        // Revalidate all relevant paths
        revalidatePath('/');
        revalidatePath('/[category]', 'layout');
        revalidatePath('/[category]/[slug]', 'layout');
        revalidatePath('/admin/posts');
        revalidatePath('/admin');

        return { success: true, message: 'Gönderi çöp kutusuna taşındı' };
    } catch (error) {
        console.error('Error deleting post:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}

// Restore post from trash
export async function restorePostAction(postId: string) {
    try {
        // Firebase'de gönderiyi geri getir
        const restoredPost = await restorePost(postId);

        revalidatePath('/');
        revalidatePath('/[category]', 'layout');
        revalidatePath('/[category]/[slug]', 'layout');
        revalidatePath('/admin/posts');

        return { success: true, post: restoredPost };
    } catch (error) {
        console.error('Error restoring post:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}

// Permanently delete post from trash
export async function permanentlyDeletePostAction(postId: string) {
    try {
        // Firebase'de gönderiyi kalıcı olarak sil
        await permanentlyDeletePost(postId);

        revalidatePath('/admin/posts');

        return { success: true };
    } catch (error) {
        console.error('Error permanently deleting post:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}

// Get deleted posts
export async function getDeletedPostsAction(): Promise<(Post & { deletedAt: string })[]> {
    try {
        // Firebase'den silinen gönderileri getir
        const posts = await getDeletedPosts();
        // Serialize to avoid stream issues
        return JSON.parse(JSON.stringify(posts));
    } catch (error) {
        console.error('Error getting deleted posts:', error);
        return [];
    }
}

// Empty all deleted posts (admin)
export async function emptyDeletedPostsAction(): Promise<{ success: boolean; error?: string }> {
    try {
        // Firebase'de çöp kutusunu temizle
        await emptyDeletedPosts();
        revalidatePath('/admin/posts');
        return { success: true };
    } catch (error) {
        console.error('Error emptying deleted posts:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}

// Restore image from trash
export async function restoreImageAction(imageId: string) {
    try {
        // Firebase'de görseli geri getir
        const restoredImage = await restoreImage(imageId);

        revalidatePath('/admin/media');
        revalidatePath('/admin/posts/new');

        return { success: true, image: restoredImage };
    } catch (error) {
        console.error('Error restoring image:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}

// Permanently delete image from trash
export async function permanentlyDeleteImageAction(imageId: string) {
    try {
        // Firebase'de görseli kalıcı olarak sil
        await permanentlyDeleteImage(imageId);

        revalidatePath('/admin/media');

        return { success: true };
    } catch (error) {
        console.error('Error permanently deleting image:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}

// Get deleted images
export async function getDeletedImagesAction(): Promise<(ImagePlaceholder & { deletedAt: string })[]> {
    try {
        // Firebase'den silinen görselleri getir
        const images = await getDeletedImages();
        // Serialize to avoid stream issues
        return JSON.parse(JSON.stringify(images));
    } catch (error) {
        console.error('Error getting deleted images:', error);
        return [];
    }
}

// Empty all deleted images (admin)
export async function emptyDeletedImagesAction(): Promise<{ success: boolean; error?: string }> {
    try {
        // Firebase'de çöp kutusunu temizle
        await emptyDeletedImages();
        revalidatePath('/admin/media');
        return { success: true };
    } catch (error) {
        console.error('Error emptying deleted images:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}

// Update post status
export async function updatePostStatusAction(postId: string, status: 'published' | 'draft') {
    try {
        // Firebase'de gönderi durumunu güncelle
        await updatePostStatus(postId, status);

        revalidatePath('/');
        revalidatePath('/[category]', 'layout');
        revalidatePath('/[category]/[slug]', 'layout');
        revalidatePath('/admin/posts');

        return { success: true };
    } catch (error) {
        console.error('Error updating post status:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}

// Generate SEO keywords using AI
export async function generateSEOKeywordsAction(title: string, content: string, category: string) {
    try {
        const result = await generateSEOKeywords({
            title,
            content,
            category,
        });
        // Fallback kullanıldıysa bile başarılı say (fallback her zaman sonuç döner)
        return { success: true, ...result };
    } catch (error) {
        console.error('Error generating SEO keywords:', error);
        
        // Daha açıklayıcı hata mesajları
        if (error instanceof Error) {
            let errorMessage = error.message;
            
            // API hatalarını Türkçe'ye çevir
            if (error.message.includes('503') || error.message.includes('overloaded') || error.message.includes('Service Unavailable')) {
                errorMessage = 'AI servisi şu anda yoğun. Otomatik SEO önerileri oluşturuldu.';
            } else if (error.message.includes('rate limit') || error.message.includes('429')) {
                errorMessage = 'Çok fazla istek gönderildi. Otomatik SEO önerileri oluşturuldu.';
            } else if (error.message.includes('401') || error.message.includes('403')) {
                errorMessage = 'API anahtarı geçersiz veya yetki yok. Otomatik SEO önerileri oluşturuldu.';
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                errorMessage = 'İnternet bağlantısı hatası. Otomatik SEO önerileri oluşturuldu.';
            }
            
            // Fallback SEO oluştur (basit bir versiyonu)
            const fallbackTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
            const fallbackDescription = content.substring(0, 130).replace(/\n/g, ' ').trim() + '...';
            const fallbackKeywords = [
                ...title.split(/\s+/).filter(w => w.length > 3).map(w => w.toLowerCase()),
                category.toLowerCase(),
                'cuma mesajları',
                'islami içerik'
            ].slice(0, 15);
            
            return { 
                success: true, 
                metaTitle: fallbackTitle,
                metaDescription: fallbackDescription,
                keywords: fallbackKeywords,
                suggestions: [],
                error: errorMessage 
            };
        }
        
        // Genel hata durumu için de fallback
        const fallbackTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
        const fallbackDescription = content.substring(0, 130).replace(/\n/g, ' ').trim() + '...';
        const fallbackKeywords = [
            ...title.split(/\s+/).filter(w => w.length > 3).map(w => w.toLowerCase()),
            category.toLowerCase(),
            'cuma mesajları',
            'islami içerik'
        ].slice(0, 15);
        
        return { 
            success: true, 
            metaTitle: fallbackTitle,
            metaDescription: fallbackDescription,
            keywords: fallbackKeywords,
            suggestions: [],
            error: 'Anahtar kelime üretilirken bir hata oluştu. Otomatik SEO önerileri oluşturuldu.' 
        };
    }
}

export async function addCommentAction(newComment: Comment) {
  try {
    // Firebase'e yorum ekle
    const createdComment = await createComment(newComment);

    revalidatePath('/[category]/[slug]');

    return { success: true, comment: createdComment };
  } catch (error) {
    console.error('Error adding comment:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function deleteCommentAction(commentId: string) {
  try {
    // Firebase'den yorumu sil
    await deleteComment(commentId);

    revalidatePath('/[category]/[slug]');

    return { success: true };
  } catch (error) {
    console.error('Error deleting comment:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function updateCommentAction(commentId: string, newText: string) {
  try {
    // Firebase'de yorumu güncelle
    const updatedComment = await updateComment(commentId, { text: newText });

    revalidatePath('/[category]/[slug]');

    return { success: true, comment: updatedComment };
  } catch (error) {
    console.error('Error updating comment:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}


export async function getSocialLinksAction(): Promise<SocialLink[]> {
  try {
    // Firebase'den sosyal medya linklerini getir
    const links = await getSocialLinks();
    // Serialize to avoid stream issues
    return JSON.parse(JSON.stringify(links));
  } catch (error) {
    console.error('Error reading social links:', error);
    return [];
  }
}

export async function getShareLinksAction(): Promise<SharePlatform[]> {
  try {
    // Firebase'den paylaşım linklerini getir
    const links = await getShareLinks();
    // Serialize to avoid stream issues
    return JSON.parse(JSON.stringify(links));
  } catch (error) {
    console.error('Error reading share links:', error);
    return [];
  }
}

export async function updateSocialLinksAction(newLinks: SocialLink[]) {
  try {
    // Mevcut linkleri al
    const existingLinks = await getSocialLinks();
    
    // Yeni linkleri ekle/güncelle, olmayanları sil
    const existingLinkNames = existingLinks.map(l => l.name);
    const newLinkNames = newLinks.map(l => l.name);
    
    // Silinecek linkler
    const linksToDelete = existingLinkNames.filter(name => !newLinkNames.includes(name));
    for (const linkName of linksToDelete) {
      await deleteSocialLink(linkName);
    }
    
    // Yeni/güncellenecek linkler
    for (const link of newLinks) {
      if (existingLinkNames.includes(link.name)) {
        // Güncelle
        await updateSocialLink(link.name, {
          url: link.url,
          color: link.color,
          active: link.active,
        });
      } else {
        // Yeni ekle
        await createSocialLink(link);
      }
    }

    revalidatePath('/', 'layout');

    return { success: true, links: newLinks };
  } catch (error) {
    console.error('Error updating social links:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function addVisitorMessageAction(newMessage: VisitorMessage) {
  try {
    // Firebase'e ziyaretçi mesajı ekle
    const createdMessage = await createVisitorMessage(newMessage);

    revalidatePath('/');
    revalidatePath('/admin/messages');

    return { success: true, message: createdMessage };
  } catch (error) {
    console.error('Error adding visitor message:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function getVisitorMessagesAction(): Promise<VisitorMessage[]> {
  try {
    // Firebase'den ziyaretçi mesajlarını getir
    const messages = await getVisitorMessages();
    // Serialize to avoid stream issues
    return JSON.parse(JSON.stringify(messages));
  } catch (error) {
    console.error('Error getting visitor messages:', error);
    // File doesn't exist, return empty array
    return [];
  }
}

export async function deleteVisitorMessageAction(messageId: string) {
  try {
    // Firebase'den ziyaretçi mesajını sil
    await deleteVisitorMessage(messageId);

    revalidatePath('/admin/messages');

    return { success: true };
  } catch (error) {
    console.error('Error deleting visitor message:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function getCommentsAction(): Promise<Comment[]> {
  try {
    // Firebase'den yorumları getir
    const comments = await getComments();
    // Serialize to avoid stream issues
    return JSON.parse(JSON.stringify(comments));
  } catch (error) {
    console.error('Error getting comments:', error);
    // File doesn't exist, return empty array
    return [];
  }
}

export async function updateShareLinksAction(newLinks: SharePlatform[]) {
  try {
    // Mevcut platformları al
    const existingPlatforms = await getShareLinks();
    
    // Yeni platformları ekle/güncelle, olmayanları sil
    const existingPlatformNames = existingPlatforms.map(p => p.name);
    const newPlatformNames = newLinks.map(p => p.name);
    
    // Silinecek platformlar
    const platformsToDelete = existingPlatformNames.filter(name => !newPlatformNames.includes(name));
    for (const platformName of platformsToDelete) {
      await deleteSharePlatform(platformName);
    }
    
    // Yeni platformlar
    for (const platform of newLinks) {
      if (!existingPlatformNames.includes(platform.name)) {
        await createSharePlatform(platform);
      }
    }
    
    revalidatePath('/[category]/[slug]');
    return { success: true };
  } catch (error) {
    console.error('Error updating share links:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function getHomepageSectionsAction(): Promise<HomepageSections> {
  try {
    // Firebase'den ana sayfa bölümlerini getir
    const sections = await getHomepageSections();
    if (sections) {
      // Deep clone to avoid serialization issues
      return JSON.parse(JSON.stringify(sections));
    }
    // Fallback to default
    const { default: defaultSections } = await import('@/lib/homepage-sections');
    return JSON.parse(JSON.stringify(defaultSections));
  } catch (error) {
    console.error('Error reading homepage sections:', error);
    // Return default sections on error
    const { default: defaultSections } = await import('@/lib/homepage-sections');
    return JSON.parse(JSON.stringify(defaultSections));
  }
}

export async function updateHomepageSectionsAction(sections: HomepageSections) {
  try {
    // Firebase'de ana sayfa bölümlerini güncelle
    await updateHomepageSections(sections);
    
    revalidatePath('/');
    revalidatePath('/admin/homepage');
    
    return { success: true, sections };
  } catch (error) {
    console.error('Error updating homepage sections:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function getCustomMenusAction(): Promise<CustomMenu[]> {
  try {
    // Firebase'den özel menüleri getir
    const menus = await getCustomMenus();
    // Serialize to avoid stream issues
    return JSON.parse(JSON.stringify(menus));
  } catch (error) {
    console.error('Error reading custom menus:', error);
    return [];
  }
}

export async function createCustomMenuAction(menu: Omit<CustomMenu, 'id'>): Promise<{ success: boolean; error?: string; menu?: CustomMenu }> {
  try {
    // Firebase'e özel menü oluştur
    const createdMenu = await createCustomMenu(menu);
    
    revalidatePath('/admin/menus');
    revalidatePath('/');
    
    return { success: true, menu: createdMenu };
  } catch (error) {
    console.error('Error creating custom menu:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function updateCustomMenuAction(menuId: string, updates: Partial<Omit<CustomMenu, 'id'>>): Promise<{ success: boolean; error?: string }> {
  try {
    // Firebase'de özel menüyü güncelle
    await updateCustomMenu(menuId, updates);
    
    revalidatePath('/admin/menus');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating custom menu:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function deleteCustomMenuAction(menuId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Firebase'den özel menüyü sil
    await deleteCustomMenu(menuId);
    
    revalidatePath('/admin/menus');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting custom menu:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function getCategorySettingsAction(): Promise<CategorySettings[]> {
  try {
    // Firebase'den kategori ayarlarını getir
    const settings = await getCategorySettings();
    // Serialize to avoid stream issues
    return JSON.parse(JSON.stringify(settings));
  } catch (error) {
    console.error('Error reading category settings:', error);
    return [];
  }
}

export async function updateCategorySettingsAction(categoryId: string, updates: Partial<Omit<CategorySettings, 'categoryId'>>): Promise<{ success: boolean; error?: string }> {
  try {
    // Sanitize and coerce order to a valid non-negative integer
    let nextOrder: number | undefined = undefined;
    if (typeof updates.order !== 'undefined') {
      const coerced = typeof updates.order === 'string' ? parseInt(updates.order as unknown as string, 10) : updates.order as number;
      nextOrder = Number.isFinite(coerced) && coerced >= 0 ? coerced : 0;
    }

    const updateData: Partial<Omit<CategorySettings, 'categoryId'>> = {
        ...updates,
        ...(typeof nextOrder === 'number' ? { order: nextOrder } : {}),
    };
    
    // Firebase'de kategori ayarını güncelle
    await updateCategorySetting(categoryId, updateData);
    
    revalidatePath('/admin/menus');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating category settings:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function createSocialLinkAction(newLink: Omit<SocialLink, 'active'> & { active?: boolean }): Promise<{ success: boolean; error?: string; link?: SocialLink }> {
  try {
    const socialLink: SocialLink = {
      name: newLink.name,
      url: newLink.url || '',
      color: newLink.color,
      active: newLink.active ?? true
    };
    
    // Firebase'e sosyal medya linki ekle
    const createdLink = await createSocialLink(socialLink);
    
    revalidatePath('/admin/menus');
    revalidatePath('/');
    
    return { success: true, link: createdLink };
  } catch (error) {
    console.error('Error creating social link:', error);
    if (error instanceof Error) {
      // Zaten mevcut hatası için özel mesaj
      if (error.message.includes('zaten mevcut') || error.message.includes('already exists')) {
        return { success: false, error: 'Bu isimde bir sosyal medya linki zaten mevcut.' };
      }
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function deleteSocialLinkAction(linkName: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Firebase'den sosyal medya linkini sil
    await deleteSocialLink(linkName);
    
    revalidatePath('/admin/menus');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting social link:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function createSharePlatformAction(newPlatform: Omit<SharePlatform, 'active'> & { active?: boolean }): Promise<{ success: boolean; error?: string; platform?: SharePlatform }> {
  try {
    const sharePlatform: SharePlatform = {
      name: newPlatform.name,
      active: newPlatform.active ?? true
    };
    
    // Firebase'e paylaşım platformu ekle
    const createdPlatform = await createSharePlatform(sharePlatform);
    
    revalidatePath('/admin/menus');
    revalidatePath('/');
    
    return { success: true, platform: createdPlatform };
  } catch (error) {
    console.error('Error creating share platform:', error);
    if (error instanceof Error) {
      // Zaten mevcut hatası için özel mesaj
      if (error.message.includes('zaten mevcut') || error.message.includes('already exists')) {
        return { success: false, error: 'Bu isimde bir paylaşım platformu zaten mevcut.' };
      }
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function deleteSharePlatformAction(platformName: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Firebase'den paylaşım platformunu sil
    await deleteSharePlatform(platformName);
    
    revalidatePath('/admin/menus');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting share platform:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

// Helper function to slugify text
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function createSubcategoryAction(parentCategoryId: string, subcategory: { title: string; slug?: string; icon?: string }): Promise<{ success: boolean; error?: string; subcategory?: any }> {
  try {
    // Slug ve icon için default değerler
    const slug = subcategory.slug || slugify(subcategory.title);
    const icon = subcategory.icon || 'Hand';
    
    // Firebase'e alt kategori oluştur (icon string olarak gönderiliyor)
    const createdSubcategory = await createSubcategory(parentCategoryId, {
      title: subcategory.title,
      slug: slug,
      icon: icon as any, // Helper fonksiyonu string kabul ediyor
    });
    
    revalidatePath('/admin/menus');
    revalidatePath('/');
    
    return { 
      success: true, 
      subcategory: createdSubcategory
    };
  } catch (error) {
    console.error('Error creating subcategory:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function updateSubcategoryAction(parentCategoryId: string, subcategoryId: string, updates: { title?: string; slug?: string; icon?: string }): Promise<{ success: boolean; error?: string }> {
  try {
    // Firebase'de alt kategoriyi güncelle (icon string olarak gönderiliyor)
    await updateSubcategory(parentCategoryId, subcategoryId, {
      ...updates,
      icon: updates.icon as any, // Helper fonksiyonu string kabul ediyor
    });
    
    revalidatePath('/admin/menus');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating subcategory:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function deleteCategoryAction(categoryId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Firebase'den kategoriyi sil
    await deleteCategory(categoryId);
    
    revalidatePath('/admin/menus');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function deleteSubcategoryAction(parentCategoryId: string, subcategoryId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Firebase'den alt kategoriyi sil
    await deleteSubcategory(parentCategoryId, subcategoryId);
    
    revalidatePath('/admin/menus');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

// User Management Actions

// Hash password function
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

// Verify password function
function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, hash] = hashedPassword.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

// Login action
export async function loginAction(email: string, password: string): Promise<{ 
  success: boolean; 
  error?: string; 
  user?: { id: string; name: string; email: string; role: string } 
}> {
  try {
    // Firebase'den email ile kullanıcıyı getir (şifre dahil)
    let user = await getUserByEmail(email.toLowerCase(), true);

    // If user not found, create a new viewer user automatically
    if (!user) {
      // Hash the password
      const hashedPassword = hashPassword(password);
      
      // Extract name from email (part before @)
      const nameFromEmail = email.split('@')[0];
      
      // Create new viewer user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: nameFromEmail,
        email: email.toLowerCase(),
        role: 'viewer', // Default role for non-registered users
        password: hashedPassword,
        active: true,
        createdAt: new Date().toISOString(),
      };

      // Firebase'e yeni kullanıcıyı ekle
      const createdUser = await createUser(newUser);
      
      // Use the newly created user (password olmadan)
      user = createdUser;
    } else {
      // Check if user is inactive
      if (!user.active) {
        return { success: false, error: 'Bu kullanıcı hesabı pasif durumda.' };
      }
      
      // User exists, verify password
      if (!user.password) {
        return { success: false, error: 'Kullanıcı şifresi bulunamadı.' };
      }

      const isValid = verifyPassword(password, user.password);
      
      if (!isValid) {
        return { success: false, error: 'Email veya şifre hatalı.' };
      }
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return { 
      success: true, 
      user: {
        id: userWithoutPassword.id,
        name: userWithoutPassword.name,
        email: userWithoutPassword.email,
        role: userWithoutPassword.role
      }
    };
  } catch (error) {
    console.error('Error during login:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Giriş yapılırken bir hata oluştu.' };
  }
}

// Request password reset (sends email with token)
export async function requestPasswordResetAction(email: string): Promise<{ 
  success: boolean; 
  error?: string;
}> {
  try {
    // Firebase'den email ile kullanıcıyı getir
    const user = await getUserByEmail(email.toLowerCase(), false);
    
    if (!user) {
      // Kullanıcı bulunamadı - email gönderme
      return { 
        success: false, 
        error: 'Bu email adresine kayıtlı kullanıcı bulunamadı.' 
      };
    }
    
    // Check if user is inactive
    if (!user.active) {
      return { 
        success: false, 
        error: 'Bu kullanıcı hesabı pasif durumda. Lütfen sistem yöneticisine başvurun.' 
      };
    }
    
    // Güvenli token oluştur
    const crypto = await import('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    
    // Token'ı Firestore'a kaydet
    const { createPasswordResetToken } = await import('@/lib/firestore/password-reset');
    await createPasswordResetToken(email.toLowerCase(), token, 1); // 1 saat geçerli
    
    // Email gönder
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cumamesaj.net';
    const resetUrl = `${siteUrl}/admin/reset-password?token=${token}`;
    
    const { sendPasswordResetEmail } = await import('@/lib/email');
    const emailResult = await sendPasswordResetEmail(email, token, resetUrl);
    
    if (!emailResult.success) {
      // Email gönderilemedi ama token oluşturuldu, kullanıcıya bilgi ver
      console.error('Email gönderilemedi:', emailResult.error);
      return { 
        success: false, 
        error: emailResult.error || 'Email gönderilemedi. Lütfen sistem yöneticisine başvurun.' 
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error requesting password reset:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Şifre sıfırlama isteği oluşturulurken bir hata oluştu.' };
  }
}

// Reset password with token
export async function resetPasswordWithTokenAction(token: string, newPassword: string): Promise<{ 
  success: boolean; 
  error?: string;
}> {
  try {
    // Token'ı kontrol et
    const { getPasswordResetTokenByToken, markTokenAsUsed } = await import('@/lib/firestore/password-reset');
    const resetToken = await getPasswordResetTokenByToken(token);
    
    if (!resetToken) {
      return { success: false, error: 'Geçersiz veya süresi dolmuş token.' };
    }
    
    // Kullanıcıyı getir
    const user = await getUserByEmail(resetToken.email, false);
    
    if (!user) {
      return { success: false, error: 'Kullanıcı bulunamadı.' };
    }
    
    if (!user.active) {
      return { success: false, error: 'Bu kullanıcı hesabı pasif durumda.' };
    }
    
    // Şifre validasyonu
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Şifre en az 6 karakter olmalıdır.' };
    }
    
    // Yeni şifreyi hash'le ve güncelle
    const hashedPassword = hashPassword(newPassword);
    await updateUser(user.id, { password: hashedPassword });
    
    // Token'ı kullanıldı olarak işaretle
    await markTokenAsUsed(resetToken.id);
    
    revalidatePath('/admin/login');
    return { success: true };
  } catch (error) {
    console.error('Error resetting password with token:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Şifre sıfırlanırken bir hata oluştu.' };
  }
}

// Get all users
export async function getUsersAction(): Promise<User[]> {
  try {
    // Firebase'den kullanıcıları getir (şifreler otomatik olarak döndürülmez)
    const users = await getUsers();
    // Serialize to avoid stream issues
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

// Create new user
export async function createUserAction(userData: {
  name: string;
  email: string;
  role: UserRole;
  password: string;
  active?: boolean;
}): Promise<{ success: boolean; error?: string; userId?: string }> {
  try {
    // Hash password
    const hashedPassword = hashPassword(userData.password);

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      role: userData.role,
      password: hashedPassword,
      active: userData.active ?? true,
      createdAt: new Date().toISOString(),
    };

    // Firebase'e kullanıcı oluştur
    const createdUser = await createUser(newUser);

    revalidatePath('/admin/users');
    return { success: true, userId: createdUser.id };
  } catch (error) {
    console.error('Error creating user:', error);
    if (error instanceof Error) {
      // Email zaten kullanılıyorsa özel mesaj
      if (error.message.includes('zaten mevcut') || error.message.includes('already exists')) {
        return { success: false, error: 'Bu email adresi zaten kullanılıyor.' };
      }
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Kullanıcı oluşturulurken bir hata oluştu.' };
  }
}

// Update user
export async function updateUserAction(
  userId: string,
  updates: {
    name?: string;
    email?: string;
    role?: UserRole;
    password?: string;
    active?: boolean;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    // Password varsa hash'le
    const updateData: Partial<User> = { ...updates };
    if (updates.password) {
      updateData.password = hashPassword(updates.password);
    }
    if (updates.email) {
      updateData.email = updates.email.toLowerCase();
    }

    // Firebase'de kullanıcıyı güncelle
    await updateUser(userId, updateData);

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    if (error instanceof Error) {
      // Email zaten kullanılıyorsa özel mesaj
      if (error.message.includes('zaten mevcut') || error.message.includes('already exists')) {
        return { success: false, error: 'Bu email adresi zaten kullanılıyor.' };
      }
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Kullanıcı güncellenirken bir hata oluştu.' };
  }
}

// Delete user
export async function deleteUserAction(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Önce kullanıcıyı kontrol et (son admin kontrolü için)
    const user = await getUserById(userId);
    if (!user) {
      return { success: false, error: 'Kullanıcı bulunamadı.' };
    }

    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const allUsers = await getUsers();
      const adminCount = allUsers.filter(u => u.role === 'admin' && u.active).length;
      if (adminCount === 1) {
        return { success: false, error: 'Son admin kullanıcı silinemez.' };
      }
    }

    // Firebase'den kullanıcıyı sil
    await deleteUser(userId);

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Kullanıcı silinirken bir hata oluştu.' };
  }
}

// ==================== Social Media API Actions ====================

export async function getSocialMediaAPIsAction(): Promise<SocialMediaAPI[]> {
  try {
    // Firebase'den sosyal medya API'lerini getir
    const apis = await getSocialMediaAPIs();
    // Serialize to avoid stream issues
    return JSON.parse(JSON.stringify(apis));
  } catch (error) {
    console.error('Error reading social media APIs:', error);
    return [];
  }
}

export async function createSocialMediaAPIAction(apiData: Omit<SocialMediaAPI, 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; error?: string; api?: SocialMediaAPI }> {
  try {
    // Firebase'e sosyal medya API'si ekle
    const createdAPI = await createSocialMediaAPI(apiData);

    revalidatePath('/admin/social-media-apis');
    return { success: true, api: createdAPI };
  } catch (error) {
    console.error('Error creating social media API:', error);
    if (error instanceof Error) {
      // Zaten mevcut hatası için özel mesaj
      if (error.message.includes('zaten mevcut') || error.message.includes('already exists')) {
        return { success: false, error: 'Bu platform için zaten bir API ayarı mevcut.' };
      }
      return { success: false, error: error.message };
    }
    return { success: false, error: 'API oluşturulurken bir hata oluştu.' };
  }
}

export async function updateSocialMediaAPIAction(platform: string, updates: Partial<Omit<SocialMediaAPI, 'platform' | 'createdAt'>>): Promise<{ success: boolean; error?: string }> {
  try {
    // Firebase'de sosyal medya API'sini güncelle
    await updateSocialMediaAPI(platform, updates);

    revalidatePath('/admin/social-media-apis');
    return { success: true };
  } catch (error) {
    console.error('Error updating social media API:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'API güncellenirken bir hata oluştu.' };
  }
}

export async function deleteSocialMediaAPIAction(platform: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Firebase'den sosyal medya API'sini sil
    await deleteSocialMediaAPI(platform);

    revalidatePath('/admin/social-media-apis');
    return { success: true };
  } catch (error) {
    console.error('Error deleting social media API:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'API silinirken bir hata oluştu.' };
  }
}

// ==================== AI Image Generation Actions ====================

export async function generateAIImageAction(input: {
  prompt: string;
  style?: 'realistic' | 'artistic' | 'minimalist' | 'islamic' | 'modern' | 'classic';
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  quality?: 'standard' | 'high';
}): Promise<{ success: boolean; error?: string; imageUrl?: string; imageData?: ImagePlaceholder }> {
  try {
    const result = await generateImage({
      prompt: input.prompt,
      style: input.style,
      aspectRatio: input.aspectRatio || '16:9',
      quality: input.quality || 'standard',
    });

    if (!result.success || !result.imageUrl) {
      return { success: false, error: result.error || 'Görsel oluşturulamadı.' };
    }

    // Create ImagePlaceholder object from generated image
    const imageId = `ai-${Date.now()}`;
    const newImage: ImagePlaceholder = {
      id: imageId,
      imageUrl: result.imageUrl,
      description: input.prompt.substring(0, 100), // First 100 chars as description
      imageHint: `AI-generated image: ${input.prompt}`,
    };

    // Save to media repository
    const uploadResult = await uploadImageAction(newImage);

    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error || 'Görsel kaydedilemedi.' };
    }

    revalidatePath('/admin/media');
    return { 
      success: true, 
      imageUrl: result.imageUrl,
      imageData: newImage,
    };
  } catch (error) {
    console.error('Error generating AI image:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Görsel oluşturulurken bir hata oluştu.' };
  }
}

export async function generateAIImageEditAction(input: {
  sourceDataUri: string;
  prompt: string;
  quality?: 'standard' | 'high';
}): Promise<{ success: boolean; error?: string; imageUrl?: string; imageData?: ImagePlaceholder }> {
  try {
    const result = await generateImageEdit({
      sourceDataUri: input.sourceDataUri,
      prompt: input.prompt,
      quality: input.quality || 'standard',
    });

    if (!result.success || !result.imageUrl) {
      return { success: false, error: result.error || 'Görsel düzenlenemedi.' };
    }

    const imageId = `ai-edit-${Date.now()}`;
    const newImage: ImagePlaceholder = {
      id: imageId,
      imageUrl: result.imageUrl,
      description: input.prompt.substring(0, 100),
      imageHint: `AI-edited image: ${input.prompt}`,
    };

    const uploadResult = await uploadImageAction(newImage);
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error || 'Görsel kaydedilemedi.' };
    }

    revalidatePath('/admin/media');
    return { success: true, imageUrl: result.imageUrl, imageData: newImage };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Bilinmeyen hata' };
  }
}

export async function generateImageCaptionAction(imageId: string): Promise<{ success: boolean; error?: string; image?: ImagePlaceholder }> {
  try {
    // Firebase'den görseli getir
    const img = await getImageById(imageId);
    if (!img) return { success: false, error: 'Görsel bulunamadı' };
    
    // AI ile açıklama üret
    const res = await generateImageCaption({ imageDataUri: img.imageUrl });
    if (!res.success || !res.description) return { success: false, error: res.error || 'Açıklama üretilemedi' };
    
    // Firebase'de görseli güncelle
    const updatedImage = await updateImage(imageId, {
      description: res.description,
      imageHint: res.imageHint || img.imageHint,
    });
    
    revalidatePath('/admin/media');
    return { success: true, image: updatedImage };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Bilinmeyen hata' };
  }
}

// Notes Actions

export async function getNotesAction(): Promise<{ success: boolean; notes?: Note[]; error?: string }> {
  try {
    // Firebase'den notları getir
    const notes = await getNotes();
    // Serialize to avoid stream issues
    return { success: true, notes: JSON.parse(JSON.stringify(notes)) };
  } catch (error) {
    console.error('Error reading notes:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Notlar okunurken hata oluştu' };
  }
}

export async function createNoteAction(noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; note?: Note; error?: string }> {
  try {
    // Firebase'e not ekle (helper fonksiyonu createdAt ve updatedAt'ı otomatik ekler)
    const createdNote = await createNote({
      ...noteData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    revalidatePath('/admin/notes');
    
    return { success: true, note: createdNote };
  } catch (error) {
    console.error('Error creating note:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Not oluşturulurken hata oluştu' };
  }
}

export async function updateNoteAction(note: Note): Promise<{ success: boolean; note?: Note; error?: string }> {
  try {
    // Firebase'de notu güncelle
    const { id, ...updates } = note;
    const updatedNote = await updateNote(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    revalidatePath('/admin/notes');
    
    return { success: true, note: updatedNote };
  } catch (error) {
    console.error('Error updating note:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Not güncellenirken hata oluştu' };
  }
}

export async function deleteNoteAction(noteId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Firebase'den notu sil
    await deleteNote(noteId);
    
    revalidatePath('/admin/notes');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting note:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Not silinirken hata oluştu' };
  }
}
