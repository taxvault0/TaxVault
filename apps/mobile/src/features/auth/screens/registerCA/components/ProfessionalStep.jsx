import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import {
  CA_DESIGNATIONS,
  PROVINCES,
  EXPERTISE_AREAS,
  LANGUAGES,
} from '../modules/constants';
import styles from '../Form.styles';

const ProfessionalStep = ({ form, errors, updateField, toggleArrayValue }) => {
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
      <Text style={styles.title}>Professional Information</Text>

      {renderSingleChoice('CA designation *', 'caDesignation', CA_DESIGNATIONS)}
      {renderInput('CA number / license number *', 'caNumber', 'CPA-123456')}
      {renderSingleChoice('Province of registration *', 'provinceOfRegistration', PROVINCES)}
      {renderInput('Year admitted *', 'yearAdmitted', '2012', {
        keyboardType: 'numeric',
        maxLength: 4,
      })}
      {renderInput('Years of experience *', 'yearsOfExperience', '10', {
        keyboardType: 'numeric',
      })}
      {renderInput('Firm name *', 'firmName', 'ABC Professional Corporation')}
      {renderInput('Firm website', 'firmWebsite', 'https://www.yourfirm.ca', {
        keyboardType: 'url',
        autoCapitalize: 'none',
      })}
      {renderMultiChoice('Areas of expertise', 'areasOfExpertise', EXPERTISE_AREAS)}
      {renderMultiChoice('Languages', 'languages', LANGUAGES)}

      {(form.languages || []).includes('Other') &&
        renderInput('Other language *', 'otherLanguage', 'Enter other language')}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Professional profile</Text>
        <Text style={styles.infoText}>
          These details help TaxVault verify your professional standing and match you with the right clients.
        </Text>
      </View>
    </View>
  );
};

export default ProfessionalStep;