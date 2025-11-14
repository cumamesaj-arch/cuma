/**
 * Firebase Firestore Categories Helper Fonksiyonları
 * 
 * Bu dosya Categories (Kategoriler) koleksiyonu için tüm CRUD işlemlerini içerir.
 * Server-side (Admin SDK) kullanır.
 * 
 * Not: Icon'lar LucideIcon type'ı olduğu için Firestore'da string olarak saklanır.
 * Runtime'da icon mapping yapılması gerekir.
 */

import type { Category } from '@/lib/types';
import {
  ensureFirestoreConnection,
  handleFirestoreError,
  firestoreDocToObject,
  objectToFirestoreDoc,
} from './common';

const COLLECTION_NAME = 'categories';

/**
 * Firestore'dan gelen Category verisini TypeScript Category'ye dönüştürür
 * Icon string'den LucideIcon'a çevrilmesi gerekir (runtime'da yapılır)
 */
type FirestoreCategory = Omit<Category, 'icon'> & {
  icon: string; // Icon adı string olarak saklanır
};

/**
 * Tüm kategorileri getirir
 * @returns Category array
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const db = ensureFirestoreConnection();
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .orderBy('order', 'asc')
      .get();
    
    if (snapshot.empty) {
      return [];
    }
    
    return snapshot.docs.map(doc => {
      const data = firestoreDocToObject<FirestoreCategory>(doc);
      if (!data) {
        return null;
      }
      
      // Icon'u string'den LucideIcon'a çevirmek için runtime'da mapping yapılmalı
      // Şimdilik icon'u any olarak döndürüyoruz
      return {
        ...data,
        icon: data.icon as any, // Runtime'da icon mapping yapılacak
      } as Category;
    }).filter((cat): cat is Category => cat !== null);
  } catch (error) {
    throw handleFirestoreError(error, 'getCategories');
  }
}

/**
 * ID'ye göre kategori getirir
 * @param id - Kategori ID'si
 * @returns Category veya null
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const db = ensureFirestoreConnection();
    const doc = await db.collection(COLLECTION_NAME).doc(id).get();
    
    if (!doc.exists) {
      return null;
    }
    
    const data = firestoreDocToObject<FirestoreCategory>(doc);
    if (!data) {
      return null;
    }
    
    return {
      ...data,
      icon: data.icon as any, // Runtime'da icon mapping yapılacak
    } as Category;
  } catch (error) {
    throw handleFirestoreError(error, 'getCategoryById');
  }
}

/**
 * Slug'a göre kategori getirir
 * @param slug - Kategori slug'ı
 * @returns Category veya null
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const db = ensureFirestoreConnection();
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .where('slug', '==', slug)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    const data = firestoreDocToObject<FirestoreCategory>(doc);
    if (!data) {
      return null;
    }
    
    return {
      ...data,
      icon: data.icon as any, // Runtime'da icon mapping yapılacak
    } as Category;
  } catch (error) {
    throw handleFirestoreError(error, 'getCategoryBySlug');
  }
}

/**
 * Yeni kategori oluşturur
 * @param category - Kategori verisi (id otomatik oluşturulur, icon string olmalı)
 * @returns Oluşturulan kategori
 */
export async function createCategory(
  category: Omit<Category, 'id'> & { icon: string }
): Promise<Category> {
  try {
    const db = ensureFirestoreConnection();
    
    // Slug kontrolü
    const existingCategory = await getCategoryBySlug(category.slug);
    if (existingCategory) {
      throw new Error(`Bu slug zaten kullanılıyor: ${category.slug}`);
    }
    
    // ID otomatik oluştur
    const id = category.id || `category-${Date.now()}`;
    
    const categoryData: FirestoreCategory = {
      id,
      title: category.title,
      slug: category.slug,
      icon: category.icon, // String olarak sakla
      subcategories: category.subcategories?.map(sub => ({
        ...sub,
        icon: (sub.icon as any)?.name || 'Hand', // Icon'u string'e çevir
      })) || [],
      order: (category as any).order || 0,
    };
    
    const docData = objectToFirestoreDoc(categoryData);
    await db.collection(COLLECTION_NAME).doc(id).set(docData);
    
    return {
      ...categoryData,
      icon: categoryData.icon as any,
    } as Category;
  } catch (error) {
    throw handleFirestoreError(error, 'createCategory');
  }
}

