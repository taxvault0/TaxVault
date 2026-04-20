import React from 'react';
import { useTheme } from '@/core/providers/ThemeContext'; from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from './Card';
import { colors, borderRadius } from '@/styles/theme';
import { typography, borderRadius } from '@/styles/theme';
import { spacing, borderRadius } from '@/styles/theme';

const StatsCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  color = 'primary',
  onPress,
}) => {
  const getIconColor = () => {
    switch (color) {
      case 'primary':
        return colors.primary[500];
      case 'secondary':
        return colors.secondary[500];
      case 'success':
        return colors.success.main;
      case 'warning':
        return colors.warning.main;
      case 'gold':
        return colors.gold.main;
      default:
        return colors.primary[500];
    }
  };

  const getGradientColors = () => {
    switch (color) {
      case 'primary':
        return [colors.primary[50], colors.primary[100]];
      case 'secondary':
        return [colors.secondary[50], colors.secondary[100]];
      case 'success':
        return [colors.success.light, colors.success.light];
      case 'warning':
        return [colors.warning.light, colors.warning.light];
      case 'gold':
        return [colors.gold.light, colors.gold.light];
      default:
        return [colors.primary[50], colors.primary[100]];
    }
  };

  return (
    <Card variant="elevated" onPress={onPress}>
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: borderRadius.lg,
        }}
      />
      <View style={{ position: 'relative' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: spacing.radius.md,
              backgroundColor: getIconColor() + '20',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon name={icon} size={24} color={getIconColor()} />
          </View>
          {trend && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name={trend === 'up' ? 'trending-up' : 'trending-down'}
                size={16}
                color={trend === 'up' ? colors.success.main : colors.warning.main}
              />
              <Text
                style={[
                  typography.styles.caption,
                  {
                    color: trend === 'up' ? colors.success.main : colors.warning.main,
                    marginLeft: spacing.xs,
                  },
                ]}
              >
                {trendValue}%
              </Text>
            </View>
          )}
        </View>

        <Text style={[typography.styles.h3, { marginTop: spacing.md }]}>{value}</Text>
        <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
          {title}
        </Text>
      </View>
    </Card>
  );
};

export default StatsCard;










