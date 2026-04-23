import api from './api';

export const searchCAs = async (params = {}) => {
  const response = await api.get('/ca/search', { params });
  return response.data;
};

export const getCAProfile = async (id) => {
  const response = await api.get(`/ca/profile/${id}`);
  return response.data;
};