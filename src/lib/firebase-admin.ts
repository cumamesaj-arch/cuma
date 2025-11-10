// Firebase Admin SDK yapılandırması (Server-side için)
// Not: Bu dosya sadece server-side'da kullanılır
import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let adminApp;
let adminDb;
let adminAuth;

// Sadece server-side'da çalıştır
if (typeof window === 'undefined' && process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
  try {
    const serviceAccount: ServiceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
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
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

export { adminApp, adminDb, adminAuth };
export default adminApp;












