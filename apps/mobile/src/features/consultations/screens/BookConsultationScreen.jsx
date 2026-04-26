import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ConsultationForm from '../components/ConsultationForm';
import consultationService from '../services/consultationService';

export default function BookConsultationScreen({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    caId: route?.params?.caId || '',
    consultationType: 'initial-review',
    mode: 'video',
    scheduledDate: route?.params?.scheduledDate || '',
    durationMinutes: '30',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Toronto',
    notesFromClient: '',
    slotId: route?.params?.slotId || route?.params?.slot?.id || route?.params?.slot?._id || '',
  });

  const handleSubmit = async () => {
    try {
      if (!formData.caId || !formData.scheduledDate) {
        Alert.alert('Validation', 'CA ID and scheduled date are required');
        return;
      }

      setLoading(true);

      const payload = {
        ...formData,
        slotId: formData.slotId,
        durationMinutes: Number(formData.durationMinutes || 30),
      };

      const result = await consultationService.create(payload);

      Alert.alert('Success', result?.message || 'Consultation booked');
      navigation?.navigate?.('MyConsultations');
    } catch (error) {
      console.error('BookConsultationScreen error:', error);

      const message =
        error?.response?.data?.message || 'Failed to book consultation';

      Alert.alert('Error', message);

      if (error?.response?.status === 409 && formData.caId) {
        navigation.navigate('CAAvailability', {
          caId: formData.caId,
          ca: route?.params?.ca,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Book Consultation</Text>

      <ConsultationForm formData={formData} setFormData={setFormData} />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Submitting...' : 'Book Consultation'}
        </Text>
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
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});