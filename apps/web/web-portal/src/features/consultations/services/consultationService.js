// src/services/consultationService.js
import api from 'services/api';

export const consultationService = {
  // Client endpoints
  createRequest: (data) => api.post('/consultations/request', data),
  getMyConsultations: (status) => api.get('/consultations/client', { params: { status } }),
  getConsultationById: (id) => api.get(`/consultations/${id}`),
  cancelConsultation: (id, reason) => api.post(`/consultations/${id}/cancel`, { reason }),
  addRating: (id, rating) => api.post(`/consultations/${id}/rate`, rating),
  
  // CA endpoints
  getCARequests: (status) => api.get('/consultations/ca/requests', { params: { status } }),
  acceptRequest: (id, data) => api.post(`/consultations/${id}/accept`, data),
  declineRequest: (id, reason) => api.post(`/consultations/${id}/decline`, { reason }),
  counterOffer: (id, offer) => api.post(`/consultations/${id}/counter`, offer),
  getCAEarnings: (period) => api.get('/consultations/ca/earnings', { params: { period } }),
  setAvailability: (availability) => api.post('/consultations/ca/availability', availability),
  
  // Payment
  processPayment: (id, paymentMethod) => api.post(`/consultations/${id}/pay`, { paymentMethod }),
  
  // Meeting
  generateMeetingLink: (id, provider) => api.post(`/consultations/${id}/meeting`, { provider }),
  sendReminders: (id) => api.post(`/consultations/${id}/remind`),
};








