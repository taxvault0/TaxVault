import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import caRequestService from '@/services/caRequestService';
import CARequestCard from '../components/CARequestCard';
import styles from '../styles/CAClientRequests.styles';

const mapRequest = (item = {}) => ({
  id: item._id || item.id,
  name: item.name || item.user?.name || 'Unknown',
  email: item.email || item.user?.email || '',
  phone: item.phone || item.user?.phoneNumber || '',
  province: item.province || 'ON',
  userType: item.userType || 'gig-worker',
  taxYear: item.taxYear || '',
  status: item.status || 'pending',
  raw: item,
});

const CAClientRequestsScreen = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRequests = async ({ silent = false } = {}) => {
    try {
      silent ? setRefreshing(true) : setLoading(true);

      const res = await caRequestService.getRequests();
      setRequests(res.map(mapRequest));
    } catch (e) {
      console.log('Request load error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const openRequest = (request) => {
    navigation.navigate('CARequestDetails', {
      requestId: request.id,
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CARequestCard item={item} onPress={openRequest} />
        )}
        refreshing={refreshing}
        onRefresh={() => loadRequests({ silent: true })}
        contentContainerStyle={
          requests.length === 0 ? styles.emptyWrap : styles.list
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyTitle}>No requests</Text>
            <Text style={styles.emptySubtitle}>
              Incoming client requests will appear here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default CAClientRequestsScreen;