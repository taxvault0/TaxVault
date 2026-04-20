import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from './Button';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing } from '../../styles/spacing';

const EmptyState = ({ icon, title, message, buttonText, onButtonPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name={icon || 'file-document-outline'} size={48} color={colors.gray[300]} />
      </View>
      <Text style={styles.title}>{title || 'Nothing here yet'}</Text>
      <Text style={styles.message}>{message || 'Get started by adding your first item'}</Text>
      {buttonText && onButtonPress && (
        <Button onPress={onButtonPress} style={styles.button}>
          {buttonText}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    minHeight: 300,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.styles.h5,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    ...typography.styles.body2,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    minWidth: 200,
  },
});

export default EmptyState;





