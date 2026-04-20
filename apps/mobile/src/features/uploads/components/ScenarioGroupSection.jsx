import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import UploadSectionCard from '@/features/uploads/components/UploadSectionCard';

const ScenarioGroupSection = ({ title, sections = [], onSectionPress }) => {
  if (!sections.length) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {sections.map((section) => (
        <UploadSectionCard
          key={section.id}
          section={section}
          onPress={onSectionPress}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
});

export default ScenarioGroupSection;


