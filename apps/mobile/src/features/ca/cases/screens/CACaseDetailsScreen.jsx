import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import caCaseService from '@/services/caCaseService';
import styles from '../styles/CACaseDetails.styles';

const CACaseDetailsScreen = ({ route }) => {
  const caseId = route?.params?.caseId;

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCase = async () => {
    try {
      setLoading(true);
      const res = await caCaseService.getCase(caseId);
      setCaseData(res.case || res.data || res);
    } catch (e) {
      Alert.alert('Error', 'Failed to load case');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCase();
  }, [caseId]);

  const updateStatus = async (status) => {
    try {
      await caCaseService.updateStatus(caseId, status);
      loadCase();
    } catch (e) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!caseData) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          {caseData.client?.name || 'Client'}
        </Text>

        <Text style={styles.meta}>
          Tax Year: {caseData.taxYear}
        </Text>

        <Text style={styles.status}>
          Status: {caseData.status}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Update Status</Text>

          {[
            'intake',
            'collecting-docs',
            'review',
            'ready-to-file',
            'filed',
          ].map((status) => (
            <TouchableOpacity
              key={status}
              style={styles.button}
              onPress={() => updateStatus(status)}
            >
              <Text style={styles.buttonText}>{status}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CACaseDetailsScreen;