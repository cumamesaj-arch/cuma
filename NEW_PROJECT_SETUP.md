# 🆕 Yeni Firebase Projesi Oluşturma - Adım Adım

## Adım 1: Firebase Console'da Yeni Proje Oluşturma

1. Chrome'da Firebase Console ana sayfası açıldı: https://console.firebase.google.com/
2. "Add project" veya "Proje ekle" butonuna tıklayın
3. Proje adını girin: **"Cuma Mesajları"** veya **"Mujde Portal"**
4. Google Analytics'i etkinleştirin (önerilir) ✓
5. "Create project" butonuna tıklayın
6. Proje oluşturulduktan sonra "Continue" butonuna tıklayın

## Adım 2: Web Uygulaması Ekleme

1. Firebase Console'da projenizi seçin
2. Sol menüden "Project Settings" (⚙️) tıklayın
3. "Your apps" bölümünde "Web" (</>) ikonuna tıklayın
4. App nickname girin: **"Mujde Portal"** veya **"Cuma Mesajları"**
5. "Register app" butonuna tıklayın
6. Firebase SDK yapılandırmasını kopyalayın (config objesi)

## Adım 3: Proje ID'sini Kaydetme

Proje oluşturulduktan sonra:
- Proje ID'sini kopyalayın (örn: `cuma-mesajlari-xxxxx`)
- Bu ID'yi paylaşın, `.firebaserc` dosyasını güncelleyeceğiz

## Adım 4: Firebase Config Bilgilerini Alma

1. "Project Settings" → "Your apps" → Web app
2. Config objesindeki değerleri kopyalayın:
   ```javascript
   {
     apiKey: "AIza...",
     authDomain: "proje-id.firebaseapp.com",
     projectId: "proje-id",
     storageBucket: "proje-id.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   }
   ```

## Adım 5: Environment Variables Ayarlama

Firebase Studio Secrets Manager'da şu değişkenleri ekleyin:

- `NEXT_PUBLIC_FIREBASE_API_KEY` = apiKey değeri
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = authDomain değeri
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = projectId değeri
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = storageBucket değeri
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = messagingSenderId değeri
- `NEXT_PUBLIC_FIREBASE_APP_ID` = appId değeri

## Adım 6: Firebase Hosting'i Etkinleştirme

1. Firebase Console'da sol menüden "Hosting" seçin
2. "Get started" butonuna tıklayın
3. Kurulum adımlarını takip edin

## Adım 7: Deploy İşlemi

Firebase Studio'da "Deploy" butonuna tıklayın veya Firebase CLI ile:
```bash
cd project
firebase use yeni-proje-id
firebase deploy --only hosting
```

