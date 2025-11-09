# 🌿 Live Branch Seçenekleri - Firebase App Hosting

## ❓ Sorun

Live Branch dropdown'ında branch seçenekleri görünmüyor.

## 🔍 Neden?

Firebase App Hosting **Git repository** gerektirir. Branch'ler Git repository'den gelir.

## ✅ Çözüm: Git Repository Bağlama

### Yöntem 1: GitHub Repository Bağlama (Önerilen)

1. **GitHub'da Repository Oluşturun**:
   - Chrome'da GitHub açıldı: https://github.com/new
   - Repository adı: `cuma-mesajlari` veya `mujde-portal`
   - Public veya Private seçin
   - "Create repository" butonuna tıklayın

2. **Yerel Repository'yi GitHub'a Bağlayın**:
   ```bash
   cd project
   git remote add origin https://github.com/kullanici-adi/cuma-mesajlari.git
   git push -u origin main
   ```

3. **Firebase App Hosting'de GitHub'ı Bağlayın**:
   - Firebase Console → App Hosting → Settings
   - "Connect repository" veya "Bağla" butonuna tıklayın
   - GitHub'ı seçin
   - Repository'yi seçin ve bağlayın

### Yöntem 2: Firebase Otomatik Repository

Firebase App Hosting otomatik olarak bir Git repository oluşturabilir:

1. Firebase Console → App Hosting → Settings
2. "Create repository" veya "Initialize repository" butonuna tıklayın
3. Firebase otomatik olarak bir repository oluşturur
4. Branch'ler otomatik görünür

## 📋 Branch'ler Göründükten Sonra

1. Firebase Console → App Hosting → Deployment Settings
2. "Live Branch" dropdown'ında branch'ler görünecek:
   - ✅ `main` (production için - önerilen)
   - ✅ `master` (eski projeler için)
   - ✅ Diğer branch'ler (varsa)

3. **`main`** branch'ini seçin
4. "Continue" veya "Save" butonuna tıklayın

## 🎯 Şimdi Yapılacaklar

1. **GitHub Repository Oluşturun** (veya Firebase otomatik oluştursun)
2. **Firebase App Hosting'de Repository'yi Bağlayın**
3. **Branch'ler Görünecek**
4. **`main` Branch'ini Seçin**

## 📝 Notlar

- Git repository zorunludur
- Firebase App Hosting GitHub, GitLab veya Bitbucket ile çalışır
- Yerel Git repository zaten oluşturuldu ✅

