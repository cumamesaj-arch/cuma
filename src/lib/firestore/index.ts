/**
 * Firebase Firestore Helper Fonksiyonları - Index
 * 
 * Bu dosya tüm Firestore helper fonksiyonlarını tek bir yerden export eder.
 */

// Common helpers
export {
  handleFirestoreError,
  timestampToISO,
  isoToTimestamp,
  firestoreDocToObject,
  objectToFirestoreDoc,
  ensureFirestoreConnection,
  getFirestoreBatch,
} from './common';

// Posts helpers
export {
  getPosts,
  getAllPosts,
  getPostById,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  restorePost,
  permanentlyDeletePost,
  getDeletedPosts,
  emptyDeletedPosts,
  updatePostOrder,
  swapPostDates,
  updatePostStatus,
} from './posts';

// Images helpers
export {
  getImages,
  getImageById,
  createImage,
  createImages,
  updateImage,
  deleteImage,
  restoreImage,
  permanentlyDeleteImage,
  getDeletedImages,
  emptyDeletedImages,
} from './images';

// Comments helpers
export {
  getComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
} from './comments';

// Users helpers
export {
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
} from './users';

// Visitor Messages helpers
export {
  getVisitorMessages,
  getVisitorMessageById,
  createVisitorMessage,
  deleteVisitorMessage,
} from './visitor-messages';

// Custom Menus helpers
export {
  getCustomMenus,
  getCustomMenuById,
  createCustomMenu,
  updateCustomMenu,
  deleteCustomMenu,
} from './custom-menus';

// Categories helpers
export {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from './categories';

// Settings helpers
export {
  // Category Settings
  getCategorySettings,
  getCategorySetting,
  updateCategorySetting,
  // Social Links
  getSocialLinks,
  getSocialLink,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  // Share Links
  getShareLinks,
  createSharePlatform,
  deleteSharePlatform,
  // Homepage Sections
  getHomepageSections,
  updateHomepageSections,
  // Menu Config
  getMenuConfig,
  updateMenuConfig,
  // Social Media APIs
  getSocialMediaAPIs,
  getSocialMediaAPI,
  createSocialMediaAPI,
  updateSocialMediaAPI,
  deleteSocialMediaAPI,
  // Notes
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from './settings';

