import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/features/auth/context/AuthContext';

const getBoolean = (value) => value === true;

const buildProfileSummary = (user) => {
  const taxProfile = user?.taxProfile || {};
  const spouseProfile = user?.spouseTaxProfile || {};
  const businessProfile =
    typeof taxProfile.business === 'object'
      ? taxProfile.business
      : {
          enabled: !!taxProfile.business,
          hasEmployees: false,
          hasInventory: false,
          hasFranchise: false,
          isGSTRegistered: false,
        };

  const userIncomeTypes = [];
  if (getBoolean(taxProfile.employment)) userIncomeTypes.push('Employment');
  if (getBoolean(taxProfile.gigWork) || getBoolean(taxProfile.selfEmployed)) {
    userIncomeTypes.push('Self-Employed / Gig Work');
  }
  if (getBoolean(businessProfile.enabled) || getBoolean(taxProfile.business === true)) {
    userIncomeTypes.push('Business');
  }
  if (getBoolean(taxProfile.unemployed)) userIncomeTypes.push('Unemployed');

  const spouseIncomeTypes = [];
  if (getBoolean(spouseProfile.employment)) spouseIncomeTypes.push('Employment');
  if (getBoolean(spouseProfile.gigWork) || getBoolean(spouseProfile.selfEmployed)) {
    spouseIncomeTypes.push('Self-Employed / Gig Work');
  }
  if (getBoolean(spouseProfile.business)) spouseIncomeTypes.push('Business');
  if (getBoolean(spouseProfile.unemployed)) spouseIncomeTypes.push('Unemployed');

  const optionalFlags = [
    { key: 'rrsp', label: 'RRSP', active: getBoolean(taxProfile.rrsp) },
    { key: 'fhsa', label: 'FHSA', active: getBoolean(taxProfile.fhsa) },
    { key: 'tfsa', label: 'TFSA', active: getBoolean(taxProfile.tfsa) },
    { key: 'investments', label: 'Investments', active: getBoolean(taxProfile.investments) },
    { key: 'donations', label: 'Donations', active: getBoolean(taxProfile.donations) },
    { key: 'ccb', label: 'CCB', active: getBoolean(taxProfile.ccb) },
    { key: 'workFromHome', label: 'Work From Home', active: getBoolean(taxProfile.workFromHome) },
  ].filter((item) => item.active);

  const businessFlags = [
    {
      key: 'employees',
      label: 'Has Employees',
      active: getBoolean(businessProfile.hasEmployees),
      icon: 'account-group-outline',
    },
    {
      key: 'inventory',
      label: 'Has Inventory',
      active: getBoolean(businessProfile.hasInventory),
      icon: 'archive-outline',
    },
    {
      key: 'franchise',
      label: 'Franchise Model',
      active: getBoolean(businessProfile.hasFranchise),
      icon: 'file-certificate-outline',
    },
    {
      key: 'gst',
      label: 'GST Registered',
      active: getBoolean(businessProfile.isGSTRegistered),
      icon: 'receipt-text-check-outline',
    },
  ].filter((item) => item.active);

  const accountType =
    spouseIncomeTypes.length > 0 || user?.accountType === 'household'
      ? 'Household Account'
      : 'Single Account';

  return {
    accountType,
    userIncomeTypes,
    spouseIncomeTypes,
    optionalFlags,
    businessFlags,
    businessProfile,
  };
};

const InfoPill = ({ icon, label, tone = 'default' }) => {
  const toneStyles = {
    default: {
      backgroundColor: '#F1F5F9',
      color: '#334155',
      iconBg: '#E2E8F0',
      iconColor: '#334155',
    },
    primary: {
      backgroundColor: '#DBEAFE',
      color: '#1D4ED8',
      iconBg: '#BFDBFE',
      iconColor: '#1D4ED8',
    },
    success: {
      backgroundColor: '#DCFCE7',
      color: '#166534',
      iconBg: '#BBF7D0',
      iconColor: '#166534',
    },
    warning: {
      backgroundColor: '#FEF3C7',
      color: '#92400E',
      iconBg: '#FDE68A',
      iconColor: '#92400E',
    },
  };

  const current = toneStyles[tone] || toneStyles.default;

  return (
    <View style={[styles.pill, { backgroundColor: current.backgroundColor }]}>
      <View style={[styles.pillIconWrap, { backgroundColor: current.iconBg }]}>
        <Icon name={icon} size={14} color={current.iconColor} />
      </View>
      <Text style={[styles.pillText, { color: current.color }]}>{label}</Text>
    </View>
  );
};

