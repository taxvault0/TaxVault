import 'react-native-gesture-handler';
import React, { useCallback } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider } from '@/features/auth/context/AuthContext';
import { ThemeProvider } from '@/core/providers/ThemeContext';
import AppNavigator from '@/core/navigation/AppNavigator';
import { paperTheme } from '@/styles/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient();

export default function App() {
  const onNavigationReady = useCallback(async () => {
    try {
      await SplashScreen.hideAsync();
      console.log('✅ Splash screen hidden');
    } catch (error) {
      console.log('❌ Splash hide failed:', error);
    }
  }, []);

  console.log('✅ App rendered');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <PaperProvider theme={paperTheme}>
            <ThemeProvider>
              <AuthProvider>
                <NavigationContainer onReady={onNavigationReady}>
                  <AppNavigator />
                </NavigationContainer>
              </AuthProvider>
            </ThemeProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}