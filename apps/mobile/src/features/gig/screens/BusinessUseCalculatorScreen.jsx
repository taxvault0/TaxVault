import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '@/features/auth/context/AuthContext';
import Header from '@/components/layout/AppHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';
import { getMileageRate, PROVINCES } from '@/utils/taxUtils';

const BusinessUseCalculatorScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  
  // Get user's province from route params, user object, or default to 'ON'
  const userProvince = route?.params?.province || user?.province || 'ON';
  const provinceInfo = PROVINCES.find(p => p.code === userProvince);
  const mileageRate = getMileageRate(userProvince);
  
  const [businessPercentage, setBusinessPercentage] = useState(70);
  const [totalKm, setTotalKm] = useState('');
  const [businessKm, setBusinessKm] = useState('');
  const [personalKm, setPersonalKm] = useState('');
  const [calculationMethod, setCalculationMethod] = useState('percentage');
  const [estimatedAnnualExpenses, setEstimatedAnnualExpenses] = useState(8500);

  const calculateFromLogs = () => {
    Alert.alert('Coming Soon', 'This will use your actual mileage logs');
  };

  const savePercentage = () => {
    Alert.alert('Success', 'Business use percentage saved');
    navigation.goBack();
  };

  // Calculate manual percentage
  const calculatedPercentage = totalKm && businessKm 
    ? ((parseFloat(businessKm) / parseFloat(totalKm)) * 100).toFixed(1)
    : '0';

  // Calculate deductible amount
  const deductibleAmount = (estimatedAnnualExpenses * businessPercentage) / 100;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Business Use Calculator" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Province and Rate Info */}
        <Card style={styles.rateCard}>
          <Card.Body>
            <View style={styles.rateRow}>
              <Icon name="map-marker" size={20} color={colors.primary[500]} />
              <Text style={styles.rateText}>
                {provinceInfo?.name || userProvince}
              </Text>
            </View>
            <View style={styles.rateRow}>
              <Icon name="gas-station" size={20} color={colors.primary[500]} />
              <Text style={styles.rateText}>
                CRA Mileage Rate: ${mileageRate.toFixed(2)}/km (2024)
              </Text>
            </View>
          </Card.Body>
        </Card>

        {/* CRA Requirement Notice */}
        <Card style={styles.craCard}>
          <Card.Body>
            <View style={styles.craRow}>
              <Icon name="alert" size={24} color={colors.warning} />
              <View style={styles.craContent}>
                <Text style={styles.craTitle}>Why This Matters</Text>
                <Text style={styles.craText}>
                  The CRA requires you to track business vs personal use of your vehicle. 
                  This percentage determines how much of your vehicle expenses you can deduct.
                </Text>
              </View>
            </View>
          </Card.Body>
        </Card>

        {/* Method Selection */}
        <Card style={styles.methodCard}>
          <Card.Body>
            <Text style={styles.sectionTitle}>Calculation Method</Text>
            
            <View style={styles.methodRow}>
              <TouchableOpacity
                style={[
                  styles.methodButton,
                  calculationMethod === 'percentage' && styles.methodButtonActive
                ]}
                onPress={() => setCalculationMethod('percentage')}
              >
                <Icon 
                  name="percent" 
                  size={24} 
                  color={calculationMethod === 'percentage' ? colors.primary[500] : colors.gray[400]} 
                />
                <Text style={[
                  styles.methodText,
                  calculationMethod === 'percentage' && styles.methodTextActive
                ]}>
                  Estimate
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodButton,
                  calculationMethod === 'manual' && styles.methodButtonActive
                ]}
                onPress={() => setCalculationMethod('manual')}
              >
                <Icon 
                  name="calculator" 
                  size={24} 
                  color={calculationMethod === 'manual' ? colors.primary[500] : colors.gray[400]} 
                />
                <Text style={[
                  styles.methodText,
                  calculationMethod === 'manual' && styles.methodTextActive
                ]}>
                  Manual
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodButton,
                  calculationMethod === 'log' && styles.methodButtonActive
                ]}
                onPress={() => setCalculationMethod('log')}
              >
                <Icon 
                  name="map-marker-distance" 
                  size={24} 
                  color={calculationMethod === 'log' ? colors.primary[500] : colors.gray[400]} 
                />
                <Text style={[
                  styles.methodText,
                  calculationMethod === 'log' && styles.methodTextActive
                ]}>
                  From Logs
                </Text>
              </TouchableOpacity>
            </View>
          </Card.Body>
        </Card>

        {/* Estimate Method */}
        {calculationMethod === 'percentage' && (
          <Card style={styles.estimateCard}>
            <Card.Body>
              <Text style={styles.sectionTitle}>Estimated Business Use</Text>
              
              <View style={styles.estimateDisplay}>
                <Text style={styles.estimateValue}>{businessPercentage}%</Text>
                <Text style={styles.estimateLabel}>
                  of vehicle use is for business
                </Text>
              </View>

              <Slider
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={businessPercentage}
                onValueChange={setBusinessPercentage}
                minimumTrackTintColor={colors.primary[500]}
                maximumTrackTintColor={colors.gray[300]}
                thumbTintColor={colors.primary[500]}
              />

              <Text style={styles.estimateHint}>
                Drag the slider to estimate your business use percentage based on your typical driving pattern.
              </Text>
            </Card.Body>
          </Card>
        )}

        {/* Manual Calculation */}
        {calculationMethod === 'manual' && (
          <Card style={styles.manualCard}>
            <Card.Body>
              <Text style={styles.sectionTitle}>Manual Calculation</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Total Kilometers (Year to Date)</Text>
                <TextInput
                  style={styles.input}
                  value={totalKm}
                  onChangeText={setTotalKm}
                  keyboardType="numeric"
                  placeholder="Enter total km"
                  placeholderTextColor={colors.gray[400]}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Business Kilometers</Text>
                <TextInput
                  style={styles.input}
                  value={businessKm}
                  onChangeText={setBusinessKm}
                  keyboardType="numeric"
                  placeholder="Enter business km"
                  placeholderTextColor={colors.gray[400]}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Personal Kilometers</Text>
                <TextInput
                  style={styles.input}
                  value={personalKm}
                  onChangeText={setPersonalKm}
                  keyboardType="numeric"
                  placeholder="Enter personal km"
                  placeholderTextColor={colors.gray[400]}
                />
              </View>

              {totalKm && businessKm && (
                <View style={styles.resultCard}>
                  <Text style={styles.resultLabel}>Calculated Business Use</Text>
                  <Text style={styles.resultValue}>{calculatedPercentage}%</Text>
                </View>
              )}
            </Card.Body>
          </Card>
        )}

        {/* From Logs Method */}
        {calculationMethod === 'log' && (
          <Card style={styles.logCard}>
            <Card.Body>
              <Text style={styles.sectionTitle}>From Mileage Logs</Text>

              <View style={styles.logDisplay}>
                <Icon name="map-marker-distance" size={64} color={colors.gray[300]} />
                <Text style={styles.logText}>
                  You need to track at least 30 days of trips to calculate accurately
                </Text>
                <Button
                  variant="primary"
                  onPress={calculateFromLogs}
                  style={styles.logButton}
                >
                  Use My Mileage Logs
                </Button>
              </View>
            </Card.Body>
          </Card>
        )}

        {/* Expense Impact */}
        <Card style={styles.impactCard}>
          <Card.Body>
            <Text style={styles.sectionTitle}>Impact on Deductions</Text>

            <View style={styles.impactRow}>
              <Text style={styles.impactLabel}>CRA Mileage Rate</Text>
              <Text style={[styles.impactValue, styles.rateValue]}>
                ${mileageRate.toFixed(2)}/km
              </Text>
            </View>

            <View style={styles.impactRow}>
              <Text style={styles.impactLabel}>Vehicle Expenses (estimated)</Text>
              <Text style={styles.impactValue}>
                ${estimatedAnnualExpenses.toFixed(2)}/year
              </Text>
            </View>

            <View style={styles.impactRow}>
              <Text style={styles.impactLabel}>Business Use</Text>
              <Text style={[styles.impactValue, styles.businessPercentage]}>
                {businessPercentage}%
              </Text>
            </View>

            <View style={styles.deductionDivider}>
              <View style={styles.deductionRow}>
                <Text style={styles.deductionLabel}>Deductible Amount</Text>
                <Text style={styles.deductionValue}>
                  ${deductibleAmount.toFixed(2)}
                </Text>
              </View>
            </View>

            <Text style={styles.impactFootnote}>
              *Based on estimated annual vehicle expenses. Track your actual expenses for accurate calculations.
            </Text>
          </Card.Body>
        </Card>

        {/* Save Button */}
        <Button
          variant="primary"
          onPress={savePercentage}
          style={styles.saveButton}
        >
          Save Business Use Percentage
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  rateCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.primary[50],
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  rateText: {
    ...typography.body2,
    color: colors.primary[700],
    marginLeft: spacing.sm,
    flex: 1,
  },
  craCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.warning + '10',
  },
  craRow: {
    flexDirection: 'row',
  },
  craContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  craTitle: {
    ...typography.body1,
    fontWeight: typography.weights.semibold,
    color: colors.warning,
    marginBottom: spacing.xs,
  },
  craText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  methodCard: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h6,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  methodRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  methodButton: {
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  methodButtonActive: {
    backgroundColor: colors.primary[50],
  },
  methodText: {
    marginTop: spacing.xs,
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  methodTextActive: {
    color: colors.primary[500],
    fontWeight: typography.weights.medium,
  },
  estimateCard: {
    marginBottom: spacing.lg,
  },
  estimateDisplay: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  estimateValue: {
    ...typography.h1,
    color: colors.primary[500],
  },
  estimateLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  estimateHint: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  manualCard: {
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.sizes.base,
    color: colors.text.primary,
  },
  resultCard: {
    backgroundColor: colors.primary[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  resultLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  resultValue: {
    ...typography.h3,
    color: colors.primary[500],
  },
  logCard: {
    marginBottom: spacing.lg,
  },
  logDisplay: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  logText: {
    ...typography.body1,
    textAlign: 'center',
    marginTop: spacing.md,
    color: colors.text.secondary,
  },
  logButton: {
    marginTop: spacing.lg,
  },
  impactCard: {
    marginBottom: spacing.lg,
  },
  impactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  impactLabel: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  impactValue: {
    ...typography.body2,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  rateValue: {
    color: colors.primary[500],
  },
  businessPercentage: {
    color: colors.primary[500],
  },
  deductionDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginVertical: spacing.sm,
    paddingTop: spacing.sm,
  },
  deductionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deductionLabel: {
    ...typography.body1,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  deductionValue: {
    ...typography.h4,
    color: colors.success,
  },
  impactFootnote: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  saveButton: {
    marginBottom: spacing.xl,
  },
});

export default BusinessUseCalculatorScreen;



