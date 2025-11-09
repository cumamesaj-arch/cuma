# Firebase Studio Kurulum Kılavuzu

Bu proje Firebase Studio ile geliştirilmiştir. Firebase servislerini kullanmak için aşağıdaki adımları takip edin.

## 1. Firebase Projesi Oluşturma

1. [Firebase Console](https://console.firebase.google.com/)'a gidin
2. Yeni bir proje oluşturun veya mevcut bir projeyi seçin
3. Web uygulaması ekleyin ve yapılandırma bilgilerini alın

## 2. Environment Variables Ayarlama

1. `env.example` dosyasını `.env.local` olarak kopyalayın:
   ```bash
   cp env.example .env.local
   ```

2. `.env.local` dosyasını açın ve Firebase yapılandırma bilgilerinizi girin:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   
   GOOGLE_GENAI_API_KEY=your_google_genai_api_key_here
   ```

3. Firebase Studio'da Secrets Manager'ı kullanarak environment variables ekleyebilirsiniz.

## 3. Firebase Servislerini Yapılandırma

### Firestore Database
1. Firebase Console'da Firestore Database'i etkinleştirin
2. Test modunda başlatın veya `firestore.rules` dosyasındaki kuralları uygulayın
3. İndeksleri oluşturmak için `firestore.indexes.json` dosyasını Firebase'e yükleyin

### Storage
1. Firebase Console'da Storage'ı etkinleştirin
2. `storage.rules` dosyasındaki kuralları uygulayın

### Authentication
1. Firebase Console'da Authentication'ı etkinleştirin
2. İstediğiniz sign-in method'ları seçin (Email/Password, Google, vb.)

## 4. Firebase Project ID Ayarlama

`.firebaserc` dosyasındaki `your-firebase-project-id` değerini kendi proje ID'niz ile değiştirin:
```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

## 5. Firebase Emulators (Opsiyonel - Lokal Geliştirme)

Firebase emulators'ı lokal geliştirme için kullanabilirsiniz:

```bash
npm run firebase:emulators
```

Emulators şu portlarda çalışacak:
- Firestore: http://localhost:8080
- Auth: http://localhost:9099
- Storage: http://localhost:9199
- UI: http://localhost:4000

## 6. Projeyi Çalıştırma

### Firebase Studio'da
Firebase Studio otomatik olarak `npm run dev` komutunu çalıştırır. `.idx/dev.nix` dosyasında yapılandırılmıştır.

### Lokal olarak
```bash
npm install
npm run dev
```

Sunucu http://localhost:9002 adresinde çalışacaktır.

## 7. Firebase SDK Kullanımı

### Client-side (Browser)
```typescript
import { db, auth, storage } from '@/lib/firebase';

// Firestore örneği
import { collection, getDocs } from 'firebase/firestore';
const postsRef = collection(db, 'posts');
const snapshot = await getDocs(postsRef);
```

### Server-side (API Routes/Server Actions)
```typescript
import { adminDb, adminAuth } from '@/lib/firebase-admin';

// Firestore Admin örneği
const postsRef = adminDb.collection('posts');
const snapshot = await postsRef.get();
```

## 8. Firebase Hosting'e Deploy

Projeyi Firebase Hosting'e deploy etmek için:

```bash
npm run build
npm run firebase:deploy
```

## Notlar

- Firebase SDK client-side ve server-side için ayrı dosyalarda yapılandırılmıştır
- Environment variables Firebase Studio Secrets Manager ile yönetilebilir
- `.env.local` dosyası git'e commit edilmemelidir (zaten .gitignore'da)
- Production'da Firebase Hosting kullanılırken `next export` yerine `next build` kullanın











