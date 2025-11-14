/**
 * Firebase Firestore Ortak Helper Fonksiyonları
 * 
 * Bu dosya tüm Firestore işlemlerinde kullanılan ortak fonksiyonları içerir:
 * - Hata yönetimi
 * - Type dönüşümleri
 * - Timestamp işlemleri
 */

import { getAdminDb, initializeFirebaseAdmin } from '@/lib/firebase-admin';
import { Timestamp, FieldValue, Firestore } from 'firebase-admin/firestore';

// adminDb'yi lazy getter olarak kullan
let adminDb: Firestore | undefined;

/**
 * Firestore hatalarını yakalayıp kullanıcı dostu mesajlara dönüştürür
 */
export function handleFirestoreError(error: unknown): string {
  if (error instanceof Error) {
    // Firebase hata kodlarını Türkçe'ye çevir
    if (error.message.includes('permission-denied')) {
      return 'Bu işlem için yetkiniz yok.';
    }
    if (error.message.includes('not-found')) {
      return 'Kayıt bulunamadı.';
    }
    if (error.message.includes('already-exists')) {
      return 'Bu kayıt zaten mevcut.';
    }
    if (error.message.includes('invalid-argument')) {
      return 'Geçersiz veri gönderildi.';
    }
    if (error.message.includes('unavailable')) {
      return 'Firebase servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.';
    }
    if (error.message.includes('deadline-exceeded')) {
      return 'İşlem zaman aşımına uğradı. Lütfen tekrar deneyin.';
    }
    return error.message || 'Bilinmeyen bir hata oluştu.';
  }
  return 'Bilinmeyen bir hata oluştu.';
}

/**
 * Firestore Timestamp'i ISO string'e dönüştürür
 */
export function timestampToISO(timestamp: Timestamp | FieldValue | undefined): string {
  if (!timestamp || timestamp instanceof FieldValue) {
    return new Date().toISOString();
  }
  return timestamp.toDate().toISOString();
}

/**
 * ISO string'i Firestore Timestamp'e dönüştürür
 */
export function isoToTimestamp(isoString: string | undefined): Timestamp {
  if (!isoString) {
    return Timestamp.now();
  }
  return Timestamp.fromDate(new Date(isoString));
}

/**
 * Firestore document'ını JavaScript objesine dönüştürür
 * Timestamp'leri ISO string'e çevirir
 */
export function firestoreDocToObject<T>(doc: FirebaseFirestore.DocumentSnapshot): T | null {
  if (!doc.exists) {
    return null;
  }
  
  const data = doc.data();
  if (!data) {
    return null;
  }
  
  // Timestamp'leri ISO string'e çevir
  const converted = Object.entries(data).reduce((acc, [key, value]) => {
    if (value instanceof Timestamp) {
      acc[key] = value.toDate().toISOString();
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Nested objeleri recursive olarak işle
      acc[key] = convertTimestampsInObject(value);
    } else if (Array.isArray(value)) {
      // Array içindeki objeleri işle
      acc[key] = value.map(item => 
        item && typeof item === 'object' && !(item instanceof Timestamp)
          ? convertTimestampsInObject(item)
          : item instanceof Timestamp
          ? item.toDate().toISOString()
          : item
      );
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
  
  return { id: doc.id, ...converted } as T;
}

/**
 * Obje içindeki tüm Timestamp'leri ISO string'e çevirir (recursive)
 */
function convertTimestampsInObject(obj: any): any {
  if (!obj || typeof obj !== 'object' || obj instanceof Timestamp) {
    return obj instanceof Timestamp ? obj.toDate().toISOString() : obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => convertTimestampsInObject(item));
  }
  
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value instanceof Timestamp) {
      acc[key] = value.toDate().toISOString();
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      acc[key] = convertTimestampsInObject(value);
    } else if (Array.isArray(value)) {
      acc[key] = value.map(item => convertTimestampsInObject(item));
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
}

/**
 * JavaScript objesini Firestore document'ına dönüştürür
 * ISO string'leri Timestamp'e çevirir
 */
export function objectToFirestoreDoc<T extends Record<string, any>>(obj: T): Record<string, any> {
  const converted = Object.entries(obj).reduce((acc, [key, value]) => {
    // id alanını atla (document ID olarak kullanılacak)
    if (key === 'id') {
      return acc;
    }
    
    // ISO string formatındaki tarihleri Timestamp'e çevir
    if (typeof value === 'string' && isISOString(value)) {
      acc[key] = isoToTimestamp(value);
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Nested objeleri recursive olarak işle
      acc[key] = convertISOStringsInObject(value);
    } else if (Array.isArray(value)) {
      // Array içindeki string'leri kontrol et
      acc[key] = value.map(item => 
        typeof item === 'string' && isISOString(item)
          ? isoToTimestamp(item)
          : item && typeof item === 'object'
          ? convertISOStringsInObject(item)
          : item
      );
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
  
  return converted;
}

/**
 * Obje içindeki tüm ISO string'leri Timestamp'e çevirir (recursive)
 */
function convertISOStringsInObject(obj: any): any {
  if (!obj || typeof obj !== 'object') {
    return typeof obj === 'string' && isISOString(obj) ? isoToTimestamp(obj) : obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => convertISOStringsInObject(item));
  }
  
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (typeof value === 'string' && isISOString(value)) {
      acc[key] = isoToTimestamp(value);
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      acc[key] = convertISOStringsInObject(value);
    } else if (Array.isArray(value)) {
      acc[key] = value.map(item => convertISOStringsInObject(item));
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
}

/**
 * String'in ISO 8601 formatında olup olmadığını kontrol eder
 */
function isISOString(str: string): boolean {
  // Basit kontrol: ISO 8601 formatı (YYYY-MM-DDTHH:mm:ss.sssZ)
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
  return isoRegex.test(str) && !isNaN(Date.parse(str));
}

/**
 * Firestore bağlantısının hazır olup olmadığını kontrol eder ve Firestore instance'ını döndürür
 * @returns Firestore instance
 * @throws Error if connection is not available
 */
export function ensureFirestoreConnection(): Firestore {
  // Lazy initialization - eğer henüz başlatılmadıysa başlat
  if (!adminDb) {
    initializeFirebaseAdmin();
    adminDb = getAdminDb();
  }
  
  if (!adminDb) {
    throw new Error('Firebase Admin bağlantısı kurulamadı. Lütfen environment variables kontrol edin.');
  }
  return adminDb;
}

/**
 * Firestore batch işlemleri için batch helper
 */
export function getFirestoreBatch() {
  const db = ensureFirestoreConnection();
  return db.batch();
}

