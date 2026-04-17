import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const getConfidenceLabel = (value) => {
  if (typeof value !== 'number') return '';

  if (value >= 0.95) return 'High confidence';
  if (value >= 0.8) return 'Medium confidence';
  return 'Needs review';
};

const ExtractionFieldCard = ({ field, onChangeValue }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{field.label}</Text>

      {!!field.source && <Text style={styles.meta}>Source: {field.source}</Text>}

      {typeof field.confidence === 'number' && (
        <Text style={styles.meta}>
          {getConfidenceLabel(field.confidence)} ({Math.round(field.confidence * 100)}%)
        </Text>
      )}

      <TextInput
        value={field.value}
        onChangeText={(text) => onChangeValue(field.key, text)}
        editable={field.editable !== false}
        style={styles.input}
        placeholder={`Enter ${field.label}`}
        placeholderTextColor="#94A3B8"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  label: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  meta: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748B',
  },
  input: {
    marginTop: 12,
    minHeight: 46,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
});

export default ExtractionFieldCard;