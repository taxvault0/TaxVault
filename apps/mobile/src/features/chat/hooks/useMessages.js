import { useCallback, useEffect, useState } from 'react';
import messageService from '@/services/messageService';
import { mapMessage } from '../utils/chatMapper';
import { useAuth } from '@/features/auth/context/AuthContext';

export const useMessages = (conversationId) => {
  const { user } = useAuth();

  const currentUserId = user?._id || user?.id || '';
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const loadMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await messageService.getMessages(conversationId);
      const mapped = response.map((item) => mapMessage(item, currentUserId));

      setMessages(mapped);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [conversationId, currentUserId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const sendMessage = useCallback(
    async ({ text, receiverId }) => {
      try {
        setSending(true);
        setError('');

        const response = await messageService.sendMessage({
          conversationId,
          receiverId,
          text,
        });

        const createdMessage = mapMessage(response?.message || response, currentUserId);

        setMessages((prev) => [...prev, createdMessage]);

        return createdMessage;
      } catch (err) {
        const message =
          err?.response?.data?.message || err?.message || 'Failed to send message';
        setError(message);
        throw new Error(message);
      } finally {
        setSending(false);
      }
    },
    [conversationId, currentUserId]
  );

  return {
    messages,
    loading,
    sending,
    error,
    reload: loadMessages,
    sendMessage,
  };
};

export default useMessages;