import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import {
  PRACTICE_TYPES,
  PRIMARY_CLIENT_TYPES,
  SERVICE_OFFERINGS,
} from '../modules/constants';
import styles from '../Form.styles';

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
      <Switch value={!!form[field]} onValueChange={(value) => updateField(field, value)} />
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
        {options.map((option) => {
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

      {renderMultiChoice('Services offered *', 'servicesOffered', SERVICE_OFFERINGS)}

      {renderMultiChoice('Primary client types *', 'clientTypes', PRIMARY_CLIENT_TYPES)}
       
      {renderInput('Average clients per year', 'averageClientsPerYear', '150', {
        keyboardType: 'numeric',
      })}
      {renderInput('Minimum fee', 'minimumFee', '150', {
        keyboardType: 'numeric',
      })}
      {renderInput('Maximum fee', 'maximumFee', '1500', {
        keyboardType: 'numeric',
      })}
      {renderInput('Service radius (km)', 'serviceRadius', '50', {
        keyboardType: 'numeric',
      })}

      {renderSwitchRow('Accepting new clients', 'acceptingNewClients')}
      {renderSwitchRow('Offers virtual services', 'offersVirtualServices')}
      {renderSwitchRow('Offers in-person services', 'offersInPersonServices')}
    </View>
  );
};

export default PracticeStep;