import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '@/features/auth/context/AuthContext';
import CAStatusCard from '@/features/ca/components/CAStatusCard';
import { MOCK_APPOINTMENTS } from '@/features/ca/config/caMockData';
import getCAState from '@/features/ca/utils/buildCAUserState';

const CAHubScreen = ({ navigation }) => {
  const { user } = useAuth();

  const caState = useMemo(() => getCAState(user || {}), [user]);

  const upcomingAppointment = caState?.appointments?.[0] || MOCK_APPOINTMENTS[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Your CA Support</Text>
        <Text style={styles.subtitle}>
          Search for a CA, chat with your assigned CA, and book appointments for review or filing.
        </Text>

        <CAStatusCard
          hasAssignedCA={caState.hasAssignedCA}
          assignedCA={caState.assignedCA}
          readiness={caState.readiness}
          onFindCA={() => navigation.navigate('CADirectory')}
          onChat={() => navigation.navigate('CAChat')}
          onBook={() =>
            navigation.navigate('BookCAAppointment', {
              ca: caState.assignedCA,
              appointmentType: caState?.readiness?.recommendedAppointmentType,
            })
          }
        />

        {caState.hasAssignedCA && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your actions</Text>

              <View style={styles.actionGrid}>
                <TouchableOpacity
                  style={styles.actionCard}
                  onPress={() => navigation.navigate('CAChat')}
                >
                  <Icon name="chat-processing-outline" size={22} color="#2563EB" />
                  <Text style={styles.actionTitle}>Chat with CA</Text>
                  <Text style={styles.actionSubtitle}>Ask tax or document questions</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionCard}
                  onPress={() =>
                    navigation.navigate('BookCAAppointment', {
                      ca: caState.assignedCA,
                      appointmentType: 'Consultation',
                    })
                  }
                >
                  <Icon name="calendar-plus" size={22} color="#2563EB" />
                  <Text style={styles.actionTitle}>Book visit</Text>
                  <Text style={styles.actionSubtitle}>Choose date and time</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionCard}
                  onPress={() =>
                    navigation.navigate('BookCAAppointment', {
                      ca: caState.assignedCA,
                      appointmentType: 'Tax Filing Appointment',
                    })
                  }
                >
                  <Icon name="file-check-outline" size={22} color="#2563EB" />
                  <Text style={styles.actionTitle}>Request filing</Text>
                  <Text style={styles.actionSubtitle}>When documents are ready</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionCard}
                  onPress={() => navigation.navigate('Documents')}
                >
                  <Icon name="folder-outline" size={22} color="#2563EB" />
                  <Text style={styles.actionTitle}>Open documents</Text>
                  <Text style={styles.actionSubtitle}>Review uploaded files</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Upcoming appointment</Text>

              <View style={styles.appointmentCard}>
                <Text style={styles.appointmentType}>{upcomingAppointment?.type}</Text>
                <Text style={styles.appointmentMeta}>
                  {upcomingAppointment?.dateLabel} • {upcomingAppointment?.mode}
                </Text>
                <Text style={styles.appointmentStatus}>
                  Status: {upcomingAppointment?.status}
                </Text>
              </View>
            </View>
          </>
        )}

        {!caState.hasAssignedCA && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why book a CA?</Text>

            <View style={styles.benefitCard}>
              <View style={styles.benefitRow}>
                <Icon name="check-circle-outline" size={18} color="#0F766E" />
                <Text style={styles.benefitText}>Understand your filing requirements</Text>
              </View>

              <View style={styles.benefitRow}>
                <Icon name="check-circle-outline" size={18} color="#0F766E" />
                <Text style={styles.benefitText}>Ask about gig work, business, RRSP, FHSA, and more</Text>
              </View>

              <View style={styles.benefitRow}>
                <Icon name="check-circle-outline" size={18} color="#0F766E" />
                <Text style={styles.benefitText}>Book a tax consultation before filing</Text>
              </View>

              <TouchableOpacity
                style={styles.primaryWideButton}
                onPress={() => navigation.navigate('CADirectory')}
              >
                <Icon name="account-search-outline" size={18} color="#FFFFFF" />
                <Text style={styles.primaryWideButtonText}>Browse available CAs</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CAHubScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F8FC',
  },
  container: {
    padding: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 22,
    color: '#64748B',
    marginBottom: 18,
  },
  section: {
    marginTop: 6,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5EAF2',
    marginBottom: 12,
    minHeight: 132,
  },
  actionTitle: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  actionSubtitle: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: '#64748B',
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5EAF2',
  },
  appointmentType: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
  },
  appointmentMeta: {
    marginTop: 6,
    fontSize: 14,
    color: '#334155',
    fontWeight: '700',
  },
  appointmentStatus: {
    marginTop: 8,
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  benefitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5EAF2',
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
  },
  primaryWideButton: {
    marginTop: 8,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  primaryWideButtonText: {
    marginLeft: 8,
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
  },
});


