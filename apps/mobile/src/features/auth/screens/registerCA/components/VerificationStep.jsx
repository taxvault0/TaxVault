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
        style={[styles.input, options.multiline && styles.textArea]}
        value={Array.isArray(form[field]) ? form[field].join(', ') : String(form[field] ?? '')}
        onChangeText={(value) => {
          if (field === 'professionalReferences') {
            const refs = value
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean);
            updateField(field, refs);
            return;
          }
          updateField(field, value);
        }}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        multiline={!!options.multiline}
        {...options}
      />
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

      {renderUploadBox('CA certificate / license *', 'caCertificate')}
      {renderUploadBox('Professional headshot', 'professionalHeadshot')}
      {renderUploadBox('Firm logo', 'firmLogo')}

      {renderInput(
        'Professional references',
        'professionalReferences',
        'Enter comma-separated names or emails'
      )}

      {renderSwitchRow(
        'Authorize TaxVault credential verification *',
        'authorizeVerification'
      )}

      {renderSwitchRow(
        'Consent to background check',
        'backgroundCheckConsent'
      )}
    </View>
  );
};

export default VerificationStep;