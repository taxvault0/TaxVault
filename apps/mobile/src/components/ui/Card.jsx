import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

const Card = ({
  children,
  style,
  variant = 'default',
  padding = 'md',
}) => {
  return (
    <View style={[styles.base, styles[variant], styles[padding], style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.lg,
  },

  default: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.soft,
  },

  elevated: {
    backgroundColor: theme.colors.surface,
    ...theme.shadows.medium,
  },

  soft: {
    backgroundColor: theme.colors.surfaceAlt,
  },

  primarySoft: {
    backgroundColor: theme.colors.primarySoft,
  },

  sm: {
    padding: theme.spacing.md,
  },

  md: {
    padding: theme.spacing.lg,
  },

  lg: {
    padding: theme.spacing.xl,
  },
});

export default Card;
