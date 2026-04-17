import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const GIG_PLATFORMS = [
  'Uber',
  'DoorDash',
  'SkipTheDishes',
  'Instacart',
  'Amazon Flex',
  'Lyft',
  'TaskRabbit',
  'Fiverr',
  'Upwork',
];

const ADDITIONAL_INCOME_SOURCES = [
  'Employment',
  'Self Employment',
  'Rental Income',
  'Investment Income',
  'Foreign Income',
  'Crypto',
  'Business Income',
  'Other',
];

const IncomeStep = ({ form, updateField }) => {
  const toggleArrayValue = (field, value) => {
    const current = Array.isArray(form[field]) ? form[field] : [];
    const exists = current.includes(value);

    updateField(
      field,
      exists ? current.filter((item) => item !== value) : [...current, value]
    );
  };

  const renderChipGroup = (label, field, options) => (
    <View style={styles.section}>
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
    </View>
  );

  return (
    <View>
      <Text style={styles.title}>Income</Text>

      {renderChipGroup('Gig Platforms', 'gigPlatforms', GIG_PLATFORMS)}

      {renderChipGroup(
        'Additional Income Sources',
        'additionalIncomeSources',
        ADDITIONAL_INCOME_SOURCES
      )}

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          You can select multiple income sources. That matches your earlier mobile tax flow where users can have more than one work type. :contentReference[oaicite:0]{index=0}
        </Text>
      </View>
    </View>
  );
};

export default IncomeStep;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  section: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
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
  },
  infoText: {
    color: '#1E40AF',
    fontSize: 13,
    fontWeight: '500',
  },
});