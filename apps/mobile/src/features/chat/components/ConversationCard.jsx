import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const ConversationCard = ({ item, onPress }) => {
  return (
    <Pressable style={styles.card} onPress={() => onPress(item)}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {(item?.title || '?').charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item?.title}
          </Text>
          {!!item?.lastMessageAt && (
            <Text style={styles.time} numberOfLines={1}>
              {new Date(item.lastMessageAt).toLocaleDateString()}
            </Text>
          )}
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.message} numberOfLines={1}>
            {item?.lastMessageText}
          </Text>

          {!!item?.unreadCount && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  time: {
    fontSize: 12,
    color: '#6B7280',
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default ConversationCard;