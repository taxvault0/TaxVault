import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import documentRequestService from '@/services/documentRequestService';
import DocumentRequestCard from '../components/DocumentRequestCard';
import styles from '../styles/CADocumentRequests.styles';

const CADocumentRequestsScreen = ({ route }) => {
  const caseId = route?.params?.caseId;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await documentRequestService.getRequests(caseId);
      setRequests(res?.requests || res?.data || res || []);
    } catch (e) {
      Alert.alert(
        'Error',
        e?.response?.data?.message || 'Failed to load document requests'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [caseId]);

  const createRequest = async () => {
    try {
      setCreating(true);

      await documentRequestService.createRequest(caseId, {
        type: 't4',
        note: 'Please upload your T4 slip',
      });

      await loadRequests();
    } catch (e) {
      Alert.alert(
        'Error',
        e?.response?.data?.message || 'Failed to create request'
      );
    } finally {
      setCreating(false);
    }
  };

  const handleMarkVerified = async (requestId) => {
    try {
      await documentRequestService.updateStatus(requestId, 'verified');
      await loadRequests();
    } catch (e) {
      Alert.alert(
        'Error',
        e?.response?.data?.message || 'Failed to mark document as verified'
      );
    }
  };

  const handleMarkRejected = async (requestId) => {
    try {
      await documentRequestService.updateStatus(requestId, 'rejected');
      await loadRequests();
    } catch (e) {
      Alert.alert(
        'Error',
        e?.response?.data?.message || 'Failed to reject document'
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={createRequest}
        disabled={creating}
      >
        {creating ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.addButtonText}>+ Request Document</Text>
        )}
      </TouchableOpacity>

      <FlatList
        data={requests}
        keyExtractor={(item) => item?._id || item?.id || String(Math.random())}
        renderItem={({ item }) => (
          <DocumentRequestCard
            item={item}
            onMarkVerified={handleMarkVerified}
            onMarkRejected={handleMarkRejected}
          />
        )}
        contentContainerStyle={requests.length === 0 ? styles.emptyWrap : undefined}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No document requests yet.</Text>
        }
      />
    </SafeAreaView>
  );
};

export default CADocumentRequestsScreen;