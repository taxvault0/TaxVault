import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { PROVINCES, FIRM_SIZES } from '../modules/constants';
import styles from '../Form.styles';

const FIRM_SIZE_LABELS = {
  solo: 'Solo',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
};

const FirmStep = ({ form, errors, updateField }) => {
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

  const renderSingleChoice = (label, field, options, labels = null) => (
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
                {labels?.[option] || option}
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
      <Text style={styles.title}>Firm Details</Text>

      {renderInput('Firm address *', 'firmAddress', '123 Main Street')}
      {renderInput('City *', 'city', 'Fort McMurray')}
      {renderSingleChoice('Province *', 'province', PROVINCES)}
      {renderInput('Postal code *', 'firmPostalCode', 'T9H 1A1', {
        autoCapitalize: 'characters',
      })}
      {renderInput('Country', 'country', 'Canada')}
      {renderInput('Firm phone *', 'firmPhone', '(780) 555-0000', {
        keyboardType: 'phone-pad',
      })}
      {renderInput('Firm email *', 'firmEmail', 'info@firm.ca', {
        keyboardType: 'email-address',
        autoCapitalize: 'none',
      })}
      {renderSingleChoice('Firm size', 'firmSize', FIRM_SIZES, FIRM_SIZE_LABELS)}
      {renderInput('Number of partners', 'numberOfPartners', '2', {
        keyboardType: 'numeric',
      })}
      {renderInput('Number of staff', 'numberOfStaff', '8', {
        keyboardType: 'numeric',
      })}
      {renderInput('Year established', 'yearEstablished', '2015', {
        keyboardType: 'numeric',
        maxLength: 4,
      })}
    </View>
  );
};

export default FirmStep;