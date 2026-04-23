import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import CADrawerNavigator from '@/core/navigation/CADrawerNavigator';

import CAChatScreen from '@/features/ca-portal/chat/CAChatScreen';
import CAMeetingsScreen from '@/features/ca-portal/meetings/CAMeetingsScreen';
import CAAnalyticsScreen from '@/features/ca-portal/analytics/screens/CAAnalyticsScreen';
import CAClientsScreen from '@/features/ca-portal/clients/screens/CAClientsScreen';
import CAClientDetailScreen from '@/features/ca-portal/clients/screens/CAClientDetailScreen';
import CAProfileScreen from '@/features/ca-portal/profile/screens/CAProfileScreen';
import CARequestDetailsScreen from '@/features/ca/requests/screens/CARequestDetailsScreen';

import ClientSearchScreen from '@/features/ca/screens/ClientSearchScreen';
import QRScannerScreen from '@/features/ca/screens/QRScannerScreen';

import CameraScreen from '@/features/common/screens/CameraScreen';
import SettingsScreen from '@/features/settings/screens/SettingsScreen';
import CAOfficeHoursScreen from '@/features/settings/screens/CAOfficeHoursScreen';
import DocumentsScreen from '@/features/documents/screens/DocumentsScreen';
import IncomeDocumentsScreen from '@/features/documents/screens/IncomeDocumentsScreen';
import VehicleExpensesScreen from '@/features/documents/screens/VehicleExpensesScreen';

import CAClientRequestsScreen from '@/features/ca/requests/screens/CAClientRequestsScreen';

import CAConsultationsScreen from '@/features/consultations/screens/CAConsultationsScreen';
import ManageConsultationScreen from '@/features/consultations/screens/ManageConsultationScreen';

const Stack = createStackNavigator();

const CAStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="CAHome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="CAHome" component={CADrawerNavigator} />

      <Stack.Screen name="ClientDetail" component={CAClientDetailScreen} />
      <Stack.Screen name="CAClientDetails" component={CAClientDetailScreen} />
      <Stack.Screen name="CAChat" component={CAChatScreen} />
      <Stack.Screen name="CAMeetings" component={CAMeetingsScreen} />
      <Stack.Screen name="ClientSearch" component={ClientSearchScreen} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      <Stack.Screen name="CAProfile" component={CAProfileScreen} />
      <Stack.Screen name="CAAnalytics" component={CAAnalyticsScreen} />
      <Stack.Screen name="CAClients" component={CAClientsScreen} />

      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ presentation: 'modal' }}
      />

      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="CAOfficeHours" component={CAOfficeHoursScreen} />
      <Stack.Screen name="Documents" component={DocumentsScreen} />
      <Stack.Screen name="IncomeDocuments" component={IncomeDocumentsScreen} />
      <Stack.Screen name="VehicleExpenses" component={VehicleExpensesScreen} />

      <Stack.Screen name="CARequests" component={CAClientRequestsScreen} />
      <Stack.Screen
        name="CARequestDetails"
        component={CARequestDetailsScreen}
      />

      <Stack.Screen
        name="CAConsultations"
        component={CAConsultationsScreen}
      />
      <Stack.Screen
        name="ManageConsultation"
        component={ManageConsultationScreen}
      />
    </Stack.Navigator>
  );
};

export default CAStackNavigator;