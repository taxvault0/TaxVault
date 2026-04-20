import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/features/auth/context/AuthContext';

import styles from './LoginScreenCA.styles';

const LoginScreenCA = () => {
  const navigation = useNavigation();
  const { login, demoLogin } = useAuth();

  const [email, setEmail] = useState('ca@demo.com');
  const [password, setPassword] = useState('demo1234');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    setLoading(true);
    const result = await login(email, password, 'ca');
    setLoading(false);

    if (!result?.success) return;
  };

  const handleDemoCALogin = async () => {
    if (loading) return;

    setLoading(true);
    const result = await demoLogin('ca');
    setLoading(false);

    if (!result?.success) return;
  };

  const goToSignup = () => {
    navigation.navigate('RegisterScreenCA');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.heroSection}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>CA</Text>
          </View>

          <Text style={styles.brand}>TaxVault</Text>
          <Text style={styles.title}>Login as Chartered Accountant</Text>
          <Text style={styles.subtitle}>
            Access your CA dashboard, manage clients, and continue your tax
            workflow securely.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome back</Text>
          <Text style={styles.cardSubtitle}>
            Sign in with your CA account credentials
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.showHideButton}
                activeOpacity={0.8}
              >
                <Text style={styles.showHideText}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Please wait...' : 'Login as CA'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, loading && styles.buttonDisabled]}
            onPress={handleDemoCALogin}
            disabled={loading}
            activeOpacity={0.9}
          >
            <Text style={styles.secondaryButtonText}>Use Demo CA Account</Text>
          </TouchableOpacity>

          <View style={styles.demoInfoBox}>
            <Text style={styles.demoInfoTitle}>Demo credentials</Text>
            <Text style={styles.demoInfoText}>Email: ca@demo.com</Text>
            <Text style={styles.demoInfoText}>Password: demo1234</Text>
          </View>
        </View>

        <View style={styles.footerSection}>
          <Text style={styles.footerText}>Don’t have a CA account?</Text>
          <TouchableOpacity onPress={goToSignup} activeOpacity={0.8}>
            <Text style={styles.footerLinkText}>Sign up as CA</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreenCA;