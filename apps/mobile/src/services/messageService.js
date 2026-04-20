import api from './api';

const extractData = (response) => response?.data ?? response;

const normalizeConversationPayload = (payload) => {
  const data = extractData(payload);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.conversations)) return data.conversations;
  if (Array.isArray(data?.data)) return data.data;

  return [];
};

const normalizeMessagePayload = (payload) => {
  const data = extractData(payload);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.messages)) return data.messages;
  if (Array.isArray(data?.data)) return data.data;

  return [];
};

const normalizeConversationId = (conversationIdOrObject) => {
  if (!conversationIdOrObject) return '';

  if (typeof conversationIdOrObject === 'string') return conversationIdOrObject;

  return (
    conversationIdOrObject._id ||
    conversationIdOrObject.id ||
    conversationIdOrObject.conversationId ||
    ''
  );
};

export const messageService = {
  async getConversations(params = {}) {
    const response = await api.get('/messages/conversations', { params });
    return normalizeConversationPayload(response);
  },

  async getMessages(conversationId, params = {}) {
    const id = normalizeConversationId(conversationId);
    if (!id) throw new Error('Conversation id is required');

    const response = await api.get(`/messages/conversations/${id}`, { params });
    return normalizeMessagePayload(response);
  },

  async sendMessage({ conversationId, receiverId, text }) {
    const trimmedText = String(text || '').trim();

    if (!trimmedText) {
      throw new Error('Message text is required');
    }

    const payload = {
      text: trimmedText,
    };

    if (conversationId) payload.conversationId = normalizeConversationId(conversationId);
    if (receiverId) payload.receiverId = receiverId;

    const response = await api.post('/messages', payload);
    return extractData(response);
  },

  async markConversationRead(conversationId) {
    const id = normalizeConversationId(conversationId);
    if (!id) throw new Error('Conversation id is required');

    const response = await api.patch(`/messages/conversations/${id}/read`);
    return extractData(response);
  },
};

export default messageService;