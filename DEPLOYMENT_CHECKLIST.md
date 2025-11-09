# 🚀 Yayın Öncesi Kontrol Listesi

## ✅ Tamamlanan Kontroller

- [x] Production build başarılı
- [x] Tüm sayfalar derlendi (34 sayfa)
- [x] TypeScript hataları düzeltildi
- [x] Performans optimizasyonları yapıldı
- [x] API endpoint'leri test edildi
- [x] Firebase yapılandırması hazır

## 📋 Yayın Öncesi Yapılacaklar

### 1. Environment Variables Ayarlama

Firebase Studio Secrets Manager'da şu değişkenleri ayarlayın:

#### Zorunlu Değişkenler:
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`

#### Opsiyonel Değişkenler:
- [ ] `GOOGLE_GENAI_API_KEY` (AI özellikleri için)
- [ ] `OPENAI_API_KEY` (Görsel oluşturma için)
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` (Google Analytics için)
- [ ] `NEXT_PUBLIC_SITE_URL` (Site URL'i için)

### 2. Firebase Deploy

```bash
# Production build
npm run build

# Firebase deploy
firebase deploy
```

### 3. Son Kontroller

- [ ] Ana sayfa açılıyor mu?
- [ ] Admin paneli çalışıyor mu?
- [ ] API endpoint'leri çalışıyor mu?
- [ ] Görseller yükleniyor mu?
- [ ] Tüm sayfalar erişilebilir mi?

### 4. Production Test

- [ ] Tüm kategoriler çalışıyor mu?
- [ ] Gönderi detay sayfaları açılıyor mu?
- [ ] Arama fonksiyonu çalışıyor mu?
- [ ] Admin işlemleri çalışıyor mu?

## 📝 Notlar

- Build sırasında TypeScript ve ESLint hataları ignore ediliyor (next.config.ts'de ayarlı)
- Console.log'lar production'da sorun yaratmaz
- Image optimization `unoptimized: true` olarak ayarlı (Firebase için uygun)

## 🔗 Önemli Dosyalar

- `next.config.ts` - Next.js yapılandırması
- `firebase.json` - Firebase hosting yapılandırması
- `apphosting.yaml` - Firebase App Hosting yapılandırması
- `env.example` - Environment variables örneği
- `.gitignore` - Git ignore ayarları

## 🆘 Sorun Giderme

### Build Hatası
```bash
# .next klasörünü temizle
Remove-Item -Recurse -Force .next
npm run build
```

### Environment Variables Hatası
- Firebase Studio Secrets Manager'da değişkenlerin doğru ayarlandığından emin olun
- `env.example` dosyasındaki tüm değişkenleri kontrol edin

### Deploy Hatası
- Firebase CLI'nin güncel olduğundan emin olun: `npm install -g firebase-tools`
- Firebase'e login olduğunuzdan emin olun: `firebase login`