/**
 * Kategori günceller
 * @param id - Kategori ID'si
 * @param updates - Güncellenecek alanlar
 * @returns Güncellenmiş kategori
 */
export async function updateCategory(
  id: string,
  updates: Partial<Omit<Category, 'id' | 'subcategories'>> & {
    subcategories?: Array<Omit<Category, 'subcategories'> & { icon: string }>;
  }
): Promise<Category> {
  try {
    const db = ensureFirestoreConnection();
    
    const docRef = db.collection(COLLECTION_NAME).doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      throw new Error(`Kategori bulunamadı: ${id}`);
    }
    
    // Slug değişikliği kontrolü
    if (updates.slug) {
      const existingCategory = await getCategoryBySlug(updates.slug);
      if (existingCategory && existingCategory.id !== id) {
        throw new Error(`Bu slug zaten kullanılıyor: ${updates.slug}`);
      }
    }
    
    const updateData: any = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.slug !== undefined) updateData.slug = updates.slug;
    if (updates.icon !== undefined) updateData.icon = typeof updates.icon === 'string' ? updates.icon : (updates.icon as any)?.name || 'Hand';
    if (updates.subcategories !== undefined) {
      updateData.subcategories = updates.subcategories.map(sub => ({
        ...sub,
        icon: typeof sub.icon === 'string' ? sub.icon : (sub.icon as any)?.name || 'Hand',
      }));
    }
    if ((updates as any).order !== undefined) updateData.order = (updates as any).order;
    
    const docData = objectToFirestoreDoc(updateData);
    await docRef.update(docData);
    
    const updatedDoc = await docRef.get();
    const data = firestoreDocToObject<FirestoreCategory>(updatedDoc);
    if (!data) {
      throw new Error(`Kategori güncellendikten sonra bulunamadı: ${id}`);
    }
    
    return {
      ...data,
      icon: data.icon as any,
    } as Category;
  } catch (error) {
    throw handleFirestoreError(error, 'updateCategory');
  }
}

/**
 * Kategori siler
 * @param id - Kategori ID'si
 */
export async function deleteCategory(id: string): Promise<void> {
  try {
    const db = ensureFirestoreConnection();
    await db.collection(COLLECTION_NAME).doc(id).delete();
  } catch (error) {
    throw handleFirestoreError(error, 'deleteCategory');
  }
}

/**
 * Alt kategori ekler
 * @param parentCategoryId - Ana kategori ID'si
 * @param subcategory - Alt kategori verisi
 * @returns Oluşturulan alt kategori
 */
export async function createSubcategory(
  parentCategoryId: string,
  subcategory: Omit<Category, 'id' | 'subcategories'> & { icon: string }
): Promise<Category> {
  try {
    const db = ensureFirestoreConnection();
    
    const docRef = db.collection(COLLECTION_NAME).doc(parentCategoryId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      throw new Error(`Ana kategori bulunamadı: ${parentCategoryId}`);
    }
    
    const data = firestoreDocToObject<FirestoreCategory>(doc);
    if (!data) {
      throw new Error(`Ana kategori verisi okunamadı: ${parentCategoryId}`);
    }
    
    // Mevcut alt kategorileri al
    const existingSubcategories = data.subcategories || [];
    
    // Yeni alt kategori ID'si oluştur
    const existingSubIds = existingSubcategories.map(sub => sub.id);
    let subcategoryId = '';
    let suffix = 'a';
    let attempts = 0;
    while (attempts < 26) {
      const candidate = `${parentCategoryId}${suffix}`;
      if (!existingSubIds.includes(candidate)) {
        subcategoryId = candidate;
        break;
      }
      suffix = String.fromCharCode(suffix.charCodeAt(0) + 1);
      attempts++;
    }
    
    if (!subcategoryId) {
      throw new Error('Alt kategori ID\'si oluşturulamadı. Tüm harfler kullanılmış olabilir.');
    }
    
    // Yeni alt kategoriyi ekle
    const newSubcategory: FirestoreCategory = {
      id: subcategoryId,
      title: subcategory.title,
      slug: subcategory.slug,
      icon: subcategory.icon,
    };
    
    const updatedSubcategories = [...existingSubcategories, newSubcategory];
    
    await docRef.update({
      subcategories: updatedSubcategories.map(sub => ({
        id: sub.id,
        title: sub.title,
        slug: sub.slug,
        icon: sub.icon,
      })),
    });
    
    return {
      ...newSubcategory,
      icon: newSubcategory.icon as any,
    } as Category;
  } catch (error) {
    throw handleFirestoreError(error, 'createSubcategory');
  }
}

