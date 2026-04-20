import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const PROVINCES = [
  'AB',
  'BC',
  'MB',
  'NB',
  'NL',
  'NS',
  'NT',
  'NU',
  'ON',
  'PE',
  'QC',
  'SK',
  'YT',
];

const USER_TYPES = [
  { label: 'Gig Worker', value: 'gig-worker' },
  { label: 'Self Employed', value: 'self-employed' },
  { label: 'Employee', value: 'employee' },
  { label: 'Professional', value: 'professional' },
];

const ProfileStep = ({ form, errors = {}, updateField }) => {
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

  return (
    <View>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Province</Text>
        <View style={styles.chipsWrap}>
          {PROVINCES.map((province) => {
            const selected = form.province === province;
            return (
              <TouchableOpacity
                key={province}
                style={[styles.chip, selected && styles.chipActive]}
                onPress={() => updateField('province', province)}
              >
                <Text style={[styles.chipText, selected && styles.chipTextActive]}>
                  {province}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>User Type</Text>
        <View style={styles.chipsWrap}>
          {USER_TYPES.map((item) => {
            const selected = form.userType === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                style={[styles.chip, selected && styles.chipActive]}
                onPress={() => updateField('userType', item.value)}
              >
                <Text style={[styles.chipText, selected && styles.chipTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {renderInput('Notes (optional)', 'profileNotes', 'Anything important about your tax profile?')}
    </View>
  );
};

export default ProfileStep;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  error: {
    marginTop: 6,
    color: '#DC2626',
    fontSize: 12,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  chipActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#93C5FD',
  },
  chipText: {
    color: '#334155',
    fontWeight: '600',
    fontSize: 13,
  },
  chipTextActive: {
    color: '#1D4ED8',
  },
});