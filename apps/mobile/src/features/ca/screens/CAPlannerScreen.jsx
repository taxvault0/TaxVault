import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

import { caPlannerTasks, caMeetings } from '@/features/ca/config/caMockData';

const DAYS = [
  { key: 'mon', label: 'Mon', date: '24' },
  { key: 'tue', label: 'Tue', date: '25' },
  { key: 'wed', label: 'Wed', date: '26' },
  { key: 'thu', label: 'Thu', date: '27' },
  { key: 'fri', label: 'Fri', date: '28' },
  { key: 'sat', label: 'Sat', date: '29' },
  { key: 'sun', label: 'Sun', date: '30' },
];

const PlannerCard = ({ title, subtitle, time, icon, status }) => {
  const badgeColor =
    status === 'pending'
      ? { bg: '#FEF3C7', text: '#B45309' }
      : status === 'accepted'
      ? { bg: '#DCFCE7', text: '#166534' }
      : { bg: '#DBEAFE', text: '#1D4ED8' };

  return (
    <View style={styles.plannerCard}>
      <View style={styles.plannerTimeWrap}>
        <Text style={styles.plannerTime}>{time}</Text>
      </View>

      <View style={styles.plannerBody}>
        <View style={styles.plannerIconWrap}>
          <Icon name={icon} size={18} color="#2563EB" />
        </View>

        <View style={styles.plannerTextWrap}>
          <Text style={styles.plannerTitle}>{title}</Text>
          <Text style={styles.plannerSubtitle}>{subtitle}</Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: badgeColor.bg }]}>
          <Text style={[styles.statusText, { color: badgeColor.text }]}>
            {String(status || 'today').toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const CAPlannerScreen = () => {
  const navigation = useNavigation();
  const [selectedDay, setSelectedDay] = useState('tue');

  const plannerItems = useMemo(() => {
    const meetings = (caMeetings || []).slice(0, 3).map((meeting, index) => ({
      id: `meeting-${meeting.id || index}`,
      title: meeting.clientName || 'Client Meeting',
      subtitle: `${meeting.mode || 'Video Call'} • ${meeting.topic || 'Tax consultation'}`,
      time: meeting.time || '10:00 AM',
      icon: 'video-outline',
      status: meeting.status || 'accepted',
    }));

    const tasks = (caPlannerTasks || []).slice(0, 3).map((task, index) => ({
      id: `task-${task.id || index}`,
      title: task.title || 'Planner Task',
      subtitle: task.description || task.clientName || 'Follow-up and review',
      time: task.time || '02:00 PM',
      icon: 'clipboard-check-outline',
      status: task.priority || 'today',
    }));

    return [...meetings, ...tasks];
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.title}>Planner</Text>
            <Text style={styles.subtitle}>Meetings, tasks, and calendar view for your CA workflow.</Text>
          </View>

          <TouchableOpacity
            style={styles.topButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('CAMeetings')}
          >
            <Icon name="calendar-clock-outline" size={22} color="#2563EB" />
          </TouchableOpacity>
        </View>

        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <Text style={styles.calendarMonth}>March 2026</Text>
            <TouchableOpacity style={styles.monthButton} activeOpacity={0.85}>
              <Icon name="chevron-down" size={18} color="#111827" />
            </TouchableOpacity>
          </View>

          <View style={styles.daysRow}>
            {DAYS.map((day) => {
              const selected = selectedDay === day.key;

              return (
                <TouchableOpacity
                  key={day.key}
                  style={[styles.dayChip, selected && styles.dayChipActive]}
                  activeOpacity={0.85}
                  onPress={() => setSelectedDay(day.key)}
                >
                  <Text style={[styles.dayLabel, selected && styles.dayLabelActive]}>
                    {day.label}
                  </Text>
                  <Text style={[styles.dayDate, selected && styles.dayDateActive]}>
                    {day.date}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.summaryRow}>
          <TouchableOpacity
            style={styles.summaryCard}
            activeOpacity={0.88}
            onPress={() => navigation.navigate('CAMeetings')}
          >
            <Icon name="video-outline" size={20} color="#2563EB" />
            <Text style={styles.summaryValue}>{caMeetings?.length || 0}</Text>
            <Text style={styles.summaryLabel}>Meetings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.summaryCard} activeOpacity={0.88}>
            <Icon name="clipboard-text-outline" size={20} color="#2563EB" />
            <Text style={styles.summaryValue}>{caPlannerTasks?.length || 0}</Text>
            <Text style={styles.summaryLabel}>Tasks</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.summaryCard}
            activeOpacity={0.88}
            onPress={() => navigation.navigate('CARequests')}
          >
            <Icon name="bell-outline" size={20} color="#2563EB" />
            <Text style={styles.summaryValue}>3</Text>
            <Text style={styles.summaryLabel}>Alerts</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today’s Schedule</Text>
        </View>

        {plannerItems.map((item) => (
          <PlannerCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            time={item.time}
            icon={item.icon}
            status={item.status}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default CAPlannerScreen;

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
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  topButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
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
    maxWidth: 280,
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarMonth: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  monthButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  dayChip: {
    width: '13.2%',
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },
  dayChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  dayLabelActive: {
    color: '#DBEAFE',
  },
  dayDate: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  dayDateActive: {
    color: '#FFFFFF',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  summaryCard: {
    width: '31.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryValue: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  summaryLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
  },
  sectionHeader: {
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  plannerCard: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  plannerTimeWrap: {
    width: 78,
    paddingTop: 18,
  },
  plannerTime: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
  },
  plannerBody: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  plannerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  plannerTextWrap: {
    flex: 1,
    paddingRight: 10,
  },
  plannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  plannerSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
});


