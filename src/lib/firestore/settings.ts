/**
 * Firebase Firestore Settings Helper Fonksiyonları
 * 
 * Bu dosya tüm Settings (Ayarlar) koleksiyonları için CRUD işlemlerini içerir.
 * Server-side (Admin SDK) kullanır.
 * 
 * Koleksiyonlar:
 * - categorySettings: CategorySettings[]
 * - socialLinks: SocialLink[]
 * - shareLinks: SharePlatform[]
 * - homepageSections: HomepageSections (tek document, id: 'main')
 * - menuConfig: MenuGlobalConfig (tek document, id: 'main')
 * - socialMediaAPIs: SocialMediaAPI[]
 * - notes: Note[]
 */

import type {
  CategorySettings,
  SocialLink,
  SharePlatform,
  HomepageSections,
  MenuGlobalConfig,
  Note,
  SocialMediaAPI,
} from '@/lib/types';
import {
  ensureFirestoreConnection,
  handleFirestoreError,
  firestoreDocToObject,
  objectToFirestoreDoc,
} from './common';

// ==================== Category Settings ====================

const CATEGORY_SETTINGS_COLLECTION = 'categorySettings';

export async function getCategorySettings(): Promise<CategorySettings[]> {
  try {
    const db = ensureFirestoreConnection();
    const snapshot = await db
      .collection(CATEGORY_SETTINGS_COLLECTION)
      .orderBy('order', 'asc')
      .get();
    
    return snapshot.docs.map(doc => ({
      categoryId: doc.id,
      ...firestoreDocToObject<Omit<CategorySettings, 'categoryId'>>(doc)!,
    } as CategorySettings));
  } catch (error) {
    throw handleFirestoreError(error, 'getCategorySettings');
  }
}

export async function getCategorySetting(categoryId: string): Promise<CategorySettings | null> {
  try {
    const db = ensureFirestoreConnection();
    const doc = await db.collection(CATEGORY_SETTINGS_COLLECTION).doc(categoryId).get();
    
    if (!doc.exists) {
      return null;
    }
    
    const data = firestoreDocToObject<Omit<CategorySettings, 'categoryId'>>(doc);
    if (!data) {
      return null;
    }
    
    return {
      categoryId: doc.id,
      ...data,
    } as CategorySettings;
  } catch (error) {
    throw handleFirestoreError(error, 'getCategorySetting');
  }
}

export async function updateCategorySetting(
  categoryId: string,
  updates: Partial<Omit<CategorySettings, 'categoryId'>>
): Promise<CategorySettings> {
  try {
    const db = ensureFirestoreConnection();
    const docRef = db.collection(CATEGORY_SETTINGS_COLLECTION).doc(categoryId);
    
    const updateData = objectToFirestoreDoc(updates);
    await docRef.set(updateData, { merge: true });
    
    const updatedDoc = await docRef.get();
    const data = firestoreDocToObject<Omit<CategorySettings, 'categoryId'>>(updatedDoc);
    
    return {
      categoryId: updatedDoc.id,
      ...data!,
    } as CategorySettings;
  } catch (error) {
    throw handleFirestoreError(error, 'updateCategorySetting');
  }
}

// ==================== Social Links ====================

const SOCIAL_LINKS_COLLECTION = 'socialLinks';

export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const db = ensureFirestoreConnection();
    const snapshot = await db
      .collection(SOCIAL_LINKS_COLLECTION)
      .orderBy('name', 'asc')
      .get();
    
    return snapshot.docs.map(doc => ({
      name: doc.id,
      ...firestoreDocToObject<Omit<SocialLink, 'name'>>(doc)!,
    } as SocialLink));
  } catch (error) {
    throw handleFirestoreError(error, 'getSocialLinks');
  }
}

