import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import UploadStatusPill from '@/features/uploads/components/UploadStatusPill';

const UploadSectionCard = ({ section, onPress }) => {
  const evaluation = section?.evaluation;
  const requirementStates = evaluation?.requirementStates || [];
  const previewItems = requirementStates.slice(0, 3);

  return (
    <Pressable style={styles.card} onPress={() => onPress?.(section)}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{section.title}</Text>
          <Text style={styles.description}>{section.description}</Text>
        </View>
        <UploadStatusPill status={evaluation?.status} />
      </View>

      <Text style={styles.progressText}>
        {evaluation?.completedRequired || 0} of {evaluation?.totalRequired || 0} required items complete
      </Text>

      <View style={styles.requirementsWrap}>
        {previewItems.map((item) => {
          const itemComplete =
            item.evaluation?.status === 'complete' ||
            item.evaluation?.status === 'not_applicable';

          return (
            <View key={item.fullRequirementId} style={styles.requirementRow}>
              <Icon
                name={itemComplete ? 'check-circle' : 'alert-circle-outline'}
                size={18}
                color={itemComplete ? '#16A34A' : '#D97706'}
              />
              <Text style={styles.requirementText}>{item.label}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>
          Missing: {evaluation?.missingRequired || 0}
        </Text>
        <View style={styles.ctaWrap}>
          <Text style={styles.ctaText}>Continue</Text>
          <Icon name="chevron-right" size={18} color="#111827" />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9ECF2',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  description: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  progressText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  requirementsWrap: {
    marginTop: 12,
    gap: 8,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requirementText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },
  footerRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B91C1C',
  },
  ctaWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
});

export default UploadSectionCard;


