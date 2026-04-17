import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import CABottomTabNavigator from './CABottomTabNavigator';
import CAClientsScreen from '@/features/ca-portal/clients/screens/CAClientsScreen';
import CARequestsScreen from '@/features/ca-portal/requests/CARequestsScreen';
import CAPlannerScreen from '@/features/ca/screens/CAPlannerScreen';
import CAMessagesScreen from '@/features/ca/screens/CAMessagesScreen';
import CAProfileScreen from '@/features/ca-portal/profile/screens/CAProfileScreen';
import CAAnalyticsScreen from '@/features/ca-portal/analytics/screens/CAAnalyticsScreen';
import { useAuth } from '@/features/auth/context/AuthContext';

const Drawer = createDrawerNavigator();

const getDrawerItems = () => {
  return [
    { label: 'Dashboard', icon: 'view-dashboard-outline', route: 'CADashboardHome' },
    { label: 'Clients', icon: 'account-group-outline', route: 'CAClients' },
    { label: 'Pending Requests', icon: 'clipboard-text-outline', route: 'CARequests' },
    { label: 'Consultations', icon: 'calendar-check-outline', route: 'CAConsultations' },
    { label: 'Planner', icon: 'calendar-month-outline', route: 'CAPlanner' },
    { label: 'Messages', icon: 'message-processing-outline', route: 'CAMessages' },
    { label: 'Analytics', icon: 'chart-box-outline', route: 'CAAnalytics' },
    { label: 'Profile', icon: 'account-circle-outline', route: 'CAProfile' },
  ];
};

const CustomDrawerContent = (props) => {
  const { user, logout } = useAuth();
  const activeRoute = props.state.routeNames[props.state.index];
  const drawerItems = getDrawerItems();

  const firstName =
    user?.firstName ||
    user?.name?.split?.(' ')?.[0] ||
    user?.fullName?.split?.(' ')?.[0] ||
    'CA';

  const caName = user?.name || `Welcome back, ${firstName}`;
  const caSubtitle = user?.email || 'Chartered Accountant';
  const practiceSummary = [
    user?.firmName || 'TaxVault Advisory',
    user?.caNumber ? `CA #${user.caNumber}` : null,
    user?.specialization || 'Tax Practice',
  ]
    .filter(Boolean)
    .join(' • ');

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>TaxVault CA</Text>
        <Text style={styles.subText}>{caName}</Text>
        {!!caSubtitle && <Text style={styles.secondaryText}>{caSubtitle}</Text>}
        {!!practiceSummary && <Text style={styles.profileSummary}>{practiceSummary}</Text>}
      </View>

      <View style={styles.menuContent}>
        {drawerItems.map((item) => {
          const isFocused = activeRoute === item.route;

          return (
            <TouchableOpacity
              key={`${item.route}-${item.label}`}
              activeOpacity={0.8}
              style={[styles.drawerItem, isFocused && styles.drawerItemActive]}
              onPress={() => {
                if (item.route === 'CAConsultations') {
                  props.navigation.closeDrawer();
                  props.navigation.getParent()?.navigate('CAConsultations');
                  return;
                }

                props.navigation.closeDrawer();
                props.navigation.navigate(item.route);
              }}
            >
              <Icon
                name={item.icon}
                size={22}
                color={isFocused ? '#2563EB' : '#475569'}
              />
              <Text
                style={[
                  styles.drawerLabel,
                  isFocused && styles.drawerLabelActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.logoutButton}
        onPress={logout}
      >
        <Icon name="logout" size={20} color="#DC2626" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const CADrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="CADashboardHome"
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        swipeEnabled: true,
        overlayColor: 'rgba(15, 23, 42, 0.22)',
        drawerStyle: {
          width: 290,
          backgroundColor: '#FFFFFF',
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="CADashboardHome" component={CABottomTabNavigator} />
      <Drawer.Screen name="CAClients" component={CAClientsScreen} />
      <Drawer.Screen name="CARequests" component={CARequestsScreen} />
      <Drawer.Screen name="CAPlanner" component={CAPlannerScreen} />
      <Drawer.Screen name="CAMessages" component={CAMessagesScreen} />
      <Drawer.Screen name="CAAnalytics" component={CAAnalyticsScreen} />
      <Drawer.Screen name="CAProfile" component={CAProfileScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 12,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  subText: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  secondaryText: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
  },
  profileSummary: {
    marginTop: 8,
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '700',
  },
  menuContent: {
    flex: 1,
    paddingBottom: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 6,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 16,
  },
  drawerItemActive: {
    backgroundColor: '#EFF6FF',
  },
  drawerLabel: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  drawerLabelActive: {
    color: '#2563EB',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
  },
});

export default CADrawerNavigator;
