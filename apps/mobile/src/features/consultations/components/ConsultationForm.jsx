import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function ConsultationForm({ formData, setFormData }) {
  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <View>
      <Text style={styles.label}>CA ID</Text>
      <TextInput
        style={styles.input}
        value={formData.caId}
        onChangeText={(value) => updateField('caId', value)}
        placeholder="Enter CA user ID"
      />

      <Text style={styles.label}>Consultation Type</Text>
      <TextInput
        style={styles.input}
        value={formData.consultationType}
        onChangeText={(value) => updateField('consultationType', value)}
        placeholder="initial-review"
      />

      <Text style={styles.label}>Mode</Text>
      <TextInput
        style={styles.input}
        value={formData.mode}
        onChangeText={(value) => updateField('mode', value)}
        placeholder="video"
      />

      <Text style={styles.label}>Scheduled Date</Text>
      <TextInput
        style={styles.input}
        value={formData.scheduledDate}
        onChangeText={(value) => updateField('scheduledDate', value)}
        placeholder="2026-04-20T14:00:00.000Z"
      />

      <Text style={styles.label}>Duration Minutes</Text>
      <TextInput
        style={styles.input}
        value={String(formData.durationMinutes)}
        onChangeText={(value) => updateField('durationMinutes', value)}
        placeholder="30"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Timezone</Text>
      <TextInput
        style={styles.input}
        value={formData.timezone}
        onChangeText={(value) => updateField('timezone', value)}
        placeholder="America/Toronto"
      />

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={formData.notesFromClient}
        onChangeText={(value) => updateField('notesFromClient', value)}
        placeholder="Add your notes"
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
    marginTop: 12,
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
});