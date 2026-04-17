import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import styles from '../styles/CAClientsScreen.styles';

const CAClientCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      <View style={styles.cardTopRow}>
        <Text style={styles.cardName}>{item.name}</Text>
        <View
          style={[
            styles.statusBadge,
            item.hasAssignedCase ? styles.statusAssigned : styles.statusUnassigned,
          ]}
        >
          <Text
            style={[
              styles.statusBadgeText,
              item.hasAssignedCase
                ? styles.statusAssignedText
                : styles.statusUnassignedText,
            ]}
          >
            {item.hasAssignedCase ? 'Assigned' : 'Unassigned'}
          </Text>
        </View>
      </View>

      {!!item.email && <Text style={styles.cardMeta}>{item.email}</Text>}
      {!!item.phone && <Text style={styles.cardMeta}>{item.phone}</Text>}

      <View style={styles.cardBottomRow}>
        <Text style={styles.cardTag}>{item.province || 'ON'}</Text>
        {!!item.userType && <Text style={styles.cardTag}>{item.userType}</Text>}
        {!!item.onboardingStatus && (
          <Text style={styles.cardTag}>{item.onboardingStatus}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CAClientCard;