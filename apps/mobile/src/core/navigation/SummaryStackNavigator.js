import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import TaxSummaryScreen from '@/features/summary/screens/TaxSummaryScreen';

const Stack = createStackNavigator();

const SummaryStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TaxSummary" component={TaxSummaryScreen} />
    </Stack.Navigator>
  );
};

export default SummaryStackNavigator;