/**
 * Password Reset Token Helper Fonksiyonları
 * Şifre sıfırlama token'larını Firestore'da saklar
 */

import {
  ensureFirestoreConnection,
  handleFirestoreError,
  firestoreDocToObject,
  objectToFirestoreDoc,
} from './common';

const COLLECTION_NAME = 'password_reset_tokens';

export interface PasswordResetToken {
  id: string;
  email: string;
  token: string;
  expiresAt: string; // ISO string
  used: boolean;
  createdAt: string; // ISO string
}

/**
 * Şifre sıfırlama token'ı oluşturur
 * @param email - Kullanıcı email'i
 * @param token - Token string
 * @param expiresInHours - Token'ın geçerlilik süresi (saat)
 * @returns Oluşturulan token
 */
export async function createPasswordResetToken(
  email: string,
  token: string,
  expiresInHours: number = 1
): Promise<PasswordResetToken> {
  try {
    const db = ensureFirestoreConnection();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);
    
    const tokenData: Omit<PasswordResetToken, 'id'> = {
      email: email.toLowerCase(),
      token,
      expiresAt: expiresAt.toISOString(),
      used: false,
      createdAt: new Date().toISOString(),
    };
    
    const docRef = db.collection(COLLECTION_NAME).doc();
    await docRef.set(objectToFirestoreDoc(tokenData));
    
    return {
      id: docRef.id,
      ...tokenData,
    };
  } catch (error) {
    throw handleFirestoreError(error, 'createPasswordResetToken');
  }
}

/**
 * Token'a göre şifre sıfırlama token'ını getirir
 * @param token - Token string
 * @returns PasswordResetToken veya null
 */
export async function getPasswordResetTokenByToken(
  token: string
): Promise<PasswordResetToken | null> {
  try {
    const db = ensureFirestoreConnection();
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .where('token', '==', token)
      .where('used', '==', false)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    const data = firestoreDocToObject<PasswordResetToken>(doc);
    if (!data) {
      return null;
    }
    
    // Token'ın süresi dolmuş mu kontrol et
    const expiresAt = new Date(data.expiresAt);
    if (expiresAt < new Date()) {
      return null; // Token süresi dolmuş
    }
    
    return {
      id: doc.id,
      ...data,
    };
  } catch (error) {
    throw handleFirestoreError(error, 'getPasswordResetTokenByToken');
  }
}

/**
 * Token'ı kullanıldı olarak işaretler
 * @param tokenId - Token ID
 */
export async function markTokenAsUsed(tokenId: string): Promise<void> {
  try {
    const db = ensureFirestoreConnection();
    await db.collection(COLLECTION_NAME).doc(tokenId).update({
      used: true,
    });
  } catch (error) {
    throw handleFirestoreError(error, 'markTokenAsUsed');
  }
}

/**
 * Süresi dolmuş token'ları temizler (opsiyonel - cron job için)
 */
export async function cleanupExpiredTokens(): Promise<void> {
  try {
    const db = ensureFirestoreConnection();
    const now = new Date().toISOString();
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .where('expiresAt', '<', now)
      .get();
    
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  } catch (error) {
    throw handleFirestoreError(error, 'cleanupExpiredTokens');
  }
}

