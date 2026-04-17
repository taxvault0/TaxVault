import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const FAMILY_OPTIONS = ['Single', 'Married', 'Common-Law', 'Separated', 'Divorced', 'Widowed'];

const FamilyStep = ({ form, errors = {}, updateField }) => {
  const isMarriedLike =
    form.familyStatus === 'Married' || form.familyStatus === 'Common-Law';

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
      <Text style={styles.title}>Family Information</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Family Status *</Text>
        <View style={styles.chipsWrap}>
          {FAMILY_OPTIONS.map((option) => {
            const selected = form.familyStatus === option;

            return (
              <TouchableOpacity
                key={option}
                style={[styles.chip, selected && styles.chipActive]}
                onPress={() => {
                  updateField('familyStatus', option);

                  if (option !== 'Married' && option !== 'Common-Law') {
                    updateField('spouseName', '');
                  }
                }}
              >
                <Text style={[styles.chipText, selected && styles.chipTextActive]}>
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {!!errors.familyStatus && <Text style={styles.error}>{errors.familyStatus}</Text>}
      </View>

      {isMarriedLike && (
        <>
          {renderInput('Spouse Name *', 'spouseName', 'Enter spouse name')}

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Spouse details are shown for both Married and Common-Law.
            </Text>
          </View>
        </>
      )}

      {renderInput(
        'Number of Dependents',
        'numberOfDependents',
        '0',
        { keyboardType: 'numeric' }
      )}
    </View>
  );
};

export default FamilyStep;

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
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  infoText: {
    color: '#1E40AF',
    fontSize: 13,
    fontWeight: '500',
  },
});