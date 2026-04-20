import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const iconMap = {
  review: 'file-eye-outline',
  meeting: 'calendar-clock',
  follow_up: 'account-arrow-right-outline',
  filing: 'check-decagram-outline',
  approval: 'clipboard-check-outline',
};

const colorMap = {
  review: '#2563EB',
  meeting: '#7C3AED',
  follow_up: '#D97706',
  filing: '#059669',
  approval: '#DC2626',
};

const PlannerTaskCard = ({ task }) => {
  const icon = iconMap[task.type] || 'clipboard-text-outline';
  const color = colorMap[task.type] || '#2563EB';

  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: `${color}20` }]}>
        <Icon name={icon} size={20} color={color} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.subtitle}>{task.subtitle}</Text>
      </View>

      <View style={styles.right}>
        <Text style={styles.time}>{task.time}</Text>
        <Text style={styles.status}>{task.status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  right: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  time: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  status: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
});

export default PlannerTaskCard;


