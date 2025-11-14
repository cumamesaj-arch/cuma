# Firebase Migration Plan - Detaylı Analiz ve Plan

## 📊 Mevcut Durum Analizi

### Veri Kaynakları

#### 1. **Posts (Gönderiler)**
- **Kaynak:** `src/lib/data.ts` - TypeScript dosyası içinde `POSTS: Post[]` array
- **Kullanım:** 20+ dosyada import ediliyor
- **CRUD İşlemleri:**
  - `createPostAction` - Yeni gönderi ekleme
  - `updatePostAction` - Gönderi güncelleme
  - `deletePostAction` - Gönderi silme (çöp kutusuna)
  - `restorePostAction` - Çöp kutusundan geri getirme
  - `permanentlyDeletePostAction` - Kalıcı silme
  - `updatePostOrderAction` - Sıralama güncelleme
  - `swapPostDatesAction` - Tarih değiştirme
  - `updatePostStatusAction` - Durum güncelleme (published/draft)
  - `getDeletedPostsAction` - Silinen gönderileri getirme
  - `emptyDeletedPostsAction` - Çöp kutusunu temizleme

#### 2. **Images (Görseller)**
- **Kaynak:** `src/lib/placeholder-images.json`
- **CRUD İşlemleri:**
  - `getPlaceholderImagesAction` - Görselleri getirme
  - `uploadPlaceholderFilesAction` - Dosya yükleme
  - `uploadImageAction` - Görsel ekleme
  - `deleteImageAction` - Görsel silme (çöp kutusuna)
  - `restoreImageAction` - Geri getirme
  - `permanentlyDeleteImageAction` - Kalıcı silme
  - `getDeletedImagesAction` - Silinen görselleri getirme
  - `emptyDeletedImagesAction` - Çöp kutusunu temizleme
  - `generateImageCaptionAction` - AI ile açıklama üretme

#### 3. **Comments (Yorumlar)**
- **Kaynak:** `src/lib/comments.json`
- **CRUD İşlemleri:**
  - `getCommentsAction` - Yorumları getirme
  - `addCommentAction` - Yorum ekleme
  - `updateCommentAction` - Yorum güncelleme
  - `deleteCommentAction` - Yorum silme

#### 4. **Visitor Messages (Ziyaretçi Mesajları)**
- **Kaynak:** `src/lib/visitor-messages.json`
- **CRUD İşlemleri:**
  - `getVisitorMessagesAction` - Mesajları getirme
  - `addVisitorMessageAction` - Mesaj ekleme
  - `deleteVisitorMessageAction` - Mesaj silme

#### 5. **Users (Kullanıcılar)**
- **Kaynak:** `src/lib/users.json`
- **CRUD İşlemleri:**
  - `getUsersAction` - Kullanıcıları getirme
  - `createUserAction` - Kullanıcı oluşturma
  - `updateUserAction` - Kullanıcı güncelleme
  - `deleteUserAction` - Kullanıcı silme
  - `loginAction` - Giriş yapma (şifre hash kontrolü)

#### 6. **Custom Menus (Özel Menüler)**
- **Kaynak:** `src/lib/custom-menus.json`
- **CRUD İşlemleri:**
  - `getCustomMenusAction` - Menüleri getirme
  - `createCustomMenuAction` - Menü oluşturma
  - `updateCustomMenuAction` - Menü güncelleme
  - `deleteCustomMenuAction` - Menü silme

#### 7. **Category Settings (Kategori Ayarları)**
- **Kaynak:** `src/lib/category-settings.json`
- **CRUD İşlemleri:**
  - `getCategorySettingsAction` - Ayarları getirme
  - `updateCategorySettingsAction` - Ayar güncelleme

#### 8. **Social Links (Sosyal Medya Linkleri)**
- **Kaynak:** `src/lib/social-links.json`
- **CRUD İşlemleri:**
  - `updateSocialLinksAction` - Linkleri güncelleme
  - `createSocialLinkAction` - Link ekleme
  - `deleteSocialLinkAction` - Link silme

#### 9. **Share Links (Paylaşım Linkleri)**
- **Kaynak:** `src/lib/share-links.json`
- **CRUD İşlemleri:**
  - `updateShareLinksAction` - Linkleri güncelleme
  - `createSharePlatformAction` - Platform ekleme
  - `deleteSharePlatformAction` - Platform silme

