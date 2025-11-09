# 📦 Git Repository Kurulumu - Firebase App Hosting için

## ❓ Sorun

Firebase App Hosting Live Branch seçeneklerini görmüyorsunuz çünkü Git repository yok.

## ✅ Çözüm: Git Repository Oluşturma

Firebase App Hosting Git repository gerektirir. Branch'ler Git repository'den gelir.

## 🚀 Adım 1: Git Repository Oluşturma

### Yerel Git Repository Oluşturma

```bash
cd project
git init
git add .
git commit -m "Initial commit"
git branch -M main
```

**Durum**: ✅ Git repository oluşturuldu

## 🔗 Adım 2: Git Repository'yi Firebase'e Bağlama

### Seçenek 1: GitHub Repository (Önerilen)

1. **GitHub'da yeni repository oluşturun**:
   - https://github.com/new
   - Repository adı: `cuma-mesajlari` veya `mujde-portal`
   - Public veya Private seçin
   - "Create repository" butonuna tıklayın

2. **Yerel repository'yi GitHub'a bağlayın**:
   ```bash
   cd project
   git remote add origin https://github.com/kullanici-adi/cuma-mesajlari.git
   git push -u origin main
   ```

3. **Firebase App Hosting'de GitHub'ı bağlayın**:
   - Firebase Console → App Hosting → Settings
   - "Connect repository" butonuna tıklayın
   - GitHub'ı seçin ve repository'yi bağlayın

### Seçenek 2: Firebase App Hosting Otomatik Repository

Firebase App Hosting otomatik olarak bir Git repository oluşturabilir:

1. Firebase Console → App Hosting → Settings
2. "Create repository" veya "Initialize repository" butonuna tıklayın
3. Firebase otomatik olarak bir repository oluşturur
4. Branch'ler otomatik görünür

## 📋 Adım 3: Branch'leri Görme

Git repository bağlandıktan sonra:

1. Firebase Console → App Hosting → Deployment Settings
2. "Live Branch" dropdown'ında branch'ler görünecek:
   - `main` (production için)
   - `master` (eski projeler için)
   - Diğer branch'ler (varsa)

## 🎯 Hızlı Çözüm

**Yerel Git repository oluşturuldu** ✅

**Şimdi yapılacaklar**:
1. GitHub'da repository oluşturun (veya Firebase otomatik oluştursun)
2. Firebase App Hosting'de repository'yi bağlayın
3. Branch'ler görünecek

## 📝 Notlar

- Git repository zorunludur
- Firebase App Hosting GitHub, GitLab veya Bitbucket ile çalışır
- Firebase otomatik repository de oluşturabilir

