import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatAccountType, getProvinceLabel } from '@/features/ca/utils/caFormatters';

const LeadRequestCard = ({ request }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{request.name}</Text>
          <Text style={styles.type}>{request.consultationType}</Text>
          <Text style={styles.location}>{getProvinceLabel(request.province)}</Text>
        </View>

        <View
          style={[
            styles.accountBadge,
            request.accountType === 'household' ? styles.householdBadge : styles.singleBadge,
          ]}
        >
          <Text
            style={[
              styles.accountText,
              request.accountType === 'household' ? styles.householdText : styles.singleText,
            ]}
          >
            {formatAccountType(request.accountType)}
          </Text>
        </View>
      </View>

      <Text style={styles.note}>{request.note}</Text>

      <View style={styles.tagRow}>
        {request.incomeTags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>Preferred: {request.preferredTime}</Text>
        <Text style={styles.metaText}>Docs: {request.docsUploaded}</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.rejectButton} activeOpacity={0.85}>
          <Text style={styles.rejectText}>Reject</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.acceptButton} activeOpacity={0.85}>
          <Text style={styles.acceptText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  name: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  type: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  location: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  accountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
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
  note: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  metaRow: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  rejectButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  acceptButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 14,
    paddingVertical: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default LeadRequestCard;


