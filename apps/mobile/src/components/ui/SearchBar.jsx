import { StyleSheet } from 'react-native';
import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';

const SearchBar = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Search...',
  onClear,
  autoFocus = false,
  showCancelButton = false,
  onCancel,
  containerStyle,
  inputStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const cancelWidth = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    if (showCancelButton) {
      Animated.timing(cancelWidth, {
        toValue: 60,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (showCancelButton && !value) {
      Animated.timing(cancelWidth, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleClear = () => {
    onChangeText('');
    onClear?.();
    inputRef.current?.focus();
  };

  const handleCancel = () => {
    onChangeText('');
    setIsFocused(false);
    inputRef.current?.blur();
    onCancel?.();
    if (showCancelButton) {
      Animated.timing(cancelWidth, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[
        styles.searchContainer,
        isFocused && styles.searchContainerFocused,
      ]}>
        <Icon name="magnify" size={20} color={colors.gray[400]} />
        
        <TextInput
          ref={inputRef}
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.gray[400]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={onSubmit}
          returnKeyType="search"
          autoFocus={autoFocus}
        />
        
        {value ? (
          <TouchableOpacity onPress={handleClear}>
            <Icon name="close-circle" size={20} color={colors.gray[400]} />
          </TouchableOpacity>
        ) : null}
      </View>

      {showCancelButton && (
        <Animated.View style={{ width: cancelWidth, overflow: 'hidden' }}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

export const FilterSearchBar = ({
  value,
  onChangeText,
  onFilterPress,
  filterActive = false,
  ...props
}) => {
  return (
    <View style={styles.filterContainer}>
      <SearchBar
        value={value}
        onChangeText={onChangeText}
        containerStyle={styles.filterSearchContainer}
        {...props}
      />
      <TouchableOpacity
        style={[
          styles.filterButton,
          filterActive && styles.filterButtonActive,
        ]}
        onPress={onFilterPress}
      >
        <Icon
          name="tune"
          size={20}
          color={filterActive ? colors.white : colors.gray[600]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  searchContainerFocused: {
    borderColor: colors.primary[500],
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    ...typography.body,
    color: colors.text.primary,
  },
  cancelButton: {
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    ...typography.body,
    color: colors.primary[500],
  },
  filterContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterSearchContainer: {
    flex: 1,
    marginBottom: 0,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[50],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
});

export default SearchBar;