export async function getSocialLink(name: string): Promise<SocialLink | null> {
  try {
    const db = ensureFirestoreConnection();
    const doc = await db.collection(SOCIAL_LINKS_COLLECTION).doc(name).get();
    
    if (!doc.exists) {
      return null;
    }
    
    const data = firestoreDocToObject<Omit<SocialLink, 'name'>>(doc);
    if (!data) {
      return null;
    }
    
    return {
      name: doc.id,
      ...data,
    } as SocialLink;
  } catch (error) {
    throw handleFirestoreError(error, 'getSocialLink');
  }
}

export async function createSocialLink(link: SocialLink): Promise<SocialLink> {
  try {
    const db = ensureFirestoreConnection();
    
    // Kontrol
    const existing = await getSocialLink(link.name);
    if (existing) {
      throw new Error(`Bu sosyal medya linki zaten mevcut: ${link.name}`);
    }
    
    const docData = objectToFirestoreDoc(link);
    await db.collection(SOCIAL_LINKS_COLLECTION).doc(link.name).set(docData);
    
    return link;
  } catch (error) {
    throw handleFirestoreError(error, 'createSocialLink');
  }
}

export async function updateSocialLink(name: string, updates: Partial<Omit<SocialLink, 'name'>>): Promise<SocialLink> {
  try {
    const db = ensureFirestoreConnection();
    const docRef = db.collection(SOCIAL_LINKS_COLLECTION).doc(name);
    
    const updateData = objectToFirestoreDoc(updates);
    await docRef.update(updateData);
    
    const updatedDoc = await docRef.get();
    const data = firestoreDocToObject<Omit<SocialLink, 'name'>>(updatedDoc);
    
    return {
      name: updatedDoc.id,
      ...data!,
    } as SocialLink;
  } catch (error) {
    throw handleFirestoreError(error, 'updateSocialLink');
  }
}

export async function deleteSocialLink(name: string): Promise<void> {
  try {
    const db = ensureFirestoreConnection();
    await db.collection(SOCIAL_LINKS_COLLECTION).doc(name).delete();
  } catch (error) {
    throw handleFirestoreError(error, 'deleteSocialLink');
  }
}

// ==================== Share Links ====================

const SHARE_LINKS_COLLECTION = 'shareLinks';

export async function getShareLinks(): Promise<SharePlatform[]> {
  try {
    const db = ensureFirestoreConnection();
    const snapshot = await db
      .collection(SHARE_LINKS_COLLECTION)
      .orderBy('name', 'asc')
      .get();
    
    return snapshot.docs.map(doc => ({
      name: doc.id,
      ...firestoreDocToObject<Omit<SharePlatform, 'name'>>(doc)!,
    } as SharePlatform));
  } catch (error) {
    throw handleFirestoreError(error, 'getShareLinks');
  }
}

export async function createSharePlatform(platform: SharePlatform): Promise<SharePlatform> {
  try {
    const db = ensureFirestoreConnection();
    
    const docData = objectToFirestoreDoc(platform);
    await db.collection(SHARE_LINKS_COLLECTION).doc(platform.name).set(docData);
    
    return platform;
  } catch (error) {
    throw handleFirestoreError(error, 'createSharePlatform');
  }
}

export async function deleteSharePlatform(name: string): Promise<void> {
  try {
    const db = ensureFirestoreConnection();
    await db.collection(SHARE_LINKS_COLLECTION).doc(name).delete();
  } catch (error) {
    throw handleFirestoreError(error, 'deleteSharePlatform');
  }
}

// ==================== Homepage Sections ====================

const HOMEPAGE_SECTIONS_COLLECTION = 'homepageSections';
const HOMEPAGE_SECTIONS_DOC_ID = 'main';

export async function getHomepageSections(): Promise<HomepageSections | null> {
  try {
    const db = ensureFirestoreConnection();
    const doc = await db
      .collection(HOMEPAGE_SECTIONS_COLLECTION)
      .doc(HOMEPAGE_SECTIONS_DOC_ID)
      .get();
    
    if (!doc.exists) {
      return null;
    }
    
    return firestoreDocToObject<HomepageSections>(doc);
  } catch (error) {
    throw handleFirestoreError(error, 'getHomepageSections');
  }
}

