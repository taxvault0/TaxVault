import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getStatusLabel } from '../utils/consultationHelpers';

export default function ConsultationStatusBadge({ status }) {
  const statusStyle =
    {
      requested: styles.requested,
      confirmed: styles.confirmed,
      rescheduled: styles.rescheduled,
      completed: styles.completed,
      cancelled: styles.cancelled,
      'no-show': styles.noShow,
    }[status] || styles.defaultBadge;

  return (
    <View style={[styles.badge, statusStyle]}>
      <Text style={styles.text}>{getStatusLabel(status)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 6,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  requested: { backgroundColor: '#f59e0b' },
  confirmed: { backgroundColor: '#2563eb' },
  rescheduled: { backgroundColor: '#7c3aed' },
  completed: { backgroundColor: '#16a34a' },
  cancelled: { backgroundColor: '#dc2626' },
  noShow: { backgroundColor: '#6b7280' },
  defaultBadge: { backgroundColor: '#374151' },
});