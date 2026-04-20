import React from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';

const VEHICLE_USE_OPTIONS = [
  'Gig Work',
  'Self Employment',
  'Business Use',
  'Employment',
];

const VehicleStep = ({ form, updateField }) => {
  const toggleVehicleUse = (value) => {
    const current = Array.isArray(form.vehicleUse) ? form.vehicleUse : [];
    const exists = current.includes(value);

    updateField(
      'vehicleUse',
      exists ? current.filter((item) => item !== value) : [...current, value]
    );
  };

  return (
    <View>
      <Text style={styles.title}>Vehicle</Text>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Do you use a vehicle for work?</Text>
        <Switch
          value={!!form.vehicleOwned}
          onValueChange={(value) => {
            updateField('vehicleOwned', value);
            if (!value) {
              updateField('vehicleUse', []);
            }
          }}
        />
      </View>

      {form.vehicleOwned && (
        <>
          <Text style={styles.label}>Vehicle Use</Text>
          <View style={styles.chipsWrap}>
            {VEHICLE_USE_OPTIONS.map((option) => {
              const selected = (form.vehicleUse || []).includes(option);

              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.chip, selected && styles.chipActive]}
                  onPress={() => toggleVehicleUse(option)}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextActive]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Vehicle use supports multiple selections, which matches the real-world case you called out earlier. :contentReference[oaicite:1]{index=1}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

export default VehicleStep;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  switchRow: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    flex: 1,
    color: '#334155',
    fontWeight: '600',
    paddingRight: 12,
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
    marginBottom: 12,
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