import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@/constants/config';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const buildReactNativeFile = (file, fallbackName) => {
  if (!file?.uri) return file;

  return {
    uri: file.uri,
    type: file.type || 'application/octet-stream',
    name: file.fileName || file.name || fallbackName,
  };
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error.response?.status;
    const url = originalRequest.url || '';

    const isCARegistrationRequest =
      url.includes('/ca-registration/save-draft') ||
      url.includes('/ca-registration/submit');

    if (status === 401 && !originalRequest._retry && !isCARegistrationRequest) {
      originalRequest._retry = true;
      await SecureStore.deleteItemAsync('token');
    }

    return Promise.reject(error);
  }
);

export const onboardingAPI = {
  save: (data) => api.post('/onboarding', data),
  get: () => api.get('/onboarding'),
};

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  verifyMfa: (data) => api.post('/auth/verify-mfa', data),
  setupMfa: () => api.post('/auth/setup-mfa'),
  enableMfa: (data) => api.post('/auth/enable-mfa', data),
  disableMfa: () => api.post('/auth/disable-mfa'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) =>
    api.put(`/auth/reset-password/${token}`, { password }),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Receipt API
export const receiptAPI = {
  getReceipts: (params) => api.get('/receipts', { params }),
  getReceipt: (id) => api.get(`/receipts/${id}`),

  createReceipt: (data) => {
    const formData = new FormData();

    Object.keys(data || {}).forEach((key) => {
      if (key === 'image' && data[key]) {
        formData.append('receipt', buildReactNativeFile(data[key], 'receipt.jpg'));
      } else if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    return api.post('/receipts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updateReceipt: (id, data) => api.put(`/receipts/${id}`, data),
  deleteReceipt: (id) => api.delete(`/receipts/${id}`),
  getCategories: () => api.get('/receipts/categories'),
  getSummary: (taxYear) => api.get('/receipts/summary', { params: { taxYear } }),
};

// Mileage API
export const mileageAPI = {
  getMileage: (taxYear) => api.get('/mileage', { params: { taxYear } }),
  addTrip: (data) => api.post('/mileage/trips', data),
  updateTrip: (tripId, data) => api.put(`/mileage/trips/${tripId}`, data),
  deleteTrip: (tripId) => api.delete(`/mileage/trips/${tripId}`),
  getSummary: (taxYear) => api.get('/mileage/summary', { params: { taxYear } }),
  updateSettings: (settings) => api.put('/mileage/settings', settings),
};

// Document API
export const documentAPI = {
  getDocuments: (params) => api.get('/documents', { params }),
  getDocument: (id) => api.get(`/documents/${id}`),

  uploadDocument: (data) => {
    const formData = new FormData();

    Object.keys(data || {}).forEach((key) => {
      if (key === 'file' && data[key]) {
        formData.append(
          'document',
          buildReactNativeFile(data[key], 'document.pdf')
        );
      } else if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    return api.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteDocument: (id) => api.delete(`/documents/${id}`),
  getTypes: () => api.get('/documents/types'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  updatePassword: (data) => api.put('/users/password', data),
  getDashboard: (taxYear) => api.get('/users/dashboard', { params: { taxYear } }),
  getStats: () => api.get('/users/stats'),

  getMyClientId: () => api.get('/users/me/client-id'),
  searchClientByClientId: (clientId) => api.get(`/users/client/${clientId}`),
};

// CA Registration API
export const caRegistrationAPI = {
  saveDraft: (data) => api.post('/ca-registration/save-draft', data),
  submit: (data) => api.post('/ca-registration/submit', data),
  getDraft: () => api.get('/ca-registration/me'),
  getDashboard: () => api.get('/ca-registration/dashboard'),
};

// CA API
export const caAPI = {
  getClients: (params) => api.get('/ca/clients', { params }),
  getClient: (id) => api.get(`/ca/clients/${id}`),
  getClientDashboard: (id, taxYear) =>
    api.get(`/ca/clients/${id}/dashboard`, { params: { taxYear } }),

  getClientReceipts: (id, params) =>
    api.get(`/ca/clients/${id}/receipts`, { params }),

  getClientMileage: (id, taxYear) =>
    api.get(`/ca/clients/${id}/mileage`, { params: { taxYear } }),

  getClientDocuments: (id, params) =>
    api.get(`/ca/clients/${id}/documents`, { params }),

  requestDocument: (id, data) =>
    api.post(`/ca/clients/${id}/request-document`, data),

  verifyDocument: (id, data) =>
    api.post(`/ca/clients/${id}/verify-document`, data),

  getPendingReviews: () => api.get('/ca/pending-reviews'),
  getActivity: () => api.get('/ca/activity'),
  getInvitations: () => api.get('/ca/invitations'),
  acceptInvitation: (token) => api.post(`/ca/accept-invitation/${token}`),

  // keep your existing mobile helper too
  findClientById: (clientId) => api.get(`/ca/clients/search/by-id/${clientId}`),

  // legacy helpers you already had
  inviteCA: (data) => api.post('/ca/invite', data),
  revokeAccess: (id) => api.delete(`/ca/access/${id}`),
};

// Reports API
export const reportAPI = {
  generateReport: (data) => api.post('/reports/generate', data),
  getReports: () => api.get('/reports'),
  getReport: (id) => api.get(`/reports/${id}`),
  downloadReport: (id, format) =>
    api.get(`/reports/${id}/download`, {
      params: { format },
      responseType: 'blob',
    }),
};

export default api;