/**
 * Alt kategori günceller
 * @param parentCategoryId - Ana kategori ID'si
 * @param subcategoryId - Alt kategori ID'si
 * @param updates - Güncellenecek alanlar
 * @returns Güncellenmiş alt kategori
 */
export async function updateSubcategory(
  parentCategoryId: string,
  subcategoryId: string,
  updates: Partial<Omit<Category, 'id' | 'subcategories'>> & { icon?: string }
): Promise<Category> {
  try {
    const db = ensureFirestoreConnection();
    
    const docRef = db.collection(COLLECTION_NAME).doc(parentCategoryId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      throw new Error(`Ana kategori bulunamadı: ${parentCategoryId}`);
    }
    
    const data = firestoreDocToObject<FirestoreCategory>(doc);
    if (!data) {
      throw new Error(`Ana kategori verisi okunamadı: ${parentCategoryId}`);
    }
    
    const subcategories = data.subcategories || [];
    const subcategoryIndex = subcategories.findIndex(sub => sub.id === subcategoryId);
    
    if (subcategoryIndex === -1) {
      throw new Error(`Alt kategori bulunamadı: ${subcategoryId}`);
    }
    
    // Alt kategoriyi güncelle
    const updatedSubcategory = {
      ...subcategories[subcategoryIndex],
      ...updates,
      icon: updates.icon !== undefined 
        ? (typeof updates.icon === 'string' ? updates.icon : (updates.icon as any)?.name || 'Hand')
        : subcategories[subcategoryIndex].icon,
    };
    
    subcategories[subcategoryIndex] = updatedSubcategory;
    
    await docRef.update({
      subcategories: subcategories.map(sub => ({
        id: sub.id,
        title: sub.title,
        slug: sub.slug,
        icon: sub.icon,
      })),
    });
    
    return {
      ...updatedSubcategory,
      icon: updatedSubcategory.icon as any,
    } as Category;
  } catch (error) {
    throw handleFirestoreError(error, 'updateSubcategory');
  }
}

/**
 * Alt kategori siler
 * @param parentCategoryId - Ana kategori ID'si
 * @param subcategoryId - Alt kategori ID'si
 */
export async function deleteSubcategory(
  parentCategoryId: string,
  subcategoryId: string
): Promise<void> {
  try {
    const db = ensureFirestoreConnection();
    
    const docRef = db.collection(COLLECTION_NAME).doc(parentCategoryId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      throw new Error(`Ana kategori bulunamadı: ${parentCategoryId}`);
    }
    
    const data = firestoreDocToObject<FirestoreCategory>(doc);
    if (!data) {
      throw new Error(`Ana kategori verisi okunamadı: ${parentCategoryId}`);
    }
    
    const subcategories = (data.subcategories || []).filter(sub => sub.id !== subcategoryId);
    
    await docRef.update({
      subcategories: subcategories.map(sub => ({
        id: sub.id,
        title: sub.title,
        slug: sub.slug,
        icon: sub.icon,
      })),
    });
  } catch (error) {
    throw handleFirestoreError(error, 'deleteSubcategory');
  }
}


 * Firebase Firestore Categories Helper Fonksiyonları
 * 
 * Bu dosya Categories (Kategoriler) koleksiyonu için tüm CRUD işlemlerini içerir.
 * Server-side (Admin SDK) kullanır.
 * 
 * Not: Icon'lar LucideIcon type'ı olduğu için Firestore'da string olarak saklanır.
 * Runtime'da icon mapping yapılması gerekir.
 */

