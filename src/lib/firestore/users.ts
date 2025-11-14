/**
 * Firebase Firestore Users Helper Fonksiyonları
 * 
 * Bu dosya Users (Kullanıcılar) koleksiyonu için tüm CRUD işlemlerini içerir.
 * Server-side (Admin SDK) kullanır.
 */

import type { User } from '@/lib/types';
import {
  ensureFirestoreConnection,
  handleFirestoreError,
  firestoreDocToObject,
  objectToFirestoreDoc,
} from './common';

const COLLECTION_NAME = 'users';

/**
 * Tüm kullanıcıları getirir
 * @param filters - Filtreleme seçenekleri
 * @returns User array
 */
export async function getUsers(filters?: {
  role?: 'admin' | 'editor' | 'viewer';
  active?: boolean;
  limit?: number;
  orderBy?: 'createdAt' | 'name' | 'email';
  orderDirection?: 'asc' | 'desc';
}): Promise<User[]> {
  try {
    const db = ensureFirestoreConnection();
    
    let query: FirebaseFirestore.Query = db.collection(COLLECTION_NAME);
    
    // Filtreleme
    if (filters?.role) {
      query = query.where('role', '==', filters.role);
    }
    
    if (filters?.active !== undefined) {
      query = query.where('active', '==', filters.active);
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
      const data = firestoreDocToObject<User>(doc);
      if (!data) {
        return null;
      }
      
      // Şifreyi güvenlik için kaldır (sadece hash'li şifre saklanır)
      const { password, ...userData } = data;
      return userData as User;
    }).filter((user): user is User => user !== null);
  } catch (error) {
    throw handleFirestoreError(error, 'getUsers');
  }
}

/**
 * ID'ye göre kullanıcı getirir
 * @param id - Kullanıcı ID'si
 * @param includePassword - Şifre hash'ini dahil et (sadece login için)
 * @returns User veya null
 */
export async function getUserById(
  id: string,
  includePassword: boolean = false
): Promise<User | null> {
  try {
    const db = ensureFirestoreConnection();
    const doc = await db.collection(COLLECTION_NAME).doc(id).get();
    
    if (!doc.exists) {
      return null;
    }
    
    const data = firestoreDocToObject(doc.data());
    const userData: any = {
      id: doc.id,
      ...data,
    };
    
    // Şifreyi sadece gerekirse dahil et
    if (!includePassword) {
      delete userData.password;
    }
    
    return userData as User;
  } catch (error) {
    throw handleFirestoreError(error, 'getUserById');
  }
}

/**
 * Email'e göre kullanıcı getirir (login için)
 * @param email - Kullanıcı email'i
 * @param includePassword - Şifre hash'ini dahil et
 * @returns User veya null
 */
export async function getUserByEmail(
  email: string,
  includePassword: boolean = true
): Promise<User | null> {
  try {
    const db = ensureFirestoreConnection();
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    const data = firestoreDocToObject<User>(doc);
    if (!data) {
      return null;
    }
    
    // Şifreyi sadece gerekirse dahil et
    const { password, ...userData } = data;
    if (includePassword) {
      return { ...userData, password: data.password } as User;
    }
    
    return userData as User;
  } catch (error) {
    throw handleFirestoreError(error, 'getUserByEmail');
  }
}

/**
 * Yeni kullanıcı oluşturur
 * @param user - Kullanıcı verisi (id otomatik oluşturulur, password hash'li olmalı)
 * @returns Oluşturulan kullanıcı
 */
export async function createUser(user: Omit<User, 'id'>): Promise<User> {
  try {
    const db = ensureFirestoreConnection();
    
    // Email kontrolü
    const existingUser = await getUserByEmail(user.email, false);
    if (existingUser) {
      throw new Error(`Bu email adresi zaten kullanılıyor: ${user.email}`);
    }
    
    // ID otomatik oluştur
    const id = user.id || `user-${Date.now()}`;
    
    const userData: User = {
      id,
      ...user,
      createdAt: user.createdAt || new Date().toISOString(),
    };
    
    const docData = objectToFirestoreDoc(userData);
    await db.collection(COLLECTION_NAME).doc(id).set(docData);
    
    // Şifreyi response'dan kaldır
    const { password, ...responseData } = userData;
    return responseData as User;
  } catch (error) {
    throw handleFirestoreError(error, 'createUser');
  }
}

