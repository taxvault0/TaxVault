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
import { caRegistrationAPI } from '@/services/api';
import { useAuth } from '@/features/auth/context/AuthContext';

import {
  caRegistrationInitialValues,
  validateCAStep,
  formatPhoneNumber,
  normalizePostalCode,
} from '@taxvault/shared';

import { registerCASteps } from './stepConfig';

import AccountStep from './components/AccountStep';
import ProfessionalStep from './components/ProfessionalStep';
import FirmStep from './components/FirmStep';
import CredentialsStep from './components/CredentialsStep';
import PracticeStep from './components/PracticeStep';
import SpecialtiesStep from './components/SpecialtiesStep';
import VerificationStep from './components/VerificationStep';
import ReviewStep from './components/ReviewStep';

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.errors?.[0]?.message ||
  error?.response?.data?.message ||
  error?.message ||
  fallback;

const normalizeFieldValue = (field, value) => {
  if (['phone', 'primaryPhone', 'alternatePhone', 'firmPhone'].includes(field)) {
    return formatPhoneNumber(value);
  }

  if (field === 'firmPostalCode') {
    return normalizePostalCode(value);
  }

  if (['yearAdmitted', 'yearEstablished'].includes(field)) {
    return String(value || '').replace(/\D/g, '').slice(0, 4);
  }

  if (['caNumber', 'policyNumber'].includes(field)) {
    return String(value || '').toUpperCase();
  }

  if (
    [
      'yearsOfExperience',
      'numberOfPartners',
      'numberOfStaff',
      'averageClientsPerYear',
      'minimumFee',
      'maximumFee',
      'serviceRadius',
      'coverageAmount',
    ].includes(field)
  ) {
    return String(value || '').replace(/[^\d.]/g, '');
  }

  return value;
};

const mapStepErrorsForMobile = (stepErrors = {}) => {
  const mapped = { ...stepErrors };
  return mapped;
};

