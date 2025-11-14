/**
 * Test script for Firebase-based Actions
 * 
 * Bu script, Images ve Posts action fonksiyonlarının Firebase ile çalışıp çalışmadığını test eder.
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Load .env.local first, then .env
dotenv.config({ path: path.join(projectRoot, '.env.local') });
dotenv.config({ path: path.join(projectRoot, '.env') });

// Import Firebase helpers
import {
  getImages,
  getImageById,
  createImage,
  getPosts,
  createPost,
  getAllPosts,
  getComments,
  createComment,
  getUsers,
  createUser,
  getVisitorMessages,
  createVisitorMessage,
  getCustomMenus,
  createCustomMenu,
  getCategorySettings,
  getSocialLinks,
  createSocialLink,
  getShareLinks,
  getNotes,
  createNote,
} from '../src/lib/firestore';

const log = {
  info: (msg: string) => console.log(`ℹ️  ${msg}`),
  success: (msg: string) => console.log(`✅ ${msg}`),
  error: (msg: string) => console.error(`❌ ${msg}`),
  warn: (msg: string) => console.warn(`⚠️  ${msg}`),
};

async function testImages() {
  log.info('Görseller test ediliyor...');
  
  try {
    // Test 1: Görselleri getir
    log.info('1. Görselleri getiriyor...');
    const images = await getImages();
    log.success(`Görseller başarıyla getirildi: ${images.length} adet`);
    
    // Test 2: Yeni görsel oluştur (test için)
    log.info('2. Test görseli oluşturuluyor...');
    const testImage = {
      id: `test-${Date.now()}`,
      imageUrl: '/uploads/test-image.jpg',
      description: 'Test görseli',
      imageHint: 'test',
    };
    
    const createdImage = await createImage(testImage);
    log.success(`Test görseli oluşturuldu: ${createdImage.id}`);
    
    // Test 3: Oluşturulan görseli kontrol et (getImageById ile)
    log.info('3. Oluşturulan görseli kontrol ediyor (getImageById)...');
    const foundImageById = await getImageById(testImage.id);
    
    if (foundImageById) {
      log.success('Oluşturulan görsel başarıyla bulundu (getImageById)!');
      log.info(`Görsel ID: ${foundImageById.id}`);
      log.info(`Görsel URL: ${foundImageById.imageUrl}`);
    } else {
      log.error('Oluşturulan görsel getImageById ile bulunamadı!');
      return false;
    }
    
    // Test 4: getImages ile de kontrol et
    log.info('4. getImages ile görseli kontrol ediyor...');
    const allImages = await getImages();
    const foundImage = allImages.find(img => img.id === testImage.id);
    
    if (foundImage) {
      log.success('Oluşturulan görsel getImages ile de bulundu!');
    } else {
      log.warn('Oluşturulan görsel getImages ile bulunamadı (index sorunu olabilir)');
      log.info(`Toplam görsel sayısı: ${allImages.length}`);
    }
    
    return true;
  } catch (error) {
    log.error(`Görseller testi başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    console.error(error);
    return false;
  }
}

async function testPosts() {
  log.info('Gönderiler test ediliyor...');
  
  try {
    // Test 1: Gönderileri getir
    log.info('1. Gönderileri getiriyor...');
    const posts = await getPosts({ status: 'published' });
    log.success(`Gönderiler başarıyla getirildi: ${posts.length} adet (published)`);
    
    // Test 2: Tüm gönderileri getir
    log.info('2. Tüm gönderileri getiriyor...');
    const allPosts = await getAllPosts();
    log.success(`Tüm gönderiler başarıyla getirildi: ${allPosts.length} adet`);
    
    // Test 3: Yeni test gönderisi oluştur
    log.info('3. Test gönderisi oluşturuluyor...');
    const testPost = {
      id: `test-post-${Date.now()}`,
      title: 'Test Gönderisi',
      slug: `test-gonderisi-${Date.now()}`,
      category: 'test',
      content: {
        meal: 'Test içerik',
        mealleri: 'Test mealleri',
        tefsir: 'Test tefsir',
        kisaTefsir: 'Test kısa tefsir',
      },
      createdAt: new Date().toISOString(),
      status: 'draft' as const,
    };
    
    const createdPost = await createPost(testPost);
    log.success(`Test gönderisi oluşturuldu: ${createdPost.id}`);
    
    // Test 4: Oluşturulan gönderiyi kontrol et
    log.info('4. Oluşturulan gönderiyi kontrol ediyor...');
    const allPostsAfter = await getAllPosts();
    const foundPost = allPostsAfter.find(p => p.id === testPost.id);
    
    if (foundPost) {
      log.success('Oluşturulan gönderi başarıyla bulundu!');
      log.info(`Gönderi başlığı: ${foundPost.title}`);
      log.info(`Gönderi durumu: ${foundPost.status || 'yok'}`);
    } else {
      log.error('Oluşturulan gönderi bulunamadı!');
      return false;
    }
    
    return true;
  } catch (error) {
    log.error(`Gönderiler testi başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    console.error(error);
    return false;
  }
}

async function testComments() {
  log.info('Yorumlar test ediliyor...');
  
  try {
    // Test 1: Yorumları getir
    log.info('1. Yorumları getiriyor...');
    const comments = await getComments();
    log.success(`Yorumlar başarıyla getirildi: ${comments.length} adet`);
    
    // Test 2: Yeni yorum oluştur
    log.info('2. Test yorumu oluşturuluyor...');
    const testComment = {
      id: `test-comment-${Date.now()}`,
      postId: 'test-post',
      author: 'Test Kullanıcı',
      text: 'Bu bir test yorumudur',
      createdAt: new Date().toISOString(),
    };
    
    const createdComment = await createComment(testComment);
    log.success(`Test yorumu oluşturuldu: ${createdComment.id}`);
    
    return true;
  } catch (error) {
    log.error(`Yorumlar testi başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    console.error(error);
    return false;
  }
}

async function testUsers() {
  log.info('Kullanıcılar test ediliyor...');
  
  try {
    // Test 1: Kullanıcıları getir
    log.info('1. Kullanıcıları getiriyor...');
    const users = await getUsers();
    log.success(`Kullanıcılar başarıyla getirildi: ${users.length} adet`);
    
    // Test 2: Yeni kullanıcı oluştur
    log.info('2. Test kullanıcısı oluşturuluyor...');
    const testUser = {
      id: `test-user-${Date.now()}`,
      name: 'Test Kullanıcı',
      email: `test-${Date.now()}@example.com`,
      role: 'user' as const,
      password: 'hashed-password',
      active: true,
      createdAt: new Date().toISOString(),
    };
    
    const createdUser = await createUser(testUser);
    log.success(`Test kullanıcısı oluşturuldu: ${createdUser.id}`);
    
    return true;
  } catch (error) {
    log.error(`Kullanıcılar testi başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    console.error(error);
    return false;
  }
}

async function testVisitorMessages() {
  log.info('Ziyaretçi Mesajları test ediliyor...');
  
  try {
    // Test 1: Ziyaretçi mesajlarını getir
    log.info('1. Ziyaretçi mesajlarını getiriyor...');
    const messages = await getVisitorMessages();
    log.success(`Ziyaretçi mesajları başarıyla getirildi: ${messages.length} adet`);
    
    // Test 2: Yeni mesaj oluştur
    log.info('2. Test mesajı oluşturuluyor...');
    const testMessage = {
      id: `test-message-${Date.now()}`,
      name: 'Test Kullanıcı',
      email: `test-${Date.now()}@example.com`,
      message: 'Bu bir test mesajıdır',
      createdAt: new Date().toISOString(),
    };
    
    const createdMessage = await createVisitorMessage(testMessage);
    log.success(`Test mesajı oluşturuldu: ${createdMessage.id}`);
    
    return true;
  } catch (error) {
    log.error(`Ziyaretçi mesajları testi başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    console.error(error);
    return false;
  }
}

async function testCustomMenus() {
  log.info('Özel Menüler test ediliyor...');
  
  try {
    // Test 1: Özel menüleri getir
    log.info('1. Özel menüleri getiriyor...');
    const menus = await getCustomMenus();
    log.success(`Özel menüler başarıyla getirildi: ${menus.length} adet`);
    
    // Test 2: Yeni menü oluştur
    log.info('2. Test menüsü oluşturuluyor...');
    const testMenu = {
      id: `test-menu-${Date.now()}`,
      label: 'Test Menü',
      url: '/test',
      order: 0,
      active: true,
    };
    
    const createdMenu = await createCustomMenu(testMenu);
    log.success(`Test menüsü oluşturuldu: ${createdMenu.id}`);
    
    return true;
  } catch (error) {
    log.error(`Özel menüler testi başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    console.error(error);
    return false;
  }
}

async function testCategorySettings() {
  log.info('Kategori Ayarları test ediliyor...');
  
  try {
    // Test 1: Kategori ayarlarını getir
    log.info('1. Kategori ayarlarını getiriyor...');
    const settings = await getCategorySettings();
    log.success(`Kategori ayarları başarıyla getirildi: ${settings.length} adet`);
    
    return true;
  } catch (error) {
    log.error(`Kategori ayarları testi başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    console.error(error);
    return false;
  }
}

async function testSocialLinks() {
  log.info('Sosyal Medya Linkleri test ediliyor...');
  
  try {
    // Test 1: Sosyal medya linklerini getir
    log.info('1. Sosyal medya linklerini getiriyor...');
    const links = await getSocialLinks();
    log.success(`Sosyal medya linkleri başarıyla getirildi: ${links.length} adet`);
    
    // Test 2: Yeni link oluştur
    log.info('2. Test linki oluşturuluyor...');
    const testLink = {
      name: `test-link-${Date.now()}`,
      url: 'https://example.com',
      color: '#000000',
      active: true,
    };
    
    const createdLink = await createSocialLink(testLink);
    log.success(`Test linki oluşturuldu: ${createdLink.name}`);
    
    return true;
  } catch (error) {
    log.error(`Sosyal medya linkleri testi başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    console.error(error);
    return false;
  }
}

async function testShareLinks() {
  log.info('Paylaşım Linkleri test ediliyor...');
  
  try {
    // Test 1: Paylaşım linklerini getir
    log.info('1. Paylaşım linklerini getiriyor...');
    const links = await getShareLinks();
    log.success(`Paylaşım linkleri başarıyla getirildi: ${links.length} adet`);
    
    return true;
  } catch (error) {
    log.error(`Paylaşım linkleri testi başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    console.error(error);
    return false;
  }
}

async function testNotes() {
  log.info('Notlar test ediliyor...');
  
  try {
    // Test 1: Notları getir
    log.info('1. Notları getiriyor...');
    const notes = await getNotes();
    log.success(`Notlar başarıyla getirildi: ${notes.length} adet`);
    
    // Test 2: Yeni not oluştur
    log.info('2. Test notu oluşturuluyor...');
    const testNote = {
      id: `test-note-${Date.now()}`,
      title: 'Test Notu',
      content: 'Bu bir test notudur',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const createdNote = await createNote(testNote);
    log.success(`Test notu oluşturuldu: ${createdNote.id}`);
    
    return true;
  } catch (error) {
    log.error(`Notlar testi başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    console.error(error);
    return false;
  }
}

async function main() {
  log.info('🚀 Firebase Actions Test Başlatılıyor...\n');
  
  // Check environment variables
  const hasFirebaseConfig = !!(
    process.env.FIREBASE_ADMIN_PRIVATE_KEY &&
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL
  );
  
  if (!hasFirebaseConfig) {
    log.error('Firebase environment variables eksik!');
    log.warn('Lütfen .env.local dosyasında şunları kontrol edin:');
    log.warn('  - FIREBASE_ADMIN_PRIVATE_KEY');
    log.warn('  - FIREBASE_PROJECT_ID');
    log.warn('  - FIREBASE_CLIENT_EMAIL');
    process.exit(1);
  }
  
  log.success('Firebase environment variables mevcut\n');
  
  // Run tests
  const results = {
    images: false,
    posts: false,
    comments: false,
    users: false,
    visitorMessages: false,
    customMenus: false,
    categorySettings: false,
    socialLinks: false,
    shareLinks: false,
    notes: false,
  };
  
  try {
    results.images = await testImages();
    log.info('\n' + '='.repeat(50) + '\n');
    results.posts = await testPosts();
    log.info('\n' + '='.repeat(50) + '\n');
    results.comments = await testComments();
    log.info('\n' + '='.repeat(50) + '\n');
    results.users = await testUsers();
    log.info('\n' + '='.repeat(50) + '\n');
    results.visitorMessages = await testVisitorMessages();
    log.info('\n' + '='.repeat(50) + '\n');
    results.customMenus = await testCustomMenus();
    log.info('\n' + '='.repeat(50) + '\n');
    results.categorySettings = await testCategorySettings();
    log.info('\n' + '='.repeat(50) + '\n');
    results.socialLinks = await testSocialLinks();
    log.info('\n' + '='.repeat(50) + '\n');
    results.shareLinks = await testShareLinks();
    log.info('\n' + '='.repeat(50) + '\n');
    results.notes = await testNotes();
  } catch (error) {
    log.error(`Test sırasında hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    console.error(error);
  }
  
  // Summary
  log.info('\n' + '='.repeat(50));
  log.info('📊 TEST SONUÇLARI:');
  log.info('='.repeat(50));
  log.info(`Görseller: ${results.images ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  log.info(`Gönderiler: ${results.posts ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  log.info(`Yorumlar: ${results.comments ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  log.info(`Kullanıcılar: ${results.users ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  log.info(`Ziyaretçi Mesajları: ${results.visitorMessages ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  log.info(`Özel Menüler: ${results.customMenus ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  log.info(`Kategori Ayarları: ${results.categorySettings ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  log.info(`Sosyal Medya Linkleri: ${results.socialLinks ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  log.info(`Paylaşım Linkleri: ${results.shareLinks ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  log.info(`Notlar: ${results.notes ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  log.info('='.repeat(50));
  
  const allPassed = Object.values(results).every(r => r === true);
  
  if (allPassed) {
    log.success('\n🎉 Tüm testler başarılı!');
    process.exit(0);
  } else {
    log.error('\n⚠️  Bazı testler başarısız oldu.');
    process.exit(1);
  }
}

main().catch((error) => {
  log.error(`Fatal error: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
  console.error(error);
  process.exit(1);
});


 * 
 * Bu script, Images ve Posts action fonksiyonlarının Firebase ile çalışıp çalışmadığını test eder.
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Load .env.local first, then .env
dotenv.config({ path: path.join(projectRoot, '.env.local') });
dotenv.config({ path: path.join(projectRoot, '.env') });

// Import Firebase helpers
import {
  getImages,
  getImageById,
  createImage,
  getPosts,
  createPost,
  getAllPosts,
  getComments,
  createComment,
  getUsers,
  createUser,
  getVisitorMessages,
  createVisitorMessage,
  getCustomMenus,
  createCustomMenu,
  getCategorySettings,
  getSocialLinks,
  createSocialLink,
  getShareLinks,
  getNotes,
  createNote,
} from '../src/lib/firestore';

const log = {
  info: (msg: string) => console.log(`ℹ️  ${msg}`),
  success: (msg: string) => console.log(`✅ ${msg}`),
  error: (msg: string) => console.error(`❌ ${msg}`),
  warn: (msg: string) => console.warn(`⚠️  ${msg}`),
};

async function testImages() {
  log.info('Görseller test ediliyor...');
  
  try {
    // Test 1: Görselleri getir
    log.info('1. Görselleri getiriyor...');
    const images = await getImages();
    log.success(`Görseller başarıyla getirildi: ${images.length} adet`);
    
    // Test 2: Yeni görsel oluştur (test için)
    log.info('2. Test görseli oluşturuluyor...');
    const testImage = {
      id: `test-${Date.now()}`,
      imageUrl: '/uploads/test-image.jpg',
      description: 'Test görseli',
      imageHint: 'test',
    };
    
    const createdImage = await createImage(testImage);
    log.success(`Test görseli oluşturuldu: ${createdImage.id}`);
    
    // Test 3: Oluşturulan görseli kontrol et (getImageById ile)
    log.info('3. Oluşturulan görseli kontrol ediyor (getImageById)...');
    const foundImageById = await getImageById(testImage.id);
    
    if (foundImageById) {
      log.success('Oluşturulan görsel başarıyla bulundu (getImageById)!');
      log.info(`Görsel ID: ${foundImageById.id}`);
      log.info(`Görsel URL: ${foundImageById.imageUrl}`);
    } else {
      log.error('Oluşturulan görsel getImageById ile bulunamadı!');
      return false;
    }
    
    // Test 4: getImages ile de kontrol et
    log.info('4. getImages ile görseli kontrol ediyor...');
    const allImages = await getImages();
    const foundImage = allImages.find(img => img.id === testImage.id);
    
    if (foundImage) {
      log.success('Oluşturulan görsel getImages ile de bulundu!');
    } else {
      log.warn('Oluşturulan görsel getImages ile bulunamadı (index sorunu olabilir)');
      log.info(`Toplam görsel sayısı: ${allImages.length}`);
    }
    
    return true;
  } catch (error) {
    log.error(`Görseller testi başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    console.error(error);
    return false;
  }
}

async function testPosts() {
  log.info('Gönderiler test ediliyor...');
  
  try {
    // Test 1: Gönderileri getir
    log.info('1. Gönderileri getiriyor...');
    const posts = await getPosts({ status: 'published' });
    log.success(`Gönderiler başarıyla getirildi: ${posts.length} adet (published)`);
    
    // Test 2: Tüm gönderileri getir
    log.info('2. Tüm gönderileri getiriyor...');
    const allPosts = await getAllPosts();
    log.success(`Tüm gönderiler başarıyla getirildi: ${allPosts.length} adet`);
    
    // Test 3: Yeni test gönderisi oluştur
    log.info('3. Test gönderisi oluşturuluyor...');
    const testPost = {
      id: `test-post-${Date.now()}`,
      title: 'Test Gönderisi',
      slug: `test-gonderisi-${Date.now()}`,
      category: 'test',
      content: {
        meal: 'Test içerik',
        mealleri: 'Test mealleri',
        tefsir: 'Test tefsir',
        kisaTefsir: 'Test kısa tefsir',
      },
      createdAt: new Date().toISOString(),
      status: 'draft' as const,
    };
    
    const createdPost = await createPost(testPost);
    log.success(`Test gönderisi oluşturuldu: ${createdPost.id}`);
    
    // Test 4: Oluşturulan gönderiyi kontrol et
    log.info('4. Oluşturulan gönderiyi kontrol ediyor...');
    const allPostsAfter = await getAllPosts();
    const foundPost = allPostsAfter.find(p => p.id === testPost.id);
    
    if (foundPost) {
      log.success('Oluşturulan gönderi başarıyla bulundu!');
      log.info(`Gönderi başlığı: ${foundPost.title}`);
      log.info(`Gönderi durumu: ${foundPost.status || 'yok'}`);
    } else {
      log.error('Oluşturulan gönderi bulunamadı!');
      return false;
    }
    
    return true;
  } catch (error) {
    log.error(`Gönderiler testi başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    console.error(error);
    return false;
  }
}

async function testComments() {
  log.info('Yorumlar test ediliyor...');
  
  try {
    // Test 1: Yorumları getir
    log.info('1. Yorumları getiriyor...');
    const comments = await getComments();
    log.success(`Yorumlar başarıyla getirildi: ${comments.length} adet`);
    
    // Test 2: Yeni yorum oluştur
    log.info('2. Test yorumu oluşturuluyor...');
    const testComment = {
      id: `test-comment-${Date.now()}`,
      postId: 'test-post',
      author: 'Test Kullanıcı',
      text: 'Bu bir test yorumudur',
      createdAt: new Date().toISOString(),
    };
    
    const createdComment = await createComment(testComment);
    log.success(`Test yorumu oluşturuldu: ${createdComment.id}`);
    
    return true;
  } catch (error) {
    log.error(`Yorumlar testi başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    console.error(error);
    return false;
  }
}

async function testUsers() {
  log.info('Kullanıcılar test ediliyor...');
  
  try {
    // Test 1: Kullanıcıları getir
    log.info('1. Kullanıcıları getiriyor...');
    const users = await getUsers();
    log.success(`Kullanıcılar başarıyla getirildi: ${users.length} adet`);
    
    // Test 2: Yeni kullanıcı oluştur
    log.info('2. Test kullanıcısı oluşturuluyor...');
    const testUser = {
      id: `test-user-${Date.now()}`,
      name: 'Test Kullanıcı',
      email: `test-${Date.now()}@example.com`,
      role: 'user' as const,
      password: 'hashed-password',
      active: true,
      createdAt: new Date().toISOString(),
    };
    
    const createdUser = await createUser(testUser);
    log.success(`Test kullanıcısı oluşturuldu: ${createdUser.id}`);
    
    return true;
  } catch (error) {
    log.error(`Kullanıcılar testi başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    console.error(error);
    return false;
  }
}

async function testVisitorMessages() {
  log.info('Ziyaretçi Mesajları test ediliyor...');
  
  try {
    // Test 1: Ziyaretçi mesajlarını getir
    log.info('1. Ziyaretçi mesajlarını getiriyor...');
    const messages = await getVisitorMessages();
    log.success(`Ziyaretçi mesajları başarıyla getirildi: ${messages.length} adet`);
    
    // Test 2: Yeni mesaj oluştur
    log.info('2. Test mesajı oluşturuluyor...');
    const testMessage = {
      id: `test-message-${Date.now()}`,
      name: 'Test Kullanıcı',
      email: `test-${Date.now()}@example.com`,
      message: 'Bu bir test mesajıdır',
      createdAt: new Date().toISOString(),
    };
    
    const createdMessage = await createVisitorMessage(testMessage);
    log.success(`Test mesajı oluşturuldu: ${createdMessage.id}`);
    
    return true;
  } catch (error) {
    log.error(`Ziyaretçi mesajları testi başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    console.error(error);
    return false;
  }
}

async function testCustomMenus() {
  log.info('Özel Menüler test ediliyor...');
  
  try {
    // Test 1: Özel menüleri getir
    log.info('1. Özel menüleri getiriyor...');
    const menus = await getCustomMenus();
    log.success(`Özel menüler başarıyla getirildi: ${menus.length} adet`);
    
    // Test 2: Yeni menü oluştur
    log.info('2. Test menüsü oluşturuluyor...');
    const testMenu = {
      id: `test-menu-${Date.now()}`,
      label: 'Test Menü',
      url: '/test',
      order: 0,
      active: true,
    };
    
    const createdMenu = await createCustomMenu(testMenu);
    log.success(`Test menüsü oluşturuldu: ${createdMenu.id}`);
    
    return true;
  } catch (error) {
    log.error(`Özel menüler testi başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    console.error(error);
    return false;
  }
}

async function testCategorySettings() {
  log.info('Kategori Ayarları test ediliyor...');
  
  try {
    // Test 1: Kategori ayarlarını getir
    log.info('1. Kategori ayarlarını getiriyor...');
    const settings = await getCategorySettings();
    log.success(`Kategori ayarları başarıyla getirildi: ${settings.length} adet`);
    
    return true;
  } catch (error) {
    log.error(`Kategori ayarları testi başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    console.error(error);
    return false;
  }
}

async function testSocialLinks() {
  log.info('Sosyal Medya Linkleri test ediliyor...');
  
  try {
    // Test 1: Sosyal medya linklerini getir
    log.info('1. Sosyal medya linklerini getiriyor...');
    const links = await getSocialLinks();
    log.success(`Sosyal medya linkleri başarıyla getirildi: ${links.length} adet`);
    
    // Test 2: Yeni link oluştur
    log.info('2. Test linki oluşturuluyor...');
    const testLink = {
      name: `test-link-${Date.now()}`,
      url: 'https://example.com',
      color: '#000000',
      active: true,
    };
    
    const createdLink = await createSocialLink(testLink);
    log.success(`Test linki oluşturuldu: ${createdLink.name}`);
    
    return true;
  } catch (error) {
    log.error(`Sosyal medya linkleri testi başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    console.error(error);
    return false;
  }
}

async function testShareLinks() {
  log.info('Paylaşım Linkleri test ediliyor...');
  
  try {
    // Test 1: Paylaşım linklerini getir
    log.info('1. Paylaşım linklerini getiriyor...');
    const links = await getShareLinks();
    log.success(`Paylaşım linkleri başarıyla getirildi: ${links.length} adet`);
    
    return true;
  } catch (error) {
    log.error(`Paylaşım linkleri testi başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    console.error(error);
    return false;
  }
}

async function testNotes() {
  log.info('Notlar test ediliyor...');
  
  try {
    // Test 1: Notları getir
    log.info('1. Notları getiriyor...');
    const notes = await getNotes();
    log.success(`Notlar başarıyla getirildi: ${notes.length} adet`);
    
    // Test 2: Yeni not oluştur
    log.info('2. Test notu oluşturuluyor...');
    const testNote = {
      id: `test-note-${Date.now()}`,
      title: 'Test Notu',
      content: 'Bu bir test notudur',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const createdNote = await createNote(testNote);
    log.success(`Test notu oluşturuldu: ${createdNote.id}`);
    
    return true;
  } catch (error) {
    log.error(`Notlar testi başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    console.error(error);
    return false;
  }
}

async function main() {
  log.info('🚀 Firebase Actions Test Başlatılıyor...\n');
  
  // Check environment variables
  const hasFirebaseConfig = !!(
    process.env.FIREBASE_ADMIN_PRIVATE_KEY &&
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL
  );
  
  if (!hasFirebaseConfig) {
    log.error('Firebase environment variables eksik!');
    log.warn('Lütfen .env.local dosyasında şunları kontrol edin:');
    log.warn('  - FIREBASE_ADMIN_PRIVATE_KEY');
    log.warn('  - FIREBASE_PROJECT_ID');
    log.warn('  - FIREBASE_CLIENT_EMAIL');
    process.exit(1);
  }
  
  log.success('Firebase environment variables mevcut\n');
  
  // Run tests
  const results = {
    images: false,
    posts: false,
    comments: false,
    users: false,
    visitorMessages: false,
    customMenus: false,
    categorySettings: false,
    socialLinks: false,
    shareLinks: false,
    notes: false,
  };
  
  try {
    results.images = await testImages();
    log.info('\n' + '='.repeat(50) + '\n');
    results.posts = await testPosts();
    log.info('\n' + '='.repeat(50) + '\n');
    results.comments = await testComments();
    log.info('\n' + '='.repeat(50) + '\n');
    results.users = await testUsers();
    log.info('\n' + '='.repeat(50) + '\n');
    results.visitorMessages = await testVisitorMessages();
    log.info('\n' + '='.repeat(50) + '\n');
    results.customMenus = await testCustomMenus();
    log.info('\n' + '='.repeat(50) + '\n');
    results.categorySettings = await testCategorySettings();
    log.info('\n' + '='.repeat(50) + '\n');
    results.socialLinks = await testSocialLinks();
    log.info('\n' + '='.repeat(50) + '\n');
    results.shareLinks = await testShareLinks();
    log.info('\n' + '='.repeat(50) + '\n');
    results.notes = await testNotes();
  } catch (error) {
    log.error(`Test sırasında hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    console.error(error);
  }
  
  // Summary
  log.info('\n' + '='.repeat(50));
  log.info('📊 TEST SONUÇLARI:');
  log.info('='.repeat(50));
  log.info(`Görseller: ${results.images ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  log.info(`Gönderiler: ${results.posts ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  log.info(`Yorumlar: ${results.comments ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  log.info(`Kullanıcılar: ${results.users ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  log.info(`Ziyaretçi Mesajları: ${results.visitorMessages ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  log.info(`Özel Menüler: ${results.customMenus ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  log.info(`Kategori Ayarları: ${results.categorySettings ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  log.info(`Sosyal Medya Linkleri: ${results.socialLinks ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  log.info(`Paylaşım Linkleri: ${results.shareLinks ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  log.info(`Notlar: ${results.notes ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
  log.info('='.repeat(50));
  
  const allPassed = Object.values(results).every(r => r === true);
  
  if (allPassed) {
    log.success('\n🎉 Tüm testler başarılı!');
    process.exit(0);
  } else {
    log.error('\n⚠️  Bazı testler başarısız oldu.');
    process.exit(1);
  }
}

main().catch((error) => {
  log.error(`Fatal error: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
  console.error(error);
  process.exit(1);
});

