import { StyleSheet } from 'react-native';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';

const RadioButton = ({
  label,
  selected = false,
  onPress,
  disabled = false,
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
        styles.radio,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: selected ? color : colors.border,
        },
      ]}>
        {selected && (
          <View style={[
            styles.radioInner,
            {
              width: size / 2,
              height: size / 2,
              borderRadius: size / 4,
              backgroundColor: color,
            },
          ]} />
        )}
      </View>
      
      {label && (
        <Text style={[
          styles.label,
          disabled && styles.labelDisabled,
        ]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export const RadioGroup = ({
  options = [],
  value,
  onChange,
  direction = 'vertical',
}) => {
  return (
    <View style={[
      styles.groupContainer,
      direction === 'horizontal' && styles.groupHorizontal,
    ]}>
      {options.map((option, index) => (
        <RadioButton
          key={index}
          label={option.label}
          selected={value === option.value}
          onPress={() => onChange(option.value)}
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
  radio: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginRight: spacing.sm,
  },
  radioInner: {
    position: 'absolute',
  },
  label: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
  },
  labelDisabled: {
    color: colors.gray[400],
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

export default RadioButton;





