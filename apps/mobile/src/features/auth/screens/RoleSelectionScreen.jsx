import React from 'react';
import { useTheme } from '@/core/providers/ThemeContext';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';

const RoleSelectionScreen = ({ navigation }) => {
  const handleSelectRole = (role) => {
    if (role === 'ca') {
      navigation.navigate('LoginScreenCA');
      return;
    }

    navigation.navigate('LoginScreen');
  };

  const RoleCard = ({
    icon,
    iconColor,
    iconBg,
    title,
    subtitle,
    features,
    onPress,
    outlined = false,
  }) => (
    <TouchableOpacity
      style={[styles.card, outlined && styles.cardOutlined]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Icon name={icon} size={28} color={iconColor} />
      </View>

      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>

      <View style={styles.features}>
        {features.map((item, index) => (
          <View key={index} style={styles.featureRow}>
            <Icon
              name={item.icon}
              size={15}
              color={outlined ? (colors.secondary || colors.primary[500]) : colors.primary[500]}
            />
            <Text style={styles.featureText}>{item.text}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Join TaxVault</Text>
          <Text style={styles.subtitle}>
            Choose your account type to get started
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          <RoleCard
            icon="account"
            iconColor={colors.primary[500]}
            iconBg={colors.primary[50]}
            title="Individual User"
            subtitle="For gig workers, employees, and personal tax users"
            features={[
              { icon: 'receipt', text: 'Receipt tracking' },
              { icon: 'map-marker-distance', text: 'Mileage tracking' },
              { icon: 'file-document', text: 'Document storage' },
            ]}
            onPress={() => handleSelectRole('user')}
          />

          <RoleCard
            icon="account-tie"
            iconColor={colors.secondary || colors.primary[500]}
            iconBg={`${colors.secondary || colors.primary[500]}20`}
            title="Tax Professional (CA)"
            subtitle="For accountants and professionals managing clients"
            features={[
              { icon: 'account-group', text: 'Client management' },
              { icon: 'file-multiple', text: 'Bulk processing' },
              { icon: 'shield-account', text: 'Access controls' },
            ]}
            onPress={() => handleSelectRole('ca')}
            outlined
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...(typography.h1 || {}),
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...(typography.body || {}),
    color: colors.text.secondary,
    textAlign: 'center',
  },
  cardsContainer: {
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardOutlined: {
    borderWidth: 2,
    borderColor: colors.secondary || colors.primary[500],
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...(typography.h3 || {}),
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 6,
  },
  cardSubtitle: {
    ...(typography.body || {}),
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  features: {
    marginBottom: 0,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    ...(typography.body || {}),
    color: colors.text.primary,
    marginLeft: spacing.sm,
    fontSize: 14,
  },
});

export default RoleSelectionScreen;









