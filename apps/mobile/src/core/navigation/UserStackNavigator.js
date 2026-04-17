import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AppDrawerNavigator from './AppDrawerNavigator';
import CameraScreen from '@/features/common/screens/CameraScreen';

// Consultations
import BookConsultationScreen from '@/features/consultations/screens/BookConsultationScreen';
import MyConsultationsScreen from '@/features/consultations/screens/MyConsultationsScreen';
import ConsultationDetailsScreen from '@/features/consultations/screens/ConsultationDetailsScreen';

// 🔥 NEW FEATURES
import CAListScreen from '@/features/ca-directory/screens/CAListScreen';
import CAProfileScreen from '@/features/ca-portal/profile/screens/CAProfileScreen';
import CRAUpdatesScreen from '@/features/cra/screens/CRAUpdatesScreen';
import TaxExtractionReviewScreen from '@/features/tax/screens/TaxExtractionReviewScreen';

const Stack = createStackNavigator();

const UserStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      {/* MAIN APP */}
      <Stack.Screen name="AppDrawer" component={AppDrawerNavigator} />

      {/* CAMERA */}
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ presentation: 'modal' }}
      />

      {/* CONSULTATIONS */}
      <Stack.Screen
        name="MyConsultations"
        component={MyConsultationsScreen}
      />
      <Stack.Screen
        name="BookConsultation"
        component={BookConsultationScreen}
      />
      <Stack.Screen
        name="ConsultationDetails"
        component={ConsultationDetailsScreen}
      />

      {/* 🔥 CA DIRECTORY */}
      <Stack.Screen
        name="FindCA"
        component={CAListScreen}
      />
      <Stack.Screen
        name="CAProfile"
        component={CAProfileScreen}
      />

      {/* 🔥 CRA UPDATES */}
      <Stack.Screen
        name="CRAUpdates"
        component={CRAUpdatesScreen}
      />

      {/* 🔥 TAX EXTRACTION */}
      <Stack.Screen
        name="TaxExtractionReview"
        component={TaxExtractionReviewScreen}
      />

    </Stack.Navigator>
  );
};

export default UserStackNavigator;
