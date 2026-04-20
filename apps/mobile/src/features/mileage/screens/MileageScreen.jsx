import React, {  useState, useEffect  } from 'react';
import { useTheme } from '@/core/providers/ThemeContext';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
  RefreshControl,
  StyleSheet,  // Only import StyleSheet once, here
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LineChart } from 'react-native-chart-kit';
import Header from '@/components/layout/AppHeader';
import BottomNav from '@/components/layout/BottomTabBar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';
import { getTrips, deleteTrip, getTripStats } from '@/services/mileageAPI';

const { width } = Dimensions.get('window');

const MileageScreen = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState('all'); // all, business, personal

  // Fetch trips from API
  const { data: tripsData, isLoading, refetch } = useQuery({
    queryKey: ['trips', selectedYear, filterType],
    queryFn: () => getTrips({ 
      year: selectedYear,
      type: filterType !== 'all' ? filterType : undefined 
    }),
  });

  // Fetch trip statistics
  const { data: statsData } = useQuery({
    queryKey: ['tripStats', selectedYear],
    queryFn: () => getTripStats({ year: selectedYear }),
  });

  const trips = tripsData?.trips || [];
  const stats = statsData?.stats || {};

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['tripStats'] });
      Alert.alert('Success', 'Trip deleted successfully');
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'Failed to delete trip');
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const years = [2025, 2024, 2023, 2022];

  // Calculate statistics with business logic
  const businessTrips = trips.filter(t => t.purpose === 'business' || t.purpose === 'delivery');
  const personalTrips = trips.filter(t => t.purpose === 'personal' || t.purpose === 'commute');
  
  const totalBusinessKm = businessTrips.reduce((sum, t) => sum + t.distance, 0);
  const totalPersonalKm = personalTrips.reduce((sum, t) => sum + t.distance, 0);
  
  // CRA mileage rate (update annually)
  const deductionRate = 0.61; // 2024 rate
  
  // Calculate deductible amount based on business rules
  const calculateDeductibleAmount = () => {
    let deductibleKm = 0;
    
    for (const trip of businessTrips) {
      // Rule 1: If user is logged in but no order - not deductible
      if (trip.type === 'deadhead' && !trip.hasOrder) {
        continue; // Skip deadhead miles without orders
      }
      
      // Rule 2: If user has orders on multiple apps
      if (trip.hasMultipleApps) {
        // Prorate based on order value or split evenly
        const appShare = trip.appShare || 0.5; // Default to 50% if not specified
        deductibleKm += trip.distance * appShare;
      } 
      // Rule 3: Return trip after delivery - deductible
      else if (trip.type === 'return' && trip.hasOrder) {
        deductibleKm += trip.distance; // Fully deductible
      }
      // Rule 4: Regular business trip - deductible
      else if (trip.purpose === 'business' || trip.purpose === 'delivery') {
        deductibleKm += trip.distance;
      }
    }
    
    return deductibleKm;
  };

  const deductibleKm = calculateDeductibleAmount();
  const estimatedDeduction = deductibleKm * deductionRate;
  
  // Trip type breakdown
  const deliveryTrips = trips.filter(t => t.purpose === 'delivery').length;
  const returnTrips = trips.filter(t => t.type === 'return').length;
  const multiAppTrips = trips.filter(t => t.hasMultipleApps).length;

  // Chart data preparation
  const getWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const weekData = new Array(7).fill(0);
    
    trips.forEach(trip => {
      const tripDate = new Date(trip.date);
      const diffDays = Math.floor((today - tripDate) / (1000 * 60 * 60 * 24));
      if (diffDays < 7 && diffDays >= 0) {
        const dayIndex = 6 - diffDays;
        weekData[dayIndex] += trip.distance;
      }
    });
    
    return weekData;
  };

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: getWeeklyData(),
      color: (opacity = 1) => colors.primary[500],
      strokeWidth: 2
    }]
  };

  const chartConfig = {
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    color: (opacity = 1) => `rgba(0, 90, 156, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    style: {
      borderRadius: borderRadius.lg,
    },
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-CA', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-CA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTripIcon = (trip) => {
    if (trip.type === 'return') return 'refresh';
    if (trip.hasMultipleApps) return 'layers';
    if (trip.purpose === 'delivery') return 'food';
    if (trip.purpose === 'business') return 'briefcase';
    if (trip.purpose === 'commute') return 'home';
    return 'map-marker';
  };

  const getTripColor = (trip) => {
    if (trip.type === 'return') return colors.success;
    if (trip.hasMultipleApps) return colors.gold;
    if (trip.purpose === 'delivery') return colors.primary[500];
    if (trip.purpose === 'business') return colors.success;
    if (trip.purpose === 'commute') return colors.info;
    return colors.warning;
  };

  const renderTripItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('TripDetail', { id: item.id })}
      onLongPress={() => {
        Alert.alert(
          'Delete Trip',
          'Are you sure you want to delete this trip?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => deleteMutation.mutate(item.id),
            },
          ]
        );
      }}
      style={styles.tripCard}
    >
      <View style={styles.tripCardContent}>
        <View style={[styles.tripIconContainer, { backgroundColor: getTripColor(item) + '20' }]}>
          <Icon 
            name={getTripIcon(item)} 
            size={24} 
            color={getTripColor(item)} 
          />
        </View>

        <View style={styles.tripInfo}>
          <View style={styles.tripHeader}>
            <Text style={styles.tripRoute}>
              {item.start || 'Start'} → {item.end || 'End'}
            </Text>
            <Badge 
              status={item.purpose} 
              variant={item.type === 'return' ? 'success' : item.hasMultipleApps ? 'gold' : 'primary'}
            />
          </View>

          <View style={styles.tripDetails}>
            <View style={styles.tripMeta}>
              <Icon name="calendar" size={14} color={colors.gray[400]} />
              <Text style={styles.tripMetaText}>
                {formatDate(item.date)}
              </Text>
              <Icon name="clock-outline" size={14} color={colors.gray[400]} />
              <Text style={styles.tripMetaText}>
                {formatTime(item.date)}
              </Text>
            </View>
            
            <View style={styles.tripDistance}>
              <Icon name="map-marker-distance" size={14} color={colors.primary[500]} />
              <Text style={styles.tripDistanceText}>
                {item.distance} km
              </Text>
            </View>
          </View>

          {/* Special trip indicators */}
          <View style={styles.tripBadges}>
            {item.type === 'return' && (
              <View style={[styles.tripBadge, { backgroundColor: colors.success + '20' }]}>
                <Icon name="refresh" size={12} color={colors.success} />
                <Text style={[styles.tripBadgeText, { color: colors.success }]}>
                  Return Trip
                </Text>
              </View>
            )}
            
            {item.hasMultipleApps && (
              <View style={[styles.tripBadge, { backgroundColor: colors.gold + '20' }]}>
                <Icon name="layers" size={12} color={colors.gold} />
                <Text style={[styles.tripBadgeText, { color: colors.gold }]}>
                  Multi-App
                </Text>
              </View>
            )}
            
            {item.type === 'deadhead' && !item.hasOrder && (
              <View style={[styles.tripBadge, { backgroundColor: colors.warning + '20' }]}>
                <Icon name="alert" size={12} color={colors.warning} />
                <Text style={[styles.tripBadgeText, { color: colors.warning }]}>
                  Not Deductible
                </Text>
              </View>
            )}
            
            {item.orders && (
              <View style={[styles.tripBadge, { backgroundColor: colors.primary[500] + '20' }]}>
                <Icon name="package" size={12} color={colors.primary[500]} />
                <Text style={[styles.tripBadgeText, { color: colors.primary[500] }]}>
                  {item.orders} order{item.orders > 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </View>

          {item.notes && (
            <Text style={styles.tripNotes}>{item.notes}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading && !trips.length) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Mileage" />
        <View style={styles.loadingContainer}>
          <Text>Loading trips...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Mileage" 
        rightIcon="plus"
        onRightPress={() => navigation.navigate('MileageTracker')}
      />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Year Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.yearSelector}
        >
          {years.map(year => (
            <TouchableOpacity
              key={year}
              onPress={() => setSelectedYear(year)}
              style={[
                styles.yearChip,
                year === selectedYear && styles.yearChipSelected
              ]}
            >
              <Text style={[
                styles.yearChipText,
                year === selectedYear && styles.yearChipTextSelected
              ]}>
                {year}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Card.Body>
              <Text style={styles.statLabel}>Business KM</Text>
              <Text style={[styles.statValue, { color: colors.success }]}>
                {totalBusinessKm.toFixed(1)}
              </Text>
              <Text style={styles.statUnit}>km</Text>
            </Card.Body>
          </Card>

          <Card style={styles.statCard}>
            <Card.Body>
              <Text style={styles.statLabel}>Deductible KM</Text>
              <Text style={[styles.statValue, { color: colors.gold }]}>
                {deductibleKm.toFixed(1)}
              </Text>
              <Text style={styles.statUnit}>eligible</Text>
            </Card.Body>
          </Card>

          <Card style={styles.statCard}>
            <Card.Body>
              <Text style={styles.statLabel}>Est. Deduction</Text>
              <Text style={[styles.statValue, { color: colors.primary[500] }]}>
                ${estimatedDeduction.toFixed(2)}
              </Text>
              <Text style={styles.statUnit}>@ ${deductionRate}/km</Text>
            </Card.Body>
          </Card>
        </View>

        {/* Trip Type Breakdown */}
        <View style={styles.breakdownContainer}>
          <Card style={styles.breakdownCard}>
            <Card.Header>
              <Text style={styles.breakdownTitle}>Trip Breakdown</Text>
            </Card.Header>
            <Card.Body>
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownItem}>
                  <Text style={styles.breakdownLabel}>Deliveries</Text>
                  <Text style={styles.breakdownValue}>{deliveryTrips}</Text>
                </View>
                <View style={styles.breakdownItem}>
                  <Text style={styles.breakdownLabel}>Return Trips</Text>
                  <Text style={styles.breakdownValue}>{returnTrips}</Text>
                </View>
                <View style={styles.breakdownItem}>
                  <Text style={styles.breakdownLabel}>Multi-App</Text>
                  <Text style={styles.breakdownValue}>{multiAppTrips}</Text>
                </View>
              </View>
            </Card.Body>
          </Card>
        </View>

        {/* Chart */}
        <Card style={styles.chartCard}>
          <Card.Header>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Weekly Activity</Text>
              <View style={styles.chartToggle}>
                <TouchableOpacity
                  style={[
                    styles.chartToggleButton,
                    selectedPeriod === 'week' && styles.chartToggleButtonActive
                  ]}
                  onPress={() => setSelectedPeriod('week')}
                >
                  <Text style={[
                    styles.chartToggleText,
                    selectedPeriod === 'week' && styles.chartToggleTextActive
                  ]}>
                    Week
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.chartToggleButton,
                    selectedPeriod === 'month' && styles.chartToggleButtonActive
                  ]}
                  onPress={() => setSelectedPeriod('month')}
                >
                  <Text style={[
                    styles.chartToggleText,
                    selectedPeriod === 'month' && styles.chartToggleTextActive
                  ]}>
                    Month
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card.Header>
          <Card.Body>
            <LineChart
              data={chartData}
              width={width - spacing.xl * 2}
              height={180}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </Card.Body>
        </Card>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[
              styles.filterTab,
              filterType === 'all' && styles.filterTabActive
            ]}
            onPress={() => setFilterType('all')}
          >
            <Text style={[
              styles.filterTabText,
              filterType === 'all' && styles.filterTabTextActive
            ]}>
              All Trips
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterTab,
              filterType === 'business' && styles.filterTabActive
            ]}
            onPress={() => setFilterType('business')}
          >
            <Text style={[
              styles.filterTabText,
              filterType === 'business' && styles.filterTabTextActive
            ]}>
              Business
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterTab,
              filterType === 'personal' && styles.filterTabActive
            ]}
            onPress={() => setFilterType('personal')}
          >
            <Text style={[
              styles.filterTabText,
              filterType === 'personal' && styles.filterTabTextActive
            ]}>
              Personal
            </Text>
          </TouchableOpacity>
        </View>

        {/* Trips List */}
        {trips.length > 0 ? (
          <FlatList
            data={trips}
            renderItem={renderTripItem}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.tripsList}
          />
        ) : (
          <EmptyState
            icon="map-marker-distance"
            title="No trips recorded"
            message="Start tracking your mileage for tax deductions"
            buttonText="Start Tracking"
            onButtonPress={() => navigation.navigate('MileageTracker')}
          />
        )}

        {/* CRA Rate Info */}
        <Card style={styles.infoCard}>
          <Card.Body>
            <View style={styles.infoRow}>
              <Icon name="information" size={20} color={colors.primary[500]} />
              <Text style={styles.infoText}>
                2024 CRA mileage rate: ${deductionRate} per km for business travel
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="scale-balance" size={20} color={colors.primary[500]} />
              <Text style={styles.infoText}>
                Deadhead miles without orders may not be deductible. Multi-app trips should be prorated.
              </Text>
            </View>
          </Card.Body>
        </Card>
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: spacing.xl * 2,
  },
  yearSelector: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  yearChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  yearChipSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  yearChipText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
  },
  yearChipTextSelected: {
    color: colors.white,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.h4,
    marginVertical: spacing.xs,
  },
  statUnit: {
    ...typography.caption,
    color: colors.gray[400],
  },
  breakdownContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  breakdownCard: {
    width: '100%',
  },
  breakdownTitle: {
    ...typography.h6,
    color: colors.text.primary,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  breakdownItem: {
    alignItems: 'center',
  },
  breakdownLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  breakdownValue: {
    ...typography.h4,
    color: colors.primary[500],
  },
  chartCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartTitle: {
    ...typography.h6,
    color: colors.text.primary,
  },
  chartToggle: {
    flexDirection: 'row',
  },
  chartToggleButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
    marginLeft: spacing.sm,
  },
  chartToggleButtonActive: {
    backgroundColor: colors.primary[500],
  },
  chartToggleText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  chartToggleTextActive: {
    color: colors.white,
  },
  chart: {
    borderRadius: borderRadius.md,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  filterTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  filterTabActive: {
    borderBottomColor: colors.primary[500],
  },
  filterTabText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  filterTabTextActive: {
    color: colors.primary[500],
    fontWeight: typography.weights.medium,
  },
  tripsList: {
    paddingHorizontal: spacing.lg,
  },
  tripCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tripIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  tripInfo: {
    flex: 1,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  tripRoute: {
    ...typography.body,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    flex: 1,
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  tripMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tripMetaText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginRight: spacing.sm,
  },
  tripDistance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripDistanceText: {
    ...typography.body,
    fontWeight: typography.weights.semibold,
    color: colors.primary[500],
  },
  tripBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  tripBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  tripBadgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  tripNotes: {
    ...typography.caption,
    color: colors.gray[400],
    marginTop: spacing.xs,
  },
  infoCard: {
    margin: spacing.lg,
    backgroundColor: colors.primary[50],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoText: {
    ...typography.body2,
    color: colors.primary[700],
    marginLeft: spacing.sm,
    flex: 1,
  },
});

export default MileageScreen;










