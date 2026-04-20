import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ConsultationCard from '../components/ConsultationCard';
import consultationService from '../services/consultationService';

export default function CAConsultationsScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [consultations, setConsultations] = useState([]);

  const loadConsultations = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const result = await consultationService.getCAConsultations();
      setConsultations(result?.consultations || []);
    } catch (error) {
      console.error('CAConsultationsScreen error:', error);
      setConsultations([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadConsultations();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={consultations}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadConsultations(true)}
          />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No CA consultations found.</Text>
        }
        renderItem={({ item }) => (
          <ConsultationCard
            consultation={item}
            role="ca"
            onPress={() =>
              navigation?.navigate?.('ManageConsultation', {
                consultationId: item._id,
              })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 40,
  },
});