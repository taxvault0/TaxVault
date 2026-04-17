import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const STATUS_STYLES = {
  complete: {
    bg: '#E8F7EE',
    text: '#167C3B',
    label: 'Complete',
  },
  partial: {
    bg: '#FFF4E5',
    text: '#B66A00',
    label: 'In Progress',
  },
  missing: {
    bg: '#FDECEC',
    text: '#C62828',
    label: 'Missing',
  },
  not_applicable: {
    bg: '#F1F3F5',
    text: '#6B7280',
    label: 'N/A',
  },
  optional: {
    bg: '#EEF2FF',
    text: '#4F46E5',
    label: 'Optional',
  },
};

const UploadStatusPill = ({ status = 'missing' }) => {
  const current = STATUS_STYLES[status] || STATUS_STYLES.missing;

  return (
    <View style={[styles.pill, { backgroundColor: current.bg }]}>
      <Text style={[styles.text, { color: current.text }]}>{current.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});

export default UploadStatusPill;


