import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import receiptCategories from '@/features/receipts/constants/receiptCategories';

const demoReceipts = [
  {
    id: 'r1',
    title: 'Shell Gas Station',
    category: 'fuel',
    amount: 74.82,
    date: '2026-03-21',
  },
  {
    id: 'r2',
    title: 'Canadian Tire Oil Change',
    category: 'maintenance',
    amount: 109.99,
    date: '2026-03-18',
  },
  {
    id: 'r3',
    title: 'Downtown Parking',
    category: 'parking',
    amount: 18.5,
    date: '2026-03-16',
  },
  {
    id: 'r4',
    title: 'Rogers Mobile Bill',
    category: 'mobile-internet',
    amount: 95.0,
    date: '2026-03-11',
  },
];

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

const ReceiptsScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');

  const filteredReceipts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return demoReceipts;

    return demoReceipts.filter((item) => {
      const category = receiptCategories.find((c) => c.key === item.category);

      return (
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        category?.label?.toLowerCase().includes(query)
      );
    });
  }, [search]);

  const totalAmount = useMemo(
    () => filteredReceipts.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [filteredReceipts]
  );

  const handleOpenCategory = (category) => {
    navigation.navigate('AddReceipt', { category });
  };

  const handleViewReceipt = (receipt) => {
    navigation.navigate('ReceiptDetail', { receiptId: receipt.id, receipt });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Receipts & Expense Uploads</Text>
            <Text style={styles.subtitle}>
              Track business, work, and gig receipts separately from tax slips.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddReceipt')}
          >
            <Icon name="plus" size={18} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.helperCard}>
          <Icon name="information-outline" size={22} color="#1D4ED8" />
          <View style={styles.helperContent}>
            <Text style={styles.helperTitle}>Receipts vs Documents</Text>
            <Text style={styles.helperText}>
              T4, T4A, RRSP, FHSA, and T5 belong in Documents. Fuel, meals,
              maintenance, mobile bills, and parking belong here.
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Receipts</Text>
            <Text style={styles.statValue}>{filteredReceipts.length}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Tracked Amount</Text>
            <Text style={styles.statValue}>{formatCurrency(totalAmount)}</Text>
          </View>
        </View>

        <View style={styles.searchBox}>
          <Icon name="magnify" size={20} color="#64748B" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search receipts"
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.sectionTitle}>Categories</Text>

          <View style={styles.categoryList}>
            {receiptCategories.map((category) => (
              <TouchableOpacity
                key={category.key}
                style={styles.categoryCard}
                onPress={() => handleOpenCategory(category)}
              >
                <View style={styles.categoryIconWrap}>
                  <Icon name={category.icon} size={24} color="#1D4ED8" />
                </View>

                <View style={styles.categoryTextWrap}>
                  <Text style={styles.categoryLabel}>{category.label}</Text>
                  <Text style={styles.categoryDescription}>
                    {category.description}
                  </Text>
                </View>

                <Icon name="chevron-right" size={22} color="#94A3B8" />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Recent Receipts</Text>

          {filteredReceipts.length === 0 ? (
            <View style={styles.emptyCard}>
              <Icon name="receipt-outline" size={34} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No receipts found</Text>
              <Text style={styles.emptyText}>
                Add your first receipt or try another search.
              </Text>
            </View>
          ) : (
            filteredReceipts.map((receipt) => {
              const category = receiptCategories.find((c) => c.key === receipt.category);

              return (
                <TouchableOpacity
                  key={receipt.id}
                  style={styles.receiptCard}
                  onPress={() => handleViewReceipt(receipt)}
                >
                  <View style={styles.receiptIconWrap}>
                    <Icon
                      name={category?.icon || 'receipt-outline'}
                      size={20}
                      color="#0F172A"
                    />
                  </View>

                  <View style={styles.receiptContent}>
                    <Text style={styles.receiptTitle}>{receipt.title}</Text>
                    <Text style={styles.receiptMeta}>
                      {category?.label || 'Other'} • {receipt.date}
                    </Text>
                  </View>

                  <Text style={styles.receiptAmount}>
                    {formatCurrency(receipt.amount)}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ReceiptsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: '#475569',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  helperCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  helperContent: {
    flex: 1,
  },
  helperTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  helperText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#1E40AF',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statLabel: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 48,
    marginLeft: 8,
    color: '#0F172A',
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  categoryList: {
    marginBottom: 24,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryTextWrap: {
    flex: 1,
  },
  categoryLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  categoryDescription: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptyText: {
    marginTop: 6,
    fontSize: 13,
    textAlign: 'center',
    color: '#64748B',
  },
  receiptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  receiptIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  receiptContent: {
    flex: 1,
  },
  receiptTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  receiptMeta: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
  },
  receiptAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginLeft: 12,
  },
});


