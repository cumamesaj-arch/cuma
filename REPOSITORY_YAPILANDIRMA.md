# 🔧 Git Repository Yapılandırma - Firebase App Hosting

## ❓ Soru

"Choose a branch" seçenekleri nereden geliyor? Yapılandırma gerekiyor mu?

## ✅ Cevap

**Evet, yapılandırma gerekiyor!**

Branch'ler **Git repository'den** gelir. Firebase App Hosting bir Git repository'ye bağlanmalı.

## 🚀 Yapılandırma Adımları

### Adım 1: Yerel Git Repository Hazır ✅

Yerel Git repository zaten oluşturuldu:
- ✅ Git repository mevcut
- ✅ `main` branch oluşturuldu

### Adım 2: Firebase App Hosting'de Repository Bağlama

Firebase Console'da yapılacaklar:

#### Seçenek A: GitHub Repository Bağlama (Önerilen)

1. **GitHub'da Repository Oluşturun**:
   - https://github.com/new
   - Repository adı: `cuma-mesajlari`
   - "Create repository" butonuna tıklayın

2. **Yerel Repository'yi GitHub'a Bağlayın**:
   ```bash
   cd project
   git remote add origin https://github.com/kullanici-adi/cuma-mesajlari.git
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

3. **Firebase App Hosting'de GitHub'ı Bağlayın**:
   - Firebase Console → App Hosting → Settings
   - "Connect repository" butonuna tıklayın
   - GitHub'ı seçin
   - Repository'yi seçin
   - "Connect" butonuna tıklayın

#### Seçenek B: Firebase Otomatik Repository

1. Firebase Console → App Hosting → Settings
2. "Initialize repository" veya "Create repository" butonuna tıklayın
3. Firebase otomatik olarak bir Git repository oluşturur
4. Branch'ler otomatik görünür

### Adım 3: Branch'leri Görme

Repository bağlandıktan sonra:

1. **Deployment Settings** sayfasına gidin
2. **"Live Branch"** dropdown'ında branch'ler görünecek:
   - ✅ `main` (production için)
   - ✅ Diğer branch'ler (varsa)

3. **`main`** branch'ini seçin
4. **"Continue"** butonuna tıklayın

## 📋 Hızlı Kontrol

**Yerel Git Repository**:
```bash
cd project
git branch
# main branch görünmeli
```

**Firebase Console'da**:
- App Hosting → Settings → Repository bağlantısı
- Deployment Settings → Live Branch dropdown

## 🎯 Şimdi Yapılacaklar

1. **GitHub Repository Oluşturun** (veya Firebase otomatik oluştursun)
2. **Firebase App Hosting'de Repository'yi Bağlayın**
3. **Branch'ler Görünecek**
4. **`main` Branch'ini Seçin**

