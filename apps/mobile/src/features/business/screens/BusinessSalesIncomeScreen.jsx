import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const salesSummary = {
  totalRevenue: '$186,450',
  invoicesUploaded: 28,
  missingPeriods: 2,
  paymentPlatforms: ['Stripe', 'Square', 'Bank Transfers'],
};

const requiredDocs = [
  'Sales invoices and issued receipts',
  'POS reports and transaction summaries',
  'Bank deposits and sales reconciliations',
  'Marketplace or platform payout statements',
  'Year-end income statement / P&L',
  'Cash sales log, if applicable',
];

const BusinessSalesIncomeScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <View style={styles.heroBadge}>
          <Icon name="cash-multiple" size={16} color="#1D4ED8" />
          <Text style={styles.heroBadgeText}>Revenue Tracking</Text>
        </View>

        <Text style={styles.title}>Business Sales & Income</Text>
        <Text style={styles.subtitle}>
          Upload revenue documents, sales reports, invoices, and payout summaries to support tax filing.
        </Text>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{salesSummary.totalRevenue}</Text>
            <Text style={styles.metricLabel}>Recorded Revenue</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{salesSummary.invoicesUploaded}</Text>
            <Text style={styles.metricLabel}>Invoices Uploaded</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>What to upload</Text>
        {requiredDocs.map((item) => (
          <View key={item} style={styles.listRow}>
            <View style={styles.listIcon}>
              <Icon name="file-document-outline" size={18} color="#2563EB" />
            </View>
            <Text style={styles.listText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Accepted income sources</Text>
        {salesSummary.paymentPlatforms.map((item) => (
          <View key={item} style={styles.sourceRow}>
            <Icon name="check-circle-outline" size={18} color="#16A34A" />
            <Text style={styles.sourceText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.alertCard}>
        <Icon name="alert-circle-outline" size={20} color="#B45309" />
        <View style={styles.alertTextWrap}>
          <Text style={styles.alertTitle}>Missing reporting periods</Text>
          <Text style={styles.alertBody}>
            You still need sales records for {salesSummary.missingPeriods} month(s). Upload monthly statements or reconciliations.
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9}>
        <Icon name="upload-outline" size={18} color="#FFFFFF" />
        <Text style={styles.primaryButtonText}>Upload Sales Documents</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BusinessSalesIncomeScreen;

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
  heroBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
  },
  heroBadgeText: {
    marginLeft: 6,
    color: '#1D4ED8',
    fontWeight: '700',
    fontSize: 12,
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
  metricsRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  metricLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
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
  listRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  listIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: '#334155',
    fontWeight: '600',
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sourceText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 16,
  },
  alertTextWrap: {
    flex: 1,
    marginLeft: 10,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#92400E',
  },
  alertBody: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: '#92400E',
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


