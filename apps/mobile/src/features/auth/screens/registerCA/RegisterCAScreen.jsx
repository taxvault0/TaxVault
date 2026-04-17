import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from './RegisterCAScreen.styles';

import { useAuth } from '@/features/auth/context/AuthContext';
import { caRegistrationAPI } from '@/services/api';
import { registerCAInitialValues } from './modules/initialValues';
import { registerCASteps } from './modules/stepConfig';
import {
  getCARegisterPayload,
  getCASaveDraftPayload,
  getCASubmitPayload,
} from './modules/mapper';
import {
  validateRegisterCAStep,
  validateFullCAForm,
} from './modules/validation';

import AccountStep from './components/AccountStep';
import ProfessionalStep from './components/ProfessionalStep';
import FirmStep from './components/FirmStep';
import CredentialsStep from './components/CredentialsStep';
import PracticeStep from './components/PracticeStep';
import SpecialtiesStep from './components/SpecialtiesStep';
import VerificationStep from './components/VerificationStep';
import ReviewStep from './components/ReviewStep';

const formatPhoneNumber = (value = '') => {
  const digits = String(value).replace(/\D/g, '').slice(0, 10);

  if (!digits) return '';
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

const formatYear = (value = '') => String(value).replace(/\D/g, '').slice(0, 4);

const formatCanadianPostalCode = (value = '') => {
  const cleaned = String(value).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  if (!cleaned) return '';
  if (cleaned.length <= 3) return cleaned;
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
};

const normalizeFieldValue = (field, value) => {
  if (['primaryPhone', 'alternatePhone', 'firmPhone'].includes(field)) {
    return formatPhoneNumber(value);
  }

  if (['yearAdmitted', 'yearEstablished'].includes(field)) {
    return formatYear(value);
  }

  if (field === 'firmPostalCode') {
    return formatCanadianPostalCode(value);
  }

  if (['caNumber', 'policyNumber', 'licenseVerification'].includes(field)) {
    return String(value || '').toUpperCase();
  }

  if (
    ['coverageAmount', 'serviceRadius', 'averageClientsPerYear', 'minimumFee', 'maximumFee'].includes(
      field
    )
  ) {
    return String(value || '').replace(/[^\d.]/g, '');
  }

  if (['yearsOfExperience', 'numberOfPartners', 'numberOfStaff'].includes(field)) {
    return String(value || '').replace(/\D/g, '');
  }

  if (field === 'disciplinaryDetails') {
    return String(value || '').slice(0, 500);
  }

  return value;
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.errors?.[0]?.message ||
  error?.response?.data?.message ||
  error?.message ||
  fallback;

const RegisterCAScreen = () => {
  const navigation = useNavigation();
  const { register, updateUser } = useAuth();

  const [form, setForm] = useState(registerCAInitialValues);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);

  const fullName = useMemo(
    () => `${form.firstName} ${form.lastName}`.trim(),
    [form.firstName, form.lastName]
  );

  const updateField = (field, value) => {
    const nextValue = normalizeFieldValue(field, value);
    setForm((prev) => ({ ...prev, [field]: nextValue }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const toggleArrayValue = (field, value) => {
    setForm((prev) => {
      const current = Array.isArray(prev[field]) ? prev[field] : [];
      const exists = current.includes(value);

      return {
        ...prev,
        [field]: exists
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });

    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const runStepValidation = () => {
    const result = validateRegisterCAStep({ currentStep, form });

    console.log('======================');
    console.log('STEP:', currentStep);
    console.log('FORM:', JSON.stringify(form, null, 2));
    console.log('ERRORS:', result.errors);
    console.log('======================');

    setErrors(result.errors);
    return result.isValid;
  };

  const runFullValidation = () => {
    const result = validateFullCAForm(form);

    console.log('======================');
    console.log('FULL FORM VALIDATION');
    console.log('FORM:', JSON.stringify(form, null, 2));
    console.log('ERRORS:', result.errors);
    console.log('======================');

    setErrors(result.errors);
    return result.isValid;
  };

  const createCAAccount = async () => {
    if (accountCreated || creatingAccount) return;

    try {
      setCreatingAccount(true);

      const registerPayload = getCARegisterPayload(form);
      console.log('REGISTER PAYLOAD:', JSON.stringify(registerPayload, null, 2));

      const registrationResult = await register(registerPayload, 'ca');
      console.log('REGISTER RESULT FULL:', JSON.stringify(registrationResult, null, 2));

      if (!registrationResult?.success) {
        throw new Error(
          registrationResult?.message ||
            registrationResult?.error ||
            'Unable to create CA account'
        );
      }

      setAccountCreated(true);
    } catch (error) {
      console.log(
        'REGISTER ERROR RESPONSE:',
        JSON.stringify(error?.response?.data || null, null, 2)
      );
      console.log('REGISTER ERROR MESSAGE:', error?.message);
      console.log(
        'REGISTER ERROR FULL:',
        JSON.stringify(
          {
            message: error?.message,
            status: error?.response?.status,
            data: error?.response?.data,
          },
          null,
          2
        )
      );

      throw new Error(
        error?.response?.data?.errors?.[0]?.message ||
          error?.response?.data?.message ||
          error?.message ||
          'Unable to create CA account'
      );
    } finally {
      setCreatingAccount(false);
    }
  };

  const saveDraft = async () => {
    const draftPayload = getCASaveDraftPayload(form, currentStep);
    console.log('SAVE DRAFT PAYLOAD:', JSON.stringify(draftPayload, null, 2));

    const draftResult = await caRegistrationAPI.saveDraft(draftPayload);
    console.log('SAVE DRAFT RESULT:', JSON.stringify(draftResult?.data || draftResult, null, 2));

    const success = draftResult?.data?.success ?? draftResult?.success;
    const message = draftResult?.data?.message ?? draftResult?.message;

    if (!success) {
      throw new Error(message || 'Could not save CA registration draft');
    }
  };

  const handleBack = () => {
    if (loading || creatingAccount) return;

    if (currentStep === 1) {
      navigation.goBack();
      return;
    }

    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = async () => {
    if (!runStepValidation()) return;

    try {
      setLoading(true);

      if (currentStep === 1) {
        if (!accountCreated) {
          await createCAAccount();
        }

        await saveDraft();
        setCurrentStep(2);
        return;
      }

      if (accountCreated) {
        await saveDraft();
      }

      setCurrentStep((prev) => Math.min(prev + 1, registerCASteps.length));
    } catch (error) {
      console.log(
        'NEXT STEP ERROR:',
        JSON.stringify(error?.response?.data || error, null, 2)
      );

      Alert.alert(
        'Could not continue',
        getErrorMessage(error, 'Something went wrong while saving your progress.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!runFullValidation()) {
      Alert.alert('Missing information', 'Please fix the highlighted errors before submitting.');
      return;
    }

    try {
      setLoading(true);

      if (!accountCreated) {
        await createCAAccount();
      }

      await saveDraft();

      const submitPayload = getCASubmitPayload(form);
      console.log('SUBMIT PAYLOAD:', JSON.stringify(submitPayload, null, 2));

      const submitResult = await caRegistrationAPI.submit(submitPayload);
      console.log('SUBMIT RESULT:', JSON.stringify(submitResult?.data || submitResult, null, 2));

      const success = submitResult?.data?.success ?? submitResult?.success;
      const message = submitResult?.data?.message ?? submitResult?.message;

      if (!success) {
        throw new Error(message || 'Could not submit CA registration');
      }

      const updateResult = await updateUser({
        firmName: form.firmName || '',
        caNumber: form.caNumber || '',
        role: 'ca',
        userType: 'professional',
      });

      if (!updateResult?.success) {
        throw new Error('Failed to update user profile');
      }

      Alert.alert('Success', 'CA registration submitted successfully.', [
        {
          text: 'OK',
          onPress: () => {
            const root = navigation.getParent()?.getParent();

            if (root) {
              root.reset({
                index: 0,
                routes: [{ name: 'CAApp' }],
              });
            }
          },
        },
      ]);
    } catch (error) {
      console.log('REGISTER/SUBMIT ERROR:', {
        message: error?.message,
        response: error?.response?.data,
      });

      Alert.alert(
        'Registration failed',
        getErrorMessage(
          error,
          'Something went wrong while creating the CA account.'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const stepProps = {
    form,
    errors,
    updateField,
    toggleArrayValue,
    fullName,
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <AccountStep {...stepProps} />;
      case 2:
        return <ProfessionalStep {...stepProps} />;
      case 3:
        return <FirmStep {...stepProps} />;
      case 4:
        return <CredentialsStep {...stepProps} />;
      case 5:
        return <PracticeStep {...stepProps} />;
      case 6:
        return <SpecialtiesStep {...stepProps} />;
      case 7:
        return <VerificationStep {...stepProps} />;
      case 8:
        return <ReviewStep {...stepProps} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>{renderStep()}</View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleBack}
            disabled={loading || creatingAccount}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Back</Text>
          </TouchableOpacity>

          {currentStep < registerCASteps.length ? (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleNext}
              disabled={loading || creatingAccount}
            >
              {loading || creatingAccount ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Next</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleSubmit}
              disabled={loading || creatingAccount}
            >
              {loading || creatingAccount ? (
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

export default RegisterCAScreen;