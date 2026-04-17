import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import LeadRequestCard from '@/features/ca/components/LeadRequestCard';
import { caRequests } from '@/features/ca/config/caMockData';

const CANewRequestsScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>New Requests</Text>
        <Text style={styles.subtitle}>
          Review new consultation and filing requests from Canadian clients before they become active accounts.
        </Text>

        <View style={styles.listWrap}>
          {caRequests.map((request) => (
            <LeadRequestCard key={request.id} request={request} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 21,
  },
  listWrap: {
    marginTop: 18,
  },
});

export default CANewRequestsScreen;


