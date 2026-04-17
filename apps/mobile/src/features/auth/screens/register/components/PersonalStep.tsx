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
  setCustomCity,
  customCity,
  scrollToField,
  provinces,
  provinceCities,
  taxFilingStatuses,
  dependentOptions,
  syncFamilyAndFilingStatus,
  formatPostalCode,
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

      {Platform.OS === 'ios' && showDobPicker && (
        <TouchableOpacity style={styles.doneButton} onPress={() => setShowDobPicker(false)}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      )}

      {renderInput({
        label: 'SIN Number',
        value: formData.sin,
        onChangeText: (text) => updateField('sin', text.replace(/\D/g, '').slice(0, 9)),
        placeholder: '123456789',
        keyboardType: 'number-pad',
        error: fieldErrors.sin,
        fieldKey: 'sin',
      })}

      <Text style={styles.helperText}>Enter your SIN if available.</Text>

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
                clearFieldError('taxFilingStatus');
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

      {renderPicker({
        label: 'Number of Dependents',
        value: formData.numberOfDependents,
        onValueChange: (value) => updateField('numberOfDependents', value),
        options: dependentOptions,
        placeholder: 'Select dependents',
        error: fieldErrors.numberOfDependents,
        fieldKey: 'numberOfDependents',
      })}

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

          {Platform.OS === 'ios' && showSpouseDobPicker && (
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setShowSpouseDobPicker(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          )}

          <View style={styles.row}>
            <View style={styles.half}>
              {renderInput({
                label: 'Spouse SIN (Optional)',
                value: formData.spouseSin,
                onChangeText: (text) =>
                  updateField('spouseSin', text.replace(/\D/g, '').slice(0, 9)),
                placeholder: '123456789',
                keyboardType: 'number-pad',
                error: fieldErrors.spouseSin,
                fieldKey: 'spouseSin',
              })}
            </View>

            <View style={styles.half}>
              {renderInput({
                label: 'Spouse Phone (Optional)',
                value: formData.spousePhone,
                onChangeText: (text) =>
                  updateField('spousePhone', formatPhoneNumber(text)),
                placeholder: '(416) 555-0123',
                keyboardType: 'phone-pad',
                error: fieldErrors.spousePhone,
                fieldKey: 'spousePhone',
              })}
            </View>
          </View>
        </View>
      )}

      <View style={styles.field} onLayout={setFieldRef('address')}>
        <Text style={styles.label}>Street Address</Text>
        <GooglePlacesAutocomplete
          placeholder="Start typing your address"
          fetchDetails
          onPress={(data, details = null) => {
            clearFieldError('address');
            clearFieldError('province');
            clearFieldError('city');
            clearFieldError('postalCode');

            const addressText = details?.formatted_address || data?.description || '';
            let city = '';
            let province = '';
            let postalCode = '';

            const components = details?.address_components || [];

            components.forEach((component) => {
              if (component.types.includes('locality')) city = component.long_name;
              if (component.types.includes('administrative_area_level_1')) {
                province = component.long_name;
              }
              if (component.types.includes('postal_code')) postalCode = component.long_name;
            });

            setCustomCity(false);

            setFormData((prev) => ({
              ...prev,
              address: addressText,
              city: city || prev.city,
              province: province || prev.province,
              postalCode: postalCode ? formatPostalCode(postalCode) : prev.postalCode,
              country: 'Canada',
            }));

            requestAnimationFrame(() => scrollToField('province'));
          }}
          textInputProps={{
            value: formData.address,
            onChangeText: (text) => {
              clearFieldError('address');
              updateField('address', text);
            },
            placeholderTextColor: colors.gray[400],
          }}
          query={{
            key: GOOGLE_PLACES_API_KEY,
            language: 'en',
            components: 'country:ca',
          }}
          enablePoweredByContainer={false}
          keyboardShouldPersistTaps="handled"
          listViewDisplayed="auto"
          styles={{
            textInputContainer: styles.googleInputContainer,
            textInput: [styles.googleInput, fieldErrors.address ? styles.inputError : null],
            listView: styles.googleListView,
            row: styles.googleRow,
            description: styles.googleDescription,
          }}
        />
        {!!fieldErrors.address && <Text style={styles.errorText}>{fieldErrors.address}</Text>}
      </View>

      {renderPicker({
        label: 'Province',
        value: formData.province,
        onValueChange: (value) => {
          updateField('province', value);
          updateField('city', '');
          setCustomCity(false);
        },
        options: provinces,
        placeholder: 'Select province',
        error: fieldErrors.province,
        fieldKey: 'province',
      })}

      {renderPicker({
        label: 'City',
        value: customCity ? 'Other' : formData.city,
        onValueChange: (value) => {
          if (value === 'Other') {
            setCustomCity(true);
            updateField('city', '');
            requestAnimationFrame(() => scrollToField('otherCity'));
          } else {
            setCustomCity(false);
            updateField('city', value);
            requestAnimationFrame(() => scrollToField('postalCode'));
          }
        },
        options: formData.province ? provinceCities[formData.province] || ['Other'] : ['Other'],
        placeholder: formData.province ? 'Select city' : 'Select province first',
        error: fieldErrors.city,
        fieldKey: 'city',
      })}

      {customCity &&
        renderInput({
          label: 'Other City',
          value: formData.city,
          onChangeText: (text) => updateField('city', text),
          placeholder: 'Enter city',
          error: fieldErrors.city,
          fieldKey: 'otherCity',
        })}

      <View style={styles.row}>
        <View style={styles.half}>
          {renderInput({
            label: 'Postal Code',
            value: formData.postalCode,
            onChangeText: (text) => updateField('postalCode', formatPostalCode(text)),
            placeholder: 'M5V 2H1',
            autoCapitalize: 'characters',
            error: fieldErrors.postalCode,
            fieldKey: 'postalCode',
          })}
        </View>

        <View style={styles.half}>
          {renderInput({
            label: 'Country',
            value: formData.country,
            placeholder: 'Canada',
            editable: false,
          })}
        </View>
      </View>
    </Card>
  );
};

export default Step2Personal;