import React from 'react';
import { View, Text, Switch } from 'react-native';
import styles from '../Form.styles';

const formatList = (value) => {
  if (!Array.isArray(value) || value.length === 0) return '-';
  return value.join(', ');
};

const formatBoolean = (value) => (value ? 'Yes' : 'No');

const formatOutcomeLabel = (value) => {
  if (!value) return '-';
  return String(value)
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const ReviewStep = ({ form, errors, updateField, fullName }) => {
  const renderSummaryRow = (label, value) => (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value || '-'}</Text>
    </View>
  );

  const renderSwitchRow = (label, field) => (
    <View style={styles.field}>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>{label}</Text>
        <Switch
          value={!!form[field]}
          onValueChange={(value) => updateField(field, value)}
        />
      </View>
      {!!errors[field] && <Text style={styles.error}>{errors[field]}</Text>}
    </View>
  );

  return (
    <View>
      <Text style={styles.title}>Review & Submit</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Information</Text>
        {renderSummaryRow('Name', fullName)}
        {renderSummaryRow('Email', form.email)}
        {renderSummaryRow('Primary Phone', form.primaryPhone || form.phone)}
        {renderSummaryRow('Alternate Phone', form.alternatePhone)}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Professional Information</Text>
        {renderSummaryRow('Designation', form.caDesignation)}
        {renderSummaryRow('CA Number', form.caNumber)}
        {renderSummaryRow('Province of Registration', form.provinceOfRegistration)}
        {renderSummaryRow('Year Admitted', form.yearAdmitted)}
        {renderSummaryRow('Years of Experience', form.yearsOfExperience)}
        {renderSummaryRow('Firm Name', form.firmName)}
        {renderSummaryRow('Firm Website', form.firmWebsite)}
        {renderSummaryRow('Areas of Expertise', formatList(form.areasOfExpertise))}
        {renderSummaryRow('Languages', formatList(form.languages))}
        {renderSummaryRow(
          'Professional Designations',
          formatList(form.professionalDesignations)
        )}
        {renderSummaryRow('Other Language', form.otherLanguage)}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Firm Details</Text>
        {renderSummaryRow('Address', form.firmAddress)}
        {renderSummaryRow('City', form.city)}
        {renderSummaryRow('Province', form.province)}
        {renderSummaryRow('Postal Code', form.firmPostalCode)}
        {renderSummaryRow('Country', form.firmCountry || 'Canada')}
        {renderSummaryRow('Firm Phone', form.firmPhone)}
        {renderSummaryRow('Firm Email', form.firmEmail)}
        {renderSummaryRow('Firm Size', form.firmSize)}
        {renderSummaryRow('Number of Partners', form.numberOfPartners)}
        {renderSummaryRow('Number of Staff', form.numberOfStaff)}
        {renderSummaryRow('Year Established', form.yearEstablished)}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Credentials</Text>
        {renderSummaryRow(
          'Professional Liability Insurance',
          formatBoolean(form.professionalLiabilityInsurance)
        )}
        {renderSummaryRow('Insurance Provider', form.insuranceProvider)}
        {renderSummaryRow('Policy Number', form.policyNumber)}
        {renderSummaryRow('Coverage Amount', form.coverageAmount)}
        {renderSummaryRow('Policy Expiry Date', form.policyExpiryDate)}
        {renderSummaryRow(
          'Insurance Document',
          form.insuranceDocument?.name || '-'
        )}
        {renderSummaryRow(
          'CPA Member in Good Standing',
          formatBoolean(form.cpaMemberInGoodStanding)
        )}
        {renderSummaryRow(
          'License Verification Number',
          form.licenseVerification
        )}
        {renderSummaryRow(
          'Peer Review Completed',
          formatBoolean(form.peerReviewCompleted)
        )}
        {renderSummaryRow('Peer Review Date', form.peerReviewDate)}
        {renderSummaryRow(
          'Peer Review Outcome',
          formatOutcomeLabel(form.peerReviewOutcome)
        )}
        {renderSummaryRow(
          'Peer Review Report',
          form.peerReviewReport?.name || '-'
        )}
        {renderSummaryRow(
          'Disciplinary History',
          formatBoolean(form.disciplinaryHistory)
        )}
        {renderSummaryRow('Disciplinary Details', form.disciplinaryDetails)}
        {renderSummaryRow(
          'Background Check Consent',
          formatBoolean(form.backgroundCheckConsent)
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Practice Information</Text>
        {renderSummaryRow('Practice Type', form.practiceType)}
        {renderSummaryRow(
          'Services Offered',
          formatList(form.taxServicesOffered)
        )}
        {renderSummaryRow(
          'Primary Client Types',
          formatList(form.clientTypesServed)
        )}
        {renderSummaryRow(
          'Industries Served',
          formatList(form.industriesServed)
        )}
        {renderSummaryRow('Service Areas', formatList(form.serviceAreas))}
        {renderSummaryRow(
          'Average Clients Per Year',
          form.averageClientsPerYear
        )}
        {renderSummaryRow('Service Radius (km)', form.serviceRadius)}
        {renderSummaryRow('Minimum Fee', form.minimumFee)}
        {renderSummaryRow('Maximum Fee', form.maximumFee)}
        {renderSummaryRow(
          'Accepting New Clients',
          formatBoolean(form.acceptingNewClients)
        )}
        {renderSummaryRow(
          'Offers Virtual Services',
          formatBoolean(form.offersVirtualServices)
        )}
        {renderSummaryRow(
          'Offers In-Person Services',
          formatBoolean(form.offersInPersonServices)
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Specialties & Technology</Text>
        {renderSummaryRow('Tax Specialties', formatList(form.taxSpecialties))}
        {renderSummaryRow(
          'Provincial Specialties',
          formatList(form.provincialSpecialties)
        )}
        {renderSummaryRow(
          'International & Advanced Specialties',
          formatList(form.internationalSpecialties)
        )}
        {renderSummaryRow(
          'Accounting Software',
          formatList(form.accountingSoftware)
        )}
        {renderSummaryRow('Tax Software', formatList(form.taxSoftware))}
        {renderSummaryRow(
          'Practice Management Software',
          form.practiceManagementSoftware
        )}
        {renderSummaryRow(
          'Offers Client Portal Access',
          formatBoolean(form.offersPortalAccess)
        )}
        {renderSummaryRow(
          'Accepts Digital Documents / E-Signatures',
          formatBoolean(form.acceptsDigitalDocuments)
        )}
        {renderSummaryRow(
          'Uses End-to-End Encryption',
          formatBoolean(form.usesEncryption)
        )}
        {renderSummaryRow(
          'Uses Two-Factor Authentication',
          formatBoolean(form.twoFactorAuth)
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Verification</Text>
        {renderSummaryRow(
          'CA Certificate',
          form.caCertificateFile?.name || '-'
        )}
        {renderSummaryRow(
          'Professional Headshot',
          form.professionalHeadshotFile?.name || '-'
        )}
        {renderSummaryRow(
          'Firm Logo',
          form.firmLogoFile?.name || '-'
        )}
        {renderSummaryRow('Reference Name', form.referenceName)}
        {renderSummaryRow('Reference Email', form.referenceEmail)}
        {renderSummaryRow(
          'Authorize Verification',
          formatBoolean(form.authorizeCredentialCheck)
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Agreements</Text>

        {renderSwitchRow(
          'Agree to Terms and Conditions',
          'agreedTermsAndConditions'
        )}
        {renderSwitchRow(
          'Agree to Privacy Policy',
          'agreedPrivacyPolicy'
        )}
        {renderSwitchRow(
          'Agree to Professional Terms',
          'agreedProfessionalTerms'
        )}
        {renderSwitchRow(
          'Confirm Information Is Accurate',
          'confirmAccuracy'
        )}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Final Review</Text>
        <Text style={styles.infoText}>
          After submission, your application will be reviewed before approval.
        </Text>
      </View>
    </View>
  );
};

export default ReviewStep;