import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { caRequests } from '@/features/ca/config/caMockData';
import { formatAccountType } from '@/features/ca/utils/caFormatters';

const getStatusStyle = (status) => {
  switch (status) {
    case 'approved':
    case 'accepted':
      return { bg: '#DCFCE7', text: '#166534' };
    case 'rejected':
      return { bg: '#FEE2E2', text: '#B91C1C' };
    case 'pending':
    default:
      return { bg: '#FEF3C7', text: '#B45309' };
  }
};

const CARequestDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const requestId = route?.params?.requestId;

  const request = useMemo(() => {
    return caRequests.find((item) => item.id === requestId) || caRequests[0];
  }, [requestId]);

  const [status, setStatus] = useState(request?.status || 'pending');
  const statusStyle = getStatusStyle(status);

  const handleApprove = () => {
    setStatus('approved');
    Alert.alert('Request Approved', 'The consultation request has been approved.');
  };

  const handleReject = () => {
    setStatus('rejected');
    Alert.alert('Request Rejected', 'The consultation request has been rejected.');
  };

  const handleOpenChat = () => {
    navigation.navigate('CAChat', {
      clientId: request.clientId || request.id,
      clientName: request.clientName,
      accountType: request.accountType,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()} activeOpacity={0.85}>
            <Icon name="arrow-left" size={22} color="#111827" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={handleOpenChat} activeOpacity={0.85}>
            <Icon name="message-text-outline" size={22} color="#111827" />
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.avatarWrap}>
              <Icon name="account-circle-outline" size={34} color="#2563EB" />
            </View>

            <View style={styles.heroTextWrap}>
              <Text style={styles.clientName}>{request.clientName}</Text>
              <Text style={styles.clientMeta}>
                {formatAccountType(request.accountType)} • Tax Year {request.taxYear || 2025}
              </Text>
            </View>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {String(status).toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Request Summary</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Request Type</Text>
            <Text style={styles.value}>{request.type || 'Consultation'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Preferred Date</Text>
            <Text style={styles.value}>{request.date || 'Not provided'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Preferred Time</Text>
            <Text style={styles.value}>{request.time || 'Not provided'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Meeting Mode</Text>
            <Text style={styles.value}>{request.mode || 'Video call'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Province</Text>
            <Text style={styles.value}>{request.province || 'AB'}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Income Profile</Text>

          <View style={styles.infoBlock}>
            <Text style={styles.blockLabel}>Primary Income</Text>
            <Text style={styles.blockValue}>
              {request.incomeProfile?.primary?.length
                ? request.incomeProfile.primary.join(', ')
                : 'Not added'}
            </Text>
          </View>

          {request.accountType === 'household' && (
            <View style={styles.infoBlock}>
              <Text style={styles.blockLabel}>Spouse Income</Text>
              <Text style={styles.blockValue}>
                {request.incomeProfile?.spouse?.length
                  ? request.incomeProfile.spouse.join(', ')
                  : 'Not added'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Client Notes</Text>
          <Text style={styles.notesText}>
            {request.notes ||
              'Client would like help reviewing uploaded documents, missing deductions, and year-end filing preparation.'}
          </Text>
        </View>

        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.secondaryCard} activeOpacity={0.88} onPress={handleOpenChat}>
            <Icon name="message-reply-text-outline" size={20} color="#2563EB" />
            <Text style={styles.secondaryCardTitle}>Open Chat</Text>
            <Text style={styles.secondaryCardText}>Ask for missing details before approval.</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryCard}
            activeOpacity={0.88}
            onPress={() =>
              navigation.navigate('ClientDetail', {
                clientId: request.clientId || 'client-001',
              })
            }
          >
            <Icon name="account-details-outline" size={20} color="#2563EB" />
            <Text style={styles.secondaryCardTitle}>Client Profile</Text>
            <Text style={styles.secondaryCardText}>View profile summary and workflow.</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.rejectButton} activeOpacity={0.88} onPress={handleReject}>
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.approveButton} activeOpacity={0.88} onPress={handleApprove}>
            <Text style={styles.approveButtonText}>Approve</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CARequestDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
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
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  heroTextWrap: {
    flex: 1,
  },
  clientName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  clientMeta: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: 16,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  sectionCard: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '700',
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    fontWeight: '700',
    textAlign: 'right',
  },
  infoBlock: {
    marginBottom: 14,
  },
  blockLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '700',
    marginBottom: 6,
  },
  blockValue: {
    fontSize: 14,
    lineHeight: 20,
    color: '#111827',
    fontWeight: '700',
  },
  notesText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#374151',
  },
  actionGrid: {
    marginTop: 16,
  },
  secondaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  secondaryCardTitle: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  secondaryCardText: {
    marginTop: 6,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 19,
  },
  footerRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 8,
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#B91C1C',
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 8,
  },
  approveButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});


