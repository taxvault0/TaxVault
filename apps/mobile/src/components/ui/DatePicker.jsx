import { StyleSheet } from 'react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';
import Button from '@/components/ui/Button';

const DatePicker = ({
  label,
  value,
  onSelect,
  placeholder = 'Select date',
  error,
  required,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(value ? new Date(value) : new Date());

  const handleConfirm = () => {
    onSelect(tempDate.toISOString().split('T')[0]);
    setShowPicker(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (Platform.OS === 'ios') {
    return (
      <View style={styles.container}>
        {label && (
          <Text style={styles.label}>
            {label} {required && <Text style={styles.required}>*</Text>}
          </Text>
        )}
        
        <TouchableOpacity
          style={[styles.pickerButton, error && styles.pickerError]}
          onPress={() => setShowPicker(true)}
        >
          <Text style={[
            styles.pickerText,
            !value && styles.placeholderText
          ]}>
            {value ? formatDate(value) : placeholder}
          </Text>
          <Icon name="calendar" size={20} color={colors.gray[400]} />
        </TouchableOpacity>

        <Modal
          visible={showPicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Date</Text>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Icon name="close" size={24} color={colors.gray[400]} />
                </TouchableOpacity>
              </View>
              
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  setTempDate(selectedDate || tempDate);
                }}
              />
              
              <Button
                title="Confirm"
                onPress={handleConfirm}
                style={styles.confirmButton}
              />
            </View>
          </View>
        </Modal>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  // Android version
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      
      <TouchableOpacity
        style={[styles.pickerButton, error && styles.pickerError]}
        onPress={() => setShowPicker(true)}
      >
        <Text style={[
          styles.pickerText,
          !value && styles.placeholderText
        ]}>
          {value ? formatDate(value) : placeholder}
        </Text>
        <Icon name="calendar" size={20} color={colors.gray[400]} />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              onSelect(selectedDate.toISOString().split('T')[0]);
            }
          }}
        />
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  required: {
    color: colors.error,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    backgroundColor: colors.white,
  },
  pickerError: {
    borderColor: colors.error,
  },
  pickerText: {
    ...typography.body,
    color: colors.text.primary,
  },
  placeholderText: {
    color: colors.gray[400],
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.h6,
    color: colors.text.primary,
  },
  confirmButton: {
    marginTop: spacing.lg,
  },
});

export default DatePicker;





