/**
 * Firebase Firestore Images Helper Fonksiyonları
 * 
 * Bu dosya Images (Görseller) koleksiyonu için tüm CRUD işlemlerini içerir.
 * Server-side (Admin SDK) kullanır.
 */

import type { ImagePlaceholder } from '@/lib/placeholder-images';
import {
  ensureFirestoreConnection,
  handleFirestoreError,
  firestoreDocToObject,
  objectToFirestoreDoc,
  getFirestoreBatch,
} from './common';

const COLLECTION_NAME = 'images';
const DELETED_COLLECTION_NAME = 'deletedImages';

/**
 * Tüm görselleri getirir
 * @param filters - Filtreleme seçenekleri
 * @returns ImagePlaceholder array
 */
export async function getImages(filters?: {
  imageHint?: string;
  limit?: number;
  orderBy?: 'id' | 'description';
  orderDirection?: 'asc' | 'desc';
}): Promise<ImagePlaceholder[]> {
  try {
    const db = ensureFirestoreConnection();
    
    let query: FirebaseFirestore.Query = db.collection(COLLECTION_NAME);
    
    // Filtreleme
    if (filters?.imageHint) {
      query = query.where('imageHint', '==', filters.imageHint);
    }
    
    // Sıralama
    const orderByField = filters?.orderBy || 'id';
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
      .map(doc => firestoreDocToObject<ImagePlaceholder>(doc))
      .filter((image): image is ImagePlaceholder => image !== null);
  } catch (error) {
    console.error('Error getting images:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * ID'ye göre tek bir görsel getirir
 */
export async function getImageById(imageId: string): Promise<ImagePlaceholder | null> {
  try {
    const db = ensureFirestoreConnection();
    
    const doc = await db.collection(COLLECTION_NAME).doc(imageId).get();
    
    if (!doc.exists) {
      return null;
    }
    
    return firestoreDocToObject<ImagePlaceholder>(doc);
  } catch (error) {
    console.error('Error getting image by id:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Yeni görsel oluşturur
 */
export async function createImage(imageData: ImagePlaceholder): Promise<ImagePlaceholder> {
  try {
    const db = ensureFirestoreConnection();
    
    // ID'yi document ID olarak kullan
    const docRef = db.collection(COLLECTION_NAME).doc(imageData.id);
    
    // Mevcut görseli kontrol et
    const existingDoc = await docRef.get();
    if (existingDoc.exists) {
      throw new Error(`Görsel ID'si zaten mevcut: ${imageData.id}`);
    }
    
    // Objeyi Firestore formatına çevir
    const firestoreData = objectToFirestoreDoc(imageData);
    
    await docRef.set(firestoreData);
    
    // Oluşturulan görseli geri döndür
    const createdDoc = await docRef.get();
    const createdImage = firestoreDocToObject<ImagePlaceholder>(createdDoc);
    
    if (!createdImage) {
      throw new Error('Görsel oluşturuldu ancak okunamadı.');
    }
    
    return createdImage;
  } catch (error) {
    console.error('Error creating image:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Birden fazla görseli toplu olarak oluşturur
 */
export async function createImages(imagesData: ImagePlaceholder[]): Promise<ImagePlaceholder[]> {
  try {
    const db = ensureFirestoreConnection();
    const batch = getFirestoreBatch();
    const createdImages: ImagePlaceholder[] = [];
    
    for (const imageData of imagesData) {
      const docRef = db.collection(COLLECTION_NAME).doc(imageData.id);
      
      // Mevcut görseli kontrol et
      const existingDoc = await docRef.get();
      if (existingDoc.exists) {
        console.warn(`Görsel ID'si zaten mevcut, atlanıyor: ${imageData.id}`);
        continue;
      }
      
      const firestoreData = objectToFirestoreDoc(imageData);
      batch.set(docRef, firestoreData);
      createdImages.push(imageData);
    }
    
    if (createdImages.length > 0) {
      await batch.commit();
    }
    
    return createdImages;
  } catch (error) {
    console.error('Error creating images:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Görsel günceller
 */
export async function updateImage(
  imageId: string,
  updates: Partial<ImagePlaceholder>
): Promise<ImagePlaceholder> {
  try {
    const db = ensureFirestoreConnection();
    
    const docRef = db.collection(COLLECTION_NAME).doc(imageId);
    
    // Mevcut görseli kontrol et
    const existingDoc = await docRef.get();
    if (!existingDoc.exists) {
      throw new Error(`Görsel bulunamadı: ${imageId}`);
    }
    
    // ID'yi updates'den çıkar (document ID değiştirilemez)
    const { id, ...updateData } = updates;
    
    // Objeyi Firestore formatına çevir
    const firestoreData = objectToFirestoreDoc(updateData as ImagePlaceholder);
    
    await docRef.update(firestoreData);
    
    // Güncellenmiş görseli geri döndür
    const updatedDoc = await docRef.get();
    const updatedImage = firestoreDocToObject<ImagePlaceholder>(updatedDoc);
    
    if (!updatedImage) {
      throw new Error('Görsel güncellendi ancak okunamadı.');
    }
    
    return updatedImage;
  } catch (error) {
    console.error('Error updating image:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Görseli siler (çöp kutusuna taşır)
 */
export async function deleteImage(imageId: string): Promise<void> {
  try {
    const db = ensureFirestoreConnection();
    
    const docRef = db.collection(COLLECTION_NAME).doc(imageId);
    const deletedDocRef = db.collection(DELETED_COLLECTION_NAME).doc(imageId);
    
    // Mevcut görseli al
    const existingDoc = await docRef.get();
    if (!existingDoc.exists) {
      throw new Error(`Görsel bulunamadı: ${imageId}`);
    }
    
    const imageData = firestoreDocToObject<ImagePlaceholder & { deletedAt: string }>(existingDoc);
    if (!imageData) {
      throw new Error('Görsel okunamadı.');
    }
    
    // Silinme tarihini ekle
    const { Timestamp } = await import('firebase-admin/firestore');
    const deletedImage = {
      ...imageData,
      deletedAt: Timestamp.now().toDate().toISOString(),
    };
    
    // Çöp kutusuna taşı
    const firestoreDeletedData = objectToFirestoreDoc(deletedImage);
    await deletedDocRef.set(firestoreDeletedData);
    
    // Orijinal görseli sil
    await docRef.delete();
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Görseli çöp kutusundan geri getirir
 */
export async function restoreImage(imageId: string): Promise<ImagePlaceholder> {
  try {
    const db = ensureFirestoreConnection();
    
    const deletedDocRef = db.collection(DELETED_COLLECTION_NAME).doc(imageId);
    const docRef = db.collection(COLLECTION_NAME).doc(imageId);
    
    // Silinen görseli al
    const deletedDoc = await deletedDocRef.get();
    if (!deletedDoc.exists) {
      throw new Error(`Silinen görsel bulunamadı: ${imageId}`);
    }
    
    const deletedImage = firestoreDocToObject<ImagePlaceholder & { deletedAt: string }>(deletedDoc);
    if (!deletedImage) {
      throw new Error('Silinen görsel okunamadı.');
    }
    
    // deletedAt alanını çıkar
    const { deletedAt, ...imageData } = deletedImage;
    
    // Orijinal koleksiyona geri ekle
    const firestoreData = objectToFirestoreDoc(imageData);
    await docRef.set(firestoreData);
    
    // Çöp kutusundan sil
    await deletedDocRef.delete();
    
    // Geri getirilen görseli döndür
    const restoredDoc = await docRef.get();
    const restoredImage = firestoreDocToObject<ImagePlaceholder>(restoredDoc);
    
    if (!restoredImage) {
      throw new Error('Görsel geri getirildi ancak okunamadı.');
    }
    
    return restoredImage;
  } catch (error) {
    console.error('Error restoring image:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Görseli kalıcı olarak siler (çöp kutusundan da siler)
 */
export async function permanentlyDeleteImage(imageId: string): Promise<void> {
  try {
    const db = ensureFirestoreConnection();
    
    const deletedDocRef = db.collection(DELETED_COLLECTION_NAME).doc(imageId);
    
    // Çöp kutusundan kalıcı olarak sil
    await deletedDocRef.delete();
  } catch (error) {
    console.error('Error permanently deleting image:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Silinen görselleri getirir (çöp kutusu)
 */
export async function getDeletedImages(): Promise<(ImagePlaceholder & { deletedAt: string })[]> {
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
      .map(doc => firestoreDocToObject<ImagePlaceholder & { deletedAt: string }>(doc))
      .filter((image): image is ImagePlaceholder & { deletedAt: string } => image !== null);
  } catch (error) {
    console.error('Error getting deleted images:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Çöp kutusunu tamamen temizler
 */
export async function emptyDeletedImages(): Promise<void> {
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
    console.error('Error emptying deleted images:', error);
    throw new Error(handleFirestoreError(error));
  }
}


 * Firebase Firestore Images Helper Fonksiyonları
 * 
 * Bu dosya Images (Görseller) koleksiyonu için tüm CRUD işlemlerini içerir.
 * Server-side (Admin SDK) kullanır.
 */

import type { ImagePlaceholder } from '@/lib/placeholder-images';
import {
  ensureFirestoreConnection,
  handleFirestoreError,
  firestoreDocToObject,
  objectToFirestoreDoc,
  getFirestoreBatch,
} from './common';

const COLLECTION_NAME = 'images';
const DELETED_COLLECTION_NAME = 'deletedImages';

/**
 * Tüm görselleri getirir
 * @param filters - Filtreleme seçenekleri
 * @returns ImagePlaceholder array
 */
export async function getImages(filters?: {
  imageHint?: string;
  limit?: number;
  orderBy?: 'id' | 'description';
  orderDirection?: 'asc' | 'desc';
}): Promise<ImagePlaceholder[]> {
  try {
    const db = ensureFirestoreConnection();
    
    let query: FirebaseFirestore.Query = db.collection(COLLECTION_NAME);
    
    // Filtreleme
    if (filters?.imageHint) {
      query = query.where('imageHint', '==', filters.imageHint);
    }
    
    // Sıralama
    const orderByField = filters?.orderBy || 'id';
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
      .map(doc => firestoreDocToObject<ImagePlaceholder>(doc))
      .filter((image): image is ImagePlaceholder => image !== null);
  } catch (error) {
    console.error('Error getting images:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * ID'ye göre tek bir görsel getirir
 */
export async function getImageById(imageId: string): Promise<ImagePlaceholder | null> {
  try {
    const db = ensureFirestoreConnection();
    
    const doc = await db.collection(COLLECTION_NAME).doc(imageId).get();
    
    if (!doc.exists) {
      return null;
    }
    
    return firestoreDocToObject<ImagePlaceholder>(doc);
  } catch (error) {
    console.error('Error getting image by id:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Yeni görsel oluşturur
 */
export async function createImage(imageData: ImagePlaceholder): Promise<ImagePlaceholder> {
  try {
    const db = ensureFirestoreConnection();
    
    // ID'yi document ID olarak kullan
    const docRef = db.collection(COLLECTION_NAME).doc(imageData.id);
    
    // Mevcut görseli kontrol et
    const existingDoc = await docRef.get();
    if (existingDoc.exists) {
      throw new Error(`Görsel ID'si zaten mevcut: ${imageData.id}`);
    }
    
    // Objeyi Firestore formatına çevir
    const firestoreData = objectToFirestoreDoc(imageData);
    
    await docRef.set(firestoreData);
    
    // Oluşturulan görseli geri döndür
    const createdDoc = await docRef.get();
    const createdImage = firestoreDocToObject<ImagePlaceholder>(createdDoc);
    
    if (!createdImage) {
      throw new Error('Görsel oluşturuldu ancak okunamadı.');
    }
    
    return createdImage;
  } catch (error) {
    console.error('Error creating image:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Birden fazla görseli toplu olarak oluşturur
 */
export async function createImages(imagesData: ImagePlaceholder[]): Promise<ImagePlaceholder[]> {
  try {
    const db = ensureFirestoreConnection();
    const batch = getFirestoreBatch();
    const createdImages: ImagePlaceholder[] = [];
    
    for (const imageData of imagesData) {
      const docRef = db.collection(COLLECTION_NAME).doc(imageData.id);
      
      // Mevcut görseli kontrol et
      const existingDoc = await docRef.get();
      if (existingDoc.exists) {
        console.warn(`Görsel ID'si zaten mevcut, atlanıyor: ${imageData.id}`);
        continue;
      }
      
      const firestoreData = objectToFirestoreDoc(imageData);
      batch.set(docRef, firestoreData);
      createdImages.push(imageData);
    }
    
    if (createdImages.length > 0) {
      await batch.commit();
    }
    
    return createdImages;
  } catch (error) {
    console.error('Error creating images:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Görsel günceller
 */
export async function updateImage(
  imageId: string,
  updates: Partial<ImagePlaceholder>
): Promise<ImagePlaceholder> {
  try {
    const db = ensureFirestoreConnection();
    
    const docRef = db.collection(COLLECTION_NAME).doc(imageId);
    
    // Mevcut görseli kontrol et
    const existingDoc = await docRef.get();
    if (!existingDoc.exists) {
      throw new Error(`Görsel bulunamadı: ${imageId}`);
    }
    
    // ID'yi updates'den çıkar (document ID değiştirilemez)
    const { id, ...updateData } = updates;
    
    // Objeyi Firestore formatına çevir
    const firestoreData = objectToFirestoreDoc(updateData as ImagePlaceholder);
    
    await docRef.update(firestoreData);
    
    // Güncellenmiş görseli geri döndür
    const updatedDoc = await docRef.get();
    const updatedImage = firestoreDocToObject<ImagePlaceholder>(updatedDoc);
    
    if (!updatedImage) {
      throw new Error('Görsel güncellendi ancak okunamadı.');
    }
    
    return updatedImage;
  } catch (error) {
    console.error('Error updating image:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Görseli siler (çöp kutusuna taşır)
 */
export async function deleteImage(imageId: string): Promise<void> {
  try {
    const db = ensureFirestoreConnection();
    
    const docRef = db.collection(COLLECTION_NAME).doc(imageId);
    const deletedDocRef = db.collection(DELETED_COLLECTION_NAME).doc(imageId);
    
    // Mevcut görseli al
    const existingDoc = await docRef.get();
    if (!existingDoc.exists) {
      throw new Error(`Görsel bulunamadı: ${imageId}`);
    }
    
    const imageData = firestoreDocToObject<ImagePlaceholder & { deletedAt: string }>(existingDoc);
    if (!imageData) {
      throw new Error('Görsel okunamadı.');
    }
    
    // Silinme tarihini ekle
    const { Timestamp } = await import('firebase-admin/firestore');
    const deletedImage = {
      ...imageData,
      deletedAt: Timestamp.now().toDate().toISOString(),
    };
    
    // Çöp kutusuna taşı
    const firestoreDeletedData = objectToFirestoreDoc(deletedImage);
    await deletedDocRef.set(firestoreDeletedData);
    
    // Orijinal görseli sil
    await docRef.delete();
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Görseli çöp kutusundan geri getirir
 */
export async function restoreImage(imageId: string): Promise<ImagePlaceholder> {
  try {
    const db = ensureFirestoreConnection();
    
    const deletedDocRef = db.collection(DELETED_COLLECTION_NAME).doc(imageId);
    const docRef = db.collection(COLLECTION_NAME).doc(imageId);
    
    // Silinen görseli al
    const deletedDoc = await deletedDocRef.get();
    if (!deletedDoc.exists) {
      throw new Error(`Silinen görsel bulunamadı: ${imageId}`);
    }
    
    const deletedImage = firestoreDocToObject<ImagePlaceholder & { deletedAt: string }>(deletedDoc);
    if (!deletedImage) {
      throw new Error('Silinen görsel okunamadı.');
    }
    
    // deletedAt alanını çıkar
    const { deletedAt, ...imageData } = deletedImage;
    
    // Orijinal koleksiyona geri ekle
    const firestoreData = objectToFirestoreDoc(imageData);
    await docRef.set(firestoreData);
    
    // Çöp kutusundan sil
    await deletedDocRef.delete();
    
    // Geri getirilen görseli döndür
    const restoredDoc = await docRef.get();
    const restoredImage = firestoreDocToObject<ImagePlaceholder>(restoredDoc);
    
    if (!restoredImage) {
      throw new Error('Görsel geri getirildi ancak okunamadı.');
    }
    
    return restoredImage;
  } catch (error) {
    console.error('Error restoring image:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Görseli kalıcı olarak siler (çöp kutusundan da siler)
 */
export async function permanentlyDeleteImage(imageId: string): Promise<void> {
  try {
    const db = ensureFirestoreConnection();
    
    const deletedDocRef = db.collection(DELETED_COLLECTION_NAME).doc(imageId);
    
    // Çöp kutusundan kalıcı olarak sil
    await deletedDocRef.delete();
  } catch (error) {
    console.error('Error permanently deleting image:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Silinen görselleri getirir (çöp kutusu)
 */
export async function getDeletedImages(): Promise<(ImagePlaceholder & { deletedAt: string })[]> {
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
      .map(doc => firestoreDocToObject<ImagePlaceholder & { deletedAt: string }>(doc))
      .filter((image): image is ImagePlaceholder & { deletedAt: string } => image !== null);
  } catch (error) {
    console.error('Error getting deleted images:', error);
    throw new Error(handleFirestoreError(error));
  }
}

/**
 * Çöp kutusunu tamamen temizler
 */
export async function emptyDeletedImages(): Promise<void> {
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
    console.error('Error emptying deleted images:', error);
    throw new Error(handleFirestoreError(error));
  }
}

