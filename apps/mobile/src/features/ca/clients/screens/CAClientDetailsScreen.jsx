import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import caClientService from '@/services/caClientService';
import { mapCAClientDetails } from '../utils/caClientMapper';
import styles from '../styles/CAClientDetailsScreen.styles';

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || '—'}</Text>
  </View>
);

const TagList = ({ items = [] }) => {
  if (!Array.isArray(items) || items.length === 0) {
    return <Text style={styles.emptyInline}>—</Text>;
  }

  return (
    <View style={styles.tagWrap}>
      {items.map((item, index) => (
        <View key={`${item}-${index}`} style={styles.tag}>
          <Text style={styles.tagText}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

const SectionCard = ({ title, children }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
);

const CAClientDetailsScreen = ({ route, navigation }) => {
  const clientId = route?.params?.clientId || '';
  const fallbackTitle = route?.params?.title || 'Client Details';

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadClient = async () => {
    if (!clientId) {
      setError('Client id is missing');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await caClientService.getClientDetails(clientId);
      const mapped = mapCAClientDetails(response);

      setClient(mapped);
      navigation.setOptions?.({
        title: mapped?.name || fallbackTitle,
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to load client details'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClient();
  }, [clientId]);

  const headerTitle = useMemo(() => {
    return client?.name || fallbackTitle;
  }, [client?.name, fallbackTitle]);

  const openCase = () => {
    if (!client?.assignedCaseId) {
      Alert.alert('No Case', 'No case found for this client.');
      return;
    }

    navigation.navigate('CACaseDetails', {
      caseId: client.assignedCaseId,
    });
  };

  const openDocuments = () => {
    if (!client?.assignedCaseId) {
      Alert.alert('No Case', 'No case found for this client.');
      return;
    }

    navigation.navigate('CADocumentRequests', {
      caseId: client.assignedCaseId,
    });
  };

  const openChat = () => {
    navigation.navigate('CAChat', {
      clientId: client?.id,
      clientName: client?.name,
    });
  };

  const openMeetings = () => {
    navigation.navigate('CAMeetings', {
      clientId: client?.id,
      clientName: client?.name,
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.centerBox}>
            <Text style={styles.errorTitle}>Unable to load client</Text>
            <Text style={styles.errorText}>{error}</Text>

            <TouchableOpacity style={styles.primaryButton} onPress={loadClient}>
              <Text style={styles.primaryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!client) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.centerBox}>
            <Text style={styles.errorTitle}>Client not found</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{headerTitle}</Text>
          <Text style={styles.subtitle}>
            View client profile, onboarding summary, and case status.
          </Text>
        </View>

        <View style={styles.topActionRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={openChat}>
            <Text style={styles.secondaryButtonText}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={openMeetings}>
            <Text style={styles.secondaryButtonText}>Meetings</Text>
          </TouchableOpacity>

          {client.hasAssignedCase && (
            <>
              <TouchableOpacity style={styles.primaryButton} onPress={openCase}>
                <Text style={styles.primaryButtonText}>Open Case</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={openDocuments}
              >
                <Text style={styles.secondaryButtonText}>Documents</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <SectionCard title="Basic Information">
          <InfoRow label="Full Name" value={client.name} />
          <InfoRow label="Email" value={client.email} />
          <InfoRow label="Phone" value={client.phone} />
          <InfoRow label="Province" value={client.province} />
          <InfoRow label="User Type" value={client.userType} />
        </SectionCard>

        <SectionCard title="Family Information">
          <InfoRow label="Family Status" value={client.familyStatus} />
          <InfoRow label="Spouse Name" value={client.spouseName} />
          <InfoRow
            label="Dependents"
            value={String(client.numberOfDependents ?? 0)}
          />
        </SectionCard>

        <SectionCard title="Income Profile">
          <Text style={styles.groupLabel}>Gig Platforms</Text>
          <TagList items={client.gigPlatforms} />

          <Text style={styles.groupLabel}>Additional Income Sources</Text>
          <TagList items={client.additionalIncomeSources} />

          <InfoRow label="Profile Notes" value={client.profileNotes} />
        </SectionCard>

        <SectionCard title="Vehicle">
          <InfoRow
            label="Vehicle Owned"
            value={client.vehicleOwned ? 'Yes' : 'No'}
          />
          <Text style={styles.groupLabel}>Vehicle Use</Text>
          <TagList items={client.vehicleUse} />
        </SectionCard>

        <SectionCard title="Deductions & Receipts">
          <Text style={styles.groupLabel}>Selected Deductions</Text>
          <TagList items={client.deductions} />

          <Text style={styles.groupLabel}>Receipt Types</Text>
          <TagList items={client.receiptTypes} />
        </SectionCard>

        <SectionCard title="Case & Document Status">
          <InfoRow
            label="Assigned Case"
            value={client.hasAssignedCase ? 'Yes' : 'No'}
          />
          <InfoRow
            label="Assigned Case ID"
            value={client.assignedCaseId || '—'}
          />
          <InfoRow label="Case Status" value={client.assignedCaseStatus} />
          <InfoRow
            label="Documents Count"
            value={String(client.documentsCount ?? 0)}
          />
          <InfoRow label="Onboarding Status" value={client.onboardingStatus} />
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CAClientDetailsScreen;