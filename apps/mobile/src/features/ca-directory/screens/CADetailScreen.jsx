import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CADetailScreen = ({ navigation, route }) => {
  const ca = route?.params?.ca;

  if (!ca) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>CA profile not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.iconWrap}>
            <Icon name={ca.avatarIcon || 'account-tie-outline'} size={28} color="#2563EB" />
          </View>

          <Text style={styles.name}>{ca.name}</Text>
          <Text style={styles.title}>{ca.title}</Text>
          <Text style={styles.location}>{ca.location}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>Consultation ${ca.consultationFee}</Text>
            <Text style={styles.metaText}>Filing from ${ca.filingFeeFrom}</Text>
            <Text style={styles.metaText}>⭐ {ca.rating}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Specialties</Text>
          <View style={styles.tagsRow}>
            {ca.specialization?.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Languages</Text>
          <Text style={styles.bodyText}>{(ca.languages || []).join(', ')}</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bodyText}>{ca.bio}</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Available times</Text>
          {(ca.availableSlots || []).map((slot) => (
            <View key={slot} style={styles.slotRow}>
              <Icon name="calendar-clock-outline" size={18} color="#0F766E" />
              <Text style={styles.slotText}>{slot}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            navigation.navigate('BookCAAppointment', {
              ca,
              appointmentType: 'Consultation',
            })
          }
        >
          <Icon name="calendar-plus" size={18} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Book Consultation</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CADetailScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F8FC',
  },
  container: {
    padding: 20,
    paddingBottom: 30,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5EAF2',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  title: {
    marginTop: 6,
    fontSize: 14,
    color: '#475569',
    fontWeight: '700',
    textAlign: 'center',
  },
  location: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
    justifyContent: 'center',
  },
  metaText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5EAF2',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5EAF2',
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  slotText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#334155',
    fontWeight: '700',
  },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    marginLeft: 8,
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
  },
});


