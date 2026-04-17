import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '@/components/ui/Button';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';

const EmptyState = ({
  icon,
  title,
  message,
  buttonText,
  onButtonPress,
}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: borderRadius.xl,
          backgroundColor: colors.gray[100],
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: spacing.lg,
        }}
      >
        <Icon
          name={icon || 'file-document-outline'}
          size={40}
          color={colors.gray[400]}
        />
      </View>

      <Text
        style={{
          fontSize: typography.sizes?.xl || 20,
          fontWeight: typography.weights?.semibold || '600',
          color: colors.gray[900],
          textAlign: 'center',
          marginBottom: spacing.sm,
        }}
      >
        {title || 'Nothing here yet'}
      </Text>

      <Text
        style={{
          fontSize: typography.sizes?.base || 16,
          color: colors.gray[600],
          textAlign: 'center',
          marginBottom: spacing.lg,
        }}
      >
        {message || 'Get started by adding your first item'}
      </Text>

      {buttonText && onButtonPress && (
        <Button onPress={onButtonPress}>
          {buttonText}
        </Button>
      )}
    </View>
  );
};

export default EmptyState;


