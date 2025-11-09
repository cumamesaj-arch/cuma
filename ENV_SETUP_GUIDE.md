# 🔧 Environment Variables Kurulum Rehberi

## Sorun
Site deploy edildi ama çalışmıyor. Muhtemelen Firebase environment variables eksik.

## Çözüm: Firebase Console'dan Environment Variables Ekleme

### Adım 1: Firebase Console'u Açın
1. Chrome'da şu adresi açın: https://console.firebase.google.com/project/studio-2885285944-396af
2. Sol menüden **"Project Settings"** (⚙️) tıklayın
3. **"Your apps"** bölümünde **Web** (</>) ikonuna tıklayın
4. Firebase SDK yapılandırmasını kopyalayın

### Adım 2: Firebase Config Değerlerini Alın

Firebase Console'dan şu değerleri kopyalayın:
```javascript
{
  apiKey: "AIza...",
  authDomain: "studio-2885285944-396af.firebaseapp.com",
  projectId: "studio-2885285944-396af",
  storageBucket: "studio-2885285944-396af.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
}
```

### Adım 3: Environment Variables'ı Build'e Ekleyin

Firebase Hosting static hosting olduğu için, environment variables'ı build sırasında kullanmamız gerekiyor.

**Seçenek 1: `.env.production` Dosyası Oluşturun**

`project/.env.production` dosyası oluşturun:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=studio-2885285944-396af.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studio-2885285944-396af
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=studio-2885285944-396af.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Seçenek 2: Build Script'ini Güncelleyin**

`package.json`'daki build script'ini güncelleyin:
```json
"build": "NEXT_PUBLIC_FIREBASE_API_KEY=... NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=... next build"
```

### Adım 4: Yeniden Build ve Deploy

```bash
cd project
npm run build
firebase deploy --only hosting
```

## Notlar

- `NEXT_PUBLIC_` ile başlayan değişkenler client-side'da kullanılabilir
- Environment variables build sırasında Next.js tarafından bundle'a dahil edilir
- Firebase Hosting static hosting olduğu için runtime environment variables kullanılamaz

