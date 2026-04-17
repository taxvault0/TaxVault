import React from 'react';
import { Alert } from 'react-native';
import UploadDocumentForm from '@/features/documents/components/UploadDocumentForm';

const UploadT4AScreen = () => {
  const fields = [
    {
      key: 'payerName',
      label: 'Payer Name',
      placeholder: 'Example: Uber Canada Inc.',
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
      key: 'incomeAmount',
      label: 'Income Amount',
      placeholder: 'Example: 12540.75',
      keyboardType: 'decimal-pad',
      required: true,
    },
    {
      key: 'referenceNumber',
      label: 'Reference Number',
      placeholder: 'Optional',
      required: false,
    },
    {
      key: 'notes',
      label: 'Notes',
      placeholder: 'Optional notes about this T4A slip',
      multiline: true,
      required: false,
    },
  ];

  const handleSubmit = async (form) => {
    Alert.alert(
      'T4A saved',
      `Your T4A from ${form.payerName} for tax year ${form.taxYear} has been saved.`
    );
  };

  return (
    <UploadDocumentForm
      title="Upload T4A"
      subtitle="Add self-employed, contract, freelance, or gig worker income."
      documentType="T4A Slip"
      helperText="Use this page for T4A slips. Related receipts and mileage should be added in the Receipts and Mileage modules, not inside document uploads."
      fields={fields}
      onSubmit={handleSubmit}
    />
  );
};

export default UploadT4AScreen;


