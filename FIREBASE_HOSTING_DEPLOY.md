# 🚀 Firebase Hosting ile Canlıya Alma Rehberi

## 📋 Genel Bakış

Bu rehber, Next.js projenizi Firebase Hosting kullanarak canlıya almanız için adım adım talimatlar içerir.

**Proje ID**: `cuma-mesajlari-dfc6c`  
**Firebase Console**: https://console.firebase.google.com/project/cuma-mesajlari-dfc6c

## ⚠️ ÖNEMLİ NOTLAR

### Static Export Sınırlamaları

Projeniz **static export** modunda yapılandırılmıştır. Bu şu anlama gelir:

- ✅ **Çalışan Özellikler**:
  - Tüm statik sayfalar
  - Client-side rendering
  - Firebase Client SDK (Firestore, Auth, Storage)
  - Static generation (SSG)

- ❌ **Çalışmayan Özellikler**:
  - API Routes (`/api/*`) - Server-side API endpoint'leri çalışmaz
  - Server-side rendering (SSR)
  - Server Actions
  - Dynamic routes server-side rendering

**Not**: Projenizde `/api/homepage-sections` ve `/api/social-links` endpoint'leri var. Bu endpoint'ler static export'ta çalışmayacaktır. Bu verileri client-side'da Firebase'den çekmeniz gerekir.

## ✅ Ön Hazırlık

### 1. Firebase CLI Kurulumu

Firebase CLI'nin kurulu olduğundan emin olun:

```bash
npm install -g firebase-tools
```

Kurulu değilse yukarıdaki komutu çalıştırın.

### 2. Firebase'e Giriş Yapın

```bash
firebase login
```

Tarayıcı açılacak ve Google hesabınızla giriş yapmanız istenecek.

### 3. Firebase Projesini Bağlayın

```bash
cd project
firebase use cuma-mesajlari-dfc6c
```

Eğer proje bağlı değilse:

```bash
firebase init hosting
```

ve projeyi seçin: `cuma-mesajlari-dfc6c`

### 4. Gerekli Servislerin Aktif Olduğundan Emin Olun

Firebase Console'da aşağıdaki servislerin aktif olduğunu kontrol edin:

- ✅ **Firestore Database** - Veritabanı
- ✅ **Storage** - Dosya depolama
- ✅ **Authentication** - Kullanıcı kimlik doğrulama
- ✅ **Hosting** - Web hosting

## 🔧 Adım 1: Environment Variables Kontrolü

Firebase Hosting static export kullandığı için, tüm environment variables **build zamanında** kullanılabilir olmalıdır.

### Yerel `.env.local` Dosyası

Proje kök dizininde `.env.local` dosyası oluşturun (varsa kontrol edin):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cuma-mesajlari-dfc6c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cuma-mesajlari-dfc6c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cuma-mesajlari-dfc6c.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Not**: Bu değerleri Firebase Console → Project Settings → Your apps → Web app bölümünden alabilirsiniz.

### Environment Variables'ı Kontrol Edin

```bash
# .env.local dosyasının var olduğundan emin olun
ls -la .env.local
```

## 🔧 Adım 2: Projeyi Build Edin

Static export için projeyi build edin:

```bash
npm run build
```

Bu komut:
1. Next.js projesini build eder
2. Static export yapar
3. Çıktıyı `out` klasörüne kaydeder

**Kontrol**: Build başarılı olduysa `out` klasörü oluşmuş olmalı:

```bash
ls -la out
```

## 🔧 Adım 3: Build Çıktısını Kontrol Edin

Build çıktısını kontrol edin:

```bash
# out klasörünün içeriğini kontrol edin
ls -la out/

# index.html dosyasının var olduğundan emin olun
ls -la out/index.html
```

## 🔧 Adım 4: Firebase Hosting'e Deploy Edin

### Yöntem 1: Tek Komutla (Önerilen)

```bash
npm run build:hosting
```

Bu komut:
1. Projeyi build eder
2. Firebase Hosting'e deploy eder

### Yöntem 2: Adım Adım

```bash
# 1. Build edin
npm run build

# 2. Sadece hosting'e deploy edin
npm run firebase:deploy:hosting
```

veya

```bash
firebase deploy --only hosting
```

## 🔧 Adım 5: Deploy İşlemini Takip Edin

Deploy işlemi sırasında:

1. **Firebase CLI çıktısını izleyin**:
   - Build dosyaları yüklenir
   - Deploy URL'i gösterilir

2. **Deploy tamamlandığında**:
   ```
   ✔  Deploy complete!

   Project Console: https://console.firebase.google.com/project/cuma-mesajlari-dfc6c/overview
   Hosting URL: https://cuma-mesajlari-dfc6c.web.app
   ```

3. **Hosting URL'ini kopyalayın** ve tarayıcıda açın

## 🔧 Adım 6: Siteyi Test Edin

Deploy tamamlandıktan sonra:

