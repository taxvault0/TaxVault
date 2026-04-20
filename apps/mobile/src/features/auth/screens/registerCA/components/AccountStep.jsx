import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styles from '../Form.styles';

const AccountStep = ({ form, errors, updateField }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getFieldError = (field) => {
    if (field === 'primaryPhone') {
      return errors.primaryPhone || errors.phone || '';
    }
    return errors[field] || '';
  };

  const renderInput = (label, field, placeholder, options = {}) => {
    const fieldError = getFieldError(field);

    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={[styles.input, !!fieldError && styles.inputError]}
          value={String(form[field] ?? '')}
          onChangeText={(value) => updateField(field, value)}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          {...options}
        />
        {!!fieldError && <Text style={styles.error}>{fieldError}</Text>}
      </View>
    );
  };

  const renderPasswordInput = (
    label,
    field,
    placeholder,
    show,
    setShow
  ) => {
    const fieldError = getFieldError(field);

    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>

        <View style={{ position: 'relative' }}>
          <TextInput
            style={[styles.input, !!fieldError && styles.inputError]}
            value={String(form[field] ?? '')}
            onChangeText={(value) => updateField(field, value)}
            placeholder={placeholder}
            placeholderTextColor="#94A3B8"
            secureTextEntry={!show}
            autoCapitalize="none"
          />

          <TouchableOpacity
            onPress={() => setShow(!show)}
            style={{
              position: 'absolute',
              right: 12,
              top: 12,
            }}
          >
            <Icon
              name={show ? 'eye-off' : 'eye'}
              size={20}
              color="#64748B"
            />
          </TouchableOpacity>
        </View>

        {!!fieldError && <Text style={styles.error}>{fieldError}</Text>}
      </View>
    );
  };

  return (
    <View>
      <Text style={styles.title}>Account Information</Text>

      {renderInput('First name *', 'firstName', 'John')}
      {renderInput('Last name *', 'lastName', 'Doe')}
      {renderInput('Email *', 'email', 'ca@firm.ca', {
        keyboardType: 'email-address',
        autoCapitalize: 'none',
      })}
      {renderInput('Phone *', 'primaryPhone', '(780) 555-1234', {
        keyboardType: 'phone-pad',
      })}
      {renderInput('Alternate phone', 'alternatePhone', '(780) 555-5678', {
        keyboardType: 'phone-pad',
      })}

      {renderPasswordInput(
        'Password *',
        'password',
        'Minimum 8 characters',
        showPassword,
        setShowPassword
      )}

      {renderPasswordInput(
        'Confirm password *',
        'confirmPassword',
        'Re-enter password',
        showConfirmPassword,
        setShowConfirmPassword
      )}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Secure & Encrypted</Text>
        <Text style={styles.infoText}>
          Your professional registration information is protected and used only
          for CA onboarding and verification.
        </Text>
      </View>
    </View>
  );
};

export default AccountStep;