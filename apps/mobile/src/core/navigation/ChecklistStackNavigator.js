import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ChecklistScreen from '@/features/checklist/screens/ChecklistScreen';

const Stack = createStackNavigator();

const ChecklistStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChecklistHome" component={ChecklistScreen} />
    </Stack.Navigator>
  );
};

export default ChecklistStackNavigator;