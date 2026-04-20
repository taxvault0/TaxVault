import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '@/components/layout/AppHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { colors } from '@/styles/theme';
import { typography } from '@/styles/theme';
import { spacing } from '@/styles/theme';
import api from '@/services/api';

const CADirectoryDashboardScreen = () => {
  const [acceptingClients, setAcceptingClients] = useState(true);
  const [stats, setStats] = useState({
    profileViews: 0,
    connectionRequests: 0,
    totalConnections: 0,
    pendingRequests: 0,
    activeClients: 0,
    recentRequests: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/ca/dashboard/stats');
      setStats(response.data.stats);
      setAcceptingClients(response.data.stats.acceptingNewClients);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAcceptingStatus = async () => {
    try {
      const newStatus = !acceptingClients;
      await api.put('/ca/toggle-status', { accepting: newStatus });
      setAcceptingClients(newStatus);
      Alert.alert('Success', `You are now ${newStatus ? 'accepting' : 'not accepting'} new clients`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const handleRequest = async (requestId, action) => {
    Alert.alert(
      action === 'accept' ? 'Accept Request' : 'Decline Request',
      `Are you sure you want to ${action} this request?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action === 'accept' ? 'Accept' : 'Decline',
          onPress: async () => {
            try {
              await api.post(`/ca/requests/${requestId}`, { action });
              fetchStats();
            } catch (error) {
              Alert.alert('Error', 'Failed to process request');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="CA Directory" />

      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {/* Status Toggle */}
        <Card style={{ backgroundColor: colors.primary[50], marginBottom: spacing.lg }}>
          <Card.Body>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Icon
                  name={acceptingClients ? 'toggle-switch' : 'toggle-switch-off'}
                  size={32}
                  color={acceptingClients ? colors.success : colors.gray[400]}
                />
                <View style={{ marginLeft: spacing.md, flex: 1 }}>
                  <Text style={[typography.styles.body1, { fontWeight: typography.weights.semibold }]}>
                    {acceptingClients ? 'Accepting New Clients' : 'Not Accepting New Clients'}
                  </Text>
                  <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                    {acceptingClients 
                      ? 'Your profile is visible in searches'
                      : 'Your profile is hidden from searches'}
                  </Text>
                </View>
              </View>
              <Switch
                value={acceptingClients}
                onValueChange={toggleAcceptingStatus}
                trackColor={{ false: colors.gray[300], true: colors.success }}
                thumbColor={colors.white}
              />
            </View>
          </Card.Body>
        </Card>

        {/* Stats Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg }}>
          <Card style={{ width: '47%' }}>
            <Card.Body>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Profile Views</Text>
                  <Text style={[typography.styles.h3]}>{stats.profileViews}</Text>
                </View>
                <Icon name="eye" size={24} color={colors.primary[500]} />
              </View>
            </Card.Body>
          </Card>

          <Card style={{ width: '47%' }}>
            <Card.Body>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Requests</Text>
                  <Text style={[typography.styles.h3]}>{stats.connectionRequests}</Text>
                </View>
                <Icon name="account-plus" size={24} color={colors.warning} />
              </View>
            </Card.Body>
          </Card>

          <Card style={{ width: '47%' }}>
            <Card.Body>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Active Clients</Text>
                  <Text style={[typography.styles.h3]}>{stats.activeClients}</Text>
                </View>
                <Icon name="account-group" size={24} color={colors.success} />
              </View>
            </Card.Body>
          </Card>

          <Card style={{ width: '47%' }}>
            <Card.Body>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Pending</Text>
                  <Text style={[typography.styles.h3]}>{stats.pendingRequests}</Text>
                </View>
                <Icon name="clock" size={24} color={colors.info} />
              </View>
            </Card.Body>
          </Card>
        </View>

        {/* Recent Requests */}
        <Card>
          <Card.Header>
            <Text style={[typography.styles.h6]}>Recent Requests</Text>
          </Card.Header>
          <Card.Body>
            {stats.recentRequests.length === 0 ? (
              <Text style={[typography.styles.body2, { color: colors.text.secondary, textAlign: 'center', padding: spacing.lg }]}>
                No pending requests
              </Text>
            ) : (
              stats.recentRequests.map((request) => (
                <View key={request.id} style={{ marginBottom: spacing.md }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: colors.primary[100],
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <Text style={[typography.styles.body1, { color: colors.primary[500] }]}>
                        {request.clientName?.charAt(0)}
                      </Text>
                    </View>
                    <View style={{ marginLeft: spacing.md, flex: 1 }}>
                      <Text style={[typography.styles.body2, { fontWeight: typography.weights.semibold }]}>
                        {request.clientName}
                      </Text>
                      <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                        {request.clientType?.replace('-', ' ')}
                      </Text>
                    </View>
                    <Badge status="warning" text="Pending" />
                  </View>

                  {request.message && (
                    <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.sm }]}>
                      "{request.message}"
                    </Text>
                  )}

                  <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        backgroundColor: colors.success,
                        padding: spacing.sm,
                        borderRadius: spacing.radius.md,
                        alignItems: 'center',
                      }}
                      onPress={() => handleRequest(request.id, 'accept')}
                    >
                      <Text style={{ color: colors.white, fontWeight: typography.weights.medium }}>Accept</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        flex: 1,
                        backgroundColor: colors.warning,
                        padding: spacing.sm,
                        borderRadius: spacing.radius.md,
                        alignItems: 'center',
                      }}
                      onPress={() => handleRequest(request.id, 'reject')}
                    >
                      <Text style={{ color: colors.white, fontWeight: typography.weights.medium }}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </Card.Body>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CADirectoryDashboardScreen;



