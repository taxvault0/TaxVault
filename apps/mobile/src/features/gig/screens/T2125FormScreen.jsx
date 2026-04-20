import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import Header from '@/components/layout/AppHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';

const T2125FormScreen = () => {
  const navigation = useNavigation();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState({
    // Business Information
    businessName: 'Marcus Chen - Uber Driver',
    businessAddress: '123 Main St, Toronto, ON M5V 2H1',
    businessNumber: '123456789',
    businessType: 'Ride-sharing services',
    
    // Income
    grossBusinessIncome: 42350.00,
    commissionsPaid: 0,
    businessUseOfHome: 0,
    otherIncome: 0,
    netIncome: 42350.00,
    
    // Expenses Summary
    expenses: {
      advertising: 0,
      meals: 450.00,
      insurance: 2400.00,
      interest: 0,
      maintenance: 1890.00,
      managementFees: 0,
      officeExpenses: 0,
      supplies: 320.00,
      legalFees: 0,
      fuel: 4230.00,
      propertyTaxes: 0,
      rent: 0,
      salaries: 0,
      travel: 0,
      telephone: 960.00,
      other: 515.00,
    },
    
    // Vehicle Expenses (for T2125 Section 5)
    vehicleExpenses: {
      fuel: 4230.00,
      maintenance: 1890.00,
      insurance: 2400.00,
      licenseFees: 120.00,
      leasePayments: 0,
      interest: 0,
      totalExpenses: 8640.00,
      totalKm: 3450,
      businessKm: 2345,
      businessPercentage: 68,
      deductibleAmount: 5875.20,
    },
    
    // Business-Use-of-Home Expenses
    homeExpenses: {
      utilities: 0,
      maintenance: 0,
      insurance: 0,
      mortgageInterest: 0,
      propertyTaxes: 0,
      totalExpenses: 0,
      workSpacePercentage: 0,
      deductibleAmount: 0,
    },
    
    // Summary
    totalExpenses: 12445.00,
    netBusinessIncome: 29905.00,
  });

  const [expandedSections, setExpandedSections] = useState({
    income: true,
    expenses: true,
    vehicle: true,
    home: true,
    summary: true,
  });

  const years = [2025, 2024, 2023, 2022];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const calculateTotals = () => {
    const totalExpenses = Object.values(formData.expenses).reduce((sum, val) => sum + val, 0);
    const netIncome = formData.grossBusinessIncome - totalExpenses;
    
    setFormData(prev => ({
      ...prev,
      totalExpenses,
      netBusinessIncome: netIncome,
    }));
  };

  useEffect(() => {
    calculateTotals();
  }, [formData.expenses, formData.grossBusinessIncome]);

  const generateHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>T2125 Form - ${selectedYear}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #005A9C; text-align: center; }
          h2 { color: #005A9C; border-bottom: 2px solid #005A9C; padding-bottom: 5px; margin-top: 30px; }
          .header { text-align: center; margin-bottom: 40px; }
          .section { margin: 20px 0; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .total { font-weight: bold; font-size: 1.1em; background-color: #f0f0f0; padding: 10px; }
          .business-info { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
          .amount { font-family: monospace; }
          .footer { text-align: center; margin-top: 50px; color: #666; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>T2125 - Statement of Business or Professional Activities</h1>
          <h2>Tax Year: ${selectedYear}</h2>
        </div>

        <div class="business-info">
          <h3>Business Information</h3>
          <p><strong>Business Name:</strong> ${formData.businessName}</p>
          <p><strong>Business Address:</strong> ${formData.businessAddress}</p>
          <p><strong>Business Number:</strong> ${formData.businessNumber}</p>
          <p><strong>Business Type:</strong> ${formData.businessType}</p>
        </div>

        <div class="section">
          <h3>Part 1 - Income</h3>
          <div class="row">
            <span>Gross business income</span>
            <span class="amount">$${formData.grossBusinessIncome.toFixed(2)}</span>
          </div>
          <div class="row">
            <span>Commissions paid to agents</span>
            <span class="amount">$${formData.commissionsPaid.toFixed(2)}</span>
          </div>
          <div class="row">
            <span>Business use of home expenses (from Part 4)</span>
            <span class="amount">$${formData.businessUseOfHome.toFixed(2)}</span>
          </div>
          <div class="row">
            <span>Other income</span>
            <span class="amount">$${formData.otherIncome.toFixed(2)}</span>
          </div>
          <div class="row total">
            <span>Net income (loss)</span>
            <span class="amount">$${formData.netIncome.toFixed(2)}</span>
          </div>
        </div>

        <div class="section">
          <h3>Part 2 - Business Expenses</h3>
          ${Object.entries(formData.expenses).map(([key, value]) => `
            <div class="row">
              <span>${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</span>
              <span class="amount">$${value.toFixed(2)}</span>
            </div>
          `).join('')}
          <div class="row total">
            <span>Total expenses</span>
            <span class="amount">$${formData.totalExpenses.toFixed(2)}</span>
          </div>
        </div>

        <div class="section">
          <h3>Part 3 - Motor Vehicle Expenses</h3>
          <div class="row">
            <span>Fuel</span>
            <span class="amount">$${formData.vehicleExpenses.fuel.toFixed(2)}</span>
          </div>
          <div class="row">
            <span>Maintenance and repairs</span>
            <span class="amount">$${formData.vehicleExpenses.maintenance.toFixed(2)}</span>
          </div>
          <div class="row">
            <span>Insurance</span>
            <span class="amount">$${formData.vehicleExpenses.insurance.toFixed(2)}</span>
          </div>
          <div class="row">
            <span>License and registration</span>
            <span class="amount">$${formData.vehicleExpenses.licenseFees.toFixed(2)}</span>
          </div>
          <div class="row">
            <span>Lease payments</span>
            <span class="amount">$${formData.vehicleExpenses.leasePayments.toFixed(2)}</span>
          </div>
          <div class="row">
            <span>Interest</span>
            <span class="amount">$${formData.vehicleExpenses.interest.toFixed(2)}</span>
          </div>
          <div class="row total">
            <span>Total motor vehicle expenses</span>
            <span class="amount">$${formData.vehicleExpenses.totalExpenses.toFixed(2)}</span>
          </div>
          <div class="row">
            <span>Total kilometers driven</span>
            <span>${formData.vehicleExpenses.totalKm} km</span>
          </div>
          <div class="row">
            <span>Kilometers driven for business</span>
            <span>${formData.vehicleExpenses.businessKm} km</span>
          </div>
          <div class="row">
            <span>Business use percentage</span>
            <span>${formData.vehicleExpenses.businessPercentage}%</span>
          </div>
          <div class="row total">
            <span>Allowable motor vehicle expenses</span>
            <span class="amount">$${formData.vehicleExpenses.deductibleAmount.toFixed(2)}</span>
          </div>
        </div>

        <div class="section">
          <h3>Summary</h3>
          <div class="row">
            <span>Total business income</span>
            <span class="amount">$${formData.grossBusinessIncome.toFixed(2)}</span>
          </div>
          <div class="row">
            <span>Total business expenses</span>
            <span class="amount">($${formData.totalExpenses.toFixed(2)})</span>
          </div>
          <div class="row total">
            <span>Net business income</span>
            <span class="amount">$${formData.netBusinessIncome.toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          <p>Generated by TaxVault Canada on ${new Date().toLocaleDateString()}</p>
          <p>This form is for information purposes. Please verify with CRA requirements.</p>
        </div>
      </body>
      </html>
    `;
  };

  const generatePDF = async () => {
    try {
      const html = generateHTML();
      const { uri } = await Print.printToFileAsync({ html });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          dialogTitle: `T2125 Form - ${selectedYear}`,
          UTI: 'com.adobe.pdf',
          mimeType: 'application/pdf',
        });
        Alert.alert('Success', 'T2125 form generated successfully');
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };

  const printForm = async () => {
    try {
      const html = generateHTML();
      await Print.printAsync({ html });
    } catch (error) {
      console.error('Error printing:', error);
      Alert.alert('Error', 'Failed to print');
    }
  };

  const SectionHeader = ({ title, section }) => (
    <TouchableOpacity
      onPress={() => toggleSection(section)}
      style={styles.sectionHeader}
    >
      <Text style={styles.sectionHeaderTitle}>{title}</Text>
      <Icon 
        name={expandedSections[section] ? 'chevron-up' : 'chevron-down'} 
        size={24} 
        color={colors.gray[400]} 
      />
    </TouchableOpacity>
  );

  const InfoRow = ({ label, value, isTotal = false }) => (
    <View style={styles.infoRow}>
      <Text style={[
        typography.body2,
        isTotal && styles.infoRowTotalLabel
      ]}>
        {label}
      </Text>
      <Text style={[
        typography.body2,
        isTotal && styles.infoRowTotalValue
      ]}>
        {value}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="T2125 Tax Form" showBack />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Year Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.yearSelector}
        >
          {years.map(year => (
            <TouchableOpacity
              key={year}
              style={[
                styles.yearChip,
                year === selectedYear && styles.yearChipSelected
              ]}
              onPress={() => setSelectedYear(year)}
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

        {/* Business Information Card */}
        <Card style={styles.infoCard}>
          <Card.Header>
            <Text style={styles.cardHeaderTitle}>Business Information</Text>
          </Card.Header>
          <Card.Body>
            <Text style={[typography.body2, styles.infoText]}>
              <Text style={styles.infoLabel}>Name:</Text> {formData.businessName}
            </Text>
            <Text style={[typography.body2, styles.infoText]}>
              <Text style={styles.infoLabel}>Address:</Text> {formData.businessAddress}
            </Text>
            <Text style={[typography.body2, styles.infoText]}>
              <Text style={styles.infoLabel}>Business #:</Text> {formData.businessNumber}
            </Text>
            <Text style={[typography.body2, styles.infoText]}>
              <Text style={styles.infoLabel}>Type:</Text> {formData.businessType}
            </Text>
          </Card.Body>
        </Card>

        {/* Income Section */}
        <Card style={styles.sectionCard}>
          <SectionHeader title="Part 1 - Income" section="income" />
          {expandedSections.income && (
            <Card.Body>
              <InfoRow label="Gross business income" value={`$${formData.grossBusinessIncome.toFixed(2)}`} />
              <InfoRow label="Commissions paid" value={`$${formData.commissionsPaid.toFixed(2)}`} />
              <InfoRow label="Business use of home" value={`$${formData.businessUseOfHome.toFixed(2)}`} />
              <InfoRow label="Other income" value={`$${formData.otherIncome.toFixed(2)}`} />
              <InfoRow label="Net income (loss)" value={`$${formData.netIncome.toFixed(2)}`} isTotal />
            </Card.Body>
          )}
        </Card>

        {/* Expenses Section */}
        <Card style={styles.sectionCard}>
          <SectionHeader title="Part 2 - Business Expenses" section="expenses" />
          {expandedSections.expenses && (
            <Card.Body>
              <InfoRow label="Advertising" value={`$${formData.expenses.advertising.toFixed(2)}`} />
              <InfoRow label="Meals & entertainment" value={`$${formData.expenses.meals.toFixed(2)}`} />
              <InfoRow label="Insurance" value={`$${formData.expenses.insurance.toFixed(2)}`} />
              <InfoRow label="Interest" value={`$${formData.expenses.interest.toFixed(2)}`} />
              <InfoRow label="Maintenance & repairs" value={`$${formData.expenses.maintenance.toFixed(2)}`} />
              <InfoRow label="Management fees" value={`$${formData.expenses.managementFees.toFixed(2)}`} />
              <InfoRow label="Office expenses" value={`$${formData.expenses.officeExpenses.toFixed(2)}`} />
              <InfoRow label="Supplies" value={`$${formData.expenses.supplies.toFixed(2)}`} />
              <InfoRow label="Legal & accounting" value={`$${formData.expenses.legalFees.toFixed(2)}`} />
              <InfoRow label="Fuel" value={`$${formData.expenses.fuel.toFixed(2)}`} />
              <InfoRow label="Property taxes" value={`$${formData.expenses.propertyTaxes.toFixed(2)}`} />
              <InfoRow label="Rent" value={`$${formData.expenses.rent.toFixed(2)}`} />
              <InfoRow label="Salaries & wages" value={`$${formData.expenses.salaries.toFixed(2)}`} />
              <InfoRow label="Travel" value={`$${formData.expenses.travel.toFixed(2)}`} />
              <InfoRow label="Telephone & utilities" value={`$${formData.expenses.telephone.toFixed(2)}`} />
              <InfoRow label="Other expenses" value={`$${formData.expenses.other.toFixed(2)}`} />
              <InfoRow label="Total expenses" value={`$${formData.totalExpenses.toFixed(2)}`} isTotal />
            </Card.Body>
          )}
        </Card>

        {/* Motor Vehicle Expenses */}
        <Card style={styles.sectionCard}>
          <SectionHeader title="Part 3 - Motor Vehicle Expenses" section="vehicle" />
          {expandedSections.vehicle && (
            <Card.Body>
              <InfoRow label="Fuel" value={`$${formData.vehicleExpenses.fuel.toFixed(2)}`} />
              <InfoRow label="Maintenance & repairs" value={`$${formData.vehicleExpenses.maintenance.toFixed(2)}`} />
              <InfoRow label="Insurance" value={`$${formData.vehicleExpenses.insurance.toFixed(2)}`} />
              <InfoRow label="License fees" value={`$${formData.vehicleExpenses.licenseFees.toFixed(2)}`} />
              <InfoRow label="Lease payments" value={`$${formData.vehicleExpenses.leasePayments.toFixed(2)}`} />
              <InfoRow label="Interest" value={`$${formData.vehicleExpenses.interest.toFixed(2)}`} />
              <InfoRow label="Total vehicle expenses" value={`$${formData.vehicleExpenses.totalExpenses.toFixed(2)}`} isTotal />
              
              <View style={styles.calculationCard}>
                <Text style={styles.calculationTitle}>Business Use Calculation</Text>
                <View style={styles.calculationRow}>
                  <Text>Total km: {formData.vehicleExpenses.totalKm}</Text>
                  <Text>Business km: {formData.vehicleExpenses.businessKm}</Text>
                  <Text style={styles.calculationPercentage}>
                    {formData.vehicleExpenses.businessPercentage}%
                  </Text>
                </View>
                <InfoRow 
                  label="Allowable vehicle expenses" 
                  value={`$${formData.vehicleExpenses.deductibleAmount.toFixed(2)}`} 
                  isTotal 
                />
              </View>
            </Card.Body>
          )}
        </Card>

        {/* Summary Section */}
        <Card style={styles.sectionCard}>
          <SectionHeader title="Summary" section="summary" />
          {expandedSections.summary && (
            <Card.Body>
              <InfoRow label="Total business income" value={`$${formData.grossBusinessIncome.toFixed(2)}`} />
              <InfoRow label="Total business expenses" value={`-$${formData.totalExpenses.toFixed(2)}`} />
              <View style={styles.summaryDivider}>
                <InfoRow 
                  label="Net business income" 
                  value={`$${formData.netBusinessIncome.toFixed(2)}`} 
                  isTotal 
                />
              </View>

              <View style={styles.tipContainer}>
                <Text style={styles.tipText}>
                  This amount should be reported on line 13500 of your T1 income tax return.
                </Text>
              </View>
            </Card.Body>
          )}
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            variant="outline"
            onPress={printForm}
            style={styles.actionButton}
          >
            Print
          </Button>
          <Button
            variant="primary"
            onPress={generatePDF}
            style={styles.actionButton}
          >
            Save as PDF
          </Button>
        </View>

        {/* CRA Info */}
        <Card style={styles.craCard}>
          <Card.Body>
            <View style={styles.craRow}>
              <Icon name="information" size={20} color={colors.info} />
              <View style={styles.craContent}>
                <Text style={styles.craText}>
                  File this form with your T1 income tax return. You need to include all business income and expenses.
                </Text>
                <TouchableOpacity 
                  onPress={() => Alert.alert('CRA Link', 'Visit canada.ca for more information')}
                  style={styles.craLink}
                >
                  <Text style={styles.craLinkText}>
                    Learn more on CRA website
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card.Body>
        </Card>
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
  yearSelector: {
    marginBottom: spacing.lg,
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
  infoCard: {
    marginBottom: spacing.md,
  },
  cardHeaderTitle: {
    ...typography.h6,
    color: colors.text.primary,
  },
  infoText: {
    marginBottom: spacing.xs,
  },
  infoLabel: {
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  sectionCard: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionHeaderTitle: {
    ...typography.h6,
    color: colors.primary[500],
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoRowTotalLabel: {
    fontWeight: typography.weights.semibold,
  },
  infoRowTotalValue: {
    fontWeight: typography.weights.semibold,
    color: colors.primary[500],
  },
  calculationCard: {
    marginTop: spacing.md,
    backgroundColor: colors.primary[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  calculationTitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  calculationPercentage: {
    color: colors.primary[500],
    fontWeight: typography.weights.semibold,
  },
  summaryDivider: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 2,
    borderTopColor: colors.primary[500],
  },
  tipContainer: {
    marginTop: spacing.md,
  },
  tipText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  actionButton: {
    flex: 1,
  },
  craCard: {
    backgroundColor: colors.info + '10',
  },
  craRow: {
    flexDirection: 'row',
  },
  craContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  craText: {
    ...typography.caption,
    color: colors.text.primary,
  },
  craLink: {
    marginTop: spacing.sm,
  },
  craLinkText: {
    ...typography.caption,
    color: colors.primary[500],
    textDecorationLine: 'underline',
  },
});

export default T2125FormScreen;



