import React from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity } from 'react-native';
import { PEER_REVIEW_OUTCOMES } from '../modules/constants';
import styles from '../Form.styles';

const CredentialsStep = ({ form, errors, updateField }) => {
  const renderInput = (label, field, placeholder, options = {}) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          options.multiline && styles.textArea,
          errors[field] && styles.inputError,
        ]}
        value={String(form[field] ?? '')}
        onChangeText={(value) => updateField(field, value)}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        multiline={!!options.multiline}
        {...options}
      />
      {!!errors[field] && <Text style={styles.error}>{errors[field]}</Text>}
    </View>
  );

  const handleToggle = (field, value) => {
    updateField(field, value);

    if (field === 'professionalLiabilityInsurance' && !value) {
      updateField('insuranceProvider', '');
      updateField('policyNumber', '');
      updateField('coverageAmount', '');
      updateField('expiryDate', '');
    }

    if (field === 'peerReviewCompleted' && !value) {
      updateField('peerReviewDate', '');
      updateField('peerReviewOutcome', '');
    }

    if (field === 'disciplinaryHistory' && !value) {
      updateField('disciplinaryDetails', '');
    }
  };

  const renderSwitchRow = (label, field) => (
    <View style={styles.switchRow} key={field}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch
        value={!!form[field]}
        onValueChange={(value) => handleToggle(field, value)}
      />
    </View>
  );

  const renderSingleChoice = (label, field, options) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chipsWrap}>
        {options.map((option) => {
          const selected = form[field] === option;
          return (
            <TouchableOpacity
              key={option}
              style={[styles.chip, selected && styles.chipActive]}
              onPress={() => updateField(field, option)}
            >
              <Text style={[styles.chipText, selected && styles.chipTextActive]}>
                {option.replaceAll('_', ' ')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {!!errors[field] && <Text style={styles.error}>{errors[field]}</Text>}
    </View>
  );

  return (
    <View>
      <Text style={styles.title}>Credentials</Text>

      {renderSwitchRow('Professional liability insurance', 'professionalLiabilityInsurance')}

      {form.professionalLiabilityInsurance && (
        <>
          {renderInput('Insurance provider *', 'insuranceProvider', 'Insurance company name')}
          {renderInput('Policy number *', 'policyNumber', 'POL-123456')}
          {renderInput('Coverage amount', 'coverageAmount', '1000000', {
            keyboardType: 'numeric',
          })}
          {renderInput('Expiry date *', 'expiryDate', 'YYYY-MM-DD')}
        </>
      )}

      {renderSwitchRow('CPA member in good standing', 'cpaMemberInGoodStanding')}
      {renderInput('License verification number', 'licenseVerification', 'Verification number')}

      {renderSwitchRow('Peer review completed within last 3 years', 'peerReviewCompleted')}

      {form.peerReviewCompleted && (
        <>
          {renderInput('Peer review date *', 'peerReviewDate', 'YYYY-MM-DD')}
          {renderSingleChoice('Peer review outcome *', 'peerReviewOutcome', PEER_REVIEW_OUTCOMES)}
        </>
      )}

      {renderSwitchRow('Disciplinary history to disclose', 'disciplinaryHistory')}

      {form.disciplinaryHistory &&
        renderInput(
          'Disciplinary details *',
          'disciplinaryDetails',
          'Provide details here',
          {
            multiline: true,
          }
        )}

      {renderSwitchRow(
        'Consent to background / criminal record check',
        'backgroundCheckConsent'
      )}
    </View>
  );
};

export default CredentialsStep;