import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import CADashboardScreen from '@/features/ca-portal/dashboard/screens/CADashboardScreen';
import CAClientsScreen from '@/features/ca-portal/clients/screens/CAClientsScreen';
import CARequestsScreen from '@/features/ca-portal/requests/CARequestsScreen';
import CAPlannerScreen from '@/features/ca/screens/CAPlannerScreen';
import CAMessagesScreen from '@/features/ca/screens/CAMessagesScreen';
import CAProfileScreen from '@/features/ca-portal/profile/screens/CAProfileScreen';

const Tab = createBottomTabNavigator();

const getTabIcon = (routeName, color, size) => {
  switch (routeName) {
    case 'CADashboard':
      return <Icon name="view-dashboard-outline" size={size} color={color} />;
    case 'CAClients':
      return <Icon name="account-group-outline" size={size} color={color} />;
    case 'CARequests':
      return <Icon name="clipboard-text-outline" size={size} color={color} />;
    case 'CAPlanner':
      return <Icon name="calendar-month-outline" size={size} color={color} />;
    case 'CAMessages':
      return <Icon name="message-processing-outline" size={size} color={color} />;
    case 'CAProfile':
      return <Icon name="account-circle-outline" size={size} color={color} />;
    default:
      return <Icon name="circle-outline" size={size} color={color} />;
  }
};

const CABottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="CADashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          height: 70,
          paddingTop: 8,
          paddingBottom: 10,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          backgroundColor: '#FFFFFF',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
        tabBarIcon: ({ color, size }) => getTabIcon(route.name, color, size),
      })}
    >
      <Tab.Screen
        name="CADashboard"
        component={CADashboardScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="CAClients"
        component={CAClientsScreen}
        options={{ title: 'Clients' }}
      />
      <Tab.Screen
        name="CARequests"
        component={CARequestsScreen}
        options={{ title: 'Requests' }}
      />
      <Tab.Screen
        name="CAPlanner"
        component={CAPlannerScreen}
        options={{ title: 'Planner' }}
      />
      <Tab.Screen
        name="CAMessages"
        component={CAMessagesScreen}
        options={{ title: 'Messages' }}
      />
      <Tab.Screen
        name="CAProfile"
        component={CAProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default CABottomTabNavigator;


