import React from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity } from 'react-native';
import styles from '../Form.styles';

const PEER_REVIEW_OUTCOMES = [
  'pass',
  'pass_with_conditions',
  'pending',
  'other',
];

const formatOutcomeLabel = (value) =>
  String(value || '')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

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

  const renderSwitchRow = (label, field) => (
    <View style={styles.field}>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>{label}</Text>
        <Switch
          value={!!form[field]}
          onValueChange={(value) => {
            updateField(field, value);

            if (field === 'professionalLiabilityInsurance' && !value) {
              updateField('insuranceProvider', '');
              updateField('policyNumber', '');
              updateField('coverageAmount', '');
              updateField('policyExpiryDate', '');
            }

            if (field === 'peerReviewCompleted' && !value) {
              updateField('peerReviewDate', '');
              updateField('peerReviewOutcome', '');
              updateField('peerReviewReport', null);
            }

            if (field === 'disciplinaryHistory' && !value) {
              updateField('disciplinaryDetails', '');
            }
          }}
        />
      </View>
      {!!errors[field] && <Text style={styles.error}>{errors[field]}</Text>}
    </View>
  );

  const renderSingleChoice = (label, field, options) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chipsWrap}>
        {(options || []).map((option) => {
          const selected = form[field] === option;
          return (
            <TouchableOpacity
              key={option}
              style={[styles.chip, selected && styles.chipActive]}
              onPress={() => updateField(field, option)}
            >
              <Text style={[styles.chipText, selected && styles.chipTextActive]}>
                {formatOutcomeLabel(option)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {!!errors[field] && <Text style={styles.error}>{errors[field]}</Text>}
    </View>
  );

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

  return (
    <View>
      <Text style={styles.title}>Credentials</Text>

      {renderSwitchRow(
        'Professional liability insurance',
        'professionalLiabilityInsurance'
      )}

      {form.professionalLiabilityInsurance && (
        <>
          {renderInput('Insurance provider *', 'insuranceProvider', 'Insurance company name')}
          {renderInput('Policy number *', 'policyNumber', 'POL-123456')}
          {renderInput('Coverage amount', 'coverageAmount', '1000000', {
            keyboardType: 'numeric',
          })}
          {renderInput('Expiry date *', 'policyExpiryDate', 'YYYY-MM-DD')}
          {renderUploadBox('Insurance document', 'insuranceDocument')}
        </>
      )}

      {renderSwitchRow('CPA member in good standing', 'cpaMemberInGoodStanding')}
      {renderInput(
        'License verification number',
        'licenseVerification',
        'Verification number'
      )}

      {renderSwitchRow(
        'Peer review completed within last 3 years',
        'peerReviewCompleted'
      )}

      {form.peerReviewCompleted && (
        <>
          {renderInput('Peer review date *', 'peerReviewDate', 'YYYY-MM-DD')}
          {renderSingleChoice(
            'Peer review outcome *',
            'peerReviewOutcome',
            PEER_REVIEW_OUTCOMES
          )}
          {renderUploadBox('Peer review report', 'peerReviewReport')}
        </>
      )}

      {renderSwitchRow('Disciplinary history to disclose', 'disciplinaryHistory')}

      {form.disciplinaryHistory &&
        renderInput(
          'Disciplinary details *',
          'disciplinaryDetails',
          'Provide details here',
          { multiline: true }
        )}

      {renderSwitchRow(
        'Consent to background / criminal record check',
        'backgroundCheckConsent'
      )}
    </View>
  );
};

export default CredentialsStep;