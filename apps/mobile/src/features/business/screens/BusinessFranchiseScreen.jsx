import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const franchiseDocs = [
  'Franchise agreement / contract',
  'Initial franchise fee invoices',
  'Ongoing royalty fee statements',
  'Brand or licensing fee records',
  'Marketing contribution statements',
  'Franchise renewal and amendment documents',
];

const BusinessFranchiseScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroEyebrow}>Franchise Records</Text>
        <Text style={styles.title}>Franchise Fees & Agreements</Text>
        <Text style={styles.subtitle}>
          If your business operates under a franchise model, upload fee records, agreements, and royalty documents.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Documents to upload</Text>
        {franchiseDocs.map((item) => (
          <View key={item} style={styles.row}>
            <View style={styles.rowIcon}>
              <Icon name="file-certificate-outline" size={18} color="#D97706" />
            </View>
            <Text style={styles.rowText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.tipCard}>
        <Icon name="lightbulb-on-outline" size={20} color="#B45309" />
        <View style={styles.tipTextWrap}>
          <Text style={styles.tipTitle}>Tax review tip</Text>
          <Text style={styles.tipBody}>
            Separate one-time setup franchise costs from recurring royalty and advertising fees. They may be treated differently.
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9}>
        <Icon name="upload-outline" size={18} color="#FFFFFF" />
        <Text style={styles.primaryButtonText}>Upload Franchise Documents</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BusinessFranchiseScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 28 },
  hero: {
    backgroundColor: '#FEF3C7',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
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
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rowText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: '#334155',
    fontWeight: '600',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF7ED',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  tipTextWrap: {
    flex: 1,
    marginLeft: 10,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#9A3412',
  },
  tipBody: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: '#9A3412',
  },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#D97706',
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