#### 10. **Homepage Sections (Ana Sayfa Bölümleri)**
- **Kaynak:** `src/lib/homepage-sections.json`
- **CRUD İşlemleri:**
  - `updateHomepageSectionsAction` - Bölümleri güncelleme
  - `getMenuGlobalConfigAction` - Global ayarları getirme
  - `updateMenuGlobalConfigAction` - Global ayarları güncelleme

#### 11. **Social Media APIs (Sosyal Medya API'leri)**
- **Kaynak:** `src/lib/social-media-apis.json`
- **CRUD İşlemleri:**
  - `getSocialMediaAPIsAction` - API'leri getirme
  - `createSocialMediaAPIAction` - API ekleme
  - `updateSocialMediaAPIAction` - API güncelleme
  - `deleteSocialMediaAPIAction` - API silme

#### 12. **Notes (Notlar)**
- **Kaynak:** `src/lib/notes.json`
- **CRUD İşlemleri:**
  - `getNotesAction` - Notları getirme
  - `createNoteAction` - Not oluşturma
  - `updateNoteAction` - Not güncelleme
  - `deleteNoteAction` - Not silme

#### 13. **Categories (Kategoriler)**
- **Kaynak:** `src/lib/data.ts` - `CATEGORIES: Category[]` array
- **CRUD İşlemleri:**
  - `createSubcategoryAction` - Alt kategori oluşturma
  - `updateSubcategoryAction` - Alt kategori güncelleme
  - `deleteCategoryAction` - Kategori silme
  - `deleteSubcategoryAction` - Alt kategori silme

#### 14. **Deleted Posts (Silinen Gönderiler)**
- **Kaynak:** `src/lib/deleted-posts.json`
- **Kullanım:** Çöp kutusu işlemleri için

#### 15. **Deleted Images (Silinen Görseller)**
- **Kaynak:** `src/lib/deleted-images.json`
- **Kullanım:** Çöp kutusu işlemleri için

---

## 🎯 Firebase Firestore Koleksiyon Yapısı

### Koleksiyonlar:

1. **`posts`** - Gönderiler
   - Document ID: `post.id`
   - Fields: Tüm Post interface alanları
   - Indexes: `category`, `status`, `createdAt`, `order`

2. **`images`** - Görseller
   - Document ID: `image.id`
   - Fields: `id`, `imageUrl`, `description`, `imageHint`
   - Indexes: `imageHint`

3. **`deletedPosts`** - Silinen gönderiler
   - Document ID: `post.id`
   - Fields: Post + `deletedAt`

4. **`deletedImages`** - Silinen görseller
   - Document ID: `image.id`
   - Fields: ImagePlaceholder + `deletedAt`

5. **`comments`** - Yorumlar
   - Document ID: `comment.id`
   - Fields: Comment interface alanları

6. **`visitorMessages`** - Ziyaretçi mesajları
   - Document ID: `message.id`
   - Fields: VisitorMessage interface alanları

