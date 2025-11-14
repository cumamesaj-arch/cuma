/**
 * Firebase Firestore Comments Helper Fonksiyonları
 * 
 * Bu dosya Comments (Yorumlar) koleksiyonu için tüm CRUD işlemlerini içerir.
 * Server-side (Admin SDK) kullanır.
 */

import type { Comment } from '@/lib/types';
import {
  ensureFirestoreConnection,
  handleFirestoreError,
  firestoreDocToObject,
  objectToFirestoreDoc,
} from './common';

const COLLECTION_NAME = 'comments';

/**
 * Tüm yorumları getirir
 * @param filters - Filtreleme seçenekleri
 * @returns Comment array
 */
export async function getComments(filters?: {
  postId?: string;
  limit?: number;
  orderBy?: 'createdAt';
  orderDirection?: 'asc' | 'desc';
}): Promise<Comment[]> {
  try {
    const db = ensureFirestoreConnection();
    
    let query: FirebaseFirestore.Query = db.collection(COLLECTION_NAME);
    
    // Filtreleme
    if (filters?.postId) {
      query = query.where('postId', '==', filters.postId);
    }
    
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
      } as Comment;
    });
  } catch (error) {
    throw handleFirestoreError(error, 'getComments');
  }
}

/**
 * ID'ye göre yorum getirir
 * @param id - Yorum ID'si
 * @returns Comment veya null
 */
export async function getCommentById(id: string): Promise<Comment | null> {
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
    } as Comment;
  } catch (error) {
    throw handleFirestoreError(error, 'getCommentById');
  }
}

/**
 * Yeni yorum oluşturur
 * @param comment - Yorum verisi (id otomatik oluşturulur)
 * @returns Oluşturulan yorum
 */
export async function createComment(comment: Omit<Comment, 'id'>): Promise<Comment> {
  try {
    const db = ensureFirestoreConnection();
    
    // ID otomatik oluştur
    const id = `comment-${Date.now()}`;
    
    const commentData: Comment = {
      id,
      ...comment,
    };
    
    const docData = objectToFirestoreDoc(commentData);
    await db.collection(COLLECTION_NAME).doc(id).set(docData);
    
    return commentData;
  } catch (error) {
    throw handleFirestoreError(error, 'createComment');
  }
}

/**
 * Yorum günceller
 * @param id - Yorum ID'si
 * @param updates - Güncellenecek alanlar
 * @returns Güncellenmiş yorum
 */
export async function updateComment(
  id: string,
  updates: Partial<Omit<Comment, 'id'>>
): Promise<Comment> {
  try {
    const db = ensureFirestoreConnection();
    
    const docRef = db.collection(COLLECTION_NAME).doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      throw new Error(`Yorum bulunamadı: ${id}`);
    }
    
    const updateData = objectToFirestoreDoc(updates);
    await docRef.update(updateData);
    
    const updatedDoc = await docRef.get();
    const data = firestoreDocToObject(updatedDoc.data());
    
    return {
      id: updatedDoc.id,
      ...data,
    } as Comment;
  } catch (error) {
    throw handleFirestoreError(error, 'updateComment');
  }
}

/**
 * Yorum siler
 * @param id - Yorum ID'si
 */
export async function deleteComment(id: string): Promise<void> {
  try {
    const db = ensureFirestoreConnection();
    await db.collection(COLLECTION_NAME).doc(id).delete();
  } catch (error) {
    throw handleFirestoreError(error, 'deleteComment');
  }
}

