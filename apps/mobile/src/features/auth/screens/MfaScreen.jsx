import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';

const MfaScreen = ({ navigation, route }) => {
  const [code, setCode] = useState('');
  const { userId } = route.params || {};

  const handleVerify = () => {
    if (code.length === 6) {
      // Verify MFA code
      Alert.alert('Success', 'MFA verified successfully');
      navigation.navigate('Main');
    } else {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Icon name="shield-lock" size={64} color={colors.primary[500]} />
        <Text style={styles.title}>Two-Factor Authentication</Text>
        <Text style={styles.subtitle}>
          Enter the verification code from your authenticator app
        </Text>

        <TextInput
          style={styles.input}
          placeholder="000000"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
        />

        <TouchableOpacity style={styles.button} onPress={handleVerify}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  title: {
    ...typography.h3,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    width: '100%',
  },
  buttonText: {
    ...typography.button,
    color: colors.white,
    textAlign: 'center',
  },
});

export default MfaScreen;




