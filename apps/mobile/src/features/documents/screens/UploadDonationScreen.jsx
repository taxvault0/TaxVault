import React from 'react';
import { Alert } from 'react-native';
import UploadDocumentForm from '@/features/documents/components/UploadDocumentForm';

const UploadDonationScreen = () => {
  const fields = [
    {
      key: 'charityName',
      label: 'Registered Charity Name',
      placeholder: 'Example: Canadian Red Cross',
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
      key: 'donationAmount',
      label: 'Donation Amount',
      placeholder: 'Example: 250.00',
      keyboardType: 'decimal-pad',
      required: true,
    },
    {
      key: 'receiptNumber',
      label: 'Official Receipt Number',
      placeholder: 'Optional',
      required: false,
    },
    {
      key: 'donationDate',
      label: 'Donation Date',
      placeholder: 'YYYY-MM-DD',
      required: false,
    },
    {
      key: 'notes',
      label: 'Notes',
      placeholder: 'Optional notes about this donation receipt',
      multiline: true,
      required: false,
    },
  ];

  const handleSubmit = async (form) => {
    Alert.alert(
      'Donation receipt saved',
      `Your donation receipt from ${form.charityName} for tax year ${form.taxYear} has been saved.`
    );
  };

  return (
    <UploadDocumentForm
      title="Upload Donation Receipt"
      subtitle="Add charitable donation receipts for tax credit tracking."
      documentType="Donation Receipt"
      helperText="Use this screen for official charitable donation receipts. These belong in Documents because they support tax credit claims."
      fields={fields}
      onSubmit={handleSubmit}
    />
  );
};

export default UploadDonationScreen;


