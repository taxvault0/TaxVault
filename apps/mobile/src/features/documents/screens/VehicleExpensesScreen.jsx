import React, {  useState  } from 'react';
import { useTheme } from '@/core/providers/ThemeContext';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import Header from '@/components/layout/AppHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';
import { useSingleDocumentPicker } from '@/hooks/useDocumentPicker';

const VehicleExpensesScreen = () => {
  const navigation = useNavigation();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    receipt: null,
  });

  const [expenses, setExpenses] = useState([
    {
      id: '1',
      category: 'fuel',
      amount: 65.43,
      date: '2024-03-15',
      description: 'Shell - 45L',
      businessPercentage: 70,
      deductible: 45.80,
      receipt: true,
      status: 'verified',
    },
    {
      id: '2',
      category: 'maintenance',
      amount: 234.50,
      date: '2024-03-10',
      description: 'Oil change and tire rotation',
      businessPercentage: 70,
      deductible: 164.15,
      receipt: true,
      status: 'pending',
    },
    {
      id: '3',
      category: 'insurance',
      amount: 185.75,
      date: '2024-03-01',
      description: 'Monthly insurance payment',
      businessPercentage: 70,
      deductible: 130.03,
      receipt: true,
      status: 'verified',
    },
    {
      id: '4',
      category: 'fuel',
      amount: 52.30,
      date: '2024-03-08',
      description: 'Petro-Canada - 35L',
      businessPercentage: 70,
      deductible: 36.61,
      receipt: false,
      status: 'missing',
    },
    {
      id: '5',
      category: 'parking',
      amount: 15.00,
      date: '2024-03-12',
      description: 'Airport parking',
      businessPercentage: 100,
      deductible: 15.00,
      receipt: true,
      status: 'verified',
    },
  ]);

  const [businessPercentage, setBusinessPercentage] = useState(70);
  const [filterCategory, setFilterCategory] = useState('all');

  const { pickDocument } = useSingleDocumentPicker({
    onSuccess: (file) => {
      console.log('Selected file:', file.name);
      Alert.alert('Success', 'Receipt uploaded successfully');
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to upload receipt');
    }
  });

  const uploadReceipt = (expenseId) => {
    pickDocument();
    // You can use expenseId to update the specific expense
    console.log('Uploading receipt for expense:', expenseId);
  };

  const categories = [
    { id: 'all', label: 'All', icon: 'view-grid' },
    { id: 'fuel', label: 'Fuel', icon: 'gas-station' },
    { id: 'maintenance', label: 'Maintenance', icon: 'wrench' },
    { id: 'insurance', label: 'Insurance', icon: 'shield' },
    { id: 'parking', label: 'Parking', icon: 'parking' },
    { id: 'tolls', label: 'Tolls', icon: 'road' },
    { id: 'lease', label: 'Lease', icon: 'car' },
    { id: 'financing', label: 'Financing', icon: 'bank' },
    { id: 'other', label: 'Other', icon: 'dots-horizontal' },
  ];

  const years = [2025, 2024, 2023, 2022];

  const getCategoryIcon = (category) => {
    const icons = {
      fuel: 'gas-station',
      maintenance: 'wrench',
      insurance: 'shield',
      parking: 'parking',
      tolls: 'road',
      lease: 'car',
      financing: 'bank',
      other: 'dots-horizontal',
    };
    return icons[category] || 'receipt';
  };

  const getCategoryColor = (category) => {
    const colors_map = {
      fuel: '#FF6B35',
      maintenance: '#ED6A5E',
      insurance: '#005A9C',
      parking: '#2E7D32',
      tolls: '#9C27B0',
      lease: '#FF9800',
      financing: '#795548',
      other: '#6C757D',
    };
    return colors_map[category] || colors.primary[500];
  };

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalDeductible = expenses.reduce((sum, e) => sum + e.deductible, 0);
  const verifiedExpenses = expenses.filter(e => e.status === 'verified').length;
  const pendingExpenses = expenses.filter(e => e.status === 'pending' || e.status === 'missing').length;

  const filteredExpenses = filterCategory === 'all' 
    ? expenses 
    : expenses.filter(e => e.category === filterCategory);

  const addExpense = () => {
    if (!newExpense.category || !newExpense.amount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const amount = parseFloat(newExpense.amount);
    const deductible = amount * (businessPercentage / 100);

    const expense = {
      id: Date.now().toString(),
      ...newExpense,
      amount,
      businessPercentage,
      deductible,
      receipt: false,
      status: 'missing',
    };

    setExpenses([expense, ...expenses]);
    setShowAddModal(false);
    setNewExpense({
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      receipt: null,
    });

    Alert.alert('Success', 'Expense added successfully');
  };

  const AddExpenseModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowAddModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Expense</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Icon name="close" size={24} color={colors.gray[400]} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Category Selection */}
            <Text style={styles.inputLabel}>
              Category <Text style={{ color: colors.warning }}>*</Text>
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              <View style={styles.categoryRow}>
                {categories.filter(c => c.id !== 'all').map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryItem,
                      newExpense.category === cat.id && styles.categoryItemSelected
                    ]}
                    onPress={() => setNewExpense({ ...newExpense, category: cat.id })}
                  >
                    <Icon 
                      name={cat.icon} 
                      size={24} 
                      color={newExpense.category === cat.id ? colors.primary[500] : colors.gray[400]} 
                    />
                    <Text style={[
                      styles.categoryText,
                      newExpense.category === cat.id && styles.categoryTextSelected
                    ]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Amount */}
            <Text style={styles.inputLabel}>
              Amount ($) <Text style={{ color: colors.warning }}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={newExpense.amount}
              onChangeText={(text) => setNewExpense({ ...newExpense, amount: text })}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={colors.gray[400]}
            />

            {/* Date */}
            <Text style={styles.inputLabel}>Date</Text>
            <TextInput
              style={styles.input}
              value={newExpense.date}
              onChangeText={(text) => setNewExpense({ ...newExpense, date: text })}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.gray[400]}
            />

            {/* Description */}
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newExpense.description}
              onChangeText={(text) => setNewExpense({ ...newExpense, description: text })}
              placeholder="Enter description"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              placeholderTextColor={colors.gray[400]}
            />

            {/* Business Use Info */}
            <Card style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Icon name="percent" size={20} color={colors.primary[500]} />
                <Text style={styles.infoText}>
                  Using your current business use percentage: {businessPercentage}%
                </Text>
              </View>
              <Text style={styles.infoSubtext}>
                Deductible amount will be calculated automatically
              </Text>
            </Card>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <Button
                variant="outline"
                onPress={() => setShowAddModal(false)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onPress={addExpense}
                style={styles.modalButton}
              >
                Add Expense
              </Button>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Vehicle Expenses" 
        showBack 
        rightIcon="plus"
        onRightPress={() => setShowAddModal(true)}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Year Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.yearSelector}
        >
          {years.map(year => (
            <TouchableOpacity
              key={year}
              style={[
                styles.yearChip,
                year === selectedYear && styles.yearChipSelected
              ]}
              onPress={() => setSelectedYear(year)}
            >
              <Text style={[
                styles.yearText,
                year === selectedYear && styles.yearTextSelected
              ]}>
                {year}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Business Use Banner */}
        <TouchableOpacity
          onPress={() => navigation.navigate('BusinessUseCalculator')}
          style={styles.banner}
        >
          <Icon name="calculator" size={24} color={colors.primary[500]} />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Business Use: {businessPercentage}%</Text>
            <Text style={styles.bannerSubtext}>Tap to recalculate</Text>
          </View>
          <Icon name="chevron-right" size={20} color={colors.gray[400]} />
        </TouchableOpacity>

        {/* Stats Summary */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Total</Text>
            <Text style={[styles.statValue, { color: colors.primary[500] }]}>
              ${totalExpenses.toFixed(2)}
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Deductible</Text>
            <Text style={[styles.statValue, { color: colors.success }]}>
              ${totalDeductible.toFixed(2)}
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Verified</Text>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {verifiedExpenses}
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Pending</Text>
            <Text style={[styles.statValue, { color: colors.warning }]}>
              {pendingExpenses}
            </Text>
          </Card>
        </View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <View style={styles.filterRow}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.filterChip,
                  filterCategory === cat.id && styles.filterChipSelected
                ]}
                onPress={() => setFilterCategory(cat.id)}
              >
                <Icon 
                  name={cat.icon} 
                  size={16} 
                  color={filterCategory === cat.id ? colors.white : colors.gray[600]} 
                />
                <Text style={[
                  styles.filterText,
                  filterCategory === cat.id && styles.filterTextSelected
                ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* CRA Info */}
        <Card style={styles.craCard}>
          <View style={styles.infoRow}>
            <Icon name="alert-circle" size={20} color={colors.warning} />
            <Text style={styles.craText}>
              Keep all receipts! CRA requires proof of expenses for 6 years.
            </Text>
          </View>
        </Card>

        {/* Expenses List */}
        {filteredExpenses.map(expense => (
          <Card key={expense.id} style={styles.expenseCard}>
            <View style={styles.expenseHeader}>
              <View style={styles.expenseLeft}>
                <View style={[styles.expenseIcon, { backgroundColor: getCategoryColor(expense.category) + '20' }]}>
                  <Icon 
                    name={getCategoryIcon(expense.category)} 
                    size={20} 
                    color={getCategoryColor(expense.category)} 
                  />
                </View>
                <View style={styles.expenseInfo}>
                  <View style={styles.expenseTitleRow}>
                    <Text style={styles.expenseDescription}>
                      {expense.description || categories.find(c => c.id === expense.category)?.label}
                    </Text>
                    <Badge status={expense.status} />
                  </View>
                  <Text style={styles.expenseDate}>{expense.date}</Text>
                </View>
              </View>
            </View>

            <View style={styles.expenseDetails}>
              <View>
                <Text style={styles.detailLabel}>Amount</Text>
                <Text style={styles.detailAmount}>${expense.amount.toFixed(2)}</Text>
              </View>

              <View>
                <Text style={styles.detailLabel}>Deductible ({expense.businessPercentage}%)</Text>
                <Text style={[styles.detailAmount, styles.deductibleAmount]}>
                  ${expense.deductible.toFixed(2)}
                </Text>
              </View>

              {!expense.receipt ? (
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => uploadReceipt(expense.id)}
                >
                  Add Receipt
                </Button>
              ) : (
                <TouchableOpacity>
                  <Icon name="eye" size={20} color={colors.primary[500]} />
                </TouchableOpacity>
              )}
            </View>
          </Card>
        ))}
      </ScrollView>

      <AddExpenseModal />
    </SafeAreaView>
  );
};

