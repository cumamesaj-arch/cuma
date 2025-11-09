# 🔧 Firebase App Hosting - Deployment Settings

## 📋 Deployment Settings Alanları

### 1. Live Branch (for production deploys)

**"Choose a branch"** alanına yazılacak:

#### Seçenek A: Git Repository Bağlıysa
- **Branch adı**: `main` (veya `master`)
- Git repository'deki mevcut branch adını yazın

#### Seçenek B: Git Repository Yoksa
Önce Git repository oluşturmalısınız:

```bash
cd project
git init
git add .
git commit -m "Initial commit"
git branch -M main
```

Sonra:
- **Branch adı**: `main`

### 2. App Root Directory

**"/"** alanına yazılacak:

#### Seçenek A: Proje Root Dizinde
- **App root directory**: `/` (veya boş bırakın)
- Proje dosyaları repository'nin root'unda ise

#### Seçenek B: Proje Alt Klasörde
- **App root directory**: `/project` (veya projenin bulunduğu klasör)
- Proje dosyaları `project/` klasöründe ise

## ✅ Doğru Değerler (Bu Proje İçin)

### Live Branch:
```
main
```

### App Root Directory:
```
/
```

**Not**: Eğer proje dosyaları `project/` klasöründe ise, o zaman `/project` yazın.

## 🔍 Kontrol

### Git Branch Kontrolü:
```bash
cd project
git branch
```

### Git Remote Kontrolü:
```bash
cd project
git remote -v
```

Eğer Git repository yoksa, önce oluşturmalısınız.

## 📝 Adım Adım

1. **Git Repository Hazırlayın** (yoksa):
   ```bash
   cd project
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   ```

2. **GitHub'a Push Edin** (opsiyonel ama önerilir):
   ```bash
   git remote add origin https://github.com/KULLANICI_ADI/cuma-mesajlar.git
   git push -u origin main
   ```

3. **Firebase App Hosting'de**:
   - **Live Branch**: `main` yazın
   - **App Root Directory**: `/` yazın (veya boş bırakın)

4. **"Continue"** veya **"Deploy"** tıklayın

