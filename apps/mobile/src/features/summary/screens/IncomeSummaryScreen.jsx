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
    tfsa: normalizeBoolean(taxProfile.tfsa) || normalizeBoolean(raw?.tfsa),
    rrsp: normalizeBoolean(taxProfile.rrsp) || normalizeBoolean(raw?.rrsp),
    fhsa: normalizeBoolean(taxProfile.fhsa) || normalizeBoolean(raw?.fhsa),
    investments: normalizeBoolean(taxProfile.investments) || normalizeBoolean(raw?.investments),
    donations: normalizeBoolean(taxProfile.donations) || normalizeBoolean(raw?.donations),
  };
};

const buildSummaryCards = (profile) => {
  const cards = [];

  if (profile.employment) {
    cards.push({
      key: 'employment',
      title: 'Employment Income',
      amount: 58250,
      description: 'T4 income from employer slips.',
      icon: 'briefcase-outline',
      route: 'UploadT4',
      status: 'T4',
    });
  }

  if (profile.gigWork) {
    cards.push({
      key: 'gig',
      title: 'Gig / Self-Employed Income',
      amount: 18740,
      description: 'T4A and self-employed income records.',
      icon: 'bike-fast',
      route: 'UploadT4A',
      status: 'T4A',
    });
  }

  if (profile.business) {
    cards.push({
      key: 'business',
      title: 'Business Income',
      amount: 26400,
      description: 'Business-related income and supporting records.',
      icon: 'storefront-outline',
      route: 'IncomeDocuments',
      status: 'Business',
    });
  }

  if (profile.investments) {
    cards.push({
      key: 'investments',
      title: 'Investment Income',
      amount: 845.32,
      description: 'Interest, dividend, and T5-based income.',
      icon: 'chart-line',
      route: 'UploadT5',
      status: 'T5',
    });
  }

  return cards;
};

const IncomeSummaryScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  const profile = useMemo(() => buildPersonProfile(user || {}), [user]);
  const summaryCards = useMemo(() => buildSummaryCards(profile), [profile]);

  const totalIncome = useMemo(
    () => summaryCards.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [summaryCards]
  );

  const activeSourcesCount = summaryCards.length;

  const insightItems = useMemo(() => {
    const items = [];

    if (profile.employment) {
      items.push('Employment income is included through your T4 workflow.');
    }

    if (profile.gigWork) {
      items.push('Gig income should be reviewed together with receipts and mileage.');
    }

    if (profile.business) {
      items.push('Business income should be matched with complete business records.');
    }

    if (profile.investments) {
      items.push('Investment income should include T5 slips or official statements.');
    }

    if (!items.length) {
      items.push('No income sources detected yet. Start by uploading your first tax slip.');
    }

    return items;
  }, [profile]);

  const quickActions = useMemo(() => {
    const actions = [
      {
        key: 't4',
        label: 'Upload T4',
        icon: 'file-document-outline',
        route: 'UploadT4',
        show: true,
      },
      {
        key: 't4a',
        label: 'Upload T4A',
        icon: 'briefcase-outline',
        route: 'UploadT4A',
        show: true,
      },
      {
        key: 't5',
        label: 'Upload T5',
        icon: 'chart-line',
        route: 'UploadT5',
        show: profile.investments || profile.tfsa,
      },
      {
        key: 'receipts',
        label: 'Open Receipts',
        icon: 'receipt-outline',
        route: 'Receipts',
        show: profile.gigWork || profile.business,
      },
      {
        key: 'mileage',
        label: 'Track Mileage',
        icon: 'map-marker-distance',
        route: 'MileageTracker',
        show: profile.gigWork,
      },
      {
        key: 'documents',
        label: 'Open Documents',
        icon: 'folder-outline',
        route: 'IncomeDocuments',
        show: true,
      },
      {
        key: 'deductions',
        label: 'Deductions',
        icon: 'calculator-variant-outline',
        route: 'DeductionSummary',
        show: true,
      },
      {
        key: 'refund',
        label: 'Refund Estimate',
        icon: 'cash-refund',
        route: 'RefundEstimate',
        show: true,
      },
    ];

    return actions.filter((item) => item.show);
  }, [profile]);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.heroCard}>
          <Text style={styles.title}>Income Summary</Text>
          <Text style={styles.subtitle}>
            Review the income sources currently included in your tax workflow.
          </Text>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatLabel}>Estimated Total Income</Text>
              <Text style={styles.totalValue}>{formatCurrency(totalIncome)}</Text>
            </View>

            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatLabel}>Active Sources</Text>
              <Text style={styles.heroMiniValue}>{activeSourcesCount}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Income Breakdown</Text>

        {summaryCards.length === 0 ? (
          <View style={styles.emptyCard}>
            <Icon name="file-document-outline" size={32} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No income added yet</Text>
            <Text style={styles.emptyText}>
              Upload T4, T4A, or T5 slips to start building your income summary.
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('UploadT4')}
            >
              <Text style={styles.primaryButtonText}>Start with T4</Text>
            </TouchableOpacity>
          </View>
        ) : (
          summaryCards.map((item) => (
            <TouchableOpacity
              key={item.key}
              activeOpacity={0.85}
              style={styles.incomeCard}
              onPress={() => navigation.navigate(item.route)}
            >
              <View style={styles.incomeLeft}>
                <View style={styles.iconWrap}>
                  <Icon name={item.icon} size={22} color="#1D4ED8" />
                </View>

                <View style={styles.incomeTextWrap}>
                  <View style={styles.rowTop}>
                    <Text style={styles.incomeTitle}>{item.title}</Text>
                    <View style={styles.sourceBadge}>
                      <Text style={styles.sourceBadgeText}>{item.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.incomeDescription}>{item.description}</Text>
                </View>
              </View>

              <View style={styles.incomeRight}>
                <Text style={styles.incomeAmount}>{formatCurrency(item.amount)}</Text>
                <Icon name="chevron-right" size={20} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          ))
        )}

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.quickGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.key}
              activeOpacity={0.85}
              style={styles.quickCard}
              onPress={() => navigation.navigate(action.route)}
            >
              <View style={styles.quickIconWrap}>
                <Icon name={action.icon} size={22} color="#1D4ED8" />
              </View>
              <Text style={styles.quickLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
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

        <Text style={styles.sectionTitle}>Next Step</Text>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.nextStepCard}
          onPress={() => navigation.navigate('DeductionSummary')}
        >
          <View style={styles.nextStepLeft}>
            <View style={styles.nextStepIconWrap}>
              <Icon name="calculator-variant-outline" size={22} color="#1D4ED8" />
            </View>
            <View style={styles.nextStepTextWrap}>
              <Text style={styles.nextStepTitle}>Continue to Deduction Summary</Text>
              <Text style={styles.nextStepSubtitle}>
                Review RRSP, FHSA, donations, and expense deductions next.
              </Text>
            </View>
          </View>

          <Icon name="chevron-right" size={22} color="#94A3B8" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

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
  heroStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  heroStatBox: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderRadius: 18,
    padding: 16,
  },
  heroStatLabel: {
    fontSize: 13,
    color: '#1E40AF',
    marginBottom: 6,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  heroMiniValue: {
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
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    color: '#64748B',
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: '#0F172A',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  incomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  incomeLeft: {
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
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  incomeTextWrap: {
    flex: 1,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  incomeTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  sourceBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sourceBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  incomeDescription: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 19,
    color: '#64748B',
  },
  incomeRight: {
    alignItems: 'flex-end',
  },
  incomeAmount: {
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
});

export default IncomeSummaryScreen;


