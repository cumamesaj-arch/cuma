# 🚀 Firebase App Hosting Kurulumu

## Sorun
404 hatası alınıyor çünkü Firebase Hosting static hosting kullanıyor ama Next.js App Router server-side rendering gerektiriyor.

## Çözüm: Firebase App Hosting

Firebase App Hosting server-side rendering destekler ve Next.js App Router ile uyumludur.

## Adım 1: Firebase Console'da App Hosting'i Etkinleştirin

1. Chrome'da Firebase Console açın: https://console.firebase.google.com/project/studio-2885285944-396af/apphosting
2. "Get started" veya "Başlayın" butonuna tıklayın
3. Kurulum adımlarını takip edin

## Adım 2: apphosting.yaml Kontrolü

`apphosting.yaml` dosyası zaten mevcut ve yapılandırılmış:

```yaml
buildConfig:
  runtime: nodejs20
  buildCommand: npm run build
  outputDirectory: .next
```

## Adım 3: Deploy İşlemi

### Yöntem 1: Firebase Studio'dan (Önerilen)
1. Firebase Studio'da projeyi açın
2. "Deploy" veya "Publish" butonuna tıklayın
3. Build otomatik başlar ve deploy yapılır

### Yöntem 2: Firebase CLI
```bash
cd project
firebase deploy --only apphosting
```

## Adım 4: Environment Variables

Firebase App Hosting'de environment variables otomatik olarak `.env.production` dosyasından okunur veya Firebase Studio Secrets Manager'dan alınır.

## Avantajlar

- ✅ Server-side rendering çalışır
- ✅ API routes çalışır (`/api/homepage-sections`)
- ✅ Dynamic routes çalışır (`[category]`, `[slug]`)
- ✅ Next.js App Router tam desteklenir
- ✅ 404 hatası çözülür

## Notlar

- Firebase App Hosting ücretsiz tier'da sınırlı
- Production için Firebase App Hosting önerilir
- Static hosting yerine App Hosting kullanın

