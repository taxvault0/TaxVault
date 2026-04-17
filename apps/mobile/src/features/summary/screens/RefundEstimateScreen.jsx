import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/features/auth/context/AuthContext';

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `$${amount.toLocaleString('en-CA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const normalizeBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return ['true', '1', 'yes', 'y'].includes(value.trim().toLowerCase());
  }
  if (typeof value === 'number') return value === 1;
  return false;
};

const buildPersonProfile = (raw = {}) => {
  const taxProfile = raw?.taxProfile || {};
  const incomeSources = Array.isArray(raw?.incomeSources) ? raw.incomeSources : [];
  const businessInfo = raw?.businessInfo || {};
  const incomeSet = new Set(incomeSources.map((item) => String(item).trim().toLowerCase()));
  const userType = String(raw?.userType || raw?.roleType || '').trim().toLowerCase();

  const employment =
    normalizeBoolean(taxProfile.employment) ||
    normalizeBoolean(raw?.employment) ||
    incomeSet.has('employment') ||
    incomeSet.has('employed') ||
    userType.includes('employee') ||
    userType.includes('employed');

  const gigWork =
    normalizeBoolean(taxProfile.gigWork) ||
    normalizeBoolean(taxProfile.selfEmployed) ||
    normalizeBoolean(raw?.gigWork) ||
    normalizeBoolean(raw?.selfEmployed) ||
    incomeSet.has('gig') ||
    incomeSet.has('gig work') ||
    incomeSet.has('self-employed') ||
    incomeSet.has('self employed') ||
    userType.includes('gig') ||
    userType.includes('self-employed') ||
    userType.includes('self employed');

  const business =
    normalizeBoolean(taxProfile.business) ||
    normalizeBoolean(raw?.business) ||
    normalizeBoolean(businessInfo?.hasBusiness) ||
    normalizeBoolean(businessInfo?.isBusinessOwner) ||
    incomeSet.has('business') ||
    userType.includes('business');

  return {
    employment,
    gigWork,
    business,
    rrsp: normalizeBoolean(taxProfile.rrsp) || normalizeBoolean(raw?.rrsp),
    fhsa: normalizeBoolean(taxProfile.fhsa) || normalizeBoolean(raw?.fhsa),
    tfsa: normalizeBoolean(taxProfile.tfsa) || normalizeBoolean(raw?.tfsa),
    investments: normalizeBoolean(taxProfile.investments) || normalizeBoolean(raw?.investments),
    donations: normalizeBoolean(taxProfile.donations) || normalizeBoolean(raw?.donations),
  };
};

const RefundEstimateScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  const profile = useMemo(() => buildPersonProfile(user || {}), [user]);

  const estimate = useMemo(() => {
    let income = 0;
    let deductions = 0;
    let taxPaid = 0;

    if (profile.employment) {
      income += 58250;
      taxPaid += 11200;
    }

    if (profile.gigWork) {
      income += 18740;
      taxPaid += 3200;
      deductions += 5400;
    }

    if (profile.business) {
      income += 26400;
      deductions += 4200;
    }

    if (profile.investments) {
      income += 845.32;
    }

    if (profile.rrsp) {
      deductions += 6000;
    }

    if (profile.fhsa) {
      deductions += 8000;
    }

    if (profile.donations) {
      deductions += 1200;
    }

    if (income === 0) {
      income = 85000;
      deductions = 20600;
      taxPaid = 20000;
    }

    const taxableIncome = Math.max(0, income - deductions);
    const estimatedTaxRate = 0.22;
    const estimatedTax = taxableIncome * estimatedTaxRate;
    const refund = taxPaid - estimatedTax;
    const isRefund = refund >= 0;

    return {
      income,
      deductions,
      taxableIncome,
      estimatedTax,
      taxPaid,
      refund,
      isRefund,
      estimatedTaxRate,
    };
  }, [profile]);

  const insightItems = useMemo(() => {
    const items = [];

    if (profile.rrsp) {
      items.push('RRSP contributions are helping reduce taxable income.');
    }

    if (profile.fhsa) {
      items.push('FHSA contributions are included in the deduction estimate.');
    }

    if (profile.donations) {
      items.push('Donation receipts may improve your final tax position.');
    }

    if (profile.gigWork || profile.business) {
      items.push('Business and gig expenses can significantly affect your final result.');
    }

    if (!items.length) {
      items.push('Add income slips and deduction documents for a more accurate estimate.');
    }

    return items;
  }, [profile]);

  const quickLinks = useMemo(() => {
    const items = [
      {
        key: 'income',
        title: 'Income Summary',
        icon: 'chart-box-outline',
        route: 'IncomeSummary',
      },
      {
        key: 'deductions',
        title: 'Deductions',
        icon: 'calculator-variant-outline',
        route: 'DeductionSummary',
      },
      {
        key: 'checklist',
        title: 'Checklist',
        icon: 'format-list-checks',
        route: 'Checklist',
      },
      {
        key: 'documents',
        title: 'Documents',
        icon: 'folder-outline',
        route: 'IncomeDocuments',
      },
    ];

    return items;
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.title}>Estimated Result</Text>

          <Text
            style={[
              styles.result,
              { color: estimate.isRefund ? '#059669' : '#DC2626' },
            ]}
          >
            {estimate.isRefund ? 'Estimated Refund' : 'Estimated Amount Owing'}
          </Text>

          <Text style={styles.amount}>
            {formatCurrency(Math.abs(estimate.refund))}
          </Text>

          <Text style={styles.heroSubtext}>
            This preview is based on your current income and deduction setup.
          </Text>
        </View>

        <View style={styles.highlightRow}>
          <View style={styles.highlightCard}>
            <Text style={styles.highlightLabel}>Taxable Income</Text>
            <Text style={styles.highlightValue}>
              {formatCurrency(estimate.taxableIncome)}
            </Text>
          </View>

          <View style={styles.highlightCard}>
            <Text style={styles.highlightLabel}>Estimated Tax Rate</Text>
            <Text style={styles.highlightValue}>
              {(estimate.estimatedTaxRate * 100).toFixed(0)}%
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Calculation Breakdown</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Total Income</Text>
          <Text style={styles.value}>{formatCurrency(estimate.income)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Total Deductions</Text>
          <Text style={styles.value}>{formatCurrency(estimate.deductions)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Taxable Income</Text>
          <Text style={styles.value}>{formatCurrency(estimate.taxableIncome)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Estimated Tax</Text>
          <Text style={styles.value}>{formatCurrency(estimate.estimatedTax)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Tax Paid</Text>
          <Text style={styles.value}>{formatCurrency(estimate.taxPaid)}</Text>
        </View>

        <Text style={styles.sectionTitle}>Insights</Text>

        <View style={styles.infoCard}>
          {insightItems.map((item, index) => (
            <View key={`${item}-${index}`} style={styles.infoRow}>
              <Icon name="check-circle-outline" size={18} color="#059669" />
              <Text style={styles.infoText}>{item}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Quick Links</Text>

        <View style={styles.quickGrid}>
          {quickLinks.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.quickCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate(item.route)}
            >
              <View style={styles.quickIconWrap}>
                <Icon name={item.icon} size={22} color="#1D4ED8" />
              </View>
              <Text style={styles.quickLabel}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.info}>
          <Icon name="information-outline" size={18} color="#2563EB" />
          <Text style={styles.infoFooterText}>
            This is an estimate only. Your final result can change based on CRA rules,
            credits, province-specific calculations, and the documents you add later.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default RefundEstimateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  hero: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  title: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: '600',
  },
  result: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: '800',
  },
  amount: {
    fontSize: 34,
    fontWeight: '900',
    marginTop: 6,
    color: '#0F172A',
  },
  heroSubtext: {
    marginTop: 8,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
  },
  highlightRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  highlightCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  highlightLabel: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 6,
  },
  highlightValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#64748B',
    fontSize: 14,
  },
  value: {
    fontWeight: '800',
    color: '#0F172A',
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    lineHeight: 19,
    color: '#475569',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  quickCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  quickIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20,
  },
  info: {
    marginTop: 4,
    backgroundColor: '#EFF6FF',
    padding: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoFooterText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    lineHeight: 19,
    color: '#1E40AF',
  },
});


