import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,  // Only import StyleSheet once, here
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { authAPI } from '@/services/api';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      setSubmitted(true);
      Alert.alert(
        'Success',
        'Password reset instructions have been sent to your email'
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to send reset email'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            {submitted
              ? 'Check your email for reset instructions'
              : 'Enter your email to receive password reset instructions'}
          </Text>
        </View>

        {!submitted ? (
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={[styles.resetButton, loading && styles.resetButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.resetButtonText}>Send Reset Instructions</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>✉️</Text>
            <Text style={styles.successText}>
              We've sent an email to {email} with instructions to reset your password.
            </Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Text style={styles.loginButtonText}>Return to Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  backButton: {
    marginBottom: spacing.xl,
  },
  backText: {
    ...typography.body,
    color: colors.primary[500], // Fixed: added [500]
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    ...typography.body,
    color: colors.text.primary,
  },
  resetButton: {
    backgroundColor: colors.primary[500], // Fixed: added [500]
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  resetButtonDisabled: {
    opacity: 0.7,
  },
  resetButtonText: {
    ...typography.button,
    color: colors.white,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  successText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  loginButton: {
    backgroundColor: colors.primary[500], // Fixed: added [500]
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    width: '100%',
  },
  loginButtonText: {
    ...typography.button,
    color: colors.white,
  },
});

export default ForgotPasswordScreen;



