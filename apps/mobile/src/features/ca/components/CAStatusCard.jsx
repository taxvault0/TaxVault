import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CAStatusCard = ({
  hasAssignedCA,
  assignedCA,
  readiness,
  onFindCA,
  onChat,
  onBook,
}) => {
  if (!hasAssignedCA) {
    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.badge}>
            <Icon name="account-search-outline" size={16} color="#2563EB" />
            <Text style={styles.badgeText}>No CA assigned</Text>
          </View>
        </View>

        <Text style={styles.title}>Find a tax professional</Text>
        <Text style={styles.description}>
          Browse available CAs, compare pricing and specialties, and book a consultation.
        </Text>

        <View style={styles.infoRow}>
          <Icon name="check-circle-outline" size={18} color="#0F766E" />
          <Text style={styles.infoText}>Compare fees, specialties, and availability</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="calendar-clock-outline" size={18} color="#0F766E" />
          <Text style={styles.infoText}>Book consultation directly from the app</Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={onFindCA}>
          <Icon name="magnify" size={18} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Search CAs</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Icon name="account-tie-outline" size={16} color="#2563EB" />
          <Text style={styles.badgeText}>Assigned CA</Text>
        </View>

        <Text style={styles.readinessText}>{readiness?.percentage || 0}% ready</Text>
      </View>

      <Text style={styles.title}>{assignedCA?.name}</Text>
      <Text style={styles.description}>
        {assignedCA?.title} • {assignedCA?.location}
      </Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>Fee from ${assignedCA?.filingFeeFrom}</Text>
        <Text style={styles.metaText}>⭐ {assignedCA?.rating}</Text>
      </View>

      <View style={styles.infoRow}>
        <Icon name="calendar-outline" size={18} color="#0F766E" />
        <Text style={styles.infoText}>Next available: {assignedCA?.nextAvailable}</Text>
      </View>

      <View style={styles.infoRow}>
        <Icon name="file-check-outline" size={18} color="#0F766E" />
        <Text style={styles.infoText}>
          {readiness?.readyForReview
            ? 'You are ready to request filing review'
            : 'You can still chat or book a consultation'}
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.primaryHalf} onPress={onChat}>
          <Icon name="chat-processing-outline" size={18} color="#FFFFFF" />
          <Text style={styles.primaryHalfText}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryHalf} onPress={onBook}>
          <Icon name="calendar-plus" size={18} color="#2563EB" />
          <Text style={styles.secondaryHalfText}>
            {readiness?.readyForReview ? 'Book Filing' : 'Book Visit'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CAStatusCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5EAF2',
    marginBottom: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF4FF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    marginLeft: 6,
    color: '#2563EB',
    fontWeight: '800',
    fontSize: 12,
  },
  readinessText: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '800',
  },
  title: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
  },
  description: {
    marginTop: 6,
    fontSize: 14,
    color: '#64748B',
    lineHeight: 21,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 10,
  },
  metaText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
  },
  primaryButton: {
    marginTop: 18,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    marginLeft: 8,
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  primaryHalf: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryHalfText: {
    marginLeft: 8,
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
  secondaryHalf: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#EEF4FF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryHalfText: {
    marginLeft: 8,
    color: '#2563EB',
    fontWeight: '900',
    fontSize: 14,
  },
});


