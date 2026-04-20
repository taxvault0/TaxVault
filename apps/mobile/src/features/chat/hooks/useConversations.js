import { useCallback, useEffect, useState } from 'react';
import messageService from '@/services/messageService';
import { mapConversation } from '../utils/chatMapper';
import { useAuth } from '@/features/auth/context/AuthContext';

export const useConversations = () => {
  const { user } = useAuth();

  const currentUserId = user?._id || user?.id || '';
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadConversations = useCallback(async ({ silent = false } = {}) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const response = await messageService.getConversations();
      const mapped = response.map((item) => mapConversation(item, currentUserId));

      setConversations(mapped);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    loading,
    refreshing,
    error,
    reload: loadConversations,
  };
};

export default useConversations;