export async function updateHomepageSections(updates: Partial<HomepageSections>): Promise<HomepageSections> {
  try {
    const db = ensureFirestoreConnection();
    const docRef = db
      .collection(HOMEPAGE_SECTIONS_COLLECTION)
      .doc(HOMEPAGE_SECTIONS_DOC_ID);
    
    const updateData = objectToFirestoreDoc(updates);
    await docRef.set(updateData, { merge: true });
    
    const updatedDoc = await docRef.get();
    return firestoreDocToObject<HomepageSections>(updatedDoc)!;
  } catch (error) {
    throw handleFirestoreError(error, 'updateHomepageSections');
  }
}

// ==================== Menu Config ====================

const MENU_CONFIG_COLLECTION = 'menuConfig';
const MENU_CONFIG_DOC_ID = 'main';

export async function getMenuConfig(): Promise<MenuGlobalConfig | null> {
  try {
    const db = ensureFirestoreConnection();
    const doc = await db
      .collection(MENU_CONFIG_COLLECTION)
      .doc(MENU_CONFIG_DOC_ID)
      .get();
    
    if (!doc.exists) {
      return null;
    }
    
    return firestoreDocToObject<MenuGlobalConfig>(doc);
  } catch (error) {
    throw handleFirestoreError(error, 'getMenuConfig');
  }
}

export async function updateMenuConfig(updates: Partial<MenuGlobalConfig>): Promise<MenuGlobalConfig> {
  try {
    const db = ensureFirestoreConnection();
    const docRef = db
      .collection(MENU_CONFIG_COLLECTION)
      .doc(MENU_CONFIG_DOC_ID);
    
    const updateData = objectToFirestoreDoc(updates);
    await docRef.set(updateData, { merge: true });
    
    const updatedDoc = await docRef.get();
    return firestoreDocToObject<MenuGlobalConfig>(updatedDoc)!;
  } catch (error) {
    throw handleFirestoreError(error, 'updateMenuConfig');
  }
}

// ==================== Social Media APIs ====================

const SOCIAL_MEDIA_APIS_COLLECTION = 'socialMediaAPIs';

export async function getSocialMediaAPIs(): Promise<SocialMediaAPI[]> {
  try {
    const db = ensureFirestoreConnection();
    const snapshot = await db
      .collection(SOCIAL_MEDIA_APIS_COLLECTION)
      .orderBy('platform', 'asc')
      .get();
    
    return snapshot.docs.map(doc => ({
      platform: doc.id,
      ...firestoreDocToObject<Omit<SocialMediaAPI, 'platform'>>(doc)!,
    } as SocialMediaAPI));
  } catch (error) {
    throw handleFirestoreError(error, 'getSocialMediaAPIs');
  }
}

export async function getSocialMediaAPI(platform: string): Promise<SocialMediaAPI | null> {
  try {
    const db = ensureFirestoreConnection();
    const doc = await db.collection(SOCIAL_MEDIA_APIS_COLLECTION).doc(platform).get();
    
    if (!doc.exists) {
      return null;
    }
    
    const data = firestoreDocToObject<Omit<SocialMediaAPI, 'platform'>>(doc);
    if (!data) {
      return null;
    }
    
    return {
      platform: doc.id,
      ...data,
    } as SocialMediaAPI;
  } catch (error) {
    throw handleFirestoreError(error, 'getSocialMediaAPI');
  }
}

export async function createSocialMediaAPI(api: SocialMediaAPI): Promise<SocialMediaAPI> {
  try {
    const db = ensureFirestoreConnection();
    
    // Kontrol
    const existing = await getSocialMediaAPI(api.platform);
    if (existing) {
      throw new Error(`Bu platform zaten mevcut: ${api.platform}`);
    }
    
    const docData = objectToFirestoreDoc(api);
    await db.collection(SOCIAL_MEDIA_APIS_COLLECTION).doc(api.platform).set(docData);
    
    return api;
  } catch (error) {
    throw handleFirestoreError(error, 'createSocialMediaAPI');
  }
}

