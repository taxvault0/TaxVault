import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import {
  TAX_SPECIALTIES,
  ACCOUNTING_SOFTWARE,
} from '../modules/constants';
import styles from '../Form.styles';

const BUSINESS_SERVICES = [
  'Corporate Tax',
  'GST/HST',
  'Payroll',
  'Bookkeeping',
  'Audit & Assurance',
  'Financial Planning',
  'Estate Planning',
  'Business Valuation',
  'Mergers & Acquisitions',
  'Insolvency',
];

const BOOKKEEPING_SERVICES = [
  'Monthly Bookkeeping',
  'Bank Reconciliation',
  'Payroll Processing',
  'Accounts Payable',
  'Accounts Receivable',
  'Year-End Preparation',
];

const ADVISORY_SERVICES = [
  'Financial Planning',
  'Estate Planning',
  'Business Advisory',
  'Cash Flow Planning',
  'Tax Planning',
  'Succession Planning',
];

const CERTIFICATIONS = [
  'CPA',
  'CA',
  'CMA',
  'CGA',
  'QuickBooks ProAdvisor',
  'Xero Advisor',
];

const NICHE_EXPERTISE = [
  'US Cross-Border',
  'International Tax',
  'Non-Profit Organizations',
  'Construction',
  'Healthcare',
  'Oil & Gas',
  'Technology',
  'Real Estate',
];

const SpecialtiesStep = ({ form, errors, updateField, toggleArrayValue }) => {
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
      <Text style={styles.title}>Specialties</Text>

      {renderMultiChoice('Tax specialties', 'taxServices', TAX_SPECIALTIES)}
      {renderMultiChoice('Business services', 'businessServices', BUSINESS_SERVICES)}
      {renderMultiChoice('Bookkeeping services', 'bookkeepingServices', BOOKKEEPING_SERVICES)}
      {renderMultiChoice('Advisory services', 'advisoryServices', ADVISORY_SERVICES)}
      {renderMultiChoice('Software skills', 'softwareSkills', ACCOUNTING_SOFTWARE)}
      {renderMultiChoice('Certifications', 'certifications', CERTIFICATIONS)}
      {renderMultiChoice('Niche expertise', 'nicheExpertise', NICHE_EXPERTISE)}

      {renderInput(
        'Notes',
        'specialtiesNotes',
        'Optional notes about expertise',
        { multiline: true }
      )}
    </View>
  );
};

export default SpecialtiesStep;