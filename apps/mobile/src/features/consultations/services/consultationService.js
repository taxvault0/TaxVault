import api from '../../../services/api';

const consultationService = {
  create: async (payload) => {
    const response = await api.post('/consultations', payload);
    return response.data;
  },

  getMy: async (status) => {
    const response = await api.get('/consultations/my', {
      params: status ? { status } : {},
    });
    return response.data;
  },

  getCAConsultations: async (status) => {
    const response = await api.get('/consultations/ca/my', {
      params: status ? { status } : {},
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/consultations/${id}`);
    return response.data;
  },

  confirm: async (id, payload = {}) => {
    const response = await api.patch(`/consultations/${id}/confirm`, payload);
    return response.data;
  },

  reschedule: async (id, payload = {}) => {
    const response = await api.patch(`/consultations/${id}/reschedule`, payload);
    return response.data;
  },

  complete: async (id, payload = {}) => {
    const response = await api.patch(`/consultations/${id}/complete`, payload);
    return response.data;
  },

  cancel: async (id, payload = {}) => {
    const response = await api.patch(`/consultations/${id}/cancel`, payload);
    return response.data;
  },
};

export default consultationService;