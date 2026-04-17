import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { caMeetings } from '@/features/ca/config/caMockData';
import { formatAccountType } from '@/features/ca/utils/caFormatters';

const FILTERS = ['all', 'pending', 'accepted'];

const getStatusStyle = (status) => {
  if (status === 'accepted') {
    return { bg: '#DCFCE7', text: '#166534' };
  }

  if (status === 'pending') {
    return { bg: '#FEF3C7', text: '#B45309' };
  }

  return { bg: '#F3F4F6', text: '#374151' };
};

const CAMeetingsScreen = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredMeetings = useMemo(() => {
    if (activeFilter === 'all') return caMeetings;
    return caMeetings.filter((meeting) => meeting.status === activeFilter);
  }, [activeFilter]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
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
            onPress={() => navigation.navigate('CAPlanner')}
          >
            <Icon name="calendar-month-outline" size={22} color="#111827" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Meetings</Text>
        <Text style={styles.subtitle}>
          Review consultation requests, accepted meetings, and upcoming calls.
        </Text>

        <View style={styles.filterRow}>
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                activeOpacity={0.85}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Meeting Overview</Text>
          <Text style={styles.summaryText}>
            {caMeetings.filter((item) => item.status === 'pending').length} pending approvals
          </Text>
          <Text style={styles.summaryText}>
            {caMeetings.filter((item) => item.status === 'accepted').length} accepted meetings
          </Text>
        </View>

        {filteredMeetings.map((meeting) => {
          const statusStyle = getStatusStyle(meeting.status);

          return (
            <View key={meeting.id} style={styles.meetingCard}>
              <View style={styles.meetingHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.clientName}>{meeting.clientName}</Text>
                  <Text style={styles.clientType}>
                    {formatAccountType(meeting.accountType)} • {meeting.type}
                  </Text>
                </View>

                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                  <Text style={[styles.statusText, { color: statusStyle.text }]}>
                    {meeting.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.meetingMetaRow}>
                <View style={styles.metaItem}>
                  <Icon name="calendar" size={16} color="#6B7280" />
                  <Text style={styles.metaText}>{meeting.date}</Text>
                </View>

                <View style={styles.metaItem}>
                  <Icon name="clock-outline" size={16} color="#6B7280" />
                  <Text style={styles.metaText}>{meeting.time}</Text>
                </View>
              </View>

              <View style={styles.meetingMetaRow}>
                <View style={styles.metaItem}>
                  <Icon name="video-outline" size={16} color="#6B7280" />
                  <Text style={styles.metaText}>{meeting.mode}</Text>
                </View>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  activeOpacity={0.88}
                  onPress={() =>
                    navigation.navigate('CAChat', {
                      clientName: meeting.clientName,
                      accountType: meeting.accountType,
                    })
                  }
                >
                  <Text style={styles.secondaryButtonText}>Open Chat</Text>
                </TouchableOpacity>

                {meeting.status === 'pending' ? (
                  <TouchableOpacity style={styles.primaryButton} activeOpacity={0.88}>
                    <Text style={styles.primaryButtonText}>Accept</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.primaryButton} activeOpacity={0.88}>
                    <Text style={styles.primaryButtonText}>View</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CAMeetingsScreen;

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
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 21,
  },
  filterRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  filterChip: {
    marginRight: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#2563EB',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  summaryCard: {
    marginTop: 16,
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 18,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#CBD5E1',
    marginBottom: 4,
  },
  meetingCard: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  meetingHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  clientName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  clientType: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  meetingMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
  },
  metaText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 18,
  },
  secondaryButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 13,
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
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});


