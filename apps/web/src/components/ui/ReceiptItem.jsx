import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from './Card';
import Badge from './Badge';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing } from '../../styles/spacing';

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
      tolls: 'road',
      phone: 'phone',
      supplies: 'tools',
      inventory: 'package-variant',
      payroll: 'account-group',
      franchise: 'file-tree',
      marketing: 'megaphone',
      medical: 'hospital-box',
      tuition: 'school',
      donations: 'hand-heart',
      rrsp: 'piggy-bank',
      childcare: 'baby',
      moving: 'truck',
      'home-office': 'desk',
      'professional-dev': 'school',
      travel: 'airplane',
      other: 'receipt',
    };
    return icons[receipt.category] || 'receipt';
  };

  const getCategoryColor = (category) => {
    const colors = {
      fuel: '#FF6B35',
      maintenance: '#ED6A5E',
      insurance: '#005A9C',
      'office-supplies': '#2E7D32',
      meals: '#FFD700',
      tolls: '#9C27B0',
      phone: '#2196F3',
      inventory: '#4CAF50',
      rent: '#2196F3',
      payroll: '#9C27B0',
      medical: '#2196F3',
      tuition: '#4CAF50',
      donations: '#FF9800',
      rrsp: '#005A9C',
      other: '#9E9E9E',
    };
    return colors[receipt.category] || colors.other;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-CA', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  const categoryColor = getCategoryColor(receipt.category);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.container}>
        <View style={styles.row}>
          <View style={[styles.iconContainer, { backgroundColor: `${categoryColor}20` }]}>
            <Icon name={getCategoryIcon(receipt.category)} size={24} color={categoryColor} />
          </View>

          <View style={styles.content}>
            <View style={styles.headerRow}>
              <Text style={styles.vendor} numberOfLines={1}>
                {receipt.vendor}
              </Text>
              <Badge status={receipt.status} />
            </View>

            <View style={styles.detailsRow}>
              <View style={styles.leftDetails}>
                <View style={styles.dateContainer}>
                  <Icon name="calendar" size={12} color={colors.gray[400]} />
                  <Text style={styles.date}>{formatDate(receipt.date)}</Text>
                </View>
                {receipt.notes ? (
                  <Text style={styles.notes} numberOfLines={1}>
                    {receipt.notes}
                  </Text>
                ) : null}
              </View>

              <View style={styles.rightDetails}>
                <Text style={styles.amount}>${receipt.amount.toFixed(2)}</Text>
                {receipt.gst > 0 && (
                  <Text style={styles.gst}>GST: ${receipt.gst.toFixed(2)}</Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: spacing.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  vendor: {
    ...typography.styles.body2,
    fontWeight: typography.weights.semibold,
    flex: 1,
    marginRight: spacing.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  leftDetails: {
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginLeft: 2,
  },
  notes: {
    ...typography.styles.caption,
    color: colors.gray[400],
    marginTop: 2,
  },
  rightDetails: {
    alignItems: 'flex-end',
  },
  amount: {
    ...typography.styles.body1,
    fontWeight: typography.weights.semibold,
  },
  gst: {
    ...typography.styles.caption,
    color: colors.gray[400],
  },
});

export default ReceiptItem;





