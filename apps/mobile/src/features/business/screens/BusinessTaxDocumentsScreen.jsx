import React, { useMemo, useState } from 'react';
import { useTheme } from '@/core/providers/ThemeContext';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Header from '@/components/layout/AppHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from '@/styles/theme';
import { useSingleDocumentPicker } from '@/hooks/useDocumentPicker';
import {
  BUSINESS_FILING_NOTES,
  BUSINESS_TAX_DOCUMENT_SECTIONS,
} from '@/features/business/config/businessTaxDocumentsConfig';

const STATUS_META = {
  required: {
    label: 'Required',
    bg: '#FFF7ED',
    text: '#C2410C',
    icon: 'alert-circle-outline',
  },
  optional: {
    label: 'Optional',
    bg: '#EFF6FF',
    text: '#1D4ED8',
    icon: 'information-outline',
  },
  uploaded: {
    label: 'Uploaded',
    bg: '#ECFDF5',
    text: '#047857',
    icon: 'check-circle-outline',
  },
};

const buildInitialUploads = () => {
  const map = {};

  BUSINESS_TAX_DOCUMENT_SECTIONS.forEach((section) => {
    section.items.forEach((item) => {
      map[item.id] = item.status === 'uploaded' ? 'uploaded' : item.status;
    });
  });

  return map;
};

