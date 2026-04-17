import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import Header from '@/components/layout/AppHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { colors } from '@/styles/theme';
import { typography } from '@/styles/theme';
import { spacing, borderRadius } from '@/styles/theme'; // Added borderRadius

const { width } = Dimensions.get('window');

const MileageLogScreen = () => {
  const navigation = useNavigation();
  const [trips, setTrips] = useState([
    { id: 1, date: '2024-03-15', distance: 45.2, purpose: 'business', start: 'Home', end: 'Airport', earnings: 85.50 },
    { id: 2, date: '2024-03-14', distance: 23.8, purpose: 'business', start: 'Home', end: 'Downtown', earnings: 42.30 },
    { id: 3, date: '2024-03-13', distance: 12.4, purpose: 'commute', start: 'Home', end: 'Office', earnings: 0 },
    { id: 4, date: '2024-03-12', distance: 56.7, purpose: 'business', start: 'Home', end: 'Mall', earnings: 98.75 },
  ]);

  const [stats, setStats] = useState({
    totalBusinessKm: 0,
    totalPersonalKm: 0,
    businessPercentage: 0,
    estimatedDeduction: 0,
    weeklyAverage: 0,
  });

  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    calculateStats();
  }, [trips]);

  const calculateStats = () => {
    const businessTrips = trips.filter(t => t.purpose === 'business');
    const personalTrips = trips.filter(t => t.purpose === 'personal' || t.purpose === 'commute');
    
    const totalBusiness = businessTrips.reduce((sum, t) => sum + t.distance, 0);
    const totalPersonal = personalTrips.reduce((sum, t) => sum + t.distance, 0);
    const totalKm = totalBusiness + totalPersonal;
    
    setStats({
      totalBusinessKm: totalBusiness,
      totalPersonalKm: totalPersonal,
      businessPercentage: totalKm > 0 ? (totalBusiness / totalKm * 100) : 0,
      estimatedDeduction: totalBusiness * 0.61, // 2024 CRA rate
      weeklyAverage: totalBusiness / 4, // Approximate
    });
  };

  const addManualTrip = () => {
    Alert.alert('Add Trip', 'Enter trip details', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Add',
        onPress: () => {
          // Open trip entry modal
          Alert.alert('Coming Soon', 'Manual trip entry will be available soon');
        },
      },
    ]);
  };

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [45.2, 23.8, 12.4, 56.7, 38.2, 42.1, 28.5],
      color: (opacity = 1) => colors.primary[500],
      strokeWidth: 2,
    }],
  };

  const chartConfig = {
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    color: (opacity = 1) => `rgba(0, 90, 156, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Mileage Log" showBack />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing.lg }}>
        {/* Stats Cards */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg }}>
          <Card style={{ width: '47%' }}>
            <Card.Body>
              <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Business KM</Text>
              <Text style={[typography.styles.h3, { color: colors.success.main }]}>
                {stats.totalBusinessKm.toFixed(1)}
              </Text>
            </Card.Body>
          </Card>

          <Card style={{ width: '47%' }}>
            <Card.Body>
              <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Business %</Text>
              <Text style={[typography.styles.h3, { color: colors.primary[500] }]}>
                {stats.businessPercentage.toFixed(1)}%
              </Text>
            </Card.Body>
          </Card>

          <Card style={{ width: '47%' }}>
            <Card.Body>
              <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Est. Deduction</Text>
              <Text style={[typography.styles.h3, { color: colors.gold.main }]}>
                ${stats.estimatedDeduction.toFixed(2)}
              </Text>
              <Text style={[typography.styles.caption, { color: colors.gray[400] }]}>
                @ $0.61/km
              </Text>
            </Card.Body>
          </Card>

          <Card style={{ width: '47%' }}>
            <Card.Body>
              <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Weekly Avg</Text>
              <Text style={[typography.styles.h3, { color: colors.secondary[500] }]}>
                {stats.weeklyAverage.toFixed(1)} km
              </Text>
            </Card.Body>
          </Card>
        </View>

        {/* Chart */}
        <Card style={{ marginBottom: spacing.lg }}>
          <Card.Header>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={[typography.styles.h6]}>Weekly Activity</Text>
              <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                <TouchableOpacity
                  style={{
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs,
                    borderRadius: borderRadius.full,
                    backgroundColor: selectedPeriod === 'week' ? colors.primary[500] : colors.gray[100],
                  }}
                  onPress={() => setSelectedPeriod('week')}
                >
                  <Text style={{ color: selectedPeriod === 'week' ? colors.white : colors.text.secondary }}>
                    Week
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs,
                    borderRadius: borderRadius.full,
                    backgroundColor: selectedPeriod === 'month' ? colors.primary[500] : colors.gray[100],
                  }}
                  onPress={() => setSelectedPeriod('month')}
                >
                  <Text style={{ color: selectedPeriod === 'month' ? colors.white : colors.text.secondary }}>
                    Month
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card.Header>
          <Card.Body>
            <LineChart
              data={chartData}
              width={width - spacing.lg * 4}
              height={180}
              chartConfig={chartConfig}
              bezier
              style={{ borderRadius: borderRadius.md }}
            />
          </Card.Body>
        </Card>

        {/* CRA Info */}
        <Card style={{ marginBottom: spacing.lg, backgroundColor: colors.warning.light }}>
          <Card.Body>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="alert-circle" size={20} color={colors.warning.main} />
              <Text style={[typography.styles.body2, { color: colors.warning.main, marginLeft: spacing.sm, flex: 1 }]}>
                Your business use percentage determines how much of your vehicle expenses you can deduct.
              </Text>
            </View>
          </Card.Body>
        </Card>

        {/* Quick Add */}
        <Button
          variant="primary"
          onPress={addManualTrip}
          style={{ marginBottom: spacing.lg }}
        >
          Add Manual Trip
        </Button>

        {/* Recent Trips */}
        <Text style={[typography.styles.h6, { marginBottom: spacing.md }]}>Recent Trips</Text>

        {trips.map(trip => (
          <Card key={trip.id} style={{ marginBottom: spacing.sm }}>
            <Card.Body>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon 
                    name={trip.purpose === 'business' ? 'briefcase' : 'home'} 
                    size={20} 
                    color={trip.purpose === 'business' ? colors.success.main : colors.warning.main} 
                  />
                  <View style={{ marginLeft: spacing.sm }}>
                    <Text style={[typography.styles.body2, { fontWeight: typography.weights.semibold }]}>
                      {trip.start} → {trip.end}
                    </Text>
                    <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                      {trip.date} • {trip.distance} km
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  {trip.earnings > 0 && (
                    <Text style={[typography.styles.body2, { color: colors.success.main }]}>
                      ${trip.earnings}
                    </Text>
                  )}
                  <Badge status={trip.purpose} />
                </View>
              </View>
            </Card.Body>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MileageLogScreen;



