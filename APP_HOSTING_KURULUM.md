# 🚀 Firebase App Hosting - Deployment Settings Kurulumu

## 📋 Deployment Settings Sayfasında

### 1. Live Branch (Production Deploys için)

**Ne Yapmalısınız:**
- **"Choose a branch"** dropdown'ından bir branch seçin
- Eğer branch yoksa: **"main"** veya **"master"** branch'i oluşturulacak
- Veya mevcut bir branch seçin

**Önerilen:**
- **"main"** branch'ini seçin (production için)

### 2. App Root Directory

**Mevcut Değer:** `/`

**Ne Yapmalısınız:**
- **`/`** olarak bırakın (proje root klasörü)
- Eğer proje alt klasördeyse (örn: `project/`), o zaman `/project` yazın
- Bizim durumumuzda: **`/`** doğru ✅

## ✅ Yapılacaklar

1. **Live Branch**: 
   - Dropdown'dan **"main"** seçin
   - Veya yeni branch oluşturun: **"main"**

2. **App Root Directory**: 
   - **`/`** olarak bırakın (değiştirmeyin)

3. **"Continue"** veya **"Save"** butonuna tıklayın

## 📝 Notlar

- Branch seçimi önemli - production deploy'lar bu branch'ten yapılacak
- App root directory proje klasörünün root'u olmalı
- Kurulumdan sonra otomatik build başlayacak

## 🔄 Sonraki Adımlar

1. Branch seçimi yapıldıktan sonra
2. "Continue" butonuna tıklayın
3. Build otomatik başlayacak
4. Deploy tamamlandığında URL alacaksınız

