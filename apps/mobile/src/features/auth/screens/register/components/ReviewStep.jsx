import React from 'react';
import { View, Text, Switch } from 'react-native';
import Card from '@/components/ui/Card';

const Row = ({ label, value, styles }) => (
  <View style={styles.reviewRow}>
    <Text style={styles.reviewLabel}>{label}</Text>
    <Text style={styles.reviewValue}>{value || '—'}</Text>
  </View>
);

const formatProfileLabels = (profile) => {
  const labelMap = {
    employment: 'Employment',
    gigWork: 'Gig Work',
    selfEmployment: 'Self-Employment',
    incorporatedBusiness: 'Business Owner',
    unemployed: 'Unemployed',
  };

  return Object.entries(profile || {})
    .filter(([, value]) => !!value)
    .map(([key]) => labelMap[key] || key)
    .join(', ');
};

const Step8Review = ({
  styles,
  formData,
  updateField,
  renderStepHeader,
  fieldErrors,
  setFieldRef,
}) => {
  const needsSpouse =
    formData.maritalStatus === 'Married' ||
    formData.maritalStatus === 'Common-Law';

  const selectedProfiles = formatProfileLabels(formData.taxProfile);
  const selectedSpouseProfiles = formatProfileLabels(formData.spouseTaxProfile);

  const selectedReceiptCategories =
    formData.documentPreferences.selectedReceiptCategories
      .join(', ');

  const spouseIncomeSummary = [
    formData.spouseTaxProfile.employment && formData.spouseEmployerName
      ? `Employment: ${formData.spouseEmployerName}`
      : null,
    formData.spouseTaxProfile.gigWork && formData.spousePlatforms?.length
      ? `Gig: ${formData.spousePlatforms.join(', ')}`
      : null,
    formData.spouseTaxProfile.selfEmployment && formData.spouseContractType
      ? `Self-Employment: ${formData.spouseContractType}`
      : null,
    formData.spouseTaxProfile.incorporatedBusiness && formData.spouseBusinessName
      ? `Business: ${formData.spouseBusinessName}`
      : null,
  ]
    .filter(Boolean)
    .join(' | ');

  const userIncomeSummary = [
    formData.taxProfile.employment && formData.employerName
      ? `Employment: ${formData.employerName}`
      : null,
    formData.taxProfile.gigWork && formData.platforms?.length
      ? `Gig: ${formData.platforms.join(', ')}`
      : null,
    formData.taxProfile.selfEmployment && formData.contractType
      ? `Self-Employment: ${formData.contractType}`
      : null,
    formData.taxProfile.incorporatedBusiness && formData.businessName
      ? `Business: ${formData.businessName}`
      : null,
  ]
    .filter(Boolean)
    .join(' | ');

  const carSummary = formData.vehicleInfo.hasVehiclePurchase
    ? [
        formData.vehicleInfo.ownerPerson && `Owner: ${formData.vehicleInfo.ownerPerson}`,
        formData.vehicleInfo.ownershipType &&
          `Ownership: ${formData.vehicleInfo.ownershipType}`,
        formData.vehicleInfo.mainUse && `Use: ${formData.vehicleInfo.mainUse}`,
        formData.vehicleInfo.purchaseDate &&
          `Purchase Date: ${formData.vehicleInfo.purchaseDate}`,
        formData.vehicleInfo.purchasePrice &&
          `Price: ${formData.vehicleInfo.purchasePrice}`,
      ]
        .filter(Boolean)
        .join(' | ')
    : 'No car purchase added';

  return (
    <Card style={styles.card}>
      {renderStepHeader(
        'Review & Confirm',
        'Double-check your details before creating your account.'
      )}

      <View style={styles.sectionBlock}>
        <Text style={styles.blockTitle}>Account</Text>
        <Row label="First Name" value={formData.firstName} styles={styles} />
        <Row label="Last Name" value={formData.lastName} styles={styles} />
        <Row label="Email" value={formData.email} styles={styles} />
        <Row label="Phone" value={formData.phone} styles={styles} />
      </View>

      <View style={styles.sectionBlock}>
        <Text style={styles.blockTitle}>Personal</Text>
        <Row label="Date of Birth" value={formData.dateOfBirth} styles={styles} />
        <Row label="SIN" value={formData.sin} styles={styles} />
        <Row label="Family Status" value={formData.maritalStatus} styles={styles} />
        <Row label="Dependents" value={formData.numberOfDependents} styles={styles} />
        <Row label="Address" value={formData.address} styles={styles} />
        <Row label="City" value={formData.city} styles={styles} />
        <Row label="Province" value={formData.province} styles={styles} />
        <Row label="Postal Code" value={formData.postalCode} styles={styles} />
      </View>

      {needsSpouse && (
        <View style={styles.sectionBlock}>
          <Text style={styles.blockTitle}>Spouse</Text>
          <Row label="Spouse Name" value={formData.spouseName} styles={styles} />
          <Row label="Spouse DOB" value={formData.spouseDob} styles={styles} />
          <Row label="Spouse SIN" value={formData.spouseSin} styles={styles} />
          <Row label="Spouse Phone" value={formData.spousePhone} styles={styles} />
        </View>
      )}

      <View style={styles.sectionBlock}>
        <Text style={styles.blockTitle}>Tax</Text>
        <Row label="Employment Status" value={formData.employmentStatus} styles={styles} />
        <Row label="Tax Filing Status" value={formData.taxFilingStatus} styles={styles} />
        <Row label="Your Tax Profile" value={selectedProfiles} styles={styles} />
      </View>

      {needsSpouse && (
        <View style={styles.sectionBlock}>
          <Text style={styles.blockTitle}>Spouse Tax</Text>
          <Row
            label="Spouse Employment Status"
            value={formData.spouseEmploymentStatus}
            styles={styles}
          />
          <Row
            label="Spouse Tax Profile"
            value={selectedSpouseProfiles}
            styles={styles}
          />
        </View>
      )}

      <View style={styles.sectionBlock}>
        <Text style={styles.blockTitle}>Income</Text>
        <Row label="Your Income Summary" value={userIncomeSummary} styles={styles} />
        <Row
          label="Investments"
          value={formData.hasInvestments ? 'Yes' : 'No'}
          styles={styles}
        />
        <Row
          label="Rental Income"
          value={formData.hasRentalIncome ? 'Yes' : 'No'}
          styles={styles}
        />
        <Row
          label="Foreign Income"
          value={formData.hasForeignIncome ? 'Yes' : 'No'}
          styles={styles}
        />
        <Row
          label="Crypto"
          value={formData.hasCrypto ? 'Yes' : 'No'}
          styles={styles}
        />
      </View>

      {needsSpouse && (
        <View style={styles.sectionBlock}>
          <Text style={styles.blockTitle}>Spouse Income</Text>
          <Row
            label="Spouse Income Summary"
            value={spouseIncomeSummary}
            styles={styles}
          />
        </View>
      )}

      <View style={styles.sectionBlock}>
        <Text style={styles.blockTitle}>Deductions & Credits</Text>
        <Row
          label="RRSP"
          value={formData.hasRRSP ? 'Yes' : 'No'}
          styles={styles}
        />
        <Row
          label="FHSA"
          value={formData.hasFHSA ? 'Yes' : 'No'}
          styles={styles}
        />
        <Row
          label="TFSA"
          value={formData.hasTFSA ? 'Yes' : 'No'}
          styles={styles}
        />
        <Row
          label="Tuition"
          value={formData.hasTuition ? 'Yes' : 'No'}
          styles={styles}
        />
        <Row
          label="Medical Expenses"
          value={formData.hasMedicalExpenses ? 'Yes' : 'No'}
          styles={styles}
        />
        <Row
          label="Charitable Donations"
          value={formData.hasCharitableDonations ? 'Yes' : 'No'}
          styles={styles}
        />
        <Row
          label="Child Care Expenses"
          value={formData.hasChildCareExpenses ? 'Yes' : 'No'}
          styles={styles}
        />
        <Row
          label="Moving Expenses"
          value={formData.hasMovingExpenses ? 'Yes' : 'No'}
          styles={styles}
        />
        <Row
          label="Union / Professional Dues"
          value={formData.hasUnionDues ? 'Yes' : 'No'}
          styles={styles}
        />
        <Row
          label="Tool Expenses"
          value={formData.hasToolExpenses ? 'Yes' : 'No'}
          styles={styles}
        />
        <Row
          label="Home Office"
          value={formData.hasHomeOffice ? 'Yes' : 'No'}
          styles={styles}
        />
        <Row
          label="Vehicle Expenses"
          value={formData.hasVehicleExpenses ? 'Yes' : 'No'}
          styles={styles}
        />
        <Row
          label="Receipt Categories"
          value={selectedReceiptCategories}
          styles={styles}
        />
        <Row label="Car" value={carSummary} styles={styles} />
        <Row
          label="Vehicle Bill of Sale"
          value={formData.vehicleInfo.billOfSale?.name}
          styles={styles}
        />
      </View>

      <View style={styles.sectionBlock} onLayout={setFieldRef?.('agreeToTerms')}>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>I agree to the Terms</Text>
          <Switch
            value={formData.agreeToTerms}
            onValueChange={(value) => updateField('agreeToTerms', value)}
          />
        </View>
        {!!fieldErrors?.agreeToTerms && (
          <Text style={styles.errorText}>{fieldErrors.agreeToTerms}</Text>
        )}

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>I agree to the Privacy Policy</Text>
          <Switch
            value={formData.agreeToPrivacy}
            onValueChange={(value) => updateField('agreeToPrivacy', value)}
          />
        </View>
        {!!fieldErrors?.agreeToPrivacy && (
          <Text style={styles.errorText}>{fieldErrors.agreeToPrivacy}</Text>
        )}

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>I confirm the information is accurate</Text>
          <Switch
            value={formData.confirmAccuracy}
            onValueChange={(value) => updateField('confirmAccuracy', value)}
          />
        </View>
        {!!fieldErrors?.confirmAccuracy && (
          <Text style={styles.errorText}>{fieldErrors.confirmAccuracy}</Text>
        )}
      </View>
    </Card>
  );
};

export default Step8Review;