# Firebase Test İçin Yapılandırma

## Gerekli Environment Variables

Firebase Admin SDK için `.env.local` dosyasına şu değişkenleri eklemeniz gerekiyor:

```env
# Firebase Admin SDK (Server-side için)
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
```

## Firebase Admin SDK Key Nasıl Alınır?

1. [Firebase Console](https://console.firebase.google.com/)'a gidin
2. Projenizi seçin
3. Sol menüden **Project Settings** (⚙️) tıklayın
4. **Service Accounts** sekmesine gidin
5. **Generate New Private Key** butonuna tıklayın
6. İndirilen JSON dosyasını açın
7. Şu bilgileri `.env.local` dosyasına ekleyin:
   - `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY`
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

**ÖNEMLİ:** `FIREBASE_ADMIN_PRIVATE_KEY` değerini JSON'dan kopyalarken, `\n` karakterlerini koruyun veya script'te zaten `replace(/\\n/g, '\n')` ile düzeltiliyor.

## Test Etme

Environment variables'ları ekledikten sonra:

```bash
npm run test:firebase
```

## Alternatif: Firebase Emulator Kullanma

Eğer gerçek Firebase projesi yoksa, Firebase Emulator kullanabilirsiniz:

```bash
npm run firebase:emulators
```

Sonra test scriptini emulator modunda çalıştırabiliriz.



## Gerekli Environment Variables

Firebase Admin SDK için `.env.local` dosyasına şu değişkenleri eklemeniz gerekiyor:

```env
# Firebase Admin SDK (Server-side için)
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
```

## Firebase Admin SDK Key Nasıl Alınır?

1. [Firebase Console](https://console.firebase.google.com/)'a gidin
2. Projenizi seçin
3. Sol menüden **Project Settings** (⚙️) tıklayın
4. **Service Accounts** sekmesine gidin
5. **Generate New Private Key** butonuna tıklayın
6. İndirilen JSON dosyasını açın
7. Şu bilgileri `.env.local` dosyasına ekleyin:
   - `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY`
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

**ÖNEMLİ:** `FIREBASE_ADMIN_PRIVATE_KEY` değerini JSON'dan kopyalarken, `\n` karakterlerini koruyun veya script'te zaten `replace(/\\n/g, '\n')` ile düzeltiliyor.

## Test Etme

Environment variables'ları ekledikten sonra:

```bash
npm run test:firebase
```

## Alternatif: Firebase Emulator Kullanma

Eğer gerçek Firebase projesi yoksa, Firebase Emulator kullanabilirsiniz:

```bash
npm run firebase:emulators
```

Sonra test scriptini emulator modunda çalıştırabiliriz.

