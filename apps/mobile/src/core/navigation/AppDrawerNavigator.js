import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import MainTabNavigator from './MainTabNavigator';
import { useAuth } from '@/features/auth/context/AuthContext';

const Drawer = createDrawerNavigator();

const drawerItems = [
  {
    label: 'Home',
    icon: 'view-dashboard-outline',
    navigateTo: {
      screen: 'Home',
      params: { screen: 'Dashboard' },
    },
  },
  {
    label: 'Documents',
    icon: 'file-document-outline',
    navigateTo: {
      screen: 'Documents',
      params: { screen: 'DocumentsHome' },
    },
  },

  // 🔥 NEW FEATURES
  {
    label: 'Find a CA',
    icon: 'account-search-outline',
    navigateTo: {
      screen: 'FindCA',
    },
  },
  {
    label: 'CRA Updates',
    icon: 'newspaper-variant-outline',
    navigateTo: {
      screen: 'CRAUpdates',
    },
  },
  {
    label: 'Tax Extraction',
    icon: 'file-search-outline',
    navigateTo: {
      screen: 'TaxExtractionReview',
    },
  },

  {
    label: 'Consultations',
    icon: 'calendar-check-outline',
    navigateTo: {
      screen: 'MyConsultations',
    },
  },
  {
    label: 'Checklist',
    icon: 'format-list-checks',
    navigateTo: {
      screen: 'Checklist',
      params: { screen: 'ChecklistHome' },
    },
  },
  {
    label: 'Summary',
    icon: 'chart-box-outline',
    navigateTo: {
      screen: 'Summary',
      params: { screen: 'TaxSummary' },
    },
  },
  {
    label: 'Profile',
    icon: 'account-outline',
    navigateTo: {
      screen: 'Profile',
      params: { screen: 'ProfileHome' },
    },
  },
  {
    label: 'Settings',
    icon: 'cog-outline',
    navigateTo: {
      screen: 'Profile',
      params: { screen: 'Settings' },
    },
  },
  {
    label: 'Help & Support',
    icon: 'help-circle-outline',
    navigateTo: {
      screen: 'Profile',
      params: { screen: 'HelpSupport' },
    },
  },
];

const CustomDrawerContent = (props) => {
  const { user, logout } = useAuth();

  const firstName =
    user?.firstName ||
    user?.name?.split?.(' ')?.[0] ||
    user?.fullName?.split?.(' ')?.[0] ||
    'User';

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>TaxVault</Text>
          <Text style={styles.subText}>
            {user?.name || user?.email || `Welcome back, ${firstName}`}
          </Text>
        </View>

        <View style={styles.menuContent}>
          {drawerItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.8}
              style={styles.drawerItem}
              onPress={() => {
                props.navigation.closeDrawer();

                // 🔥 STACK SCREENS (NEW FEATURES)
                if (
                  item.navigateTo?.screen === 'FindCA' ||
                  item.navigateTo?.screen === 'CRAUpdates' ||
                  item.navigateTo?.screen === 'TaxExtractionReview'
                ) {
                  props.navigation.getParent()?.navigate(item.navigateTo.screen);
                  return;
                }

                // EXISTING STACK SCREEN
                if (item.navigateTo?.screen === 'MyConsultations') {
                  props.navigation.getParent()?.navigate('MyConsultations');
                  return;
                }

                // DEFAULT TAB NAVIGATION
                props.navigation.navigate('MainTabs', item.navigateTo);
              }}
            >
              <Icon name={item.icon} size={22} color="#475569" />
              <Text style={styles.drawerLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.logoutButton}
          onPress={logout}
        >
          <Icon name="logout" size={20} color="#DC2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AppDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        overlayColor: 'rgba(15, 23, 42, 0.22)',
        drawerStyle: {
          width: 290,
          backgroundColor: '#FFFFFF',
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="MainTabs" component={MainTabNavigator} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingTop: 0,
    paddingBottom: 12,
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
    fontSize: 13,
    color: '#64748B',
  },
  menuContent: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  drawerLabel: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
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

export default AppDrawerNavigator;