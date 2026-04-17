import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import DashboardScreen from '@/features/dashboard/screens/DashboardScreen';
import TripDetailScreen from '@/features/common/screens/TripDetailScreen';
import FindCAScreen from '@/features/common/screens/FindCAScreen';
import CAHubScreen from '@/features/ca-portal/hub/screens/CAHubScreen';
import CADirectoryScreen from '@/features/ca-directory/screens/CADirectoryScreen';
import CADetailScreen from '@/features/ca-directory/screens/CADetailScreen';
import BookAppointmentScreen from '@/features/ca/screens/BookAppointmentScreen';

const Stack = createStackNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="TripDetail" component={TripDetailScreen} />
      <Stack.Screen name="FindCA" component={FindCAScreen} />
      <Stack.Screen name="CAHub" component={CAHubScreen} />
      <Stack.Screen name="CADirectory" component={CADirectoryScreen} />
      <Stack.Screen name="CADetail" component={CADetailScreen} />
      <Stack.Screen name="BookCAAppointment" component={BookAppointmentScreen} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
