import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from './config';

const taxAPI = axios.create({
  baseURL: `${API_URL}/tax`,
});

// Add token to requests
taxAPI.interceptors.request.use(async (config) => {
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

/**
 * Get tax summary for a year
 * @param {number} year - Tax year
 * @returns {Promise<Object>} - Tax summary data
 */
export const getTaxSummary = async (year) => {
  try {
    const response = await taxAPI.get(`/summary/${year}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tax summary:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get tax documents
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Tax documents
 */
export const getTaxDocuments = async (params = {}) => {
  try {
    const response = await taxAPI.get('/documents', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching tax documents:', error);
    throw error.response?.data || error;
  }
};

/**
 * Calculate estimated tax
 * @param {Object} data - Income and expense data
 * @returns {Promise<Object>} - Tax calculation
 */
export const calculateEstimatedTax = async (data) => {
  try {
    const response = await taxAPI.post('/estimate', data);
    return response.data;
  } catch (error) {
    console.error('Error calculating tax:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get tax brackets and rates
 * @param {number} year - Tax year
 * @returns {Promise<Object>} - Tax brackets
 */
export const getTaxBrackets = async (year) => {
  try {
    const response = await taxAPI.get(`/brackets/${year}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tax brackets:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get CRA installment amounts
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Installment data
 */
export const getInstallments = async (params = {}) => {
  try {
    const response = await taxAPI.get('/installments', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching installments:', error);
    throw error.response?.data || error;
  }
};

/**
 * File tax return
 * @param {FormData} formData - Tax return data
 * @returns {Promise<Object>} - Filing response
 */
export const fileTaxReturn = async (formData) => {
  try {
    const response = await taxAPI.post('/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error filing tax return:', error);
    throw error.response?.data || error;
  }
};

export default {
  getTaxSummary,
  getTaxDocuments,
  calculateEstimatedTax,
  getTaxBrackets,
  getInstallments,
  fileTaxReturn,
};



