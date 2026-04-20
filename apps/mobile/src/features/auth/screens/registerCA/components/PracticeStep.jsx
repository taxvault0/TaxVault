import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import styles from '../Form.styles';

const PRACTICE_TYPES = [
  'Solo Practice',
  'Partnership',
  'Firm',
  'Virtual Practice',
  'Hybrid Practice',
];

const SERVICE_OFFERINGS = [
  'Personal Tax Returns',
  'Corporate Tax',
  'Tax Planning',
  'GST/HST',
  'Bookkeeping',
  'Payroll',
];

const PRIMARY_CLIENT_TYPES = [
  'Individuals',
  'Families',
  'Small Businesses',
  'Corporations',
  'Self-Employed',
  'Non-Profits',
];

const PracticeStep = ({ form, errors, updateField, toggleArrayValue }) => {
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
    <View style={styles.switchRow} key={field}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch
        value={!!form[field]}
        onValueChange={(value) => updateField(field, value)}
      />
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
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {!!errors[field] && <Text style={styles.error}>{errors[field]}</Text>}
    </View>
  );

  const renderMultiChoice = (label, field, options) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chipsWrap}>
        {(options || []).map((option) => {
          const selected = (form[field] || []).includes(option);
          return (
            <TouchableOpacity
              key={option}
              style={[styles.chip, selected && styles.chipActive]}
              onPress={() => toggleArrayValue(field, option)}
            >
              <Text style={[styles.chipText, selected && styles.chipTextActive]}>
                {option}
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
      <Text style={styles.title}>Practice Information</Text>

      {renderSingleChoice('Practice type *', 'practiceType', PRACTICE_TYPES)}
      {renderMultiChoice('Services Offered', 'taxServicesOffered', SERVICE_OFFERINGS)}
      {renderMultiChoice('Primary Client Types *', 'clientTypesServed', PRIMARY_CLIENT_TYPES)}

      {renderInput('Average Clients Per Year', 'averageClientsPerYear', '50', {
        keyboardType: 'numeric',
      })}
      {renderInput('Service Radius (km)', 'serviceRadius', '50', {
        keyboardType: 'numeric',
      })}
      {renderInput('Minimum Fee', 'minimumFee', '50', {
        keyboardType: 'numeric',
      })}
      {renderInput('Maximum Fee', 'maximumFee', '50', {
        keyboardType: 'numeric',
      })}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Availability</Text>
        <Text style={styles.infoText}>
          Set how clients can work with you.
        </Text>
      </View>

      {renderSwitchRow('Accepting New Clients', 'acceptingNewClients')}
      {renderSwitchRow('Offers Virtual Services', 'offersVirtualServices')}
      {renderSwitchRow('Offers In-Person Services', 'offersInPersonServices')}
    </View>
  );
};

export default PracticeStep;