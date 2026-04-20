import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';

const DeductionsScreen = () => {
  const [rrsp, setRrsp] = useState('');
  const [donations, setDonations] = useState('');

  const handleSave = () => {
    Alert.alert('Saved', 'Deductions saved successfully');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deductions</Text>
      <Text style={styles.subtitle}>
        Add your deductions to reduce tax
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>RRSP Contribution</Text>
        <TextInput
          value={rrsp}
          onChangeText={setRrsp}
          placeholder="Enter amount"
          style={styles.input}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Donations</Text>
        <TextInput
          value={donations}
          onChangeText={setDonations}
          placeholder="Enter amount"
          style={styles.input}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Deductions</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DeductionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
  },
});


