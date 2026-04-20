import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import styles from '../Form.styles';

const TAX_SPECIALTIES = [
  'Personal Income Tax',
  'Corporate Tax Planning',
  'GST/HST Returns',
  'PST Returns',
  'QST Returns',
  'Payroll Remittances',
  'T2 Corporation Returns',
  'T1 Personal Returns',
  'T3 Trust Returns',
  'T4/T4A Preparation',
  'T5013 Partnership Returns',
  'Scientific Research & Experimental Development (SR&ED)',
  'Capital Gains Planning',
  'Estate Planning',
  'Tax Litigation',
  'Voluntary Disclosures',
  'Tax Audits',
  'CRA Representation',
];

const PROVINCIAL_SPECIALTIES = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Nova Scotia',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan',
  'Northwest Territories',
  'Nunavut',
  'Yukon',
  'Multiple Provinces',
  'All Provinces',
];

const INTERNATIONAL_SPECIALTIES = [
  'International Tax',
  'US Tax',
  'Cross-Border',
  'Estate Planning',
  'Corporate Restructuring',
  'Mergers & Acquisitions',
];

const ACCOUNTING_SOFTWARE = [
  'QuickBooks Online',
  'QuickBooks Desktop',
  'Xero',
  'Sage 50',
  'Sage Intacct',
  'FreshBooks',
  'Wave',
  'Oracle NetSuite',
  'Microsoft Dynamics',
  'SAP',
  'Other',
];

const TAX_SOFTWARE = [
  'Profile',
  'TaxPrep',
  'DT Max',
  'CanTax',
  'QuickTax',
  'TurboTax',
  'UFile',
  'TaxCycle',
  'CCH iFirm',
  'Other',
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
      <Text style={styles.title}>Specialties & Technology</Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Expertise & Tools</Text>
        <Text style={styles.infoText}>
          Show your areas of expertise, software knowledge, and client security practices.
        </Text>
      </View>

      {renderMultiChoice('Tax Specialties', 'taxSpecialties', TAX_SPECIALTIES)}
      {renderMultiChoice(
        'Provincial Specialties',
        'provincialSpecialties',
        PROVINCIAL_SPECIALTIES
      )}
      {renderMultiChoice(
        'International & Advanced Specialties',
        'internationalSpecialties',
        INTERNATIONAL_SPECIALTIES
      )}

      {renderMultiChoice('Accounting Software', 'accountingSoftware', ACCOUNTING_SOFTWARE)}
      {renderMultiChoice('Tax Software', 'taxSoftware', TAX_SOFTWARE)}

      {renderInput(
        'Practice Management Software',
        'practiceManagementSoftware',
        'e.g. Karbon, Jetpack Workflow, Canopy'
      )}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Client Experience & Security</Text>
      </View>

      {renderSwitchRow('Offers client portal access', 'offersPortalAccess')}
      {renderSwitchRow(
        'Accepts digital documents / e-signatures',
        'acceptsDigitalDocuments'
      )}
      {renderSwitchRow('Uses end-to-end encryption', 'usesEncryption')}
      {renderSwitchRow('Uses two-factor authentication', 'twoFactorAuth')}
    </View>
  );
};

export default SpecialtiesStep;