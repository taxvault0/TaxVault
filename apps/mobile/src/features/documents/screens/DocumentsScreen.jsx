import React, {  useState  } from 'react';
import { useTheme } from '@/core/providers/ThemeContext';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,  // Only import StyleSheet once, here
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '@/components/layout/AppHeader';
import Card from '@/components/ui/Card';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';

const DocumentsScreen = ({ navigation }) => {
  const documentCategories = [
    {
      id: 'income',
      title: 'Income Documents',
      icon: 'cash',
      description: 'T4 slips, business income, rental income',
      count: 12,
      color: colors.success,
      screen: 'IncomeDocuments',
    },
    {
      id: 'expenses',
      title: 'Expense Documents',
      icon: 'receipt',
      description: 'Receipts, invoices, business expenses',
      count: 24,
      color: colors.warning,
      screen: 'ExpenseDocuments',
    },
    {
      id: 'vehicle',
      title: 'Vehicle Expenses',
      icon: 'car',
      description: 'Fuel, maintenance, insurance records',
      count: 8,
      color: colors.info,
      screen: 'VehicleExpenses',
    },
    {
      id: 'mileage',
      title: 'Mileage Logs',
      icon: 'map-marker-distance',
      description: 'Business trip logs and records',
      count: 15,
      color: colors.primary[500],
      screen: 'MileageLog',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Documents" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Document Categories</Text>
        
        {documentCategories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => navigation.navigate(cat.screen)}
          >
            <Card style={styles.categoryCard}>
              <View style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: cat.color + '20' }]}>
                  <Icon name={cat.icon} size={32} color={cat.color} />
                </View>
                <View style={styles.cardInfo}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{cat.title}</Text>
                    <View style={[styles.countBadge, { backgroundColor: cat.color }]}>
                      <Text style={styles.countText}>{cat.count}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardDescription}>{cat.description}</Text>
                </View>
                <Icon name="chevron-right" size={24} color={colors.gray[400]} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {/* CRA Info Card */}
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon name="information" size={24} color={colors.primary[500]} />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>CRA Document Requirements</Text>
              <Text style={styles.infoDescription}>
                Keep all tax-related documents for 6 years. CRA may request supporting documents for income, expenses, and deductions claimed.
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  categoryCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cardInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  cardTitle: {
    ...typography.body1,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  countBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    marginLeft: spacing.sm,
  },
  countText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: typography.weights.medium,
  },
  cardDescription: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  infoCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary[50],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  infoTitle: {
    ...typography.body2,
    fontWeight: typography.weights.semibold,
    color: colors.primary[700],
    marginBottom: spacing.xs,
  },
  infoDescription: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});

export default DocumentsScreen;











