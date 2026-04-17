import api from './api';

const extract = (res) => res?.data ?? res;

export const documentRequestService = {
  async getRequests(caseId) {
    const res = await api.get(`/tax-cases/${caseId}/document-requests`);
    return extract(res);
  },

  async createRequest(caseId, payload) {
    const res = await api.post(
      `/tax-cases/${caseId}/document-requests`,
      payload
    );
    return extract(res);
  },

  async updateStatus(requestId, status) {
    const res = await api.patch(
      `/document-requests/${requestId}/status`,
      { status }
    );
    return extract(res);
  },
};

export default documentRequestService;