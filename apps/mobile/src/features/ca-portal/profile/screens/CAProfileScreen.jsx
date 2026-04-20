import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/features/auth/context/AuthContext';

const profile = {
  name: 'Gaurav Bhardwaj, CA',
  email: 'ca@demo.com',
  phone: '+1 (587) 555-1188',
  firmName: 'TaxVault Advisory',
  caNumber: 'CA-2026-001',
  specialization: 'Personal Tax, Self-Employed, Small Business',
  yearsOfExperience: '8 years',
  city: 'Fort McMurray',
  province: 'AB',
};

const ProfileRow = ({ icon, label, value, onPress, danger }) => {
  const content = (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={[styles.rowIconWrap, danger && styles.rowIconWrapDanger]}>
          <Icon name={icon} size={18} color={danger ? '#B91C1C' : '#2563EB'} />
        </View>
        <View>
          <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>{label}</Text>
          {!!value && <Text style={styles.rowValue}>{value}</Text>}
        </View>
      </View>

      <Icon name="chevron-right" size={20} color={danger ? '#B91C1C' : '#94A3B8'} />
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={styles.rowCard} activeOpacity={0.85} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.rowCard}>{content}</View>;
};

const CAProfileScreen = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout from the CA account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.avatarWrap}>
            <Icon name="account-tie-outline" size={46} color="#2563EB" />
          </View>

          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.subtitle}>{profile.firmName}</Text>

          <View style={styles.badgesRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Verified CA</Text>
            </View>
            <View style={[styles.badge, styles.badgeSecondary]}>
              <Text style={[styles.badgeText, styles.badgeSecondaryText]}>Active Practice</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Professional Details</Text>

        <ProfileRow icon="email-outline" label="Email" value={profile.email} />
        <ProfileRow icon="phone-outline" label="Phone" value={profile.phone} />
        <ProfileRow icon="office-building-outline" label="Firm Name" value={profile.firmName} />
        <ProfileRow icon="card-account-details-outline" label="CA Number" value={profile.caNumber} />
        <ProfileRow icon="briefcase-outline" label="Specialization" value={profile.specialization} />
        <ProfileRow icon="timeline-outline" label="Experience" value={profile.yearsOfExperience} />
        <ProfileRow icon="map-marker-outline" label="Location" value={`${profile.city}, ${profile.province}`} />

        <Text style={styles.sectionTitle}>Account</Text>

        <ProfileRow
          icon="chart-box-outline"
          label="Analytics"
          value="Open practice insights"
          onPress={() => navigation.navigate('CAAnalytics')}
        />

        <ProfileRow
          icon="cog-outline"
          label="Settings"
          value="Profile and app settings"
          onPress={() => navigation.navigate('Settings')}
        />

        <ProfileRow
          icon="logout"
          label="Logout"
          value="Sign out from CA workspace"
          onPress={handleLogout}
          danger
        />
      </ScrollView>
    </View>
  );
};

export default CAProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 18,
  },
  avatarWrap: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 14,
  },
  badge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginHorizontal: 4,
    marginBottom: 8,
  },
  badgeSecondary: {
    backgroundColor: '#EEF2FF',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#166534',
  },
  badgeSecondaryText: {
    color: '#4338CA',
  },
  sectionTitle: {
    marginTop: 6,
    marginBottom: 10,
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  rowCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  rowIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowIconWrapDanger: {
    backgroundColor: '#FEE2E2',
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  rowLabelDanger: {
    color: '#B91C1C',
  },
  rowValue: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
});


