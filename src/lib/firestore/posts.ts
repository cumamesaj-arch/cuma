/**
 * Firebase Firestore Posts Helper Fonksiyonları
 * 
 * Bu dosya Posts (Gönderiler) koleksiyonu için tüm CRUD işlemlerini içerir.
 * Server-side (Admin SDK) kullanır.
 */

import type { Post } from '@/lib/types';
import {
  ensureFirestoreConnection,
  handleFirestoreError,
  firestoreDocToObject,
  objectToFirestoreDoc,
  getFirestoreBatch,
} from './common';

const COLLECTION_NAME = 'posts';
const DELETED_COLLECTION_NAME = 'deletedPosts';

/**
 * Tüm gönderileri getirir
 * @param filters - Filtreleme seçenekleri
 * @returns Post array
 */
export async function getPosts(filters?: {
  category?: string;
  status?: 'published' | 'draft';
  limit?: number;
  orderBy?: 'createdAt' | 'order' | 'title';
  orderDirection?: 'asc' | 'desc';
}): Promise<Post[]> {
  try {
    const db = ensureFirestoreConnection();
    
    let query: FirebaseFirestore.Query = db.collection(COLLECTION_NAME);
    
    // Filtreleme
    if (filters?.category) {
      query = query.where('category', '==', filters.category);
    }
    
    if (filters?.status) {
      query = query.where('status', '==', filters.status);
    } else {
      // Varsayılan olarak sadece published gönderileri getir
      query = query.where('status', '==', 'published');
    }
    
    // Sıralama
    const orderByField = filters?.orderBy || 'createdAt';
    const orderDirection: 'asc' | 'desc' = filters?.orderDirection || 'desc';
    query = query.orderBy(orderByField, orderDirection);
    
    // Limit
    if (filters?.limit && filters.limit > 0) {
      query = query.limit(filters.limit);
    }
    
    const snapshot = await query.get();
    
    if (snapshot.empty) {
      return [];
    }
    
    return snapshot.docs
      .map(doc => firestoreDocToObject<Post>(doc))
      .filter((post): post is Post => post !== null);
  } catch (error) {
    console.error('Error getting posts:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Tüm gönderileri getirir (admin için - status filtresi olmadan)
 */
export async function getAllPosts(): Promise<Post[]> {
  try {
    const db = ensureFirestoreConnection();
    
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .orderBy('createdAt', 'desc')
      .get();
    
    if (snapshot.empty) {
      return [];
    }
    
    return snapshot.docs
      .map(doc => firestoreDocToObject<Post>(doc))
      .filter((post): post is Post => post !== null);
  } catch (error) {
    console.error('Error getting all posts:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * ID'ye göre tek bir gönderi getirir
 */
export async function getPostById(postId: string): Promise<Post | null> {
  try {
    const db = ensureFirestoreConnection();
    
    const doc = await db.collection(COLLECTION_NAME).doc(postId).get();
    
    if (!doc.exists) {
      return null;
    }
    
    return firestoreDocToObject<Post>(doc);
  } catch (error) {
    console.error('Error getting post by id:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Slug'a göre tek bir gönderi getirir
 */
export async function getPostBySlug(slug: string, category?: string): Promise<Post | null> {
  try {
    const db = ensureFirestoreConnection();
    
    let query: FirebaseFirestore.Query = db
      .collection(COLLECTION_NAME)
      .where('slug', '==', slug);
    
    if (category) {
      query = query.where('category', '==', category);
    }
    
    const snapshot = await query.limit(1).get();
    
    if (snapshot.empty) {
      return null;
    }
    
    return firestoreDocToObject<Post>(snapshot.docs[0]);
  } catch (error) {
    console.error('Error getting post by slug:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Yeni gönderi oluşturur
 */
export async function createPost(postData: Post): Promise<Post> {
  try {
    const db = ensureFirestoreConnection();
    
    // ID'yi document ID olarak kullan
    const docRef = db.collection(COLLECTION_NAME).doc(postData.id);
    
    // Mevcut gönderiyi kontrol et
    const existingDoc = await docRef.get();
    if (existingDoc.exists) {
      throw new Error(`Gönderi ID'si zaten mevcut: ${postData.id}`);
    }
    
    // Objeyi Firestore formatına çevir
    const firestoreData = objectToFirestoreDoc(postData);
    
    // Oluşturma tarihini ekle/güncelle
    if (!firestoreData.createdAt) {
      const { Timestamp } = await import('firebase-admin/firestore');
      firestoreData.createdAt = Timestamp.now();
    }
    
    await docRef.set(firestoreData);
    
    // Oluşturulan gönderiyi geri döndür
    const createdDoc = await docRef.get();
    const createdPost = firestoreDocToObject<Post>(createdDoc);
    
    if (!createdPost) {
      throw new Error('Gönderi oluşturuldu ancak okunamadı.');
    }
    
    return createdPost;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Gönderi günceller
 */
export async function updatePost(postId: string, updates: Partial<Post>): Promise<Post> {
  try {
    const db = ensureFirestoreConnection();
    
    const docRef = db.collection(COLLECTION_NAME).doc(postId);
    
    // Mevcut gönderiyi kontrol et
    const existingDoc = await docRef.get();
    if (!existingDoc.exists) {
      throw new Error(`Gönderi bulunamadı: ${postId}`);
    }
    
    // ID'yi updates'den çıkar (document ID değiştirilemez)
    const { id, ...updateData } = updates;
    
    // Objeyi Firestore formatına çevir
    const firestoreData = objectToFirestoreDoc(updateData as Post);
    
    await docRef.update(firestoreData);
    
    // Güncellenmiş gönderiyi geri döndür
    const updatedDoc = await docRef.get();
    const updatedPost = firestoreDocToObject<Post>(updatedDoc);
    
    if (!updatedPost) {
      throw new Error('Gönderi güncellendi ancak okunamadı.');
    }
    
    return updatedPost;
  } catch (error) {
    console.error('Error updating post:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Gönderiyi siler (çöp kutusuna taşır)
 */
export async function deletePost(postId: string): Promise<void> {
  try {
    const db = ensureFirestoreConnection();
    
    const docRef = db.collection(COLLECTION_NAME).doc(postId);
    const deletedDocRef = db.collection(DELETED_COLLECTION_NAME).doc(postId);
    
    // Mevcut gönderiyi al
    const existingDoc = await docRef.get();
    if (!existingDoc.exists) {
      throw new Error(`Gönderi bulunamadı: ${postId}`);
    }
    
    const postData = firestoreDocToObject<Post & { deletedAt: string }>(existingDoc);
    if (!postData) {
      throw new Error('Gönderi okunamadı.');
    }
    
    // Silinme tarihini ekle
    const { Timestamp } = await import('firebase-admin/firestore');
    const deletedPost = {
      ...postData,
      deletedAt: Timestamp.now().toDate().toISOString(),
    };
    
    // Çöp kutusuna taşı
    const firestoreDeletedData = objectToFirestoreDoc(deletedPost);
    await deletedDocRef.set(firestoreDeletedData);
    
    // Orijinal gönderiyi sil
    await docRef.delete();
  } catch (error) {
    console.error('Error deleting post:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Gönderiyi çöp kutusundan geri getirir
 */
export async function restorePost(postId: string): Promise<Post> {
  try {
    const db = ensureFirestoreConnection();
    
    const deletedDocRef = db.collection(DELETED_COLLECTION_NAME).doc(postId);
    const docRef = db.collection(COLLECTION_NAME).doc(postId);
    
    // Silinen gönderiyi al
    const deletedDoc = await deletedDocRef.get();
    if (!deletedDoc.exists) {
      throw new Error(`Silinen gönderi bulunamadı: ${postId}`);
    }
    
    const deletedPost = firestoreDocToObject<Post & { deletedAt: string }>(deletedDoc);
    if (!deletedPost) {
      throw new Error('Silinen gönderi okunamadı.');
    }
    
    // deletedAt alanını çıkar
    const { deletedAt, ...postData } = deletedPost;
    
    // Orijinal koleksiyona geri ekle
    const firestoreData = objectToFirestoreDoc(postData);
    await docRef.set(firestoreData);
    
    // Çöp kutusundan sil
    await deletedDocRef.delete();
    
    // Geri getirilen gönderiyi döndür
    const restoredDoc = await docRef.get();
    const restoredPost = firestoreDocToObject<Post>(restoredDoc);
    
    if (!restoredPost) {
      throw new Error('Gönderi geri getirildi ancak okunamadı.');
    }
    
    return restoredPost;
  } catch (error) {
    console.error('Error restoring post:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Gönderiyi kalıcı olarak siler (çöp kutusundan da siler)
 */
export async function permanentlyDeletePost(postId: string): Promise<void> {
  try {
    const db = ensureFirestoreConnection();
    
    const deletedDocRef = db.collection(DELETED_COLLECTION_NAME).doc(postId);
    
    // Çöp kutusundan kalıcı olarak sil
    await deletedDocRef.delete();
  } catch (error) {
    console.error('Error permanently deleting post:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Silinen gönderileri getirir (çöp kutusu)
 */
export async function getDeletedPosts(): Promise<(Post & { deletedAt: string })[]> {
  try {
    const db = ensureFirestoreConnection();
    
    const snapshot = await db
      .collection(DELETED_COLLECTION_NAME)
      .orderBy('deletedAt', 'desc')
      .get();
    
    if (snapshot.empty) {
      return [];
    }
    
    return snapshot.docs
      .map(doc => firestoreDocToObject<Post & { deletedAt: string }>(doc))
      .filter((post): post is Post & { deletedAt: string } => post !== null);
  } catch (error) {
    console.error('Error getting deleted posts:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Çöp kutusunu tamamen temizler
 */
export async function emptyDeletedPosts(): Promise<void> {
  try {
    const db = ensureFirestoreConnection();
    
    const snapshot = await db.collection(DELETED_COLLECTION_NAME).get();
    
    if (snapshot.empty) {
      return;
    }
    
    // Batch delete (500'e kadar)
    const batch = getFirestoreBatch();
    let count = 0;
    
    for (const doc of snapshot.docs) {
      batch.delete(doc.ref);
      count++;
      
      // Firestore batch limit: 500
      if (count >= 500) {
        await batch.commit();
        count = 0;
      }
    }
    
    if (count > 0) {
      await batch.commit();
    }
  } catch (error) {
    console.error('Error emptying deleted posts:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Gönderi sırasını günceller
 */
export async function updatePostOrder(postId: string, newOrder: number): Promise<void> {
  try {
    await updatePost(postId, { order: newOrder });
  } catch (error) {
    console.error('Error updating post order:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * İki gönderinin tarihlerini değiştirir
 */
export async function swapPostDates(postIdA: string, postIdB: string): Promise<void> {
  try {
    const db = ensureFirestoreConnection();
    
    const docRefA = db.collection(COLLECTION_NAME).doc(postIdA);
    const docRefB = db.collection(COLLECTION_NAME).doc(postIdB);
    
    // Her iki gönderiyi de al
    const [docA, docB] = await Promise.all([docRefA.get(), docRefB.get()]);
    
    if (!docA.exists) {
      throw new Error(`Gönderi bulunamadı: ${postIdA}`);
    }
    if (!docB.exists) {
      throw new Error(`Gönderi bulunamadı: ${postIdB}`);
    }
    
    const postA = firestoreDocToObject<Post>(docA);
    const postB = firestoreDocToObject<Post>(docB);
    
    if (!postA || !postB) {
      throw new Error('Gönderiler okunamadı.');
    }
    
    // Tarihleri değiştir
    const batch = getFirestoreBatch();
    const { Timestamp } = await import('firebase-admin/firestore');
    
    batch.update(docRefA, {
      createdAt: isoToTimestamp(postB.createdAt),
    });
    
    batch.update(docRefB, {
      createdAt: isoToTimestamp(postA.createdAt),
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error swapping post dates:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Gönderi durumunu günceller (published/draft)
 */
export async function updatePostStatus(
  postId: string,
  status: 'published' | 'draft'
): Promise<void> {
  try {
    await updatePost(postId, { status });
  } catch (error) {
    console.error('Error updating post status:', error);
    throw new Error(handleFirestoreError(error));
  }
}

// Helper function for swapPostDates
async function isoToTimestamp(isoString: string) {
  const { Timestamp } = await import('firebase-admin/firestore');
  return Timestamp.fromDate(new Date(isoString));
}

