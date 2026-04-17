import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CAHeroCard = ({ name = 'Gaurav', stats }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>CA Workspace</Text>
      <Text style={styles.title}>Good morning, {name}</Text>
      <Text style={styles.subtitle}>
        Manage clients, approve consultations, review tax files, and stay on top of your Canadian tax workflow.
      </Text>

      <View style={styles.quickRow}>
        <View style={styles.quickPill}>
          <Text style={styles.quickValue}>{stats.todayMeetings}</Text>
          <Text style={styles.quickLabel}>Meetings Today</Text>
        </View>

        <View style={styles.quickPill}>
          <Text style={styles.quickValue}>{stats.households}</Text>
          <Text style={styles.quickLabel}>Households</Text>
        </View>

        <View style={styles.quickPill}>
          <Text style={styles.quickValue}>{stats.singles}</Text>
          <Text style={styles.quickLabel}>Single Clients</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: '#93C5FD',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    marginTop: 8,
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: '#CBD5E1',
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  quickPill: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  quickValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  quickLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '600',
  },
});

export default CAHeroCard;