const buildStepPayload = (step, data) => {
  switch (step) {
    case 1:
      return {
        accountInformation: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          primaryPhone: data.phone || data.primaryPhone || '',
          alternatePhone: data.alternatePhone || '',
        },
        onboarding: {
          currentStep: 'account',
          completedSteps: [],
          percentComplete: 12,
        },
      };

    case 2:
      return {
        professionalInformation: {
          caDesignation: data.caDesignation,
          caNumber: data.caNumber,
          provinceOfRegistration: data.provinceOfRegistration,
          yearAdmitted: data.yearAdmitted,
          yearsOfExperience: data.yearsOfExperience,
          firmName: data.firmName,
          firmWebsite: data.firmWebsite,
          areasOfExpertise: Array.isArray(data.areasOfExpertise)
            ? data.areasOfExpertise
            : [],
          languagesSpoken: Array.isArray(data.languages) ? data.languages : [],
          otherLanguage: data.otherLanguage || '',
          professionalDesignations: Array.isArray(data.professionalDesignations)
            ? data.professionalDesignations
            : [],
        },
        onboarding: {
          currentStep: 'professional',
          completedSteps: ['account'],
          percentComplete: 25,
        },
      };

    case 3:
      return {
        firmDetails: {
          firmAddress: data.firmAddress,
          city: data.city,
          province: data.province,
          postalCode: data.firmPostalCode,
          country: data.firmCountry,
          addressData: data.firmAddressData || null,
          firmPhone: data.firmPhone,
          firmEmail: data.firmEmail,
          firmSize:
            data.firmSize === 'small'
              ? 'Small'
              : data.firmSize === 'medium'
              ? 'Medium'
              : data.firmSize === 'large'
              ? 'Large'
              : data.firmSize === 'solo'
              ? 'Solo'
              : data.firmSize || 'Solo',
          numberOfPartners: data.numberOfPartners,
          numberOfStaff: data.numberOfStaff,
          yearEstablished: data.yearEstablished,
        },
        onboarding: {
          currentStep: 'firm-details',
          completedSteps: ['account', 'professional'],
          percentComplete: 37,
        },
      };

    case 4:
      return {
        professionalCredentials: {
          professionalLiabilityInsurance: {
            hasInsurance: !!data.professionalLiabilityInsurance,
            provider: data.insuranceProvider || '',
            policyNumber: data.policyNumber || '',
            coverageAmount: data.coverageAmount || '',
            expiryDate: data.policyExpiryDate || '',
          },
          cpaMembership: {
            isMember: !!data.cpaMemberInGoodStanding,
            licenseVerification: data.licenseVerification || '',
          },
          peerReview: {
            completedWithinLast3Years: !!data.peerReviewCompleted,
            reviewDate: data.peerReviewDate || '',
            outcome: data.peerReviewOutcome || '',
          },
          disciplinary: {
            hasHistory: !!data.disciplinaryHistory,
            details: data.disciplinaryDetails || '',
          },
          backgroundCheckConsent: !!data.backgroundCheckConsent,
        },
        onboarding: {
          currentStep: 'credentials',
          completedSteps: ['account', 'professional', 'firm-details'],
          percentComplete: 50,
        },
      };

    case 5:
      return {
        practiceInformation: {
          practiceType: data.practiceType,
          taxServicesOffered: Array.isArray(data.taxServicesOffered)
            ? data.taxServicesOffered
            : [],
          clientTypesServed: Array.isArray(data.clientTypesServed)
            ? data.clientTypesServed
            : [],
          industriesServed: Array.isArray(data.industriesServed)
            ? data.industriesServed
            : [],
          serviceAreas: Array.isArray(data.serviceAreas)
            ? data.serviceAreas
            : [],
          averageClientsPerYear: data.averageClientsPerYear || '',
          minimumFee: data.minimumFee || '',
          maximumFee: data.maximumFee || '',
          serviceRadius: data.serviceRadius || '',
          acceptingNewClients: !!data.acceptingNewClients,
          offersVirtualServices: !!data.offersVirtualServices,
          offersInPersonServices: !!data.offersInPersonServices,
        },
        onboarding: {
          currentStep: 'practice',
          completedSteps: ['account', 'professional', 'firm-details', 'credentials'],
          percentComplete: 62,
        },
      };

    case 6:
      return {
        specialtiesAndTechnology: {
          taxSpecialties: Array.isArray(data.taxSpecialties)
            ? data.taxSpecialties
            : [],
          provincialSpecialties: Array.isArray(data.provincialSpecialties)
            ? data.provincialSpecialties
            : [],
          internationalSpecialties: Array.isArray(data.internationalSpecialties)
            ? data.internationalSpecialties
            : [],
          accountingSoftware: Array.isArray(data.accountingSoftware)
            ? data.accountingSoftware
            : [],
          taxSoftware: Array.isArray(data.taxSoftware) ? data.taxSoftware : [],
          practiceManagementSoftware: data.practiceManagementSoftware || '',
          offersPortalAccess: !!data.offersPortalAccess,
          acceptsDigitalDocuments: !!data.acceptsDigitalDocuments,
          usesEncryption: !!data.usesEncryption,
          twoFactorAuth: !!data.twoFactorAuth,
        },
        onboarding: {
          currentStep: 'specialties',
          completedSteps: [
            'account',
            'professional',
            'firm-details',
            'credentials',
            'practice',
          ],
          percentComplete: 75,
        },
      };

    case 7:
      return {
        verificationAndDocuments: {
          caCertificateFile: data.caCertificateFile
            ? {
                originalName: data.caCertificateFile.name || '',
                fileName: data.caCertificateFile.name || '',
                filePath: '',
                fileUrl: '',
                mimeType: data.caCertificateFile.type || '',
                size: data.caCertificateFile.size || 0,
                uploadedAt: new Date(),
              }
            : undefined,
          professionalHeadshotFile: data.professionalHeadshotFile
            ? {
                originalName: data.professionalHeadshotFile.name || '',
                fileName: data.professionalHeadshotFile.name || '',
                filePath: '',
                fileUrl: '',
                mimeType: data.professionalHeadshotFile.type || '',
                size: data.professionalHeadshotFile.size || 0,
                uploadedAt: new Date(),
              }
            : undefined,
          firmLogoFile: data.firmLogoFile
            ? {
                originalName: data.firmLogoFile.name || '',
                fileName: data.firmLogoFile.name || '',
                filePath: '',
                fileUrl: '',
                mimeType: data.firmLogoFile.type || '',
                size: data.firmLogoFile.size || 0,
                uploadedAt: new Date(),
              }
            : undefined,
          referenceName: data.referenceName || '',
          referenceEmail: data.referenceEmail || '',
          authorizeTaxVaultVerification: !!data.authorizeCredentialCheck,
        },
        onboarding: {
          currentStep: 'verification',
          completedSteps: [
            'account',
            'professional',
            'firm-details',
            'credentials',
            'practice',
            'specialties',
          ],
          percentComplete: 87,
        },
      };

    case 8:
      return {
        reviewAndSubmit: {
          agreedTermsAndConditions: !!data.agreedTermsAndConditions,
          agreedPrivacyPolicy: !!data.agreedPrivacyPolicy,
          agreedProfessionalTerms: !!data.agreedProfessionalTerms,
          confirmAccuracy: !!data.confirmAccuracy,
        },
      };

    default:
      return {};
  }
};

const getValidationData = (step, formData) => {
  if (step === 7) {
    return {
      ...formData,
      caCertificateFile: formData.caCertificateFile || null,
      professionalHeadshotFile: formData.professionalHeadshotFile || null,
      firmLogoFile: formData.firmLogoFile || null,
      authorizeCredentialCheck: !!formData.authorizeCredentialCheck,
    };
  }

  if (step === 8) {
    return {
      ...formData,
      agreedTermsAndConditions: !!formData.agreedTermsAndConditions,
      agreedPrivacyPolicy: !!formData.agreedPrivacyPolicy,
      agreedProfessionalTerms: !!formData.agreedProfessionalTerms,
      confirmAccuracy: !!formData.confirmAccuracy,
    };
  }

  return formData;
};

