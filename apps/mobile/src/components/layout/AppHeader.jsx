import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '@/styles/theme';

const AppHeader = ({
  title,
  showBack = false,
  showProfile = true,
  rightIcon,
  onRightPress,
  backgroundColor = colors.surface,
}) => {
  const navigation = useNavigation();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-left" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          )}
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.rightSection}>
          {rightIcon ? (
            <TouchableOpacity onPress={onRightPress}>
              <Icon name={rightIcon} size={24} color={colors.text.primary} />
            </TouchableOpacity>
          ) : null}

          {showProfile && !rightIcon ? (
            <TouchableOpacity onPress={() => navigation.navigate('CAProfile')}>
              <View style={styles.profileCircle}>
                <Text style={styles.profileText}>U</Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </>
  );
};

export default AppHeader;
