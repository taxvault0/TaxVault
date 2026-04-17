import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import Header from '@/components/layout/AppHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { colors } from '@/styles/theme';
import { typography } from '@/styles/theme';
import { spacing } from '@/styles/theme';

const LOCATION_TASK_NAME = 'background-location-task';

// Define background task
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Location task error:', error);
    return;
  }
  if (data) {
    const { locations } = data;
    // Handle location updates in background
    console.log('Background location:', locations);
  }
});

const MileageTrackerScreen = () => {
  const navigation = useNavigation();
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [location, setLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    let interval;
    if (isTracking && !isPaused) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, isPaused]);

  const checkPermissions = async () => {
    try {
      const { status: foregroundStatus } = await Location.getForegroundPermissionsAsync();
      const { status: backgroundStatus } = await Location.getBackgroundPermissionsAsync();
      
      setPermissionStatus({ foreground: foregroundStatus, background: backgroundStatus });
      
      if (foregroundStatus === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      }
    } catch (error) {
      console.error('Permission check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestPermissions = async () => {
    try {
      const foreground = await Location.requestForegroundPermissionsAsync();
      const background = await Location.requestBackgroundPermissionsAsync();
      
      setPermissionStatus({ foreground: foreground.status, background: background.status });
      
      if (foreground.status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  };

  const startTracking = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Location Permission Required',
        'Please enable location permissions to track your mileage.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 5000, // 5 seconds
        distanceInterval: 10, // 10 meters
        deferredUpdatesInterval: 30000, // 30 seconds
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: 'TaxVault Tracking',
          notificationBody: 'Your mileage is being tracked',
        },
      });

      setIsTracking(true);
      setStartTime(new Date());
      setRouteCoordinates([]);
      setDistance(0);
      setDuration(0);

      // Start watching position for live updates
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLocation) => {
          const coord = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          };
          
          setRouteCoordinates(prev => [...prev, coord]);
          setLocation(coord);
          
          // Calculate distance from last point
          if (routeCoordinates.length > 0) {
            const lastCoord = routeCoordinates[routeCoordinates.length - 1];
            const newDistance = calculateDistance(
              lastCoord.latitude, lastCoord.longitude,
              coord.latitude, coord.longitude
            );
            setDistance(prev => prev + newDistance);
          }
        }
      );
    } catch (error) {
      console.error('Start tracking error:', error);
      Alert.alert('Error', 'Failed to start tracking');
    }
  };

  const stopTracking = async () => {
    Alert.alert(
      'End Trip',
      'Do you want to end this trip and save it?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save Trip',
          onPress: async () => {
            try {
              await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
              setIsTracking(false);
              
              // Navigate to trip summary
              navigation.navigate('Mileage', {
                newTrip: {
                  distance: distance.toFixed(1),
                  duration,
                  route: routeCoordinates,
                  startTime,
                  endTime: new Date(),
                },
              });
            } catch (error) {
              console.error('Stop tracking error:', error);
            }
          },
        },
        {
          text: 'Discard',
          onPress: async () => {
            await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
            setIsTracking(false);
            navigation.goBack();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const pauseTracking = () => {
    setIsPaused(!isPaused);
    // In a real app, you'd pause location updates here
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={[typography.styles.body1, { marginTop: spacing.md }]}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!permissionStatus?.foreground || permissionStatus.foreground !== 'granted') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <Header title="Mileage Tracker" showBack />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl }}>
          <Icon name="map-marker-off" size={64} color={colors.gray[400]} />
          <Text style={[typography.styles.h5, { textAlign: 'center', marginTop: spacing.lg }]}>
            Location Access Required
          </Text>
          <Text style={[typography.styles.body2, { textAlign: 'center', color: colors.text.secondary, marginTop: spacing.md }]}>
            We need your location to track mileage for tax deductions
          </Text>
          <Button
            variant="primary"
            onPress={requestPermissions}
            style={{ marginTop: spacing.xl }}
          >
            Enable Location
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <Header title="Mileage Tracker" showBack />

      {/* Map */}
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location?.latitude || 43.6532,
          longitude: location?.longitude || -79.3832,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        followsUserLocation={isTracking}
      >
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={colors.primary[500]}
            strokeWidth={3}
          />
        )}
        {location && (
          <Marker
            coordinate={location}
            title="Current Location"
          />
        )}
      </MapView>

      {/* Tracking Info */}
      {isTracking && (
        <Card style={{
          position: 'absolute',
          top: 80,
          left: spacing.lg,
          right: spacing.lg,
          ...shadows.lg,
        }}>
          <Card.Body>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Distance</Text>
                <Text style={[typography.styles.h3, { color: colors.primary[500] }]}>
                  {distance.toFixed(1)} km
                </Text>
              </View>
              <View>
                <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Duration</Text>
                <Text style={[typography.styles.h4]}>
                  {formatDuration(duration)}
                </Text>
              </View>
              <View>
                <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Est. Deduction</Text>
                <Text style={[typography.styles.h5, { color: colors.success.main }]}>
                  ${(distance * 0.61).toFixed(2)}
                </Text>
              </View>
            </View>
          </Card.Body>
        </Card>
      )}

      {/* Controls */}
      <View style={{
        position: 'absolute',
        bottom: spacing['3xl'],
        left: spacing.lg,
        right: spacing.lg,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.md,
      }}>
        {!isTracking ? (
          <Button
            variant="primary"
            onPress={startTracking}
            icon={<Icon name="play" size={20} color={colors.white} />}
            style={{ flex: 1 }}
          >
            Start Trip
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              onPress={pauseTracking}
              icon={<Icon name={isPaused ? "play" : "pause"} size={20} color={colors.primary[500]} />}
              style={{ flex: 1 }}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              variant="warning"
              onPress={stopTracking}
              icon={<Icon name="stop" size={20} color={colors.white} />}
              style={{ flex: 1 }}
            >
              Stop
            </Button>
          </>
        )}
      </View>

      {/* Status Indicator */}
      {isTracking && !isPaused && (
        <View style={{
          position: 'absolute',
          top: 140,
          right: spacing.lg,
          backgroundColor: colors.success.main,
          borderRadius: spacing.radius.full,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
          flexDirection: 'row',
          alignItems: 'center',
          ...shadows.md,
        }}>
          <View style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.white,
            marginRight: spacing.xs,
          }} />
          <Text style={{ color: colors.white, fontSize: typography.sizes.sm }}>
            Recording
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MileageTrackerScreen;





