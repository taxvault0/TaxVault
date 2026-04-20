import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '@/styles/theme';
import { typography } from '@/styles/theme';
import { spacing } from '@/styles/theme';

const BottomNav = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const tabs = [
    { name: 'Dashboard', icon: 'view-dashboard', screen: 'Dashboard' },
    { name: 'Receipts', icon: 'receipt', screen: 'Receipts' },
    { name: 'Mileage', icon: 'map-marker-distance', screen: 'Mileage' },
    { name: 'Documents', icon: 'file-document', screen: 'Documents' },
    { name: 'Profile', icon: 'account', screen: 'Profile' },
  ];

  const isActive = (screen) => {
    return route.name === screen || route.name?.includes(screen);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        height: spacing.layout.bottomNavHeight,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
        ...shadows.lg,
      }}
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.screen}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => navigation.navigate(tab.screen)}
        >
          <Icon
            name={tab.icon}
            size={24}
            color={isActive(tab.screen) ? colors.primary[500] : colors.gray[400]}
          />
          <Text
            style={[
              typography.styles.caption,
              {
                color: isActive(tab.screen) ? colors.primary[500] : colors.gray[400],
                marginTop: spacing.xs,
              },
            ]}
          >
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BottomNav;