const styles = {
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
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
  },
  yearTextSelected: {
    color: colors.white,
  },
  banner: {
    backgroundColor: colors.primary[50],
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  bannerContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  bannerTitle: {
    ...typography.body2,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  bannerSubtext: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '22%',
    padding: spacing.sm,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.h5,
  },
  filterScroll: {
    marginBottom: spacing.lg,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
  },
  filterChipSelected: {
    backgroundColor: colors.primary[500],
  },
  filterText: {
    marginLeft: spacing.xs,
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  filterTextSelected: {
    color: colors.white,
  },
  craCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.warning + '20',
    padding: spacing.md,
  },
  craText: {
    ...typography.body2,
    color: colors.warning,
    marginLeft: spacing.sm,
    flex: 1,
  },
  expenseCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  expenseHeader: {
    marginBottom: spacing.sm,
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  expenseDescription: {
    ...typography.body2,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    flex: 1,
  },
  expenseDate: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  expenseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  detailAmount: {
    ...typography.body1,
    fontWeight: typography.weights.semibold,
  },
  deductibleAmount: {
    color: colors.success,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.h5,
    color: colors.text.primary,
  },
  inputLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  categoryScroll: {
    marginBottom: spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  categoryItem: {
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 70,
  },
  categoryItemSelected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
  },
  categoryText: {
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs,
    color: colors.gray[600],
  },
  categoryTextSelected: {
    color: colors.primary[500],
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
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
    ...typography.body2,
    marginLeft: spacing.sm,
    flex: 1,
    color: colors.text.primary,
  },
  infoSubtext: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  modalButton: {
    flex: 1,
  },
};

export default VehicleExpensesScreen;











