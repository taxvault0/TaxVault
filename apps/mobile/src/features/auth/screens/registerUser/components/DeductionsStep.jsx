import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DEDUCTION_OPTIONS = [
  'RRSP',
  'FHSA',
  'Medical Expenses',
  'Charitable Donations',
  'Child Care Expenses',
  'Moving Expenses',
  'Union Dues',
  'Tool Expenses',
  'Home Office',
  'Vehicle Expenses',
];

const RECEIPT_TYPE_OPTIONS = [
  'Fuel',
  'Maintenance',
  'Parking / Tolls',
  'Meals',
  'Mobile / Internet',
  'Supplies',
  'Equipment',
  'Insurance',
  'Rent / Utilities',
  'Other Receipts',
];

const DeductionsStep = ({ form, updateField }) => {
  const toggleArrayValue = (field, value) => {
    const current = Array.isArray(form[field]) ? form[field] : [];
    const exists = current.includes(value);

    updateField(
      field,
      exists ? current.filter((item) => item !== value) : [...current, value]
    );
  };

  const toggleSelectAll = (field, allOptions) => {
    const current = Array.isArray(form[field]) ? form[field] : [];
    const allSelected = allOptions.every((item) => current.includes(item));

    updateField(field, allSelected ? [] : [...allOptions]);
  };

  const renderGroup = (title, field, options) => {
    const current = Array.isArray(form[field]) ? form[field] : [];
    const allSelected = options.every((item) => current.includes(item));

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.label}>{title}</Text>

          <TouchableOpacity
            style={[styles.selectAllChip, allSelected && styles.selectAllChipActive]}
            onPress={() => toggleSelectAll(field, options)}
          >
            <Text style={[styles.selectAllText, allSelected && styles.selectAllTextActive]}>
              {allSelected ? 'Unselect All' : 'Select All'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.chipsWrap}>
          {options.map((option) => {
            const selected = current.includes(option);

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
  };

  return (
    <View>
      <Text style={styles.title}>Deductions & Receipts</Text>

      {renderGroup('Deductions & Credits', 'deductions', DEDUCTION_OPTIONS)}
      {renderGroup('Receipt Types', 'receiptTypes', RECEIPT_TYPE_OPTIONS)}

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          This includes the select-all behavior you asked for earlier on deductions and receipt types.
        </Text>
      </View>
    </View>
  );
};

export default DeductionsStep;

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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
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
  selectAllChip: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  selectAllChipActive: {
    backgroundColor: '#1D4ED8',
    borderColor: '#1D4ED8',
  },
  selectAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  selectAllTextActive: {
    color: '#FFFFFF',
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