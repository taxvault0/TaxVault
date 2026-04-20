import api from './api';

const extractData = (response) => response?.data ?? response;

const normalizeArray = (payload, keys = []) => {
  const data = extractData(payload);

  if (Array.isArray(data)) return data;

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  return [];
};

const normalizeObject = (payload, keys = []) => {
  const data = extractData(payload);

  if (data && typeof data === 'object' && !Array.isArray(data)) {
    for (const key of keys) {
      if (data?.[key] && typeof data[key] === 'object') {
        return data[key];
      }
    }
    return data;
  }

  return null;
};

export const caClientService = {
  async getClients(params = {}) {
    const response = await api.get('/ca/clients', { params });
    return normalizeArray(response, ['clients', 'data']);
  },

  async getClientDetails(clientId) {
    if (!clientId) throw new Error('Client id is required');

    const response = await api.get(`/ca/clients/${clientId}`);
    return normalizeObject(response, ['client', 'data']);
  },

  async assignCase(clientId, payload) {
    if (!clientId) throw new Error('Client id is required');

    const response = await api.post(`/ca/clients/${clientId}/assign-case`, payload);
    return extractData(response);
  },
};

export default caClientService;