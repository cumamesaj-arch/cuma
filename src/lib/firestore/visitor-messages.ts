/**
 * Firebase Firestore Visitor Messages Helper Fonksiyonları
 * 
 * Bu dosya Visitor Messages (Ziyaretçi Mesajları) koleksiyonu için tüm CRUD işlemlerini içerir.
 * Server-side (Admin SDK) kullanır.
 */

import type { VisitorMessage } from '@/lib/types';
import {
  ensureFirestoreConnection,
  handleFirestoreError,
  firestoreDocToObject,
  objectToFirestoreDoc,
} from './common';

const COLLECTION_NAME = 'visitorMessages';

/**
 * Tüm ziyaretçi mesajlarını getirir
 * @param filters - Filtreleme seçenekleri
 * @returns VisitorMessage array
 */
export async function getVisitorMessages(filters?: {
  limit?: number;
  orderBy?: 'createdAt';
  orderDirection?: 'asc' | 'desc';
}): Promise<VisitorMessage[]> {
  try {
    const db = ensureFirestoreConnection();
    
    let query: FirebaseFirestore.Query = db.collection(COLLECTION_NAME);
    
    // Sıralama
    const orderByField = filters?.orderBy || 'createdAt';
    const orderDirection = filters?.orderDirection || 'desc';
    query = query.orderBy(orderByField, orderDirection);
    
    // Limit
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    
    const snapshot = await query.get();
    
    return snapshot.docs.map(doc => {
      const data = firestoreDocToObject(doc.data());
      return {
        id: doc.id,
        ...data,
      } as VisitorMessage;
    });
  } catch (error) {
    throw handleFirestoreError(error, 'getVisitorMessages');
  }
}

/**
 * ID'ye göre ziyaretçi mesajı getirir
 * @param id - Mesaj ID'si
 * @returns VisitorMessage veya null
 */
export async function getVisitorMessageById(id: string): Promise<VisitorMessage | null> {
  try {
    const db = ensureFirestoreConnection();
    const doc = await db.collection(COLLECTION_NAME).doc(id).get();
    
    if (!doc.exists) {
      return null;
    }
    
    const data = firestoreDocToObject(doc.data());
    return {
      id: doc.id,
      ...data,
    } as VisitorMessage;
  } catch (error) {
    throw handleFirestoreError(error, 'getVisitorMessageById');
  }
}

/**
 * Yeni ziyaretçi mesajı oluşturur
 * @param message - Mesaj verisi (id otomatik oluşturulur)
 * @returns Oluşturulan mesaj
 */
export async function createVisitorMessage(
  message: Omit<VisitorMessage, 'id'>
): Promise<VisitorMessage> {
  try {
    const db = ensureFirestoreConnection();
    
    // ID otomatik oluştur
    const id = `message-${Date.now()}`;
    
    const messageData: VisitorMessage = {
      id,
      ...message,
      createdAt: message.createdAt || new Date().toISOString(),
    };
    
    const docData = objectToFirestoreDoc(messageData);
    await db.collection(COLLECTION_NAME).doc(id).set(docData);
    
    return messageData;
  } catch (error) {
    throw handleFirestoreError(error, 'createVisitorMessage');
  }
}

/**
 * Ziyaretçi mesajı siler
 * @param id - Mesaj ID'si
 */
export async function deleteVisitorMessage(id: string): Promise<void> {
  try {
    const db = ensureFirestoreConnection();
    await db.collection(COLLECTION_NAME).doc(id).delete();
  } catch (error) {
    throw handleFirestoreError(error, 'deleteVisitorMessage');
  }
}

