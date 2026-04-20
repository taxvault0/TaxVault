import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import { authAPI, onboardingAPI } from '@/services/api';

import { registerUserInitialValues } from './modules/initialValues';
import { registerUserSteps } from './modules/stepConfig';
import {
  getUserRegisterPayload,
  getUserOnboardingPayload,
} from './modules/mapper';
import { validateRegisterUserStep } from './modules/validation';

import AccountStep from './components/AccountStep';
import ProfileStep from './components/ProfileStep';
import FamilyStep from './components/FamilyStep';
import IncomeStep from './components/IncomeStep';
import VehicleStep from './components/VehicleStep';
import DeductionsStep from './components/DeductionsStep';
import ReviewStep from './components/ReviewStep';

import styles from './RegisterUserScreen.styles';

const RegisterUserScreen = ({ navigation }) => {
  const [form, setForm] = useState(registerUserInitialValues);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const result = validateRegisterUserStep({ currentStep: step, form });
    setErrors(result.errors || {});
    return result.isValid;
  };

  const next = () => {
    if (!validate()) return;
    setStep((prev) => Math.min(prev + 1, registerUserSteps.length));
  };

  const back = () => {
    if (step === 1) {
      navigation.goBack();
      return;
    }

    setStep((prev) => Math.max(prev - 1, 1));
  };

  const submit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const registerPayload = getUserRegisterPayload(form);
      const registerResponse = await authAPI.register(registerPayload);

      const authData = registerResponse?.data || registerResponse;
      const token = authData?.token;
      const user = authData?.user;

      if (!token || !user) {
        throw new Error('Registration succeeded but user/token missing.');
      }

      const onboardingPayload = getUserOnboardingPayload(form);
      await onboardingAPI.save(onboardingPayload);

      Alert.alert('Success', 'Account created successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.replace('UserApp'),
        },
      ]);
    } catch (e) {
      Alert.alert(
        'Error',
        e?.response?.data?.message ||
          e?.message ||
          'Failed to create account.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <AccountStep form={form} errors={errors} updateField={updateField} />
        );
      case 2:
        return (
          <ProfileStep form={form} errors={errors} updateField={updateField} />
        );
      case 3:
        return (
          <FamilyStep form={form} errors={errors} updateField={updateField} />
        );
      case 4:
        return (
          <IncomeStep form={form} errors={errors} updateField={updateField} />
        );
      case 5:
        return (
          <VehicleStep form={form} errors={errors} updateField={updateField} />
        );
      case 6:
        return (
          <DeductionsStep
            form={form}
            errors={errors}
            updateField={updateField}
          />
        );
      case 7:
        return (
          <ReviewStep form={form} errors={errors} updateField={updateField} />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create User Account</Text>
          <Text style={styles.subtitle}>
            Clean modular mobile registration flow.
          </Text>
        </View>

        <View style={styles.progressRow}>
          {registerUserSteps.map((item) => {
            const active = step === item.number;
            const complete = step > item.number;

            return (
              <View
                key={item.number}
                style={[
                  styles.progressItem,
                  active && styles.progressItemActive,
                ]}
              >
                <Text
                  style={[
                    styles.progressNumber,
                    (active || complete) && styles.progressTextActive,
                  ]}
                >
                  {item.number}
                </Text>
                <Text
                  style={[
                    styles.progressLabel,
                    (active || complete) && styles.progressTextActive,
                  ]}
                >
                  {item.title}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.card}>{renderStep()}</View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={back}
            disabled={loading}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Back
            </Text>
          </TouchableOpacity>

          {step < registerUserSteps.length ? (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={next}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={submit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterUserScreen;