import api from 'services/api';

export const lifeEventsService = {
  // Marital Status
  updateMaritalStatus: (data) => api.post('/users/life-events/marital-status', data),
  
  // Separation/Divorce
  unlinkSpouse: (data) => api.post('/users/life-events/unlink', data),
  
  // Dependents
  addDependent: (data) => api.post('/users/life-events/dependents', data),
  updateDependent: (id, data) => api.put(`/users/life-events/dependents/${id}`, data),
  removeDependent: (id) => api.delete(`/users/life-events/dependents/${id}`),
  
  // Address
  updateAddress: (data) => api.put('/users/profile/address', data),
  
  // Legacy Contact
  setLegacyContact: (data) => api.post('/users/life-events/legacy-contact', data),
  
  // CA Notifications
  notifyCA: (data) => api.post('/notifications/ca', data),
  
  // Get Life Events History
  getLifeEventHistory: () => api.get('/users/life-events/history'),
};










