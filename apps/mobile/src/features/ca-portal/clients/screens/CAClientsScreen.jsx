import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ClientCard from '@/features/ca/components/ClientCard';
import { caClients } from '@/features/ca/config/caMockData';

const FILTERS = ['all', 'single', 'household'];

const CAClientsScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredClients = useMemo(() => {
    const text = search.trim().toLowerCase();

    return caClients.filter((client) => {
      const matchesSearch =
        !text ||
        (client.name || '').toLowerCase().includes(text) ||
        (client.city || '').toLowerCase().includes(text) ||
        (client.clientCode || '').toLowerCase().includes(text);

      const matchesFilter = activeFilter === 'all' ? true : client.accountType === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.headerTextWrap}>
            <Text style={styles.title}>Clients</Text>
            <Text style={styles.subtitle}>
              Track all single and household clients, workflow status, and document readiness.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('ClientSearch')}
          >
            <Icon name="magnify" size={22} color="#111827" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchWrap}>
          <Icon name="magnify" size={20} color="#6B7280" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by client, city, or code..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
          {!!search && (
            <TouchableOpacity onPress={() => setSearch('')} activeOpacity={0.85}>
              <Icon name="close-circle-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterRow}>
          {FILTERS.map((filter) => {
            const selected = activeFilter === filter;

            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, selected && styles.filterChipActive]}
                onPress={() => setActiveFilter(filter)}
                activeOpacity={0.85}
              >
                <Text style={[styles.filterText, selected && styles.filterTextActive]}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.resultRow}>
          <Text style={styles.resultTitle}>Client Directory</Text>
          <Text style={styles.resultCount}>{filteredClients.length} found</Text>
        </View>

        <View style={styles.listWrap}>
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onPress={() => navigation.navigate('ClientDetail', { clientId: client.id })}
            />
          ))}

          {filteredClients.length === 0 && (
            <View style={styles.emptyBox}>
              <Icon name="account-search-outline" size={38} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No clients found</Text>
              <Text style={styles.emptyText}>Try another search or filter.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default CAClientsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 21,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: {
    marginTop: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#111827',
    paddingVertical: 2,
  },
  filterRow: {
    flexDirection: 'row',
    marginTop: 14,
    marginBottom: 6,
  },
  filterChip: {
    marginRight: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#2563EB',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  resultRow: {
    marginTop: 14,
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  resultCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  listWrap: {
    marginTop: 8,
  },
  emptyBox: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  emptyText: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});


