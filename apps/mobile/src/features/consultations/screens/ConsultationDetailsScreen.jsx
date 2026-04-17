import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
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

export default function ConsultationDetailsScreen({ route, navigation }) {
  const consultationId = route?.params?.consultationId;
  const [loading, setLoading] = useState(true);
  const [consultation, setConsultation] = useState(null);

  const loadConsultation = async () => {
    try {
      setLoading(true);
      const result = await consultationService.getById(consultationId);
      setConsultation(result?.consultation || null);
    } catch (error) {
      console.error('ConsultationDetailsScreen error:', error);
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

  const handleCancel = async () => {
    try {
      await consultationService.cancel(consultationId, {
        cancellationReason: 'Cancelled from mobile app',
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
      <Text style={styles.title}>{consultation.title || 'Consultation Details'}</Text>
      <ConsultationStatusBadge status={consultation.status} />

      <View style={styles.card}>
        <Text style={styles.label}>CA</Text>
        <Text style={styles.value}>{getParticipantName(consultation.ca)}</Text>

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

        <Text style={styles.label}>Duration</Text>
        <Text style={styles.value}>{consultation.durationMinutes} mins</Text>

        <Text style={styles.label}>Client Notes</Text>
        <Text style={styles.value}>{consultation.notesFromClient || 'N/A'}</Text>

        <Text style={styles.label}>CA Notes</Text>
        <Text style={styles.value}>{consultation.notesFromCA || 'N/A'}</Text>

        <Text style={styles.label}>Meeting Link</Text>
        <Text style={styles.value}>{consultation.meetingLink || 'N/A'}</Text>

        <Text style={styles.label}>Location</Text>
        <Text style={styles.value}>{consultation.location || 'N/A'}</Text>
      </View>

      {consultation.status !== 'cancelled' && consultation.status !== 'completed' && (
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel Consultation</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation?.goBack?.()}
      >
        <Text style={styles.backText}>Back</Text>
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
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginTop: 10,
  },
  value: {
    fontSize: 14,
    color: '#111827',
    marginTop: 4,
  },
  cancelButton: {
    marginTop: 18,
    backgroundColor: '#dc2626',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    color: '#fff',
    fontWeight: '700',
  },
  backButton: {
    marginTop: 12,
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    fontWeight: '700',
  },
});