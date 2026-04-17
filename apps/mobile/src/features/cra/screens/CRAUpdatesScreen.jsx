import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import CRAUpdateCard from '@/features/cra/components/CRAUpdateCard';
import craService from '@/features/cra/services/craService';

const CRAUpdatesScreen = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadUpdates = useCallback(async (isRefresh = false) => {
    try {
      setError('');

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await craService.getCRAUpdates();
      setUpdates(data);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load CRA updates');
      setUpdates([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadUpdates();
  }, [loadUpdates]);

  const handleOpen = (item) => {
    Alert.alert(
      item.title || 'CRA Update',
      item.content || item.summary || 'No details available yet.'
    );
  };

  const renderItem = ({ item }) => (
    <CRAUpdateCard item={item} onPress={() => handleOpen(item)} />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>CRA Updates</Text>
        <Text style={styles.subtitle}>
          Latest reminders, notices, and filing updates for users
        </Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text style={styles.helperText}>Loading CRA updates...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Unable to load updates</Text>
          <Text style={styles.helperText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={updates}
          keyExtractor={(item, index) => item.id || `cra-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => loadUpdates(true)} />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.errorTitle}>No updates available</Text>
              <Text style={styles.helperText}>
                CRA updates will appear here once data is available.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#475569',
  },
  listContent: {
    paddingVertical: 12,
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
});

export default CRAUpdatesScreen;