import type { Category } from '@/lib/types';
import {
  ensureFirestoreConnection,
  handleFirestoreError,
  firestoreDocToObject,
  objectToFirestoreDoc,
} from './common';

const COLLECTION_NAME = 'categories';

/**
 * Firestore'dan gelen Category verisini TypeScript Category'ye dönüştürür
 * Icon string'den LucideIcon'a çevrilmesi gerekir (runtime'da yapılır)
 */
type FirestoreCategory = Omit<Category, 'icon'> & {
  icon: string; // Icon adı string olarak saklanır
};

/**
 * Tüm kategorileri getirir
 * @returns Category array
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const db = ensureFirestoreConnection();
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .orderBy('order', 'asc')
      .get();
    
    if (snapshot.empty) {
      return [];
    }
    
    return snapshot.docs.map(doc => {
      const data = firestoreDocToObject<FirestoreCategory>(doc);
      if (!data) {
        return null;
      }
      
      // Icon'u string'den LucideIcon'a çevirmek için runtime'da mapping yapılmalı
      // Şimdilik icon'u any olarak döndürüyoruz
      return {
        ...data,
        icon: data.icon as any, // Runtime'da icon mapping yapılacak
      } as Category;
    }).filter((cat): cat is Category => cat !== null);
  } catch (error) {
    throw handleFirestoreError(error, 'getCategories');
  }
}

/**
 * ID'ye göre kategori getirir
 * @param id - Kategori ID'si
 * @returns Category veya null
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const db = ensureFirestoreConnection();
    const doc = await db.collection(COLLECTION_NAME).doc(id).get();
    
    if (!doc.exists) {
      return null;
    }
    
    const data = firestoreDocToObject<FirestoreCategory>(doc);
    if (!data) {
      return null;
    }
    
    return {
      ...data,
      icon: data.icon as any, // Runtime'da icon mapping yapılacak
    } as Category;
  } catch (error) {
    throw handleFirestoreError(error, 'getCategoryById');
  }
}

/**
 * Slug'a göre kategori getirir
 * @param slug - Kategori slug'ı
 * @returns Category veya null
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const db = ensureFirestoreConnection();
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .where('slug', '==', slug)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    const data = firestoreDocToObject<FirestoreCategory>(doc);
    if (!data) {
      return null;
    }
    
    return {
      ...data,
      icon: data.icon as any, // Runtime'da icon mapping yapılacak
    } as Category;
  } catch (error) {
    throw handleFirestoreError(error, 'getCategoryBySlug');
  }
}

/**
 * Yeni kategori oluşturur
 * @param category - Kategori verisi (id otomatik oluşturulur, icon string olmalı)
 * @returns Oluşturulan kategori
 */
export async function createCategory(
  category: Omit<Category, 'id'> & { icon: string }
): Promise<Category> {
  try {
    const db = ensureFirestoreConnection();
    
    // Slug kontrolü
    const existingCategory = await getCategoryBySlug(category.slug);
    if (existingCategory) {
      throw new Error(`Bu slug zaten kullanılıyor: ${category.slug}`);
    }
    
    // ID otomatik oluştur
    const id = category.id || `category-${Date.now()}`;
    
    const categoryData: FirestoreCategory = {
      id,
      title: category.title,
      slug: category.slug,
      icon: category.icon, // String olarak sakla
      subcategories: category.subcategories?.map(sub => ({
        ...sub,
        icon: (sub.icon as any)?.name || 'Hand', // Icon'u string'e çevir
      })) || [],
      order: (category as any).order || 0,
    };
    
    const docData = objectToFirestoreDoc(categoryData);
    await db.collection(COLLECTION_NAME).doc(id).set(docData);
    
    return {
      ...categoryData,
      icon: categoryData.icon as any,
    } as Category;
  } catch (error) {
    throw handleFirestoreError(error, 'createCategory');
  }
}

