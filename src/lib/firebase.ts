// Firebase SDK yapılandırması
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase yapılandırma bilgileri
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Firebase uygulamasını başlat (singleton pattern)
let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;
let storage: FirebaseStorage | undefined;

// Sadece client-side'da çalışacak şekilde kontrol et
if (typeof window !== 'undefined') {
  // Firebase config kontrolü
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn('Firebase yapılandırması eksik. Lütfen environment variables kontrol edin.');
  } else {
    // Uygulama zaten başlatılmış mı kontrol et
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }

    // Firestore'u başlat
    db = getFirestore(app);

    // Auth'u başlat
    auth = getAuth(app);

    // Storage'ı başlat
    storage = getStorage(app);
  }
}

export { app, db, auth, storage };
export default app;

