import React from 'react';
import { View, Text, TextInput } from 'react-native';
import styles from '../Form.styles';

const AccountStep = ({ form, errors, updateField }) => {
  const renderInput = (label, field, placeholder, options = {}) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, errors[field] && styles.inputError]}
        value={String(form[field] ?? '')}
        onChangeText={(value) => updateField(field, value)}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        {...options}
      />
      {!!errors[field] && <Text style={styles.error}>{errors[field]}</Text>}
    </View>
  );

  return (
    <View>
      <Text style={styles.title}>Account Information</Text>

      {renderInput('First name *', 'firstName', 'John')}
      {renderInput('Last name *', 'lastName', 'Doe')}
      {renderInput('Email *', 'email', 'ca@firm.ca', {
        keyboardType: 'email-address',
        autoCapitalize: 'none',
      })}
      {renderInput('Phone *', 'primaryPhone', '(780) 555-1234', {
        keyboardType: 'phone-pad',
      })}
      {renderInput('Alternate phone', 'alternatePhone', '(780) 555-5678', {
        keyboardType: 'phone-pad',
      })}
      {renderInput('Password *', 'password', 'Minimum 8 characters', {
        secureTextEntry: true,
        autoCapitalize: 'none',
      })}
      {renderInput('Confirm password *', 'confirmPassword', 'Re-enter password', {
        secureTextEntry: true,
        autoCapitalize: 'none',
      })}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Secure & Encrypted</Text>
        <Text style={styles.infoText}>
          Your professional registration information is protected and used only for CA onboarding and verification.
        </Text>
      </View>
    </View>
  );
};

export default AccountStep;