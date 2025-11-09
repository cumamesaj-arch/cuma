# 🔴 404 Hatası - Firebase App Hosting Çözümü

## ❌ Sorun

**Hata**: `Failed to load resource: the server responded with a status of 404`

**Neden**: 
- Next.js App Router **server-side rendering** kullanıyor
- Firebase Hosting **sadece static dosyalar** serve ediyor
- Bu uyumsuzluk 404 hatasına neden oluyor

## ✅ Çözüm: Firebase App Hosting

Firebase App Hosting server-side rendering destekler ve Next.js App Router ile uyumludur.

## 🚀 Firebase App Hosting Kurulumu

### Adım 1: Firebase Console'da App Hosting'i Etkinleştirin

1. Chrome'da Firebase Console açın: https://console.firebase.google.com/project/cuma-mesajlari-dfc6c/apphosting
2. "Get started" veya "Başlayın" butonuna tıklayın
3. Kurulum adımlarını takip edin

### Adım 2: apphosting.yaml Kontrolü

`apphosting.yaml` dosyası zaten mevcut ve yapılandırılmış:

```yaml
buildConfig:
  runtime: nodejs20
  buildCommand: npm run build
  outputDirectory: .next
```

### Adım 3: Deploy İşlemi

#### Yöntem 1: Firebase Studio'dan (Önerilen)
1. Firebase Studio'da projeyi açın
2. "Deploy" veya "Publish" butonuna tıklayın
3. Build otomatik başlar ve deploy yapılır

#### Yöntem 2: Firebase CLI
```bash
cd project
firebase deploy --only apphosting
```

## 📋 Avantajlar

- ✅ Server-side rendering çalışır
- ✅ API routes çalışır (`/api/homepage-sections`)
- ✅ Dynamic routes çalışır (`[category]`, `[slug]`)
- ✅ Next.js App Router tam desteklenir
- ✅ 404 hatası çözülür

## 🔄 Firebase Hosting vs App Hosting

| Özellik | Firebase Hosting | Firebase App Hosting |
|---------|------------------|---------------------|
| Server-side | ❌ Hayır | ✅ Evet |
| API Routes | ❌ Hayır | ✅ Evet |
| Dynamic Routes | ❌ Sınırlı | ✅ Evet |
| Next.js App Router | ❌ Hayır | ✅ Evet |
| Static Export | ✅ Evet | ✅ Evet |

## 📝 Notlar

- Firebase App Hosting ücretsiz tier'da sınırlı
- Production için App Hosting önerilir
- Static hosting yerine App Hosting kullanın

## 🔗 Önemli Linkler

- **App Hosting**: https://console.firebase.google.com/project/cuma-mesajlari-dfc6c/apphosting
- **Firebase Console**: https://console.firebase.google.com/project/cuma-mesajlari-dfc6c/overview

