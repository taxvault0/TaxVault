import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import Card from '@/components/ui/Card';

const Step4Income = ({
  styles,
  formData,
  updateField,
  renderInput,
  renderPicker,
  renderStepHeader,
  hasEmployment,
  hasGigWork,
  hasSelfEmployment,
  hasBusiness,
  platforms,
  businessTypes,
  toggleArrayItem,
  fieldErrors,
  clearFieldError,
  setFieldRef,
}) => {
  const needsSpouse =
    formData.maritalStatus === 'Married' ||
    formData.maritalStatus === 'Common-Law';

  return (
    <Card style={styles.card}>
      {renderStepHeader(
        'Income Information',
        'Add the details that match your income sources.'
      )}

      {/* ================= USER ================= */}

      {hasEmployment && (
        <View style={styles.sectionBlock}>
          <Text style={styles.blockTitle}>Employment Income</Text>

          {renderInput({
            label: 'Employer Name',
            value: formData.employerName,
            onChangeText: (text) => updateField('employerName', text),
            placeholder: 'ABC Company',
            error: fieldErrors.employerName,
            fieldKey: 'employerName',
          })}

          {renderInput({
            label: 'Employer Business Number',
            value: formData.employerBusinessNumber,
            onChangeText: (text) => updateField('employerBusinessNumber', text),
            placeholder: 'Business number',
          })}

          {renderInput({
            label: 'Employee ID',
            value: formData.employeeId,
            onChangeText: (text) => updateField('employeeId', text),
            placeholder: 'Employee ID',
          })}
        </View>
      )}

      {hasGigWork && (
        <View style={styles.sectionBlock}>
          <Text style={styles.blockTitle}>Gig Work</Text>

          <Text style={styles.label}>Platforms you work with</Text>
          <View style={styles.chipWrap}>
            {platforms.map((platform) => (
              <TouchableOpacity
                key={platform}
                style={[
                  styles.choiceChip,
                  formData.platforms.includes(platform) && styles.choiceChipActive,
                ]}
                onPress={() => toggleArrayItem('platforms', platform)}
              >
                <Text
                  style={[
                    styles.choiceChipText,
                    formData.platforms.includes(platform) &&
                      styles.choiceChipTextActive,
                  ]}
                >
                  {platform}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {renderInput({
            label: 'Average Weekly KM',
            value: formData.averageWeeklyKm,
            onChangeText: (text) => updateField('averageWeeklyKm', text),
            placeholder: '250',
            keyboardType: 'numeric',
            error: fieldErrors.averageWeeklyKm,
            fieldKey: 'averageWeeklyKm',
          })}
        </View>
      )}

      {hasSelfEmployment && (
        <View style={styles.sectionBlock}>
          <Text style={styles.blockTitle}>Self-Employment</Text>

          {renderInput({
            label: 'Contract Type / Service',
            value: formData.contractType,
            onChangeText: (text) => updateField('contractType', text),
            placeholder: 'Consulting, design, etc.',
            error: fieldErrors.contractType,
            fieldKey: 'contractType',
          })}

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Quarterly Filing</Text>
            <Switch
              value={formData.quarterlyFiling}
              onValueChange={(value) => updateField('quarterlyFiling', value)}
            />
          </View>
        </View>
      )}

      {hasBusiness && (
        <View style={styles.sectionBlock}>
          <Text style={styles.blockTitle}>Business</Text>

          {renderInput({
            label: 'Business Name',
            value: formData.businessName,
            onChangeText: (text) => updateField('businessName', text),
            error: fieldErrors.businessName,
            fieldKey: 'businessName',
          })}

          {renderPicker({
            label: 'Business Type',
            value: formData.businessType,
            onValueChange: (value) => updateField('businessType', value),
            options: businessTypes,
            error: fieldErrors.businessType,
            fieldKey: 'businessType',
          })}
        </View>
      )}

      {/* ================= SPOUSE ================= */}

      {needsSpouse && (
        <View style={styles.sectionBlock}>
          <Text style={styles.blockTitle}>Spouse Income</Text>

          {/* Employment */}
          {formData.spouseTaxProfile.employment && (
            <>
              {renderInput({
                label: 'Spouse Employer Name',
                value: formData.spouseEmployerName,
                onChangeText: (text) =>
                  updateField('spouseEmployerName', text),
                placeholder: 'Company',
              })}
            </>
          )}

          {/* Gig */}
          {formData.spouseTaxProfile.gigWork && (
            <>
              <Text style={styles.label}>Spouse Platforms</Text>
              <View style={styles.chipWrap}>
                {platforms.map((platform) => (
                  <TouchableOpacity
                    key={platform}
                    style={[
                      styles.choiceChip,
                      formData.spousePlatforms.includes(platform) &&
                        styles.choiceChipActive,
                    ]}
                    onPress={() => toggleArrayItem('spousePlatforms', platform)}
                  >
                    <Text
                      style={[
                        styles.choiceChipText,
                        formData.spousePlatforms.includes(platform) &&
                          styles.choiceChipTextActive,
                      ]}
                    >
                      {platform}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {renderInput({
                label: 'Spouse Weekly KM',
                value: formData.spouseAverageWeeklyKm,
                onChangeText: (text) =>
                  updateField('spouseAverageWeeklyKm', text),
                placeholder: '200',
                keyboardType: 'numeric',
              })}
            </>
          )}

          {/* Self-employed */}
          {formData.spouseTaxProfile.selfEmployment && (
            <>
              {renderInput({
                label: 'Spouse Contract Type',
                value: formData.spouseContractType,
                onChangeText: (text) =>
                  updateField('spouseContractType', text),
                placeholder: 'Service type',
              })}

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Spouse Quarterly Filing</Text>
                <Switch
                  value={formData.spouseQuarterlyFiling}
                  onValueChange={(value) =>
                    updateField('spouseQuarterlyFiling', value)
                  }
                />
              </View>
            </>
          )}

          {/* Business */}
          {formData.spouseTaxProfile.incorporatedBusiness && (
            <>
              {renderInput({
                label: 'Spouse Business Name',
                value: formData.spouseBusinessName,
                onChangeText: (text) =>
                  updateField('spouseBusinessName', text),
              })}

              {renderPicker({
                label: 'Spouse Business Type',
                value: formData.spouseBusinessType,
                onValueChange: (value) =>
                  updateField('spouseBusinessType', value),
                options: businessTypes,
              })}
            </>
          )}
        </View>
      )}

      {/* ================= OTHER ================= */}

      <View style={styles.sectionBlock}>
        <Text style={styles.blockTitle}>Other Income</Text>

        {[
          ['hasInvestments', 'Investments'],
          ['hasRentalIncome', 'Rental Income'],
          ['hasForeignIncome', 'Foreign Income'],
          ['hasCrypto', 'Crypto'],
        ].map(([key, label]) => (
          <View key={key} style={styles.switchRow}>
            <Text style={styles.switchLabel}>{label}</Text>
            <Switch
              value={!!formData[key]}
              onValueChange={(value) => updateField(key, value)}
            />
          </View>
        ))}
      </View>
    </Card>
  );
};

export default Step4Income;