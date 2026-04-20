import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const inventoryDocs = [
  'Opening and closing inventory reports',
  'Purchase invoices for stock',
  'Inventory valuation records',
  'Damaged or obsolete inventory adjustments',
  'COGS support schedules',
  'Warehouse or stock movement summaries',
];

const BusinessInventoryScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>Stock & Cost Tracking</Text>
        <Text style={styles.title}>Inventory</Text>
        <Text style={styles.subtitle}>
          Manage inventory reports, stock purchase records, and cost-of-goods support for accurate business taxes.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Inventory records to upload</Text>
        {inventoryDocs.map((item) => (
          <View key={item} style={styles.itemRow}>
            <View style={styles.itemIcon}>
              <Icon name="archive-outline" size={18} color="#0891B2" />
            </View>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Why this matters</Text>
        {[
          'Supports cost of goods sold calculations',
          'Helps verify year-end stock values',
          'Reduces mismatches between purchases and revenue',
        ].map((item) => (
          <View key={item} style={styles.simpleRow}>
            <Icon name="check-circle-outline" size={18} color="#16A34A" />
            <Text style={styles.simpleText}>{item}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9}>
        <Icon name="upload-outline" size={18} color="#FFFFFF" />
        <Text style={styles.primaryButtonText}>Upload Inventory Records</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BusinessInventoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 28 },
  heroCard: {
    backgroundColor: '#CFFAFE',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#A5F3FC',
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0E7490',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    color: '#334155',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#ECFEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: '#334155',
    fontWeight: '600',
  },
  simpleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  simpleText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
  },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#0891B2',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});


