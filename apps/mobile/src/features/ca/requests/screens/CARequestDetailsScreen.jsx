import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import caRequestService from '@/services/caRequestService';
import styles from '../styles/CARequestDetails.styles';

const safeText = (value = '') => String(value || '').trim();

const getId = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value._id || value.id || '';
};

const mapRequestDetails = (item = {}) => {
  const user = item.user || item.client || {};
  const personalDetails = item.personalDetails || item.onboarding?.personalDetails || {};
  const incomeDetails = item.incomeDetails || item.onboarding?.incomeDetails || {};
  const vehicle = item.vehicle || item.onboarding?.vehicle || {};
  const deductions = item.deductions || item.onboarding?.deductions || {};
  const declarations = item.declarations || item.onboarding?.declarations || {};

  return {
    id: getId(item),
    clientId: getId(user),
    name:
      safeText(item.name) ||
      safeText(user.name) ||
      [safeText(user.firstName), safeText(user.lastName)].filter(Boolean).join(' ').trim() ||
      'Unknown Client',
    email: safeText(item.email) || safeText(user.email),
    phone: safeText(item.phone) || safeText(user.phoneNumber || user.phone),
    province:
      safeText(item.province) ||
      safeText(user.province) ||
      safeText(personalDetails.province) ||
      'ON',
    userType: safeText(item.userType) || safeText(user.userType) || 'gig-worker',
    taxYear: safeText(item.taxYear),
    status: safeText(item.status) || 'pending',
    message: safeText(item.message || item.note || item.requestMessage),
    familyStatus: safeText(personalDetails.familyStatus),
    spouseName: safeText(
      personalDetails.spouse?.name || personalDetails.spouseName
    ),
    numberOfDependents:
      personalDetails.numberOfDependents ?? 0,
    gigPlatforms: Array.isArray(incomeDetails.gigPlatforms)
      ? incomeDetails.gigPlatforms
      : [],
    additionalIncomeSources: Array.isArray(incomeDetails.additionalIncomeSources)
      ? incomeDetails.additionalIncomeSources
      : [],
    vehicleOwned: !!(vehicle.owned ?? vehicle.vehicleOwned),
    vehicleUse: Array.isArray(vehicle.usage || vehicle.vehicleUse)
      ? vehicle.usage || vehicle.vehicleUse
      : [],
    selectedDeductions: Array.isArray(deductions.selectedDeductions)
      ? deductions.selectedDeductions
      : [],
    receiptTypes: Array.isArray(deductions.receiptTypes)
      ? deductions.receiptTypes
      : [],
    agreeToTerms: !!declarations.agreeToTerms,
    agreeToPrivacy: !!declarations.agreeToPrivacy,
    confirmAccuracy: !!declarations.confirmAccuracy,
    raw: item,
  };
};

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

