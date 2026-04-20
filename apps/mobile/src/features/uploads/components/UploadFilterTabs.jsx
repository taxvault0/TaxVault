import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

const FILTERS = ['all', 'mine', 'spouse', 'shared', 'missing'];

const labelMap = {
  all: 'All',
  mine: 'Mine',
  spouse: 'Spouse',
  shared: 'Shared',
  missing: 'Missing Only',
};

const UploadFilterTabs = ({ activeFilter = 'all', onChange }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {FILTERS.map((filter) => {
        const active = filter === activeFilter;
        return (
          <Pressable
            key={filter}
            onPress={() => onChange?.(filter)}
            style={[styles.tab, active && styles.tabActive]}
          >
            <Text style={[styles.tabText, active && styles.tabTextActive]}>
              {labelMap[filter]}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingBottom: 14,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
  },
  tabActive: {
    backgroundColor: '#111827',
  },
  tabText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
});

export default UploadFilterTabs;


