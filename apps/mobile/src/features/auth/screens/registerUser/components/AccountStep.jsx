import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const AccountStep = ({ form, errors, updateField }) => {
  const Input = (label, field, placeholder, options = {}) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, errors[field] && styles.errorInput]}
        value={form[field]}
        onChangeText={(v) => updateField(field, v)}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        {...options}
      />
      {errors[field] && <Text style={styles.error}>{errors[field]}</Text>}
    </View>
  );

  return (
    <View>
      <Text style={styles.title}>Create Account</Text>

      {Input('First Name *', 'firstName', 'John')}
      {Input('Last Name *', 'lastName', 'Doe')}
      {Input('Email *', 'email', 'email@example.com', {
        keyboardType: 'email-address',
        autoCapitalize: 'none',
      })}
      {Input('Phone', 'phone', '6471234567', {
        keyboardType: 'phone-pad',
      })}
      {Input('Password *', 'password', 'Min 8 characters', {
        secureTextEntry: true,
      })}
      {Input('Confirm Password *', 'confirmPassword', 'Re-enter password', {
        secureTextEntry: true,
      })}
    </View>
  );
};

export default AccountStep;

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  field: { marginBottom: 12 },
  label: { fontWeight: '600', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
  },
  errorInput: { borderColor: 'red' },
  error: { color: 'red', fontSize: 12 },
});