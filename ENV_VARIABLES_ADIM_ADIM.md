# 🔧 Environment Variables Ekleme - Adım Adım

## 📋 Firebase Console'da Eklenecek Değişkenler

### Adım 1: Firebase Console'a Gidin

1. **Firebase Console → App Hosting → Settings**
2. **"Environment Variables"** sekmesine gidin
3. **"Add variable"** veya **"Değişken ekle"** butonuna tıklayın

### Adım 2: Değişkenleri Tek Tek Ekleyin

Her değişken için aşağıdaki adımları tekrarlayın:

#### 1. NEXT_PUBLIC_FIREBASE_API_KEY
- **Name**: `NEXT_PUBLIC_FIREBASE_API_KEY`
- **Value**: `AIzaSyB_YePigrW7TjzzXhrtoaimFktrlji8lRE`
- **"Save"** tıklayın

#### 2. NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- **Name**: `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- **Value**: `cuma-mesajlari-dfc6c.firebaseapp.com`
- **"Save"** tıklayın

#### 3. NEXT_PUBLIC_FIREBASE_PROJECT_ID
- **Name**: `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- **Value**: `cuma-mesajlari-dfc6c`
- **"Save"** tıklayın

#### 4. NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- **Name**: `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- **Value**: `cuma-mesajlari-dfc6c.firebasestorage.app`
- **"Save"** tıklayın

#### 5. NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- **Name**: `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- **Value**: `136445087189`
- **"Save"** tıklayın

#### 6. NEXT_PUBLIC_FIREBASE_APP_ID
- **Name**: `NEXT_PUBLIC_FIREBASE_APP_ID`
- **Value**: `1:136445087189:web:153086538227a86781015c`
- **"Save"** tıklayın

#### 7. NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
- **Name**: `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- **Value**: `G-512SQLEGJC`
- **"Save"** tıklayın

### Adım 3: Kontrol Edin

Tüm değişkenleri ekledikten sonra:

1. **7 değişken** listelenmiş olmalı
2. Her değişkenin **Name** ve **Value** değerleri doğru olmalı
3. **"Save"** veya **"Kaydet"** butonuna tıklayın (varsa)

## ✅ Tamamlandı

Environment variables eklendikten sonra:

1. **Yeniden deploy yapmanız gerekir**
2. **Deployment Settings** sayfasına gidin
3. **"Create deployment"** veya **"Redeploy"** tıklayın
4. **Build tamamlanana kadar bekleyin** (5-10 dakika)

## 📝 Hızlı Kopyala-Yapıştır

Eğer toplu ekleme yapabiliyorsanız, şu formatı kullanın:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB_YePigrW7TjzzXhrtoaimFktrlji8lRE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cuma-mesajlari-dfc6c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cuma-mesajlari-dfc6c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cuma-mesajlari-dfc6c.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=136445087189
NEXT_PUBLIC_FIREBASE_APP_ID=1:136445087189:web:153086538227a86781015c
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-512SQLEGJC
```

## ⚠️ Önemli Notlar

- `NEXT_PUBLIC_` ile başlayan değişkenler client-side'da kullanılabilir
- Environment variables eklendikten sonra yeniden deploy gerekir
- Değişkenler deployment sırasında build'e dahil edilir
- Değişken adlarını tam olarak yazın (büyük/küçük harf önemli)


