/**
 * Firebase Firestore Custom Menus Helper Fonksiyonları
 * 
 * Bu dosya Custom Menus (Özel Menüler) koleksiyonu için tüm CRUD işlemlerini içerir.
 * Server-side (Admin SDK) kullanır.
 */

import type { CustomMenu } from '@/lib/types';
import {
  ensureFirestoreConnection,
  handleFirestoreError,
  firestoreDocToObject,
  objectToFirestoreDoc,
} from './common';

const COLLECTION_NAME = 'customMenus';

/**
 * Tüm özel menüleri getirir
 * @param filters - Filtreleme seçenekleri
 * @returns CustomMenu array
 */
export async function getCustomMenus(filters?: {
  visible?: boolean;
  limit?: number;
  orderBy?: 'order' | 'label';
  orderDirection?: 'asc' | 'desc';
}): Promise<CustomMenu[]> {
  try {
    const db = ensureFirestoreConnection();
    
    let query: FirebaseFirestore.Query = db.collection(COLLECTION_NAME);
    
    // Filtreleme
    if (filters?.visible !== undefined) {
      query = query.where('visible', '==', filters.visible);
    }
    
    // Sıralama
    const orderByField = filters?.orderBy || 'order';
    const orderDirection = filters?.orderDirection || 'asc';
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
      } as CustomMenu;
    });
  } catch (error) {
    throw handleFirestoreError(error, 'getCustomMenus');
  }
}

/**
 * ID'ye göre özel menü getirir
 * @param id - Menü ID'si
 * @returns CustomMenu veya null
 */
export async function getCustomMenuById(id: string): Promise<CustomMenu | null> {
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
    } as CustomMenu;
  } catch (error) {
    throw handleFirestoreError(error, 'getCustomMenuById');
  }
}

/**
 * Yeni özel menü oluşturur
 * @param menu - Menü verisi (id otomatik oluşturulur)
 * @returns Oluşturulan menü
 */
export async function createCustomMenu(menu: Omit<CustomMenu, 'id'>): Promise<CustomMenu> {
  try {
    const db = ensureFirestoreConnection();
    
    // ID otomatik oluştur
    const id = `menu-${Date.now()}`;
    
    const menuData: CustomMenu = {
      id,
      ...menu,
      order: menu.order ?? 0,
      visible: menu.visible ?? true,
    };
    
    const docData = objectToFirestoreDoc(menuData);
    await db.collection(COLLECTION_NAME).doc(id).set(docData);
    
    return menuData;
  } catch (error) {
    throw handleFirestoreError(error, 'createCustomMenu');
  }
}

/**
 * Özel menü günceller
 * @param id - Menü ID'si
 * @param updates - Güncellenecek alanlar
 * @returns Güncellenmiş menü
 */
export async function updateCustomMenu(
  id: string,
  updates: Partial<Omit<CustomMenu, 'id'>>
): Promise<CustomMenu> {
  try {
    const db = ensureFirestoreConnection();
    
    const docRef = db.collection(COLLECTION_NAME).doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      throw new Error(`Menü bulunamadı: ${id}`);
    }
    
    const updateData = objectToFirestoreDoc(updates);
    await docRef.update(updateData);
    
    const updatedDoc = await docRef.get();
    const data = firestoreDocToObject(updatedDoc.data());
    
    return {
      id: updatedDoc.id,
      ...data,
    } as CustomMenu;
  } catch (error) {
    throw handleFirestoreError(error, 'updateCustomMenu');
  }
}

/**
 * Özel menü siler
 * @param id - Menü ID'si
 */
export async function deleteCustomMenu(id: string): Promise<void> {
  try {
    const db = ensureFirestoreConnection();
    await db.collection(COLLECTION_NAME).doc(id).delete();
  } catch (error) {
    throw handleFirestoreError(error, 'deleteCustomMenu');
  }
}


 * Firebase Firestore Custom Menus Helper Fonksiyonları
 * 
 * Bu dosya Custom Menus (Özel Menüler) koleksiyonu için tüm CRUD işlemlerini içerir.
 * Server-side (Admin SDK) kullanır.
 */

import type { CustomMenu } from '@/lib/types';
import {
  ensureFirestoreConnection,
  handleFirestoreError,
  firestoreDocToObject,
  objectToFirestoreDoc,
} from './common';

const COLLECTION_NAME = 'customMenus';

/**
 * Tüm özel menüleri getirir
 * @param filters - Filtreleme seçenekleri
 * @returns CustomMenu array
 */
export async function getCustomMenus(filters?: {
  visible?: boolean;
  limit?: number;
  orderBy?: 'order' | 'label';
  orderDirection?: 'asc' | 'desc';
}): Promise<CustomMenu[]> {
  try {
    const db = ensureFirestoreConnection();
    
    let query: FirebaseFirestore.Query = db.collection(COLLECTION_NAME);
    
    // Filtreleme
    if (filters?.visible !== undefined) {
      query = query.where('visible', '==', filters.visible);
    }
    
    // Sıralama
    const orderByField = filters?.orderBy || 'order';
    const orderDirection = filters?.orderDirection || 'asc';
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
      } as CustomMenu;
    });
  } catch (error) {
    throw handleFirestoreError(error, 'getCustomMenus');
  }
}

/**
 * ID'ye göre özel menü getirir
 * @param id - Menü ID'si
 * @returns CustomMenu veya null
 */
export async function getCustomMenuById(id: string): Promise<CustomMenu | null> {
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
    } as CustomMenu;
  } catch (error) {
    throw handleFirestoreError(error, 'getCustomMenuById');
  }
}

/**
 * Yeni özel menü oluşturur
 * @param menu - Menü verisi (id otomatik oluşturulur)
 * @returns Oluşturulan menü
 */
export async function createCustomMenu(menu: Omit<CustomMenu, 'id'>): Promise<CustomMenu> {
  try {
    const db = ensureFirestoreConnection();
    
    // ID otomatik oluştur
    const id = `menu-${Date.now()}`;
    
    const menuData: CustomMenu = {
      id,
      ...menu,
      order: menu.order ?? 0,
      visible: menu.visible ?? true,
    };
    
    const docData = objectToFirestoreDoc(menuData);
    await db.collection(COLLECTION_NAME).doc(id).set(docData);
    
    return menuData;
  } catch (error) {
    throw handleFirestoreError(error, 'createCustomMenu');
  }
}

/**
 * Özel menü günceller
 * @param id - Menü ID'si
 * @param updates - Güncellenecek alanlar
 * @returns Güncellenmiş menü
 */
export async function updateCustomMenu(
  id: string,
  updates: Partial<Omit<CustomMenu, 'id'>>
): Promise<CustomMenu> {
  try {
    const db = ensureFirestoreConnection();
    
    const docRef = db.collection(COLLECTION_NAME).doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      throw new Error(`Menü bulunamadı: ${id}`);
    }
    
    const updateData = objectToFirestoreDoc(updates);
    await docRef.update(updateData);
    
    const updatedDoc = await docRef.get();
    const data = firestoreDocToObject(updatedDoc.data());
    
    return {
      id: updatedDoc.id,
      ...data,
    } as CustomMenu;
  } catch (error) {
    throw handleFirestoreError(error, 'updateCustomMenu');
  }
}

/**
 * Özel menü siler
 * @param id - Menü ID'si
 */
export async function deleteCustomMenu(id: string): Promise<void> {
  try {
    const db = ensureFirestoreConnection();
    await db.collection(COLLECTION_NAME).doc(id).delete();
  } catch (error) {
    throw handleFirestoreError(error, 'deleteCustomMenu');
  }
}

