# 🔧 Firebase Services Etkinleştirme Rehberi

## Proje: cuma-mesajlari-dfc6c

## ✅ Yapılandırma Tamamlandı

- ✅ `.firebaserc` güncellendi
- ✅ `.env.production` güncellendi
- ✅ Firebase proje seçildi

## 📋 Firebase Services Etkinleştirme

### 1. Firestore Database

**URL**: https://console.firebase.google.com/project/cuma-mesajlari-dfc6c/firestore

**Adımlar**:
1. "Create database" butonuna tıklayın
2. **Test mode** seçin (güvenlik kuralları sonra ayarlanacak)
3. Location seçin: `europe-west1` (Türkiye'ye yakın)
4. "Enable" butonuna tıklayın

### 2. Storage

**URL**: https://console.firebase.google.com/project/cuma-mesajlari-dfc6c/storage

**Adımlar**:
1. "Get started" butonuna tıklayın
2. **Test mode** seçin
3. Location seçin: Firestore ile aynı (`europe-west1`)
4. "Done" butonuna tıklayın

### 3. Authentication

**URL**: https://console.firebase.google.com/project/cuma-mesajlari-dfc6c/authentication

**Adımlar**:
1. "Get started" butonuna tıklayın
2. "Sign-in method" sekmesine gidin
3. İstediğiniz method'ları etkinleştirin:
   - **Email/Password**: Etkinleştirin
   - **Google**: İsteğe bağlı
4. "Save" butonuna tıklayın

### 4. Hosting (veya App Hosting)

**URL**: https://console.firebase.google.com/project/cuma-mesajlari-dfc6c/hosting

**Seçenek 1: Firebase Hosting (Static)**
1. "Get started" butonuna tıklayın
2. Kurulum adımlarını takip edin

**Seçenek 2: Firebase App Hosting (Server-side) ⭐ ÖNERİLEN**
1. Firebase Console → App Hosting
2. "Get started" butonuna tıklayın
3. `apphosting.yaml` dosyası zaten mevcut
4. Deploy yapın

## 🚀 Servisler Etkinleştirildikten Sonra

1. **Production Build**:
   ```bash
   cd project
   npm run build
   ```

2. **Deploy**:
   ```bash
   firebase deploy --only hosting
   ```
   Veya App Hosting için:
   ```bash
   firebase deploy --only apphosting
   ```

## 📝 Notlar

- Tüm servisler etkinleştirildikten sonra deploy yapılabilir
- App Hosting server-side rendering destekler (404 hatası çözülür)
- Static Hosting sadece static dosyalar için uygundur

