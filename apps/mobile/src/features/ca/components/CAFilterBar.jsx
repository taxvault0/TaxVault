import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PROVINCES = [
  'All',
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

const EXPERTISE_OPTIONS = [
  'All',
  'Personal Tax',
  'Corporate Tax',
  'GST/HST',
  'Bookkeeping',
  'Payroll',
  'Self-Employment',
  'Investments',
  'Rental Income',
  'Tax Planning',
];

const Chip = ({ label, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.chip, active && styles.chipActive]}
  >
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const CAFilterBar = ({
  search,
  onChangeSearch,
  province,
  onChangeProvince,
  expertise,
  onChangeExpertise,
  onClear,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={search}
        onChangeText={onChangeSearch}
        placeholder="Search by CA name or firm"
        placeholderTextColor="#64748B"
        style={styles.searchInput}
      />

      <Text style={styles.sectionTitle}>Province</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {PROVINCES.map((item) => (
          <Chip
            key={item}
            label={item}
            active={province === item}
            onPress={() => onChangeProvince(item)}
          />
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Expertise</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {EXPERTISE_OPTIONS.map((item) => (
          <Chip
            key={item}
            label={item}
            active={expertise === item}
            onPress={() => onChangeExpertise(item)}
          />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.clearButton} onPress={onClear}>
        <Text style={styles.clearButtonText}>Clear Filters</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchInput: {
    height: 46,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  sectionTitle: {
    marginTop: 14,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  row: {
    paddingRight: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  clearButton: {
    marginTop: 14,
    alignSelf: 'flex-start',
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
});

export default CAFilterBar;