const ShopBusinessTaxDocumentsScreen = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedSections, setExpandedSections] = useState(
    BUSINESS_TAX_DOCUMENT_SECTIONS.reduce((acc, section, index) => {
      acc[section.id] = index < 3;
      return acc;
    }, {})
  );
  const [documentStates, setDocumentStates] = useState(buildInitialUploads());

  const { pickDocument } = useSingleDocumentPicker({
    onSuccess: (file) => {
      if (file?.name) {
        Alert.alert('Uploaded', `${file.name} added successfully.`);
      } else {
        Alert.alert('Uploaded', 'Document added successfully.');
      }
    },
    onError: () => {
      Alert.alert('Upload failed', 'Unable to pick the document right now.');
    },
  });

  const totals = useMemo(() => {
    const allItems = BUSINESS_TAX_DOCUMENT_SECTIONS.flatMap((section) => section.items);

    const requiredCount = allItems.filter((item) => item.required).length;
    const optionalCount = allItems.filter((item) => !item.required).length;
    const uploadedCount = allItems.filter(
      (item) => documentStates[item.id] === 'uploaded'
    ).length;
    const remainingRequired = allItems.filter(
      (item) => item.required && documentStates[item.id] !== 'uploaded'
    ).length;

    const completion = requiredCount
      ? Math.round(((requiredCount - remainingRequired) / requiredCount) * 100)
      : 0;

    return {
      total: allItems.length,
      requiredCount,
      optionalCount,
      uploadedCount,
      remainingRequired,
      completion,
    };
  }, [documentStates]);

  const filteredSections = useMemo(() => {
    return BUSINESS_TAX_DOCUMENT_SECTIONS.map((section) => {
      let filteredItems = section.items;

      if (activeFilter === 'required') {
        filteredItems = section.items.filter((item) => item.required);
      } else if (activeFilter === 'missing') {
        filteredItems = section.items.filter(
          (item) => item.required && documentStates[item.id] !== 'uploaded'
        );
      } else if (activeFilter === 'uploaded') {
        filteredItems = section.items.filter(
          (item) => documentStates[item.id] === 'uploaded'
        );
      }

      return {
        ...section,
        items: filteredItems.map((item) => ({
          ...item,
          liveStatus: documentStates[item.id],
        })),
      };
    }).filter((section) => section.items.length > 0);
  }, [activeFilter, documentStates]);

  const handleUpload = async (item) => {
    try {
      await pickDocument();
      setDocumentStates((prev) => ({
        ...prev,
        [item.id]: 'uploaded',
      }));
    } catch (error) {
      console.log('Upload error', error);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const renderChip = (label, selected, onPress) => (
    <TouchableOpacity
      key={label}
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.filterChip, selected && styles.filterChipActive]}
    >
      <Text style={[styles.filterChipText, selected && styles.filterChipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Business Tax Documents"
        showBack
        showProfile={false}
        rightIcon="help-circle-outline"
        onRightPress={() =>
          Alert.alert(
            'How this works',
            'Upload the business records your accountant needs to prepare the return. Most supporting records are kept on file and shared if CRA requests them later.'
          )
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroBadge}>
              <Icon name="storefront-outline" size={16} color={colors.primary[600]} />
              <Text style={styles.heroBadgeText}>Business owner workflow</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.heroAction}
              onPress={() => Alert.alert('Coming soon', 'Year selector can be added next.')}
            >
              <Icon name="calendar-month-outline" size={18} color={colors.text.secondary} />
              <Text style={styles.heroActionText}>2025</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.heroTitle}>What your business should upload</Text>
          <Text style={styles.heroSubtitle}>
            Organized into sales, expenses, payroll, GST/HST, franchise, lease,
            insurance, inventory, and capital assets.
          </Text>

          <View style={styles.progressWrap}>
            <View style={styles.progressMetaRow}>
              <Text style={styles.progressLabel}>Required documents completed</Text>
              <Text style={styles.progressValue}>{totals.completion}%</Text>
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${totals.completion}%` }]} />
            </View>

            <View style={styles.metricGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricNumber}>{totals.requiredCount}</Text>
                <Text style={styles.metricLabel}>Required</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricNumber}>{totals.uploadedCount}</Text>
                <Text style={styles.metricLabel}>Uploaded</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricNumber}>{totals.remainingRequired}</Text>
                <Text style={styles.metricLabel}>Still needed</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricNumber}>{totals.optionalCount}</Text>
                <Text style={styles.metricLabel}>Optional</Text>
              </View>
            </View>

            <View style={styles.heroButtonsRow}>
              <Button
                style={styles.primaryButton}
                onPress={() => setActiveFilter('missing')}
              >
                Upload missing first
              </Button>

              <Button
                variant="outline"
                style={styles.secondaryButton}
                onPress={() =>
                  Alert.alert(
                    'Find a CA',
                    'This can later open a CA matching flow for business owners.'
                  )
                }
              >
                Find a CA
              </Button>
            </View>
          </View>
        </Card>

        <Card style={styles.noteCard}>
          <View style={styles.noteHeader}>
            <Icon name="file-document-check-outline" size={20} color={colors.primary[500]} />
            <Text style={styles.noteTitle}>Filing notes</Text>
          </View>

          {BUSINESS_FILING_NOTES.map((note) => (
            <View key={note} style={styles.noteRow}>
              <Icon name="check-circle-outline" size={16} color={colors.success} />
              <Text style={styles.noteText}>{note}</Text>
            </View>
          ))}
        </Card>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {renderChip('All', activeFilter === 'all', () => setActiveFilter('all'))}
          {renderChip('Required', activeFilter === 'required', () => setActiveFilter('required'))}
          {renderChip('Missing', activeFilter === 'missing', () => setActiveFilter('missing'))}
          {renderChip('Uploaded', activeFilter === 'uploaded', () => setActiveFilter('uploaded'))}
        </ScrollView>

        {filteredSections.map((section) => {
          const isExpanded = expandedSections[section.id];

          return (
            <Card key={section.id} style={styles.sectionCard}>
              <TouchableOpacity
                activeOpacity={0.86}
                style={styles.sectionHeader}
                onPress={() => toggleSection(section.id)}
              >
                <View style={styles.sectionHeaderLeft}>
                  <View
                    style={[
                      styles.sectionIconWrap,
                      { backgroundColor: `${section.accent}15` },
                    ]}
                  >
                    <Icon name={section.icon} size={22} color={section.accent} />
                  </View>

                  <View style={styles.sectionHeaderTextWrap}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    <Text style={styles.sectionDescription}>{section.description}</Text>
                  </View>
                </View>

                <View style={styles.sectionHeaderRight}>
                  <Text style={styles.sectionCount}>{section.items.length}</Text>
                  <Icon
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={22}
                    color={colors.text.secondary}
                  />
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.itemsWrap}>
                  {section.items.map((item, index) => {
                    const currentStatus = item.liveStatus || item.status;
                    const meta = STATUS_META[currentStatus] || STATUS_META.required;

                    return (
                      <View
                        key={item.id}
                        style={[
                          styles.itemRow,
                          index !== section.items.length - 1 && styles.itemRowBorder,
                        ]}
                      >
                        <View style={styles.itemMain}>
                          <Text style={styles.itemName}>{item.name}</Text>
                          <Text style={styles.itemHelp}>{item.helpText}</Text>

                          <View style={[styles.statusPill, { backgroundColor: meta.bg }]}>
                            <Icon name={meta.icon} size={14} color={meta.text} />
                            <Text style={[styles.statusPillText, { color: meta.text }]}>
                              {meta.label}
                            </Text>
                          </View>
                        </View>

                        {currentStatus === 'uploaded' ? (
                          <View style={styles.uploadedBadge}>
                            <Icon name="check-bold" size={14} color={colors.success} />
                            <Text style={styles.uploadedBadgeText}>Done</Text>
                          </View>
                        ) : (
                          <TouchableOpacity
                            activeOpacity={0.86}
                            style={styles.uploadButton}
                            onPress={() => handleUpload(item)}
                          >
                            <Icon name="cloud-upload-outline" size={18} color={colors.primary[500]} />
                            <Text style={styles.uploadButtonText}>Upload</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </Card>
          );
        })}

        <Card style={styles.bottomCard}>
          <View style={styles.bottomHeader}>
            <Icon name="archive-outline" size={20} color={colors.warning} />
            <Text style={styles.bottomTitle}>Keep these organized by year</Text>
          </View>

          <Text style={styles.bottomText}>
            Store documents by tax year and by section so your CA can review them faster:
            Business Setup, Sales, Expenses, Payroll, GST/HST, Inventory, Insurance,
            Franchise, Lease, Assets, and Banking.
          </Text>

          <Button
            style={{ marginTop: spacing.md }}
            onPress={() =>
              Alert.alert(
                'Next step',
                'You can connect this button to your upload flow or document categories screen.'
              )
            }
          >
            Continue to upload flow
          </Button>
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
    paddingBottom: spacing.xxl || 40,
  },
  heroCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.xl || 24,
    backgroundColor: colors.white,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF4FF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  heroBadgeText: {
    fontSize: typography.sizes?.xs || 12,
    color: colors.primary[600],
    fontWeight: typography.weights?.semibold || '600',
  },
  heroAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  heroActionText: {
    fontSize: typography.sizes?.sm || 14,
    color: colors.text.secondary,
    fontWeight: typography.weights?.medium || '500',
  },
  heroTitle: {
    fontSize: typography.sizes?.xl || 24,
    fontWeight: typography.weights?.bold || '700',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    fontSize: typography.sizes?.sm || 14,
    lineHeight: 22,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  progressWrap: {
    marginTop: spacing.sm,
  },
  progressMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    fontSize: typography.sizes?.sm || 14,
    color: colors.text.secondary,
  },
  progressValue: {
    fontSize: typography.sizes?.sm || 14,
    color: colors.primary[600],
    fontWeight: typography.weights?.bold || '700',
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#E6ECF5',
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.primary[500],
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.lg || 18,
    padding: spacing.md,
  },
  metricNumber: {
    fontSize: typography.sizes?.xl || 22,
    fontWeight: typography.weights?.bold || '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: typography.sizes?.xs || 12,
    color: colors.text.secondary,
  },
  heroButtonsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  primaryButton: {
    flex: 1,
  },
  secondaryButton: {
    flex: 1,
  },
  noteCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.xl || 24,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.md,
  },
  noteTitle: {
    fontSize: typography.sizes?.base || 16,
    fontWeight: typography.weights?.semibold || '600',
    color: colors.text.primary,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: spacing.sm,
  },
  noteText: {
    flex: 1,
    fontSize: typography.sizes?.sm || 14,
    lineHeight: 21,
    color: colors.text.secondary,
  },
  filterRow: {
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#EDF2F7',
  },
  filterChipActive: {
    backgroundColor: colors.primary[500],
  },
  filterChipText: {
    fontSize: typography.sizes?.sm || 14,
    color: colors.text.secondary,
    fontWeight: typography.weights?.medium || '500',
  },
  filterChipTextActive: {
    color: colors.white,
  },
  sectionCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.xl || 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  sectionHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
  },
  sectionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderTextWrap: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: typography.sizes?.lg || 18,
    fontWeight: typography.weights?.semibold || '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: typography.sizes?.sm || 14,
    lineHeight: 21,
    color: colors.text.secondary,
  },
  sectionHeaderRight: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  sectionCount: {
    fontSize: typography.sizes?.base || 16,
    color: colors.text.primary,
    fontWeight: typography.weights?.bold || '700',
  },
  itemsWrap: {
    marginTop: spacing.lg,
  },
  itemRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  itemRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
  },
  itemMain: {
    flex: 1,
  },
  itemName: {
    fontSize: typography.sizes?.base || 16,
    color: colors.text.primary,
    fontWeight: typography.weights?.semibold || '600',
    marginBottom: 4,
  },
  itemHelp: {
    fontSize: typography.sizes?.sm || 14,
    lineHeight: 20,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  statusPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusPillText: {
    fontSize: typography.sizes?.xs || 12,
    fontWeight: typography.weights?.semibold || '600',
  },
  uploadButton: {
    minWidth: 92,
    borderWidth: 1,
    borderColor: '#D8E2F0',
    backgroundColor: '#F8FBFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  uploadButtonText: {
    fontSize: typography.sizes?.xs || 12,
    color: colors.primary[500],
    fontWeight: typography.weights?.semibold || '600',
  },
  uploadedBadge: {
    minWidth: 76,
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  uploadedBadgeText: {
    fontSize: typography.sizes?.xs || 12,
    color: colors.success,
    fontWeight: typography.weights?.semibold || '600',
  },
  bottomCard: {
    marginTop: spacing.sm,
    borderRadius: borderRadius.xl || 24,
    marginBottom: spacing.xl,
  },
  bottomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.sm,
  },
  bottomTitle: {
    fontSize: typography.sizes?.base || 16,
    color: colors.text.primary,
    fontWeight: typography.weights?.semibold || '600',
  },
  bottomText: {
    fontSize: typography.sizes?.sm || 14,
    lineHeight: 21,
    color: colors.text.secondary,
  },
});

export default ShopBusinessTaxDocumentsScreen;