export async function updateSocialMediaAPI(
  platform: string,
  updates: Partial<Omit<SocialMediaAPI, 'platform'>>
): Promise<SocialMediaAPI> {
  try {
    const db = ensureFirestoreConnection();
    const docRef = db.collection(SOCIAL_MEDIA_APIS_COLLECTION).doc(platform);
    
    const updateData = objectToFirestoreDoc(updates);
    await docRef.update(updateData);
    
    const updatedDoc = await docRef.get();
    const data = firestoreDocToObject<Omit<SocialMediaAPI, 'platform'>>(updatedDoc);
    
    return {
      platform: updatedDoc.id,
      ...data!,
    } as SocialMediaAPI;
  } catch (error) {
    throw handleFirestoreError(error, 'updateSocialMediaAPI');
  }
}

export async function deleteSocialMediaAPI(platform: string): Promise<void> {
  try {
    const db = ensureFirestoreConnection();
    await db.collection(SOCIAL_MEDIA_APIS_COLLECTION).doc(platform).delete();
  } catch (error) {
    throw handleFirestoreError(error, 'deleteSocialMediaAPI');
  }
}

// ==================== Notes ====================

const NOTES_COLLECTION = 'notes';

export async function getNotes(filters?: {
  isDone?: boolean;
  isTodo?: boolean;
  isImportant?: boolean;
  limit?: number;
  orderBy?: 'createdAt' | 'updatedAt' | 'date';
  orderDirection?: 'asc' | 'desc';
}): Promise<Note[]> {
  try {
    const db = ensureFirestoreConnection();
    
    let query: FirebaseFirestore.Query = db.collection(NOTES_COLLECTION);
    
    // Filtreleme
    if (filters?.isDone !== undefined) {
      query = query.where('isDone', '==', filters.isDone);
    }
    
    if (filters?.isTodo !== undefined) {
      query = query.where('isTodo', '==', filters.isTodo);
    }
    
    if (filters?.isImportant !== undefined) {
      query = query.where('isImportant', '==', filters.isImportant);
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
      const data = firestoreDocToObject<Note>(doc);
      return data!;
    });
  } catch (error) {
    throw handleFirestoreError(error, 'getNotes');
  }
}

export async function getNoteById(id: string): Promise<Note | null> {
  try {
    const db = ensureFirestoreConnection();
    const doc = await db.collection(NOTES_COLLECTION).doc(id).get();
    
    if (!doc.exists) {
      return null;
    }
    
    return firestoreDocToObject<Note>(doc);
  } catch (error) {
    throw handleFirestoreError(error, 'getNoteById');
  }
}

export async function createNote(note: Omit<Note, 'id'>): Promise<Note> {
  try {
    const db = ensureFirestoreConnection();
    
    // ID otomatik oluştur
    const id = note.id || `note-${Date.now()}`;
    
    const noteData: Note = {
      id,
      ...note,
      createdAt: note.createdAt || new Date().toISOString(),
      updatedAt: note.updatedAt || new Date().toISOString(),
    };
    
    const docData = objectToFirestoreDoc(noteData);
    await db.collection(NOTES_COLLECTION).doc(id).set(docData);
    
    return noteData;
  } catch (error) {
    throw handleFirestoreError(error, 'createNote');
  }
}

export async function updateNote(id: string, updates: Partial<Omit<Note, 'id'>>): Promise<Note> {
  try {
    const db = ensureFirestoreConnection();
    const docRef = db.collection(NOTES_COLLECTION).doc(id);
    
    const updateData = {
      ...objectToFirestoreDoc(updates),
      updatedAt: new Date().toISOString(),
    };
    await docRef.update(updateData);
    
    const updatedDoc = await docRef.get();
    return firestoreDocToObject<Note>(updatedDoc)!;
  } catch (error) {
    throw handleFirestoreError(error, 'updateNote');
  }
}

export async function deleteNote(id: string): Promise<void> {
  try {
    const db = ensureFirestoreConnection();
    await db.collection(NOTES_COLLECTION).doc(id).delete();
  } catch (error) {
    throw handleFirestoreError(error, 'deleteNote');
  }
}

