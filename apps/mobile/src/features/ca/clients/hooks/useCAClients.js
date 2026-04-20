import { useCallback, useEffect, useState } from 'react';
import caClientService from '@/services/caClientService';
import { mapCAClient } from '../utils/caClientMapper';

export const useCAClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadClients = useCallback(async ({ silent = false } = {}) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const response = await caClientService.getClients();
      setClients(response.map(mapCAClient));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load clients');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  return {
    clients,
    loading,
    refreshing,
    error,
    reload: loadClients,
  };
};

export default useCAClients;