import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/features/auth/context/AuthContext';
import Header from '@/components/layout/AppHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { colors, typography, spacing, borderRadius } from '@/styles/theme';
import {
  PROVINCES,
  TAX_RATES,
  calculateTaxes,
  getTaxAgency,
  getBusinessNumberFormat,
  getFilingDeadline,
} from '@/utils/taxUtils';

const GSTDashboardScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const navigationHook = useNavigation();
  const nav = navigation || navigationHook;
  
  // Get user's province from route params, user object, or default to 'ON'
  const userProvince = route?.params?.province || user?.province || 'ON';
  const provinceInfo = PROVINCES.find(p => p.code === userProvince);
  const taxAgency = getTaxAgency(userProvince);
  const bnFormat = getBusinessNumberFormat(userProvince);
  
  const [gstData, setGstData] = useState({
    businessNumber: user?.businessNumber || `123456789${bnFormat.prefix}0001`,
    filingFrequency: 'quarterly',
    nextFilingDate: '2024-04-30',
    lastFiledDate: '2024-01-31',
    collectedYTD: 1250.75,
    paidYTD: 450.50,
    netPayable: 800.25,
    quarters: [
      { 
        period: 'Q1 2024', 
        collected: 1250.75, 
        paid: 450.50, 
        net: 800.25,
        status: 'filed',
        dueDate: '2024-04-30',
      },
      { 
        period: 'Q4 2023', 
        collected: 980.25, 
        paid: 320.75, 
        net: 659.50,
        status: 'filed',
        dueDate: '2024-01-31',
      },
      { 
        period: 'Q3 2023', 
        collected: 1120.50, 
        paid: 380.25, 
        net: 740.25,
        status: 'filed',
        dueDate: '2023-10-31',
      },
    ],
  });

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Get tax info for display using the utility function
  const taxInfo = calculateTaxes(100, userProvince);

  const getTaxTypeName = () => {
    const rates = TAX_RATES.provincial[userProvince];
    if (!rates) return 'GST';
    
    switch (rates.type) {
      case 'HST': return 'HST';
      case 'PST': return 'GST + PST';
      case 'RST': return 'GST + RST';
      case 'QST': return 'GST + QST';
      default: return 'GST';
    }
  };

  const getTaxRateDisplay = () => {
    const rates = TAX_RATES.provincial[userProvince];
    if (!rates) return '5% GST';
    
    switch (rates.type) {
      case 'HST':
        return `${(rates.rate * 100).toFixed(0)}% HST`;
      case 'PST':
        return `5% GST + ${(rates.rate * 100).toFixed(0)}% PST`;
      case 'RST':
        return `5% GST + ${(rates.rate * 100).toFixed(0)}% RST`;
      case 'QST':
        return `5% GST + ${(rates.rate * 100).toFixed(2)}% QST`;
      default:
        return '5% GST';
    }
  };

  const getFilingInfo = () => {
    return getFilingDeadline(userProvince, gstData.filingFrequency);
  };

  const fileGSTReturn = (quarter) => {
    const agency = taxAgency.hasSeparateProvincial ? 
      `${taxAgency.agency} (separate filing may be required)` : 
      'CRA';
    
    Alert.alert(
      `File ${getTaxTypeName()} Return`,
      `Filing for ${quarter.period}\nAmount due: $${quarter.net.toFixed(2)}\nAgency: ${agency}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download Report', onPress: () => console.log('Download') },
        { text: 'File Online', onPress: () => console.log('File') },
      ]
    );
  };

  const generateReport = () => {
    Alert.alert('Coming Soon', 'Report generation will be available soon');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title={`${provinceInfo?.name || 'Tax'} Dashboard`} showBack />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Province Info Card */}
        <Card style={styles.provinceCard}>
          <Card.Body>
            <View style={styles.provinceHeader}>
              <View style={styles.provinceTitleRow}>
                <Icon name="map-marker" size={24} color={colors.primary[500]} />
                <View style={styles.provinceTitle}>
                  <Text style={styles.provinceLabel}>Province/Territory</Text>
                  <Text style={styles.provinceName}>{provinceInfo?.name}</Text>
                </View>
              </View>
              <Badge status="info" text={provinceInfo?.type || 'GST'} />
            </View>

            <View style={styles.provinceDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Tax System</Text>
                <Text style={styles.detailValue}>{getTaxRateDisplay()}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Tax Agency</Text>
                <Text style={styles.detailValue}>{taxAgency.agency}</Text>
              </View>
            </View>

            {taxAgency.hasSeparateProvincial && (
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                  ⚠️ This province requires separate provincial tax filings
                </Text>
              </View>
            )}
          </Card.Body>
        </Card>

        {/* Registration Card */}
        <Card style={styles.registrationCard}>
          <Card.Body>
            <View style={styles.registrationRow}>
              <View style={styles.registrationInfo}>
                <Text style={styles.registrationLabel}>Business Number</Text>
                <Text style={styles.registrationNumber}>{gstData.businessNumber}</Text>
                <Text style={styles.registrationFormat}>
                  Format: {bnFormat.pattern}
                </Text>
              </View>
              <Icon name="check-decagram" size={32} color={colors.success} />
            </View>
          </Card.Body>
        </Card>

        {/* Filing Schedule */}
        <Card style={styles.scheduleCard}>
          <Card.Body>
            <Text style={styles.scheduleTitle}>Filing Schedule</Text>
            <View style={styles.scheduleRow}>
              <View>
                <Text style={styles.scheduleLabel}>Frequency</Text>
                <Text style={styles.scheduleValue}>
                  {gstData.filingFrequency.charAt(0).toUpperCase() + gstData.filingFrequency.slice(1)}
                </Text>
              </View>
              <View>
                <Text style={styles.scheduleLabel}>Next Filing</Text>
                <Text style={[styles.scheduleValue, styles.nextFilingDate]}>
                  {gstData.nextFilingDate}
                </Text>
              </View>
              <View>
                <Text style={styles.scheduleLabel}>Last Filed</Text>
                <Text style={styles.scheduleValue}>{gstData.lastFiledDate}</Text>
              </View>
            </View>
            <Text style={styles.deadlineNote}>
              {getFilingInfo().deadline}
            </Text>
            {getFilingInfo().note && (
              <Text style={styles.filingNote}>
                {getFilingInfo().note}
              </Text>
            )}
          </Card.Body>
        </Card>

        {/* YTD Summary */}
        <Card style={styles.summaryCard}>
          <Card.Body>
            <Text style={styles.summaryTitle}>Year-to-Date Summary</Text>
            
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Tax Collected</Text>
                <Text style={[styles.summaryAmount, styles.collectedAmount]}>
                  ${gstData.collectedYTD.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>ITCs Claimed</Text>
                <Text style={[styles.summaryAmount, styles.itcAmount]}>
                  ${gstData.paidYTD.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Net Payable</Text>
                <Text style={[styles.summaryAmount, styles.netPayableAmount]}>
                  ${gstData.netPayable.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Tax Breakdown Example */}
            <View style={styles.taxExample}>
              <Text style={styles.taxExampleTitle}>
                Example Tax Calculation ($100 sale)
              </Text>
              {taxInfo.gst > 0 && (
                <View style={styles.taxRow}>
                  <Text>GST (5%)</Text>
                  <Text>$5.00</Text>
                </View>
              )}
              {taxInfo.pst > 0 && (
                <View style={styles.taxRow}>
                  <Text>PST ({(TAX_RATES.provincial[userProvince]?.rate * 100).toFixed(0)}%)</Text>
                  <Text>${(100 * (TAX_RATES.provincial[userProvince]?.rate || 0)).toFixed(2)}</Text>
                </View>
              )}
              {taxInfo.hst > 0 && (
                <View style={styles.taxRow}>
                  <Text>HST ({(TAX_RATES.provincial[userProvince]?.rate * 100).toFixed(0)}%)</Text>
                  <Text>${(100 * (TAX_RATES.provincial[userProvince]?.rate || 0)).toFixed(2)}</Text>
                </View>
              )}
              {taxInfo.qst > 0 && (
                <View style={styles.taxRow}>
                  <Text>QST ({(TAX_RATES.provincial[userProvince]?.rate * 100).toFixed(2)}%)</Text>
                  <Text>${(100 * (TAX_RATES.provincial[userProvince]?.rate || 0)).toFixed(2)}</Text>
                </View>
              )}
              <View style={styles.taxTotal}>
                <Text style={styles.taxTotalLabel}>Total Tax</Text>
                <Text style={styles.taxTotalValue}>${taxInfo.total.toFixed(2)}</Text>
              </View>
            </View>
          </Card.Body>
        </Card>

        {/* Quarterly Breakdown */}
        <Text style={styles.sectionTitle}>Quarterly Returns</Text>

        {gstData.quarters.map((quarter, index) => (
          <Card key={index} style={styles.quarterCard}>
            <Card.Header>
              <View style={styles.quarterHeader}>
                <Text style={styles.quarterPeriod}>{quarter.period}</Text>
                <Badge status={quarter.status} />
              </View>
            </Card.Header>
            <Card.Body>
              <View style={styles.quarterAmounts}>
                <View>
                  <Text style={styles.quarterAmountLabel}>Collected</Text>
                  <Text style={styles.quarterAmountValue}>${quarter.collected.toFixed(2)}</Text>
                </View>
                <View>
                  <Text style={styles.quarterAmountLabel}>ITCs</Text>
                  <Text style={styles.quarterAmountValue}>${quarter.paid.toFixed(2)}</Text>
                </View>
                <View>
                  <Text style={styles.quarterAmountLabel}>Net</Text>
                  <Text style={[styles.quarterAmountValue, styles.netAmount]}>
                    ${quarter.net.toFixed(2)}
                  </Text>
                </View>
              </View>

              <View style={styles.dueDateRow}>
                <Icon name="calendar-clock" size={14} color={colors.gray[400]} />
                <Text style={styles.dueDateText}>
                  Due: {quarter.dueDate}
                </Text>
              </View>

              {quarter.status !== 'filed' && (
                <Button
                  variant="primary"
                  onPress={() => fileGSTReturn(quarter)}
                  size="sm"
                  style={styles.fileButton}
                >
                  File Return
                </Button>
              )}
            </Card.Body>
          </Card>
        ))}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            variant="outline"
            onPress={generateReport}
            style={styles.actionButton}
          >
            Generate Report
          </Button>
          <Button
            variant="primary"
            onPress={() => fileGSTReturn(gstData.quarters[0])}
            style={styles.actionButton}
          >
            File Return
          </Button>
        </View>

        {/* Quebec-specific Notice */}
        {userProvince === 'QC' && (
          <Card style={styles.qcNoticeCard}>
            <Card.Body>
              <View style={styles.qcNoticeRow}>
                <Icon name="information" size={24} color={colors.info} />
                <View style={styles.qcNoticeContent}>
                  <Text style={styles.qcNoticeTitle}>
                    Revenu Québec Filing
                  </Text>
                  <Text style={styles.qcNoticeText}>
                    Quebec residents must file separate returns with Revenu Québec. 
                    Your QST number should start with "RQ" instead of "RT".
                  </Text>
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => Alert.alert('Revenu Québec', 'Visit revenuquebec.ca for more information')}
                    style={styles.qcNoticeButton}
                  >
                    Learn More
                  </Button>
                </View>
              </View>
            </Card.Body>
          </Card>
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
  scrollContent: {
    padding: spacing.lg,
  },
  provinceCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primary[50],
  },
  provinceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  provinceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  provinceTitle: {
    marginLeft: spacing.sm,
  },
  provinceLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  provinceName: {
    ...typography.body1,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  provinceDetails: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  detailValue: {
    ...typography.body2,
    color: colors.text.primary,
  },
  warningBox: {
    marginTop: spacing.sm,
    padding: spacing.xs,
    backgroundColor: colors.warning + '20',
    borderRadius: borderRadius.sm,
  },
  warningText: {
    ...typography.caption,
    color: colors.warning,
  },
  registrationCard: {
    marginBottom: spacing.lg,
  },
  registrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  registrationInfo: {
    flex: 1,
  },
  registrationLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  registrationNumber: {
    ...typography.h5,
    color: colors.primary[500],
  },
  registrationFormat: {
    ...typography.caption,
    color: colors.gray[400],
  },
  scheduleCard: {
    marginBottom: spacing.lg,
  },
  scheduleTitle: {
    ...typography.h6,
    marginBottom: spacing.md,
    color: colors.text.primary,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  scheduleLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  scheduleValue: {
    ...typography.body1,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  nextFilingDate: {
    color: colors.warning,
  },
  deadlineNote: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  filingNote: {
    ...typography.caption,
    color: colors.info,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  summaryCard: {
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    ...typography.h6,
    marginBottom: spacing.md,
    color: colors.text.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  summaryAmount: {
    ...typography.h4,
  },
  collectedAmount: {
    color: colors.success,
  },
  itcAmount: {
    color: colors.info,
  },
  netPayableAmount: {
    color: colors.warning,
  },
  taxExample: {
    backgroundColor: colors.gray[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  taxExampleTitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  taxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  taxTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  taxTotalLabel: {
    ...typography.body2,
    fontWeight: typography.weights.semibold,
  },
  taxTotalValue: {
    ...typography.body2,
    fontWeight: typography.weights.semibold,
  },
  sectionTitle: {
    ...typography.h6,
    marginBottom: spacing.md,
    color: colors.text.primary,
  },
  quarterCard: {
    marginBottom: spacing.md,
  },
  quarterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quarterPeriod: {
    ...typography.body1,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  quarterAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  quarterAmountLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  quarterAmountValue: {
    ...typography.body2,
    color: colors.text.primary,
  },
  netAmount: {
    color: colors.warning,
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dueDateText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  fileButton: {
    marginTop: spacing.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
  qcNoticeCard: {
    backgroundColor: colors.info + '10',
    marginTop: spacing.md,
  },
  qcNoticeRow: {
    flexDirection: 'row',
  },
  qcNoticeContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  qcNoticeTitle: {
    ...typography.body2,
    fontWeight: typography.weights.semibold,
    color: colors.info,
    marginBottom: spacing.xs,
  },
  qcNoticeText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  qcNoticeButton: {
    alignSelf: 'flex-start',
  },
});

export default GSTDashboardScreen;



