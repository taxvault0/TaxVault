import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const businessInfo = {
  businessName: 'North Peak Services Ltd.',
  businessType: 'Corporation',
  industry: 'Consulting / Services',
  fiscalYearEnd: 'December 31',
  businessNumber: '12345 6789 RC0001',
  gstNumber: '12345 6789 RT0001',
  province: 'Alberta',
  incorporationDate: '2023-04-12',
  hasEmployees: true,
  hasFranchise: false,
  hasInventory: false,
  status: 'Profile 85% complete',
};

const infoRows = [
  { label: 'Business Name', value: businessInfo.businessName, icon: 'domain' },
  { label: 'Business Type', value: businessInfo.businessType, icon: 'briefcase-outline' },
  { label: 'Industry', value: businessInfo.industry, icon: 'office-building-outline' },
  { label: 'Fiscal Year End', value: businessInfo.fiscalYearEnd, icon: 'calendar-end' },
  { label: 'Business Number', value: businessInfo.businessNumber, icon: 'identifier' },
  { label: 'GST/HST Number', value: businessInfo.gstNumber, icon: 'file-document-outline' },
  { label: 'Province', value: businessInfo.province, icon: 'map-marker-outline' },
  { label: 'Incorporation Date', value: businessInfo.incorporationDate, icon: 'calendar-check-outline' },
];

const BusinessInfoScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.heroIconWrap}>
            <Icon name="office-building" size={28} color="#0F172A" />
          </View>
          <View style={styles.heroTextWrap}>
            <Text style={styles.title}>Business Information</Text>
            <Text style={styles.subtitle}>
              Keep core business registration and profile details updated for smoother tax filing.
            </Text>
          </View>
        </View>

        <View style={styles.statusPill}>
          <Icon name="check-decagram" size={16} color="#166534" />
          <Text style={styles.statusText}>{businessInfo.status}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Business Profile</Text>
        {infoRows.map((item) => (
          <View key={item.label} style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}>
                <Icon name={item.icon} size={18} color="#2563EB" />
              </View>
              <Text style={styles.rowLabel}>{item.label}</Text>
            </View>
            <Text style={styles.rowValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Business Flags</Text>

        <View style={styles.flagRow}>
          <View style={styles.flagItem}>
            <Icon
              name={businessInfo.hasEmployees ? 'check-circle' : 'close-circle-outline'}
              size={18}
              color={businessInfo.hasEmployees ? '#16A34A' : '#94A3B8'}
            />
            <Text style={styles.flagText}>Employees / Payroll</Text>
          </View>
        </View>

        <View style={styles.flagRow}>
          <View style={styles.flagItem}>
            <Icon
              name={businessInfo.hasFranchise ? 'check-circle' : 'close-circle-outline'}
              size={18}
              color={businessInfo.hasFranchise ? '#16A34A' : '#94A3B8'}
            />
            <Text style={styles.flagText}>Franchise Fee Obligations</Text>
          </View>
        </View>

        <View style={styles.flagRow}>
          <View style={styles.flagItem}>
            <Icon
              name={businessInfo.hasInventory ? 'check-circle' : 'close-circle-outline'}
              size={18}
              color={businessInfo.hasInventory ? '#16A34A' : '#94A3B8'}
            />
            <Text style={styles.flagText}>Inventory Tracking</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recommended Documents</Text>
        {[
          'Articles of incorporation / registration',
          'Business number and GST/HST registration',
          'Shareholder or ownership details',
          'Fiscal year and accounting method records',
          'Bank account details for tax and refund matching',
        ].map((item) => (
          <View key={item} style={styles.bulletRow}>
            <Icon name="check-circle-outline" size={18} color="#2563EB" />
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9}>
        <Icon name="pencil-outline" size={18} color="#FFFFFF" />
        <Text style={styles.primaryButtonText}>Edit Business Info</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BusinessInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  heroCard: {
    backgroundColor: '#E0F2FE',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  heroIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  heroTextWrap: {
    flex: 1,
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
  statusPill: {
    marginTop: 14,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  rowValue: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
  },
  flagRow: {
    paddingVertical: 10,
  },
  flagItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    lineHeight: 21,
    color: '#334155',
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


