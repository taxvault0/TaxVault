import React, { useMemo } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import UploadStatusPill from '@/features/uploads/components/UploadStatusPill';
import { evaluateUploadSectionStatus } from '@/features/uploads/utils/evaluateUploadSectionStatus';

const UploadSectionDetailScreen = ({ route }) => {
  const section = route?.params?.section;
  const householdProfile = route?.params?.householdProfile || {};
  const uploadedDocuments = route?.params?.uploadedDocuments || [];

  const evaluation = useMemo(
    () => evaluateUploadSectionStatus(section, uploadedDocuments, householdProfile),
    [section, uploadedDocuments, householdProfile]
  );

  const handleUpload = (requirement) => {
    Alert.alert(
      'Upload action',
      `Hook your file picker here for:\n${requirement.label}`
    );
  };

  if (!section) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>No section selected.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{section.title}</Text>
        <Text style={styles.subtitle}>{section.description}</Text>

        <View style={styles.summaryCard}>
          <UploadStatusPill status={evaluation.status} />
          <Text style={styles.summaryText}>
            {evaluation.completedRequired} of {evaluation.totalRequired} required items complete
          </Text>
        </View>

        {evaluation.requirementStates.map((requirement) => {
          const status = requirement.evaluation?.status;
          const uploadedCount = requirement.evaluation?.uploadedCount || 0;

          return (
            <View key={requirement.fullRequirementId} style={styles.requirementCard}>
              <View style={styles.requirementHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.requirementTitle}>{requirement.label}</Text>
                  <Text style={styles.requirementDescription}>
                    {requirement.description}
                  </Text>
                </View>
                <UploadStatusPill status={status} />
              </View>

              <Text style={styles.metaText}>
                Uploaded files: {uploadedCount}
              </Text>

              <View style={styles.actionRow}>
                <Pressable
                  style={styles.primaryButton}
                  onPress={() => handleUpload(requirement)}
                >
                  <Text style={styles.primaryButtonText}>
                    {uploadedCount > 0 ? 'Add more' : 'Upload'}
                  </Text>
                </Pressable>

                <Pressable style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>View files</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
  },
  summaryCard: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9ECF2',
    gap: 10,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  requirementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9ECF2',
  },
  requirementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  requirementTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  requirementDescription: {
    marginTop: 5,
    fontSize: 13,
    color: '#6B7280',
  },
  metaText: {
    marginTop: 12,
    fontSize: 13,
    color: '#374151',
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#111827',
    fontWeight: '800',
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
});

export default UploadSectionDetailScreen;


