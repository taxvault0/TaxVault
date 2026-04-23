import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Header from '@/components/layout/AppHeader';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useTheme } from '@/core/providers/ThemeContext';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';

const SettingsScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const theme = useTheme();

  const isDark = !!theme?.isDark;
  const toggleTheme =
    theme?.toggleTheme ||
    (() => {
      if (typeof theme?.setTheme === 'function') {
        theme.setTheme(isDark ? 'light' : 'dark');
      }
    });

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [biometric, setBiometric] = useState(false);

  const SettingItem = ({
    icon,
    label,
    value,
    onValueChange,
    type = 'switch',
    noBorder = false,
  }) => (
    <View style={[styles.settingItem, noBorder && styles.noBorder]}>
      <View style={styles.settingLeft}>
        <Icon name={icon} size={22} color={colors.primary[500]} />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>

      {type === 'switch' ? (
        <Switch
          value={!!value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.gray[300], true: colors.primary[500] }}
          thumbColor={colors.white}
        />
      ) : (
        <TouchableOpacity
          onPress={onValueChange}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="chevron-right" size={22} color={colors.gray[400]} />
        </TouchableOpacity>
      )}
    </View>
  );

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            Alert.alert('Error', 'Failed to log out');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Settings" showBack={!!navigation?.canGoBack?.()} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <SettingItem
            icon="theme-light-dark"
            label="Dark Mode"
            value={isDark}
            onValueChange={toggleTheme}
            noBorder
          />
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <SettingItem
            icon="bell-outline"
            label="Push Notifications"
            value={pushNotifications}
            onValueChange={setPushNotifications}
          />
          <SettingItem
            icon="email-outline"
            label="Email Alerts"
            value={emailAlerts}
            onValueChange={setEmailAlerts}
            noBorder
          />
        </View>

        {/* Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <SettingItem
            icon="fingerprint"
            label="Biometric Login"
            value={biometric}
            onValueChange={setBiometric}
          />
          <SettingItem
            icon="lock-outline"
            label="Change Password"
            type="link"
            onValueChange={() =>
              Alert.alert('Coming Soon', 'Password change coming soon')
            }
            noBorder
          />
        </View>

        {/* ✅ NEW: Practice (Office Hours) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Practice</Text>
          <SettingItem
            icon="clock-outline"
            label="Office Hours"
            type="link"
            onValueChange={() => navigation.navigate('CAOfficeHours')}
            noBorder
          />
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <SettingItem
            icon="information-outline"
            label="App Version"
            type="link"
            onValueChange={() =>
              Alert.alert('Version', 'TaxVault App v1.0.0')
            }
          />
          <SettingItem
            icon="file-document-outline"
            label="Terms & Conditions"
            type="link"
            onValueChange={() =>
              Alert.alert('Terms', 'Terms and conditions coming soon')
            }
          />
          <SettingItem
            icon="shield-outline"
            label="Privacy Policy"
            type="link"
            onValueChange={() =>
              Alert.alert('Privacy', 'Privacy policy coming soon')
            }
            noBorder
          />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={22} color={colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    ...typography.h6,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  settingItem: {
    minHeight: 54,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: spacing.sm,
  },
  settingLabel: {
    ...typography.body,
    color: colors.text.primary,
    marginLeft: spacing.md,
    flexShrink: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.error,
    backgroundColor: colors.error + '10',
  },
  logoutText: {
    ...typography.body,
    color: colors.error,
    fontWeight: typography.weights.medium,
    marginLeft: spacing.sm,
  },
  version: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});

export default SettingsScreen;