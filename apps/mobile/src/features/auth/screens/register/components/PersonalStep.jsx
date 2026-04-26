import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Card from '@/components/ui/Card';

const Step2Personal = ({
  styles,
  colors,
  formData,
  fieldErrors,
  renderStepHeader,
  renderDateField,
  renderInput,
  renderPicker,
  showDobPicker,
  setShowDobPicker,
  showSpouseDobPicker,
  setShowSpouseDobPicker,
  formatDate,
  formatPhoneNumber,
  updateField,
  clearFieldError,
  setFieldRef,
  setFormData,
  scrollToField,
  taxFilingStatuses,
  dependentOptions,
  syncFamilyAndFilingStatus,
  GOOGLE_PLACES_API_KEY,
}) => {
  const needsSpouse =
    formData.maritalStatus === 'Married' ||
    formData.maritalStatus === 'Common-Law';

  return (
    <Card style={styles.card}>
      {renderStepHeader(
        'Personal Information',
        'Add personal details, family status, and address information.'
      )}

      {/* DOB */}
      {renderDateField({
        label: 'Date of Birth',
        value: formData.dateOfBirth,
        onPress: () => setShowDobPicker(true),
        error: fieldErrors.dateOfBirth,
        fieldKey: 'dateOfBirth',
      })}

      {showDobPicker && (
        <DateTimePicker
          value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date()}
          onChange={(_, selectedDate) => {
            if (Platform.OS === 'android') setShowDobPicker(false);
            if (selectedDate) {
              clearFieldError('dateOfBirth');
              updateField('dateOfBirth', formatDate(selectedDate));
            }
          }}
        />
      )}

      {/* SIN */}
      {renderInput({
        label: 'SIN Number',
        value: formData.sin,
        onChangeText: (text) => updateField('sin', text.replace(/\D/g, '').slice(0, 9)),
        placeholder: '123456789',
        keyboardType: 'number-pad',
        error: fieldErrors.sin,
        fieldKey: 'sin',
      })}

      {/* FAMILY STATUS */}
      <View style={styles.sectionBlock} onLayout={setFieldRef('maritalStatus')}>
        <Text style={styles.blockTitle}>Family Status</Text>
        <View style={styles.chipWrap}>
          {taxFilingStatuses.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.choiceChip,
                formData.maritalStatus === status && styles.choiceChipActive,
              ]}
              onPress={() => {
                clearFieldError('maritalStatus');
                syncFamilyAndFilingStatus('maritalStatus', status);
              }}
            >
              <Text
                style={[
                  styles.choiceChipText,
                  formData.maritalStatus === status && styles.choiceChipTextActive,
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {!!fieldErrors.maritalStatus && (
          <Text style={styles.errorText}>{fieldErrors.maritalStatus}</Text>
        )}
      </View>

      {/* DEPENDENTS */}
      {renderPicker({
        label: 'Number of Dependents',
        value: formData.numberOfDependents,
        onValueChange: (value) => updateField('numberOfDependents', value),
        options: dependentOptions,
        placeholder: 'Select dependents',
        error: fieldErrors.numberOfDependents,
        fieldKey: 'numberOfDependents',
      })}

      {/* SPOUSE */}
      {needsSpouse && (
        <View style={styles.sectionBlock}>
          <Text style={styles.blockTitle}>Spouse Information</Text>

          {renderInput({
            label: 'Spouse Name',
            value: formData.spouseName,
            onChangeText: (text) => updateField('spouseName', text),
            placeholder: 'Full name',
            error: fieldErrors.spouseName,
            fieldKey: 'spouseName',
          })}

          {renderDateField({
            label: 'Spouse Date of Birth',
            value: formData.spouseDob,
            onPress: () => setShowSpouseDobPicker(true),
            error: fieldErrors.spouseDob,
            fieldKey: 'spouseDob',
          })}

          {showSpouseDobPicker && (
            <DateTimePicker
              value={formData.spouseDob ? new Date(formData.spouseDob) : new Date(2000, 0, 1)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onChange={(_, selectedDate) => {
                if (Platform.OS === 'android') setShowSpouseDobPicker(false);
                if (selectedDate) {
                  clearFieldError('spouseDob');
                  updateField('spouseDob', formatDate(selectedDate));
                }
              }}
            />
          )}

          <View style={styles.row}>
            <View style={styles.half}>
              {renderInput({
                label: 'Spouse SIN',
                value: formData.spouseSin,
                onChangeText: (text) =>
                  updateField('spouseSin', text.replace(/\D/g, '').slice(0, 9)),
                placeholder: '123456789',
                keyboardType: 'number-pad',
              })}
            </View>

            <View style={styles.half}>
              {renderInput({
                label: 'Spouse Phone',
                value: formData.spousePhone,
                onChangeText: (text) =>
                  updateField('spousePhone', formatPhoneNumber(text)),
                placeholder: '(416) 555-0123',
                keyboardType: 'phone-pad',
              })}
            </View>
          </View>
        </View>
      )}

      {/* ✅ GOOGLE ADDRESS ONLY */}
      <View style={styles.field} onLayout={setFieldRef('address')}>
        <Text style={styles.label}>Address *</Text>

        <GooglePlacesAutocomplete
          placeholder="Search your address"
          fetchDetails
          onPress={(data, details = null) => {
            const components = details?.address_components || [];

            const get = (type) =>
              components.find((c) => c.types.includes(type))?.long_name || '';

            const addressData = {
              formattedAddress: details?.formatted_address || data?.description || '',
              city: get('locality'),
              province: get('administrative_area_level_1'),
              postalCode: get('postal_code'),
              country: 'Canada',
              placeId: details?.place_id,
              lat: details?.geometry?.location?.lat,
              lng: details?.geometry?.location?.lng,
            };

            setFormData((prev) => ({
              ...prev,
              addressData,
              address: addressData.formattedAddress,
              city: addressData.city,
              province: addressData.province,
              postalCode: addressData.postalCode,
              country: 'Canada',
            }));

            clearFieldError('address');
          }}
          query={{
            key: GOOGLE_PLACES_API_KEY,
            language: 'en',
            components: 'country:ca',
          }}
          enablePoweredByContainer={false}
          styles={{
            textInput: styles.googleInput,
            listView: styles.googleListView,
          }}
        />

        {!!fieldErrors.address && (
          <Text style={styles.errorText}>{fieldErrors.address}</Text>
        )}
      </View>
    </Card>
  );
};

export default Step2Personal;