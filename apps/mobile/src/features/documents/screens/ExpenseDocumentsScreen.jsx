import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '@/components/layout/AppHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';
import { useSingleDocumentPicker } from '@/hooks/useDocumentPicker';

const ExpenseDocumentsScreen = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [expenseCategories, setExpenseCategories] = useState([
    {
      id: '1',
      name: 'Office Supplies',
      icon: 'pen',
      total: 1250.75,
      documents: [
        { id: '1a', name: 'Staples Receipt March.pdf', date: '2024-03-15', amount: 234.50, status: 'verified' },
        { id: '1b', name: 'Amazon Office Order.pdf', date: '2024-03-10', amount: 567.25, status: 'verified' },
        { id: '1c', name: 'Office Depot Supplies.pdf', date: '2024-03-05', amount: 449.00, status: 'pending' },
      ],
    },
    {
      id: '2',
      name: 'Marketing & Advertising',
      icon: 'bullhorn',
      total: 3450.00,
      documents: [
        { id: '2a', name: 'Google Ads Invoice March.pdf', date: '2024-03-01', amount: 1200.00, status: 'verified' },
        { id: '2b', name: 'Facebook Ads Receipt.pdf', date: '2024-03-01', amount: 850.00, status: 'verified' },
        { id: '2c', name: 'Print Materials Invoice.pdf', date: '2024-02-28', amount: 1400.00, status: 'verified' },
      ],
    },
    {
      id: '3',
      name: 'Professional Fees',
      icon: 'account-tie',
      total: 2100.00,
      documents: [
        { id: '3a', name: 'Legal Consultation Invoice.pdf', date: '2024-03-12', amount: 600.00, status: 'verified' },
        { id: '3b', name: 'Accounting Services March.pdf', date: '2024-03-08', amount: 500.00, status: 'pending' },
        { id: '3c', name: 'Consulting Fees.pdf', date: '2024-03-01', amount: 1000.00, status: 'verified' },
      ],
    },
    {
      id: '4',
      name: 'Utilities',
      icon: 'flash',
      total: 845.30,
      documents: [
        { id: '4a', name: 'Hydro Bill March.pdf', date: '2024-03-14', amount: 245.50, status: 'verified' },
        { id: '4b', name: 'Internet Bill March.pdf', date: '2024-03-12', amount: 89.99, status: 'verified' },
        { id: '4c', name: 'Gas Bill March.pdf', date: '2024-03-10', amount: 345.81, status: 'pending' },
        { id: '4d', name: 'Water Bill March.pdf', date: '2024-03-05', amount: 164.00, status: 'missing' },
      ],
    },
    {
      id: '5',
      name: 'Insurance',
      icon: 'shield',
      total: 1250.00,
      documents: [
        { id: '5a', name: 'Business Insurance Policy.pdf', date: '2024-03-01', amount: 850.00, status: 'verified' },
        { id: '5b', name: 'Liability Insurance Receipt.pdf', date: '2024-03-01', amount: 400.00, status: 'pending' },
      ],
    },
  ]);

  const years = [2025, 2024, 2023, 2022];

  const { pickDocument } = useSingleDocumentPicker({
    onSuccess: (file) => {
      console.log('Selected file:', file.name);
      Alert.alert('Success', 'Document uploaded successfully');
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to pick document');
    }
  });

  const uploadDocument = (categoryId, docId) => {
    pickDocument();
    // Update document status
    setExpenseCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              documents: cat.documents.map(doc =>
                doc.id === docId ? { ...doc, status: 'verified' } : doc
              ),
            }
          : cat
      )
    );
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Office Supplies': 'pen',
      'Marketing & Advertising': 'bullhorn',
      'Professional Fees': 'account-tie',
      'Utilities': 'flash',
      'Insurance': 'shield',
    };
    return icons[category] || 'file-document';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return colors.success;
      case 'pending': return colors.warning;
      default: return colors.gray[400];
    }
  };

  const totalExpenses = expenseCategories.reduce((sum, cat) => sum + cat.total, 0);
  const verifiedCount = expenseCategories.reduce(
    (sum, cat) => sum + cat.documents.filter(d => d.status === 'verified').length, 0
  );
  const pendingCount = expenseCategories.reduce(
    (sum, cat) => sum + cat.documents.filter(d => d.status === 'pending').length, 0
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Expense Documents" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Year Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.yearSelector}>
          {years.map(year => (
            <TouchableOpacity
              key={year}
              style={[styles.yearChip, year === selectedYear && styles.yearChipSelected]}
              onPress={() => setSelectedYear(year)}
            >
              <Text style={[styles.yearText, year === selectedYear && styles.yearTextSelected]}>
                {year}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
            <Text style={[styles.summaryValue, { color: colors.primary[500] }]}>
              ${totalExpenses.toFixed(2)}
            </Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Verified</Text>
            <Text style={[styles.summaryValue, { color: colors.success }]}>{verifiedCount}</Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Pending</Text>
            <Text style={[styles.summaryValue, { color: colors.warning }]}>{pendingCount}</Text>
          </Card>
        </View>

        {/* CRA Info */}
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon name="information" size={20} color={colors.primary[500]} />
            <Text style={styles.infoText}>
              Keep all expense receipts for 6 years. CRA may request supporting documents for any expense claimed.
            </Text>
          </View>
        </Card>

        {/* Expense Categories */}
        {expenseCategories.map(category => (
          <Card key={category.id} style={styles.categoryCard}>
            <Card.Header>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryTitleRow}>
                  <Icon name={category.icon} size={20} color={colors.primary[500]} />
                  <Text style={styles.categoryTitle}>{category.name}</Text>
                </View>
                <Text style={styles.categoryTotal}>${category.total.toFixed(2)}</Text>
              </View>
            </Card.Header>
            <Card.Body>
              {category.documents.map(doc => (
                <View key={doc.id} style={styles.documentRow}>
                  <View style={styles.documentInfo}>
                    <Icon name="file-pdf" size={16} color={colors.gray[400]} />
                    <View style={styles.documentDetails}>
                      <Text style={styles.documentName}>{doc.name}</Text>
                      <Text style={styles.documentMeta}>
                        {doc.date} • ${doc.amount.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.documentActions}>
                    <Icon
                      name={doc.status === 'verified' ? 'check-circle' : 'clock-outline'}
                      size={20}
                      color={getStatusColor(doc.status)}
                    />
                    {doc.status !== 'verified' && (
                      <TouchableOpacity onPress={() => uploadDocument(category.id, doc.id)}>
                        <Text style={styles.uploadText}>Upload</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </Card.Body>
          </Card>
        ))}
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
  yearSelector: {
    marginBottom: spacing.lg,
  },
  yearChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  yearChipSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  yearText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  yearTextSelected: {
    color: colors.white,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  summaryCard: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    ...typography.h4,
  },
  infoCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primary[50],
    padding: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    ...typography.caption,
    color: colors.primary[700],
    marginLeft: spacing.sm,
    flex: 1,
  },
  categoryCard: {
    marginBottom: spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTitle: {
    ...typography.body2,
    fontWeight: typography.weights.semibold,
    marginLeft: spacing.sm,
    color: colors.text.primary,
  },
  categoryTotal: {
    ...typography.body2,
    fontWeight: typography.weights.semibold,
    color: colors.primary[500],
  },
  documentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentDetails: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  documentName: {
    ...typography.body2,
    color: colors.text.primary,
  },
  documentMeta: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  documentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  uploadText: {
    ...typography.caption,
    color: colors.primary[500],
  },
});

export default ExpenseDocumentsScreen;






