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

const DeductionSummaryScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  const profile = useMemo(() => buildPersonProfile(user || {}), [user]);

  const deductions = useMemo(() => {
    const items = [];

    items.push({
      key: 'rrsp',
      title: 'RRSP Contributions',
      amount: profile.rrsp ? 6000 : 0,
      icon: 'bank-outline',
      route: 'UploadRRSPReceipt',
      subtitle: profile.rrsp
        ? 'Contribution slips added or expected'
        : 'Add RRSP slips to claim deductions',
      status: profile.rrsp ? 'Enabled' : 'Optional',
    });

    items.push({
      key: 'fhsa',
      title: 'FHSA Contributions',
      amount: profile.fhsa ? 8000 : 0,
      icon: 'home-plus-outline',
      route: 'UploadFHSA',
      subtitle: profile.fhsa
        ? 'FHSA records added or expected'
        : 'Add FHSA documents for deduction tracking',
      status: profile.fhsa ? 'Enabled' : 'Optional',
    });

    items.push({
      key: 'donations',
      title: 'Donations',
      amount: profile.donations ? 1200 : 0,
      icon: 'hand-heart-outline',
      route: 'UploadDonation',
      subtitle: profile.donations
        ? 'Donation receipts added or expected'
        : 'Add charitable receipts for tax credits',
      status: profile.donations ? 'Enabled' : 'Optional',
    });

    if (profile.gigWork || profile.business) {
      items.push({
        key: 'expenses',
        title: 'Business / Gig Expenses',
        amount: 5400,
        icon: 'receipt-outline',
        route: 'Receipts',
        subtitle: 'Receipts, mileage, and deductible work expenses',
        status: 'Active',
      });
    }

    return items;
  }, [profile]);

  const totalDeductions = useMemo(
    () => deductions.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [deductions]
  );

  const activeCount = useMemo(
    () => deductions.filter((item) => Number(item.amount || 0) > 0).length,
    [deductions]
  );

  const recommendations = useMemo(() => {
    const items = [];

    if (profile.rrsp) {
      items.push('RRSP contributions may reduce your taxable income.');
    } else {
      items.push('RRSP slips can improve your final deduction total.');
    }

    if (profile.fhsa) {
      items.push('FHSA contributions should be included in your deduction review.');
    }

    if (profile.donations) {
      items.push('Donation receipts may increase your tax credits.');
    }

    if (profile.gigWork || profile.business) {
      items.push('Gig and business users should match deductions with receipts and mileage.');
    }

    if (!items.length) {
      items.push('Start adding deduction-related documents to improve your filing result.');
    }

    return items;
  }, [profile]);

  const quickLinks = useMemo(() => {
    const items = [
      {
        key: 'rrsp',
        title: 'Upload RRSP',
        icon: 'bank-outline',
        route: 'UploadRRSPReceipt',
      },
      {
        key: 'fhsa',
        title: 'Upload FHSA',
        icon: 'home-plus-outline',
        route: 'UploadFHSA',
      },
      {
        key: 'donation',
        title: 'Upload Donation',
        icon: 'hand-heart-outline',
        route: 'UploadDonation',
      },
      {
        key: 'refund',
        title: 'Refund Estimate',
        icon: 'cash-refund',
        route: 'RefundEstimate',
      },
    ];

    if (profile.gigWork || profile.business) {
      items.splice(3, 0, {
        key: 'receipts',
        title: 'Open Receipts',
        icon: 'receipt-outline',
        route: 'Receipts',
      });
    }

    return items;
  }, [profile]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.title}>Deduction Summary</Text>
          <Text style={styles.subtitle}>
            Review the deductions and credits that can reduce your taxable income.
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Deductions</Text>
              <Text style={styles.totalValue}>{formatCurrency(totalDeductions)}</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Active Areas</Text>
              <Text style={styles.statMiniValue}>{activeCount}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Deduction Breakdown</Text>

        {deductions.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={styles.left}>
              <View style={styles.iconWrap}>
                <Icon name={item.icon} size={22} color="#1D4ED8" />
              </View>

              <View style={styles.textWrap}>
                <View style={styles.titleRow}>
                  <Text style={styles.titleText}>{item.title}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.status}</Text>
                  </View>
                </View>
                <Text style={styles.subText}>{item.subtitle}</Text>
              </View>
            </View>

            <View style={styles.right}>
              <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
              <Icon name="chevron-right" size={20} color="#94A3B8" />
            </View>
          </TouchableOpacity>
        ))}

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

        <Text style={styles.sectionTitle}>Insights</Text>

        <View style={styles.infoCard}>
          {recommendations.map((item, index) => (
            <View key={`${item}-${index}`} style={styles.infoRow}>
              <Icon name="check-circle-outline" size={18} color="#059669" />
              <Text style={styles.infoText}>{item}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Next Step</Text>

        <TouchableOpacity
          style={styles.nextStepCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('RefundEstimate')}
        >
          <View style={styles.nextStepLeft}>
            <View style={styles.nextStepIconWrap}>
              <Icon name="cash-refund" size={22} color="#1D4ED8" />
            </View>
            <View style={styles.nextStepTextWrap}>
              <Text style={styles.nextStepTitle}>Continue to Refund Estimate</Text>
              <Text style={styles.nextStepSubtitle}>
                Preview your estimated refund or amount owing.
              </Text>
            </View>
          </View>

          <Icon name="chevron-right" size={22} color="#94A3B8" />
        </TouchableOpacity>

        <View style={styles.tipBox}>
          <Icon name="lightbulb-outline" size={18} color="#F59E0B" />
          <Text style={styles.tipText}>
            Higher eligible deductions can reduce taxable income and improve your final refund result.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default DeductionSummaryScreen;

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
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: '#64748B',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ECFDF5',
    borderRadius: 18,
    padding: 16,
  },
  statLabel: {
    fontSize: 13,
    color: '#065F46',
    marginBottom: 6,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#059669',
  },
  statMiniValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
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
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginRight: 12,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 4,
  },
  titleText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  subText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#64748B',
  },
  badge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
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
  nextStepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nextStepLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginRight: 12,
  },
  nextStepIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  nextStepTextWrap: {
    flex: 1,
  },
  nextStepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  nextStepSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: '#64748B',
  },
  tipBox: {
    marginTop: 16,
    backgroundColor: '#FFFBEB',
    padding: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    lineHeight: 19,
    color: '#92400E',
  },
});


