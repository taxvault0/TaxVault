import React from 'react';
import { Alert } from 'react-native';
import UploadDocumentForm from '@/features/documents/components/UploadDocumentForm';

const UploadFHSAScreen = () => {
  const fields = [
    {
      key: 'institutionName',
      label: 'Financial Institution',
      placeholder: 'Example: RBC, TD, Wealthsimple',
      required: true,
    },
    {
      key: 'taxYear',
      label: 'Tax Year',
      placeholder: 'Example: 2025',
      keyboardType: 'number-pad',
      required: true,
    },
    {
      key: 'contributionAmount',
      label: 'Contribution Amount',
      placeholder: 'Example: 8000.00',
      keyboardType: 'decimal-pad',
      required: true,
    },
    {
      key: 'contributionPeriod',
      label: 'Contribution Period',
      placeholder: 'Example: Jan-Dec 2025',
      required: false,
    },
    {
      key: 'accountNumber',
      label: 'Account Number / Reference',
      placeholder: 'Optional',
      required: false,
    },
    {
      key: 'notes',
      label: 'Notes',
      placeholder: 'Optional notes about this FHSA document',
      multiline: true,
      required: false,
    },
  ];

  const handleSubmit = async (form) => {
    Alert.alert(
      'FHSA document saved',
      `Your FHSA document from ${form.institutionName} for tax year ${form.taxYear} has been saved.`
    );
  };

  return (
    <UploadDocumentForm
      title="Upload FHSA Document"
      subtitle="Add FHSA contribution records for tax deduction tracking."
      documentType="FHSA Document"
      helperText="Use this screen for FHSA contribution statements or receipts. These belong in Documents because they support official tax filing and deduction tracking."
      fields={fields}
      onSubmit={handleSubmit}
    />
  );
};

export default UploadFHSAScreen;


