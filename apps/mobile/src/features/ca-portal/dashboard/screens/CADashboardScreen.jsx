import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import CAHeroCard from '@/features/ca/components/CAHeroCard';
import PlannerTaskCard from '@/features/ca/components/PlannerTaskCard';
import LeadRequestCard from '@/features/ca/components/LeadRequestCard';
import ClientCard from '@/features/ca/components/ClientCard';
import { caStats, caPlannerTasks, caRequests, caClients } from '@/features/ca/config/caMockData';

const DashboardStatTile = ({ title, value, subtitle, icon, onPress }) => {
  return (
    <TouchableOpacity style={styles.statTile} activeOpacity={0.88} onPress={onPress}>
      <View style={styles.statIconWrap}>
        <Icon name={icon} size={20} color="#2563EB" />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
};

const CADashboardScreen = () => {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.topIconButton} activeOpacity={0.85} onPress={openDrawer}>
            <Icon name="menu" size={24} color="#111827" />
          </TouchableOpacity>

          <View style={styles.topBarText}>
            <Text style={styles.screenEyebrow}>CA Workspace</Text>
            <Text style={styles.screenTitle}>Dashboard</Text>
          </View>

          <TouchableOpacity
            style={styles.topIconButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('CAProfile')}
          >
            <Icon name="account-circle-outline" size={24} color="#2563EB" />
          </TouchableOpacity>
        </View>

        <CAHeroCard name="Gaurav" stats={caStats} />

        <View style={styles.statsGrid}>
          <DashboardStatTile
            title="Active Clients"
            value={caStats.activeClients}
            subtitle="Open client directory"
            icon="account-group-outline"
            onPress={() => navigation.navigate('CAClients')}
          />

          <DashboardStatTile
            title="Pending Requests"
            value={caStats.pendingRequests}
            subtitle="New consultations"
            icon="clipboard-text-clock-outline"
            onPress={() => navigation.navigate('CARequests')}
          />

          <DashboardStatTile
            title="Unread Messages"
            value={caStats.unreadMessages}
            subtitle="Client inbox"
            icon="message-processing-outline"
            onPress={() => navigation.navigate('CAMessages')}
          />

          <DashboardStatTile
            title="Analytics"
            value="View"
            subtitle="Practice insights"
            icon="chart-box-outline"
            onPress={() => navigation.navigate('CAAnalytics')}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Planner</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('CAPlanner')}
            >
              <Text style={styles.linkText}>Open Calendar</Text>
            </TouchableOpacity>
          </View>

          {caPlannerTasks.slice(0, 3).map((task) => (
            <PlannerTaskCard key={task.id} task={task} />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Consultation Requests</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('CARequests')}
            >
              <Text style={styles.linkText}>See All</Text>
            </TouchableOpacity>
          </View>

          {caRequests.slice(0, 2).map((request) => (
            <LeadRequestCard
              key={request.id}
              request={request}
              onPress={() => navigation.navigate('CARequestDetails', { requestId: request.id })}
            />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Clients</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('CAClients')}
            >
              <Text style={styles.linkText}>Open Clients</Text>
            </TouchableOpacity>
          </View>

          {caClients.slice(0, 3).map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onPress={() => navigation.navigate('ClientDetail', { clientId: client.id })}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default CADashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  topBar: {
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBarText: {
    flex: 1,
    paddingHorizontal: 12,
  },
  topIconButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenEyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  screenTitle: {
    marginTop: 4,
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  statsGrid: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statTile: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  statIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  statTitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  statSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  section: {
    marginTop: 10,
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    paddingRight: 10,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
});


