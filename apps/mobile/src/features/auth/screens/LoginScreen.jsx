import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { theme } from '@/styles/theme';
import { useAuth } from '@/features/auth/context/AuthContext';
import { demoUsers, ENABLE_DEMO_LOGINS } from '@/features/auth/utils/loginScenarios';
import {
  validateLoginForm,
  getRememberedDemoPayload,
} from '@/features/auth/utils/loginHelpers';
import styles from './LoginScreen.styles';

const { colors } = theme;

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showDemoDropdown, setShowDemoDropdown] = useState(false);
  const [selectedDemoLabel, setSelectedDemoLabel] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const title = useMemo(() => 'Sign in as Individual User', []);
  const subtitle = useMemo(
    () => 'Access receipts, mileage, documents, and tax tools.',
    []
  );

  const handleLoginWithCredentials = async (loginEmail, loginPassword) => {
    try {
      setSubmitting(true);
      setServerError('');

      const result = await login(
        loginEmail.trim().toLowerCase(),
        loginPassword.trim(),
        'user'
      );

      if (!result?.success) {
        setServerError(
          result?.message || 'Unable to sign in. Please check your credentials.'
        );
        return;
      }

      navigation.replace('UserApp');
    } catch (error) {
      console.log('Login error', error);
      setServerError(error?.message || 'Something went wrong during sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async () => {
    const validationErrors = validateLoginForm({ email, password }, 'user');
    setErrors(validationErrors);
    setServerError('');

    if (Object.keys(validationErrors).length > 0) return;

    await handleLoginWithCredentials(email, password);
  };

  const handleSelectDemoUser = async (demoUser) => {
    const remembered = getRememberedDemoPayload(demoUser);

    setSelectedDemoLabel(demoUser.title);
    setEmail(remembered.email);
    setPassword(remembered.password);
    setErrors({});
    setServerError('');
    setShowDemoDropdown(false);

    await handleLoginWithCredentials(remembered.email, remembered.password);
  };

  const handleGoToRegister = () => {
    navigation.navigate('RegisterScreen', { userType: 'user' });
  };

  const handleChangeRole = () => {
    navigation.navigate('RoleSelection');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.topSection}>
              <View style={styles.brandBadge}>
                <Icon
                  name="shield-check-outline"
                  size={22}
                  color={colors.primary}
                />
                <Text style={styles.brandText}>TaxVault</Text>
              </View>

              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>

              <View style={styles.roleSummary}>
                <Icon name="account" size={18} color={colors.primary} />
                <Text style={styles.roleSummaryText}>Individual User</Text>
              </View>
            </View>

            <View style={styles.formCard}>
              {ENABLE_DEMO_LOGINS && (
                <>
                  <Text style={styles.sectionTitle}>Demo accounts</Text>

                  <TouchableOpacity
                    style={styles.dropdownTrigger}
                    onPress={() => setShowDemoDropdown((prev) => !prev)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.dropdownTriggerLeft}>
                      <Icon
                        name="account-multiple-outline"
                        size={20}
                        color={colors.text.secondary}
                      />
                      <Text
                        style={[
                          styles.dropdownTriggerText,
                          !selectedDemoLabel && styles.dropdownPlaceholderText,
                        ]}
                      >
                        {selectedDemoLabel || 'Choose a demo account'}
                      </Text>
                    </View>

                    <Icon
                      name={showDemoDropdown ? 'chevron-up' : 'chevron-down'}
                      size={22}
                      color={colors.text.secondary}
                    />
                  </TouchableOpacity>

                  {showDemoDropdown && (
                    <View style={styles.dropdownMenu}>
                      {demoUsers.map((demoUser) => (
                        <TouchableOpacity
                          key={demoUser.email}
                          style={styles.dropdownItem}
                          onPress={() => handleSelectDemoUser(demoUser)}
                          activeOpacity={0.8}
                        >
                          <View style={styles.dropdownItemLeft}>
                            <Icon
                              name="account-circle-outline"
                              size={20}
                              color={colors.primary}
                            />
                            <View>
                              <Text style={styles.dropdownItemTitle}>
                                {demoUser.title}
                              </Text>
                              <Text style={styles.dropdownItemSubtitle}>
                                {demoUser.email}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </>
              )}

              <Text style={styles.sectionTitle}>Login details</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email address</Text>
                <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                  <Icon
                    name="email-outline"
                    size={20}
                    color={colors.text.secondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.text.tertiary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={(value) => {
                      setEmail(value);
                      if (errors.email) {
                        setErrors((prev) => ({ ...prev, email: '' }));
                      }
                    }}
                  />
                </View>
                {!!errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View
                  style={[styles.inputWrapper, errors.password && styles.inputError]}
                >
                  <Icon
                    name="lock-outline"
                    size={20}
                    color={colors.text.secondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.text.tertiary}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={password}
                    onChangeText={(value) => {
                      setPassword(value);
                      if (errors.password) {
                        setErrors((prev) => ({ ...prev, password: '' }));
                      }
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((prev) => !prev)}
                    style={styles.eyeButton}
                    activeOpacity={0.8}
                  >
                    <Icon
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.text.secondary}
                    />
                  </TouchableOpacity>
                </View>
                {!!errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              <TouchableOpacity
                onPress={handleForgotPassword}
                style={styles.forgotPasswordButton}
                activeOpacity={0.8}
              >
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>

              {!!serverError && (
                <View style={styles.serverErrorBox}>
                  <Icon name="alert-circle-outline" size={18} color={colors.error} />
                  <Text style={styles.serverErrorText}>{serverError}</Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.primaryButton, submitting && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={submitting}
                activeOpacity={0.9}
              >
                {submitting ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>Sign In</Text>
                    <Icon name="arrow-right" size={20} color={colors.white} />
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleGoToRegister}
                activeOpacity={0.85}
              >
                <Text style={styles.secondaryButtonText}>Create user account</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.changeRoleButton}
                onPress={handleChangeRole}
                activeOpacity={0.8}
              >
                <Icon
                  name="swap-horizontal"
                  size={18}
                  color={colors.text.secondary}
                />
                <Text style={styles.changeRoleText}>Change role</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;