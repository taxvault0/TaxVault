import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/features/auth/context/AuthContext';

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

const SummaryCard = ({ title, subtitle, icon, onPress, badge }) => (
  <TouchableOpacity style={styles.summaryCard} activeOpacity={0.85} onPress={onPress}>
    <View style={styles.summaryLeft}>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={22} color="#1D4ED8" />
      </View>

      <View style={styles.textWrap}>
        <View style={styles.titleRow}>
          <Text style={styles.cardTitle}>{title}</Text>
          {!!badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
    </View>

    <Icon name="chevron-right" size={22} color="#94A3B8" />
  </TouchableOpacity>
);

const TaxSummaryScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  const profile = useMemo(() => buildPersonProfile(user || {}), [user]);

  const summarySections = useMemo(() => {
    const sections = [
      {
        key: 'income',
        title: 'Income Summary',
        subtitle: 'Review employment, self-employed, business, and investment income.',
        icon: 'chart-box-outline',
        route: 'IncomeSummary',
        badge: 'Core',
      },
      {
        key: 'deductions',
        title: 'Deduction Summary',
        subtitle: 'Review RRSP, FHSA, donations, and expense deductions.',
        icon: 'calculator-variant-outline',
        route: 'DeductionSummary',
        badge: 'Core',
      },
      {
        key: 'refund',
        title: 'Refund Estimate',
        subtitle: 'Preview your estimated refund or amount owing.',
        icon: 'cash-refund',
        route: 'RefundEstimate',
        badge: 'Core',
      },
    ];

    return sections;
  }, []);

  const quickStats = useMemo(() => {
    let incomeSources = 0;
    let deductionSources = 0;

    if (profile.employment) incomeSources += 1;
    if (profile.gigWork) incomeSources += 1;
    if (profile.business) incomeSources += 1;
    if (profile.investments || profile.tfsa) incomeSources += 1;

    if (profile.rrsp) deductionSources += 1;
    if (profile.fhsa) deductionSources += 1;
    if (profile.donations) deductionSources += 1;
    if (profile.gigWork || profile.business) deductionSources += 1;

    return {
      incomeSources,
      deductionSources,
    };
  }, [profile]);

  const recommendations = useMemo(() => {
    const items = [];

    if (profile.employment) {
      items.push({
        label: 'Employment income should be reviewed in Income Summary.',
        icon: 'briefcase-outline',
      });
    }

    if (profile.gigWork) {
      items.push({
        label: 'Self-employed income should be matched with receipts and mileage.',
        icon: 'bike-fast',
      });
    }

    if (profile.business) {
      items.push({
        label: 'Business income should be checked with supporting documents.',
        icon: 'storefront-outline',
      });
    }

    if (profile.rrsp || profile.fhsa || profile.donations) {
      items.push({
        label: 'Your deductions may improve your final refund estimate.',
        icon: 'trending-up',
      });
    }

    if (!items.length) {
      items.push({
        label: 'Start with Income Summary to begin building your filing overview.',
        icon: 'information-outline',
      });
    }

    return items;
  }, [profile]);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.heroCard}>
          <Text style={styles.title}>Tax Summary</Text>
          <Text style={styles.subtitle}>
            Review your income, deductions, and estimated result from one place.
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Income Sources</Text>
              <Text style={styles.statValue}>{quickStats.incomeSources}</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Deduction Areas</Text>
              <Text style={styles.statValue}>{quickStats.deductionSources}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Summary Sections</Text>

        {summarySections.map((section) => (
          <SummaryCard
            key={section.key}
            title={section.title}
            subtitle={section.subtitle}
            icon={section.icon}
            badge={section.badge}
            onPress={() => navigation.navigate(section.route)}
          />
        ))}

        <Text style={styles.sectionTitle}>Recommended Next Steps</Text>

        <View style={styles.infoCard}>
          {recommendations.map((item, index) => (
            <View key={`${item.label}-${index}`} style={styles.infoRow}>
              <Icon name={item.icon} size={18} color="#059669" />
              <Text style={styles.infoText}>{item.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Quick Links</Text>

        <View style={styles.quickGrid}>
          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('IncomeSummary')}
          >
            <View style={styles.quickIconWrap}>
              <Icon name="chart-box-outline" size={22} color="#1D4ED8" />
            </View>
            <Text style={styles.quickLabel}>Income Summary</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('DeductionSummary')}
          >
            <View style={styles.quickIconWrap}>
              <Icon name="calculator-variant-outline" size={22} color="#1D4ED8" />
            </View>
            <Text style={styles.quickLabel}>Deductions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('RefundEstimate')}
          >
            <View style={styles.quickIconWrap}>
              <Icon name="cash-refund" size={22} color="#1D4ED8" />
            </View>
            <Text style={styles.quickLabel}>Refund Estimate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Checklist')}
          >
            <View style={styles.quickIconWrap}>
              <Icon name="format-list-checks" size={22} color="#1D4ED8" />
            </View>
            <Text style={styles.quickLabel}>Checklist</Text>
          </TouchableOpacity>
        </View>
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
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderRadius: 18,
    padding: 16,
  },
  statLabel: {
    fontSize: 13,
    color: '#1E40AF',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  summaryCard: {
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
  summaryLeft: {
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
  textWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardSubtitle: {
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
});

export default TaxSummaryScreen;


