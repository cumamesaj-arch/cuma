# 🚀 Firebase'e Proje Aktarım Rehberi

## 📋 Genel Bakış

Bu proje **Next.js App Router** kullanıyor, bu yüzden **Firebase App Hosting** kullanmamız gerekiyor (SSR desteği için).

## ✅ Ön Hazırlık

### 1. Firebase Projesi Kontrolü

Proje ID: `cuma-mesajlari-dfc6c`

Kontrol edin:
```bash
cd project
firebase projects:list
firebase use cuma-mesajlari-dfc6c
```

### 2. Gerekli Servislerin Aktif Olduğundan Emin Olun

- ✅ Firestore Database
- ✅ Storage
- ✅ Authentication
- ✅ App Hosting (yeni)

## 🔧 Yöntem 1: Firebase App Hosting (Önerilen)

### Adım 1: Git Repository Hazırlama

#### Seçenek A: GitHub Repository (Önerilen)

1. **GitHub'da Repository Oluşturun**:
   - https://github.com/new
   - Repository adı: `cuma-mesajlari`
   - Public veya Private seçin
   - "Create repository" tıklayın

2. **Yerel Repository'yi GitHub'a Bağlayın**:
```bash
cd project
git add .
git commit -m "Initial commit - Firebase deployment ready"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADI/cuma-mesajlari.git
git push -u origin main
```

#### Seçenek B: Firebase Otomatik Repository

Firebase Console'da App Hosting → Settings → "Initialize repository" butonuna tıklayın.

### Adım 2: Firebase App Hosting'i Etkinleştirin

1. **Firebase Console'a gidin**:
   - https://console.firebase.google.com/project/cuma-mesajlari-dfc6c/apphosting

2. **"Get started" veya "Enable App Hosting" butonuna tıklayın**

3. **Repository Bağlantısı**:
   - GitHub repository'yi seçin veya Firebase otomatik oluştursun
   - Repository bağlantısını tamamlayın

### Adım 3: Environment Variables Ayarlama

Firebase Console → App Hosting → Settings → Environment Variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB_YePigrW7TjzzXhrtoaimFktrlji8lRE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cuma-mesajlari-dfc6c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cuma-mesajlari-dfc6c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cuma-mesajlari-dfc6c.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=136445087189
NEXT_PUBLIC_FIREBASE_APP_ID=1:136445087189:web:153086538227a86781015c
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-512SQLEGJC
```

**Not**: Eğer başka environment variables varsa (AI API keys, vb.) onları da ekleyin.

### Adım 4: apphosting.yaml Kontrolü

`apphosting.yaml` dosyası mevcut ve doğru yapılandırılmış olmalı:

```yaml
runtime: nodejs20
env: standard
```

### Adım 5: Build ve Deploy

1. **Firebase Console → App Hosting → Deployments**

2. **"Create deployment" veya "Deploy" butonuna tıklayın**

3. **Deployment Settings**:
   - **Live Branch**: `main` seçin
   - **App root directory**: `/` (veya boş bırakın)
   - **Build command**: `npm run build` (otomatik algılanır)
   - **Output directory**: `.next` (otomatik algılanır)

4. **"Deploy" butonuna tıklayın**

5. **Deploy işlemi tamamlanana kadar bekleyin** (5-10 dakika)

### Adım 6: Deploy Sonrası Kontrol

1. **Deployment URL'ini kontrol edin**:
   - Firebase Console → App Hosting → Deployments
   - "Live" deployment'ın URL'ini kopyalayın
   - Tarayıcıda açın ve test edin

2. **Custom Domain (Opsiyonel)**:
   - Firebase Console → App Hosting → Settings → Custom domains
   - Domain ekleyin ve DNS ayarlarını yapın

## 🔧 Yöntem 2: Firebase Hosting (Statik - Sınırlı)

**Not**: Bu yöntem Next.js App Router'ın SSR özelliklerini desteklemez. Sadece statik export için kullanılabilir.

### Adım 1: Next.js Static Export

`next.config.ts` dosyasını güncelleyin:
```typescript
output: 'export'
```

### Adım 2: Build ve Deploy

```bash
cd project
npm run build
firebase deploy --only hosting
```

**Sınırlamalar**:
- Server Actions çalışmaz
- API Routes çalışmaz
- Dynamic routes sınırlı çalışır

## 📝 Deployment Checklist

### Öncesi:
- [ ] Git repository hazır
- [ ] Firebase projesi aktif
- [ ] App Hosting etkinleştirildi
- [ ] Environment variables ayarlandı
- [ ] `apphosting.yaml` kontrol edildi
- [ ] Yerel test yapıldı (`npm run build` başarılı)

### Deploy:
- [ ] Repository Firebase'e bağlandı
- [ ] Branch seçildi (`main`)
- [ ] Build command doğru
- [ ] Output directory doğru
- [ ] Deploy başlatıldı

### Sonrası:
- [ ] Deployment başarılı
- [ ] URL test edildi
- [ ] Tüm sayfalar çalışıyor
- [ ] API routes çalışıyor (varsa)
- [ ] Environment variables doğru

## 🐛 Sorun Giderme

### Build Hatası
- `npm run build` yerel olarak çalışıyor mu kontrol edin
- Environment variables eksik olabilir
- Dependencies eksik olabilir

### 404 Hatası
- App Hosting kullanıldığından emin olun (Hosting değil)
- `apphosting.yaml` dosyası doğru mu kontrol edin

### Environment Variables Çalışmıyor
- Firebase Console'da doğru eklenmiş mi kontrol edin
- `NEXT_PUBLIC_` prefix'i var mı kontrol edin
- Deploy sonrası yeniden deploy gerekebilir

## 🎯 Hızlı Başlangıç

```bash
# 1. Git repository hazırla
cd project
git add .
git commit -m "Ready for Firebase deployment"
git push origin main

# 2. Firebase Console'da:
# - App Hosting → Enable
# - Repository bağla
# - Environment variables ekle
# - Deploy başlat
```

## 📞 Destek

Sorun yaşarsanız:
1. Firebase Console → App Hosting → Deployments → Logs kontrol edin
2. Build loglarını inceleyin
3. Environment variables'ı kontrol edin

