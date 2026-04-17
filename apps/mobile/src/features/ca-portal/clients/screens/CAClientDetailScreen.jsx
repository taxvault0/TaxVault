import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { caClients } from '@/features/ca/config/caMockData';
import {
  formatAccountType,
  formatWorkflowStatus,
  getProvinceLabel,
  getStatusStyle,
  maskClientId,
} from '@/features/ca/utils/caFormatters';

const CAClientDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const clientId = route?.params?.clientId;

  const client = useMemo(() => {
    return caClients.find((item) => item.id === clientId) || caClients[0];
  }, [clientId]);

  const statusStyle = getStatusStyle(client.status);

  const quickActions = [
    {
      key: 'message',
      title: 'Message',
      icon: 'message-text-outline',
      onPress: () =>
        navigation.navigate('CAChat', {
          clientId: client.id,
          clientName: client.name,
          accountType: client.accountType,
        }),
    },
    {
      key: 'documents',
      title: 'Documents',
      icon: 'file-document-outline',
      onPress: () => navigation.navigate('Documents'),
    },
    {
      key: 'income',
      title: 'Income Docs',
      icon: 'briefcase-outline',
      onPress: () => navigation.navigate('IncomeDocuments'),
    },
    {
      key: 'vehicle',
      title: 'Vehicle',
      icon: 'car-outline',
      onPress: () => navigation.navigate('VehicleExpenses'),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <View style={styles.topRow}>
            <TouchableOpacity
              style={styles.iconButton}
              activeOpacity={0.85}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-left" size={22} color="#111827" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('CAProfile')}
            >
              <Icon name="account-circle-outline" size={22} color="#111827" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{client.name}</Text>
          <Text style={styles.location}>
            {client.city}, {getProvinceLabel(client.province)}
          </Text>
          <Text style={styles.clientCode}>Client ID: {maskClientId(client.clientCode)}</Text>

          <View style={styles.badgeRow}>
            <View
              style={[
                styles.accountBadge,
                client.accountType === 'household' ? styles.householdBadge : styles.singleBadge,
              ]}
            >
              <Text
                style={[
                  styles.accountText,
                  client.accountType === 'household' ? styles.householdText : styles.singleText,
                ]}
              >
                {formatAccountType(client.accountType)}
              </Text>
            </View>

            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.statusText, { color: statusStyle.text }]}>
                {formatWorkflowStatus(client.status)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{client.taxYear}</Text>
            <Text style={styles.statLabel}>Tax Year</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{client.checklistProgress}%</Text>
            <Text style={styles.statLabel}>Checklist</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{client.missingDocs}</Text>
            <Text style={styles.statLabel}>Missing Docs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{client.unreadMessages}</Text>
            <Text style={styles.statLabel}>Unread</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.key}
                style={styles.actionCard}
                activeOpacity={0.88}
                onPress={action.onPress}
              >
                <View style={styles.actionIconWrap}>
                  <Icon name={action.icon} size={20} color="#2563EB" />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Household Summary</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Primary</Text>
            <Text style={styles.detailValue}>{client.members?.primary || 'Not added'}</Text>
          </View>

          {client.accountType === 'household' && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Spouse</Text>
              <Text style={styles.detailValue}>{client.members?.spouse || 'Not added'}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account Type</Text>
            <Text style={styles.detailValue}>{formatAccountType(client.accountType)}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Income Profile</Text>

          <View style={styles.incomeBlock}>
            <Text style={styles.incomeLabel}>Primary Income</Text>
            <Text style={styles.incomeValue}>
              {client.incomeProfile?.primary?.length
                ? client.incomeProfile.primary.join(', ')
                : 'Not added'}
            </Text>
          </View>

          {client.accountType === 'household' && (
            <View style={styles.incomeBlock}>
              <Text style={styles.incomeLabel}>Spouse Income</Text>
              <Text style={styles.incomeValue}>
                {client.incomeProfile?.spouse?.length
                  ? client.incomeProfile.spouse.join(', ')
                  : 'Not added'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Workflow</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Current Status</Text>
            <Text style={styles.detailValue}>{formatWorkflowStatus(client.status)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Next Meeting</Text>
            <Text style={styles.detailValue}>{client.nextMeeting || 'Not scheduled'}</Text>
          </View>

          <View style={styles.progressBlock}>
            <View style={styles.progressHeader}>
              <Text style={styles.detailLabel}>Checklist Progress</Text>
              <Text style={styles.progressValue}>{client.checklistProgress}%</Text>
            </View>

            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${client.checklistProgress}%` }]}
              />
            </View>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.88}
            onPress={() => navigation.navigate('CAMeetings')}
          >
            <Text style={styles.secondaryButtonText}>View Meetings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.88}
            onPress={() =>
              navigation.navigate('CAChat', {
                clientId: client.id,
                clientName: client.name,
                accountType: client.accountType,
              })
            }
          >
            <Text style={styles.primaryButtonText}>Open Chat</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CAClientDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  location: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
  },
  clientCode: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
  },
  accountBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 10,
    marginBottom: 8,
  },
  householdBadge: {
    backgroundColor: '#EEF2FF',
  },
  singleBadge: {
    backgroundColor: '#ECFDF5',
  },
  accountText: {
    fontSize: 12,
    fontWeight: '700',
  },
  householdText: {
    color: '#4338CA',
  },
  singleText: {
    color: '#047857',
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  statCard: {
    width: '23.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  statLabel: {
    marginTop: 4,
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '700',
    textAlign: 'center',
  },
  section: {
    marginTop: 18,
  },
  sectionCard: {
    marginTop: 18,
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
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '700',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  incomeBlock: {
    marginBottom: 14,
  },
  incomeLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '700',
    marginBottom: 6,
  },
  incomeValue: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
    fontWeight: '700',
  },
  progressBlock: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '800',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 999,
  },
  bottomRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  secondaryButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  primaryButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});


