# 🔴 404 Hatası - Sorun ve Çözüm

## ❌ Sorun

**Hata**: `Failed to load resource: the server responded with a status of 404`

**Neden**: 
- Next.js App Router **server-side rendering** kullanıyor
- Firebase Hosting **sadece static dosyalar** serve ediyor
- Next.js'in server-side sayfaları Firebase Hosting'de çalışmıyor

## 🔍 Sorunun Detayları

1. **Next.js App Router**: Server-side rendering gerektirir
2. **Firebase Hosting**: Sadece static HTML/CSS/JS dosyaları serve eder
3. **API Routes**: `/api/homepage-sections` gibi API route'ları server-side gerektirir
4. **Dynamic Routes**: `[category]`, `[slug]` gibi dynamic route'lar server-side gerektirir

## ✅ Çözüm Seçenekleri

### Seçenek 1: Firebase App Hosting (ÖNERİLEN) ⭐

Firebase App Hosting server-side rendering destekler.

**Avantajlar**:
- ✅ Server-side rendering çalışır
- ✅ API routes çalışır
- ✅ Dynamic routes çalışır
- ✅ Next.js App Router tam desteklenir

**Nasıl Yapılır**:
1. Firebase Console → App Hosting
2. `apphosting.yaml` dosyası zaten mevcut
3. Firebase Studio'dan deploy yap

### Seçenek 2: Static Export (Sınırlı)

Next.js'i static export yapmak.

**Dezavantajlar**:
- ❌ API routes çalışmaz (kaldırılmalı veya başka yere taşınmalı)
- ❌ Server-side rendering yok
- ❌ Dynamic routes sınırlı

**Nasıl Yapılır**:
```typescript
// next.config.ts
const nextConfig = {
  output: 'export', // Static export
  // ...
};
```

### Seçenek 3: Firebase Functions + Hosting

Next.js'i Firebase Functions'da çalıştırmak.

**Avantajlar**:
- ✅ Server-side rendering çalışır
- ✅ API routes çalışır

**Dezavantajlar**:
- ❌ Daha karmaşık yapılandırma
- ❌ Cold start sorunları

## 🎯 Önerilen Çözüm

**Firebase App Hosting kullanın** çünkü:
1. `apphosting.yaml` dosyası zaten mevcut
2. Server-side rendering destekler
3. API routes çalışır
4. En az yapılandırma gerektirir

## 📋 Hızlı Çözüm Adımları

1. Firebase Console'da App Hosting'i etkinleştirin
2. Firebase Studio'dan deploy yapın
3. Veya `firebase deploy --only apphosting` komutunu kullanın

