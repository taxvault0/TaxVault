import React from 'react';
import { View, Text } from 'react-native';
import Card from '@/components/ui/Card';

const Step3Tax = ({
  styles,
  formData,
  fieldErrors,
  renderStepHeader,
  renderTaxCard,
  renderPicker,
  profileOptions,
  employmentStatuses,
  spouseEmploymentStatuses,
  taxFilingStatuses,
  updateTaxProfile,
  updateSpouseTaxProfile,
  updateField,
  clearFieldError,
  syncFamilyAndFilingStatus,
  setFieldRef,
  setFormData,
}) => {
  const needsSpouse =
    formData.maritalStatus === 'Married' ||
    formData.maritalStatus === 'Common-Law';

  return (
    <Card style={styles.card}>
      {renderStepHeader('Tax Information', 'Choose the tax profile details that apply.')}

      <View style={styles.sectionBlock}>
        <Text style={styles.blockTitle}>Your Tax Profile</Text>

        <View style={styles.taxCardGrid}>
          {profileOptions.map((item) =>
            renderTaxCard(
              item,
              !!formData.taxProfile[item.key],
              () => updateTaxProfile(item.key),
              formData.taxProfile.unemployed && item.key !== 'unemployed'
            )
          )}
        </View>

        {!!fieldErrors.taxProfile && (
          <Text style={styles.errorText}>{fieldErrors.taxProfile}</Text>
        )}

        {renderPicker({
          label: 'Employment Status',
          value: formData.employmentStatus,
          onValueChange: (value) => {
            updateField('employmentStatus', value);

            if (value === 'Unemployed') {
              setFormData((prev) => ({
                ...prev,
                taxProfile: {
                  employment: false,
                  gigWork: false,
                  selfEmployment: false,
                  incorporatedBusiness: false,
                  unemployed: true,
                },
              }));
            } else if (formData.taxProfile.unemployed) {
              setFormData((prev) => ({
                ...prev,
                taxProfile: {
                  ...prev.taxProfile,
                  unemployed: false,
                },
              }));
            }
          },
          options: employmentStatuses,
          placeholder: 'Employment status',
          error: fieldErrors.employmentStatus,
          fieldKey: 'employmentStatus',
        })}

        {renderPicker({
          label: 'Tax Filing Status',
          value: formData.taxFilingStatus,
          onValueChange: (value) => {
            clearFieldError('taxFilingStatus');
            syncFamilyAndFilingStatus('taxFilingStatus', value);
          },
          options: taxFilingStatuses,
          placeholder: 'Tax filing status',
          error: fieldErrors.taxFilingStatus,
          fieldKey: 'taxFilingStatus',
        })}
      </View>

      {needsSpouse && (
        <View style={styles.sectionBlock} onLayout={setFieldRef('spouseTaxProfile')}>
          <Text style={styles.blockTitle}>Spouse Tax Profile</Text>

          <View style={styles.taxCardGrid}>
            {profileOptions.map((item) =>
              renderTaxCard(
                item,
                !!formData.spouseTaxProfile[item.key],
                () => updateSpouseTaxProfile(item.key),
                formData.spouseTaxProfile.unemployed && item.key !== 'unemployed'
              )
            )}
          </View>

          {!!fieldErrors.spouseTaxProfile && (
            <Text style={styles.errorText}>{fieldErrors.spouseTaxProfile}</Text>
          )}

          {renderPicker({
            label: 'Spouse Employment Status',
            value: formData.spouseEmploymentStatus,
            onValueChange: (value) => {
              updateField('spouseEmploymentStatus', value);

              if (value === 'Unemployed') {
                setFormData((prev) => ({
                  ...prev,
                  spouseTaxProfile: {
                    employment: false,
                    gigWork: false,
                    selfEmployment: false,
                    incorporatedBusiness: false,
                    unemployed: true,
                  },
                }));
              } else if (formData.spouseTaxProfile.unemployed) {
                setFormData((prev) => ({
                  ...prev,
                  spouseTaxProfile: {
                    ...prev.spouseTaxProfile,
                    unemployed: false,
                  },
                }));
              }
            },
            options: spouseEmploymentStatuses,
            placeholder: 'Spouse employment status',
            error: fieldErrors.spouseEmploymentStatus,
            fieldKey: 'spouseEmploymentStatus',
          })}
        </View>
      )}
    </Card>
  );
};

export default Step3Tax;