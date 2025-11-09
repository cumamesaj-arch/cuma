# 🚀 Yayınlama İşlemi - Adım Adım

## Adım 1: Firebase Proje Durumu ✅
- Aktif proje: `deneme-aadbc` (Firebase CLI'da)
- Hedef proje: `cumamesajlari-6eeef` (.firebaserc dosyasında)

## Adım 2: Environment Variables Kontrolü

Firebase Studio'da Secrets Manager'a gidin ve şu değişkenleri kontrol edin:

### Zorunlu Değişkenler:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` → `cumamesajlari-6eeef.firebaseapp.com`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` → `cumamesajlari-6eeef`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` → `cumamesajlari-6eeef.appspot.com`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

**Bu değerleri nereden alırsınız:**
1. Firebase Console: https://console.firebase.google.com/project/cumamesajlari-6eeef
2. Project Settings → Your apps → Web app config

## Adım 3: Production Build

```bash
cd project
npm run build
```

## Adım 4: Firebase Hosting Kontrolü

Firebase Console'da:
1. https://console.firebase.google.com/project/cumamesajlari-6eeef/hosting
2. Hosting etkin mi kontrol edin
3. Etkin değilse "Get started" ile etkinleştirin

## Adım 5: Deploy İşlemi

### Seçenek A: Firebase Studio (Önerilen)
1. Firebase Studio'da projeyi açın
2. "Deploy" veya "Publish" butonuna tıklayın
3. Build otomatik başlar ve deploy yapılır

### Seçenek B: Firebase CLI
```bash
cd project
firebase use cumamesajlari-6eeef
firebase deploy --only hosting
```

## Adım 6: Deploy Sonrası Test

1. Site URL: `https://cumamesajlari-6eeef.web.app`
2. Ana sayfa açılıyor mu?
3. Admin paneli çalışıyor mu? (`/admin`)