const RegisterCAScreen = () => {
  const navigation = useNavigation();
  const { register, updateUser } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const [form, setForm] = useState({
    ...caRegistrationInitialValues,
    firmAddressData: caRegistrationInitialValues.firmAddressData || null,
    primaryPhone:
      caRegistrationInitialValues.primaryPhone ||
      caRegistrationInitialValues.phone ||
      '',
    phone:
      caRegistrationInitialValues.phone ||
      caRegistrationInitialValues.primaryPhone ||
      '',
  });

  const fullName = useMemo(
    () => `${form.firstName} ${form.lastName}`.trim(),
    [form.firstName, form.lastName]
  );

  const updateField = (field, value) => {
    const nextValue = normalizeFieldValue(field, value);

    setForm((prev) => {
      const next = { ...prev, [field]: nextValue };

      if (field === 'primaryPhone') next.phone = nextValue;
      if (field === 'phone') next.primaryPhone = nextValue;

      return next;
    });

    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];

      if (field === 'firmAddressData') {
        delete next.firmAddress;
        delete next.city;
        delete next.province;
        delete next.firmPostalCode;
      }

      if (field === 'firmAddress') {
        delete next.firmAddress;
      }

      if (field === 'city') {
        delete next.city;
      }

      if (field === 'province') {
        delete next.province;
      }

      if (field === 'firmPostalCode') {
        delete next.firmPostalCode;
      }

      if (field === 'primaryPhone' || field === 'phone') {
        delete next.phone;
        delete next.primaryPhone;
      }

      return next;
    });

    setFormError('');
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

    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });

    setFormError('');
  };

  const handleNext = async () => {
    const validationData = getValidationData(currentStep, form);
    const rawStepErrors = validateCAStep(currentStep, validationData);
    const mappedStepErrors = mapStepErrorsForMobile(rawStepErrors);

    if (Object.keys(rawStepErrors).length > 0) {
      setErrors(mappedStepErrors);
      setFormError('Please fix the errors before continuing.');
      return;
    }

    try {
      setSaving(true);
      setErrors({});
      setFormError('');
      setCurrentStep((prev) => Math.min(prev + 1, registerCASteps.length));
    } catch (error) {
      setFormError('Failed to continue. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePrevious = () => {
    setFormError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    const validationData = getValidationData(8, form);
    const rawStepErrors = validateCAStep(8, validationData);
    const mappedStepErrors = mapStepErrorsForMobile(rawStepErrors);

    if (Object.keys(rawStepErrors).length > 0) {
      setErrors(mappedStepErrors);
      setFormError('Please fix the errors before submitting.');
      return;
    }

    setErrors({});
    setFormError('');
    setLoading(true);

    try {
      const cleanPhone = (form.phone || form.primaryPhone || '').replace(/\D/g, '');

      const registrationPayload = {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
        role: 'ca',
        userType: 'professional',
        phoneNumber: cleanPhone,
        province: form.province || form.provinceOfRegistration || 'ON',
        firmName: form.firmName || '',
        caNumber: form.caNumber || '',
      };

      const registrationResult = await register(registrationPayload);

      if (!registrationResult?.success) {
        throw new Error(
          registrationResult?.error ||
            'Unable to create account before submission'
        );
      }

      const stepPayloads = [
        buildStepPayload(1, form),
        buildStepPayload(2, form),
        buildStepPayload(3, form),
        buildStepPayload(4, form),
        buildStepPayload(5, form),
        buildStepPayload(6, form),
        buildStepPayload(7, form),
      ];

      await Promise.all(
        stepPayloads.map((payload) => caRegistrationAPI.saveDraft(payload))
      );

      await caRegistrationAPI.submit(buildStepPayload(8, form));

      await updateUser({
        firmName: form.firmName || '',
        caNumber: form.caNumber || '',
        role: 'ca',
        userType: 'professional',
      });

      Alert.alert('Success', 'CA registration submitted successfully.', [
        {
          text: 'OK',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'CAApp' }],
            });
          },
        },
      ]);
    } catch (error) {
      const message = getErrorMessage(
        error,
        'Registration failed. Please try again.'
      );
      setFormError(message);
      Alert.alert('Registration failed', message);
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
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {!!formError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{formError}</Text>
            </View>
          )}

          {renderStep()}
        </View>

        <View style={styles.actions}>
          {currentStep > 1 ? (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handlePrevious}
              disabled={saving || loading}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                Back
              </Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}

          {currentStep < 8 ? (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleNext}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Next</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Submit</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterCAScreen;