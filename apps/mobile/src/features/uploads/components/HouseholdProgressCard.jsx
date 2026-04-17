import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const HouseholdProgressCard = ({ counts, profile }) => {
  const total = counts?.total || 0;
  const complete = counts?.complete || 0;
  const partial = counts?.partial || 0;
  const missing = counts?.missing || 0;

  const userTags = [];
  if (profile?.user?.employment) userTags.push('Employment');
  if (profile?.user?.gigWork) userTags.push('Gig');
  if (profile?.user?.business) userTags.push('Business');

  const spouseTags = [];
  if (profile?.spouse?.employment) spouseTags.push('Employment');
  if (profile?.spouse?.gigWork) spouseTags.push('Gig');
  if (profile?.spouse?.business) spouseTags.push('Business');

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Household Upload Progress</Text>
      <Text style={styles.subtitle}>
        {complete} of {total} sections complete
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{complete}</Text>
          <Text style={styles.statLabel}>Complete</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{partial}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{missing}</Text>
          <Text style={styles.statLabel}>Missing</Text>
        </View>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.infoLabel}>You</Text>
        <Text style={styles.infoValue}>
          {userTags.length ? userTags.join(' • ') : 'No active income scenario'}
        </Text>
      </View>

      {!!profile?.spouse && (
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>Spouse</Text>
          <Text style={styles.infoValue}>
            {spouseTags.length ? spouseTags.join(' • ') : 'No active income scenario'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E9ECF2',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  infoBlock: {
    marginTop: 14,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
});

export default HouseholdProgressCard;