7. **`users`** - Kullanıcılar
   - Document ID: `user.id`
   - Fields: User interface alanları (şifre hash'li)

8. **`customMenus`** - Özel menüler
   - Document ID: `menu.id`
   - Fields: CustomMenu interface alanları
   - Indexes: `order`

9. **`categorySettings`** - Kategori ayarları
   - Document ID: `categoryId`
   - Fields: CategorySettings interface alanları
   - Indexes: `order`

10. **`socialLinks`** - Sosyal medya linkleri
    - Document ID: `link.name` (unique)
    - Fields: SocialLink interface alanları

11. **`shareLinks`** - Paylaşım linkleri
    - Document ID: `platform.name` (unique)
    - Fields: SharePlatform interface alanları

12. **`homepageSections`** - Ana sayfa bölümleri
    - Document ID: `'main'` (tek doküman)
    - Fields: HomepageSections interface alanları

13. **`menuConfig`** - Menü global ayarları
    - Document ID: `'main'` (tek doküman)
    - Fields: MenuGlobalConfig interface alanları

14. **`socialMediaAPIs`** - Sosyal medya API'leri
    - Document ID: `api.platform` (unique)
    - Fields: SocialMediaAPI interface alanları

15. **`notes`** - Notlar
    - Document ID: `note.id`
    - Fields: Note interface alanları

16. **`categories`** - Kategoriler
    - Document ID: `category.id`
    - Fields: Category interface alanları
    - Subcollections: `subcategories` (alt kategoriler için)

---

## 📝 Yapılacak Değişiklikler

### A. Silinecek Dosyalar

1. **JSON Dosyaları:**
   - `src/lib/placeholder-images.json`
   - `src/lib/deleted-posts.json`
   - `src/lib/deleted-images.json`
   - `src/lib/comments.json`
   - `src/lib/visitor-messages.json`
   - `src/lib/users.json`
   - `src/lib/custom-menus.json`
   - `src/lib/category-settings.json`
   - `src/lib/social-links.json`
   - `src/lib/share-links.json`
   - `src/lib/homepage-sections.json`
   - `src/lib/menu-config.json`
   - `src/lib/social-media-apis.json`
   - `src/lib/notes.json`

2. **TypeScript Dosyaları:**
   - `src/lib/data.ts` - POSTS ve CATEGORIES array'leri kaldırılacak
   - `src/lib/placeholder-images-data.ts` - Artık gerekli değil

3. **Script Dosyaları (Opsiyonel - Migration sonrası):**
   - `scripts/import-posts.js` - Firebase'e uyarlanabilir veya silinebilir
   - `scripts/create-posts-from-uploads.js` - Firebase'e uyarlanabilir
   - `scripts/posts-from-media.js` - Firebase'e uyarlanabilir

### B. Güncellenecek Dosyalar

#### 1. **`src/lib/firebase-admin.ts`**
   - Firebase Admin SDK yapılandırması zaten var
   - Helper fonksiyonlar eklenecek (CRUD operations)

#### 2. **`src/lib/firebase.ts`**
   - Client-side Firebase yapılandırması zaten var
   - Helper fonksiyonlar eklenecek (read operations)

#### 3. **`src/app/actions.ts`** (2786 satır)
   - **Tüm 61 action fonksiyonu** Firebase kullanacak şekilde güncellenecek
   - Dosya okuma/yazma işlemleri Firestore işlemlerine dönüştürülecek

#### 4. **Veri Okuma Dosyaları (20+ dosya):**
   - `src/app/page.tsx` - POSTS import'u kaldırılacak
   - `src/app/[category]/page.tsx` - POSTS, CATEGORIES import'u kaldırılacak
   - `src/app/[category]/[slug]/page.tsx` - POSTS, CATEGORIES import'u kaldırılacak
   - `src/app/[category]/category-content.tsx` - POSTS, CATEGORIES import'u kaldırılacak
   - `src/app/[category]/[slug]/client-page.tsx` - CATEGORIES import'u kaldırılacak
   - `src/app/admin/page.tsx` - POSTS, CATEGORIES import'u kaldırılacak
   - `src/app/admin/posts/page.tsx` - POSTS, CATEGORIES import'u kaldırılacak
   - `src/app/admin/posts/new/page.tsx` - CATEGORIES import'u kaldırılacak
   - `src/app/admin/posts/[id]/edit/page.tsx` - POSTS import'u kaldırılacak
   - `src/app/admin/posts/[id]/edit/edit-client.tsx` - POSTS, CATEGORIES import'u kaldırılacak
   - `src/app/admin/media/page.tsx` - Görsel okuma işlemleri güncellenecek
   - `src/app/admin/homepage/page.tsx` - CATEGORIES import'u kaldırılacak
   - `src/app/admin/menus/page.tsx` - POSTS, CATEGORIES import'u kaldırılacak
   - `src/app/admin/analytics/page.tsx` - POSTS, CATEGORIES import'u kaldırılacak
   - `src/app/search/page.tsx` - POSTS, CATEGORIES import'u kaldırılacak
   - `src/app/sitemap.ts` - POSTS, CATEGORIES import'u kaldırılacak
   - `src/components/layout/Header.tsx` - CATEGORIES import'u kaldırılacak
   - `src/components/posts/PostCard.tsx` - CATEGORIES import'u kaldırılacak
   - `src/components/posts/PostCardList.tsx` - Güncelleme gerekebilir
   - `src/app/admin/homepage/CategoriesSection.tsx` - CATEGORIES import'u kaldırılacak

#### 5. **`src/lib/homepage-sections.ts`**
   - JSON dosyasından okuma yerine Firebase'den okuma yapılacak

#### 6. **`firestore.rules`**
   - Güvenlik kuralları güncellenecek (zaten hazır, sadece kontrol edilecek)

#### 7. **`firestore.indexes.json`**
   - Gerekli index'ler eklenecek

### C. Yeni Eklenecek Dosyalar

#### 1. **`src/lib/firestore/posts.ts`**
   - Posts CRUD helper fonksiyonları
   - `getPosts()`, `getPostById()`, `createPost()`, `updatePost()`, `deletePost()`, vb.

#### 2. **`src/lib/firestore/images.ts`**
   - Images CRUD helper fonksiyonları

#### 3. **`src/lib/firestore/comments.ts`**
   - Comments CRUD helper fonksiyonları

#### 4. **`src/lib/firestore/users.ts`**
   - Users CRUD helper fonksiyonları

#### 5. **`src/lib/firestore/categories.ts`**
   - Categories CRUD helper fonksiyonları

#### 6. **`src/lib/firestore/common.ts`**
   - Ortak helper fonksiyonlar (error handling, type conversions)

#### 7. **`src/lib/firestore/index.ts`**
   - Tüm firestore helper'ları export eden index dosyası

#### 8. **`scripts/migrate-to-firebase.ts`**
   - Mevcut JSON/TS dosyalarındaki verileri Firebase'e aktaran migration script

#### 9. **`src/lib/data-loader.ts`**
   - Client-side veri yükleme helper'ları (SSR/SSG için)

---

## 🔄 Migration Adımları

### Faz 1: Firebase Helper Fonksiyonları (Yeni Dosyalar)
1. ✅ Firebase yapılandırmasını kontrol et
2. ⏳ `src/lib/firestore/` klasörünü oluştur
3. ⏳ Helper fonksiyonlarını yaz (posts, images, comments, vb.)
4. ⏳ Test helper fonksiyonlarını yaz

### Faz 2: Actions Güncelleme
1. ⏳ Posts actions'ları güncelle
2. ⏳ Images actions'ları güncelle
3. ⏳ Comments actions'ları güncelle
4. ⏳ Users actions'ları güncelle
5. ⏳ Diğer tüm actions'ları güncelle

### Faz 3: Veri Okuma Güncelleme
1. ⏳ `src/lib/data.ts` yerine Firebase'den okuma fonksiyonları oluştur
2. ⏳ Tüm import'ları güncelle
3. ⏳ SSR/SSG için veri yükleme stratejisi belirle

### Faz 4: Migration Script
1. ⏳ Mevcut verileri Firebase'e aktaran script yaz
2. ⏳ Veri doğrulama ve test

### Faz 5: Temizlik
1. ⏳ Eski JSON dosyalarını sil
2. ⏳ Eski TypeScript dosyalarını temizle
3. ⏳ Kullanılmayan import'ları temizle

---

## ⚠️ Dikkat Edilmesi Gerekenler

1. **Performans:**
   - Firestore query'lerinde index'ler kullanılmalı
   - Pagination için `limit()` ve `startAfter()` kullanılmalı
   - Cache stratejisi belirlenmeli (Next.js cache + Firestore cache)

2. **Güvenlik:**
   - Firestore rules güncellenmeli
   - Admin işlemleri server-side'da yapılmalı
   - Client-side'da sadece okuma işlemleri yapılmalı

3. **Hata Yönetimi:**
   - Firebase hatalarını yakalama
   - Fallback mekanizmaları
   - Kullanıcı dostu hata mesajları

4. **Backward Compatibility:**
   - Migration sırasında eski sistem de çalışır durumda kalmalı
   - Aşamalı geçiş stratejisi

5. **Test:**
   - Her faz sonrası test edilmeli
   - Production'a geçmeden önce staging'de test

---

## 📊 İstatistikler

- **Toplam Action Fonksiyonu:** 61
- **Güncellenecek Dosya Sayısı:** 30+
- **Silinecek JSON Dosyası:** 14
- **Yeni Oluşturulacak Dosya:** 9+
- **Firestore Koleksiyon Sayısı:** 16

---

## ✅ Onay Bekleyen Adımlar

1. Bu planı onayla
2. Faz 1'i başlat (Helper fonksiyonları)
3. Her faz sonrası test ve onay
4. Production'a geçiş



## 📊 Mevcut Durum Analizi

### Veri Kaynakları

#### 1. **Posts (Gönderiler)**
- **Kaynak:** `src/lib/data.ts` - TypeScript dosyası içinde `POSTS: Post[]` array
- **Kullanım:** 20+ dosyada import ediliyor
- **CRUD İşlemleri:**
  - `createPostAction` - Yeni gönderi ekleme
  - `updatePostAction` - Gönderi güncelleme
  - `deletePostAction` - Gönderi silme (çöp kutusuna)
  - `restorePostAction` - Çöp kutusundan geri getirme
  - `permanentlyDeletePostAction` - Kalıcı silme
  - `updatePostOrderAction` - Sıralama güncelleme
  - `swapPostDatesAction` - Tarih değiştirme
  - `updatePostStatusAction` - Durum güncelleme (published/draft)
  - `getDeletedPostsAction` - Silinen gönderileri getirme
  - `emptyDeletedPostsAction` - Çöp kutusunu temizleme

#### 2. **Images (Görseller)**
- **Kaynak:** `src/lib/placeholder-images.json`
- **CRUD İşlemleri:**
  - `getPlaceholderImagesAction` - Görselleri getirme
  - `uploadPlaceholderFilesAction` - Dosya yükleme
  - `uploadImageAction` - Görsel ekleme
  - `deleteImageAction` - Görsel silme (çöp kutusuna)
  - `restoreImageAction` - Geri getirme
  - `permanentlyDeleteImageAction` - Kalıcı silme
  - `getDeletedImagesAction` - Silinen görselleri getirme
  - `emptyDeletedImagesAction` - Çöp kutusunu temizleme
  - `generateImageCaptionAction` - AI ile açıklama üretme

#### 3. **Comments (Yorumlar)**
- **Kaynak:** `src/lib/comments.json`
- **CRUD İşlemleri:**
  - `getCommentsAction` - Yorumları getirme
  - `addCommentAction` - Yorum ekleme
  - `updateCommentAction` - Yorum güncelleme
  - `deleteCommentAction` - Yorum silme

#### 4. **Visitor Messages (Ziyaretçi Mesajları)**
- **Kaynak:** `src/lib/visitor-messages.json`
- **CRUD İşlemleri:**
  - `getVisitorMessagesAction` - Mesajları getirme
  - `addVisitorMessageAction` - Mesaj ekleme
  - `deleteVisitorMessageAction` - Mesaj silme

#### 5. **Users (Kullanıcılar)**
- **Kaynak:** `src/lib/users.json`
- **CRUD İşlemleri:**
  - `getUsersAction` - Kullanıcıları getirme
  - `createUserAction` - Kullanıcı oluşturma
  - `updateUserAction` - Kullanıcı güncelleme
  - `deleteUserAction` - Kullanıcı silme
  - `loginAction` - Giriş yapma (şifre hash kontrolü)

#### 6. **Custom Menus (Özel Menüler)**
- **Kaynak:** `src/lib/custom-menus.json`
- **CRUD İşlemleri:**
  - `getCustomMenusAction` - Menüleri getirme
  - `createCustomMenuAction` - Menü oluşturma
  - `updateCustomMenuAction` - Menü güncelleme
  - `deleteCustomMenuAction` - Menü silme

#### 7. **Category Settings (Kategori Ayarları)**
- **Kaynak:** `src/lib/category-settings.json`
- **CRUD İşlemleri:**
  - `getCategorySettingsAction` - Ayarları getirme
  - `updateCategorySettingsAction` - Ayar güncelleme

#### 8. **Social Links (Sosyal Medya Linkleri)**
- **Kaynak:** `src/lib/social-links.json`
- **CRUD İşlemleri:**
  - `updateSocialLinksAction` - Linkleri güncelleme
  - `createSocialLinkAction` - Link ekleme
  - `deleteSocialLinkAction` - Link silme

#### 9. **Share Links (Paylaşım Linkleri)**
- **Kaynak:** `src/lib/share-links.json`
- **CRUD İşlemleri:**
  - `updateShareLinksAction` - Linkleri güncelleme
  - `createSharePlatformAction` - Platform ekleme
  - `deleteSharePlatformAction` - Platform silme

#### 10. **Homepage Sections (Ana Sayfa Bölümleri)**
- **Kaynak:** `src/lib/homepage-sections.json`
- **CRUD İşlemleri:**
  - `updateHomepageSectionsAction` - Bölümleri güncelleme
  - `getMenuGlobalConfigAction` - Global ayarları getirme
  - `updateMenuGlobalConfigAction` - Global ayarları güncelleme

#### 11. **Social Media APIs (Sosyal Medya API'leri)**
- **Kaynak:** `src/lib/social-media-apis.json`
- **CRUD İşlemleri:**
  - `getSocialMediaAPIsAction` - API'leri getirme
  - `createSocialMediaAPIAction` - API ekleme
  - `updateSocialMediaAPIAction` - API güncelleme
  - `deleteSocialMediaAPIAction` - API silme

#### 12. **Notes (Notlar)**
- **Kaynak:** `src/lib/notes.json`
- **CRUD İşlemleri:**
  - `getNotesAction` - Notları getirme
  - `createNoteAction` - Not oluşturma
  - `updateNoteAction` - Not güncelleme
  - `deleteNoteAction` - Not silme

#### 13. **Categories (Kategoriler)**
- **Kaynak:** `src/lib/data.ts` - `CATEGORIES: Category[]` array
- **CRUD İşlemleri:**
  - `createSubcategoryAction` - Alt kategori oluşturma
  - `updateSubcategoryAction` - Alt kategori güncelleme
  - `deleteCategoryAction` - Kategori silme
  - `deleteSubcategoryAction` - Alt kategori silme

#### 14. **Deleted Posts (Silinen Gönderiler)**
- **Kaynak:** `src/lib/deleted-posts.json`
- **Kullanım:** Çöp kutusu işlemleri için

#### 15. **Deleted Images (Silinen Görseller)**
- **Kaynak:** `src/lib/deleted-images.json`
- **Kullanım:** Çöp kutusu işlemleri için

---

## 🎯 Firebase Firestore Koleksiyon Yapısı

### Koleksiyonlar:

1. **`posts`** - Gönderiler
   - Document ID: `post.id`
   - Fields: Tüm Post interface alanları
   - Indexes: `category`, `status`, `createdAt`, `order`

2. **`images`** - Görseller
   - Document ID: `image.id`
   - Fields: `id`, `imageUrl`, `description`, `imageHint`
   - Indexes: `imageHint`

3. **`deletedPosts`** - Silinen gönderiler
   - Document ID: `post.id`
   - Fields: Post + `deletedAt`

4. **`deletedImages`** - Silinen görseller
   - Document ID: `image.id`
   - Fields: ImagePlaceholder + `deletedAt`

5. **`comments`** - Yorumlar
   - Document ID: `comment.id`
   - Fields: Comment interface alanları

6. **`visitorMessages`** - Ziyaretçi mesajları
   - Document ID: `message.id`
   - Fields: VisitorMessage interface alanları

7. **`users`** - Kullanıcılar
   - Document ID: `user.id`
   - Fields: User interface alanları (şifre hash'li)

8. **`customMenus`** - Özel menüler
   - Document ID: `menu.id`
   - Fields: CustomMenu interface alanları
   - Indexes: `order`

9. **`categorySettings`** - Kategori ayarları
   - Document ID: `categoryId`
   - Fields: CategorySettings interface alanları
   - Indexes: `order`

10. **`socialLinks`** - Sosyal medya linkleri
    - Document ID: `link.name` (unique)
    - Fields: SocialLink interface alanları

11. **`shareLinks`** - Paylaşım linkleri
    - Document ID: `platform.name` (unique)
    - Fields: SharePlatform interface alanları

12. **`homepageSections`** - Ana sayfa bölümleri
    - Document ID: `'main'` (tek doküman)
    - Fields: HomepageSections interface alanları

13. **`menuConfig`** - Menü global ayarları
    - Document ID: `'main'` (tek doküman)
    - Fields: MenuGlobalConfig interface alanları

14. **`socialMediaAPIs`** - Sosyal medya API'leri
    - Document ID: `api.platform` (unique)
    - Fields: SocialMediaAPI interface alanları

15. **`notes`** - Notlar
    - Document ID: `note.id`
    - Fields: Note interface alanları

16. **`categories`** - Kategoriler
    - Document ID: `category.id`
    - Fields: Category interface alanları
    - Subcollections: `subcategories` (alt kategoriler için)

---

## 📝 Yapılacak Değişiklikler

### A. Silinecek Dosyalar

1. **JSON Dosyaları:**
   - `src/lib/placeholder-images.json`
   - `src/lib/deleted-posts.json`
   - `src/lib/deleted-images.json`
   - `src/lib/comments.json`
   - `src/lib/visitor-messages.json`
   - `src/lib/users.json`
   - `src/lib/custom-menus.json`
   - `src/lib/category-settings.json`
   - `src/lib/social-links.json`
   - `src/lib/share-links.json`
   - `src/lib/homepage-sections.json`
   - `src/lib/menu-config.json`
   - `src/lib/social-media-apis.json`
   - `src/lib/notes.json`

2. **TypeScript Dosyaları:**
   - `src/lib/data.ts` - POSTS ve CATEGORIES array'leri kaldırılacak
   - `src/lib/placeholder-images-data.ts` - Artık gerekli değil

3. **Script Dosyaları (Opsiyonel - Migration sonrası):**
   - `scripts/import-posts.js` - Firebase'e uyarlanabilir veya silinebilir
   - `scripts/create-posts-from-uploads.js` - Firebase'e uyarlanabilir
   - `scripts/posts-from-media.js` - Firebase'e uyarlanabilir

### B. Güncellenecek Dosyalar

#### 1. **`src/lib/firebase-admin.ts`**
   - Firebase Admin SDK yapılandırması zaten var
   - Helper fonksiyonlar eklenecek (CRUD operations)

#### 2. **`src/lib/firebase.ts`**
   - Client-side Firebase yapılandırması zaten var
   - Helper fonksiyonlar eklenecek (read operations)

#### 3. **`src/app/actions.ts`** (2786 satır)
   - **Tüm 61 action fonksiyonu** Firebase kullanacak şekilde güncellenecek
   - Dosya okuma/yazma işlemleri Firestore işlemlerine dönüştürülecek

#### 4. **Veri Okuma Dosyaları (20+ dosya):**
   - `src/app/page.tsx` - POSTS import'u kaldırılacak
   - `src/app/[category]/page.tsx` - POSTS, CATEGORIES import'u kaldırılacak
   - `src/app/[category]/[slug]/page.tsx` - POSTS, CATEGORIES import'u kaldırılacak
   - `src/app/[category]/category-content.tsx` - POSTS, CATEGORIES import'u kaldırılacak
   - `src/app/[category]/[slug]/client-page.tsx` - CATEGORIES import'u kaldırılacak
   - `src/app/admin/page.tsx` - POSTS, CATEGORIES import'u kaldırılacak
   - `src/app/admin/posts/page.tsx` - POSTS, CATEGORIES import'u kaldırılacak
   - `src/app/admin/posts/new/page.tsx` - CATEGORIES import'u kaldırılacak
   - `src/app/admin/posts/[id]/edit/page.tsx` - POSTS import'u kaldırılacak
   - `src/app/admin/posts/[id]/edit/edit-client.tsx` - POSTS, CATEGORIES import'u kaldırılacak
   - `src/app/admin/media/page.tsx` - Görsel okuma işlemleri güncellenecek
   - `src/app/admin/homepage/page.tsx` - CATEGORIES import'u kaldırılacak
   - `src/app/admin/menus/page.tsx` - POSTS, CATEGORIES import'u kaldırılacak
   - `src/app/admin/analytics/page.tsx` - POSTS, CATEGORIES import'u kaldırılacak
   - `src/app/search/page.tsx` - POSTS, CATEGORIES import'u kaldırılacak
   - `src/app/sitemap.ts` - POSTS, CATEGORIES import'u kaldırılacak
   - `src/components/layout/Header.tsx` - CATEGORIES import'u kaldırılacak
   - `src/components/posts/PostCard.tsx` - CATEGORIES import'u kaldırılacak
   - `src/components/posts/PostCardList.tsx` - Güncelleme gerekebilir
   - `src/app/admin/homepage/CategoriesSection.tsx` - CATEGORIES import'u kaldırılacak

#### 5. **`src/lib/homepage-sections.ts`**
   - JSON dosyasından okuma yerine Firebase'den okuma yapılacak

#### 6. **`firestore.rules`**
   - Güvenlik kuralları güncellenecek (zaten hazır, sadece kontrol edilecek)

#### 7. **`firestore.indexes.json`**
   - Gerekli index'ler eklenecek

### C. Yeni Eklenecek Dosyalar

#### 1. **`src/lib/firestore/posts.ts`**
   - Posts CRUD helper fonksiyonları
   - `getPosts()`, `getPostById()`, `createPost()`, `updatePost()`, `deletePost()`, vb.

#### 2. **`src/lib/firestore/images.ts`**
   - Images CRUD helper fonksiyonları

#### 3. **`src/lib/firestore/comments.ts`**
   - Comments CRUD helper fonksiyonları

#### 4. **`src/lib/firestore/users.ts`**
   - Users CRUD helper fonksiyonları

#### 5. **`src/lib/firestore/categories.ts`**
   - Categories CRUD helper fonksiyonları

#### 6. **`src/lib/firestore/common.ts`**
   - Ortak helper fonksiyonlar (error handling, type conversions)

#### 7. **`src/lib/firestore/index.ts`**
   - Tüm firestore helper'ları export eden index dosyası

#### 8. **`scripts/migrate-to-firebase.ts`**
   - Mevcut JSON/TS dosyalarındaki verileri Firebase'e aktaran migration script

#### 9. **`src/lib/data-loader.ts`**
   - Client-side veri yükleme helper'ları (SSR/SSG için)

---

## 🔄 Migration Adımları

### Faz 1: Firebase Helper Fonksiyonları (Yeni Dosyalar)
1. ✅ Firebase yapılandırmasını kontrol et
2. ⏳ `src/lib/firestore/` klasörünü oluştur
3. ⏳ Helper fonksiyonlarını yaz (posts, images, comments, vb.)
4. ⏳ Test helper fonksiyonlarını yaz

### Faz 2: Actions Güncelleme
1. ⏳ Posts actions'ları güncelle
2. ⏳ Images actions'ları güncelle
3. ⏳ Comments actions'ları güncelle
4. ⏳ Users actions'ları güncelle
5. ⏳ Diğer tüm actions'ları güncelle

### Faz 3: Veri Okuma Güncelleme
1. ⏳ `src/lib/data.ts` yerine Firebase'den okuma fonksiyonları oluştur
2. ⏳ Tüm import'ları güncelle
3. ⏳ SSR/SSG için veri yükleme stratejisi belirle

### Faz 4: Migration Script
1. ⏳ Mevcut verileri Firebase'e aktaran script yaz
2. ⏳ Veri doğrulama ve test

### Faz 5: Temizlik
1. ⏳ Eski JSON dosyalarını sil
2. ⏳ Eski TypeScript dosyalarını temizle
3. ⏳ Kullanılmayan import'ları temizle

---

## ⚠️ Dikkat Edilmesi Gerekenler

1. **Performans:**
   - Firestore query'lerinde index'ler kullanılmalı
   - Pagination için `limit()` ve `startAfter()` kullanılmalı
   - Cache stratejisi belirlenmeli (Next.js cache + Firestore cache)

2. **Güvenlik:**
   - Firestore rules güncellenmeli
   - Admin işlemleri server-side'da yapılmalı
   - Client-side'da sadece okuma işlemleri yapılmalı

3. **Hata Yönetimi:**
   - Firebase hatalarını yakalama
   - Fallback mekanizmaları
   - Kullanıcı dostu hata mesajları

4. **Backward Compatibility:**
   - Migration sırasında eski sistem de çalışır durumda kalmalı
   - Aşamalı geçiş stratejisi

5. **Test:**
   - Her faz sonrası test edilmeli
   - Production'a geçmeden önce staging'de test

---

## 📊 İstatistikler

- **Toplam Action Fonksiyonu:** 61
- **Güncellenecek Dosya Sayısı:** 30+
- **Silinecek JSON Dosyası:** 14
- **Yeni Oluşturulacak Dosya:** 9+
- **Firestore Koleksiyon Sayısı:** 16

---

## ✅ Onay Bekleyen Adımlar

1. Bu planı onayla
2. Faz 1'i başlat (Helper fonksiyonları)
3. Her faz sonrası test ve onay
4. Production'a geçiş

