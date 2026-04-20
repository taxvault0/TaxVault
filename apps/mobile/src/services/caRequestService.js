import api from './api';

const extractData = (res) => res?.data ?? res;

const normalizeArray = (payload, keys = []) => {
  const data = extractData(payload);

  if (Array.isArray(data)) return data;

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  return [];
};

export const caRequestService = {
  async getRequests() {
    const res = await api.get('/ca/requests');
    return normalizeArray(res, ['requests', 'data']);
  },

  async getRequestDetails(requestId) {
    const res = await api.get(`/ca/requests/${requestId}`);
    return extractData(res);
  },

  async acceptRequest(requestId, payload = {}) {
    const res = await api.post(`/ca/requests/${requestId}/accept`, payload);
    return extractData(res);
  },

  async rejectRequest(requestId, payload = {}) {
    const res = await api.post(`/ca/requests/${requestId}/reject`, payload);
    return extractData(res);
  },
};

export default caRequestService;