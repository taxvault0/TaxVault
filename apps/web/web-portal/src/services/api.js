import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    const isCARegistrationRequest =
      url.includes('/ca-registration/save-draft') ||
      url.includes('/ca-registration/submit');

    if (status === 401 && !isCARegistrationRequest) {
      localStorage.removeItem('token');
      window.location.href = '/login/user';
      toast.error('Session expired. Please login again.');
    }

    return Promise.reject(error);
  }
);

export const onboardingAPI = {
  save: (data) => api.put('/onboarding', data),
  get: () => api.get('/onboarding'),
};

export const authAPI = {
  login: (data) => api.post('/auth/login', data),

  register: async (data) => {
    try {
      console.log('=== REGISTER REQUEST ===');
      console.log('Sending data:', data);

      const response = await api.post('/auth/register', data);

      console.log('=== REGISTER SUCCESS ===');
      console.log('Response:', response.data);

      return response.data;
    } catch (error) {
      console.error('=== REGISTER ERROR ===');
      console.error('Message:', error.message);
      console.error('Status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      console.error('VALIDATION ERRORS:', error.response?.data?.errors);
      console.error('Request data:', data);

      throw error;
    }
  },

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

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  updatePassword: (data) => api.put('/users/password', data),
  getDashboard: (taxYear) => api.get('/users/dashboard', { params: { taxYear } }),
  getStats: () => api.get('/users/stats'),
};

export const receiptAPI = {
  getReceipts: (params) => api.get('/receipts', { params }),
  getReceipt: (id) => api.get(`/receipts/${id}`),
  createReceipt: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === 'image') {
        formData.append('receipt', data[key]);
      } else {
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

export const mileageAPI = {
  getMileage: (taxYear) => api.get('/mileage', { params: { taxYear } }),
  addTrip: (data) => api.post('/mileage/trips', data),
  updateTrip: (tripId, data) => api.put(`/mileage/trips/${tripId}`, data),
  deleteTrip: (tripId) => api.delete(`/mileage/trips/${tripId}`),
  getSummary: (taxYear) => api.get('/mileage/summary', { params: { taxYear } }),
  updateSettings: (settings) => api.put('/mileage/settings', settings),
};

export const documentAPI = {
  getDocuments: (params) => api.get('/documents', { params }),
  getDocument: (id) => api.get(`/documents/${id}`),
  uploadDocument: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === 'file') {
        formData.append('document', data[key]);
      } else {
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

export const caRegistrationAPI = {
  saveDraft: (data) => api.post('/ca-registration/save-draft', data),
  submit: (data) => api.post('/ca-registration/submit', data),
  getDraft: () => api.get('/ca-registration/me'),
  getDashboard: () => api.get('/ca-registration/dashboard'),
};

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
  requestDocument: (id, data) => api.post(`/ca/clients/${id}/request-document`, data),
  verifyDocument: (id, data) => api.post(`/ca/clients/${id}/verify-document`, data),
  getPendingReviews: () => api.get('/ca/pending-reviews'),
  getActivity: () => api.get('/ca/activity'),
  getInvitations: () => api.get('/ca/invitations'),
  acceptInvitation: (token) => api.post(`/ca/accept-invitation/${token}`),
};

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