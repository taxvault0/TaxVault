import React, { useState, useEffect } from 'react';
    
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Polyline, Marker } from 'react-native-maps';
import Header from '@/components/layout/AppHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';
import { getTrip, updateTrip, deleteTrip } from '@/services/mileageAPI';

const TripDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const queryClient = useQueryClient();
  const { id } = route.params;

  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [editedTrip, setEditedTrip] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch trip details
  const { data: trip, isLoading, error } = useQuery({
    queryKey: ['trip', id],
    queryFn: () => getTrip(id),
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (updatedData) => updateTrip(id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip', id] });
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['tripStats'] });
      setIsEditing(false);
      Alert.alert('Success', 'Trip updated successfully');
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'Failed to update trip');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteTrip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['tripStats'] });
      Alert.alert('Success', 'Trip deleted successfully');
      navigation.goBack();
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'Failed to delete trip');
    },
  });

  useEffect(() => {
    if (trip) {
      setEditedTrip({ ...trip });
    }
  }, [trip]);

  const handleSave = () => {
    if (!editedTrip) return;
    
    // Validate required fields
    if (!editedTrip.distance || editedTrip.distance <= 0) {
      Alert.alert('Error', 'Please enter a valid distance');
      return;
    }
    
    updateMutation.mutate(editedTrip);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Trip',
      'Are you sure you want to delete this trip? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(),
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-CA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins} minutes`;
  };

  const getTripColor = (trip) => {
    if (trip.type === 'return') return colors.success;
    if (trip.hasMultipleApps) return colors.gold;
    if (trip.purpose === 'delivery') return colors.primary[500];
    if (trip.purpose === 'business') return colors.success;
    if (trip.purpose === 'commute') return colors.info;
    return colors.warning;
  };

  const getPurposeIcon = (purpose) => {
    const icons = {
      business: 'briefcase',
      delivery: 'food',
      commute: 'home',
      personal: 'account',
    };
    return icons[purpose] || 'map-marker';
  };

  const isDeductible = () => {
    if (!trip) return false;
    
    // Business logic for deductibility
    if (trip.type === 'deadhead' && !trip.hasOrder) return false;
    if (trip.purpose === 'personal' || trip.purpose === 'commute') return false;
    if (trip.purpose === 'business' || trip.purpose === 'delivery') return true;
    if (trip.type === 'return' && trip.hasOrder) return true;
    
    return false;
  };

  const calculateDeductibleAmount = () => {
    if (!trip || !isDeductible()) return 0;
    
    const rate = 0.61; // CRA 2024 rate
    let deductibleKm = trip.distance;
    
    if (trip.hasMultipleApps) {
      const appShare = trip.appShare || 0.5;
      deductibleKm = trip.distance * appShare;
    }
    
    return (deductibleKm * rate).toFixed(2);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Trip Details" showBack />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={styles.loadingText}>Loading trip details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !trip) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Trip Details" showBack />
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={64} color={colors.error} />
          <Text style={styles.errorTitle}>Failed to load trip</Text>
          <Text style={styles.errorMessage}>
            {error?.message || 'Trip not found'}
          </Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Trip Details" 
        showBack
        rightIcon={!isEditing ? 'pencil' : undefined}
        onRightPress={() => setIsEditing(true)}
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Map Preview */}
        {trip.route && (
          <Card style={styles.mapCard}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: trip.startLat || 43.6532,
                longitude: trip.startLng || -79.3832,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              {trip.startLat && trip.startLng && (
                <Marker
                  coordinate={{
                    latitude: trip.startLat,
                    longitude: trip.startLng,
                  }}
                  title="Start"
                  pinColor={colors.success}
                />
              )}
              {trip.endLat && trip.endLng && (
                <Marker
                  coordinate={{
                    latitude: trip.endLat,
                    longitude: trip.endLng,
                  }}
                  title="End"
                  pinColor={colors.error}
                />
              )}
              {trip.routeCoordinates && (
                <Polyline
                  coordinates={trip.routeCoordinates}
                  strokeColor={colors.primary[500]}
                  strokeWidth={3}
                />
              )}
            </MapView>
          </Card>
        )}

        {/* Trip Status */}
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusLeft}>
              <View style={[styles.statusIcon, { backgroundColor: getTripColor(trip) + '20' }]}>
                <Icon name={getPurposeIcon(trip.purpose)} size={24} color={getTripColor(trip)} />
              </View>
              <View>
                <Text style={styles.tripRoute}>
                  {trip.start || 'Unknown'} → {trip.end || 'Unknown'}
                </Text>
                <Text style={styles.tripDate}>
                  {formatDate(trip.date)} at {formatTime(trip.date)}
                </Text>
              </View>
            </View>
            <Badge status={trip.purpose} />
          </View>

          <View style={styles.statusDivider} />

          <View style={styles.statusGrid}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Distance</Text>
              <Text style={styles.statusValue}>{trip.distance} km</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Duration</Text>
              <Text style={styles.statusValue}>{formatDuration(trip.duration)}</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Deductible</Text>
              <Text style={[styles.statusValue, { color: isDeductible() ? colors.success : colors.error }]}>
                {isDeductible() ? 'Yes' : 'No'}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Est. Deduction</Text>
              <Text style={[styles.statusValue, { color: colors.gold }]}>
                ${calculateDeductibleAmount()}
              </Text>
            </View>
          </View>
        </Card>

        {/* Trip Details */}
        <Card style={styles.detailsCard}>
          <Card.Header>
            <Text style={styles.sectionTitle}>Trip Details</Text>
          </Card.Header>
          <Card.Body>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Purpose</Text>
              {isEditing ? (
                <View style={styles.pickerContainer}>
                  {['business', 'delivery', 'commute', 'personal'].map((purpose) => (
                    <TouchableOpacity
                      key={purpose}
                      style={[
                        styles.purposeOption,
                        editedTrip?.purpose === purpose && styles.purposeOptionSelected,
                      ]}
                      onPress={() => setEditedTrip({ ...editedTrip, purpose })}
                    >
                      <Icon
                        name={getPurposeIcon(purpose)}
                        size={16}
                        color={editedTrip?.purpose === purpose ? colors.white : colors.text.secondary}
                      />
                      <Text
                        style={[
                          styles.purposeText,
                          editedTrip?.purpose === purpose && styles.purposeTextSelected,
                        ]}
                      >
                        {purpose.charAt(0).toUpperCase() + purpose.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.detailValue}>
                  <Icon
                    name={getPurposeIcon(trip.purpose)}
                    size={20}
                    color={getTripColor(trip)}
                  />
                  <Text style={styles.detailText}>
                    {trip.purpose.charAt(0).toUpperCase() + trip.purpose.slice(1)}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Distance</Text>
              {isEditing ? (
                <View style={styles.distanceInput}>
                  <TextInput
                    style={styles.input}
                    value={String(editedTrip?.distance || '')}
                    onChangeText={(text) => setEditedTrip({ 
                      ...editedTrip, 
                      distance: parseFloat(text) || 0 
                    })}
                    keyboardType="numeric"
                    placeholder="Enter distance"
                  />
                  <Text style={styles.inputUnit}>km</Text>
                </View>
              ) : (
                <Text style={styles.detailText}>{trip.distance} km</Text>
              )}
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailText}>{formatDuration(trip.duration)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date & Time</Text>
              {isEditing ? (
                <View style={styles.datetimeContainer}>
                  <TouchableOpacity
                    style={styles.datetimeButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Icon name="calendar" size={20} color={colors.primary[500]} />
                    <Text style={styles.datetimeText}>
                      {editedTrip?.date ? formatDate(editedTrip.date) : 'Select date'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.datetimeButton}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Icon name="clock-outline" size={20} color={colors.primary[500]} />
                    <Text style={styles.datetimeText}>
                      {editedTrip?.date ? formatTime(editedTrip.date) : 'Select time'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <Text style={styles.detailText}>{formatDate(trip.date)}</Text>
                  <Text style={styles.detailSubtext}>{formatTime(trip.date)}</Text>
                </View>
              )}
            </View>

            {trip.orders !== undefined && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Orders</Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, styles.numberInput]}
                    value={String(editedTrip?.orders || '')}
                    onChangeText={(text) => setEditedTrip({ 
                      ...editedTrip, 
                      orders: parseInt(text) || 0 
                    })}
                    keyboardType="numeric"
                    placeholder="Number of orders"
                  />
                ) : (
                  <Text style={styles.detailText}>{trip.orders}</Text>
                )}
              </View>
            )}
          </Card.Body>
        </Card>

        {/* Business Logic Details */}
        <Card style={styles.logicCard}>
          <Card.Header>
            <Text style={styles.sectionTitle}>Business Details</Text>
          </Card.Header>
          <Card.Body>
            <View style={styles.logicRow}>
              <View style={styles.logicIcon}>
                <Icon name="briefcase" size={20} color={colors.primary[500]} />
              </View>
              <View style={styles.logicContent}>
                <Text style={styles.logicLabel}>Trip Type</Text>
                <View style={styles.logicBadges}>
                  {trip.type && (
                    <View style={[styles.logicBadge, { backgroundColor: colors.info + '20' }]}>
                      <Text style={[styles.logicBadgeText, { color: colors.info }]}>
                        {trip.type.charAt(0).toUpperCase() + trip.type.slice(1)}
                      </Text>
                    </View>
                  )}
                  {trip.hasMultipleApps && (
                    <View style={[styles.logicBadge, { backgroundColor: colors.gold + '20' }]}>
                      <Icon name="layers" size={12} color={colors.gold} />
                      <Text style={[styles.logicBadgeText, { color: colors.gold }]}>
                        Multi-App
                      </Text>
                    </View>
                  )}
                  {trip.hasOrder && (
                    <View style={[styles.logicBadge, { backgroundColor: colors.success + '20' }]}>
                      <Icon name="package" size={12} color={colors.success} />
                      <Text style={[styles.logicBadgeText, { color: colors.success }]}>
                        Has Order
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {trip.hasMultipleApps && (
              <View style={styles.logicRow}>
                <View style={styles.logicIcon}>
                  <Icon name="percent" size={20} color={colors.gold} />
                </View>
                <View style={styles.logicContent}>
                  <Text style={styles.logicLabel}>App Share</Text>
                  {isEditing ? (
                    <View style={styles.shareSlider}>
                      {[25, 50, 75, 100].map((share) => (
                        <TouchableOpacity
                          key={share}
                          style={[
                            styles.shareOption,
                            editedTrip?.appShare * 100 === share && styles.shareOptionSelected,
                          ]}
                          onPress={() => setEditedTrip({ 
                            ...editedTrip, 
                            appShare: share / 100 
                          })}
                        >
                          <Text
                            style={[
                              styles.shareText,
                              editedTrip?.appShare * 100 === share && styles.shareTextSelected,
                            ]}
                          >
                            {share}%
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.logicValue}>
                      {(trip.appShare * 100).toFixed(0)}% business use
                    </Text>
                  )}
                </View>
              </View>
            )}

            <View style={styles.logicRow}>
              <View style={styles.logicIcon}>
                <Icon name="calculator" size={20} color={colors.primary[500]} />
              </View>
              <View style={styles.logicContent}>
                <Text style={styles.logicLabel}>Deductibility</Text>
                <Text style={styles.logicValue}>
                  {isDeductible() ? (
                    <Text style={{ color: colors.success }}>Eligible for deduction</Text>
                  ) : (
                    <Text style={{ color: colors.error }}>Not eligible for deduction</Text>
                  )}
                </Text>
                {isDeductible() && (
                  <Text style={styles.logicSubtext}>
                    Estimated deduction: ${calculateDeductibleAmount()}
                  </Text>
                )}
              </View>
            </View>
          </Card.Body>
        </Card>

        {/* Notes */}
        {(trip.notes || isEditing) && (
          <Card style={styles.notesCard}>
            <Card.Header>
              <Text style={styles.sectionTitle}>Notes</Text>
            </Card.Header>
            <Card.Body>
              {isEditing ? (
                <TextInput
                  style={styles.notesInput}
                  value={editedTrip?.notes || ''}
                  onChangeText={(text) => setEditedTrip({ ...editedTrip, notes: text })}
                  placeholder="Add notes about this trip..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              ) : (
                <Text style={styles.notesText}>{trip.notes}</Text>
              )}
            </Card.Body>
          </Card>
        )}

        {/* Action Buttons */}
        {isEditing ? (
          <View style={styles.actionButtons}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => {
                setIsEditing(false);
                setEditedTrip({ ...trip });
              }}
              style={styles.actionButton}
            />
            <Button
              title="Save Changes"
              onPress={handleSave}
              loading={updateMutation.isLoading}
              style={styles.actionButton}
            />
          </View>
        ) : (
          <Button
            title="Delete Trip"
            variant="danger"
            onPress={handleDelete}
            loading={deleteMutation.isLoading}
            style={styles.deleteButton}
          />
        )}

        {/* Date/Time Pickers */}
        {showDatePicker && (
          <DateTimePicker
            value={new Date(editedTrip?.date || new Date())}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                const currentDate = new Date(editedTrip?.date || new Date());
                selectedDate.setHours(currentDate.getHours());
                selectedDate.setMinutes(currentDate.getMinutes());
                setEditedTrip({ ...editedTrip, date: selectedDate.toISOString() });
              }
            }}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={new Date(editedTrip?.date || new Date())}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) {
                const currentDate = new Date(editedTrip?.date || new Date());
                currentDate.setHours(selectedTime.getHours());
                currentDate.setMinutes(selectedTime.getMinutes());
                setEditedTrip({ ...editedTrip, date: currentDate.toISOString() });
              }
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    ...typography.h3,
    color: colors.error,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  errorMessage: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  errorButton: {
    minWidth: 200,
  },
  mapCard: {
    marginBottom: spacing.md,
    overflow: 'hidden',
    padding: 0,
  },
  map: {
    height: 200,
    width: '100%',
  },
  statusCard: {
    marginBottom: spacing.md,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  tripRoute: {
    ...typography.body,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
  },
  tripDate: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  statusDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusItem: {
    width: '50%',
    marginBottom: spacing.md,
  },
  statusLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  statusValue: {
    ...typography.h4,
    color: colors.text.primary,
  },
  detailsCard: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h6,
    color: colors.text.primary,
  },
  detailRow: {
    marginBottom: spacing.lg,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  detailValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    ...typography.body,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  detailSubtext: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  purposeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
    gap: spacing.xs,
  },
  purposeOptionSelected: {
    backgroundColor: colors.primary[500],
  },
  purposeText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  purposeTextSelected: {
    color: colors.white,
  },
  distanceInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    ...typography.body,
    color: colors.text.primary,
  },
  numberInput: {
    width: 100,
  },
  inputUnit: {
    ...typography.body,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  datetimeContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  datetimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  datetimeText: {
    ...typography.body,
    color: colors.text.primary,
  },
  logicCard: {
    marginBottom: spacing.md,
  },
  logicRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  logicIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  logicContent: {
    flex: 1,
  },
  logicLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  logicValue: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
  logicSubtext: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  logicBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  logicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  logicBadgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  shareSlider: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  shareOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
  },
  shareOptionSelected: {
    backgroundColor: colors.gold,
  },
  shareText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  shareTextSelected: {
    color: colors.white,
  },
  notesCard: {
    marginBottom: spacing.xl,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text.primary,
    minHeight: 100,
  },
  notesText: {
    ...typography.body,
    color: colors.text.primary,
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  deleteButton: {
    marginTop: spacing.md,
  },
});

export default TripDetailScreen;








