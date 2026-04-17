import React from 'react';
import { Alert } from 'react-native';
import UploadDocumentForm from '@/features/documents/components/UploadDocumentForm';

const UploadRRSPReceiptScreen = () => {
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
      placeholder: 'Example: 6000.00',
      keyboardType: 'decimal-pad',
      required: true,
    },
    {
      key: 'contributionPeriod',
      label: 'Contribution Period',
      placeholder: 'Example: Mar-Dec or First 60 Days',
      required: false,
    },
    {
      key: 'receiptNumber',
      label: 'Receipt Number',
      placeholder: 'Optional',
      required: false,
    },
    {
      key: 'notes',
      label: 'Notes',
      placeholder: 'Optional notes about this RRSP receipt',
      multiline: true,
      required: false,
    },
  ];

  const handleSubmit = async (form) => {
    Alert.alert(
      'RRSP receipt saved',
      `Your RRSP receipt from ${form.institutionName} for tax year ${form.taxYear} has been saved.`
    );
  };

  return (
    <UploadDocumentForm
      title="Upload RRSP Receipt"
      subtitle="Add RRSP contribution receipts for deduction tracking."
      documentType="RRSP Receipt"
      helperText="Use this screen for RRSP contribution receipts. These documents support deduction claims and should stay in Documents, not in Receipts."
      fields={fields}
      onSubmit={handleSubmit}
    />
  );
};

export default UploadRRSPReceiptScreen;


