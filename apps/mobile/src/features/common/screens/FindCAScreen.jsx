import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Location from 'expo-location';
import Header from '@/components/layout/AppHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { colors } from '@/styles/theme';
import { typography } from '@/styles/theme';
import { spacing } from '@/styles/theme';
import api from '@/services/api';

const FindCAScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    acceptingNewClients: true,
    specialization: 'all',
    service: 'all',
    userType: 'all',
    maxDistance: 50
  });
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCA, setSelectedCA] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setLocation({
          lat: location.coords.latitude,
          lng: location.coords.longitude
        });
        searchCAs();
      } else {
        searchCAs(); // Search without location
      }
    } catch (error) {
      console.error('Error getting location:', error);
      searchCAs();
    }
  };

  const searchCAs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(location?.lat && { lat: location.lat }),
        ...(location?.lng && { lng: location.lng }),
        maxDistance: filters.maxDistance * 1000,
        acceptingNewClients: filters.acceptingNewClients,
        specialization: filters.specialization,
        service: filters.service,
        userType: filters.userType
      });

      const response = await api.get(`/ca/search?${params}`);
      setResults(response.data.results);
    } catch (error) {
      console.error('Error searching CAs:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestConnection = async (caId) => {
    Alert.alert(
      'Request Connection',
      'Send a connection request to this CA?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Request',
          onPress: async () => {
            try {
              await api.post('/ca/connect', { caId });
              Alert.alert('Success', 'Connection request sent!');
              setSelectedCA(null);
            } catch (error) {
              Alert.alert('Error', 'Failed to send request');
            }
          }
        }
      ]
    );
  };

  const FilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
      }}>
        <View style={{
          backgroundColor: colors.white,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: spacing.lg,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg }}>
            <Text style={[typography.styles.h5]}>Filter CAs</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Icon name="close" size={24} color={colors.gray[400]} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {/* Accepting Clients */}
            <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.sm }]}>
              Accepting New Clients
            </Text>
            <View style={{ flexDirection: 'row', marginBottom: spacing.lg }}>
              {['all', 'true', 'false'].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={{
                    flex: 1,
                    padding: spacing.sm,
                    backgroundColor: filters.acceptingNewClients === value ? colors.primary[500] : colors.gray[100],
                    marginHorizontal: 2,
                    borderRadius: spacing.radius.md,
                    alignItems: 'center',
                  }}
                  onPress={() => setFilters({ ...filters, acceptingNewClients: value })}
                >
                  <Text style={{
                    color: filters.acceptingNewClients === value ? colors.white : colors.text.secondary,
                  }}>
                    {value === 'all' ? 'All' : value === 'true' ? 'Yes' : 'No'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Specialization */}
            <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.sm }]}>
              Specialization
            </Text>
            <View style={{ marginBottom: spacing.lg }}>
              {['all', 'gig-economy', 'rideshare', 'retail', 'franchise'].map((spec) => (
                <TouchableOpacity
                  key={spec}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: spacing.sm,
                  }}
                  onPress={() => setFilters({ ...filters, specialization: spec })}
                >
                  <Icon
                    name={filters.specialization === spec ? 'radiobox-marked' : 'radiobox-blank'}
                    size={20}
                    color={colors.primary[500]}
                  />
                  <Text style={{ marginLeft: spacing.md }}>
                    {spec === 'all' ? 'All' : spec.replace('-', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Distance Slider */}
            <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.sm }]}>
              Max Distance: {filters.maxDistance} km
            </Text>
            <View style={{ marginBottom: spacing.xl }}>
              <TextInput
                style={{
                  width: '100%',
                  height: 40,
                }}
                value={filters.maxDistance.toString()}
                onChangeText={(value) => setFilters({ ...filters, maxDistance: parseInt(value) || 50 })}
                keyboardType="numeric"
              />
            </View>

            <Button variant="primary" onPress={() => {
              setShowFilters(false);
              searchCAs();
            }}>
              Apply Filters
            </Button>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const CADetailModal = () => (
    <Modal
      visible={!!selectedCA}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setSelectedCA(null)}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
      }}>
        <View style={{
          backgroundColor: colors.white,
          borderRadius: 20,
          padding: spacing.xl,
          margin: spacing.lg,
        }}>
          <ScrollView>
            {/* Header */}
            <View style={{ alignItems: 'center', marginBottom: spacing.lg }}>
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.primary[100],
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacing.md,
              }}>
                <Text style={[typography.styles.h2, { color: colors.primary[500] }]}>
                  {selectedCA?.user?.name?.charAt(0)}
                </Text>
              </View>
              <Text style={[typography.styles.h5]}>{selectedCA?.firmName}</Text>
              <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                {selectedCA?.user?.name}
              </Text>
            </View>

            {/* Status Badge */}
            <View style={{ alignItems: 'center', marginBottom: spacing.md }}>
              {selectedCA?.acceptingNewClients ? (
                <Badge status="success" text="Accepting New Clients" />
              ) : (
                <Badge status="error" text="Not Accepting Clients" />
              )}
            </View>

            {/* Distance */}
            {selectedCA?.distance && (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md }}>
                <Icon name="map-marker" size={16} color={colors.gray[400]} />
                <Text style={[typography.styles.caption, { color: colors.text.secondary, marginLeft: spacing.xs }]}>
                  {selectedCA.distance} km away
                </Text>
              </View>
            )}

            {/* Bio */}
            <Text style={[typography.styles.body2, { marginBottom: spacing.md }]}>
              {selectedCA?.bio}
            </Text>

            {/* Specializations */}
            <View style={{ marginBottom: spacing.md }}>
              <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.sm }]}>
                Specializations
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {selectedCA?.specializations?.map(spec => (
                  <Badge key={spec} status="info" text={spec} style={{ marginRight: spacing.xs, marginBottom: spacing.xs }} />
                ))}
              </View>
            </View>

            {/* Services */}
            <View style={{ marginBottom: spacing.md }}>
              <Text style={[typography.styles.caption, { color: colors.text.secondary, marginBottom: spacing.sm }]}>
                Services
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {selectedCA?.services?.map(service => (
                  <Badge key={service} status="success" text={service} style={{ marginRight: spacing.xs, marginBottom: spacing.xs }} />
                ))}
              </View>
            </View>

            {/* Contact Buttons */}
            <View style={{ flexDirection: 'row', marginTop: spacing.lg }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: spacing.md,
                  backgroundColor: colors.primary[500],
                  borderRadius: spacing.radius.md,
                  alignItems: 'center',
                  marginRight: spacing.sm,
                }}
                onPress={() => requestConnection(selectedCA?.user?._id)}
              >
                <Icon name="account-plus" size={20} color={colors.white} />
                <Text style={{ color: colors.white, marginTop: spacing.xs }}>Connect</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: spacing.md,
                  backgroundColor: colors.gray[100],
                  borderRadius: spacing.radius.md,
                  alignItems: 'center',
                }}
                onPress={() => setSelectedCA(null)}
              >
                <Icon name="close" size={20} color={colors.gray[600]} />
                <Text style={{ color: colors.gray[600], marginTop: spacing.xs }}>Close</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Find a CA" />

      <View style={{ padding: spacing.lg }}>
        {/* Search Bar */}
        <View style={{ flexDirection: 'row', marginBottom: spacing.md }}>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.white,
            borderRadius: spacing.radius.md,
            paddingHorizontal: spacing.md,
            marginRight: spacing.sm,
            borderWidth: 1,
            borderColor: colors.gray[200],
          }}>
            <Icon name="magnify" size={20} color={colors.gray[400]} />
            <TextInput
              style={{
                flex: 1,
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.sm,
                fontSize: typography.sizes.base,
              }}
              placeholder="City or postal code"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
          <TouchableOpacity
            style={{
              width: 48,
              height: 48,
              backgroundColor: colors.primary[500],
              borderRadius: spacing.radius.md,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={searchCAs}
          >
            <Icon name="magnify" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Filter Button */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: spacing.sm,
            backgroundColor: colors.gray[100],
            borderRadius: spacing.radius.md,
            marginBottom: spacing.lg,
          }}
          onPress={() => setShowFilters(true)}
        >
          <Icon name="filter" size={20} color={colors.gray[600]} />
          <Text style={{ marginLeft: spacing.sm, color: colors.gray[600] }}>Filters</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={{ marginTop: spacing.md }}>Searching for CAs...</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: spacing.lg }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedCA(item)}
              style={{ marginBottom: spacing.md }}
            >
              <Card>
                <Card.Body>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: colors.primary[100],
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <Text style={[typography.styles.h5, { color: colors.primary[500] }]}>
                        {item.user?.name?.charAt(0)}
                      </Text>
                    </View>

                    <View style={{ flex: 1, marginLeft: spacing.md }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={[typography.styles.body1, { fontWeight: typography.weights.semibold }]}>
                          {item.firmName}
                        </Text>
                        {item.acceptingNewClients ? (
                          <Badge status="success" text="Accepting" />
                        ) : (
                          <Badge status="error" text="Full" />
                        )}
                      </View>

                      <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                        {item.user?.name}
                      </Text>

                      {item.distance && (
                        <Text style={[typography.styles.caption, { color: colors.gray[400], marginTop: 2 }]}>
                          {item.distance} km away
                        </Text>
                      )}
                    </View>
                  </View>
                </Card.Body>
              </Card>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View style={{ alignItems: 'center', padding: spacing.xl }}>
              <Icon name="account-search" size={64} color={colors.gray[300]} />
              <Text style={[typography.styles.body1, { marginTop: spacing.md }]}>
                No CAs found
              </Text>
              <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                Try adjusting your filters
              </Text>
            </View>
          )}
        />
      )}

      <FilterModal />
      <CADetailModal />
    </SafeAreaView>
  );
};

export default FindCAScreen;



