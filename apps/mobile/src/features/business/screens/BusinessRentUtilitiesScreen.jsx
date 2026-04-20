import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const expenseGroups = [
  'Lease agreements and rent receipts',
  'Utility bills: electricity, gas, water',
  'Internet and phone used for business',
  'Property tax, if business property is owned',
  'Repair and maintenance invoices',
  'Shared office / coworking statements',
];

const BusinessRentUtilitiesScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <View style={styles.heroLeft}>
          <View style={styles.heroIcon}>
            <Icon name="home-city-outline" size={24} color="#0F766E" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Rent & Utilities</Text>
            <Text style={styles.subtitle}>
              Upload occupancy and utility-related expense records used by your business.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>$18,240</Text>
          <Text style={styles.summaryLabel}>Annual Rent</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>$4,120</Text>
          <Text style={styles.summaryLabel}>Utilities</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Accepted documents</Text>
        {expenseGroups.map((item) => (
          <View key={item} style={styles.itemRow}>
            <Icon name="check-circle-outline" size={18} color="#0F766E" />
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.noteCard}>
        <Icon name="information-outline" size={20} color="#0F766E" />
        <Text style={styles.noteText}>
          Keep personal and business utility expenses separate. If an expense is shared, store a clear allocation note.
        </Text>
      </View>

      <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9}>
        <Icon name="upload-outline" size={18} color="#FFFFFF" />
        <Text style={styles.primaryButtonText}>Upload Rent & Utility Documents</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BusinessRentUtilitiesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 28 },
  heroCard: {
    backgroundColor: '#CCFBF1',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
    color: '#334155',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  summaryLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    lineHeight: 21,
    color: '#334155',
    fontWeight: '600',
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ECFEFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#A5F3FC',
  },
  noteText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    lineHeight: 20,
    color: '#155E75',
    fontWeight: '600',
  },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});


