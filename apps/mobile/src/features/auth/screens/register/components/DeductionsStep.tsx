import React from 'react';
import { View, Text, TouchableOpacity, Switch, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Card from '@/components/ui/Card';

const Step6Deductions = ({
  styles,
  formData,
  updateField,
  updateVehicleField,
  clearVehicleFields,
  toggleReceiptCategory,
  receiptOptions,
  renderStepHeader,
  renderPicker,
  renderDateField,
  renderInput,
  fieldErrors,
  clearFieldError,
  setFieldRef,
  vehicleOwnerOptions,
  vehicleUseOptions,
  vehicleOwnershipOptions,
  showVehiclePurchaseDatePicker,
  setShowVehiclePurchaseDatePicker,
  formatDate,
  handleVehicleUpload,
}) => {
  return (
    <Card style={styles.card}>
      {renderStepHeader(
        'Deductions & Credits',
        'Select the deductions that may apply to you and add any car purchase details.'
      )}

      <View style={styles.sectionBlock}>
        <Text style={styles.blockTitle}>Car</Text>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>I bought a vehicle this year for work use</Text>
          <Switch
            value={!!formData.vehicleInfo.hasVehiclePurchase}
            onValueChange={(value) => {
              if (!value) {
                clearFieldError('vehicleOwnerPerson');
                clearFieldError('vehicleOwnershipType');
                clearFieldError('vehicleMainUse');
                clearFieldError('vehiclePurchaseDate');
                clearFieldError('vehiclePurchasePrice');
                clearFieldError('vehicleGstHstPaid');
                clearVehicleFields();
              } else {
                updateVehicleField('hasVehiclePurchase', true);
              }
            }}
          />
        </View>

        {formData.vehicleInfo.hasVehiclePurchase && (
          <>
            {renderPicker({
              label: 'Who bought the vehicle?',
              value: formData.vehicleInfo.ownerPerson,
              onValueChange: (value) => {
                updateVehicleField('ownerPerson', value);
                updateVehicleField('mainUse', '');
              },
              options: vehicleOwnerOptions,
              placeholder: 'Select owner',
              error: fieldErrors.vehicleOwnerPerson,
              fieldKey: 'vehicleOwnerPerson',
            })}

            {renderPicker({
              label: 'Ownership Type',
              value: formData.vehicleInfo.ownershipType,
              onValueChange: (value) => updateVehicleField('ownershipType', value),
              options: vehicleOwnershipOptions,
              placeholder: 'Select ownership type',
              error: fieldErrors.vehicleOwnershipType,
              fieldKey: 'vehicleOwnershipType',
            })}

            {renderPicker({
              label: 'Main Use',
              value: formData.vehicleInfo.mainUse,
              onValueChange: (value) => updateVehicleField('mainUse', value),
              options: vehicleUseOptions,
              placeholder: 'Select main use',
              error: fieldErrors.vehicleMainUse,
              fieldKey: 'vehicleMainUse',
            })}

            {renderDateField({
              label: 'Purchase Date',
              value: formData.vehicleInfo.purchaseDate,
              onPress: () => setShowVehiclePurchaseDatePicker(true),
              error: fieldErrors.vehiclePurchaseDate,
              fieldKey: 'vehiclePurchaseDate',
            })}

            {showVehiclePurchaseDatePicker && (
              <DateTimePicker
                value={
                  formData.vehicleInfo.purchaseDate
                    ? new Date(formData.vehicleInfo.purchaseDate)
                    : new Date()
                }
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={new Date()}
                onChange={(_, selectedDate) => {
                  if (Platform.OS === 'android') setShowVehiclePurchaseDatePicker(false);
                  if (selectedDate) {
                    clearFieldError('vehiclePurchaseDate');
                    updateVehicleField('purchaseDate', formatDate(selectedDate));
                  }
                }}
              />
            )}

            {Platform.OS === 'ios' && showVehiclePurchaseDatePicker && (
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowVehiclePurchaseDatePicker(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            )}

            <View style={styles.row}>
              <View style={styles.half}>
                {renderInput({
                  label: 'Purchase Price',
                  value: formData.vehicleInfo.purchasePrice,
                  onChangeText: (text) => updateVehicleField('purchasePrice', text),
                  placeholder: '35000',
                  keyboardType: 'numeric',
                  error: fieldErrors.vehiclePurchasePrice,
                  fieldKey: 'vehiclePurchasePrice',
                })}
              </View>

              <View style={styles.half}>
                {renderInput({
                  label: 'GST / HST Paid',
                  value: formData.vehicleInfo.gstHstPaid,
                  onChangeText: (text) => updateVehicleField('gstHstPaid', text),
                  placeholder: '1750',
                  keyboardType: 'numeric',
                  error: fieldErrors.vehicleGstHstPaid,
                  fieldKey: 'vehicleGstHstPaid',
                })}
              </View>
            </View>

            {renderInput({
              label: 'VIN (Optional)',
              value: formData.vehicleInfo.vin,
              onChangeText: (text) => updateVehicleField('vin', text),
              placeholder: 'Vehicle Identification Number',
              error: fieldErrors.vehicleVin,
              fieldKey: 'vehicleVin',
            })}

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleVehicleUpload}
            >
              <Text style={styles.uploadButtonText}>
                {formData.vehicleInfo.billOfSale?.name
                  ? `Bill of Sale: ${formData.vehicleInfo.billOfSale.name}`
                  : 'Upload Bill of Sale'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.checkListWrap}>
        {[
          ['hasRRSP', 'RRSP Contributions'],
          ['hasFHSA', 'FHSA Contributions'],
          ['hasTFSA', 'TFSA Contributions'],
          ['hasTuition', 'Tuition & Education'],
          ['hasMedicalExpenses', 'Medical Expenses'],
          ['hasCharitableDonations', 'Charitable Donations'],
          ['hasChildCareExpenses', 'Child Care Expenses'],
          ['hasMovingExpenses', 'Moving Expenses'],
          ['hasUnionDues', 'Union / Professional Dues'],
          ['hasToolExpenses', 'Tool Expenses'],
          ['hasHomeOffice', 'Home Office Expenses'],
          ['hasVehicleExpenses', 'Vehicle Expenses'],
        ].map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={styles.checkItem}
            onPress={() => updateField(key, !formData[key])}
          >
            <Text style={styles.checkItemText}>{label}</Text>
            <Switch
              value={!!formData[key]}
              onValueChange={(value) => updateField(key, value)}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.sectionBlock}>
        <Text style={styles.blockTitle}>Receipt Categories</Text>
        <View style={styles.chipWrap}>
          {receiptOptions.map((item) => {
            const selected =
              formData.documentPreferences.selectedReceiptCategories.includes(item.key);

            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.choiceChip, selected && styles.choiceChipActive]}
                onPress={() => toggleReceiptCategory(item.key)}
              >
                <Text
                  style={[styles.choiceChipText, selected && styles.choiceChipTextActive]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Card>
  );
};

export default Step6Deductions;