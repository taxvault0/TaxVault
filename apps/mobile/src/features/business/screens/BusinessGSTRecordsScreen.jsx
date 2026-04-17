import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const gstRecords = [
  'GST/HST returns filed for each reporting period',
  'Input tax credit support documents',
  'Sales tax collected reports',
  'GST/HST payment confirmations',
  'CRA correspondence related to GST/HST',
  'Purchase invoices showing taxes paid',
];

const BusinessGSTRecordsScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <View style={styles.heroRow}>
          <View style={styles.heroIcon}>
            <Icon name="receipt-text-check-outline" size={24} color="#1D4ED8" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>GST / HST Records</Text>
            <Text style={styles.subtitle}>
              Keep all sales tax filings, remittances, and input tax credit documents in one place.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>4</Text>
          <Text style={styles.statsLabel}>Returns Filed</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>1</Text>
          <Text style={styles.statsLabel}>Pending Period</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Required GST/HST documents</Text>
        {gstRecords.map((item) => (
          <View key={item} style={styles.row}>
            <Icon name="file-chart-outline" size={18} color="#1D4ED8" />
            <Text style={styles.rowText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.warningCard}>
        <Icon name="alert-outline" size={20} color="#92400E" />
        <Text style={styles.warningText}>
          Make sure taxes collected from customers match return totals and remittance records.
        </Text>
      </View>

      <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9}>
        <Icon name="upload-outline" size={18} color="#FFFFFF" />
        <Text style={styles.primaryButtonText}>Upload GST / HST Records</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BusinessGSTRecordsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 28 },
  heroCard: {
    backgroundColor: '#DBEAFE',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  heroRow: {
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
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statsValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  statsLabel: {
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
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  rowText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    lineHeight: 21,
    color: '#334155',
    fontWeight: '600',
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    lineHeight: 19,
    color: '#92400E',
    fontWeight: '600',
  },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#2563EB',
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


