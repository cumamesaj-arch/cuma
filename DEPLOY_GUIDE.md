# 🚀 Deploy İşlemi - Adım Adım Rehber

## 📋 Deploy Öncesi Hazırlıklar

### 1. Environment Variables Ayarlama (Firebase Studio Secrets Manager)

Firebase Studio'da projenizi açın ve Secrets Manager'a gidin:

1. Firebase Studio'da projenizi seçin: `cumamesajlari-6eeef`
2. Sol menüden "Secrets" veya "Environment Variables" seçin
3. Şu değişkenleri ekleyin:

#### Zorunlu Değişkenler:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cumamesajlari-6eeef.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cumamesajlari-6eeef
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cumamesajlari-6eeef.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Not:** Bu değerleri Firebase Console'dan alabilirsiniz:
- Firebase Console → Project Settings → Your apps → Web app config

#### Opsiyonel Değişkenler:
```
GOOGLE_GENAI_API_KEY=your_google_genai_api_key (AI özellikleri için)
OPENAI_API_KEY=your_openai_api_key (Görsel oluşturma için)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX (Google Analytics için)
NEXT_PUBLIC_SITE_URL=https://cumamesajlari-6eeef.web.app (Site URL'i)
```

### 2. Firebase Hosting'i Etkinleştirme

#### Yöntem A: Firebase Console'dan (Manuel)
1. Firebase Console'u açın: https://console.firebase.google.com/project/cumamesajlari-6eeef
2. Sol menüden "Hosting" seçin
3. "Get started" butonuna tıklayın
4. Kurulum adımlarını takip edin

#### Yöntem B: Firebase Studio'dan (Otomatik)
- Firebase Studio App Hosting kullanıyorsanız, `apphosting.yaml` dosyası zaten hazır
- Studio'da "Deploy" butonuna tıklayın

## 🚀 Deploy İşlemi

### Seçenek 1: Firebase Studio App Hosting (Önerilen)

1. Firebase Studio'da projenizi açın
2. "Deploy" veya "Publish" butonuna tıklayın
3. Build otomatik olarak başlayacak
4. Deploy tamamlandığında URL alacaksınız

### Seçenek 2: Firebase CLI ile Deploy

Terminal'de şu komutları çalıştırın:

```bash
# 1. Proje dizinine gidin
cd project

# 2. Production build alın
npm run build

# 3. Firebase'e deploy edin
firebase deploy --only hosting
```

### Seçenek 3: Firebase Console'dan Deploy

1. Firebase Console → Hosting
2. "Get started" ile Hosting'i etkinleştirin
3. Firebase CLI ile deploy yapın (Yukarıdaki Seçenek 2)

## ✅ Deploy Sonrası Kontroller

1. **Site URL'ini kontrol edin:**
   - Firebase Console → Hosting → Site URL
   - Genellikle: `https://cumamesajlari-6eeef.web.app`

2. **Sayfaları test edin:**
   - [ ] Ana sayfa açılıyor mu?
   - [ ] Admin paneli çalışıyor mu? (`/admin`)
   - [ ] API endpoint'leri çalışıyor mu? (`/api/homepage-sections`)
   - [ ] Görseller yükleniyor mu?

3. **Hata kontrolü:**
   - Tarayıcı konsolunu açın (F12)
   - Hata mesajlarını kontrol edin
   - Firebase Console → Hosting → Deploy history'yi kontrol edin

## 🔧 Sorun Giderme

### Build Hatası
```bash
# .next klasörünü temizle
cd project
Remove-Item -Recurse -Force .next
npm run build
```

### Environment Variables Hatası
- Firebase Studio Secrets Manager'da değişkenlerin doğru ayarlandığından emin olun
- Değişken isimlerinin doğru olduğunu kontrol edin (büyük/küçük harf duyarlı)

### Deploy Hatası
- Firebase CLI'nin güncel olduğundan emin olun: `npm install -g firebase-tools`
- Firebase'e login olduğunuzdan emin olun: `firebase login`
- Proje ID'sinin doğru olduğunu kontrol edin: `.firebaserc` dosyası

## 📝 Notlar

- İlk deploy işlemi 5-10 dakika sürebilir
- Sonraki deploy'lar daha hızlı olacaktır
- Environment variables değişiklikleri için yeniden deploy gerekebilir

