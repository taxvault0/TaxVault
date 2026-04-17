import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '@/styles/theme';
import { typography } from '@/styles/theme';
import { spacing } from '@/styles/theme';
import Badge from './Badge';

const ReceiptItem = ({ receipt, onPress }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      fuel: 'gas-station',
      maintenance: 'wrench',
      insurance: 'shield',
      'office-supplies': 'briefcase',
      internet: 'wifi',
      rent: 'home',
      utilities: 'flash',
      meals: 'food',
      software: 'laptop',
      advertising: 'megaphone',
      other: 'receipt',
    };
    return icons[category] || 'receipt';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.white,
        borderRadius: spacing.radius.md,
        marginBottom: spacing.sm,
        ...shadows.sm,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: spacing.radius.md,
          backgroundColor: colors.primary[50],
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: spacing.md,
        }}
      >
        <Icon name={getCategoryIcon(receipt.category)} size={24} color={colors.primary[500]} />
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[typography.styles.body1, { fontWeight: typography.weights.medium }]}>
            {receipt.vendor}
          </Text>
          <Badge status={receipt.status} />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs }}>
          <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
            {formatDate(receipt.date)}
          </Text>
          <Text style={[typography.styles.body1, { fontWeight: typography.weights.semiBold }]}>
            ${receipt.amount.toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ReceiptItem;



