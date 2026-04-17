import api from './api';

const extract = (res) => res?.data ?? res;

export const caCaseService = {
  async createCase(clientId, payload) {
    const res = await api.post('/tax-cases', {
      client: clientId,
      ...payload,
    });
    return extract(res);
  },

  async getCase(caseId) {
    const res = await api.get(`/tax-cases/${caseId}`);
    return extract(res);
  },

  async getClientCases(clientId) {
    const res = await api.get(`/tax-cases?client=${clientId}`);
    return extract(res);
  },

  async updateStatus(caseId, status) {
    const res = await api.patch(`/tax-cases/${caseId}/status`, { status });
    return extract(res);
  },
};

export default caCaseService;