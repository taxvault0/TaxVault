import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '@/styles/theme';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        styles[size],
        styles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? theme.colors.text.inverse : theme.colors.text.primary}
          />
        ) : (
          <>
            {iconLeft ? (
              <Icon
                name={iconLeft}
                size={18}
                color={variant === 'primary' ? theme.colors.text.inverse : theme.colors.text.primary}
                style={styles.leftIcon}
              />
            ) : null}

            <Text
              style={[
                styles.textBase,
                styles[`${variant}Text`],
                styles[`${size}Text`],
                textStyle,
              ]}
            >
              {title}
            </Text>

            {iconRight ? (
              <Icon
                name={iconRight}
                size={18}
                color={variant === 'primary' ? theme.colors.text.inverse : theme.colors.text.primary}
                style={styles.rightIcon}
              />
            ) : null}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  md: {
    minHeight: 56,
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  sm: {
    minHeight: 46,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  primary: {
    backgroundColor: theme.colors.secondary,
    ...theme.shadows.medium,
  },
  secondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  soft: {
    backgroundColor: theme.colors.primarySoft,
  },

  disabled: {
    opacity: 0.6,
  },

  textBase: {
    fontWeight: '700',
  },
  mdText: {
    fontSize: 16,
  },
  smText: {
    fontSize: 14,
  },

  primaryText: {
    color: theme.colors.text.inverse,
  },
  secondaryText: {
    color: theme.colors.text.primary,
  },
  softText: {
    color: theme.colors.primary,
  },

  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default Button;



