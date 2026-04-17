import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import styles from '../styles/CAClientRequests.styles';

const CARequestCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      <View style={styles.rowBetween}>
        <Text style={styles.name}>{item.name}</Text>

        <View
          style={[
            styles.badge,
            item.status === 'pending'
              ? styles.badgePending
              : item.status === 'accepted'
              ? styles.badgeAccepted
              : styles.badgeRejected,
          ]}
        >
          <Text style={styles.badgeText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.meta}>{item.email}</Text>
      <Text style={styles.meta}>{item.phone}</Text>

      <View style={styles.tagRow}>
        <Text style={styles.tag}>{item.province}</Text>
        <Text style={styles.tag}>{item.userType}</Text>
        <Text style={styles.tag}>{item.taxYear}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CARequestCard;