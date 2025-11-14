// Firebase Admin SDK yapılandırması (Server-side için)
// Not: Bu dosya sadece server-side'da kullanılır
import { initializeApp, getApps, cert, ServiceAccount, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminApp: App | undefined;
let adminDb: Firestore | undefined;
let adminAuth: Auth | undefined;
let isInitialized = false;

/**
 * Firebase Admin SDK'yı başlatır (lazy initialization)
 * Bu fonksiyon ilk kullanımda otomatik çağrılır
 */
function initializeFirebaseAdmin() {
  // Zaten başlatıldıysa tekrar başlatma
  if (isInitialized) {
    return;
  }

  // Sadece server-side'da çalıştır
  if (typeof window !== 'undefined') {
    return;
  }

  // Önce environment variables'dan al
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  let projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  let clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL;
  
  if (!privateKey && process.env.NODE_ENV === 'development') {
    console.warn('⚠️  FIREBASE_ADMIN_PRIVATE_KEY bulunamadı. Lütfen .env.local dosyasına ekleyin!');
  }
  
  if (privateKey && projectId && clientEmail) {
    try {
      // Private key'deki tırnak işaretlerini ve escape karakterlerini temizle
      let cleanPrivateKey = privateKey;
      
      // Eğer tırnak içindeyse, tırnakları kaldır
      if (cleanPrivateKey.startsWith('"') && cleanPrivateKey.endsWith('"')) {
        cleanPrivateKey = cleanPrivateKey.slice(1, -1);
      }
      if (cleanPrivateKey.startsWith("'") && cleanPrivateKey.endsWith("'")) {
        cleanPrivateKey = cleanPrivateKey.slice(1, -1);
      }
      
      // \n karakterlerini gerçek newline'lara çevir
      cleanPrivateKey = cleanPrivateKey.replace(/\\n/g, '\n');
      
      const serviceAccount: ServiceAccount = {
        projectId,
        clientEmail,
        privateKey: cleanPrivateKey,
      };

      if (getApps().length === 0) {
        adminApp = initializeApp({
          credential: cert(serviceAccount),
          projectId: serviceAccount.projectId,
        });
      } else {
        adminApp = getApps()[0];
      }

      adminDb = getFirestore(adminApp);
      adminAuth = getAuth(adminApp);
      
      isInitialized = true;
      console.log('✅ Firebase Admin SDK başarıyla başlatıldı');
    } catch (error) {
      console.error('❌ Firebase Admin initialization error:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
      isInitialized = false;
    }
  } else {
    console.warn('⚠️  Firebase Admin SDK yapılandırılamadı. Gerekli environment variables eksik.');
    console.warn(`  privateKey: ${privateKey ? 'Var' : 'Yok'}`);
    console.warn(`  projectId: ${projectId ? 'Var' : 'Yok'}`);
    console.warn(`  clientEmail: ${clientEmail ? 'Var' : 'Yok'}`);
    isInitialized = false;
  }
}

// İlk kullanımda başlat (Next.js server-side'da otomatik çalışır)
if (typeof window === 'undefined') {
  // Lazy initialization - ilk import'ta değil, ilk kullanımda başlat
  // Bu sayede environment variables'lar yüklenmiş olur
}

// Lazy getter fonksiyonları - ilk kullanımda başlat
export function getAdminApp(): App | undefined {
  initializeFirebaseAdmin();
  return adminApp;
}

export function getAdminDb(): Firestore | undefined {
  initializeFirebaseAdmin();
  return adminDb;
}

export function getAdminAuth(): Auth | undefined {
  initializeFirebaseAdmin();
  return adminAuth;
}

// Eski export'lar (backward compatibility)
export { adminApp, adminDb, adminAuth, initializeFirebaseAdmin };
export default adminApp;













