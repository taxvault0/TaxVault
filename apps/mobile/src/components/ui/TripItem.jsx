import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '@/styles/theme';
import { typography } from '@/styles/theme';
import { spacing } from '@/styles/theme';
import Badge from './Badge';

const TripItem = ({ trip, onPress }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
          backgroundColor: colors.secondary[50],
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: spacing.md,
        }}
      >
        <Icon name="map-marker-distance" size={24} color={colors.secondary[500]} />
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[typography.styles.body1, { fontWeight: typography.weights.medium }]}>
            {trip.purpose === 'business' ? 'Business Meeting' : trip.purpose}
          </Text>
          <Badge status={trip.purpose} />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs }}>
          <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
            {formatDate(trip.date)}
          </Text>
          <Text style={[typography.styles.body1, { fontWeight: typography.weights.semiBold }]}>
            {trip.distance} km
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TripItem;



