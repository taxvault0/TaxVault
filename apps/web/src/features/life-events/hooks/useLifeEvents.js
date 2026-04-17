import { useState, useCallback } from 'react';
import { lifeEventsService } from '../services/lifeEventsService';
import { useAuth } from '../../auth/context/AuthContext';

export const useLifeEvents = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateMaritalStatus = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await lifeEventsService.updateMaritalStatus(data);
      
      // Notify CA if connected
      if (data.notifyCA && user?.connectedCA) {
        await lifeEventsService.notifyCA({
          caId: user.connectedCA,
          eventType: 'MARITAL_STATUS_CHANGE',
          details: {
            newStatus: data.status,
            effectiveDate: data.effectiveDate,
            spouseName: data.spouseName
          }
        });
      }
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update marital status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const unlinkSpouse = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await lifeEventsService.unlinkSpouse(data);
      if (data.notifyCA && user?.connectedCA) {
        await lifeEventsService.notifyCA({
          caId: user.connectedCA,
          eventType: 'SEPARATION',
          details: { effectiveDate: data.effectiveDate }
        });
      }
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unlink spouse data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addDependent = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await lifeEventsService.addDependent(data);
      if (data.notifyCA && user?.connectedCA) {
        await lifeEventsService.notifyCA({
          caId: user.connectedCA,
          eventType: 'NEW_DEPENDENT',
          details: { childName: data.name, dob: data.dateOfBirth }
        });
      }
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add dependent');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateAddress = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await lifeEventsService.updateAddress(data);
      if (data.notifyCA && user?.connectedCA) {
        await lifeEventsService.notifyCA({
          caId: user.connectedCA,
          eventType: 'ADDRESS_CHANGE',
          details: { newProvince: data.province, effectiveDate: data.movedInDate }
        });
      }
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update address');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const setLegacyContact = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await lifeEventsService.setLegacyContact(data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set legacy contact');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    updateMaritalStatus,
    unlinkSpouse,
    addDependent,
    updateAddress,
    setLegacyContact
  };
};









