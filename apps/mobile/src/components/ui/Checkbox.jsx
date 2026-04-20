import { StyleSheet } from 'react-native';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';

const Checkbox = ({
  label,
  checked = false,
  onPress,
  disabled = false,
  error,
  size = 24,
  color = colors.primary[500],
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={[
        styles.checkbox,
        {
          width: size,
          height: size,
          borderRadius: borderRadius.sm,
          borderColor: error ? colors.error : (checked ? color : colors.border),
          backgroundColor: checked ? color : 'transparent',
        },
        disabled && styles.checkboxDisabled,
      ]}>
        {checked && (
          <Icon name="check" size={size - 4} color={colors.white} />
        )}
      </View>
      
      {label && (
        <Text style={[
          styles.label,
          disabled && styles.labelDisabled,
          error && styles.labelError,
        ]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export const CheckboxGroup = ({
  options = [],
  values = [],
  onChange,
  direction = 'vertical',
}) => {
  const handleToggle = (optionValue) => {
    if (values.includes(optionValue)) {
      onChange(values.filter(v => v !== optionValue));
    } else {
      onChange([...values, optionValue]);
    }
  };

  return (
    <View style={[
      styles.groupContainer,
      direction === 'horizontal' && styles.groupHorizontal,
    ]}>
      {options.map((option, index) => (
        <Checkbox
          key={index}
          label={option.label}
          checked={values.includes(option.value)}
          onPress={() => handleToggle(option.value)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  checkbox: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginRight: spacing.sm,
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
  label: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
  },
  labelDisabled: {
    color: colors.gray[400],
  },
  labelError: {
    color: colors.error,
  },
  disabled: {
    opacity: 0.5,
  },
  groupContainer: {
    width: '100%',
  },
  groupHorizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
});

export default Checkbox;





