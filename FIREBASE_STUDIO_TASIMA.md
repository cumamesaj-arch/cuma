# 🚀 Firebase Studio'ya Taşıma Rehberi

## 📋 Genel Bakış

Bu rehber, projenizi Firebase Studio'ya taşımanız için adım adım talimatlar içerir. Firebase Studio, Firebase'in yeni geliştirme ve deploy ortamıdır ve Next.js projelerini tam destekler.

## ✅ Ön Hazırlık

### 1. Firebase Projesi Bilgileri

- **Proje ID**: `cuma-mesajlari-dfc6c`
- **Firebase Console**: https://console.firebase.google.com/project/cuma-mesajlari-dfc6c

### 2. Gerekli Servisler

Aşağıdaki servislerin Firebase Console'da aktif olduğundan emin olun:

- ✅ **Firestore Database** - Veritabanı
- ✅ **Storage** - Dosya depolama
- ✅ **Authentication** - Kullanıcı kimlik doğrulama
- ✅ **App Hosting** - Uygulama hosting (Firebase Studio için)

### 3. Yerel Proje Kontrolü

```bash
cd project
firebase projects:list
firebase use cuma-mesajlari-dfc6c
```

## 🔧 Adım 1: App Hosting'i Etkinleştirin (ÖNEMLİ!)

Firebase Studio, Firebase App Hosting kullanır. Projenin Firebase Studio'da görünmesi için App Hosting'in etkinleştirilmesi gerekir.

### App Hosting Etkinleştirme

1. **Firebase Console'u açın**:
   - https://console.firebase.google.com/project/cuma-mesajlari-dfc6c

2. **App Hosting bölümüne gidin**:
   - Sol menüden **"App Hosting"** seçin
   - Veya direkt link: https://console.firebase.google.com/project/cuma-mesajlari-dfc6c/apphosting

3. **"Get started" veya "Başlayın" butonuna tıklayın**

4. **Kurulum adımlarını takip edin**:
   - App Hosting servisini etkinleştirin
   - Gerekirse billing hesabı bağlayın (ücretsiz tier mevcut)

5. **Kurulum tamamlandıktan sonra**:
   - App Hosting etkin olacak
   - Firebase Studio'da proje görünecek

### Alternatif: Firebase Studio'dan Etkinleştirme

1. **Firebase Studio'yu açın**: https://studio.firebase.google.com/
2. **Proje seçin**: `cuma-mesajlari-dfc6c`
3. **Eğer proje görünmüyorsa**:
   - "Enable App Hosting" veya "Get started" butonuna tıklayın
   - App Hosting'i etkinleştirin

## 🔧 Adım 2: Firebase Studio'yu Açın

1. **Firebase Studio'yu açın**:
   - https://studio.firebase.google.com/
   - Veya Firebase Console → "Studio" sekmesine tıklayın

2. **Google hesabınızla giriş yapın**

3. **Projeyi seçin**: `cuma-mesajlari-dfc6c`
   - App Hosting etkinleştirildikten sonra proje listede görünecek

## 🔧 Adım 3: Git Repository Hazırlama

Firebase Studio, Git repository gerektirir. İki seçenek var:

### Seçenek A: GitHub Repository (Önerilen)

1. **GitHub'da yeni repository oluşturun**:
   - https://github.com/new adresine gidin
   - Repository adı: `cuma-mesajlari` (veya istediğiniz isim)
   - Public veya Private seçin
   - "Create repository" butonuna tıklayın

2. **Yerel projeyi GitHub'a push edin**:
   ```bash
   cd project
   
   # Git repository kontrolü
   git status
   
   # Eğer git repository yoksa
   git init
   git add .
   git commit -m "Initial commit - Firebase Studio ready"
   git branch -M main
   
   # GitHub repository'yi bağlayın
   git remote add origin https://github.com/KULLANICI_ADI/cuma-mesajlari.git
   git push -u origin main
   ```

3. **Firebase Studio'da repository'yi bağlayın**:
   - Firebase Studio → Settings → Repository
   - "Connect repository" butonuna tıklayın
   - GitHub'ı seçin ve repository'yi seçin
   - "Connect" tıklayın

### Seçenek B: Firebase Otomatik Repository

1. **Firebase Studio → Settings → Repository**
2. **"Create repository" veya "Initialize repository" butonuna tıklayın**
3. Firebase otomatik olarak bir Git repository oluşturur
4. Yerel projeyi bu repository'ye push edin

