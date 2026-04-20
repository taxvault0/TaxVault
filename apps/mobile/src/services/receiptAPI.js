import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@/constants/config';

const receiptAPI = axios.create({
  baseURL: `${API_URL}/receipts`,
});

// Add token to requests
receiptAPI.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Error adding token to request:', error);
    return config;
  }
});

// Handle response errors
receiptAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access - token may be expired');
    }
    return Promise.reject(error);
  }
);

const normalizeReceiptStats = (payload = {}) => {
  const source =
    payload?.stats && typeof payload.stats === 'object'
      ? payload.stats
      : payload;

  return {
    total: Number(source?.total ?? source?.count ?? 0),
    categorized: Number(source?.categorized ?? 0),
    uncategorized: Number(source?.uncategorized ?? 0),
    pending: Number(source?.pending ?? 0),
    approved: Number(source?.approved ?? 0),
    rejected: Number(source?.rejected ?? 0),
  };
};

/**
 * Get all receipts with optional filters
 * @param {Object} params - Query parameters
 * @param {string} params.category - Filter by category
 * @param {string} params.sort - Sort order
 * @param {string} params.dateRange - Date range filter
 * @param {string} params.search - Search query
 * @returns {Promise<Object>} - Receipts data
 */
export const getReceipts = async (params = {}) => {
  try {
    const response = await receiptAPI.get('/', { params });
    return response?.data ?? {};
  } catch (error) {
    console.error('Error fetching receipts:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get single receipt by ID
 * @param {string|number} id - Receipt ID
 * @returns {Promise<Object>} - Receipt data
 */
export const getReceipt = async (id) => {
  try {
    const response = await receiptAPI.get(`/${id}`);
    return response?.data ?? {};
  } catch (error) {
    console.error(`Error fetching receipt ${id}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Create new receipt
 * @param {FormData} formData - Form data with receipt info and image
 * @returns {Promise<Object>} - Created receipt data
 */
export const createReceipt = async (formData) => {
  try {
    const response = await receiptAPI.post('/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response?.data ?? {};
  } catch (error) {
    console.error('Error creating receipt:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update receipt
 * @param {string|number} id - Receipt ID
 * @param {Object} data - Updated receipt data
 * @returns {Promise<Object>} - Updated receipt data
 */
export const updateReceipt = async (id, data) => {
  try {
    const response = await receiptAPI.put(`/${id}`, data);
    return response?.data ?? {};
  } catch (error) {
    console.error(`Error updating receipt ${id}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Delete receipt
 * @param {string|number} id - Receipt ID
 * @returns {Promise<Object>} - Deletion response
 */
export const deleteReceipt = async (id) => {
  try {
    const response = await receiptAPI.delete(`/${id}`);
    return response?.data ?? {};
  } catch (error) {
    console.error(`Error deleting receipt ${id}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Upload receipt image only
 * @param {string} imageUri - Local image URI
 * @returns {Promise<Object>} - Upload response with image URL
 */
export const uploadReceiptImage = async (imageUri) => {
  try {
    const formData = new FormData();

    const fileName = imageUri.split('/').pop();
    const fileType = fileName.split('.').pop();

    formData.append('receipt', {
      uri: imageUri,
      type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`,
      name: fileName || 'receipt.jpg',
    });

    const response = await receiptAPI.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response?.data ?? {};
  } catch (error) {
    console.error('Error uploading receipt image:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get receipt categories
 * @returns {Promise<Array>} - List of categories
 */
export const getCategories = async () => {
  try {
    const response = await receiptAPI.get('/categories');
    return response?.data ?? [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get receipt statistics
 * @param {Object} params - Query parameters
 * @param {string} params.year - Year for stats
 * @param {string} params.month - Month for stats
 * @returns {Promise<Object>} - Statistics data
 */
export const getReceiptStats = async (params = {}) => {
  try {
    const response = await receiptAPI.get('/stats', { params });
    return normalizeReceiptStats(response?.data);
  } catch (error) {
    console.error('Error fetching receipt stats:', error);
    return normalizeReceiptStats();
  }
};

/**
 * Export receipts
 * @param {Object} params - Export parameters
 * @param {string} params.format - Export format (pdf, csv, excel)
 * @param {string} params.dateRange - Date range
 * @returns {Promise<Blob>} - File blob
 */
export const exportReceipts = async (params = {}) => {
  try {
    const response = await receiptAPI.get('/export', {
      params,
      responseType: 'blob',
    });
    return response?.data;
  } catch (error) {
    console.error('Error exporting receipts:', error);
    throw error.response?.data || error;
  }
};

/**
 * Bulk delete receipts
 * @param {Array} ids - Array of receipt IDs to delete
 * @returns {Promise<Object>} - Bulk deletion response
 */
export const bulkDeleteReceipts = async (ids) => {
  try {
    const response = await receiptAPI.post('/bulk-delete', { ids });
    return response?.data ?? {};
  } catch (error) {
    console.error('Error bulk deleting receipts:', error);
    throw error.response?.data || error;
  }
};

export default {
  getReceipts,
  getReceipt,
  createReceipt,
  updateReceipt,
  deleteReceipt,
  uploadReceiptImage,
  getCategories,
  getReceiptStats,
  exportReceipts,
  bulkDeleteReceipts,
};