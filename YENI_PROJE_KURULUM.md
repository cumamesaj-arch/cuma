# 🆕 Yeni Firebase Projesi Oluşturma

## Durum
Eski proje `studio-2885285944-396af` silindi. Yeni bir proje oluşturulacak.

## Adım 1: Firebase Console'da Yeni Proje Oluşturma

1. Chrome'da Firebase Console açıldı: https://console.firebase.google.com/
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

## Adım 5: Proje Yapılandırması

Proje ID'sini aldıktan sonra:
1. `.firebaserc` dosyasını güncelleyeceğiz
2. `.env.production` dosyasını güncelleyeceğiz
3. Firebase Services'i etkinleştireceğiz
4. Deploy yapacağız

## Adım 6: Firebase Services Etkinleştirme

1. **Firestore Database**: Etkinleştirin
2. **Storage**: Etkinleştirin
3. **Authentication**: Etkinleştirin
4. **Hosting**: Etkinleştirin (veya App Hosting)

## Notlar

- Proje oluşturulduktan sonra tüm bilgileri paylaşın
- Firebase config değerlerini kopyalayın
- Proje ID'sini not edin


