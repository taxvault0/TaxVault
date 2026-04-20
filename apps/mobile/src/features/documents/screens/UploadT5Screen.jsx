import React from 'react';
import { Alert } from 'react-native';
import UploadDocumentForm from '@/features/documents/components/UploadDocumentForm';

const UploadT5Screen = () => {
  const fields = [
    {
      key: 'institutionName',
      label: 'Institution / Payer Name',
      placeholder: 'Example: RBC Direct Investing',
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
      key: 'interestAmount',
      label: 'Interest / Investment Income',
      placeholder: 'Example: 845.32',
      keyboardType: 'decimal-pad',
      required: true,
    },
    {
      key: 'accountType',
      label: 'Account Type',
      placeholder: 'Example: Non-registered investment account',
      required: false,
    },
    {
      key: 'slipNumber',
      label: 'Slip Number',
      placeholder: 'Optional',
      required: false,
    },
    {
      key: 'notes',
      label: 'Notes',
      placeholder: 'Optional notes about this T5 slip',
      multiline: true,
      required: false,
    },
  ];

  const handleSubmit = async (form) => {
    Alert.alert(
      'T5 saved',
      `Your T5 from ${form.institutionName} for tax year ${form.taxYear} has been saved.`
    );
  };

  return (
    <UploadDocumentForm
      title="Upload T5"
      subtitle="Add investment income slips such as interest or dividend income."
      documentType="T5 Slip"
      helperText="Use this screen for T5 slips from banks, brokerages, or investment providers. This belongs in Documents because it is an official tax slip, not a receipt."
      fields={fields}
      onSubmit={handleSubmit}
    />
  );
};

export default UploadT5Screen;


