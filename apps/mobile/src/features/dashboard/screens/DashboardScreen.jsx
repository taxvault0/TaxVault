import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '@/features/auth/context/AuthContext';

const normalizeBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    return ['true', '1', 'yes', 'y'].includes(v);
  }
  if (typeof value === 'number') return value === 1;
  return false;
};

const money = (value) => {
  const number = Math.max(0, Number(value || 0));
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(number);
};

const compactMoney = (value) => {
  const number = Math.max(0, Number(value || 0));
  if (number >= 1000) {
    const compact = number % 1000 === 0 ? (number / 1000).toFixed(0) : (number / 1000).toFixed(1);
    return `$${compact}k`;
  }
  return `$${Math.round(number)}`;
};

const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const shortSaveLabel = (key, title) => {
  switch (key) {
    case 'vehicle':
      return 'Vehicle';
    case 'home-office':
      return 'Home Office';
    case 'phone-internet':
      return 'Phone & Internet';
    case 'supplies-fees':
      return 'Supplies';
    case 'rent-ops':
      return 'Rent & Utils';
    case 'inventory-payroll':
      return 'Inventory';
    case 'rrsp':
      return 'RRSP';
    default:
      return title;
  }
};

const getItemDate = (item = {}) => {
  const raw =
    item?.date ||
    item?.createdAt ||
    item?.uploadedAt ||
    item?.timestamp ||
    item?.scannedAt ||
    item?.receiptDate ||
    item?.expenseDate;

  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getItemAmount = (item = {}) => {
  const raw =
    item?.amount ??
    item?.total ??
    item?.value ??
    item?.price ??
    item?.expenseAmount ??
    item?.receiptAmount ??
    0;

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeText = (value) => String(value || '').trim().toLowerCase();

const inferExpenseCategory = (item = {}) => {
  const category = normalizeText(item?.category);
  const type = normalizeText(item?.type);
  const subtype = normalizeText(item?.subtype);
  const title = normalizeText(item?.title);
  const name = normalizeText(item?.name);
  const description = normalizeText(item?.description);
  const merchant = normalizeText(item?.merchant);
  const tags = Array.isArray(item?.tags) ? item.tags.map((t) => normalizeText(t)).join(' ') : '';

  const text = [category, type, subtype, title, name, description, merchant, tags].join(' ');

  if (/(fuel|gas|petrol)/.test(text)) return 'fuel';
  if (/(parking|toll)/.test(text)) return 'parking';
  if (/(phone|mobile|cell)/.test(text)) return 'phone';
  if (/(internet|wifi)/.test(text)) return 'internet';
  if (/(insurance)/.test(text)) return 'insurance';
  if (/(rent|lease|utility|utilities|hydro|electricity|water)/.test(text)) return 'rent-utilities';
  if (/(supply|supplies|office|stationery|subscription|software|fee|fees|tool)/.test(text))
    return 'supplies';
  if (/(vehicle|mileage|car|auto|maintenance|repair)/.test(text)) return 'vehicle';
  if (/(home office|workspace|home-office)/.test(text)) return 'home-office';
  if (/(rrsp)/.test(text)) return 'rrsp';

  return 'other';
};

const collectUserRecords = (rawUser = {}) => {
  const buckets = [
    rawUser?.receipts,
    rawUser?.documents,
    rawUser?.uploads,
    rawUser?.expenses,
    rawUser?.expenseEntries,
    rawUser?.transactions,
    rawUser?.files,
  ];

  return buckets.flatMap((bucket) => (Array.isArray(bucket) ? bucket : []));
};

const emptyMetric = () => ({
  count: 0,
  total: 0,
  thisMonthCount: 0,
  thisMonthTotal: 0,
  hasThisMonth: false,
});

const buildExpenseMetrics = (rawUser = {}) => {
  const records = collectUserRecords(rawUser);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const metrics = {
    fuel: emptyMetric(),
    parking: emptyMetric(),
    phone: emptyMetric(),
    internet: emptyMetric(),
    insurance: emptyMetric(),
    'rent-utilities': emptyMetric(),
    supplies: emptyMetric(),
    vehicle: emptyMetric(),
    'home-office': emptyMetric(),
    rrsp: emptyMetric(),
    other: emptyMetric(),
  };

  records.forEach((item) => {
    const category = inferExpenseCategory(item);
    const amount = getItemAmount(item);
    const date = getItemDate(item);

    if (!metrics[category]) metrics[category] = emptyMetric();

    const metric = metrics[category];

    if (date && date.getFullYear() === currentYear) {
      metric.count += 1;
      metric.total += amount;

      if (date.getMonth() === currentMonth) {
        metric.thisMonthCount += 1;
        metric.thisMonthTotal += amount;
        metric.hasThisMonth = true;
      }
    }
  });

  return metrics;
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
    normalizeBoolean(taxProfile.selfEmployment) ||
    normalizeBoolean(raw?.gigWork) ||
    normalizeBoolean(raw?.selfEmployed) ||
    normalizeBoolean(raw?.selfEmployment) ||
    incomeSet.has('gig') ||
    incomeSet.has('gig-work') ||
    incomeSet.has('gig work') ||
    incomeSet.has('self-employed') ||
    incomeSet.has('self employed') ||
    userType.includes('gig') ||
    userType.includes('self-employed') ||
    userType.includes('self employed');

  const business =
    normalizeBoolean(taxProfile.business) ||
    normalizeBoolean(taxProfile.incorporatedBusiness) ||
    normalizeBoolean(raw?.business) ||
    normalizeBoolean(raw?.incorporatedBusiness) ||
    normalizeBoolean(businessInfo?.hasBusiness) ||
    normalizeBoolean(businessInfo?.isBusinessOwner) ||
    incomeSet.has('business') ||
    userType.includes('business');

  const unemployed =
    normalizeBoolean(taxProfile.unemployed) ||
    normalizeBoolean(raw?.unemployed) ||
    (!employment && !gigWork && !business);

  return {
    employment,
    gigWork,
    business,
    unemployed,
    rrsp: normalizeBoolean(taxProfile.rrsp) || normalizeBoolean(raw?.rrsp),
    fhsa: normalizeBoolean(taxProfile.fhsa) || normalizeBoolean(raw?.fhsa),
    tfsa: normalizeBoolean(taxProfile.tfsa) || normalizeBoolean(raw?.tfsa),
    investments: normalizeBoolean(taxProfile.investments) || normalizeBoolean(raw?.investments),
    donations: normalizeBoolean(taxProfile.donations) || normalizeBoolean(raw?.donations),
    ccb: normalizeBoolean(taxProfile.ccb) || normalizeBoolean(raw?.ccb),
  };
};

const buildHouseholdProfile = (rawUser = {}) => {
  const spouseRaw =
    rawUser?.spouse ||
    rawUser?.spouseInfo ||
    (rawUser?.taxProfile?.spouseTaxProfile
      ? {
          taxProfile: rawUser.taxProfile.spouseTaxProfile,
          incomeSources: rawUser.taxProfile.spouseIncomeSources || [],
        }
      : {});

  const hasSpouse =
    normalizeBoolean(rawUser?.taxProfile?.spouse) ||
    !!(spouseRaw && typeof spouseRaw === 'object' && Object.keys(spouseRaw).length > 0);

  return {
    user: buildPersonProfile(rawUser),
    spouse: buildPersonProfile(spouseRaw),
    hasSpouse,
  };
};

const ExpandableSection = ({
  title,
  subtitle,
  accent,
  bg,
  border,
  expanded,
  onToggle,
  children,
  rightText,
}) => (
  <View style={[styles.sectionCard, { backgroundColor: bg, borderColor: border }]}>
    <TouchableOpacity style={styles.expandHeader} activeOpacity={0.9} onPress={onToggle}>
      <View style={{ flex: 1 }}>
        <View style={[styles.sectionAccent, { backgroundColor: accent }]} />
        <Text style={styles.sectionTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      </View>

      <View style={styles.expandHeaderRight}>
        {!!rightText && <Text style={styles.expandRightText}>{rightText}</Text>}
        <Icon
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={22}
          color="#475569"
        />
      </View>
    </TouchableOpacity>

    {expanded ? <View style={styles.expandContent}>{children}</View> : null}
  </View>
);

const MovingPills = ({ items = [], onPress }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const repeatedItems = useMemo(() => [...items, ...items], [items]);

  useEffect(() => {
    if (!items.length) return;

    translateX.setValue(0);

    const loop = Animated.loop(
      Animated.timing(translateX, {
        toValue: -240 * items.length,
        duration: items.length * 4200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    loop.start();
    return () => loop.stop();
  }, [items, translateX]);

  if (!items.length) return null;

  return (
    <View style={styles.movingPillsViewport}>
      <Animated.View
        style={[
          styles.movingPillsTrack,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        {repeatedItems.map((item, index) => (
          <TouchableOpacity
            key={`${item.key}-${index}`}
            style={styles.heroPill}
            activeOpacity={0.88}
            onPress={() => onPress?.(item.routeName)}
          >
            <Text style={styles.heroPillLabel} numberOfLines={1}>
              {shortSaveLabel(item.key, item.title)}
            </Text>
            <Text style={styles.heroPillAmount} numberOfLines={1}>
              {compactMoney(item.remaining)}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
};

const CompactStatusCard = ({
  title,
  icon,
  iconBg,
  iconColor,
  accent,
  value,
  status,
  statusTone = 'muted',
  metaLeft,
  metaRight,
  onPress,
}) => (
  <TouchableOpacity style={[styles.compactCard, { borderColor: accent }]} activeOpacity={0.9} onPress={onPress}>
    <View style={styles.compactCardTop}>
      <View style={[styles.compactIconWrap, { backgroundColor: iconBg }]}>
        <Icon name={icon} size={18} color={iconColor} />
      </View>

      <View
        style={[
          styles.statusBadge,
          statusTone === 'good' && styles.statusBadgeGood,
          statusTone === 'warn' && styles.statusBadgeWarn,
        ]}
      >
        <Text
          style={[
            styles.statusBadgeText,
            statusTone === 'good' && styles.statusBadgeTextGood,
            statusTone === 'warn' && styles.statusBadgeTextWarn,
          ]}
          numberOfLines={1}
        >
          {status}
        </Text>
      </View>
    </View>

    <Text style={styles.compactCardTitle} numberOfLines={1}>
      {title}
    </Text>

    <Text style={styles.compactCardValue} numberOfLines={1}>
      {value}
    </Text>

    <View style={styles.compactCardMetaRow}>
      <Text style={styles.compactCardMeta} numberOfLines={1}>
        {metaLeft}
      </Text>
      <Text style={styles.compactCardMetaStrong} numberOfLines={1}>
        {metaRight}
      </Text>
    </View>
  </TouchableOpacity>
);

const SimpleMiniCard = ({
  title,
  icon,
  iconBg,
  iconColor,
  value,
  meta,
  onPress,
  accent = '#E6ECF8',
}) => (
  <TouchableOpacity style={[styles.miniCard, { borderColor: accent }]} activeOpacity={0.9} onPress={onPress}>
    <View style={styles.miniCardTop}>
      <View style={[styles.miniIconWrap, { backgroundColor: iconBg }]}>
        <Icon name={icon} size={16} color={iconColor} />
      </View>
      <Icon name="chevron-right" size={16} color="#94A3B8" />
    </View>

    <Text style={styles.miniCardTitle} numberOfLines={1}>
      {title}
    </Text>

    {!!value && (
      <Text style={styles.miniCardValue} numberOfLines={1}>
        {value}
      </Text>
    )}

    {!!meta && (
      <Text style={styles.miniCardMeta} numberOfLines={2}>
        {meta}
      </Text>
    )}
  </TouchableOpacity>
);

const IdeaCard = ({ title, icon, iconBg, iconColor, tip, routeName, navigation }) => (
  <TouchableOpacity
    style={styles.ideaCard}
    activeOpacity={0.9}
    onPress={() => navigation.navigate(routeName)}
  >
    <View style={styles.ideaCardTop}>
      <View style={[styles.ideaIconWrap, { backgroundColor: iconBg }]}>
        <Icon name={icon} size={18} color={iconColor} />
      </View>
      <Text style={styles.ideaTitle} numberOfLines={1}>
        {title}
      </Text>
    </View>

    <Text style={styles.ideaTip} numberOfLines={3}>
      {tip}
    </Text>

    <View style={styles.ideaFooter}>
      <Text style={styles.ideaFooterText}>Update profile</Text>
      <Icon name="arrow-right" size={16} color="#2563EB" />
    </View>
  </TouchableOpacity>
);

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const profile = useMemo(() => buildHouseholdProfile(user || {}), [user]);
  const expenseMetrics = useMemo(() => buildExpenseMetrics(user || {}), [user]);

  const [expandedSections, setExpandedSections] = useState({
    saveNow: true,
    monthly: false,
    later: false,
    ideas: true,
  });

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const firstName =
    user?.firstName ||
    user?.name?.split?.(' ')?.[0] ||
    user?.fullName?.split?.(' ')?.[0] ||
    'Gaurav';

  const navigateTo = (routeName, params = {}) => {
    if (!routeName) return;
    try {
      navigation.navigate(routeName, params);
    } catch (error) {
      console.log('Navigation error:', routeName, error);
    }
  };

  const openDrawer = () => {
    if (typeof navigation?.openDrawer === 'function') {
      navigation.openDrawer();
      return;
    }

    const parent = navigation?.getParent?.();
    if (parent && typeof parent.openDrawer === 'function') {
      parent.openDrawer();
      return;
    }

    const grandParent = parent?.getParent?.();
    if (grandParent && typeof grandParent.openDrawer === 'function') {
      grandParent.openDrawer();
    }
  };

  const handleContinueUploads = () => {
    navigateTo('Camera', {
      entryPoint: 'dashboard',
      captureMode: 'receipt-scan',
      documentType: 'receipt',
      autoScan: true,
      allowManualCapture: true,
      allowGalleryUpload: true,
      sourceScreen: 'DashboardScreen',
    });
  };

  const getMetric = (key) => expenseMetrics[key] || emptyMetric();

  const hasAssignedCA = !!user?.assignedCA;
  const assignedCAName = user?.assignedCA?.name || 'Your CA';

  const saveNowItems = useMemo(() => {
    const items = [];

    if (profile.user.gigWork) {
      const metric = getMetric('vehicle');
      items.push({
        key: 'vehicle',
        title: 'Vehicle',
        captured: 350,
        total: 1400,
        icon: 'car-outline',
        color: '#059669',
        tint: '#ECFDF5',
        border: '#A7F3D0',
        routeName: 'MileageTracker',
        hasThisMonth: metric.hasThisMonth,
        yearCount: metric.count,
        yearTotal: metric.total,
      });
    }

    if (profile.user.gigWork || profile.user.business) {
      const metric = getMetric('home-office');
      items.push({
        key: 'home-office',
        title: 'Home Office',
        captured: 150,
        total: 850,
        icon: 'home-outline',
        color: '#D97706',
        tint: '#FFFBEB',
        border: '#FCD34D',
        routeName: 'Receipts',
        hasThisMonth: metric.hasThisMonth,
        yearCount: metric.count,
        yearTotal: metric.total,
      });
    }

    if (profile.user.gigWork || profile.user.business) {
      const metric = {
        count: getMetric('phone').count + getMetric('internet').count,
        total: getMetric('phone').total + getMetric('internet').total,
        hasThisMonth: getMetric('phone').hasThisMonth || getMetric('internet').hasThisMonth,
      };

      items.push({
        key: 'phone-internet',
        title: 'Phone & Internet',
        captured: 120,
        total: 450,
        icon: 'wifi',
        color: '#2563EB',
        tint: '#EFF6FF',
        border: '#BFDBFE',
        routeName: 'Receipts',
        hasThisMonth: metric.hasThisMonth,
        yearCount: metric.count,
        yearTotal: metric.total,
      });
    }

    if (profile.user.gigWork || profile.user.business) {
      const metric = getMetric('supplies');
      items.push({
        key: 'supplies-fees',
        title: 'Supplies',
        captured: 250,
        total: 950,
        icon: 'receipt-text-outline',
        color: '#16A34A',
        tint: '#F0FDF4',
        border: '#BBF7D0',
        routeName: 'Receipts',
        hasThisMonth: metric.hasThisMonth,
        yearCount: metric.count,
        yearTotal: metric.total,
      });
    }

    if (profile.user.business) {
      const metric = getMetric('rent-utilities');
      items.push({
        key: 'rent-ops',
        title: 'Rent & Utils',
        captured: 350,
        total: 1200,
        icon: 'office-building-outline',
        color: '#4F46E5',
        tint: '#EEF2FF',
        border: '#C7D2FE',
        routeName: 'BusinessRentUtilities',
        hasThisMonth: metric.hasThisMonth,
        yearCount: metric.count,
        yearTotal: metric.total,
      });
    }

    if (profile.user.employment || profile.user.rrsp) {
      const metric = getMetric('rrsp');
      items.push({
        key: 'rrsp',
        title: 'RRSP',
        captured: profile.user.rrsp ? 600 : 0,
        total: 2000,
        icon: 'bank-outline',
        color: '#7C3AED',
        tint: '#F5F3FF',
        border: '#DDD6FE',
        routeName: 'UploadRRSPReceipt',
        hasThisMonth: metric.hasThisMonth,
        yearCount: metric.count,
        yearTotal: metric.total,
      });
    }

    return items
      .map((item) => ({
        ...item,
        remaining: Math.max(0, item.total - item.captured),
        progress: clamp((item.captured / item.total) * 100),
      }))
      .sort((a, b) => b.remaining - a.remaining);
  }, [profile, expenseMetrics]);

  const addMonthlyItems = useMemo(() => {
    const items = [];

    if (profile.user.gigWork) {
      const fuel = getMetric('fuel');
      items.push({
        key: 'fuel',
        title: 'Fuel',
        icon: 'gas-station-outline',
        iconBg: '#ECFDF5',
        iconColor: '#059669',
        routeName: 'Receipts',
        count: fuel.count,
        total: fuel.total,
      });

      const parking = getMetric('parking');
      items.push({
        key: 'parking',
        title: 'Parking',
        icon: 'parking',
        iconBg: '#FEF3C7',
        iconColor: '#B45309',
        routeName: 'Receipts',
        count: parking.count,
        total: parking.total,
      });
    }

    if (profile.user.gigWork || profile.user.business) {
      const phone = getMetric('phone');
      items.push({
        key: 'phone',
        title: 'Phone',
        icon: 'cellphone',
        iconBg: '#DBEAFE',
        iconColor: '#2563EB',
        routeName: 'Receipts',
        count: phone.count,
        total: phone.total,
      });

      const internet = getMetric('internet');
      items.push({
        key: 'internet',
        title: 'Internet',
        icon: 'wifi',
        iconBg: '#DBEAFE',
        iconColor: '#2563EB',
        routeName: 'Receipts',
        count: internet.count,
        total: internet.total,
      });

      const insurance = getMetric('insurance');
      items.push({
        key: 'insurance',
        title: 'Insurance',
        icon: 'shield-car-outline',
        iconBg: '#F3E8FF',
        iconColor: '#7C3AED',
        routeName: 'Receipts',
        count: insurance.count,
        total: insurance.total,
      });
    }

    if (profile.user.business) {
      const rent = getMetric('rent-utilities');
      items.push({
        key: 'rent-utilities',
        title: 'Rent / Utils',
        icon: 'home-city-outline',
        iconBg: '#EEF2FF',
        iconColor: '#4F46E5',
        routeName: 'BusinessRentUtilities',
        count: rent.count,
        total: rent.total,
      });

      const supplies = getMetric('supplies');
      items.push({
        key: 'supplies',
        title: 'Supplies',
        icon: 'shopping-outline',
        iconBg: '#F0FDF4',
        iconColor: '#16A34A',
        routeName: 'Receipts',
        count: supplies.count,
        total: supplies.total,
      });
    }

    return items;
  }, [profile, expenseMetrics]);

  const addLaterItems = useMemo(() => {
    const items = [];

    if (profile.user.employment) {
      items.push({
        key: 't4',
        title: 'T4',
        icon: 'briefcase-outline',
        iconBg: '#EFF6FF',
        iconColor: '#2563EB',
        routeName: 'UploadT4',
      });
    }

    if (profile.user.gigWork) {
      items.push({
        key: 't4a',
        title: 'T4A',
        icon: 'cash-multiple',
        iconBg: '#FEF3C7',
        iconColor: '#B45309',
        routeName: 'UploadT4A',
      });
    }

    items.push({
      key: 'rrsp',
      title: 'RRSP',
      icon: 'bank-outline',
      iconBg: '#F5F3FF',
      iconColor: '#7C3AED',
      routeName: 'UploadRRSPReceipt',
    });

    items.push({
      key: 'fhsa',
      title: 'FHSA',
      icon: 'home-plus-outline',
      iconBg: '#ECFEFF',
      iconColor: '#0F766E',
      routeName: 'UploadFHSA',
    });

    if (
      profile.user.donations ||
      profile.user.employment ||
      profile.user.gigWork ||
      profile.user.business
    ) {
      items.push({
        key: 'donations',
        title: 'Donations',
        icon: 'hand-heart-outline',
        iconBg: '#FFF1F2',
        iconColor: '#E11D48',
        routeName: 'UploadDonation',
      });
    }

    return items;
  }, [profile]);

  const taxIdeas = useMemo(() => {
    const items = [];

    if (!profile.user.rrsp && (profile.user.employment || profile.user.gigWork || profile.user.business)) {
      items.push({
        key: 'rrsp-idea',
        title: 'RRSP',
        icon: 'bank-outline',
        iconBg: '#F5F3FF',
        iconColor: '#7C3AED',
        tip: 'Turn on RRSP in your profile if you contribute. RRSP can reduce taxable income.',
        routeName: 'Profile',
      });
    }

    if (!profile.user.fhsa) {
      items.push({
        key: 'fhsa-idea',
        title: 'FHSA',
        icon: 'home-plus-outline',
        iconBg: '#ECFEFF',
        iconColor: '#0F766E',
        tip: 'Planning to buy your first home? FHSA can help lower taxes if applicable.',
        routeName: 'Profile',
      });
    }

    if (!profile.user.tfsa) {
      items.push({
        key: 'tfsa-idea',
        title: 'TFSA / Investments',
        icon: 'chart-line',
        iconBg: '#EFF6FF',
        iconColor: '#2563EB',
        tip: 'If you invest or save in TFSA, add it in profile so TaxVault can guide you better.',
        routeName: 'Profile',
      });
    }

    if (!profile.user.donations) {
      items.push({
        key: 'donation-idea',
        title: 'Donations',
        icon: 'hand-heart-outline',
        iconBg: '#FFF1F2',
        iconColor: '#E11D48',
        tip: 'If you make charity donations, enable it in profile to track possible credits.',
        routeName: 'Profile',
      });
    }

    return items;
  }, [profile]);

  const summaryRows = useMemo(() => {
    const rows = [];

    if (profile.user.rrsp || !profile.user.unemployed) {
      rows.push({
        label: 'RRSP',
        value: profile.user.rrsp ? 'Active' : 'Optional',
        icon: 'bank-outline',
        routeName: 'UploadRRSPReceipt',
      });
    }

    if (profile.user.fhsa || !profile.user.unemployed) {
      rows.push({
        label: 'FHSA',
        value: profile.user.fhsa ? 'Active' : 'Optional',
        icon: 'home-plus-outline',
        routeName: 'UploadFHSA',
      });
    }

    if (profile.user.donations || !profile.user.unemployed) {
      rows.push({
        label: 'Donations',
        value: profile.user.donations ? 'Active' : 'Optional',
        icon: 'hand-heart-outline',
        routeName: 'UploadDonation',
      });
    }

    if (profile.user.investments || profile.user.tfsa) {
      rows.push({
        label: 'Investments',
        value: 'Active',
        icon: 'chart-line',
        routeName: 'UploadT5',
      });
    }

    return rows.slice(0, 4);
  }, [profile]);

  const capturedSavings = useMemo(
    () => saveNowItems.reduce((sum, item) => sum + item.captured, 0),
    [saveNowItems]
  );

  const totalSavings = useMemo(
    () => saveNowItems.reduce((sum, item) => sum + item.total, 0),
    [saveNowItems]
  );

  const remainingSavings = Math.max(0, totalSavings - capturedSavings);
  const savingsPercent = totalSavings ? Math.round((capturedSavings / totalSavings) * 100) : 0;

  const taxHealthText = useMemo(() => {
    if (remainingSavings >= 3000) return 'High savings still open';
    if (remainingSavings >= 1500) return 'Good savings still open';
    if (remainingSavings > 0) return 'Some savings captured';
    return 'Good shape';
  }, [remainingSavings]);

  const caTitle = hasAssignedCA ? `Connected to ${assignedCAName}` : 'Find a Chartered Accountant';
  const caSubtitle = hasAssignedCA
    ? 'Message, review docs, or book time'
    : 'Compare pricing and availability';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.menuButton} onPress={openDrawer} activeOpacity={0.85}>
            <Icon name="menu" size={24} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.headerTextWrap}>
            <Text style={styles.greeting}>Welcome back, {firstName}!</Text>
          </View>

          <TouchableOpacity style={styles.bellButton} activeOpacity={0.85}>
            <Icon name="bell-outline" size={22} color="#0F172A" />
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.taxEngineBadge}>
              <Icon name="shield-check-outline" size={15} color="#15803D" />
              <Text style={styles.taxEngineBadgeText}>Tax Savings</Text>
            </View>

            <TouchableOpacity style={styles.heroQuickLink} onPress={() => navigateTo('Checklist')}>
              <Text style={styles.heroQuickLinkText}>Checklist</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.heroAmount}>Save up to {money(remainingSavings)}</Text>
          <Text style={styles.heroMiniText}>Add receipts now. Upload tax slips later.</Text>

          <MovingPills items={saveNowItems} onPress={navigateTo} />

          <View style={styles.heroActionRow}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleContinueUploads}
              activeOpacity={0.92}
            >
              <Icon name="camera-outline" size={18} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Start Saving</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.progressCardCompact}>
            <View style={styles.progressInlineTop}>
              <View>
                <Text style={styles.progressMiniLabel}>Progress</Text>
                <Text style={styles.progressMiniAmount}>{money(capturedSavings)}</Text>
              </View>

              <View style={styles.progressInlineRight}>
                <Text style={styles.progressMiniPercent}>{savingsPercent}%</Text>
                <Text style={styles.progressMiniLeft}>{compactMoney(remainingSavings)} left</Text>
              </View>
            </View>

            <View style={styles.progressTrackCompact}>
              <View style={[styles.progressFillCompact, { width: `${clamp(savingsPercent)}%` }]} />
            </View>

            <Text style={styles.progressCompactHint}>{taxHealthText}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.caCard, hasAssignedCA ? styles.caCardConnected : styles.caCardBrowse]}
          activeOpacity={0.95}
          onPress={() => navigateTo('CAHub')}
        >
          <View style={styles.caLeft}>
            <View style={[styles.caIconWrap, hasAssignedCA ? styles.caIconWrapConnected : null]}>
              <Icon
                name={hasAssignedCA ? 'account-check-outline' : 'account-search-outline'}
                size={22}
                color={hasAssignedCA ? '#15803D' : '#2563EB'}
              />
            </View>

            <View style={styles.caTextWrap}>
              <Text style={styles.caTitle}>{caTitle}</Text>
              <Text style={styles.caSubtitle}>{caSubtitle}</Text>
            </View>
          </View>

          <View style={styles.caRight}>
            <Text style={[styles.caLink, hasAssignedCA ? styles.caLinkConnected : null]}>
              {hasAssignedCA ? 'Open chat' : 'Browse'}
            </Text>
            <Icon name="chevron-right" size={20} color="#94A3B8" />
          </View>
        </TouchableOpacity>

        {taxIdeas.length > 0 && (
          <ExpandableSection
            title="Tax Ideas"
            subtitle="Turn these on in profile if they apply to you"
            accent="#7C3AED"
            bg="#FBF8FF"
            border="#E9D5FF"
            expanded={expandedSections.ideas}
            onToggle={() => toggleSection('ideas')}
            rightText={`${taxIdeas.length} ideas`}
          >
            <View style={styles.ideaGrid}>
              {taxIdeas.map((item) => (
                <IdeaCard
                  key={item.key}
                  title={item.title}
                  icon={item.icon}
                  iconBg={item.iconBg}
                  iconColor={item.iconColor}
                  tip={item.tip}
                  routeName={item.routeName}
                  navigation={navigation}
                />
              ))}
            </View>
          </ExpandableSection>
        )}

        <ExpandableSection
          title="Save Now"
          subtitle="Best deductions to work on now"
          accent="#16A34A"
          bg="#F8FFF9"
          border="#D1FAE5"
          expanded={expandedSections.saveNow}
          onToggle={() => toggleSection('saveNow')}
          rightText={`${saveNowItems.length} items`}
        >
          <View style={styles.compactGrid}>
            {saveNowItems.map((item) => (
              <CompactStatusCard
                key={item.key}
                title={item.title}
                icon={item.icon}
                iconBg={item.tint}
                iconColor={item.color}
                accent={item.border}
                value={`${compactMoney(item.remaining)} left`}
                status={item.hasThisMonth ? 'Added this month' : 'Not added'}
                statusTone={item.hasThisMonth ? 'good' : 'warn'}
                metaLeft={`${item.yearCount} receipts`}
                metaRight={compactMoney(item.yearTotal)}
                onPress={() => navigateTo(item.routeName)}
              />
            ))}
          </View>
        </ExpandableSection>

        <ExpandableSection
          title="Add Monthly"
          subtitle="Track these through the year"
          accent="#2563EB"
          bg="#F8FBFF"
          border="#DBEAFE"
          expanded={expandedSections.monthly}
          onToggle={() => toggleSection('monthly')}
          rightText={`${addMonthlyItems.length} items`}
        >
          <View style={styles.miniGrid}>
            {addMonthlyItems.map((item) => (
              <SimpleMiniCard
                key={item.key}
                title={item.title}
                icon={item.icon}
                iconBg={item.iconBg}
                iconColor={item.iconColor}
                value={`${item.count} receipts`}
                meta={compactMoney(item.total)}
                onPress={() => navigateTo(item.routeName)}
                accent="#BFDBFE"
              />
            ))}
          </View>
        </ExpandableSection>

        <ExpandableSection
          title="Add Later"
          subtitle="Upload when available"
          accent="#D97706"
          bg="#FFFBF5"
          border="#FDE68A"
          expanded={expandedSections.later}
          onToggle={() => toggleSection('later')}
          rightText={`${addLaterItems.length} items`}
        >
          <View style={styles.miniGrid}>
            {addLaterItems.map((item) => (
              <SimpleMiniCard
                key={item.key}
                title={item.title}
                icon={item.icon}
                iconBg={item.iconBg}
                iconColor={item.iconColor}
                value=""
                meta=""
                onPress={() => navigateTo(item.routeName)}
                accent="#FCD34D"
              />
            ))}
          </View>
        </ExpandableSection>

        <View style={[styles.sectionCard, { backgroundColor: '#FBF8FF', borderColor: '#E9D5FF' }]}>
          <View style={styles.summaryHeaderStatic}>
            <View style={[styles.sectionAccent, { backgroundColor: '#7C3AED' }]} />
            <Text style={styles.sectionTitle}>Tax Summary</Text>
            <Text style={styles.sectionSubtitle}>Your overall filing view</Text>
          </View>

          <View style={styles.summaryCard}>
            <TouchableOpacity
              style={styles.summaryRow}
              onPress={() => navigateTo('IncomeSummary')}
            >
              <View style={styles.summaryLeft}>
                <Icon name="chart-box-outline" size={18} color="#475569" />
                <Text style={styles.summaryLabel}>Income summary</Text>
              </View>
              <Text style={styles.summaryValue}>Open</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.summaryRow}
              onPress={() => navigateTo('DeductionSummary')}
            >
              <View style={styles.summaryLeft}>
                <Icon name="calculator-variant-outline" size={18} color="#475569" />
                <Text style={styles.summaryLabel}>Deduction summary</Text>
              </View>
              <Text style={styles.summaryValue}>Open</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.summaryRow}
              onPress={() => navigateTo('RefundEstimate')}
            >
              <View style={styles.summaryLeft}>
                <Icon name="cash-refund" size={18} color="#475569" />
                <Text style={styles.summaryLabel}>Refund estimate</Text>
              </View>
              <Text style={styles.summaryValue}>Needs data</Text>
            </TouchableOpacity>

            {summaryRows.length > 0 ? <View style={styles.summaryDivider} /> : null}

            {summaryRows.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.summaryRow}
                onPress={() => navigateTo(item.routeName)}
              >
                <View style={styles.summaryLeft}>
                  <Icon name={item.icon} size={18} color="#475569" />
                  <Text style={styles.summaryLabel}>{item.label}</Text>
                </View>
                <Text style={styles.summaryMutedValue}>{item.value}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.quickRow}>
          <TouchableOpacity
            style={styles.quickActionButton}
            activeOpacity={0.9}
            onPress={handleContinueUploads}
          >
            <Icon name="camera-outline" size={18} color="#2563EB" />
            <Text style={styles.quickActionButtonText}>Scan Receipt</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            activeOpacity={0.9}
            onPress={() => navigateTo('Documents')}
          >
            <Icon name="folder-outline" size={18} color="#2563EB" />
            <Text style={styles.quickActionButtonText}>Documents</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.bottomCta}
          activeOpacity={0.9}
          onPress={() => navigateTo('UploadChecklist')}
        >
          <Icon name="arrow-top-right" size={18} color="#FFFFFF" />
          <Text style={styles.bottomCtaText}>Continue to File Tax</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FC',
  },

  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6ECF8',
  },

  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6ECF8',
  },

  headerTextWrap: {
    flex: 1,
    marginHorizontal: 12,
    justifyContent: 'center',
  },

  greeting: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },

  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E6ECF8',
  },

  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  taxEngineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  taxEngineBadgeText: {
    color: '#15803D',
    fontSize: 11,
    fontWeight: '900',
    marginLeft: 6,
  },

  heroQuickLink: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#EFF6FF',
  },

  heroQuickLinkText: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '900',
  },

  heroAmount: {
    marginTop: 10,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    color: '#0F172A',
  },

  heroMiniText: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: '#64748B',
    fontWeight: '600',
  },

  movingPillsViewport: {
    marginTop: 12,
    height: 42,
    overflow: 'hidden',
  },

  movingPillsTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },

  heroPill: {
    minWidth: 120,
    maxWidth: 160,
    backgroundColor: '#F8FAFC',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E6ECF8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  heroPillLabel: {
    flex: 1,
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    marginRight: 8,
  },

  heroPillAmount: {
    fontSize: 11,
    fontWeight: '900',
    color: '#2563EB',
  },

  heroActionRow: {
    marginTop: 12,
  },

  primaryButton: {
    height: 48,
    backgroundColor: '#16A34A',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    marginLeft: 8,
  },

  progressCardCompact: {
    marginTop: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E6ECF8',
  },

  progressInlineTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  progressMiniLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },

  progressMiniAmount: {
    marginTop: 2,
    fontSize: 22,
    fontWeight: '900',
    color: '#15803D',
  },

  progressInlineRight: {
    alignItems: 'flex-end',
  },

  progressMiniPercent: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },

  progressMiniLeft: {
    marginTop: 2,
    fontSize: 12,
    color: '#15803D',
    fontWeight: '800',
  },

  progressTrackCompact: {
    height: 8,
    backgroundColor: '#DCFCE7',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 10,
  },

  progressFillCompact: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 999,
  },

  progressCompactHint: {
    marginTop: 8,
    fontSize: 12,
    color: '#166534',
    fontWeight: '700',
  },

  caCard: {
    borderRadius: 22,
    padding: 14,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
  },

  caCardBrowse: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E6ECF8',
  },

  caCardConnected: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },

  caLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  caIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  caIconWrapConnected: {
    backgroundColor: '#DCFCE7',
  },

  caTextWrap: {
    flex: 1,
  },

  caTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },

  caSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },

  caRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },

  caLink: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '800',
    marginRight: 4,
  },

  caLinkConnected: {
    color: '#15803D',
  },

  sectionCard: {
    borderRadius: 22,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
  },

  expandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  expandHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },

  expandRightText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '800',
    marginRight: 6,
  },

  expandContent: {
    marginTop: 12,
  },

  sectionAccent: {
    width: 38,
    height: 4,
    borderRadius: 999,
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },

  sectionSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },

  compactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  compactCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },

  compactCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  compactIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statusBadge: {
    maxWidth: 88,
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  statusBadgeGood: {
    backgroundColor: '#DCFCE7',
  },

  statusBadgeWarn: {
    backgroundColor: '#FEF3C7',
  },

  statusBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#475569',
    textAlign: 'center',
  },

  statusBadgeTextGood: {
    color: '#166534',
  },

  statusBadgeTextWarn: {
    color: '#92400E',
  },

  compactCardTitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },

  compactCardValue: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '900',
    color: '#2563EB',
  },

  compactCardMetaRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  compactCardMeta: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    maxWidth: '50%',
  },

  compactCardMetaStrong: {
    fontSize: 11,
    color: '#0F172A',
    fontWeight: '900',
    maxWidth: '46%',
  },

  miniGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  miniCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },

  miniCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  miniIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  miniCardTitle: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },

  miniCardValue: {
    marginTop: 5,
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '900',
  },

  miniCardMeta: {
    marginTop: 3,
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },

  ideaGrid: {
    gap: 10,
  },

  ideaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    padding: 12,
  },

  ideaCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ideaIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  ideaTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },

  ideaTip: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 18,
    color: '#475569',
    fontWeight: '600',
  },

  ideaFooter: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },

  ideaFooterText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#2563EB',
    marginRight: 6,
  },

  summaryHeaderStatic: {
    marginBottom: 12,
  },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },

  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },

  summaryLabel: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '700',
    marginLeft: 10,
  },

  summaryValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },

  summaryMutedValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#7C3AED',
  },

  summaryDivider: {
    height: 1,
    backgroundColor: '#E6ECF8',
    marginVertical: 4,
  },

  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  quickActionButton: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6ECF8',
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  quickActionButtonText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },

  bottomCta: {
    backgroundColor: '#2563EB',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    marginLeft: 8,
  },
});