1. **Ana sayfayı test edin**:
   - https://cuma-mesajlari-dfc6c.web.app
   - Veya https://cuma-mesajlari-dfc6c.firebaseapp.com

2. **Tüm sayfaları test edin**:
   - ✅ Ana sayfa
   - ✅ Kategori sayfaları
   - ✅ Post sayfaları
   - ✅ Admin paneli (eğer erişilebilirse)

3. **Firebase servislerini test edin**:
   - ✅ Firestore Database bağlantısı
   - ✅ Storage bağlantısı
   - ✅ Authentication

## 🔄 Güncellemeler ve Yeni Deploy

### Yeni Deploy Yapmak

1. **Değişiklikleri yapın**

2. **Build ve deploy edin**:
   ```bash
   npm run build:hosting
   ```

veya

```bash
npm run build
npm run firebase:deploy:hosting
```

### Hızlı Deploy

Sadece hosting'e deploy etmek için:

```bash
npm run firebase:deploy:hosting
```

## 📝 Firebase Hosting Yapılandırması

### firebase.json

```json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "cleanUrls": true,
    "trailingSlash": false,
    "headers": [
      {
        "source": "**/*.@(js|css|jpg|jpeg|gif|png|svg|webp|ico|woff|woff2|ttf|eot)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

### next.config.ts

```typescript
const nextConfig: NextConfig = {
  output: 'export', // Static export için
  images: {
    unoptimized: true, // Static export için gerekli
  },
  // ...
};
```

## 🐛 Sorun Giderme

### Build Hatası

**Sorun**: `npm run build` başarısız oluyor

**Çözüm**:
1. Node modules'ü temizleyin:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Build hatalarını kontrol edin:
   ```bash
   npm run build
   ```

3. TypeScript hatalarını kontrol edin:
   ```bash
   npm run typecheck
   ```

### Deploy Hatası

**Sorun**: `firebase deploy` başarısız oluyor

**Çözüm**:
1. Firebase'e giriş yaptığınızdan emin olun:
   ```bash
   firebase login
   ```

2. Projeyi kontrol edin:
   ```bash
   firebase use cuma-mesajlari-dfc6c
   ```

3. Firebase CLI'yi güncelleyin:
   ```bash
   npm install -g firebase-tools@latest
   ```

### 404 Hatası

**Sorun**: Sayfalar 404 hatası veriyor

**Çözüm**:
1. `out` klasörünün doğru build edildiğinden emin olun
2. `firebase.json` dosyasındaki `rewrites` yapılandırmasını kontrol edin
3. Next.js routing yapılandırmasını kontrol edin

### Environment Variables Çalışmıyor

**Sorun**: Firebase bağlantı bilgileri çalışmıyor

**Çözüm**:
1. `.env.local` dosyasının var olduğundan emin olun
2. `NEXT_PUBLIC_` prefix'inin olduğundan emin olun
3. Build'i yeniden yapın:
   ```bash
   npm run build
   ```

### API Routes Çalışmıyor

**Sorun**: `/api/*` endpoint'leri çalışmıyor

**Açıklama**: Bu **normal** bir durumdur. Static export'ta API routes çalışmaz.

**Çözüm**:
1. API endpoint'lerini client-side'da Firebase'den çekin
2. Veya Cloud Functions kullanın (daha gelişmiş yapılandırma gerektirir)

## 🎯 Hızlı Başlangıç Checklist

- [ ] Firebase CLI kurulu (`firebase --version`)
- [ ] Firebase'e giriş yapıldı (`firebase login`)
- [ ] Proje bağlandı (`firebase use cuma-mesajlari-dfc6c`)
- [ ] `.env.local` dosyası oluşturuldu ve dolduruldu
- [ ] Proje build edildi (`npm run build`)
- [ ] `out` klasörü oluştu
- [ ] Deploy yapıldı (`npm run build:hosting`)
- [ ] Site test edildi

## 📞 Destek ve Kaynaklar

### Firebase Hosting Dokümantasyonu

- **Firebase Hosting**: https://firebase.google.com/docs/hosting
- **Next.js Static Export**: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- **Firebase CLI**: https://firebase.google.com/docs/cli

### Yardım

Sorun yaşarsanız:

1. Build loglarını kontrol edin: `npm run build`
2. Deploy loglarını kontrol edin: `firebase deploy --only hosting`
3. Firebase Console'da Hosting bölümünü kontrol edin
4. Firebase Hosting dokümantasyonuna bakın

## 📝 Notlar

- Firebase Hosting **ücretsiz** tier'da çalışır
- Custom domain ekleyebilirsiniz (Firebase Console → Hosting → Add custom domain)
- SSL sertifikası otomatik olarak sağlanır
- CDN otomatik olarak etkinleştirilir
- Static export için API routes çalışmaz
- Server-side rendering çalışmaz
- Tüm veriler client-side'da Firebase'den çekilmelidir

---

**Son Güncelleme**: 2024  
**Proje**: cuma-mesajlari-dfc6c  
**Platform**: Firebase Hosting (Static Export)

