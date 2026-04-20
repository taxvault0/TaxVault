import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  formatAccountType,
  formatWorkflowStatus,
  getProvinceLabel,
  getStatusStyle,
  maskClientId,
} from '@/features/ca/utils/caFormatters';

const ClientCard = ({ client, onPress }) => {
  const statusStyle = getStatusStyle(client.status);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.left}>
          <Text style={styles.name}>{client.name}</Text>
          <Text style={styles.meta}>
            {client.city}, {getProvinceLabel(client.province)}
          </Text>
          <Text style={styles.meta}>Client ID: {maskClientId(client.clientCode)}</Text>
        </View>

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
      </View>

      <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
        <Text style={[styles.statusText, { color: statusStyle.text }]}>
          {formatWorkflowStatus(client.status)}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Summary</Text>
        <Text style={styles.summaryText}>
          Primary: {client.incomeProfile.primary.join(', ') || 'Not added'}
        </Text>
        {client.accountType === 'household' && (
          <Text style={styles.summaryText}>
            Spouse: {client.incomeProfile.spouse.join(', ') || 'Not added'}
          </Text>
        )}
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Icon name="calendar-clock-outline" size={16} color="#6B7280" />
          <Text style={styles.metaItemText}>{client.nextMeeting}</Text>
        </View>

        <View style={styles.metaItem}>
          <Icon name="file-document-outline" size={16} color="#6B7280" />
          <Text style={styles.metaItemText}>{client.missingDocs} missing docs</Text>
        </View>
      </View>

      <View style={styles.progressWrap}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Checklist Progress</Text>
          <Text style={styles.progressValue}>{client.checklistProgress}%</Text>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${client.checklistProgress}%` }]} />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Tax Year {client.taxYear}</Text>

        <View style={styles.footerRight}>
          <Icon name="message-outline" size={16} color="#2563EB" />
          <Text style={styles.unreadText}>{client.unreadMessages} unread</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  left: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  meta: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  accountBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
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
  statusPill: {
    alignSelf: 'flex-start',
    marginTop: 12,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  section: {
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 3,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItemText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#4B5563',
  },
  progressWrap: {
    marginTop: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  progressValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  progressBar: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#2563EB',
  },
  footer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
  },
});

export default ClientCard;


