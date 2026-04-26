import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Card from '@/components/ui/Card';

const Step1Account = ({
  styles,
  colors,
  formData,
  fieldErrors,
  updateField,
  renderInput,
  renderPasswordInput,
  showPassword,
  showConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
  renderStepHeader,
  formatPhoneNumber,
}) => {
  return (
    <Card style={styles.card}>
      {renderStepHeader('Account Information', 'Start with your basic account details.')}

      <View style={styles.row}>
        <View style={styles.half}>
          {renderInput({
            label: 'First Name',
            value: formData.firstName,
            onChangeText: (text) => updateField('firstName', text),
            placeholder: 'John',
            error: fieldErrors.firstName,
            fieldKey: 'firstName',
          })}
        </View>

        <View style={styles.half}>
          {renderInput({
            label: 'Last Name',
            value: formData.lastName,
            onChangeText: (text) => updateField('lastName', text),
            placeholder: 'Doe',
            error: fieldErrors.lastName,
            fieldKey: 'lastName',
          })}
        </View>
      </View>

      {renderInput({
        label: 'Email Address',
        value: formData.email,
        onChangeText: (text) => updateField('email', text),
        placeholder: 'john@example.com',
        keyboardType: 'email-address',
        autoCapitalize: 'none',
        error: fieldErrors.email,
        fieldKey: 'email',
      })}

      {renderInput({
        label: 'Phone Number',
        value: formData.phone,
        onChangeText: (text) => updateField('phone', formatPhoneNumber(text)),
        placeholder: '(416) 555-0123',
        keyboardType: 'phone-pad',
        error: fieldErrors.phone,
        fieldKey: 'phone',
      })}

      <View style={styles.row}>
        <View style={styles.half}>
          {renderPasswordInput({
            label: 'Password',
            value: formData.password,
            onChangeText: (text) => updateField('password', text),
            placeholder: 'Minimum 8 characters',
            secureTextEntry: !showPassword,
            onToggleVisibility: () => setShowPassword((prev) => !prev),
            error: fieldErrors.password,
            fieldKey: 'password',
          })}
        </View>

        <View style={styles.half}>
          {renderPasswordInput({
            label: 'Confirm Password',
            value: formData.confirmPassword,
            onChangeText: (text) => updateField('confirmPassword', text),
            placeholder: 'Re-enter password',
            secureTextEntry: !showConfirmPassword,
            onToggleVisibility: () => setShowConfirmPassword((prev) => !prev),
            error: fieldErrors.confirmPassword,
            fieldKey: 'confirmPassword',
          })}
        </View>
      </View>

      <View style={styles.infoBanner}>
        <Icon name="shield-check-outline" size={18} color={colors.primaryScale[600]} />
        <Text style={styles.infoBannerText}>
          Your information is protected with bank-level encryption.
        </Text>
      </View>
    </Card>
  );
};

export default Step1Account;