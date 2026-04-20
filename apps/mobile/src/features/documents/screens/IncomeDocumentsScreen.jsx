import React, {  useState  } from 'react';
import { useTheme } from '@/core/providers/ThemeContext';
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
import { useNavigation } from '@react-navigation/native';
import Header from '@/components/layout/AppHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';
import { useSingleDocumentPicker } from '@/hooks/useDocumentPicker';
const IncomeDocumentsScreen = () => {
  const navigation = useNavigation();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [documents, setDocuments] = useState([
    {
      id: '1',
      name: 'T4 Slip 2024.pdf',
      type: 'T4',
      date: '2024-03-15',
      size: '245 KB',
      status: 'verified',
    },
    {
      id: '2',
      name: 'Business Income Statement Q1.pdf',
      type: 'Business Income',
      date: '2024-03-10',
      size: '512 KB',
      status: 'pending',
    },
    {
      id: '3',
      name: 'Rental Income Receipts.pdf',
      type: 'Rental Income',
      date: '2024-03-05',
      size: '1.2 MB',
      status: 'verified',
    },
    {
      id: '4',
      name: 'Investment Statement.pdf',
      type: 'Investment',
      date: '2024-03-01',
      size: '890 KB',
      status: 'verified',
    },
  ]);

  const { pickDocument } = useSingleDocumentPicker({
    onSuccess: (file) => {
      console.log('Selected file:', file.name);
      Alert.alert('Success', 'Document uploaded successfully');
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to pick document');
    }
  });

  const uploadDocument = pickDocument;

  const years = [2025, 2024, 2023, 2022];
  const documentTypes = ['T4', 'T4A', 'Business Income', 'Rental Income', 'Investment', 'Other'];

  const getTypeIcon = (type) => {
    const icons = {
      'T4': 'file-account',
      'T4A': 'file-account',
      'Business Income': 'store',
      'Rental Income': 'home',
      'Investment': 'chart-line',
      'Other': 'file-document',
    };
    return icons[type] || 'file-document';
  };

  const getTypeColor = (type) => {
    const colors_map = {
      'T4': '#005A9C',
      'T4A': '#005A9C',
      'Business Income': '#2E7D32',
      'Rental Income': '#FF6B35',
      'Investment': '#9C27B0',
      'Other': '#6C757D',
    };
    return colors_map[type] || colors.primary[500];
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Income Documents" 
        showBack 
        rightIcon="plus"
        onRightPress={uploadDocument}
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

        {/* Document Type Quick Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          <View style={styles.filterRow}>
            {documentTypes.map(type => (
              <TouchableOpacity
                key={type}
                style={styles.filterChip}
                onPress={() => {
                  // Filter by type
                }}
              >
                <Icon name={getTypeIcon(type)} size={16} color={getTypeColor(type)} />
                <Text style={styles.filterText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Stats Summary */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Total Documents</Text>
            <Text style={[styles.statValue, { color: colors.primary[500] }]}>
              {documents.length}
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Verified</Text>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {documents.filter(d => d.status === 'verified').length}
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Pending</Text>
            <Text style={[styles.statValue, { color: colors.warning }]}>
              {documents.filter(d => d.status === 'pending').length}
            </Text>
          </Card>
        </View>

        {/* CRA Info Card */}
        <Card style={styles.craCard}>
          <View style={styles.infoRow}>
            <Icon name="information" size={20} color={colors.primary[500]} />
            <Text style={styles.craText}>
              CRA accepts PDF, JPEG, PNG files. Keep digital copies for 6 years.
            </Text>
          </View>
        </Card>

        {/* Documents List */}
        <Text style={styles.sectionTitle}>Your Documents</Text>
        
        {documents.map(doc => (
          <TouchableOpacity
            key={doc.id}
            style={styles.documentCard}
            onPress={() => Alert.alert('View Document', 'Document viewer coming soon')}
          >
            <View style={styles.documentLeft}>
              <View style={[styles.documentIcon, { backgroundColor: getTypeColor(doc.type) + '20' }]}>
                <Icon name={getTypeIcon(doc.type)} size={24} color={getTypeColor(doc.type)} />
              </View>
              <View style={styles.documentInfo}>
                <View style={styles.documentHeader}>
                  <Text style={styles.documentName}>{doc.name}</Text>
                  <Badge status={doc.status} />
                </View>
                <View style={styles.documentMeta}>
                  <Text style={styles.documentType}>{doc.type}</Text>
                  <Text style={styles.documentDate}>{doc.date}</Text>
                  <Text style={styles.documentSize}>{doc.size}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Upload Button */}
        <Button
          title="Upload New Document"
          onPress={uploadDocument}
          style={styles.uploadButton}
        />
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
    marginBottom: spacing.md,
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
    marginRight: spacing.sm,
  },
  filterText: {
    marginLeft: spacing.xs,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.h4,
  },
  craCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primary[50],
    padding: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  craText: {
    ...typography.body2,
    color: colors.primary[700],
    marginLeft: spacing.sm,
    flex: 1,
  },
  sectionTitle: {
    ...typography.h6,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  documentCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  documentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  documentInfo: {
    flex: 1,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  documentName: {
    ...typography.body,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing.sm,
  },
  documentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  documentType: {
    ...typography.caption,
    color: colors.primary[500],
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  documentDate: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  documentSize: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  uploadButton: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
});

export default IncomeDocumentsScreen;
















