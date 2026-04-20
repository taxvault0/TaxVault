import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const ReviewStep = ({ form, errors = {}, updateField }) => {
  const renderRow = (label, value) => (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>
        {Array.isArray(value) ? (value.length ? value.join(', ') : '-') : value || '-'}
      </Text>
    </View>
  );

  const renderSwitchRow = (label, field) => (
    <View style={styles.switchRow}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch
        value={!!form[field]}
        onValueChange={(value) => updateField(field, value)}
      />
    </View>
  );

  return (
    <View>
      <Text style={styles.title}>Review</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account</Text>
        {renderRow('Name', `${form.firstName || ''} ${form.lastName || ''}`.trim())}
        {renderRow('Email', form.email)}
        {renderRow('Phone', form.phone)}
        {renderRow('Province', form.province)}
        {renderRow('User Type', form.userType)}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Family</Text>
        {renderRow('Family Status', form.familyStatus)}
        {renderRow('Spouse Name', form.spouseName)}
        {renderRow('Dependents', form.numberOfDependents)}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Income & Work</Text>
        {renderRow('Gig Platforms', form.gigPlatforms)}
        {renderRow('Additional Income', form.additionalIncomeSources)}
        {renderRow('Vehicle Use', form.vehicleUse)}
        {renderRow('Deductions', form.deductions)}
        {renderRow('Receipt Types', form.receiptTypes)}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Declarations</Text>

        {renderSwitchRow('Agree to terms', 'agreeToTerms')}
        {!!errors.agreeToTerms && <Text style={styles.error}>{errors.agreeToTerms}</Text>}

        {renderSwitchRow('Agree to privacy policy', 'agreeToPrivacy')}
        {!!errors.agreeToPrivacy && <Text style={styles.error}>{errors.agreeToPrivacy}</Text>}

        {renderSwitchRow('Confirm accuracy', 'confirmAccuracy')}
        {!!errors.confirmAccuracy && <Text style={styles.error}>{errors.confirmAccuracy}</Text>}
      </View>
    </View>
  );
};

export default ReviewStep;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#FFFFFF',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  row: {
    marginBottom: 8,
  },
  rowLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  rowValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  switchRow: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    flex: 1,
    color: '#334155',
    fontWeight: '600',
    paddingRight: 12,
  },
  error: {
    marginTop: -6,
    marginBottom: 8,
    color: '#DC2626',
    fontSize: 12,
  },
});