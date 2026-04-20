import api from './api';

export const getConversations = async () => {
  const response = await api.get('/messages/conversations');
  return response.data;
};

export const getMessages = async (conversationId) => {
  const response = await api.get(/messages/);
  return response.data;
};

export const sendMessage = async (payload) => {
  const response = await api.post('/messages', payload);
  return response.data;
};

export const markConversationRead = async (conversationId) => {
  const response = await api.patch(/messages//read);
  return response.data;
};

export const messageService = {
  getConversations,
  getMessages,
  sendMessage,
  markConversationRead,
};

export default messageService;



