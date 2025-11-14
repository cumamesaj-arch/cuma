/**
 * Firebase Migration Script
 * 
 * Bu script mevcut JSON/TS dosyalarındaki verileri Firebase Firestore'a taşır.
 * 
 * Çalıştırmak için: npm run migrate:firebase
 * 
 * ⚠️ DİKKAT: Bu script sadece bir kez çalıştırılmalıdır!
 * Tekrar çalıştırırsanız veriler tekrar eklenir (duplicate olabilir).
 */

// Environment variables'ları yükle
import { config } from 'dotenv';
import { resolve } from 'path';
import * as fs from 'fs/promises';
import * as path from 'path';

// .env.local dosyasını yükle
const envLocalPath = resolve(process.cwd(), '.env.local');
const envPath = resolve(process.cwd(), '.env');

console.log(`📁 .env.local dosyası aranıyor: ${envLocalPath}`);
const envLocalResult = config({ path: envLocalPath });

if (envLocalResult.error) {
  console.log(`⚠️  .env.local bulunamadı: ${envLocalResult.error.message}`);
} else {
  console.log(`✅ .env.local yüklendi`);
}

// Alternatif olarak .env dosyasını da dene
if (!process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
  console.log(`📁 .env dosyası aranıyor: ${envPath}`);
  const envResult = config({ path: envPath });
  if (envResult.error) {
    console.log(`⚠️  .env bulunamadı: ${envResult.error.message}`);
  } else {
    console.log(`✅ .env yüklendi`);
  }
}

import {
  // Posts
  createPost,
  // Images
  createImage,
  // Comments
  createComment,
  // Users
  createUser,
  // Visitor Messages
  createVisitorMessage,
  // Custom Menus
  createCustomMenu,
  // Categories
  createCategory,
  createSubcategory,
  // Settings
  updateCategorySetting,
  createSocialLink,
  createSharePlatform,
  updateHomepageSections,
  updateMenuConfig,
  createSocialMediaAPI,
  createNote,
} from '../src/lib/firestore';

import { POSTS, CATEGORIES } from '../src/lib/data';
import type { Post, Category, Comment, User, VisitorMessage, CustomMenu, CategorySettings, SocialLink, SharePlatform, HomepageSections, MenuGlobalConfig, SocialMediaAPI, Note } from '../src/lib/types';

// ImagePlaceholder type'ı
interface ImagePlaceholder {
  id: string;
  imageUrl: string;
  description?: string;
  imageHint?: string;
}

// Renkli console log fonksiyonları
const log = {
  success: (msg: string) => console.log(`✅ ${msg}`),
  error: (msg: string) => console.error(`❌ ${msg}`),
  info: (msg: string) => console.log(`ℹ️  ${msg}`),
  warning: (msg: string) => console.warn(`⚠️  ${msg}`),
};

// Icon mapping: LucideIcon component'lerini string'e çevir
function iconToString(icon: any): string {
  if (typeof icon === 'string') {
    return icon;
  }
  // LucideIcon component'inin name property'sini al
  return icon?.name || icon?.displayName || 'Hand';
}

/**
 * Posts verilerini Firebase'e taşır
 */