/**
 * Kategori günceller
 * @param id - Kategori ID'si
 * @param updates - Güncellenecek alanlar
 * @returns Güncellenmiş kategori
 */
export async function updateCategory(
  id: string,
  updates: Partial<Omit<Category, 'id' | 'subcategories'>> & {
    subcategories?: Array<Omit<Category, 'subcategories'> & { icon: string }>;
  }
): Promise<Category> {
  try {
    const db = ensureFirestoreConnection();
    
    const docRef = db.collection(COLLECTION_NAME).doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      throw new Error(`Kategori bulunamadı: ${id}`);
    }
    
    // Slug değişikliği kontrolü
    if (updates.slug) {
      const existingCategory = await getCategoryBySlug(updates.slug);
      if (existingCategory && existingCategory.id !== id) {
        throw new Error(`Bu slug zaten kullanılıyor: ${updates.slug}`);
      }
    }
    
    const updateData: any = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.slug !== undefined) updateData.slug = updates.slug;
    if (updates.icon !== undefined) updateData.icon = typeof updates.icon === 'string' ? updates.icon : (updates.icon as any)?.name || 'Hand';
    if (updates.subcategories !== undefined) {
      updateData.subcategories = updates.subcategories.map(sub => ({
        ...sub,
        icon: typeof sub.icon === 'string' ? sub.icon : (sub.icon as any)?.name || 'Hand',
      }));
    }
    if ((updates as any).order !== undefined) updateData.order = (updates as any).order;
    
    const docData = objectToFirestoreDoc(updateData);
    await docRef.update(docData);
    
    const updatedDoc = await docRef.get();
    const data = firestoreDocToObject<FirestoreCategory>(updatedDoc);
    if (!data) {
      throw new Error(`Kategori güncellendikten sonra bulunamadı: ${id}`);
    }
    
    return {
      ...data,
      icon: data.icon as any,
    } as Category;
  } catch (error) {
    throw handleFirestoreError(error, 'updateCategory');
  }
}

/**
 * Kategori siler
 * @param id - Kategori ID'si
 */
export async function deleteCategory(id: string): Promise<void> {
  try {
    const db = ensureFirestoreConnection();
    await db.collection(COLLECTION_NAME).doc(id).delete();
  } catch (error) {
    throw handleFirestoreError(error, 'deleteCategory');
  }
}

/**
 * Alt kategori ekler
 * @param parentCategoryId - Ana kategori ID'si
 * @param subcategory - Alt kategori verisi
 * @returns Oluşturulan alt kategori
 */
export async function createSubcategory(
  parentCategoryId: string,
  subcategory: Omit<Category, 'id' | 'subcategories'> & { icon: string }
): Promise<Category> {
  try {
    const db = ensureFirestoreConnection();
    
    const docRef = db.collection(COLLECTION_NAME).doc(parentCategoryId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      throw new Error(`Ana kategori bulunamadı: ${parentCategoryId}`);
    }
    
    const data = firestoreDocToObject<FirestoreCategory>(doc);
    if (!data) {
      throw new Error(`Ana kategori verisi okunamadı: ${parentCategoryId}`);
    }
    
    // Mevcut alt kategorileri al
    const existingSubcategories = data.subcategories || [];
    
    // Yeni alt kategori ID'si oluştur
    const existingSubIds = existingSubcategories.map(sub => sub.id);
    let subcategoryId = '';
    let suffix = 'a';
    let attempts = 0;
    while (attempts < 26) {
      const candidate = `${parentCategoryId}${suffix}`;
      if (!existingSubIds.includes(candidate)) {
        subcategoryId = candidate;
        break;
      }
      suffix = String.fromCharCode(suffix.charCodeAt(0) + 1);
      attempts++;
    }
    
    if (!subcategoryId) {
      throw new Error('Alt kategori ID\'si oluşturulamadı. Tüm harfler kullanılmış olabilir.');
    }
    
    // Yeni alt kategoriyi ekle
    const newSubcategory: FirestoreCategory = {
      id: subcategoryId,
      title: subcategory.title,
      slug: subcategory.slug,
      icon: subcategory.icon,
    };
    
    const updatedSubcategories = [...existingSubcategories, newSubcategory];
    
    await docRef.update({
      subcategories: updatedSubcategories.map(sub => ({
        id: sub.id,
        title: sub.title,
        slug: sub.slug,
        icon: sub.icon,
      })),
    });
    
    return {
      ...newSubcategory,
      icon: newSubcategory.icon as any,
    } as Category;
  } catch (error) {
    throw handleFirestoreError(error, 'createSubcategory');
  }
}

