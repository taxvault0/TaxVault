import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { caRequests } from '@/features/ca/config/caMockData';
import { formatAccountType } from '@/features/ca/utils/caFormatters';

const FILTERS = ['all', 'pending', 'approved', 'rejected'];

const getStatusStyle = (status) => {
  switch (status) {
    case 'approved':
      return { bg: '#DCFCE7', text: '#166534' };
    case 'rejected':
      return { bg: '#FEE2E2', text: '#B91C1C' };
    case 'pending':
    default:
      return { bg: '#FEF3C7', text: '#B45309' };
  }
};

const CARequestsScreen = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredRequests = useMemo(() => {
    if (activeFilter === 'all') return caRequests;
    return caRequests.filter((item) => item.status === activeFilter);
  }, [activeFilter]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.headerTextWrap}>
            <Text style={styles.title}>Client Requests</Text>
            <Text style={styles.subtitle}>Review new consultations and take action.</Text>
          </View>

          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('ClientSearch')}
          >
            <Icon name="magnify" size={22} color="#111827" />
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                activeOpacity={0.85}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => {
            const statusStyle = getStatusStyle(request.status);

            return (
              <TouchableOpacity
                key={request.id}
                style={styles.requestCard}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('CARequestDetails', { requestId: request.id })}
              >
                <View style={styles.cardTopRow}>
                  <View style={styles.clientInfo}>
                    <Text style={styles.clientName}>{request.clientName}</Text>
                    <Text style={styles.clientMeta}>
                      {formatAccountType(request.accountType)} • {request.type || 'Consultation'}
                    </Text>
                  </View>

                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>
                      {request.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Icon name="calendar" size={16} color="#6B7280" />
                    <Text style={styles.metaText}>{request.date || 'Date pending'}</Text>
                  </View>

                  <View style={styles.metaItem}>
                    <Icon name="clock-outline" size={16} color="#6B7280" />
                    <Text style={styles.metaText}>{request.time || 'Time pending'}</Text>
                  </View>
                </View>

                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Icon name="video-outline" size={16} color="#6B7280" />
                    <Text style={styles.metaText}>{request.mode || 'Video Call'}</Text>
                  </View>
                </View>

                <Text style={styles.notePreview} numberOfLines={2}>
                  {request.notes ||
                    'Client is requesting document review, missing deduction guidance, and filing support.'}
                </Text>

                <View style={styles.footerRow}>
                  <Text style={styles.footerText}>Tap to review request details</Text>
                  <Icon name="chevron-right" size={18} color="#6B7280" />
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyBox}>
            <Icon name="clipboard-text-search-outline" size={38} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No requests found</Text>
            <Text style={styles.emptyText}>Try another filter to view consultation requests.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default CARequestsScreen;

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
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  filterChip: {
    marginRight: 10,
    marginBottom: 10,
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
  requestCard: {
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  clientInfo: {
    flex: 1,
    paddingRight: 10,
  },
  clientName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  clientMeta: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
    marginBottom: 6,
  },
  metaText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '600',
  },
  notePreview: {
    marginTop: 14,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
  footerRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '700',
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


