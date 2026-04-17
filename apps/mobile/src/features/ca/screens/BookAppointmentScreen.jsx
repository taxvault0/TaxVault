import React, { useMemo, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BookAppointmentScreen = ({ route }) => {
  const ca = route?.params?.ca;
  const appointmentType = route?.params?.appointmentType || 'Consultation';

  const slots = useMemo(() => ca?.availableSlots || [], [ca]);

  const [selectedSlot, setSelectedSlot] = useState(slots[0] || '');

  const handleBook = () => {
    if (!selectedSlot) {
      Alert.alert('Select a time', 'Please choose an available time slot first.');
      return;
    }

    Alert.alert(
      'Appointment requested',
      `${appointmentType} requested with ${ca?.name} for ${selectedSlot}.`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{appointmentType}</Text>
        <Text style={styles.subtitle}>
          Select a time with {ca?.name}.
        </Text>

        <View style={styles.caCard}>
          <Text style={styles.caName}>{ca?.name}</Text>
          <Text style={styles.caMeta}>{ca?.title}</Text>
          <Text style={styles.caMeta}>Consultation fee: ${ca?.consultationFee}</Text>
        </View>

        <Text style={styles.sectionTitle}>Available slots</Text>

        {slots.map((slot) => {
          const selected = selectedSlot === slot;
          return (
            <TouchableOpacity
              key={slot}
              style={[styles.slotButton, selected && styles.slotButtonSelected]}
              onPress={() => setSelectedSlot(slot)}
            >
              <Text style={[styles.slotButtonText, selected && styles.slotButtonTextSelected]}>
                {slot}
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.primaryButton} onPress={handleBook}>
          <Text style={styles.primaryButtonText}>Confirm Appointment</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookAppointmentScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F8FC',
  },
  container: {
    padding: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
  },
  caCard: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5EAF2',
  },
  caName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  caMeta: {
    marginTop: 4,
    fontSize: 13,
    color: '#475569',
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  slotButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E5EAF2',
    marginBottom: 10,
  },
  slotButtonSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EEF4FF',
  },
  slotButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  slotButtonTextSelected: {
    color: '#2563EB',
  },
  primaryButton: {
    marginTop: 18,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
  },
});


