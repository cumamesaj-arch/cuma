/**
 * Firebase Helper Fonksiyonları Test Scripti
 * 
 * Bu script Firebase helper fonksiyonlarını test eder.
 * Çalıştırmak için: npm run test:firebase
 */

// Environment variables'ları yükle (.env.local dosyasından)
import { config } from 'dotenv';
import { resolve } from 'path';

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

// Debug: Yüklenen Firebase değişkenlerini göster (değerleri değil, sadece varlığını)
console.log('\n🔍 Yüklenen Firebase environment variables:');
console.log(`  FIREBASE_ADMIN_PRIVATE_KEY: ${process.env.FIREBASE_ADMIN_PRIVATE_KEY ? '✅ Var' : '❌ Yok'}`);
console.log(`  FIREBASE_PROJECT_ID: ${process.env.FIREBASE_PROJECT_ID ? '✅ Var' : '❌ Yok'}`);
console.log(`  NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Var' : '❌ Yok'}`);
console.log(`  FIREBASE_CLIENT_EMAIL: ${process.env.FIREBASE_CLIENT_EMAIL ? '✅ Var' : '❌ Yok'}`);
console.log('');

import { 
  getPosts, 
  getAllPosts, 
  createPost, 
  getPostById,
  getImages,
  createImage,
  getImageById,
  getComments,
  createComment,
  getCommentById,
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
  getVisitorMessageById,
  deleteVisitorMessage,
  getCustomMenus,
  createCustomMenu,
  getCustomMenuById,
  updateCustomMenu,
  deleteCustomMenu,
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  getCategorySettings,
  getCategorySetting,
  updateCategorySetting,
  getSocialLinks,
  createSocialLink,
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
  deleteSocialMediaAPI,
  getNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
} from '../src/lib/firestore';

// Test verileri
const testPost: any = {
  id: `test-post-${Date.now()}`,
  title: 'Test Gönderi',
  slug: 'test-gonderi',
  category: 'cuma-mesajlari',
  content: {
    meal: 'Test içerik',
    mealleri: '',
    tefsir: '',
    kisaTefsir: '',
  },
  createdAt: new Date().toISOString(),
  status: 'draft', // Test için draft olarak oluştur
};

const testImage: any = {
  id: `test-image-${Date.now()}`,
  description: 'Test Görsel',
  imageUrl: '/uploads/test-image.jpg',
  imageHint: 'test',
};

const testComment: any = {
  id: `test-comment-${Date.now()}`,
  author: 'Test Kullanıcı',
  text: 'Bu bir test yorumudur.',
  createdAt: new Date().toISOString(),
};

const testUser: any = {
  id: `test-user-${Date.now()}`,
  name: 'Test Kullanıcı',
  email: `test-${Date.now()}@example.com`,
  role: 'viewer' as const,
  active: true,
  createdAt: new Date().toISOString(),
  password: 'test-hash:test-salt', // Hash'li şifre (gerçek kullanımda bcrypt kullanılır)
};

const testVisitorMessage: any = {
  id: `test-message-${Date.now()}`,
  name: 'Test Ziyaretçi',
  email: `visitor-${Date.now()}@example.com`,
  message: 'Bu bir test mesajıdır.',
  createdAt: new Date().toISOString(),
};

const testCustomMenu: any = {
  id: `test-menu-${Date.now()}`,
  label: 'Test Menü',
  href: '/test',
  visible: true,
  order: 999,
};

const testCategory: any = {
  id: `test-category-${Date.now()}`,
  title: 'Test Kategori',
  slug: `test-kategori-${Date.now()}`,
  icon: 'Star', // String olarak
  order: 999,
};