## 🔧 Adım 4: Environment Variables Ayarlama

Firebase Studio → Settings → Environment Variables bölümüne gidin ve aşağıdaki değişkenleri ekleyin:

### Zorunlu Firebase Değişkenleri

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cuma-mesajlari-dfc6c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cuma-mesajlari-dfc6c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cuma-mesajlari-dfc6c.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Not**: Bu değerleri Firebase Console → Project Settings → Your apps → Web app bölümünden alabilirsiniz.

### Opsiyonel Değişkenler

```
# AI Özellikleri için
GOOGLE_GENAI_API_KEY=your_google_genai_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Site URL
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 🔧 Adım 5: apphosting.yaml Kontrolü

`apphosting.yaml` dosyası proje kök dizininde mevcut ve doğru yapılandırılmış:

```yaml
runConfig:
  maxInstances: 1

buildConfig:
  runtime: nodejs20
  buildCommand: npm run build
  outputDirectory: .next
```

**Kontrol**: Dosya mevcut ve doğru mu? ✅

## 🔧 Adım 6: İlk Deploy

1. **Firebase Studio → Deployments** bölümüne gidin

2. **"Deploy" veya "Create deployment" butonuna tıklayın**

3. **Deployment ayarları**:
   - **Branch**: `main` seçin (veya varsayılan branch)
   - **Build command**: `npm run build` (otomatik algılanır)
   - **Output directory**: `.next` (otomatik algılanır)

4. **"Deploy" butonuna tıklayın**

5. **Deploy işlemi tamamlanana kadar bekleyin** (5-10 dakika)

6. **Build loglarını takip edin**:
   - Firebase Studio → Deployments → Build logs
   - Hataları kontrol edin

## 🔧 Adım 7: Deploy Sonrası Kontrol

1. **Deployment URL'ini kontrol edin**:
   - Firebase Studio → Deployments
   - "Live" deployment'ın URL'ini kopyalayın
   - Tarayıcıda açın ve test edin

2. **Tüm sayfaları test edin**:
   - ✅ Ana sayfa
   - ✅ Admin paneli
   - ✅ Kategori sayfaları
   - ✅ Post sayfaları
   - ✅ API routes (`/api/*`)

3. **Firebase servislerini test edin**:
   - ✅ Firestore Database
   - ✅ Storage
   - ✅ Authentication

## 🔄 Güncellemeler ve Yeni Deploy

### Yeni Deploy Yapmak

1. **Değişiklikleri commit edin**:
   ```bash
   cd project
   git add .
   git commit -m "Update: açıklama"
   git push origin main
   ```

2. **Firebase Studio'da deploy**:
   - Firebase Studio → Deployments → "Deploy" butonuna tıklayın
   - Veya otomatik deploy etkinse, push sonrası otomatik deploy başlar

### Otomatik Deploy Ayarlama

1. **Firebase Studio → Settings → Auto-deploy**
2. **"Enable auto-deploy"** seçeneğini etkinleştirin
3. **Branch seçin**: `main` (production için)
4. Artık `main` branch'ine push yapıldığında otomatik deploy yapılır

## 📝 Firebase Studio Özellikleri

### Avantajlar

- ✅ **Kolay Deploy**: Tek tıkla deploy
- ✅ **Otomatik Build**: Build işlemi otomatik yapılır
- ✅ **Environment Variables**: Kolay yönetim
- ✅ **Git Integration**: Otomatik Git bağlantısı
- ✅ **Live Preview**: Deploy öncesi preview
- ✅ **Rollback**: Önceki versiyona geri dönme
- ✅ **Build Logs**: Detaylı build logları
- ✅ **Performance Monitoring**: Performans takibi

### Firebase Studio vs Firebase Console

| Özellik | Firebase Studio | Firebase Console |
|---------|----------------|------------------|
| Deploy | ✅ Tek tıkla | ❌ CLI gerekli |
| Git Integration | ✅ Otomatik | ❌ Manuel |
| Environment Variables | ✅ Kolay yönetim | ⚠️ Secrets Manager |
| Preview | ✅ Live preview | ❌ Yok |
| Rollback | ✅ Kolay | ⚠️ Manuel |
| Build Logs | ✅ Detaylı | ⚠️ Sınırlı |

## 🐛 Sorun Giderme

### Build Hatası

1. **Logları kontrol edin**:
   - Firebase Studio → Deployments → Build logs
   - Hata mesajlarını okuyun

2. **Yerel build test edin**:
   ```bash
   cd project
   npm run build
   ```
   Yerel build başarısızsa, Firebase Studio'da da başarısız olur.

3. **Environment variables kontrol edin**:
   - Firebase Studio → Settings → Environment Variables
   - Tüm zorunlu değişkenler eklenmiş mi?
   - `NEXT_PUBLIC_` prefix'i var mı?

4. **Node modules kontrol edin**:
   - `package.json` dosyası doğru mu?
   - Tüm bağımlılıklar yüklü mü?

### Proje Firebase Studio'da Görünmüyor

1. **App Hosting etkinleştirildi mi kontrol edin**:
   - Firebase Console → App Hosting: https://console.firebase.google.com/project/cuma-mesajlari-dfc6c/apphosting
   - "Get started" butonuna tıklayarak App Hosting'i etkinleştirin

2. **Firebase Studio'da proje seçimi**:
   - Firebase Studio → Proje seçimi dropdown'ından `cuma-mesajlari-dfc6c` seçin
   - Eğer listede yoksa, App Hosting etkinleştirilmemiş olabilir

3. **Billing hesabı kontrolü**:
   - App Hosting ücretsiz tier'da çalışır
   - Ancak bazı durumlarda billing hesabı bağlamak gerekebilir

### 404 Hatası

1. **App Hosting kullanıldığından emin olun**:
   - Firebase Studio otomatik olarak App Hosting kullanır
   - Firebase Console → App Hosting kontrol edin

2. **`apphosting.yaml` kontrol edin**:
   - Dosya mevcut mu?
   - `outputDirectory: .next` doğru mu?

3. **Next.js yapılandırması kontrol edin**:
   - `next.config.ts` dosyası doğru mu?
   - Export ayarları kontrol edin

### Environment Variables Çalışmıyor

1. **Firebase Studio → Settings → Environment Variables**:
   - Tüm değişkenler eklenmiş mi?
   - `NEXT_PUBLIC_` prefix'i var mı?
   - Değerler doğru mu?

2. **Deploy sonrası yeniden deploy gerekebilir**:
   - Environment variables değiştirildikten sonra yeniden deploy yapın

3. **Client-side değişkenler**:
   - `NEXT_PUBLIC_` prefix'i olan değişkenler client-side'da kullanılabilir
   - Prefix olmayan değişkenler sadece server-side'da kullanılabilir

### Port veya Bağlantı Hatası

1. **Firebase Studio otomatik port yönetimi yapar**
2. **Yerel geliştirme için**:
   ```bash
   npm run dev
   ```
   Port 9002'de çalışır

## 🎯 Hızlı Başlangıç Checklist

- [ ] Firebase Studio'yu açtım
- [ ] Git repository oluşturdum/bağladım
- [ ] Environment variables ekledim
- [ ] `apphosting.yaml` dosyası mevcut ve doğru
- [ ] İlk deploy yaptım
- [ ] Deployment URL'ini test ettim
- [ ] Tüm sayfaları test ettim
- [ ] Otomatik deploy ayarladım (opsiyonel)

## 📞 Destek ve Kaynaklar

### Firebase Studio Dokümantasyonu

- **Firebase Studio**: https://firebase.google.com/docs/studio
- **App Hosting**: https://firebase.google.com/docs/app-hosting
- **Environment Variables**: https://firebase.google.com/docs/app-hosting/configure#environment-variables

### Yardım

Sorun yaşarsanız:

1. Firebase Studio → Deployments → Build logs kontrol edin
2. Yerel build test edin: `npm run build`
3. Environment variables'ı kontrol edin
4. Firebase Studio dokümantasyonuna bakın

## 📝 Notlar

- Firebase Studio, Firebase App Hosting kullanır
- Next.js App Router tam desteklenir
- Server-side rendering çalışır
- API routes çalışır (`/api/*`)
- Dynamic routes çalışır (`[category]`, `[slug]`)
- Environment variables Firebase Studio Secrets Manager'da yönetilir
- Git repository zorunludur
- Otomatik deploy opsiyoneldir

---

**Son Güncelleme**: 2024
**Proje**: cuma-mesajlari-dfc6c
**Platform**: Firebase Studio (App Hosting)

