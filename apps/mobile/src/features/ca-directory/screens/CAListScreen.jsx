import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import CACard from '@/features/ca/components/CACard';
import CAFilterBar from '@/features/ca/components/CAFilterBar';
import caService from '@/features/ca/services/caService';

const CAListScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [province, setProvince] = useState('All');
  const [expertise, setExpertise] = useState('All');

  const fetchCAs = useCallback(async (isRefresh = false) => {
    try {
      setError('');

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await caService.getCAList({
        search: search.trim(),
        province: province === 'All' ? '' : province,
        expertise: expertise === 'All' ? '' : expertise,
      });

      setItems(data);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load CAs');
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, province, expertise]);

  useEffect(() => {
    fetchCAs();
  }, [fetchCAs]);

  const headerTitle = useMemo(() => {
    if (items.length === 1) return '1 CA found';
    return `${items.length} CAs found`;
  }, [items.length]);

  const handleClear = () => {
    setSearch('');
    setProvince('All');
    setExpertise('All');
  };

  const renderItem = ({ item }) => (
    <CACard
      ca={item}
      onPress={() => navigation.navigate('CAProfile', { caId: item.id, ca: item })}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Find a CA</Text>
        <Text style={styles.subtitle}>Search accountants by location and expertise</Text>
      </View>

      <CAFilterBar
        search={search}
        onChangeSearch={setSearch}
        province={province}
        onChangeProvince={setProvince}
        expertise={expertise}
        onChangeExpertise={setExpertise}
        onClear={handleClear}
      />

      <View style={styles.resultHeader}>
        <Text style={styles.resultText}>{headerTitle}</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading CA directory...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Unable to load directory</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) => item.id || `ca-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchCAs(true)}
            />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyTitle}>No CAs found</Text>
              <Text style={styles.emptyText}>
                Try changing the province, expertise, or search text.
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
    paddingBottom: 10,
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
  resultHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  listContent: {
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#475569',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    color: '#64748B',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    color: '#64748B',
  },
});

export default CAListScreen;