import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import caService from '@/features/ca/services/caService';

const formatSlot = (slot) => {
  const start = new Date(slot.start);
  const end = slot.end ? new Date(slot.end) : null;

  return {
    date: start.toLocaleDateString('en-CA', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    }),
    time: `${start.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}${end ? ` - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}`,
  };
};

const CAAvailabilityScreen = ({ navigation, route }) => {
  const { caId, ca } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState([]);

  const loadAvailability = useCallback(async () => {
    try {
      setLoading(true);

      const data = await caService.getCAAvailability(caId, 30);

      const availableSlots = data.filter(
        (slot) => slot?.start && (slot.status || 'available') === 'available'
      );

      setSlots(availableSlots);
    } catch (error) {
      console.error('CAAvailabilityScreen error:', error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Could not load availability'
      );
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, [caId]);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  const handleSelectSlot = (slot) => {
    const start = new Date(slot.start);

    navigation.navigate('BookConsultation', {
      caId,
      ca,
      slot,
      slotId: slot.id || slot._id,
      scheduledDate: start.toISOString(),
      selectedDate: start.toISOString().split('T')[0],
      selectedTime: start.toTimeString().slice(0, 5),
    });
  };

  const renderSlot = ({ item }) => {
    const formatted = formatSlot(item);

    return (
      <View style={styles.slotCard}>
        <View style={styles.slotInfo}>
          <View style={styles.row}>
            <Icon name="calendar-month-outline" size={18} color="#2563EB" />
            <Text style={styles.date}>{formatted.date}</Text>
          </View>

          <View style={styles.row}>
            <Icon name="clock-outline" size={18} color="#64748B" />
            <Text style={styles.time}>{formatted.time}</Text>
          </View>

          <Text style={styles.type}>{item.type || 'Consultation'}</Text>
        </View>

        <TouchableOpacity
          style={styles.selectButton}
          activeOpacity={0.85}
          onPress={() => handleSelectSlot(item)}
        >
          <Text style={styles.selectText}>Select</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={26} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.title}>Available Slots</Text>
          <Text style={styles.subtitle}>
            {ca?.firmName
              ? `Choose a time with ${ca.firmName}`
              : 'Choose a time to request consultation'}
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text style={styles.muted}>Loading availability...</Text>
        </View>
      ) : (
        <FlatList
          data={slots}
          keyExtractor={(item, index) => String(item.id || item._id || index)}
          renderItem={renderSlot}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Icon name="calendar-remove-outline" size={54} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No slots available</Text>
              <Text style={styles.emptyText}>
                This CA has not published availability yet.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default CAAvailabilityScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  slotCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  slotInfo: {
    flex: 1,
    paddingRight: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  time: {
    marginLeft: 8,
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
  type: {
    marginTop: 2,
    fontSize: 12,
    color: '#64748B',
  },
  selectButton: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  selectText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  muted: {
    marginTop: 10,
    color: '#64748B',
  },
  emptyTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});