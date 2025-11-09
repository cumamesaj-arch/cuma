# ✅ Yeni Firebase Projesi Kurulum Checklist

## 📋 Proje Bilgileri

- **Proje Adı**: Cuma Mesajları
- **Proje ID**: cuma-mesajlar
- **Proje Numarası**: 10222045

## 🔍 Mevcut Proje Kontrolü

### ✅ Proje Yapısı
- [x] Next.js 15.3.3 (App Router)
- [x] TypeScript
- [x] Firebase SDK 11.9.1
- [x] Tailwind CSS
- [x] Radix UI Components
- [x] Genkit AI (Google Gemini)

### ✅ Dosya Yapısı
- [x] `apphosting.yaml` - App Hosting config
- [x] `firebase.json` - Firebase config
- [x] `.firebaserc` - Proje ID config
- [x] `firestore.rules` - Firestore kuralları
- [x] `storage.rules` - Storage kuralları
- [x] `firestore.indexes.json` - Firestore indexleri
- [x] `env.example` - Environment variables örneği

## 🚀 Yeni Proje İçin Gerekli Adımlar

### 1. Firebase Projesi Oluşturma

#### Firebase Console'da:
1. [Firebase Console](https://console.firebase.google.com/) açın
2. "Add project" veya "Proje ekle" tıklayın
3. Proje adı: **"Cuma Mesajları"**
4. Proje ID: **"cuma-mesajlar"** (otomatik önerilir, değiştirilebilir)
5. Google Analytics etkinleştirin (önerilir)
6. "Create project" tıklayın
7. Proje oluşturulduktan sonra "Continue" tıklayın

#### Kontrol:
- [ ] Proje oluşturuldu mu?
- [ ] Proje ID doğru mu? (`cuma-mesajlar`)
- [ ] Proje numarası doğru mu? (`10222045`)

### 2. Web Uygulaması Ekleme

1. Firebase Console → Project Settings (⚙️)
2. "Your apps" bölümünde "Web" (</>) ikonuna tıklayın
3. App nickname: **"Cuma Mesajları Web"**
4. "Register app" tıklayın
5. Firebase SDK config değerlerini kopyalayın

#### Kontrol:
- [ ] Web app eklendi mi?
- [ ] Config değerleri alındı mı?

### 3. Firebase Servislerini Etkinleştirme

#### Firestore Database:
1. Firebase Console → Firestore Database
2. "Create database" tıklayın
3. Test mode'da başlatın (geliştirme için)
4. Location seçin (örn: `europe-west1`)
5. "Enable" tıklayın

#### Storage:
1. Firebase Console → Storage
2. "Get started" tıklayın
3. Test mode'da başlatın (geliştirme için)
4. Location seçin (Firestore ile aynı)
5. "Done" tıklayın

#### Authentication:
1. Firebase Console → Authentication
2. "Get started" tıklayın
3. Sign-in method'ları etkinleştirin:
   - [ ] Email/Password
   - [ ] Google (opsiyonel)
   - [ ] Diğer method'lar (opsiyonel)

#### App Hosting:
1. Firebase Console → App Hosting
2. "Get started" veya "Enable App Hosting" tıklayın
3. Repository bağlantısı yapılacak (sonraki adımda)

#### Kontrol:
- [ ] Firestore Database etkin mi?
- [ ] Storage etkin mi?
- [ ] Authentication etkin mi?
- [ ] App Hosting etkin mi?

### 4. Yerel Dosyaları Güncelleme

#### `.firebaserc` Güncelleme:
```json
{
  "projects": {
    "default": "cuma-mesajlar"
  }
}
```

#### `.env.local` Oluşturma:
Firebase Console'dan alınan config değerleri ile:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=YENI_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cuma-mesajlar.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cuma-mesajlar
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cuma-mesajlar.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YENI_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YENI_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YENI_MEASUREMENT_ID
```

#### Kontrol:
- [ ] `.firebaserc` güncellendi mi?
- [ ] `.env.local` oluşturuldu mu?
- [ ] Tüm config değerleri doğru mu?

### 5. Firestore Rules ve Indexes

#### Firestore Rules:
`firestore.rules` dosyası mevcut, Firebase'e deploy edilmeli:
```bash
firebase deploy --only firestore:rules
```

#### Firestore Indexes:
`firestore.indexes.json` dosyası mevcut, Firebase'e deploy edilmeli:
```bash
firebase deploy --only firestore:indexes
```

#### Kontrol:
- [ ] Firestore rules deploy edildi mi?
- [ ] Firestore indexes deploy edildi mi?

### 6. Storage Rules

#### Storage Rules:
`storage.rules` dosyası mevcut, Firebase'e deploy edilmeli:
```bash
firebase deploy --only storage
```

#### Kontrol:
- [ ] Storage rules deploy edildi mi?

### 7. Git Repository Hazırlama

#### GitHub Repository:
1. GitHub'da yeni repository oluşturun: `cuma-mesajlar`
2. Yerel projeyi GitHub'a push edin:
```bash
cd project
git add .
git commit -m "Initial commit - Yeni Firebase projesi"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADI/cuma-mesajlar.git
git push -u origin main
```

#### Kontrol:
- [ ] GitHub repository oluşturuldu mu?
- [ ] Yerel proje push edildi mi?

### 8. Firebase App Hosting Repository Bağlama

1. Firebase Console → App Hosting → Settings
2. "Connect repository" tıklayın
3. GitHub repository'yi seçin
4. "Connect" tıklayın

#### Kontrol:
- [ ] Repository bağlandı mı?
- [ ] Branch'ler görünüyor mu? (`main`)

### 9. Environment Variables (Firebase Studio/App Hosting)

Firebase Console → App Hosting → Settings → Environment Variables:

#### Zorunlu Değişkenler:
```
NEXT_PUBLIC_FIREBASE_API_KEY=YENI_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cuma-mesajlar.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cuma-mesajlar
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cuma-mesajlar.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YENI_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YENI_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YENI_MEASUREMENT_ID
```

#### Opsiyonel Değişkenler (AI özellikleri için):
```
GOOGLE_GENAI_API_KEY=your_google_genai_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://cuma-mesajlar.web.app
```

#### Kontrol:
- [ ] Tüm zorunlu environment variables eklendi mi?
- [ ] Opsiyonel değişkenler eklendi mi? (AI özellikleri için)

### 10. Build ve Deploy Test

#### Yerel Build Test:
```bash
cd project
npm run build
```

#### Kontrol:
- [ ] Build başarılı mı?
- [ ] TypeScript hataları var mı?
- [ ] Tüm sayfalar derlendi mi?

#### Firebase Deploy (Rules ve Indexes):
```bash
cd project
firebase use cuma-mesajlar
firebase deploy --only firestore:rules,firestore:indexes,storage
```

#### Kontrol:
- [ ] Rules deploy edildi mi?
- [ ] Indexes deploy edildi mi?
- [ ] Storage rules deploy edildi mi?

### 11. App Hosting Deploy

1. Firebase Console → App Hosting → Deployments
2. "Create deployment" veya "Deploy" tıklayın
3. Branch: `main` seçin
4. "Deploy" tıklayın
5. Deploy tamamlanana kadar bekleyin (5-10 dakika)

#### Kontrol:
- [ ] Deploy başarılı mı?
- [ ] URL çalışıyor mu?
- [ ] Tüm sayfalar erişilebilir mi?

### 12. Post-Deploy Test

#### Test Edilecekler:
- [ ] Ana sayfa yükleniyor mu?
- [ ] Admin paneli çalışıyor mu? (`/admin`)
- [ ] Kategori sayfaları çalışıyor mu?
- [ ] Post sayfaları çalışıyor mu?
- [ ] Firebase bağlantısı çalışıyor mu?
- [ ] Storage upload çalışıyor mu?
- [ ] Authentication çalışıyor mu? (varsa)

## 📝 Stabil Çalışması İçin Gerekli İhtiyaçlar

### ✅ Zorunlu İhtiyaçlar

1. **Firebase Config Değerleri**:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

2. **Firebase Servisleri**:
   - Firestore Database (etkin)
   - Storage (etkin)
   - Authentication (etkin)
   - App Hosting (etkin)

3. **Firebase Rules**:
   - Firestore rules (deploy edilmiş)
   - Storage rules (deploy edilmiş)
   - Firestore indexes (deploy edilmiş)

4. **Git Repository**:
   - GitHub repository (bağlı)
   - `main` branch (mevcut)

5. **Environment Variables**:
   - Firebase App Hosting'de ayarlanmış
   - Yerel `.env.local` dosyası (geliştirme için)

### ⚠️ Opsiyonel İhtiyaçlar (AI Özellikleri İçin)

1. **Google Gemini AI**:
   - `GOOGLE_GENAI_API_KEY` (Genkit için)

2. **OpenAI**:
   - `OPENAI_API_KEY` (Görsel oluşturma için)

3. **Google Analytics**:
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`

4. **Site URL**:
   - `NEXT_PUBLIC_SITE_URL`

## 🎯 Hızlı Başlangıç Komutları

```bash
# 1. Firebase projesini seç
cd project
firebase use cuma-mesajlar

# 2. Rules ve indexes deploy et
firebase deploy --only firestore:rules,firestore:indexes,storage

# 3. Yerel build test
npm run build

# 4. Git push (App Hosting için)
git add .
git commit -m "Yeni Firebase projesi hazır"
git push origin main
```

## 📞 Sorun Giderme

### Build Hatası
- Environment variables eksik olabilir
- TypeScript hataları kontrol edin
- Dependencies eksik olabilir: `npm install`

### Deploy Hatası
- Firebase CLI giriş yapılmış mı: `firebase login`
- Proje seçilmiş mi: `firebase use cuma-mesajlar`
- Rules syntax hatası var mı kontrol edin

### 404 Hatası
- App Hosting kullanıldığından emin olun
- `apphosting.yaml` dosyası doğru mu kontrol edin
- Environment variables doğru mu kontrol edin

## ✅ Tamamlandı Kontrolü

Tüm adımlar tamamlandığında:
- [ ] Firebase projesi oluşturuldu
- [ ] Web app eklendi
- [ ] Tüm servisler etkin
- [ ] Yerel dosyalar güncellendi
- [ ] Rules ve indexes deploy edildi
- [ ] Git repository bağlandı
- [ ] Environment variables ayarlandı
- [ ] Build başarılı
- [ ] Deploy başarılı
- [ ] Site çalışıyor

