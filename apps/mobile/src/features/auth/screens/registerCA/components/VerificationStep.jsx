import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Switch } from 'react-native';
import styles from '../Form.styles';

const VerificationStep = ({ form, errors, updateField }) => {
  const renderUploadBox = (label, field) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.uploadBox, errors[field] && styles.inputError]}
        onPress={() => {
          updateField(field, {
            name: `${field}.pdf`,
            type: 'application/pdf',
            size: 0,
          });
        }}
      >
        <Text style={styles.uploadTitle}>
          {form[field]?.name || 'Tap to attach file'}
        </Text>
        <Text style={styles.uploadSubtitle}>Accepted: PDF, JPG, PNG</Text>
      </TouchableOpacity>
      {!!errors[field] && <Text style={styles.error}>{errors[field]}</Text>}
    </View>
  );

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

  const renderSwitchRow = (label, field) => (
    <View style={styles.field}>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>{label}</Text>
        <Switch value={!!form[field]} onValueChange={(value) => updateField(field, value)} />
      </View>
      {!!errors[field] && <Text style={styles.error}>{errors[field]}</Text>}
    </View>
  );

  return (
    <View>
      <Text style={styles.title}>Verification</Text>

      {renderUploadBox('CA certificate / license *', 'caCertificateFile')}
      {renderUploadBox('Professional headshot', 'professionalHeadshotFile')}
      {renderUploadBox('Firm logo', 'firmLogoFile')}

      {renderInput('Reference name', 'referenceName', 'Enter reference name')}
      {renderInput('Reference email', 'referenceEmail', 'reference@example.com', {
        keyboardType: 'email-address',
        autoCapitalize: 'none',
      })}

      {renderSwitchRow(
        'Authorize TaxVault credential verification *',
        'authorizeCredentialCheck'
      )}
    </View>
  );
};

export default VerificationStep;