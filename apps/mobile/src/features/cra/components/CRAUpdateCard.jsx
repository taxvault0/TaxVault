import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const CRAUpdateCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.topRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category || 'General'}</Text>
        </View>

        {!!item.isImportant && (
          <View style={styles.importantBadge}>
            <Text style={styles.importantText}>Important</Text>
          </View>
        )}
      </View>

      <Text style={styles.title}>{item.title}</Text>

      {!!item.summary && (
        <Text style={styles.summary} numberOfLines={3}>
          {item.summary}
        </Text>
      )}

      <View style={styles.footerRow}>
        <Text style={styles.dateText}>{formatDate(item.publishedAt)}</Text>
        <Text style={styles.viewText}>Read More</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  importantBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  importantText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  title: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  summary: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: '#475569',
  },
  footerRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  viewText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
  },
});

export default CRAUpdateCard;