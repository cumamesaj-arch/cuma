# 🌿 Live Branch Görememe Sorunu - Çözüm

## ❓ Sorun

Firebase App Hosting Deployment Settings'te Live Branch dropdown'ında branch seçenekleri görünmüyor.

## 🔍 Neden?

Firebase App Hosting **Git repository bağlantısı** gerektirir. Branch'ler Git repository'den gelir.

## ✅ Çözüm Adımları

### Adım 1: Firebase Console'da Repository Bağlantısı

1. **Firebase Console → App Hosting → Settings** sayfasına gidin
   - URL: https://console.firebase.google.com/project/cuma-mesajlari-dfc6c/apphosting/settings
   - Chrome'da açıldı ✅

2. **"Connect repository" veya "Repository bağla" butonunu bulun**
   - Bu buton Settings sayfasında olmalı
   - Eğer görünmüyorsa, "Initialize repository" butonunu arayın

### Adım 2: Repository Bağlama Seçenekleri

#### Seçenek A: GitHub Repository Bağlama

1. "Connect repository" butonuna tıklayın
2. **GitHub** seçeneğini seçin
3. GitHub hesabınızı bağlayın (izin verin)
4. Repository'yi seçin veya yeni oluşturun
5. "Connect" veya "Bağla" butonuna tıklayın

#### Seçenek B: Firebase Otomatik Repository

1. "Create repository" veya "Initialize repository" butonuna tıklayın
2. Firebase otomatik olarak bir Git repository oluşturur
3. Branch'ler otomatik görünür

### Adım 3: Branch'leri Görme

Repository bağlandıktan sonra:

1. **Deployment Settings** sayfasına geri dönün
2. **"Live Branch"** dropdown'ında branch'ler görünecek:
   - ✅ `main` (production için)
   - ✅ `master` (eski projeler için)
   - ✅ Diğer branch'ler (varsa)

3. **`main`** branch'ini seçin
4. **"Continue"** veya **"Save"** butonuna tıklayın

## 🔍 Firebase Console'da Kontrol

**Settings sayfasında şunları arayın**:
- "Connect repository" butonu
- "Initialize repository" butonu
- "Create repository" butonu
- "Git repository" bölümü

## 📝 Notlar

- Repository bağlantısı zorunludur
- Firebase App Hosting GitHub, GitLab veya Bitbucket ile çalışır
- Firebase otomatik repository de oluşturabilir

## 🎯 Şimdi Yapılacaklar

1. Firebase Console → App Hosting → Settings sayfasını açın
2. "Connect repository" veya "Initialize repository" butonunu bulun
3. Repository'yi bağlayın veya oluşturun
4. Branch'ler görünecek