/**
 * Kullanıcı günceller
 * @param id - Kullanıcı ID'si
 * @param updates - Güncellenecek alanlar
 * @returns Güncellenmiş kullanıcı
 */
export async function updateUser(
  id: string,
  updates: Partial<Omit<User, 'id'>>
): Promise<User> {
  try {
    const db = ensureFirestoreConnection();
    
    const docRef = db.collection(COLLECTION_NAME).doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      throw new Error(`Kullanıcı bulunamadı: ${id}`);
    }
    
    // Email değişikliği kontrolü
    if (updates.email) {
      const existingUser = await getUserByEmail(updates.email, false);
      if (existingUser && existingUser.id !== id) {
        throw new Error(`Bu email adresi zaten kullanılıyor: ${updates.email}`);
      }
    }
    
    const updateData = objectToFirestoreDoc(updates);
    await docRef.update(updateData);
    
    const updatedDoc = await docRef.get();
    const data = firestoreDocToObject<User>(updatedDoc);
    if (!data) {
      throw new Error(`Kullanıcı güncellendikten sonra bulunamadı: ${id}`);
    }
    
    // Şifreyi response'dan kaldır
    const { password, ...userData } = data;
    return userData as User;
  } catch (error) {
    throw handleFirestoreError(error, 'updateUser');
  }
}

/**
 * Kullanıcı siler
 * @param id - Kullanıcı ID'si
 */
export async function deleteUser(id: string): Promise<void> {
  try {
    const db = ensureFirestoreConnection();
    await db.collection(COLLECTION_NAME).doc(id).delete();
  } catch (error) {
    throw handleFirestoreError(error, 'deleteUser');
  }
}


 * 
 * Bu dosya Users (Kullanıcılar) koleksiyonu için tüm CRUD işlemlerini içerir.
 * Server-side (Admin SDK) kullanır.
 */

import type { User } from '@/lib/types';
import {
  ensureFirestoreConnection,
  handleFirestoreError,
  firestoreDocToObject,
  objectToFirestoreDoc,
} from './common';

const COLLECTION_NAME = 'users';

/**
 * Tüm kullanıcıları getirir
 * @param filters - Filtreleme seçenekleri
 * @returns User array
 */
export async function getUsers(filters?: {
  role?: 'admin' | 'editor' | 'viewer';
  active?: boolean;
  limit?: number;
  orderBy?: 'createdAt' | 'name' | 'email';
  orderDirection?: 'asc' | 'desc';
}): Promise<User[]> {
  try {
    const db = ensureFirestoreConnection();
    
    let query: FirebaseFirestore.Query = db.collection(COLLECTION_NAME);
    
    // Filtreleme
    if (filters?.role) {
      query = query.where('role', '==', filters.role);
    }
    
    if (filters?.active !== undefined) {
      query = query.where('active', '==', filters.active);
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
      const data = firestoreDocToObject<User>(doc);
      if (!data) {
        return null;
      }
      
      // Şifreyi güvenlik için kaldır (sadece hash'li şifre saklanır)
      const { password, ...userData } = data;
      return userData as User;
    }).filter((user): user is User => user !== null);
  } catch (error) {
    throw handleFirestoreError(error, 'getUsers');
  }
}

/**
 * ID'ye göre kullanıcı getirir
 * @param id - Kullanıcı ID'si
 * @param includePassword - Şifre hash'ini dahil et (sadece login için)
 * @returns User veya null
 */
