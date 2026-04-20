import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import CACard from '@/features/ca/components/CACard';
import { MOCK_CA_DIRECTORY } from '@/features/ca/config/caMockData';

const CADirectoryScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');

  const filteredList = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return MOCK_CA_DIRECTORY;

    return MOCK_CA_DIRECTORY.filter((item) => {
      const haystack = [
        item.name,
        item.title,
        item.location,
        ...(item.specialization || []),
        ...(item.languages || []),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [search]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Find a CA</Text>
        <Text style={styles.subtitle}>
          Compare pricing, specialties, and next available appointment slots.
        </Text>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name, specialty, or city"
          placeholderTextColor="#94A3B8"
          style={styles.searchInput}
        />

        <View style={styles.resultHeader}>
          <Text style={styles.resultText}>{filteredList.length} professionals found</Text>
        </View>

        {filteredList.map((item) => (
          <CACard
            key={item.id}
            item={item}
            onView={(selected) => navigation.navigate('CADetail', { ca: selected })}
            onBook={(selected) =>
              navigation.navigate('BookCAAppointment', {
                ca: selected,
                appointmentType: 'Consultation',
              })
            }
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CADirectoryScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F8FC',
  },
  container: {
    padding: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 22,
    color: '#64748B',
  },
  searchInput: {
    marginTop: 16,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5EAF2',
    paddingHorizontal: 16,
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 14,
  },
  resultHeader: {
    marginBottom: 10,
  },
  resultText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '700',
  },
});