async function migratePosts() {
  log.info('\n📝 Posts verilerini Firebase\'e taşıyor...');
  
  try {
    let successCount = 0;
    let errorCount = 0;
    
    for (const post of POSTS) {
      try {
        // Status varsayılan olarak 'published' yap
        const postData: Post = {
          ...post,
          status: post.status || 'published',
        };
        
        await createPost(postData);
        successCount++;
      } catch (error) {
        errorCount++;
        log.error(`Post eklenemedi (${post.id}): ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
      }
    }
    
    log.success(`Posts migration tamamlandı: ${successCount} başarılı, ${errorCount} hata`);
    return { success: successCount, error: errorCount };
  } catch (error) {
    log.error(`Posts migration hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    return { success: 0, error: 1 };
  }
}

/**
 * Categories verilerini Firebase'e taşır
 */
async function migrateCategories() {
  log.info('\n📁 Categories verilerini Firebase\'e taşıyor...');
  
  try {
    let successCount = 0;
    let errorCount = 0;
    
    for (const category of CATEGORIES) {
      try {
        // Icon'u string'e çevir
        const iconString = iconToString(category.icon);
        
        // Ana kategoriyi oluştur (id'yi manuel olarak set etmek için önce doc oluştur)
        const db = (await import('../src/lib/firestore/common')).ensureFirestoreConnection();
        const categoryData = {
          id: category.id, // Mevcut ID'yi kullan
          title: category.title,
          slug: category.slug,
          icon: iconString,
          order: parseInt(category.id) || 0,
          subcategories: category.subcategories?.map(sub => ({
            ...sub,
            icon: iconToString(sub.icon),
          })) || [],
        };
        
        // Firestore'a direkt yaz (createCategory slug kontrolü yapıyor, bu yüzden direkt yazıyoruz)
        const docData = (await import('../src/lib/firestore/common')).objectToFirestoreDoc(categoryData);
        await db.collection('categories').doc(category.id).set(docData);
        
        successCount++;
        
        // Alt kategorileri ekle
        if (category.subcategories && category.subcategories.length > 0) {
          for (const subcategory of category.subcategories) {
            try {
              const subIconString = iconToString(subcategory.icon);
              await createSubcategory(category.id, {
                title: subcategory.title,
                slug: subcategory.slug,
                icon: subIconString,
              });
            } catch (error) {
              log.warning(`Alt kategori eklenemedi (${subcategory.id}): ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
            }
          }
        }
      } catch (error) {
        errorCount++;
        log.error(`Kategori eklenemedi (${category.id}): ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
      }
    }
    
    log.success(`Categories migration tamamlandı: ${successCount} başarılı, ${errorCount} hata`);
    return { success: successCount, error: errorCount };
  } catch (error) {
    log.error(`Categories migration hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    return { success: 0, error: 1 };
  }
}

/**
 * JSON dosyasından veri okur
 */
async function readJSONFile<T>(filePath: string): Promise<T | null> {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const content = await fs.readFile(fullPath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    log.warning(`Dosya okunamadı: ${filePath}`);
    return null;
  }
}

/**
 * Images verilerini Firebase'e taşır
 */
async function migrateImages() {
  log.info('\n🖼️  Images verilerini Firebase\'e taşıyor...');
  
  try {
    const imagesData = await readJSONFile<{ placeholderImages?: ImagePlaceholder[] } | ImagePlaceholder[]>('src/lib/placeholder-images.json');
    
    // Dosya formatı { placeholderImages: [...] } veya direkt array olabilir
    const images = Array.isArray(imagesData) 
      ? imagesData 
      : (imagesData as any)?.placeholderImages || [];
    
    if (!images || images.length === 0) {
      log.info('Görsel verisi bulunamadı.');
      return { success: 0, error: 0 };
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const image of images) {
      try {
        await createImage(image);
        successCount++;
      } catch (error) {
        errorCount++;
        log.error(`Görsel eklenemedi (${image.id}): ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
      }
    }
    
    log.success(`Images migration tamamlandı: ${successCount} başarılı, ${errorCount} hata`);
    return { success: successCount, error: errorCount };
  } catch (error) {
    log.error(`Images migration hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    return { success: 0, error: 1 };
  }
}

/**
 * Comments verilerini Firebase'e taşır
 */
async function migrateComments() {
  log.info('\n💬 Comments verilerini Firebase\'e taşıyor...');
  
  try {
    const comments = await readJSONFile<Comment[]>('src/lib/comments.json');
    
    if (!comments || comments.length === 0) {
      log.info('Yorum verisi bulunamadı.');
      return { success: 0, error: 0 };
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const comment of comments) {
      try {
        await createComment(comment);
        successCount++;
      } catch (error) {
        errorCount++;
        log.error(`Yorum eklenemedi (${comment.id}): ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
      }
    }
    
    log.success(`Comments migration tamamlandı: ${successCount} başarılı, ${errorCount} hata`);
    return { success: successCount, error: errorCount };
  } catch (error) {
    log.error(`Comments migration hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    return { success: 0, error: 1 };
  }
}

/**
 * Users verilerini Firebase'e taşır
 */
async function migrateUsers() {
  log.info('\n👥 Users verilerini Firebase\'e taşıyor...');
  
  try {
    const users = await readJSONFile<User[]>('src/lib/users.json');
    
    if (!users || users.length === 0) {
      log.info('Kullanıcı verisi bulunamadı.');
      return { success: 0, error: 0 };
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const user of users) {
      try {
        await createUser(user);
        successCount++;
      } catch (error) {
        errorCount++;
        log.error(`Kullanıcı eklenemedi (${user.id}): ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
      }
    }
    
    log.success(`Users migration tamamlandı: ${successCount} başarılı, ${errorCount} hata`);
    return { success: successCount, error: errorCount };
  } catch (error) {
    log.error(`Users migration hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    return { success: 0, error: 1 };
  }
}

/**
 * Visitor Messages verilerini Firebase'e taşır
 */
async function migrateVisitorMessages() {
  log.info('\n📨 Visitor Messages verilerini Firebase\'e taşıyor...');
  
  try {
    const messages = await readJSONFile<VisitorMessage[]>('src/lib/visitor-messages.json');
    
    if (!messages || messages.length === 0) {
      log.info('Ziyaretçi mesajı verisi bulunamadı.');
      return { success: 0, error: 0 };
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const message of messages) {
      try {
        await createVisitorMessage(message);
        successCount++;
      } catch (error) {
        errorCount++;
        log.error(`Mesaj eklenemedi (${message.id}): ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
      }
    }
    
    log.success(`Visitor Messages migration tamamlandı: ${successCount} başarılı, ${errorCount} hata`);
    return { success: successCount, error: errorCount };
  } catch (error) {
    log.error(`Visitor Messages migration hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    return { success: 0, error: 1 };
  }
}

/**
 * Custom Menus verilerini Firebase'e taşır
 */
async function migrateCustomMenus() {
  log.info('\n📋 Custom Menus verilerini Firebase\'e taşıyor...');
  
  try {
    const menus = await readJSONFile<CustomMenu[]>('src/lib/custom-menus.json');
    
    if (!menus || menus.length === 0) {
      log.info('Özel menü verisi bulunamadı.');
      return { success: 0, error: 0 };
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const menu of menus) {
      try {
        await createCustomMenu(menu);
        successCount++;
      } catch (error) {
        errorCount++;
        log.error(`Menü eklenemedi (${menu.id}): ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
      }
    }
    
    log.success(`Custom Menus migration tamamlandı: ${successCount} başarılı, ${errorCount} hata`);
    return { success: successCount, error: errorCount };
  } catch (error) {
    log.error(`Custom Menus migration hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    return { success: 0, error: 1 };
  }
}

/**
 * Category Settings verilerini Firebase'e taşır
 */
async function migrateCategorySettings() {
  log.info('\n⚙️  Category Settings verilerini Firebase\'e taşıyor...');
  
  try {
    const settings = await readJSONFile<CategorySettings[]>('src/lib/category-settings.json');
    
    if (!settings || settings.length === 0) {
      log.info('Kategori ayarı verisi bulunamadı.');
      return { success: 0, error: 0 };
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const setting of settings) {
      try {
        const updateData: any = {
          visible: setting.visible,
          order: setting.order,
        };
        
        if (setting.customTitle !== undefined) {
          updateData.customTitle = setting.customTitle;
        }
        if (setting.customSlug !== undefined) {
          updateData.customSlug = setting.customSlug;
        }
        
        await updateCategorySetting(setting.categoryId, updateData);
        successCount++;
      } catch (error) {
        errorCount++;
        const errorMsg = error instanceof Error ? error.message : 'Bilinmeyen hata';
        log.error(`Kategori ayarı eklenemedi (${setting.categoryId}): ${errorMsg}`);
        if (error instanceof Error && error.stack) {
          console.error(error.stack);
        }
      }
    }
    
    log.success(`Category Settings migration tamamlandı: ${successCount} başarılı, ${errorCount} hata`);
    return { success: successCount, error: errorCount };
  } catch (error) {
    log.error(`Category Settings migration hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    return { success: 0, error: 1 };
  }
}

/**
 * Social Links verilerini Firebase'e taşır
 */
async function migrateSocialLinks() {
  log.info('\n🔗 Social Links verilerini Firebase\'e taşıyor...');
  
  try {
    const links = await readJSONFile<SocialLink[]>('src/lib/social-links.json');
    
    if (!links || links.length === 0) {
      log.info('Sosyal medya linki verisi bulunamadı.');
      return { success: 0, error: 0 };
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const link of links) {
      try {
        await createSocialLink(link);
        successCount++;
      } catch (error) {
        errorCount++;
        log.error(`Sosyal medya linki eklenemedi (${link.name}): ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
      }
    }
    
    log.success(`Social Links migration tamamlandı: ${successCount} başarılı, ${errorCount} hata`);
    return { success: successCount, error: errorCount };
  } catch (error) {
    log.error(`Social Links migration hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    return { success: 0, error: 1 };
  }
}

/**
 * Share Links verilerini Firebase'e taşır
 */
async function migrateShareLinks() {
  log.info('\n🔗 Share Links verilerini Firebase\'e taşıyor...');
  
  try {
    const platforms = await readJSONFile<SharePlatform[]>('src/lib/share-links.json');
    
    if (!platforms || platforms.length === 0) {
      log.info('Paylaşım platformu verisi bulunamadı.');
      return { success: 0, error: 0 };
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const platform of platforms) {
      try {
        await createSharePlatform(platform);
        successCount++;
      } catch (error) {
        errorCount++;
        log.error(`Paylaşım platformu eklenemedi (${platform.name}): ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
      }
    }
    
    log.success(`Share Links migration tamamlandı: ${successCount} başarılı, ${errorCount} hata`);
    return { success: successCount, error: errorCount };
  } catch (error) {
    log.error(`Share Links migration hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    return { success: 0, error: 1 };
  }
}

/**
 * Homepage Sections verilerini Firebase'e taşır
 */
async function migrateHomepageSections() {
  log.info('\n🏠 Homepage Sections verilerini Firebase\'e taşıyor...');
  
  try {
    const sections = await readJSONFile<HomepageSections>('src/lib/homepage-sections.json');
    
    if (!sections) {
      log.info('Ana sayfa bölümleri verisi bulunamadı.');
      return { success: 0, error: 0 };
    }
    
    await updateHomepageSections(sections);
    log.success('Homepage Sections migration tamamlandı: 1 başarılı');
    return { success: 1, error: 0 };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Bilinmeyen hata';
    log.error(`Homepage Sections migration hatası: ${errorMsg}`);
    if (error instanceof Error && error.stack) {
      console.error('Stack trace:', error.stack);
    }
    return { success: 0, error: 1 };
  }
}

/**
 * Menu Config verilerini Firebase'e taşır
 */
async function migrateMenuConfig() {
  log.info('\n⚙️  Menu Config verilerini Firebase\'e taşıyor...');
  
  try {
    const config = await readJSONFile<MenuGlobalConfig>('src/lib/menu-config.json');
    
    if (!config) {
      log.info('Menü ayarı verisi bulunamadı.');
      return { success: 0, error: 0 };
    }
    
    await updateMenuConfig(config);
    log.success('Menu Config migration tamamlandı: 1 başarılı');
    return { success: 1, error: 0 };
  } catch (error) {
    log.error(`Menu Config migration hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    return { success: 0, error: 1 };
  }
}

/**
 * Social Media APIs verilerini Firebase'e taşır
 */
async function migrateSocialMediaAPIs() {
  log.info('\n🔌 Social Media APIs verilerini Firebase\'e taşıyor...');
  
  try {
    const apis = await readJSONFile<SocialMediaAPI[]>('src/lib/social-media-apis.json');
    
    if (!apis || apis.length === 0) {
      log.info('Sosyal medya API verisi bulunamadı.');
      return { success: 0, error: 0 };
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const api of apis) {
      try {
        await createSocialMediaAPI(api);
        successCount++;
      } catch (error) {
        errorCount++;
        log.error(`Sosyal medya API eklenemedi (${api.platform}): ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
      }
    }
    
    log.success(`Social Media APIs migration tamamlandı: ${successCount} başarılı, ${errorCount} hata`);
    return { success: successCount, error: errorCount };
  } catch (error) {
    log.error(`Social Media APIs migration hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    return { success: 0, error: 1 };
  }
}

/**
 * Notes verilerini Firebase'e taşır
 */
async function migrateNotes() {
  log.info('\n📝 Notes verilerini Firebase\'e taşıyor...');
  
  try {
    const notesData = await readJSONFile<{ notes: Note[] }>('src/lib/notes.json');
    
    if (!notesData || !notesData.notes || notesData.notes.length === 0) {
      log.info('Not verisi bulunamadı.');
      return { success: 0, error: 0 };
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const note of notesData.notes) {
      try {
        await createNote(note);
        successCount++;
      } catch (error) {
        errorCount++;
        log.error(`Not eklenemedi (${note.id}): ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
      }
    }
    
    log.success(`Notes migration tamamlandı: ${successCount} başarılı, ${errorCount} hata`);
    return { success: successCount, error: errorCount };
  } catch (error) {
    log.error(`Notes migration hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    return { success: 0, error: 1 };
  }
}

/**
 * Ana migration fonksiyonu
 */
async function main() {
  console.log('\n🚀 Firebase Migration Başlıyor...\n');
  console.log('='.repeat(60));
  console.log('⚠️  DİKKAT: Bu script mevcut verileri Firebase\'e taşır.');
  console.log('⚠️  Tekrar çalıştırırsanız veriler duplicate olabilir!');
  console.log('='.repeat(60));
  
  // Environment variables kontrolü
  const requiredVars = {
    'FIREBASE_ADMIN_PRIVATE_KEY': process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    'FIREBASE_PROJECT_ID': process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    'FIREBASE_CLIENT_EMAIL': process.env.FIREBASE_CLIENT_EMAIL,
  };
  
  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);
  
  if (missingVars.length > 0) {
    log.error(`Eksik environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }
  
  log.success('Tüm environment variables mevcut!');
  
  // Migration işlemlerini sırayla çalıştır
  const results = {
    posts: await migratePosts(),
    categories: await migrateCategories(),
    images: await migrateImages(),
    comments: await migrateComments(),
    users: await migrateUsers(),
    visitorMessages: await migrateVisitorMessages(),
    customMenus: await migrateCustomMenus(),
    categorySettings: await migrateCategorySettings(),
    socialLinks: await migrateSocialLinks(),
    shareLinks: await migrateShareLinks(),
    homepageSections: await migrateHomepageSections(),
    menuConfig: await migrateMenuConfig(),
    socialMediaAPIs: await migrateSocialMediaAPIs(),
    notes: await migrateNotes(),
  };
  
  // Özet
  console.log('\n' + '='.repeat(60));
  console.log('📊 Migration Özeti:');
  console.log('='.repeat(60));
  
  let totalSuccess = 0;
  let totalError = 0;
  
  Object.entries(results).forEach(([key, result]) => {
    totalSuccess += result.success;
    totalError += result.error;
    console.log(`  ${key}: ${result.success} başarılı, ${result.error} hata`);
  });
  
  console.log('='.repeat(60));
  console.log(`Toplam: ${totalSuccess} başarılı, ${totalError} hata`);
  console.log('='.repeat(60));
  
  if (totalError === 0) {
    log.success('\n🎉 Tüm migration işlemleri başarıyla tamamlandı!');
  } else {
    log.warning(`\n⚠️  Migration tamamlandı ancak ${totalError} hata oluştu.`);
  }
}

// Script'i çalıştır
main().catch((error) => {
  log.error(`Kritik hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
  if (error instanceof Error && error.stack) {
    console.error(error.stack);
  }
  process.exit(1);
});

