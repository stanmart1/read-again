import { API_BASE_URL } from './api';

const UPLOAD_SERVICE_URL = 'https://read-upload.estateman.online';

/**
 * Upload ebook file
 * @param {File} file - Ebook file to upload
 * @returns {Promise<{path: string, size: number}>}
 */
export const uploadEbook = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${UPLOAD_SERVICE_URL}/api/upload/ebook`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload ebook');
  }

  return response.json();
};

/**
 * Upload cover image
 * @param {File} file - Cover image file to upload
 * @returns {Promise<{path: string, size: number}>}
 */
export const uploadCover = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${UPLOAD_SERVICE_URL}/api/upload/cover`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload cover');
  }

  return response.json();
};

/**
 * Upload profile photo
 * @param {File} file - Profile photo file to upload
 * @returns {Promise<{path: string, size: number}>}
 */
export const uploadProfile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${UPLOAD_SERVICE_URL}/api/upload/profile`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload profile photo');
  }

  return response.json();
};

/**
 * Get full URL for file serving
 * @param {string} filePath - File path from upload service (e.g., '/ebooks/123.epub' or '/covers/456.jpg')
 * @returns {string} Full URL to access the file
 */
export const getFileUrl = (filePath) => {
  if (!filePath) return null;
  
  // If already a full URL, return as is
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }
  
  // Remove leading slash if present
  const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  
  // Return full URL from upload service
  return `${UPLOAD_SERVICE_URL}/files/${cleanPath}`;
};

/**
 * Get image URL with fallback
 * @param {string} filePath - File path from upload service
 * @param {string} fallback - Fallback image path (default: '/placeholder-book.png')
 * @returns {string} Image URL or fallback
 */
export const getImageUrl = (filePath, fallback = '/placeholder-book.png') => {
  return getFileUrl(filePath) || fallback;
};
