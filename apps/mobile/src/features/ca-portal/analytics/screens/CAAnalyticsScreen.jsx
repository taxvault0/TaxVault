import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const MetricCard = ({ icon, title, value, subtitle }) => (
  <View style={styles.metricCard}>
    <View style={styles.metricIconWrap}>
      <Icon name={icon} size={20} color="#2563EB" />
    </View>
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricTitle}>{title}</Text>
    <Text style={styles.metricSubtitle}>{subtitle}</Text>
  </View>
);

const CAAnalyticsScreen = () => {
  const navigation = useNavigation();

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
        </View>

        <Text style={styles.title}>CA Analytics</Text>
        <Text style={styles.subtitle}>
          Quick insights to track client pipeline, work progress, and communication load.
        </Text>

        <View style={styles.metricsGrid}>
          <MetricCard
            icon="account-group-outline"
            title="Retention"
            value="91%"
            subtitle="Returning client ratio"
          />
          <MetricCard
            icon="clock-outline"
            title="Avg Review Time"
            value="2.4d"
            subtitle="Per active file"
          />
          <MetricCard
            icon="message-processing-outline"
            title="Response SLA"
            value="1.8h"
            subtitle="Average first reply"
          />
          <MetricCard
            icon="cash-multiple"
            title="Pipeline"
            value="$12.8k"
            subtitle="Open engagement value"
          />
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>Useful next actions</Text>

          <View style={styles.insightRow}>
            <Icon name="check-circle-outline" size={18} color="#2563EB" />
            <Text style={styles.insightText}>
              Follow up on pending consultation requests older than 24 hours.
            </Text>
          </View>

          <View style={styles.insightRow}>
            <Icon name="check-circle-outline" size={18} color="#2563EB" />
            <Text style={styles.insightText}>
              Prioritize clients with unread messages and upcoming meetings.
            </Text>
          </View>

          <View style={styles.insightRow}>
            <Icon name="check-circle-outline" size={18} color="#2563EB" />
            <Text style={styles.insightText}>
              Move completed review items into the next tax filing step.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CAAnalyticsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  topBar: {
    marginBottom: 10,
  },
  iconButton: {
    width: 42,
    height: 42,
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
  },
  metricsGrid: {
    marginTop: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  metricIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  metricTitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  metricSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  insightCard: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  insightTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 14,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insightText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});


