import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import TaxProfileScreen from '@/features/taxProfile/screens/TaxProfileScreen';
import HelpSupportScreen from '@/features/support/screens/HelpSupportScreen';
import SettingsScreen from '@/features/profile/screens/SettingsScreen';
import ProfileScreen from '@/features/profile/screens/ProfileScreen';

const Stack = createStackNavigator();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
      <Stack.Screen name="TaxProfile" component={TaxProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;