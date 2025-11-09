# 🔥 Yeni Firebase Projesi Oluşturma Rehberi

## Adım 1: Firebase Console'da Proje Oluşturma

1. Firebase Console'u açın: https://console.firebase.google.com/
2. "Add project" veya "Proje ekle" butonuna tıklayın
3. Proje adını girin (örn: "mujde-portal" veya "cuma-mesajlari")
4. Google Analytics'i etkinleştirin (önerilir)
5. "Create project" butonuna tıklayın
6. Proje oluşturulduktan sonra "Continue" butonuna tıklayın

## Adım 2: Web Uygulaması Ekleme

1. Firebase Console'da projenizi seçin
2. Sol menüden "Project settings" (⚙️) tıklayın
3. "Your apps" bölümünde "Web" (</>) ikonuna tıklayın
4. App nickname girin (örn: "Mujde Portal")
5. "Register app" butonuna tıklayın
6. Firebase SDK yapılandırmasını kopyalayın (config objesi)

## Adım 3: Firebase CLI ile Projeyi Bağlama

Proje oluşturulduktan sonra, terminalde şu komutu çalıştırın:

```bash
cd project
firebase use --add
```

Bu komut size projeleri listeleyecek ve yeni projeyi seçmenizi isteyecek.

## Adım 4: Environment Variables Ayarlama

Firebase Studio Secrets Manager'da şu değişkenleri ayarlayın:

### Zorunlu Değişkenler:
- `NEXT_PUBLIC_FIREBASE_API_KEY` - Firebase config'den alın
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Firebase config'den alın
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Firebase config'den alın
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Firebase config'den alın
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase config'den alın
- `NEXT_PUBLIC_FIREBASE_APP_ID` - Firebase config'den alın

### Opsiyonel Değişkenler:
- `GOOGLE_GENAI_API_KEY` - AI özellikleri için
- `OPENAI_API_KEY` - Görsel oluşturma için
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics için
- `NEXT_PUBLIC_SITE_URL` - Site URL'i (örn: https://mujdeportal.com)

## Adım 5: Firebase Hosting'i Etkinleştirme

1. Firebase Console'da sol menüden "Hosting" seçin
2. "Get started" butonuna tıklayın
3. Kurulum adımlarını takip edin

## Adım 6: Firebase App Hosting (Önerilen)

Firebase Studio kullanıyorsanız, App Hosting otomatik olarak yapılandırılmış olmalı.

`apphosting.yaml` dosyası zaten hazır ve yapılandırılmış.

## Adım 7: Deploy İşlemi

Proje bağlandıktan ve environment variables ayarlandıktan sonra:

```bash
npm run build
firebase deploy
```

## 📝 Notlar

- Firebase proje ID'si `.firebaserc` dosyasına kaydedilecek
- Environment variables Firebase Studio Secrets Manager'da yönetilir
- İlk deploy işlemi biraz zaman alabilir

