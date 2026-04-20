import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import consultationService from '../services/consultationService';
import ConsultationStatusBadge from '../components/ConsultationStatusBadge';
import {
  formatConsultationDate,
  getParticipantName,
} from '../utils/consultationHelpers';

export default function ManageConsultationScreen({ route, navigation }) {
  const consultationId = route?.params?.consultationId;
  const [loading, setLoading] = useState(true);
  const [consultation, setConsultation] = useState(null);
  const [notesFromCA, setNotesFromCA] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [location, setLocation] = useState('');

  const loadConsultation = async () => {
    try {
      setLoading(true);
      const result = await consultationService.getById(consultationId);
      const item = result?.consultation || null;

      setConsultation(item);
      setNotesFromCA(item?.notesFromCA || '');
      setMeetingLink(item?.meetingLink || '');
      setLocation(item?.location || '');
    } catch (error) {
      console.error('ManageConsultationScreen error:', error);
      setConsultation(null);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (consultationId) {
        loadConsultation();
      }
    }, [consultationId])
  );

  const handleConfirm = async () => {
    try {
      await consultationService.confirm(consultationId, {
        notesFromCA,
        meetingLink,
        location,
      });
      Alert.alert('Success', 'Consultation confirmed');
      loadConsultation();
    } catch (error) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to confirm consultation'
      );
    }
  };

  const handleComplete = async () => {
    try {
      await consultationService.complete(consultationId, {
        notesFromCA,
      });
      Alert.alert('Success', 'Consultation completed');
      loadConsultation();
    } catch (error) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to complete consultation'
      );
    }
  };

  const handleCancel = async () => {
    try {
      await consultationService.cancel(consultationId, {
        cancellationReason: 'Cancelled by CA from mobile app',
      });
      Alert.alert('Success', 'Consultation cancelled');
      loadConsultation();
    } catch (error) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to cancel consultation'
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!consultation) {
    return (
      <View style={styles.center}>
        <Text>Consultation not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Manage Consultation</Text>
      <ConsultationStatusBadge status={consultation.status} />

      <View style={styles.card}>
        <Text style={styles.label}>Client</Text>
        <Text style={styles.value}>{getParticipantName(consultation.client)}</Text>

        <Text style={styles.label}>Type</Text>
        <Text style={styles.value}>{consultation.consultationType}</Text>

        <Text style={styles.label}>Mode</Text>
        <Text style={styles.value}>{consultation.mode}</Text>

        <Text style={styles.label}>Scheduled</Text>
        <Text style={styles.value}>
          {formatConsultationDate(consultation.scheduledDate)}
        </Text>
      </View>

      <Text style={styles.label}>CA Notes</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={notesFromCA}
        onChangeText={setNotesFromCA}
        placeholder="Add notes"
        multiline
      />

      <Text style={styles.label}>Meeting Link</Text>
      <TextInput
        style={styles.input}
        value={meetingLink}
        onChangeText={setMeetingLink}
        placeholder="https://..."
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Office / Address"
      />

      {consultation.status !== 'confirmed' &&
        consultation.status !== 'completed' &&
        consultation.status !== 'cancelled' && (
          <TouchableOpacity style={styles.primaryButton} onPress={handleConfirm}>
            <Text style={styles.primaryText}>Confirm Consultation</Text>
          </TouchableOpacity>
        )}

      {consultation.status !== 'completed' &&
        consultation.status !== 'cancelled' && (
          <TouchableOpacity style={styles.successButton} onPress={handleComplete}>
            <Text style={styles.primaryText}>Mark Completed</Text>
          </TouchableOpacity>
        )}

      {consultation.status !== 'cancelled' &&
        consultation.status !== 'completed' && (
          <TouchableOpacity style={styles.dangerButton} onPress={handleCancel}>
            <Text style={styles.primaryText}>Cancel Consultation</Text>
          </TouchableOpacity>
        )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation?.goBack?.()}
      >
        <Text style={styles.primaryText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  card: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
    marginTop: 10,
  },
  value: {
    fontSize: 14,
    color: '#4b5563',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
  },
  textarea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  primaryButton: {
    marginTop: 18,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  successButton: {
    marginTop: 12,
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  dangerButton: {
    marginTop: 12,
    backgroundColor: '#dc2626',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backButton: {
    marginTop: 12,
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
  },
});