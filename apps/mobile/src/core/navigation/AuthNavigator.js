import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { useAuth } from '@/features/auth/context/AuthContext';

import RoleSelectionScreen from '@/features/auth/screens/RoleSelectionScreen';
import LoginScreen from '@/features/auth/screens/LoginScreen';
import RegisterUserScreen from '@/features/auth/screens/registerUser';
import LoginScreenCA from '@/features/auth/screens/LoginScreenCA';
import RegisterCAScreen from '@/features/auth/screens/registerCA';
import ForgotPasswordScreen from '@/features/auth/screens/ForgotPasswordScreen';
import MfaScreen from '@/features/auth/screens/MfaScreen';

import ConversationsScreen from '@/features/chat/screens/ConversationsScreen';
import ChatScreen from '@/features/chat/screens/ChatScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  const { isAuthenticated, user } = useAuth();

  const isCA =
    user?.role === 'ca' ||
    user?.roleType === 'ca' ||
    user?.userType === 'ca' ||
    user?.userType === 'professional';

  const isCARegistrationIncomplete =
    isAuthenticated &&
    isCA &&
    (
      !String(user?.firmName || '').trim() ||
      !String(user?.caNumber || '').trim()
    );

  const initialRouteName = isCARegistrationIncomplete
    ? 'RegisterScreenCA'
    : 'RoleSelection';

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterUserScreen} />
      <Stack.Screen name="LoginScreenCA" component={LoginScreenCA} />
      <Stack.Screen name="RegisterScreenCA" component={RegisterCAScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Mfa" component={MfaScreen} />
      <Stack.Screen
        name="ConversationsScreen"
        component={ConversationsScreen}
        options={{ title: 'Messages' }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ title: 'Chat' }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;