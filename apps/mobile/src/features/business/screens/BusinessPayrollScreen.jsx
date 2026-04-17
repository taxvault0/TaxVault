import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const payrollItems = [
  'Payroll register / payroll summary reports',
  'T4 slips and T4 summary',
  'Employee salaries and wage records',
  'CPP, EI, and income tax remittance records',
  'Bonus, commission, and contractor payment records',
  'ROE or termination-related payroll records',
];

const BusinessPayrollScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <View style={styles.iconBadge}>
          <Icon name="account-cash-outline" size={22} color="#7C3AED" />
        </View>
        <Text style={styles.title}>Payroll</Text>
        <Text style={styles.subtitle}>
          Track salary, wages, remittances, and employee-related tax documents for your business.
        </Text>

        <View style={styles.statStrip}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Employees</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>Missing Files</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>2025</Text>
            <Text style={styles.statLabel}>Tax Year</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Payroll documents required</Text>
        {payrollItems.map((item) => (
          <View key={item} style={styles.itemRow}>
            <Icon name="checkbox-marked-circle-outline" size={18} color="#7C3AED" />
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Important checks</Text>
        {[
          'Ensure payroll totals match bank withdrawals',
          'Confirm remittance payments were made on time',
          'Separate employee payroll from contractor invoices',
          'Upload year-end slips before tax filing review',
        ].map((item) => (
          <View key={item} style={styles.itemRow}>
            <Icon name="shield-check-outline" size={18} color="#16A34A" />
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9}>
        <Icon name="upload-outline" size={18} color="#FFFFFF" />
        <Text style={styles.primaryButtonText}>Upload Payroll Records</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BusinessPayrollScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 28 },
  heroCard: {
    backgroundColor: '#F3E8FF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    color: '#334155',
  },
  statStrip: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    marginTop: 4,
    fontSize: 11,
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
  primaryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#7C3AED',
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