const CARequestDetailsScreen = ({ route, navigation }) => {
  const requestId = route?.params?.requestId || '';

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [error, setError] = useState('');

  const loadRequest = async () => {
    if (!requestId) {
      setError('Request id is missing');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await caRequestService.getRequestDetails(requestId);
      const mapped = mapRequestDetails(
        response?.request || response?.data || response
      );

      setRequest(mapped);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to load request details'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequest();
  }, [requestId]);

  const handleAccept = async () => {
    if (!requestId) return;

    try {
      setAccepting(true);

      await caRequestService.acceptRequest(requestId, {
        taxYear: request?.taxYear || new Date().getFullYear().toString(),
        note: 'Accepted by CA from mobile app',
      });
      await caCaseService.createCase(request.clientId, {
        caseType: 'individual',
        taxYear: request.taxYear || new Date().getFullYear().toString(),
        });

      Alert.alert('Success', 'Request accepted successfully.', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('CAClients');
          },
        },
      ]);
    } catch (err) {
      Alert.alert(
        'Error',
        err?.response?.data?.message ||
          err?.message ||
          'Failed to accept request'
      );
    } finally {
      setAccepting(false);
    }
  };

  const handleReject = async () => {
    if (!requestId) return;

    try {
      setRejecting(true);

      await caRequestService.rejectRequest(requestId, {
        reason: 'CA unavailable at this time',
      });

      Alert.alert('Success', 'Request rejected successfully.', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (err) {
      Alert.alert(
        'Error',
        err?.response?.data?.message ||
          err?.message ||
          'Failed to reject request'
      );
    } finally {
      setRejecting(false);
    }
  };

  const openChat = () => {
    navigation.navigate('CAChat', {
      clientId: request?.clientId,
      clientName: request?.name,
      requestId: request?.id,
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
            <Text style={styles.errorTitle}>Unable to load request</Text>
            <Text style={styles.errorText}>{error}</Text>

            <TouchableOpacity style={styles.primaryButton} onPress={loadRequest}>
              <Text style={styles.primaryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!request) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.centerBox}>
            <Text style={styles.errorTitle}>Request not found</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const isPending = request.status === 'pending';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{request.name}</Text>
          <Text style={styles.subtitle}>
            Review request details and decide whether to accept or reject.
          </Text>
        </View>

        <View style={styles.topStatusRow}>
          <View
            style={[
              styles.statusBadge,
              request.status === 'accepted'
                ? styles.statusAccepted
                : request.status === 'rejected'
                ? styles.statusRejected
                : styles.statusPending,
            ]}
          >
            <Text style={styles.statusText}>{request.status}</Text>
          </View>

          {!!request.taxYear && (
            <View style={styles.metaChip}>
              <Text style={styles.metaChipText}>{request.taxYear}</Text>
            </View>
          )}
        </View>

        <View style={styles.topActionRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={openChat}>
            <Text style={styles.secondaryButtonText}>Message</Text>
          </TouchableOpacity>

          {isPending && (
            <>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={handleReject}
                disabled={accepting || rejecting}
              >
                {rejecting ? (
                  <ActivityIndicator color="#991B1B" />
                ) : (
                  <Text style={styles.rejectButtonText}>Reject</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleAccept}
                disabled={accepting || rejecting}
              >
                {accepting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Accept</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>

        <SectionCard title="Basic Information">
          <InfoRow label="Full Name" value={request.name} />
          <InfoRow label="Email" value={request.email} />
          <InfoRow label="Phone" value={request.phone} />
          <InfoRow label="Province" value={request.province} />
          <InfoRow label="User Type" value={request.userType} />
          <InfoRow label="Tax Year" value={request.taxYear} />
        </SectionCard>

        <SectionCard title="Request Note">
          <Text style={styles.requestMessage}>{request.message || '—'}</Text>
        </SectionCard>

        <SectionCard title="Family Information">
          <InfoRow label="Family Status" value={request.familyStatus} />
          <InfoRow label="Spouse Name" value={request.spouseName} />
          <InfoRow
            label="Dependents"
            value={String(request.numberOfDependents ?? 0)}
          />
        </SectionCard>

        <SectionCard title="Income Profile">
          <Text style={styles.groupLabel}>Gig Platforms</Text>
          <TagList items={request.gigPlatforms} />

          <Text style={styles.groupLabel}>Additional Income Sources</Text>
          <TagList items={request.additionalIncomeSources} />
        </SectionCard>

        <SectionCard title="Vehicle">
          <InfoRow
            label="Vehicle Owned"
            value={request.vehicleOwned ? 'Yes' : 'No'}
          />
          <Text style={styles.groupLabel}>Vehicle Use</Text>
          <TagList items={request.vehicleUse} />
        </SectionCard>

        <SectionCard title="Deductions & Receipts">
          <Text style={styles.groupLabel}>Selected Deductions</Text>
          <TagList items={request.selectedDeductions} />

          <Text style={styles.groupLabel}>Receipt Types</Text>
          <TagList items={request.receiptTypes} />
        </SectionCard>

        <SectionCard title="Declarations">
          <InfoRow
            label="Agreed to Terms"
            value={request.agreeToTerms ? 'Yes' : 'No'}
          />
          <InfoRow
            label="Agreed to Privacy"
            value={request.agreeToPrivacy ? 'Yes' : 'No'}
          />
          <InfoRow
            label="Confirmed Accuracy"
            value={request.confirmAccuracy ? 'Yes' : 'No'}
          />
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CARequestDetailsScreen;