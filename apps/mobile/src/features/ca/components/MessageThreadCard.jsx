import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatAccountType, getPriorityStyle } from '@/features/ca/utils/caFormatters';

const MessageThreadCard = ({ thread }) => {
  const priority = getPriorityStyle(thread.priority);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{thread.clientName}</Text>
          <Text style={styles.subtext}>
            {formatAccountType(thread.accountType)} • Tax Year {thread.taxYear}
          </Text>
        </View>

        <View style={styles.rightBox}>
          <Text style={styles.time}>{thread.time}</Text>
          {thread.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{thread.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.message} numberOfLines={2}>
        {thread.lastMessage}
      </Text>

      <View style={styles.footer}>
        <View style={[styles.priorityPill, { backgroundColor: priority.bg }]}>
          <Text style={[styles.priorityText, { color: priority.text }]}>
            {thread.priority?.toUpperCase() || 'NORMAL'}
          </Text>
        </View>

        <Text style={styles.openText}>Open Chat</Text>
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
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  subtext: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  rightBox: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  unreadBadge: {
    marginTop: 8,
    minWidth: 24,
    height: 24,
    borderRadius: 999,
    paddingHorizontal: 8,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
  footer: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '800',
  },
  openText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
});

export default MessageThreadCard;


