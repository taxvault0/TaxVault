import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const InfoPill = ({ label }) => {
  if (!label) return null;

  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
};

const CACard = ({ ca, onPress }) => {
  const fullName =
    ca?.fullName || [ca?.firstName, ca?.lastName].filter(Boolean).join(' ').trim();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(fullName || 'CA').slice(0, 2).toUpperCase()}
          </Text>
        </View>

        <View style={styles.headerText}>
          <Text style={styles.name}>{fullName || 'Chartered Accountant'}</Text>
          {!!ca?.designation && (
            <Text style={styles.subText}>{ca.designation}</Text>
          )}
          {!!ca?.firmName && <Text style={styles.subText}>{ca.firmName}</Text>}
        </View>
      </View>

      <View style={styles.metaRow}>
        {!!ca?.city && !!ca?.province && (
          <Text style={styles.metaText}>
            {ca.city}, {ca.province}
          </Text>
        )}
        {!ca?.city && !!ca?.province && (
          <Text style={styles.metaText}>{ca.province}</Text>
        )}

        {typeof ca?.yearsOfExperience === 'number' && ca.yearsOfExperience > 0 && (
          <Text style={styles.metaText}>
            {ca.yearsOfExperience} years exp.
          </Text>
        )}
      </View>

      <View style={styles.pillRow}>
        {(ca?.areasOfExpertise || []).slice(0, 3).map((item) => (
          <InfoPill key={item} label={item} />
        ))}
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.acceptingText}>
          {ca?.acceptingNewClients ? 'Accepting new clients' : 'Not accepting new clients'}
        </Text>
        <Text style={styles.viewText}>View Profile</Text>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  subText: {
    marginTop: 2,
    fontSize: 13,
    color: '#475569',
  },
  metaRow: {
    marginTop: 12,
  },
  metaText: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 4,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  pill: {
    backgroundColor: '#EFF6FF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginRight: 8,
    marginBottom: 8,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  footerRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  acceptingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  viewText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
  },
});

export default CACard;