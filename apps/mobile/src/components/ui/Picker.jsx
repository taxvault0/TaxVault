import { StyleSheet } from 'react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';
import Button from './Button';
import Input from './Input';

const Picker = ({
  label,
  value,
  options = [],
  onSelect,
  placeholder = 'Select an option',
  error,
  required,
  searchable = false,
  disabled = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = searchable
    ? options.filter(opt =>
        opt.label.toLowerCase().includes(searchText.toLowerCase())
      )
    : options;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      
      <TouchableOpacity
        style={[
          styles.pickerButton,
          error && styles.pickerError,
          disabled && styles.pickerDisabled,
        ]}
        onPress={() => setModalVisible(true)}
        disabled={disabled}
      >
        <Text style={[
          styles.pickerText,
          !selectedOption && styles.placeholderText,
          disabled && styles.textDisabled,
        ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Icon name="chevron-down" size={20} color={colors.gray[400]} />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Select Option'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color={colors.gray[400]} />
              </TouchableOpacity>
            </View>

            {searchable && (
              <View style={styles.searchContainer}>
                <Icon name="magnify" size={20} color={colors.gray[400]} />
                <Input
                  placeholder="Search..."
                  value={searchText}
                  onChangeText={setSearchText}
                  containerStyle={styles.searchInput}
                />
              </View>
            )}

            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    value === item.value && styles.optionItemSelected,
                  ]}
                  onPress={() => {
                    onSelect(item.value);
                    setModalVisible(false);
                    setSearchText('');
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    value === item.value && styles.optionTextSelected,
                  ]}>
                    {item.label}
                  </Text>
                  {value === item.value && (
                    <Icon name="check" size={20} color={colors.white} />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No options found</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
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
  pickerDisabled: {
    backgroundColor: colors.gray[100],
    opacity: 0.7,
  },
  pickerText: {
    ...typography.body,
    color: colors.text.primary,
  },
  textDisabled: {
    color: colors.gray[400],
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
    maxHeight: '80%',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  optionItemSelected: {
    backgroundColor: colors.primary[500],
  },
  optionText: {
    ...typography.body,
    color: colors.text.primary,
  },
  optionTextSelected: {
    color: colors.white,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
  },
});

export default Picker;