export async function getUserById(
  id: string,
  includePassword: boolean = false
): Promise<User | null> {
  try {
    const db = ensureFirestoreConnection();
    const doc = await db.collection(COLLECTION_NAME).doc(id).get();
    
    if (!doc.exists) {
      return null;
    }
    
    const data = firestoreDocToObject(doc.data());
    const userData: any = {
      id: doc.id,
      ...data,
    };
    
    // Şifreyi sadece gerekirse dahil et
    if (!includePassword) {
      delete userData.password;
    }
    
    return userData as User;
  } catch (error) {
    throw handleFirestoreError(error, 'getUserById');
  }
}

/**
 * Email'e göre kullanıcı getirir (login için)
 * @param email - Kullanıcı email'i
 * @param includePassword - Şifre hash'ini dahil et
 * @returns User veya null
 */
export async function getUserByEmail(
  email: string,
  includePassword: boolean = true
): Promise<User | null> {
  try {
    const db = ensureFirestoreConnection();
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    const data = firestoreDocToObject<User>(doc);
    if (!data) {
      return null;
    }
    
    // Şifreyi sadece gerekirse dahil et
    const { password, ...userData } = data;
    if (includePassword) {
      return { ...userData, password: data.password } as User;
    }
    
    return userData as User;
  } catch (error) {
    throw handleFirestoreError(error, 'getUserByEmail');
  }
}

/**
 * Yeni kullanıcı oluşturur
 * @param user - Kullanıcı verisi (id otomatik oluşturulur, password hash'li olmalı)
 * @returns Oluşturulan kullanıcı
 */
export async function createUser(user: Omit<User, 'id'>): Promise<User> {
  try {
    const db = ensureFirestoreConnection();
    
    // Email kontrolü
    const existingUser = await getUserByEmail(user.email, false);
    if (existingUser) {
      throw new Error(`Bu email adresi zaten kullanılıyor: ${user.email}`);
    }
    
    // ID otomatik oluştur
    const id = user.id || `user-${Date.now()}`;
    
    const userData: User = {
      id,
      ...user,
      createdAt: user.createdAt || new Date().toISOString(),
    };
    
    const docData = objectToFirestoreDoc(userData);
    await db.collection(COLLECTION_NAME).doc(id).set(docData);
    
    // Şifreyi response'dan kaldır
    const { password, ...responseData } = userData;
    return responseData as User;
  } catch (error) {
    throw handleFirestoreError(error, 'createUser');
  }
}

/**
 * Kullanıcı günceller
 * @param id - Kullanıcı ID'si
 * @param updates - Güncellenecek alanlar
 * @returns Güncellenmiş kullanıcı
 */
export async function updateUser(
  id: string,
  updates: Partial<Omit<User, 'id'>>
): Promise<User> {
  try {
    const db = ensureFirestoreConnection();
    
    const docRef = db.collection(COLLECTION_NAME).doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      throw new Error(`Kullanıcı bulunamadı: ${id}`);
    }
    
    // Email değişikliği kontrolü
    if (updates.email) {
      const existingUser = await getUserByEmail(updates.email, false);
      if (existingUser && existingUser.id !== id) {
        throw new Error(`Bu email adresi zaten kullanılıyor: ${updates.email}`);
      }
    }
    
    const updateData = objectToFirestoreDoc(updates);
    await docRef.update(updateData);
    
    const updatedDoc = await docRef.get();
    const data = firestoreDocToObject<User>(updatedDoc);
    if (!data) {
      throw new Error(`Kullanıcı güncellendikten sonra bulunamadı: ${id}`);
    }
    
    // Şifreyi response'dan kaldır
    const { password, ...userData } = data;
    return userData as User;
  } catch (error) {
    throw handleFirestoreError(error, 'updateUser');
  }
}

/**
 * Kullanıcı siler
 * @param id - Kullanıcı ID'si
 */
export async function deleteUser(id: string): Promise<void> {
  try {
    const db = ensureFirestoreConnection();
    await db.collection(COLLECTION_NAME).doc(id).delete();
  } catch (error) {
    throw handleFirestoreError(error, 'deleteUser');
  }
}

