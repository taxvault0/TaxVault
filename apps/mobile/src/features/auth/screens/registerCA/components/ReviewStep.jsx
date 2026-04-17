import React from 'react';
import { View, Text, Switch } from 'react-native';
import styles from '../Form.styles';

const formatList = (value) => {
  if (!Array.isArray(value) || value.length === 0) return '-';
  return value.join(', ');
};

const formatBoolean = (value) => (value ? 'Yes' : 'No');

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
        <Switch value={!!form[field]} onValueChange={(value) => updateField(field, value)} />
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
        {renderSummaryRow(
          'Languages',
          formatList(form.languagesSpoken || form.languages)
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Firm Details</Text>
        {renderSummaryRow('Address', form.firmAddress)}
        {renderSummaryRow('City', form.city || form.firmCity)}
        {renderSummaryRow('Province', form.province || form.firmProvince)}
        {renderSummaryRow('Postal Code', form.firmPostalCode)}
        {renderSummaryRow('Country', form.country || form.firmCountry)}
        {renderSummaryRow('Firm Phone', form.firmPhone)}
        {renderSummaryRow('Firm Email', form.firmEmail)}
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
        {renderSummaryRow('Expiry Date', form.expiryDate)}
        {renderSummaryRow(
          'CPA Member in Good Standing',
          formatBoolean(form.cpaMemberInGoodStanding)
        )}
        {renderSummaryRow(
          'Peer Review Completed',
          formatBoolean(form.peerReviewCompleted)
        )}
        {renderSummaryRow('Peer Review Date', form.peerReviewDate)}
        {renderSummaryRow('Peer Review Outcome', form.peerReviewOutcome)}
        {renderSummaryRow(
          'Disciplinary History',
          formatBoolean(form.disciplinaryHistory)
        )}
        {renderSummaryRow('Disciplinary Details', form.disciplinaryDetails)}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Practice & Specialties</Text>
        {renderSummaryRow('Practice Type', form.practiceType)}
        {renderSummaryRow(
          'Accepting New Clients',
          formatBoolean(form.acceptingNewClients ?? form.acceptNewClients)
        )}
        {renderSummaryRow(
          'Primary Client Types',
          formatList(form.clientTypes || form.primaryClientTypes)
        )}
        {renderSummaryRow(
          'Services Offered',
          formatList(form.servicesOffered)
        )}
        {renderSummaryRow('Average Clients Per Year', form.averageClientsPerYear)}
        {renderSummaryRow('Minimum Fee', form.minimumFee)}
        {renderSummaryRow('Maximum Fee', form.maximumFee)}
        {renderSummaryRow('Service Radius', form.serviceRadius)}
        {renderSummaryRow(
          'Tax Specialties',
          formatList(form.taxSpecialties || form.taxServices)
        )}
        {renderSummaryRow(
          'Provincial Specialties',
          formatList(form.provincialSpecialties)
        )}
        {renderSummaryRow(
          'Accounting Software',
          formatList(form.accountingSoftware || form.softwareSkills)
        )}
        {renderSummaryRow('Tax Software', formatList(form.taxSoftware))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Verification</Text>
        {renderSummaryRow(
          'CA Certificate',
          form.caCertificate?.name || '-'
        )}
        {renderSummaryRow(
          'Professional Headshot',
          form.professionalHeadshot?.name || '-'
        )}
        {renderSummaryRow(
          'Firm Logo',
          form.firmLogo?.name || '-'
        )}
        {renderSummaryRow(
          'Professional References',
          Array.isArray(form.professionalReferences)
            ? form.professionalReferences.join(', ')
            : '-'
        )}
        {renderSummaryRow(
          'Authorize Verification',
          formatBoolean(form.authorizeVerification)
        )}
        {renderSummaryRow(
          'Background Check Consent',
          formatBoolean(form.backgroundCheckConsent)
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Agreements</Text>

        {renderSwitchRow('Agree to Terms and Conditions', 'agreedTerms')}
        {renderSwitchRow('Agree to Privacy Policy', 'agreedPrivacy')}
        {renderSwitchRow('Agree to Professional Terms', 'agreedProfessionalTerms')}
        {renderSwitchRow('Confirm Information Is Accurate', 'confirmAccuracy')}
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