/**
 * Alt kategori günceller
 * @param parentCategoryId - Ana kategori ID'si
 * @param subcategoryId - Alt kategori ID'si
 * @param updates - Güncellenecek alanlar
 * @returns Güncellenmiş alt kategori
 */
export async function updateSubcategory(
  parentCategoryId: string,
  subcategoryId: string,
  updates: Partial<Omit<Category, 'id' | 'subcategories'>> & { icon?: string }
): Promise<Category> {
  try {
    const db = ensureFirestoreConnection();
    
    const docRef = db.collection(COLLECTION_NAME).doc(parentCategoryId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      throw new Error(`Ana kategori bulunamadı: ${parentCategoryId}`);
    }
    
    const data = firestoreDocToObject<FirestoreCategory>(doc);
    if (!data) {
      throw new Error(`Ana kategori verisi okunamadı: ${parentCategoryId}`);
    }
    
    const subcategories = data.subcategories || [];
    const subcategoryIndex = subcategories.findIndex(sub => sub.id === subcategoryId);
    
    if (subcategoryIndex === -1) {
      throw new Error(`Alt kategori bulunamadı: ${subcategoryId}`);
    }
    
    // Alt kategoriyi güncelle
    const updatedSubcategory = {
      ...subcategories[subcategoryIndex],
      ...updates,
      icon: updates.icon !== undefined 
        ? (typeof updates.icon === 'string' ? updates.icon : (updates.icon as any)?.name || 'Hand')
        : subcategories[subcategoryIndex].icon,
    };
    
    subcategories[subcategoryIndex] = updatedSubcategory;
    
    await docRef.update({
      subcategories: subcategories.map(sub => ({
        id: sub.id,
        title: sub.title,
        slug: sub.slug,
        icon: sub.icon,
      })),
    });
    
    return {
      ...updatedSubcategory,
      icon: updatedSubcategory.icon as any,
    } as Category;
  } catch (error) {
    throw handleFirestoreError(error, 'updateSubcategory');
  }
}

/**
 * Alt kategori siler
 * @param parentCategoryId - Ana kategori ID'si
 * @param subcategoryId - Alt kategori ID'si
 */
export async function deleteSubcategory(
  parentCategoryId: string,
  subcategoryId: string
): Promise<void> {
  try {
    const db = ensureFirestoreConnection();
    
    const docRef = db.collection(COLLECTION_NAME).doc(parentCategoryId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      throw new Error(`Ana kategori bulunamadı: ${parentCategoryId}`);
    }
    
    const data = firestoreDocToObject<FirestoreCategory>(doc);
    if (!data) {
      throw new Error(`Ana kategori verisi okunamadı: ${parentCategoryId}`);
    }
    
    const subcategories = (data.subcategories || []).filter(sub => sub.id !== subcategoryId);
    
    await docRef.update({
      subcategories: subcategories.map(sub => ({
        id: sub.id,
        title: sub.title,
        slug: sub.slug,
        icon: sub.icon,
      })),
    });
  } catch (error) {
    throw handleFirestoreError(error, 'deleteSubcategory');
  }
}