const testNote: any = {
  id: `test-note-${Date.now()}`,
  title: 'Test Not',
  content: 'Bu bir test notudur.',
  date: new Date().toISOString().split('T')[0],
  isDone: false,
  isTodo: false,
  isImportant: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Renkli console log fonksiyonları
const log = {
  success: (msg: string) => console.log(`✅ ${msg}`),
  error: (msg: string) => console.error(`❌ ${msg}`),
  info: (msg: string) => console.log(`ℹ️  ${msg}`),
  warning: (msg: string) => console.warn(`⚠️  ${msg}`),
};

async function testFirebaseConnection() {
  log.info('Firebase bağlantısı test ediliyor...');
  
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
    log.info('\n.env.local dosyasında şu değişkenlerin olduğundan emin olun:');
    missingVars.forEach(varName => log.info(`  - ${varName}`));
    return false;
  }
  
  log.success('Tüm environment variables mevcut!');
  
  try {
    // Basit bir sorgu yaparak bağlantıyı test et
    await getAllPosts();
    log.success('Firebase bağlantısı başarılı!');
    return true;
  } catch (error) {
    log.error(`Firebase bağlantı hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    return false;
  }
}

async function testPosts() {
  log.info('\n📝 Posts Helper Testleri Başlıyor...\n');
  
  try {
    // Test 1: Tüm gönderileri getir
    log.info('Test 1: Tüm gönderileri getir (getAllPosts)');
    const allPosts = await getAllPosts();
    log.success(`Başarılı! ${allPosts.length} gönderi bulundu.`);
    
    // Test 2: Yeni gönderi oluştur
    log.info('\nTest 2: Yeni gönderi oluştur (createPost)');
    const createdPost = await createPost(testPost);
    log.success(`Başarılı! Gönderi oluşturuldu: ${createdPost.id}`);
    
    // Test 3: Oluşturulan gönderiyi getir
    log.info('\nTest 3: Gönderi getir (getPostById)');
    const retrievedPost = await getPostById(testPost.id);
    if (retrievedPost && retrievedPost.id === testPost.id) {
      log.success(`Başarılı! Gönderi bulundu: ${retrievedPost.title}`);
    } else {
      log.error('Gönderi bulunamadı!');
    }
    
    // Test 4: Filtreli gönderi getir
    log.info('\nTest 4: Filtreli gönderiler getir (getPosts with filters)');
    const filteredPosts = await getPosts({
      category: 'cuma-mesajlari',
      status: 'draft',
      limit: 5,
    });
    log.success(`Başarılı! ${filteredPosts.length} gönderi bulundu.`);
    
    log.success('\n✅ Tüm Posts testleri başarılı!');
    return true;
  } catch (error) {
    log.error(`Posts test hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    return false;
  }
}

async function testImages() {
  log.info('\n🖼️  Images Helper Testleri Başlıyor...\n');
  
  try {
    // Test 1: Tüm görselleri getir
    log.info('Test 1: Tüm görselleri getir (getImages)');
    const allImages = await getImages();
    log.success(`Başarılı! ${allImages.length} görsel bulundu.`);
    
    // Test 2: Yeni görsel oluştur
    log.info('\nTest 2: Yeni görsel oluştur (createImage)');
    const createdImage = await createImage(testImage);
    log.success(`Başarılı! Görsel oluşturuldu: ${createdImage.id}`);
    
    // Test 3: Oluşturulan görseli getir
    log.info('\nTest 3: Görsel getir (getImageById)');
    const retrievedImage = await getImageById(testImage.id);
    if (retrievedImage && retrievedImage.id === testImage.id) {
      log.success(`Başarılı! Görsel bulundu: ${retrievedImage.description}`);
    } else {
      log.error('Görsel bulunamadı!');
    }
    
    // Test 4: Filtreli görsel getir
    log.info('\nTest 4: Filtreli görseller getir (getImages with filters)');
    const filteredImages = await getImages({
      imageHint: 'test',
      limit: 5,
    });
    log.success(`Başarılı! ${filteredImages.length} görsel bulundu.`);
    
    log.success('\n✅ Tüm Images testleri başarılı!');
    return true;
  } catch (error) {
    log.error(`Images test hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    return false;
  }
}

async function testComments() {
  log.info('\n💬 Comments Helper Testleri Başlıyor...\n');
  
  try {
    // Test 1: Tüm yorumları getir
    log.info('Test 1: Tüm yorumları getir (getComments)');
    const allComments = await getComments();
    log.success(`Başarılı! ${allComments.length} yorum bulundu.`);
    
    // Test 2: Yeni yorum oluştur
    log.info('\nTest 2: Yeni yorum oluştur (createComment)');
    const createdComment = await createComment({
      author: testComment.author,
      text: testComment.text,
      createdAt: testComment.createdAt,
    });
    log.success(`Başarılı! Yorum oluşturuldu: ${createdComment.id}`);
    testComment.id = createdComment.id;
    
    // Test 3: Oluşturulan yorumu getir
    log.info('\nTest 3: Yorum getir (getCommentById)');
    const retrievedComment = await getCommentById(testComment.id);
    if (retrievedComment && retrievedComment.id === testComment.id) {
      const textPreview = retrievedComment.text ? retrievedComment.text.substring(0, 30) : 'Yorum metni yok';
      log.success(`Başarılı! Yorum bulundu: ${textPreview}...`);
    } else {
      log.error('Yorum bulunamadı!');
    }
    
    // Test 4: Yorum güncelle
    log.info('\nTest 4: Yorum güncelle (updateComment)');
    const updatedComment = await updateComment(testComment.id, {
      text: 'Güncellenmiş test yorumu',
    });
    log.success(`Başarılı! Yorum güncellendi: ${updatedComment.text}`);
    
    // Test 5: Yorum sil
    log.info('\nTest 5: Yorum sil (deleteComment)');
    await deleteComment(testComment.id);
    log.success('Başarılı! Yorum silindi.');
    
    log.success('\n✅ Tüm Comments testleri başarılı!');
    return true;
  } catch (error) {
    log.error(`Comments test hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    return false;
  }
}

async function testUsers() {
  log.info('\n👥 Users Helper Testleri Başlıyor...\n');
  
  try {
    // Test 1: Tüm kullanıcıları getir
    log.info('Test 1: Tüm kullanıcıları getir (getUsers)');
    const allUsers = await getUsers();
    log.success(`Başarılı! ${allUsers.length} kullanıcı bulundu.`);
    
    // Test 2: Yeni kullanıcı oluştur
    log.info('\nTest 2: Yeni kullanıcı oluştur (createUser)');
    const createdUser = await createUser({
      name: testUser.name,
      email: testUser.email,
      role: testUser.role,
      active: testUser.active,
      createdAt: testUser.createdAt,
      password: testUser.password,
    });
    log.success(`Başarılı! Kullanıcı oluşturuldu: ${createdUser.id}`);
    testUser.id = createdUser.id;
    
    // Test 3: ID ile kullanıcı getir
    log.info('\nTest 3: Kullanıcı getir (getUserById)');
    const retrievedUser = await getUserById(testUser.id);
    if (retrievedUser && retrievedUser.id === testUser.id) {
      const userName = retrievedUser.name || 'İsimsiz';
      log.success(`Başarılı! Kullanıcı bulundu: ${userName}`);
    } else {
      log.error('Kullanıcı bulunamadı!');
      return false;
    }
    
    // Test 4: Email ile kullanıcı getir
    log.info('\nTest 4: Email ile kullanıcı getir (getUserByEmail)');
    const userByEmail = await getUserByEmail(testUser.email, false);
    if (userByEmail && userByEmail.email === testUser.email) {
      log.success(`Başarılı! Kullanıcı bulundu: ${userByEmail.email}`);
    } else {
      log.error('Kullanıcı bulunamadı!');
      return false;
    }
    
    // Test 5: Kullanıcı güncelle
    log.info('\nTest 5: Kullanıcı güncelle (updateUser)');
    const updatedUser = await updateUser(testUser.id, {
      name: 'Güncellenmiş Test Kullanıcı',
    });
    log.success(`Başarılı! Kullanıcı güncellendi: ${updatedUser.name}`);
    
    // Test 6: Kullanıcı sil
    log.info('\nTest 6: Kullanıcı sil (deleteUser)');
    await deleteUser(testUser.id);
    log.success('Başarılı! Kullanıcı silindi.');
    
    log.success('\n✅ Tüm Users testleri başarılı!');
    return true;
  } catch (error) {
    log.error(`Users test hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    return false;
  }
}

async function testVisitorMessages() {
  log.info('\n📨 Visitor Messages Helper Testleri Başlıyor...\n');
  
  try {
    // Test 1: Tüm mesajları getir
    log.info('Test 1: Tüm mesajları getir (getVisitorMessages)');
    const allMessages = await getVisitorMessages();
    log.success(`Başarılı! ${allMessages.length} mesaj bulundu.`);
    
    // Test 2: Yeni mesaj oluştur
    log.info('\nTest 2: Yeni mesaj oluştur (createVisitorMessage)');
    const createdMessage = await createVisitorMessage({
      name: testVisitorMessage.name,
      email: testVisitorMessage.email,
      message: testVisitorMessage.message,
      createdAt: testVisitorMessage.createdAt,
    });
    log.success(`Başarılı! Mesaj oluşturuldu: ${createdMessage.id}`);
    testVisitorMessage.id = createdMessage.id;
    
    // Test 3: Oluşturulan mesajı getir
    log.info('\nTest 3: Mesaj getir (getVisitorMessageById)');
    const retrievedMessage = await getVisitorMessageById(testVisitorMessage.id);
    if (retrievedMessage && retrievedMessage.id === testVisitorMessage.id) {
      const messagePreview = retrievedMessage.message ? retrievedMessage.message.substring(0, 30) : 'Mesaj metni yok';
      log.success(`Başarılı! Mesaj bulundu: ${messagePreview}...`);
    } else {
      log.error('Mesaj bulunamadı!');
    }
    
    // Test 4: Mesaj sil
    log.info('\nTest 4: Mesaj sil (deleteVisitorMessage)');
    await deleteVisitorMessage(testVisitorMessage.id);
    log.success('Başarılı! Mesaj silindi.');
    
    log.success('\n✅ Tüm Visitor Messages testleri başarılı!');
    return true;
  } catch (error) {
    log.error(`Visitor Messages test hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    return false;
  }
}

async function testCustomMenus() {
  log.info('\n📋 Custom Menus Helper Testleri Başlıyor...\n');
  
  try {
    // Test 1: Tüm menüleri getir
    log.info('Test 1: Tüm menüleri getir (getCustomMenus)');
    const allMenus = await getCustomMenus();
    log.success(`Başarılı! ${allMenus.length} menü bulundu.`);
    
    // Test 2: Yeni menü oluştur
    log.info('\nTest 2: Yeni menü oluştur (createCustomMenu)');
    const createdMenu = await createCustomMenu({
      label: testCustomMenu.label,
      href: testCustomMenu.href,
      visible: testCustomMenu.visible,
      order: testCustomMenu.order,
    });
    log.success(`Başarılı! Menü oluşturuldu: ${createdMenu.id}`);
    testCustomMenu.id = createdMenu.id;
    
    // Test 3: Oluşturulan menüyü getir
    log.info('\nTest 3: Menü getir (getCustomMenuById)');
    const retrievedMenu = await getCustomMenuById(testCustomMenu.id);
    if (retrievedMenu && retrievedMenu.id === testCustomMenu.id) {
      const menuLabel = retrievedMenu.label || 'Etiketsiz';
      log.success(`Başarılı! Menü bulundu: ${menuLabel}`);
    } else {
      log.error('Menü bulunamadı!');
    }
    
    // Test 4: Menü güncelle
    log.info('\nTest 4: Menü güncelle (updateCustomMenu)');
    const updatedMenu = await updateCustomMenu(testCustomMenu.id, {
      label: 'Güncellenmiş Test Menü',
    });
    const updatedLabel = updatedMenu.label || 'Etiketsiz';
    log.success(`Başarılı! Menü güncellendi: ${updatedLabel}`);
    
    // Test 5: Menü sil
    log.info('\nTest 5: Menü sil (deleteCustomMenu)');
    await deleteCustomMenu(testCustomMenu.id);
    log.success('Başarılı! Menü silindi.');
    
    log.success('\n✅ Tüm Custom Menus testleri başarılı!');
    return true;
  } catch (error) {
    log.error(`Custom Menus test hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    return false;
  }
}

async function testCategories() {
  log.info('\n📁 Categories Helper Testleri Başlıyor...\n');
  
  try {
    // Test 1: Tüm kategorileri getir
    log.info('Test 1: Tüm kategorileri getir (getCategories)');
    const allCategories = await getCategories();
    log.success(`Başarılı! ${allCategories.length} kategori bulundu.`);
    
    // Test 2: Yeni kategori oluştur
    log.info('\nTest 2: Yeni kategori oluştur (createCategory)');
    const createdCategory = await createCategory({
      title: testCategory.title,
      slug: testCategory.slug,
      icon: testCategory.icon,
      order: testCategory.order,
    });
    log.success(`Başarılı! Kategori oluşturuldu: ${createdCategory.id}`);
    testCategory.id = createdCategory.id;
    
    // Test 3: ID ile kategori getir
    log.info('\nTest 3: Kategori getir (getCategoryById)');
    const retrievedCategory = await getCategoryById(testCategory.id);
    if (retrievedCategory && retrievedCategory.id === testCategory.id) {
      log.success(`Başarılı! Kategori bulundu: ${retrievedCategory.title}`);
    } else {
      log.error('Kategori bulunamadı!');
      return false;
    }
    
    // Test 4: Slug ile kategori getir
    log.info('\nTest 4: Slug ile kategori getir (getCategoryBySlug)');
    const categoryBySlug = await getCategoryBySlug(testCategory.slug);
    if (categoryBySlug && categoryBySlug.slug === testCategory.slug) {
      log.success(`Başarılı! Kategori bulundu: ${categoryBySlug.slug}`);
    } else {
      log.error('Kategori bulunamadı!');
      return false;
    }
    
    // Test 5: Alt kategori ekle
    log.info('\nTest 5: Alt kategori ekle (createSubcategory)');
    const createdSubcategory = await createSubcategory(testCategory.id, {
      title: 'Test Alt Kategori',
      slug: `test-alt-kategori-${Date.now()}`,
      icon: 'Hand',
    });
    log.success(`Başarılı! Alt kategori oluşturuldu: ${createdSubcategory.id}`);
    
    // Test 6: Alt kategori güncelle
    log.info('\nTest 6: Alt kategori güncelle (updateSubcategory)');
    const updatedSubcategory = await updateSubcategory(testCategory.id, createdSubcategory.id, {
      title: 'Güncellenmiş Alt Kategori',
    });
    log.success(`Başarılı! Alt kategori güncellendi: ${updatedSubcategory.title}`);
    
    // Test 7: Alt kategori sil
    log.info('\nTest 7: Alt kategori sil (deleteSubcategory)');
    await deleteSubcategory(testCategory.id, createdSubcategory.id);
    log.success('Başarılı! Alt kategori silindi.');
    
    // Test 8: Kategori sil
    log.info('\nTest 8: Kategori sil (deleteCategory)');
    await deleteCategory(testCategory.id);
    log.success('Başarılı! Kategori silindi.');
    
    log.success('\n✅ Tüm Categories testleri başarılı!');
    return true;
  } catch (error) {
    log.error(`Categories test hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    return false;
  }
}

async function testSettings() {
  log.info('\n⚙️  Settings Helper Testleri Başlıyor...\n');
  
  try {
    // Test 1: Category Settings
    log.info('Test 1: Category Settings getir (getCategorySettings)');
    const categorySettings = await getCategorySettings();
    log.success(`Başarılı! ${categorySettings.length} kategori ayarı bulundu.`);
    
    // Test 2: Social Links
    log.info('\nTest 2: Social Links getir (getSocialLinks)');
    const socialLinks = await getSocialLinks();
    log.success(`Başarılı! ${socialLinks.length} sosyal medya linki bulundu.`);
    
    // Test 3: Share Links
    log.info('\nTest 3: Share Links getir (getShareLinks)');
    const shareLinks = await getShareLinks();
    log.success(`Başarılı! ${shareLinks.length} paylaşım platformu bulundu.`);
    
    // Test 4: Homepage Sections
    log.info('\nTest 4: Homepage Sections getir (getHomepageSections)');
    const homepageSections = await getHomepageSections();
    if (homepageSections) {
      log.success('Başarılı! Ana sayfa bölümleri bulundu.');
    } else {
      log.info('Ana sayfa bölümleri henüz oluşturulmamış.');
    }
    
    // Test 5: Menu Config
    log.info('\nTest 5: Menu Config getir (getMenuConfig)');
    const menuConfig = await getMenuConfig();
    if (menuConfig) {
      log.success('Başarılı! Menü ayarları bulundu.');
    } else {
      log.info('Menü ayarları henüz oluşturulmamış.');
    }
    
    // Test 6: Social Media APIs
    log.info('\nTest 6: Social Media APIs getir (getSocialMediaAPIs)');
    const socialMediaAPIs = await getSocialMediaAPIs();
    log.success(`Başarılı! ${socialMediaAPIs.length} sosyal medya API'si bulundu.`);
    
    // Test 7: Notes
    log.info('\nTest 7: Notes getir (getNotes)');
    const notes = await getNotes();
    log.success(`Başarılı! ${notes.length} not bulundu.`);
    
    // Test 8: Note oluştur
    log.info('\nTest 8: Note oluştur (createNote)');
    const createdNote = await createNote({
      title: testNote.title,
      content: testNote.content,
      date: testNote.date,
      isDone: testNote.isDone,
      isTodo: testNote.isTodo,
      isImportant: testNote.isImportant,
      createdAt: testNote.createdAt,
      updatedAt: testNote.updatedAt,
    });
    log.success(`Başarılı! Not oluşturuldu: ${createdNote.id}`);
    testNote.id = createdNote.id;
    
    // Test 9: Note getir
    log.info('\nTest 9: Note getir (getNoteById)');
    const retrievedNote = await getNoteById(testNote.id);
    if (retrievedNote && retrievedNote.id === testNote.id) {
      log.success(`Başarılı! Not bulundu: ${retrievedNote.title}`);
    } else {
      log.error('Not bulunamadı!');
      return false;
    }
    
    // Test 10: Note güncelle
    log.info('\nTest 10: Note güncelle (updateNote)');
    const updatedNote = await updateNote(testNote.id, {
      title: 'Güncellenmiş Test Not',
    });
    log.success(`Başarılı! Not güncellendi: ${updatedNote.title}`);
    
    // Test 11: Note sil
    log.info('\nTest 11: Note sil (deleteNote)');
    await deleteNote(testNote.id);
    log.success('Başarılı! Not silindi.');
    
    log.success('\n✅ Tüm Settings testleri başarılı!');
    return true;
  } catch (error) {
    log.error(`Settings test hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    return false;
  }
}

async function cleanup() {
  log.info('\n🧹 Test verilerini temizleme...');
  try {
    // Test verilerini temizle (zaten test fonksiyonlarında siliniyor)
    log.warning('Test verileri temizlenmedi (manuel kontrol için bırakıldı)');
  } catch (error) {
    log.warning('Temizleme hatası (önemli değil)');
  }
}

async function main() {
  console.log('\n🚀 Firebase Helper Fonksiyonları Test Başlıyor...\n');
  console.log('=' .repeat(60));
  
  // Firebase bağlantısını test et
  const connectionOk = await testFirebaseConnection();
  if (!connectionOk) {
    log.error('\n❌ Firebase bağlantısı kurulamadı. Lütfen environment variables kontrol edin.');
    log.info('\nGerekli environment variables:');
    log.info('  - FIREBASE_ADMIN_PRIVATE_KEY');
    log.info('  - FIREBASE_PROJECT_ID');
    log.info('  - FIREBASE_CLIENT_EMAIL');
    process.exit(1);
  }
  
  // Posts testleri
  const postsOk = await testPosts();
  
  // Images testleri
  const imagesOk = await testImages();
  
  // Comments testleri
  const commentsOk = await testComments();
  
  // Users testleri
  const usersOk = await testUsers();
  
  // Visitor Messages testleri
  const messagesOk = await testVisitorMessages();
  
  // Custom Menus testleri
  const menusOk = await testCustomMenus();
  
  // Categories testleri
  const categoriesOk = await testCategories();
  
  // Settings testleri
  const settingsOk = await testSettings();
  
  // Temizlik
  await cleanup();
  
  // Sonuç
  console.log('\n' + '='.repeat(60));
  const allTestsOk = postsOk && imagesOk && commentsOk && usersOk && messagesOk && menusOk && categoriesOk && settingsOk;
  if (allTestsOk) {
    log.success('\n🎉 Tüm testler başarılı!');
    process.exit(0);
  } else {
    log.error('\n❌ Bazı testler başarısız oldu.');
    console.log('\nTest Sonuçları:');
    console.log(`  Posts: ${postsOk ? '✅' : '❌'}`);
    console.log(`  Images: ${imagesOk ? '✅' : '❌'}`);
    console.log(`  Comments: ${commentsOk ? '✅' : '❌'}`);
    console.log(`  Users: ${usersOk ? '✅' : '❌'}`);
    console.log(`  Visitor Messages: ${messagesOk ? '✅' : '❌'}`);
    console.log(`  Custom Menus: ${menusOk ? '✅' : '❌'}`);
    console.log(`  Categories: ${categoriesOk ? '✅' : '❌'}`);
    console.log(`  Settings: ${settingsOk ? '✅' : '❌'}`);
    process.exit(1);
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


 * 
 * Bu script Firebase helper fonksiyonlarını test eder.
 * Çalıştırmak için: npm run test:firebase
 */

// Environment variables'ları yükle (.env.local dosyasından)
import { config } from 'dotenv';
import { resolve } from 'path';

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

// Debug: Yüklenen Firebase değişkenlerini göster (değerleri değil, sadece varlığını)
console.log('\n🔍 Yüklenen Firebase environment variables:');
console.log(`  FIREBASE_ADMIN_PRIVATE_KEY: ${process.env.FIREBASE_ADMIN_PRIVATE_KEY ? '✅ Var' : '❌ Yok'}`);
console.log(`  FIREBASE_PROJECT_ID: ${process.env.FIREBASE_PROJECT_ID ? '✅ Var' : '❌ Yok'}`);
console.log(`  NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Var' : '❌ Yok'}`);
console.log(`  FIREBASE_CLIENT_EMAIL: ${process.env.FIREBASE_CLIENT_EMAIL ? '✅ Var' : '❌ Yok'}`);
console.log('');

import { 
  getPosts, 
  getAllPosts, 
  createPost, 
  getPostById,
  getImages,
  createImage,
  getImageById,
  getComments,
  createComment,
  getCommentById,
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
  getVisitorMessageById,
  deleteVisitorMessage,
  getCustomMenus,
  createCustomMenu,
  getCustomMenuById,
  updateCustomMenu,
  deleteCustomMenu,
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  getCategorySettings,
  getCategorySetting,
  updateCategorySetting,
  getSocialLinks,
  createSocialLink,
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
  deleteSocialMediaAPI,
  getNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
} from '../src/lib/firestore';

// Test verileri
const testPost: any = {
  id: `test-post-${Date.now()}`,
  title: 'Test Gönderi',
  slug: 'test-gonderi',
  category: 'cuma-mesajlari',
  content: {
    meal: 'Test içerik',
    mealleri: '',
    tefsir: '',
    kisaTefsir: '',
  },
  createdAt: new Date().toISOString(),
  status: 'draft', // Test için draft olarak oluştur
};

const testImage: any = {
  id: `test-image-${Date.now()}`,
  description: 'Test Görsel',
  imageUrl: '/uploads/test-image.jpg',
  imageHint: 'test',
};

const testComment: any = {
  id: `test-comment-${Date.now()}`,
  author: 'Test Kullanıcı',
  text: 'Bu bir test yorumudur.',
  createdAt: new Date().toISOString(),
};

const testUser: any = {
  id: `test-user-${Date.now()}`,
  name: 'Test Kullanıcı',
  email: `test-${Date.now()}@example.com`,
  role: 'viewer' as const,
  active: true,
  createdAt: new Date().toISOString(),
  password: 'test-hash:test-salt', // Hash'li şifre (gerçek kullanımda bcrypt kullanılır)
};

const testVisitorMessage: any = {
  id: `test-message-${Date.now()}`,
  name: 'Test Ziyaretçi',
  email: `visitor-${Date.now()}@example.com`,
  message: 'Bu bir test mesajıdır.',
  createdAt: new Date().toISOString(),
};

const testCustomMenu: any = {
  id: `test-menu-${Date.now()}`,
  label: 'Test Menü',
  href: '/test',
  visible: true,
  order: 999,
};

const testCategory: any = {
  id: `test-category-${Date.now()}`,
  title: 'Test Kategori',
  slug: `test-kategori-${Date.now()}`,
  icon: 'Star', // String olarak
  order: 999,
};

const testNote: any = {
  id: `test-note-${Date.now()}`,
  title: 'Test Not',
  content: 'Bu bir test notudur.',
  date: new Date().toISOString().split('T')[0],
  isDone: false,
  isTodo: false,
  isImportant: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Renkli console log fonksiyonları
const log = {
  success: (msg: string) => console.log(`✅ ${msg}`),
  error: (msg: string) => console.error(`❌ ${msg}`),
  info: (msg: string) => console.log(`ℹ️  ${msg}`),
  warning: (msg: string) => console.warn(`⚠️  ${msg}`),
};

async function testFirebaseConnection() {
  log.info('Firebase bağlantısı test ediliyor...');
  
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
    log.info('\n.env.local dosyasında şu değişkenlerin olduğundan emin olun:');
    missingVars.forEach(varName => log.info(`  - ${varName}`));
    return false;
  }
  
  log.success('Tüm environment variables mevcut!');
  
  try {
    // Basit bir sorgu yaparak bağlantıyı test et
    await getAllPosts();
    log.success('Firebase bağlantısı başarılı!');
    return true;
  } catch (error) {
    log.error(`Firebase bağlantı hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    return false;
  }
}

async function testPosts() {
  log.info('\n📝 Posts Helper Testleri Başlıyor...\n');
  
  try {
    // Test 1: Tüm gönderileri getir
    log.info('Test 1: Tüm gönderileri getir (getAllPosts)');
    const allPosts = await getAllPosts();
    log.success(`Başarılı! ${allPosts.length} gönderi bulundu.`);
    
    // Test 2: Yeni gönderi oluştur
    log.info('\nTest 2: Yeni gönderi oluştur (createPost)');
    const createdPost = await createPost(testPost);
    log.success(`Başarılı! Gönderi oluşturuldu: ${createdPost.id}`);
    
    // Test 3: Oluşturulan gönderiyi getir
    log.info('\nTest 3: Gönderi getir (getPostById)');
    const retrievedPost = await getPostById(testPost.id);
    if (retrievedPost && retrievedPost.id === testPost.id) {
      log.success(`Başarılı! Gönderi bulundu: ${retrievedPost.title}`);
    } else {
      log.error('Gönderi bulunamadı!');
    }
    
    // Test 4: Filtreli gönderi getir
    log.info('\nTest 4: Filtreli gönderiler getir (getPosts with filters)');
    const filteredPosts = await getPosts({
      category: 'cuma-mesajlari',
      status: 'draft',
      limit: 5,
    });
    log.success(`Başarılı! ${filteredPosts.length} gönderi bulundu.`);
    
    log.success('\n✅ Tüm Posts testleri başarılı!');
    return true;
  } catch (error) {
    log.error(`Posts test hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    return false;
  }
}

async function testImages() {
  log.info('\n🖼️  Images Helper Testleri Başlıyor...\n');
  
  try {
    // Test 1: Tüm görselleri getir
    log.info('Test 1: Tüm görselleri getir (getImages)');
    const allImages = await getImages();
    log.success(`Başarılı! ${allImages.length} görsel bulundu.`);
    
    // Test 2: Yeni görsel oluştur
    log.info('\nTest 2: Yeni görsel oluştur (createImage)');
    const createdImage = await createImage(testImage);
    log.success(`Başarılı! Görsel oluşturuldu: ${createdImage.id}`);
    
    // Test 3: Oluşturulan görseli getir
    log.info('\nTest 3: Görsel getir (getImageById)');
    const retrievedImage = await getImageById(testImage.id);
    if (retrievedImage && retrievedImage.id === testImage.id) {
      log.success(`Başarılı! Görsel bulundu: ${retrievedImage.description}`);
    } else {
      log.error('Görsel bulunamadı!');
    }
    
    // Test 4: Filtreli görsel getir
    log.info('\nTest 4: Filtreli görseller getir (getImages with filters)');
    const filteredImages = await getImages({
      imageHint: 'test',
      limit: 5,
    });
    log.success(`Başarılı! ${filteredImages.length} görsel bulundu.`);
    
    log.success('\n✅ Tüm Images testleri başarılı!');
    return true;
  } catch (error) {
    log.error(`Images test hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    return false;
  }
}

async function testComments() {
  log.info('\n💬 Comments Helper Testleri Başlıyor...\n');
  
  try {
    // Test 1: Tüm yorumları getir
    log.info('Test 1: Tüm yorumları getir (getComments)');
    const allComments = await getComments();
    log.success(`Başarılı! ${allComments.length} yorum bulundu.`);
    
    // Test 2: Yeni yorum oluştur
    log.info('\nTest 2: Yeni yorum oluştur (createComment)');
    const createdComment = await createComment({
      author: testComment.author,
      text: testComment.text,
      createdAt: testComment.createdAt,
    });
    log.success(`Başarılı! Yorum oluşturuldu: ${createdComment.id}`);
    testComment.id = createdComment.id;
    
    // Test 3: Oluşturulan yorumu getir
    log.info('\nTest 3: Yorum getir (getCommentById)');
    const retrievedComment = await getCommentById(testComment.id);
    if (retrievedComment && retrievedComment.id === testComment.id) {
      const textPreview = retrievedComment.text ? retrievedComment.text.substring(0, 30) : 'Yorum metni yok';
      log.success(`Başarılı! Yorum bulundu: ${textPreview}...`);
    } else {
      log.error('Yorum bulunamadı!');
    }
    
    // Test 4: Yorum güncelle
    log.info('\nTest 4: Yorum güncelle (updateComment)');
    const updatedComment = await updateComment(testComment.id, {
      text: 'Güncellenmiş test yorumu',
    });
    log.success(`Başarılı! Yorum güncellendi: ${updatedComment.text}`);
    
    // Test 5: Yorum sil
    log.info('\nTest 5: Yorum sil (deleteComment)');
    await deleteComment(testComment.id);
    log.success('Başarılı! Yorum silindi.');
    
    log.success('\n✅ Tüm Comments testleri başarılı!');
    return true;
  } catch (error) {
    log.error(`Comments test hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    return false;
  }
}

async function testUsers() {
  log.info('\n👥 Users Helper Testleri Başlıyor...\n');
  
  try {
    // Test 1: Tüm kullanıcıları getir
    log.info('Test 1: Tüm kullanıcıları getir (getUsers)');
    const allUsers = await getUsers();
    log.success(`Başarılı! ${allUsers.length} kullanıcı bulundu.`);
    
    // Test 2: Yeni kullanıcı oluştur
    log.info('\nTest 2: Yeni kullanıcı oluştur (createUser)');
    const createdUser = await createUser({
      name: testUser.name,
      email: testUser.email,
      role: testUser.role,
      active: testUser.active,
      createdAt: testUser.createdAt,
      password: testUser.password,
    });
    log.success(`Başarılı! Kullanıcı oluşturuldu: ${createdUser.id}`);
    testUser.id = createdUser.id;
    
    // Test 3: ID ile kullanıcı getir
    log.info('\nTest 3: Kullanıcı getir (getUserById)');
    const retrievedUser = await getUserById(testUser.id);
    if (retrievedUser && retrievedUser.id === testUser.id) {
      const userName = retrievedUser.name || 'İsimsiz';
      log.success(`Başarılı! Kullanıcı bulundu: ${userName}`);
    } else {
      log.error('Kullanıcı bulunamadı!');
      return false;
    }
    
    // Test 4: Email ile kullanıcı getir
    log.info('\nTest 4: Email ile kullanıcı getir (getUserByEmail)');
    const userByEmail = await getUserByEmail(testUser.email, false);
    if (userByEmail && userByEmail.email === testUser.email) {
      log.success(`Başarılı! Kullanıcı bulundu: ${userByEmail.email}`);
    } else {
      log.error('Kullanıcı bulunamadı!');
      return false;
    }
    
    // Test 5: Kullanıcı güncelle
    log.info('\nTest 5: Kullanıcı güncelle (updateUser)');
    const updatedUser = await updateUser(testUser.id, {
      name: 'Güncellenmiş Test Kullanıcı',
    });
    log.success(`Başarılı! Kullanıcı güncellendi: ${updatedUser.name}`);
    
    // Test 6: Kullanıcı sil
    log.info('\nTest 6: Kullanıcı sil (deleteUser)');
    await deleteUser(testUser.id);
    log.success('Başarılı! Kullanıcı silindi.');
    
    log.success('\n✅ Tüm Users testleri başarılı!');
    return true;
  } catch (error) {
    log.error(`Users test hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    return false;
  }
}

async function testVisitorMessages() {
  log.info('\n📨 Visitor Messages Helper Testleri Başlıyor...\n');
  
  try {
    // Test 1: Tüm mesajları getir
    log.info('Test 1: Tüm mesajları getir (getVisitorMessages)');
    const allMessages = await getVisitorMessages();
    log.success(`Başarılı! ${allMessages.length} mesaj bulundu.`);
    
    // Test 2: Yeni mesaj oluştur
    log.info('\nTest 2: Yeni mesaj oluştur (createVisitorMessage)');
    const createdMessage = await createVisitorMessage({
      name: testVisitorMessage.name,
      email: testVisitorMessage.email,
      message: testVisitorMessage.message,
      createdAt: testVisitorMessage.createdAt,
    });
    log.success(`Başarılı! Mesaj oluşturuldu: ${createdMessage.id}`);
    testVisitorMessage.id = createdMessage.id;
    
    // Test 3: Oluşturulan mesajı getir
    log.info('\nTest 3: Mesaj getir (getVisitorMessageById)');
    const retrievedMessage = await getVisitorMessageById(testVisitorMessage.id);
    if (retrievedMessage && retrievedMessage.id === testVisitorMessage.id) {
      const messagePreview = retrievedMessage.message ? retrievedMessage.message.substring(0, 30) : 'Mesaj metni yok';
      log.success(`Başarılı! Mesaj bulundu: ${messagePreview}...`);
    } else {
      log.error('Mesaj bulunamadı!');
    }
    
    // Test 4: Mesaj sil
    log.info('\nTest 4: Mesaj sil (deleteVisitorMessage)');
    await deleteVisitorMessage(testVisitorMessage.id);
    log.success('Başarılı! Mesaj silindi.');
    
    log.success('\n✅ Tüm Visitor Messages testleri başarılı!');
    return true;
  } catch (error) {
    log.error(`Visitor Messages test hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    return false;
  }
}

async function testCustomMenus() {
  log.info('\n📋 Custom Menus Helper Testleri Başlıyor...\n');
  
  try {
    // Test 1: Tüm menüleri getir
    log.info('Test 1: Tüm menüleri getir (getCustomMenus)');
    const allMenus = await getCustomMenus();
    log.success(`Başarılı! ${allMenus.length} menü bulundu.`);
    
    // Test 2: Yeni menü oluştur
    log.info('\nTest 2: Yeni menü oluştur (createCustomMenu)');
    const createdMenu = await createCustomMenu({
      label: testCustomMenu.label,
      href: testCustomMenu.href,
      visible: testCustomMenu.visible,
      order: testCustomMenu.order,
    });
    log.success(`Başarılı! Menü oluşturuldu: ${createdMenu.id}`);
    testCustomMenu.id = createdMenu.id;
    
    // Test 3: Oluşturulan menüyü getir
    log.info('\nTest 3: Menü getir (getCustomMenuById)');
    const retrievedMenu = await getCustomMenuById(testCustomMenu.id);
    if (retrievedMenu && retrievedMenu.id === testCustomMenu.id) {
      const menuLabel = retrievedMenu.label || 'Etiketsiz';
      log.success(`Başarılı! Menü bulundu: ${menuLabel}`);
    } else {
      log.error('Menü bulunamadı!');
    }
    
    // Test 4: Menü güncelle
    log.info('\nTest 4: Menü güncelle (updateCustomMenu)');
    const updatedMenu = await updateCustomMenu(testCustomMenu.id, {
      label: 'Güncellenmiş Test Menü',
    });
    const updatedLabel = updatedMenu.label || 'Etiketsiz';
    log.success(`Başarılı! Menü güncellendi: ${updatedLabel}`);
    
    // Test 5: Menü sil
    log.info('\nTest 5: Menü sil (deleteCustomMenu)');
    await deleteCustomMenu(testCustomMenu.id);
    log.success('Başarılı! Menü silindi.');
    
    log.success('\n✅ Tüm Custom Menus testleri başarılı!');
    return true;
  } catch (error) {
    log.error(`Custom Menus test hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    return false;
  }
}

async function testCategories() {
  log.info('\n📁 Categories Helper Testleri Başlıyor...\n');
  
  try {
    // Test 1: Tüm kategorileri getir
    log.info('Test 1: Tüm kategorileri getir (getCategories)');
    const allCategories = await getCategories();
    log.success(`Başarılı! ${allCategories.length} kategori bulundu.`);
    
    // Test 2: Yeni kategori oluştur
    log.info('\nTest 2: Yeni kategori oluştur (createCategory)');
    const createdCategory = await createCategory({
      title: testCategory.title,
      slug: testCategory.slug,
      icon: testCategory.icon,
      order: testCategory.order,
    });
    log.success(`Başarılı! Kategori oluşturuldu: ${createdCategory.id}`);
    testCategory.id = createdCategory.id;
    
    // Test 3: ID ile kategori getir
    log.info('\nTest 3: Kategori getir (getCategoryById)');
    const retrievedCategory = await getCategoryById(testCategory.id);
    if (retrievedCategory && retrievedCategory.id === testCategory.id) {
      log.success(`Başarılı! Kategori bulundu: ${retrievedCategory.title}`);
    } else {
      log.error('Kategori bulunamadı!');
      return false;
    }
    
    // Test 4: Slug ile kategori getir
    log.info('\nTest 4: Slug ile kategori getir (getCategoryBySlug)');
    const categoryBySlug = await getCategoryBySlug(testCategory.slug);
    if (categoryBySlug && categoryBySlug.slug === testCategory.slug) {
      log.success(`Başarılı! Kategori bulundu: ${categoryBySlug.slug}`);
    } else {
      log.error('Kategori bulunamadı!');
      return false;
    }
    
    // Test 5: Alt kategori ekle
    log.info('\nTest 5: Alt kategori ekle (createSubcategory)');
    const createdSubcategory = await createSubcategory(testCategory.id, {
      title: 'Test Alt Kategori',
      slug: `test-alt-kategori-${Date.now()}`,
      icon: 'Hand',
    });
    log.success(`Başarılı! Alt kategori oluşturuldu: ${createdSubcategory.id}`);
    
    // Test 6: Alt kategori güncelle
    log.info('\nTest 6: Alt kategori güncelle (updateSubcategory)');
    const updatedSubcategory = await updateSubcategory(testCategory.id, createdSubcategory.id, {
      title: 'Güncellenmiş Alt Kategori',
    });
    log.success(`Başarılı! Alt kategori güncellendi: ${updatedSubcategory.title}`);
    
    // Test 7: Alt kategori sil
    log.info('\nTest 7: Alt kategori sil (deleteSubcategory)');
    await deleteSubcategory(testCategory.id, createdSubcategory.id);
    log.success('Başarılı! Alt kategori silindi.');
    
    // Test 8: Kategori sil
    log.info('\nTest 8: Kategori sil (deleteCategory)');
    await deleteCategory(testCategory.id);
    log.success('Başarılı! Kategori silindi.');
    
    log.success('\n✅ Tüm Categories testleri başarılı!');
    return true;
  } catch (error) {
    log.error(`Categories test hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    return false;
  }
}

async function testSettings() {
  log.info('\n⚙️  Settings Helper Testleri Başlıyor...\n');
  
  try {
    // Test 1: Category Settings
    log.info('Test 1: Category Settings getir (getCategorySettings)');
    const categorySettings = await getCategorySettings();
    log.success(`Başarılı! ${categorySettings.length} kategori ayarı bulundu.`);
    
    // Test 2: Social Links
    log.info('\nTest 2: Social Links getir (getSocialLinks)');
    const socialLinks = await getSocialLinks();
    log.success(`Başarılı! ${socialLinks.length} sosyal medya linki bulundu.`);
    
    // Test 3: Share Links
    log.info('\nTest 3: Share Links getir (getShareLinks)');
    const shareLinks = await getShareLinks();
    log.success(`Başarılı! ${shareLinks.length} paylaşım platformu bulundu.`);
    
    // Test 4: Homepage Sections
    log.info('\nTest 4: Homepage Sections getir (getHomepageSections)');
    const homepageSections = await getHomepageSections();
    if (homepageSections) {
      log.success('Başarılı! Ana sayfa bölümleri bulundu.');
    } else {
      log.info('Ana sayfa bölümleri henüz oluşturulmamış.');
    }
    
    // Test 5: Menu Config
    log.info('\nTest 5: Menu Config getir (getMenuConfig)');
    const menuConfig = await getMenuConfig();
    if (menuConfig) {
      log.success('Başarılı! Menü ayarları bulundu.');
    } else {
      log.info('Menü ayarları henüz oluşturulmamış.');
    }
    
    // Test 6: Social Media APIs
    log.info('\nTest 6: Social Media APIs getir (getSocialMediaAPIs)');
    const socialMediaAPIs = await getSocialMediaAPIs();
    log.success(`Başarılı! ${socialMediaAPIs.length} sosyal medya API'si bulundu.`);
    
    // Test 7: Notes
    log.info('\nTest 7: Notes getir (getNotes)');
    const notes = await getNotes();
    log.success(`Başarılı! ${notes.length} not bulundu.`);
    
    // Test 8: Note oluştur
    log.info('\nTest 8: Note oluştur (createNote)');
    const createdNote = await createNote({
      title: testNote.title,
      content: testNote.content,
      date: testNote.date,
      isDone: testNote.isDone,
      isTodo: testNote.isTodo,
      isImportant: testNote.isImportant,
      createdAt: testNote.createdAt,
      updatedAt: testNote.updatedAt,
    });
    log.success(`Başarılı! Not oluşturuldu: ${createdNote.id}`);
    testNote.id = createdNote.id;
    
    // Test 9: Note getir
    log.info('\nTest 9: Note getir (getNoteById)');
    const retrievedNote = await getNoteById(testNote.id);
    if (retrievedNote && retrievedNote.id === testNote.id) {
      log.success(`Başarılı! Not bulundu: ${retrievedNote.title}`);
    } else {
      log.error('Not bulunamadı!');
      return false;
    }
    
    // Test 10: Note güncelle
    log.info('\nTest 10: Note güncelle (updateNote)');
    const updatedNote = await updateNote(testNote.id, {
      title: 'Güncellenmiş Test Not',
    });
    log.success(`Başarılı! Not güncellendi: ${updatedNote.title}`);
    
    // Test 11: Note sil
    log.info('\nTest 11: Note sil (deleteNote)');
    await deleteNote(testNote.id);
    log.success('Başarılı! Not silindi.');
    
    log.success('\n✅ Tüm Settings testleri başarılı!');
    return true;
  } catch (error) {
    log.error(`Settings test hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    return false;
  }
}

async function cleanup() {
  log.info('\n🧹 Test verilerini temizleme...');
  try {
    // Test verilerini temizle (zaten test fonksiyonlarında siliniyor)
    log.warning('Test verileri temizlenmedi (manuel kontrol için bırakıldı)');
  } catch (error) {
    log.warning('Temizleme hatası (önemli değil)');
  }
}

async function main() {
  console.log('\n🚀 Firebase Helper Fonksiyonları Test Başlıyor...\n');
  console.log('=' .repeat(60));
  
  // Firebase bağlantısını test et
  const connectionOk = await testFirebaseConnection();
  if (!connectionOk) {
    log.error('\n❌ Firebase bağlantısı kurulamadı. Lütfen environment variables kontrol edin.');
    log.info('\nGerekli environment variables:');
    log.info('  - FIREBASE_ADMIN_PRIVATE_KEY');
    log.info('  - FIREBASE_PROJECT_ID');
    log.info('  - FIREBASE_CLIENT_EMAIL');
    process.exit(1);
  }
  
  // Posts testleri
  const postsOk = await testPosts();
  
  // Images testleri
  const imagesOk = await testImages();
  
  // Comments testleri
  const commentsOk = await testComments();
  
  // Users testleri
  const usersOk = await testUsers();
  
  // Visitor Messages testleri
  const messagesOk = await testVisitorMessages();
  
  // Custom Menus testleri
  const menusOk = await testCustomMenus();
  
  // Categories testleri
  const categoriesOk = await testCategories();
  
  // Settings testleri
  const settingsOk = await testSettings();
  
  // Temizlik
  await cleanup();
  
  // Sonuç
  console.log('\n' + '='.repeat(60));
  const allTestsOk = postsOk && imagesOk && commentsOk && usersOk && messagesOk && menusOk && categoriesOk && settingsOk;
  if (allTestsOk) {
    log.success('\n🎉 Tüm testler başarılı!');
    process.exit(0);
  } else {
    log.error('\n❌ Bazı testler başarısız oldu.');
    console.log('\nTest Sonuçları:');
    console.log(`  Posts: ${postsOk ? '✅' : '❌'}`);
    console.log(`  Images: ${imagesOk ? '✅' : '❌'}`);
    console.log(`  Comments: ${commentsOk ? '✅' : '❌'}`);
    console.log(`  Users: ${usersOk ? '✅' : '❌'}`);
    console.log(`  Visitor Messages: ${messagesOk ? '✅' : '❌'}`);
    console.log(`  Custom Menus: ${menusOk ? '✅' : '❌'}`);
    console.log(`  Categories: ${categoriesOk ? '✅' : '❌'}`);
    console.log(`  Settings: ${settingsOk ? '✅' : '❌'}`);
    process.exit(1);
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

