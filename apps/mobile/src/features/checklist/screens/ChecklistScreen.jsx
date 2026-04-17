import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const handleChecklistNavigation = (itemKey, navigation) => {
  switch (itemKey) {
    case 't4':
      navigation.navigate('UploadT4');
      break;

    case 't4a':
    case 'gig-income':
      navigation.navigate('UploadT4A');
      break;

    case 't5':
      navigation.navigate('UploadT5');
      break;

    case 'receipts':
      navigation.navigate('Receipts');
      break;

    case 'mileage':
      navigation.navigate('MileageTracker');
      break;

    case 'income-documents':
      navigation.navigate('IncomeDocuments');
      break;

    case 'vehicle-expenses':
      navigation.navigate('VehicleExpenses');
      break;

    case 'rrsp':
      navigation.navigate('UploadRRSPReceipt');
      break;
      
    case 'fhsa':
      navigation.navigate('UploadFHSA');
      break;

    case 'income-summary':
      navigation.navigate('IncomeSummary');
      break;

    default:
      break;
  }
};

const checklistItems = [
  {
    key: 't4',
    title: 'Upload T4',
    description: 'Employment income slips from your employer.',
    icon: 'file-document-outline',
    status: 'ready',
  },
  {
    key: 't4a',
    title: 'Upload T4A',
    description: 'Gig work, freelance, or contract income slips.',
    icon: 'briefcase-outline',
    status: 'ready',
  },
  {
    key: 't5',
    title: 'Upload T5',
    description: 'Add investment income slips such as bank or brokerage T5 slips.',
    icon: 'chart-line',
    status: 'ready',
  },
  {
    key: 'receipts',
    title: 'Receipts & Expenses',
    description: 'Track fuel, meals, parking, mobile, and other expenses.',
    icon: 'receipt-outline',
    status: 'ready',
  },
  {
    key: 'mileage',
    title: 'Track Mileage',
    description: 'Record work and gig driving trips.',
    icon: 'map-marker-distance',
    status: 'ready',
  },
  {
    key: 'income-documents',
    title: 'Income Documents',
    description: 'Review all uploaded income-related documents.',
    icon: 'folder-outline',
    status: 'ready',
  },
  {
    key: 'vehicle-expenses',
    title: 'Vehicle Expenses',
    description: 'Manage vehicle-related supporting records.',
    icon: 'car-outline',
    status: 'ready',
  },
  {
    key: 'rrsp',
    title: 'Upload RRSP Receipt',
    description: 'Add RRSP contribution documents.',
    icon: 'bank-outline',
    status: 'pending',
  },
  {
  key: 'fhsa',
  title: 'Upload FHSA Document',
  description: 'Add FHSA contribution records for deduction tracking.',
  icon: 'home-plus-outline',
  status: 'ready',
},
{
  key: 'income-summary',
  title: 'Review Income Summary',
  description: 'Check your combined income overview before filing.',
  icon: 'chart-box-outline',
  status: 'ready',
},
];

const ChecklistScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.headerCard}>
          <Text style={styles.title}>Tax Checklist</Text>
          <Text style={styles.subtitle}>
            Tap an item to open the correct workflow screen.
          </Text>
        </View>

        {checklistItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.itemCard}
            activeOpacity={0.85}
            onPress={() => handleChecklistNavigation(item.key, navigation)}
          >
            <View style={styles.itemLeft}>
              <View style={styles.iconWrap}>
                <Icon name={item.icon} size={22} color="#1D4ED8" />
              </View>

              <View style={styles.textWrap}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <View
                    style={[
                      styles.badge,
                      item.status === 'ready' ? styles.badgeReady : styles.badgePending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        item.status === 'ready'
                          ? styles.badgeTextReady
                          : styles.badgeTextPending,
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
            </View>

            <Icon name="chevron-right" size={22} color="#94A3B8" />
          </TouchableOpacity>
        ))}
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
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
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
  itemCard: {
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
  itemLeft: {
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
  itemHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    gap: 8,
  },
  itemTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  itemDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: '#64748B',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeReady: {
    backgroundColor: '#ECFDF5',
  },
  badgePending: {
    backgroundColor: '#FEF3C7',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  badgeTextReady: {
    color: '#059669',
  },
  badgeTextPending: {
    color: '#B45309',
  },
});

export default ChecklistScreen;