const SectionCard = ({ title, subtitle, children, rightAction }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{title}</Text>
          {!!subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
        </View>
        {rightAction}
      </View>
      {children}
    </View>
  );
};

const ActionTile = ({ icon, title, subtitle, onPress, color = '#2563EB' }) => {
  return (
    <TouchableOpacity style={styles.actionTile} activeOpacity={0.9} onPress={onPress}>
      <View style={[styles.actionIconWrap, { backgroundColor: `${color}15` }]}>
        <Icon name={icon} size={22} color={color} />
      </View>
      <View style={styles.actionTextWrap}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
      <Icon name="chevron-right" size={22} color="#94A3B8" />
    </TouchableOpacity>
  );
};

const TaxProfileScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  const summary = useMemo(() => buildProfileSummary(user), [user]);

  const userName = user?.name || user?.fullName || 'User';

  const profileReadiness = useMemo(() => {
    let total = 3;
    let completed = 0;

    if (summary.userIncomeTypes.length > 0) completed += 1;
    if (summary.accountType) completed += 1;
    if (
      summary.optionalFlags.length > 0 ||
      summary.businessFlags.length > 0 ||
      summary.spouseIncomeTypes.length > 0
    ) {
      completed += 1;
    }

    return Math.round((completed / total) * 100);
  }, [summary]);

  const quickStats = [
    {
      label: 'User Income Types',
      value: summary.userIncomeTypes.length,
      icon: 'briefcase-variant-outline',
    },
    {
      label: 'Optional Tax Areas',
      value: summary.optionalFlags.length,
      icon: 'tune-variant',
    },
    {
      label: 'Business Flags',
      value: summary.businessFlags.length,
      icon: 'office-building-outline',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroIconWrap}>
            <Icon name="account-details-outline" size={28} color="#0F172A" />
          </View>
          <View style={styles.heroTextWrap}>
            <Text style={styles.heroEyebrow}>Scenario Engine</Text>
            <Text style={styles.title}>Tax Profile</Text>
            <Text style={styles.subtitle}>
              Configure income types, household structure, optional tax categories, and business rules
              that drive the entire app experience.
            </Text>
          </View>
        </View>

        <View style={styles.profileBanner}>
          <View style={styles.profileBannerLeft}>
            <Text style={styles.profileBannerTitle}>{userName}</Text>
            <Text style={styles.profileBannerSubtitle}>{summary.accountType}</Text>
          </View>
          <View style={styles.progressRingMock}>
            <Text style={styles.progressRingValue}>{profileReadiness}%</Text>
            <Text style={styles.progressRingLabel}>Ready</Text>
          </View>
        </View>

        <View style={styles.heroPillsRow}>
          <InfoPill icon="home-account" label={summary.accountType} tone="primary" />
          <InfoPill
            icon="shape-outline"
            label={`${summary.userIncomeTypes.length} income type(s)`}
            tone="success"
          />
        </View>
      </View>

      <View style={styles.statsRow}>
        {quickStats.map((item) => (
          <View key={item.label} style={styles.statCard}>
            <View style={styles.statIconWrap}>
              <Icon name={item.icon} size={18} color="#2563EB" />
            </View>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <SectionCard
        title="Primary Profile"
        subtitle="Main taxpayer configuration that controls dashboard, checklist, and navigation."
        rightAction={
          <TouchableOpacity style={styles.editChip} activeOpacity={0.9}>
            <Icon name="pencil-outline" size={14} color="#2563EB" />
            <Text style={styles.editChipText}>Edit</Text>
          </TouchableOpacity>
        }
      >
        <View style={styles.groupBlock}>
          <Text style={styles.groupLabel}>User income types</Text>
          <View style={styles.pillWrap}>
            {summary.userIncomeTypes.length > 0 ? (
              summary.userIncomeTypes.map((item) => (
                <InfoPill key={item} icon="check-circle-outline" label={item} tone="default" />
              ))
            ) : (
              <Text style={styles.emptyText}>No income types configured yet.</Text>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.groupBlock}>
          <Text style={styles.groupLabel}>Optional tax areas</Text>
          <View style={styles.pillWrap}>
            {summary.optionalFlags.length > 0 ? (
              summary.optionalFlags.map((item) => (
                <InfoPill key={item.key} icon="star-four-points-outline" label={item.label} tone="warning" />
              ))
            ) : (
              <Text style={styles.emptyText}>No optional tax areas selected yet.</Text>
            )}
          </View>
        </View>
      </SectionCard>

      <SectionCard
        title="Household / Spouse"
        subtitle="Spouse configuration should only appear when the profile is household-based."
      >
        {summary.spouseIncomeTypes.length > 0 ? (
          <View style={styles.groupBlock}>
            <Text style={styles.groupLabel}>Spouse income types</Text>
            <View style={styles.pillWrap}>
              {summary.spouseIncomeTypes.map((item) => (
                <InfoPill key={item} icon="account-heart-outline" label={item} tone="success" />
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Icon name="account-off-outline" size={24} color="#94A3B8" />
            <Text style={styles.emptyStateTitle}>No spouse profile linked</Text>
            <Text style={styles.emptyStateBody}>
              This account is currently configured as a single-user flow, or spouse income details
              have not been added yet.
            </Text>
          </View>
        )}
      </SectionCard>

      <SectionCard
        title="Business Rules"
        subtitle="These flags decide which business screens, checklist items, and uploads are shown."
      >
        {summary.businessFlags.length > 0 ? (
          <View style={styles.pillWrap}>
            {summary.businessFlags.map((item) => (
              <InfoPill key={item.key} icon={item.icon} label={item.label} tone="primary" />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Icon name="office-building-remove-outline" size={24} color="#94A3B8" />
            <Text style={styles.emptyStateTitle}>No business-specific flags active</Text>
            <Text style={styles.emptyStateBody}>
              Inventory, payroll, franchise, and GST sections will appear only when enabled in the tax profile.
            </Text>
          </View>
        )}
      </SectionCard>

      <SectionCard
        title="Next Actions"
        subtitle="Use this profile to drive the correct experience across the app."
      >
        <ActionTile
          icon="view-dashboard-outline"
          title="Open Dashboard"
          subtitle="See the dashboard generated from the current tax profile"
          onPress={() => navigation.navigate('Dashboard')}
          color="#2563EB"
        />

        <ActionTile
          icon="format-list-checks"
          title="Open Tax Checklist"
          subtitle="Review missing items based on profile conditions"
          onPress={() => navigation.navigate('Checklist')}
          color="#16A34A"
        />

        <ActionTile
          icon="file-document-outline"
          title="Open Documents"
          subtitle="Review document areas visible for this profile"
          onPress={() => navigation.navigate('Documents')}
          color="#7C3AED"
        />

        {summary.businessProfile?.enabled ? (
          <ActionTile
            icon="office-building-outline"
            title="Open Business Dashboard"
            subtitle="Go to business-only sections and uploads"
            onPress={() => navigation.navigate('BusinessDashboard')}
            color="#D97706"
          />
        ) : null}
      </SectionCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  heroCard: {
    backgroundColor: '#E0F2FE',
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: 16,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  heroIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  heroTextWrap: {
    flex: 1,
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369A1',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
    color: '#334155',
  },
  profileBanner: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileBannerLeft: {
    flex: 1,
    paddingRight: 12,
  },
  profileBannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  profileBannerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  progressRingMock: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 6,
    borderColor: '#93C5FD',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
  },
  progressRingValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  progressRingLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
  },
  heroPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: '#64748B',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: '#64748B',
  },
  editChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    marginLeft: 10,
  },
  editChipText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  groupBlock: {
    marginBottom: 4,
  },
  groupLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  pillIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 19,
  },
  emptyState: {
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyStateTitle: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptyStateBody: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
    color: '#64748B',
  },
  actionTile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionTextWrap: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  actionSubtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: '#64748B',
  },
});

export default TaxProfileScreen;


