import React, { useMemo, useState } from 'react';
import { useTheme } from '@/core/providers/ThemeContext';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Header from '@/components/layout/AppHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { colors, spacing, typography, borderRadius } from '@/styles/theme';

const businessProfile = {
  businessName: 'NorthPeak Convenience Ltd.',
  taxYear: 2025,
  completion: 64,
  caAssigned: false,
  alerts: 5,
  missingCritical: 7,
  sections: [
    { key: 'sales', title: 'Sales Income', route: 'BusinessSalesIncome', icon: 'cash-register', progress: 80 },
    { key: 'expenses', title: 'Rent & Utilities', route: 'BusinessRentUtilities', icon: 'office-building-outline', progress: 65 },
    { key: 'payroll', title: 'Payroll', route: 'BusinessPayroll', icon: 'account-group-outline', progress: 58 },
    { key: 'franchise', title: 'Franchise', route: 'BusinessFranchise', icon: 'store-cog-outline', progress: 50 },
    { key: 'gst', title: 'GST / HST', route: 'BusinessGSTRecords', icon: 'percent-circle-outline', progress: 72 },
    { key: 'inventory', title: 'Inventory', route: 'BusinessInventory', icon: 'package-variant-closed', progress: 61 },
    { key: 'docs', title: 'Tax Documents', route: 'BusinessTaxDocuments', icon: 'file-document-multiple-outline', progress: 68 },
    { key: 'info', title: 'Business Info', route: 'BusinessInfo', icon: 'briefcase-account-outline', progress: 92 },
  ],
};

const stillRequired = [
  'Upload Q4 payroll summary and T4 preparation file',
  'Add franchise royalty statements for Nov–Dec',
  'Upload year-end closing inventory count',
  'Add commercial insurance renewal invoice',
  'Attach lease agreement and common area maintenance statement',
  'Upload GST/HST filing confirmation for final period',
  'Upload loan interest statement for equipment financing',
];

const quickActions = [
  { label: 'Upload tax docs', icon: 'cloud-upload-outline', route: 'BusinessTaxDocuments' },
  { label: 'Sales income', icon: 'cash-register', route: 'BusinessSalesIncome' },
  { label: 'Payroll', icon: 'account-group-outline', route: 'BusinessPayroll' },
  { label: 'GST/HST', icon: 'percent-circle-outline', route: 'BusinessGSTRecords' },
];

const BusinessDashboardScreen = () => {
  const navigation = useNavigation();

  const stats = useMemo(() => {
    const completed = businessProfile.sections.filter((s) => s.progress >= 80).length;
    const inReview = businessProfile.sections.filter((s) => s.progress >= 50 && s.progress < 80).length;
    const pending = businessProfile.sections.filter((s) => s.progress < 50).length;

    return { completed, inReview, pending };
  }, []);

  const goTo = (route) => {
    if (!route) return;
    navigation.navigate(route);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Business Dashboard" showBack={false} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Card style={styles.heroCard} gradient gradientColors={['#1E3A8A', '#2563EB', '#3B82F6']}>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatNumber}>{businessProfile.alerts}</Text>
              <Text style={styles.heroStatLabel}>Alerts</Text>
            </View>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatNumber}>{businessProfile.missingCritical}</Text>
              <Text style={styles.heroStatLabel}>Critical items</Text>
            </View>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatNumber}>{stats.completed}</Text>
              <Text style={styles.heroStatLabel}>Completed sections</Text>
            </View>
          </View>

        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F8FC',
  },

  content: {
    padding: spacing.lg,
    paddingBottom: 40,
  },

  heroCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.xl,
  },

  heroStatsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  heroStatBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: borderRadius.lg, // ✅ FIXED
    padding: spacing.md,
  },

  heroStatNumber: {
    color: colors.white,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },

  heroStatLabel: {
    color: '#DBEAFE',
    fontSize: typography.sizes.xs,
    marginTop: 4,
  },
});

export default BusinessDashboardScreen;
