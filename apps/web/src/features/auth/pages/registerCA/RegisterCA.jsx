import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from 'components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { caRegistrationAPI } from 'services/api';
import {
  formatPhoneNumber,
  formatYear,
  formatCanadianPostalCode,
} from 'utils/validators';

import { caRegistrationInitialValues as initialValues } from '@shared/caRegistration/initialValues';
import { validateCAStep as validateStep } from '@shared/caRegistration/validation';
import {
  ErrorAlert,
  VerificationNotice,
  ProgressSteps,
  AccountDetails,
  ProfessionalDetails,
  FirmDetails,
  CredentialsDetails,
  PracticeDetails,
  SpecialtiesDetails,
  VerificationDetails,
  ReviewDetails,
} from './registration';

const LOCAL_DRAFT_KEY = 'caRegistrationDraft';

const RegisterCA = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    ...initialValues,
    firmAddressData: initialValues.firmAddressData || null,
  });

  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(LOCAL_DRAFT_KEY);

      if (savedDraft) {
        const parsedDraft = JSON.parse(savedDraft);

        const migratedDraft = {
          ...parsedDraft,
          firmAddressData: parsedDraft.firmAddressData || null,
          city: parsedDraft.city || parsedDraft.firmCity || '',
          province: parsedDraft.province || parsedDraft.firmProvince || '',
          agreeToTerms:
            parsedDraft.agreeToTerms ?? parsedDraft.agreedTerms ?? false,
          agreeToPrivacy:
            parsedDraft.agreeToPrivacy ?? parsedDraft.agreedPrivacy ?? false,
          agreedProfessionalTerms:
            parsedDraft.agreedProfessionalTerms ?? false,
          confirmAccuracy: parsedDraft.confirmAccuracy ?? false,
          acceptingNewClients:
            parsedDraft.acceptingNewClients ??
            parsedDraft.acceptNewClients ??
            true,
          clientTypes:
            parsedDraft.clientTypes || parsedDraft.primaryClientTypes || [],
        };

        setFormData((prev) => ({
          ...prev,
          ...migratedDraft,
        }));
      }
    } catch (error) {
      console.error('Failed to load local CA draft:', error);
    }
  }, []);

  const saveLocalDraft = (data) => {
    try {
      localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save local CA draft:', error);
    }
  };

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  let newValue = value;

  if (['phone', 'alternatePhone', 'firmPhone'].includes(name)) {
    newValue = formatPhoneNumber(value);
  }

  if (name === 'yearAdmitted' || name === 'yearEstablished') {
    newValue = formatYear(value);
  }

  if (name === 'firmPostalCode') {
    newValue = formatCanadianPostalCode(value);
  }

  setFormData((prev) => {
    const nextData = {
      ...prev,
      [name]: type === 'checkbox' ? checked : newValue,
    };
    saveLocalDraft(nextData);
    return nextData;
  });

  setErrors((prev) => {
    const next = { ...prev };
    delete next[name];

    if (name === 'phone') {
      delete next.phone;
      delete next.primaryPhone;
    }

    if (name === 'agreeToTerms') {
      delete next.agreeToTerms;
      delete next.agreedTermsAndConditions;
    }

    if (name === 'agreeToPrivacy') {
      delete next.agreeToPrivacy;
      delete next.agreedPrivacyPolicy;
    }

    if (name === 'authorizeVerification') {
      delete next.authorizeVerification;
      delete next.authorizeCredentialCheck;
    }

    return next;
  });

  setFormError('');
};

  const handleArrayChange = (field, value) => {
  setFormData((prev) => {
    const nextData = {
      ...prev,
      [field]:
        Array.isArray(prev[field]) && prev[field].includes(value)
          ? prev[field].filter((item) => item !== value)
          : [...(Array.isArray(prev[field]) ? prev[field] : []), value],
    };
    saveLocalDraft(nextData);
    return nextData;
  });

  setErrors((prev) => {
    const next = { ...prev };
    delete next[field];
    return next;
  });

  setFormError('');
};

  const handleFileUpload = (field, file) => {
  setUploadedFiles((prev) => ({ ...prev, [field]: file }));

  setFormData((prev) => {
    const nextData = {
      ...prev,
      [field]: file?.name || '',
    };
    saveLocalDraft(nextData);
    return nextData;
  });

  setErrors((prev) => {
    const next = { ...prev };
    delete next[field];

    if (field === 'caCertificate') {
      delete next.caCertificate;
      delete next.caCertificateFile;
    }

    if (field === 'professionalHeadshot') {
      delete next.professionalHeadshot;
      delete next.professionalHeadshotFile;
    }

    if (field === 'firmLogo') {
      delete next.firmLogo;
      delete next.firmLogoFile;
    }

    return next;
  });

  setFormError('');
};

  const buildStepPayload = (step, data) => {
    switch (step) {
      case 1:
        return {
          accountInformation: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            primaryPhone: data.phone,
            alternatePhone: data.alternatePhone,
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
            areasOfExpertise: data.areasOfExpertise || [],
            languagesSpoken: data.languages || [],
            otherLanguage: data.otherLanguage || '',
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
            firmPhone: data.firmPhone,
            firmEmail: data.firmEmail,
            addressData: data.firmAddressData || null,
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
              hasInsurance: data.professionalLiabilityInsurance,
              provider: data.insuranceProvider,
              policyNumber: data.policyNumber,
              coverageAmount: data.coverageAmount,
              expiryDate: data.expiryDate,
            },
            cpaMembership: {
              isMemberInGoodStanding: data.cpaMemberInGoodStanding,
              licenseVerificationNumber: data.licenseVerification || '',
            },
            peerReview: {
              completedWithinLast3Years: data.peerReviewCompleted,
              reviewDate: data.peerReviewDate,
              outcome:
                data.peerReviewOutcome === 'pass'
                  ? 'Pass'
                  : data.peerReviewOutcome === 'pass_with_conditions'
                  ? 'Pass with Conditions'
                  : data.peerReviewOutcome === 'pending'
                  ? 'Pending'
                  : data.peerReviewOutcome === 'other'
                  ? 'Other'
                  : data.peerReviewOutcome || '',
            },
            disciplinaryHistory: {
              hasHistory: data.disciplinaryHistory,
              details: data.disciplinaryDetails,
            },
            criminalRecordCheck: {
              consentGiven: data.backgroundCheckConsent,
            },
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
            acceptingNewClients: data.acceptingNewClients ?? true,
            primaryClientTypes: Array.isArray(data.clientTypes)
              ? data.clientTypes.filter(Boolean)
              : [],
            averageClientsPerYear:
              data.averageClientsPerYear !== '' &&
              data.averageClientsPerYear != null
                ? Number(data.averageClientsPerYear)
                : 0,
            minimumFee:
              data.minimumFee !== '' && data.minimumFee != null
                ? Number(data.minimumFee)
                : 0,
            maximumFee:
              data.maximumFee !== '' && data.maximumFee != null
                ? Number(data.maximumFee)
                : 0,
            serviceOfferings: Array.isArray(data.servicesOffered)
              ? data.servicesOffered
              : [],
            serviceRadiusKm:
              data.serviceRadius !== '' && data.serviceRadius != null
                ? Number(data.serviceRadius)
                : 50,
          },
          onboarding: {
            currentStep: 'practice',
            completedSteps: [
              'account',
              'professional',
              'firm-details',
              'credentials',
            ],
            percentComplete: 62,
          },
        };

      case 6:
        return {
          specialtiesAndTechnology: {
            taxSpecialties: data.taxSpecialties || [],
            provincialSpecialties: data.provincialSpecialties || [],
            internationalSpecialties: Array.isArray(data.internationalSpecialties)
              ? data.internationalSpecialties
              : [
                  ...(data.internationalTax ? ['international_tax'] : []),
                  ...(data.usTax ? ['us_tax'] : []),
                  ...(data.crossBorder ? ['cross_border'] : []),
                  ...(data.estatePlanning ? ['estate_planning'] : []),
                  ...(data.corporateRestructuring
                    ? ['corporate_restructuring']
                    : []),
                  ...(data.mergersAcquisitions ? ['mergers_acquisitions'] : []),
                ],
            accountingSoftware: data.accountingSoftware || [],
            taxSoftware: data.taxSoftware || [],
            practiceManagementSoftware: data.practiceManagementSoftware || '',
            clientPortalAccess: data.offersPortalAccess || false,
            digitalDocumentSigning: data.acceptsDigitalDocuments || false,
            endToEndEncryption: data.usesEncryption || false,
            twoFactorAuthentication: data.twoFactorAuth || false,
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
            caCertificateFile: uploadedFiles.caCertificate
              ? {
                  originalName: uploadedFiles.caCertificate.name || '',
                  fileName: uploadedFiles.caCertificate.name || '',
                  filePath: '',
                  fileUrl: '',
                  mimeType: uploadedFiles.caCertificate.type || '',
                  size: uploadedFiles.caCertificate.size || 0,
                  uploadedAt: new Date(),
                }
              : undefined,
            professionalHeadshotFile: uploadedFiles.professionalHeadshot
              ? {
                  originalName: uploadedFiles.professionalHeadshot.name || '',
                  fileName: uploadedFiles.professionalHeadshot.name || '',
                  filePath: '',
                  fileUrl: '',
                  mimeType: uploadedFiles.professionalHeadshot.type || '',
                  size: uploadedFiles.professionalHeadshot.size || 0,
                  uploadedAt: new Date(),
                }
              : undefined,
            firmLogoFile: uploadedFiles.firmLogo
              ? {
                  originalName: uploadedFiles.firmLogo.name || '',
                  fileName: uploadedFiles.firmLogo.name || '',
                  filePath: '',
                  fileUrl: '',
                  mimeType: uploadedFiles.firmLogo.type || '',
                  size: uploadedFiles.firmLogo.size || 0,
                  uploadedAt: new Date(),
                }
              : undefined,
            professionalReferences: data.professionalReferences || [],
            authorizeTaxVaultVerification: data.authorizeVerification || false,
            consentBackgroundCheck: data.backgroundCheckConsent || false,
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
            agreedTermsAndConditions: !!data.agreeToTerms,
            agreedPrivacyPolicy: !!data.agreeToPrivacy,
            agreedProfessionalTerms: !!data.agreedProfessionalTerms,
            confirmAccuracy: !!data.confirmAccuracy,
          },
        };

      default:
        return {};
    }
  };

  const getValidationData = (step = currentStep) => {
    if (step !== 7) return formData;

    return {
      ...formData,
      caCertificateFile:
        uploadedFiles?.caCertificate || formData?.caCertificate || null,
      professionalHeadshotFile:
        uploadedFiles?.professionalHeadshot ||
        formData?.professionalHeadshot ||
        null,
      firmLogoFile: uploadedFiles?.firmLogo || formData?.firmLogo || null,
      authorizeCredentialCheck:
        !!formData?.authorizeVerification ||
        !!formData?.authorizeCredentialCheck,
      backgroundCheckConsent: !!formData?.backgroundCheckConsent,
      professionalReferences: Array.isArray(formData?.professionalReferences)
        ? formData.professionalReferences
        : [],
    };
  };

  const getSubmitValidationData = () => {
    return {
      ...formData,
      agreedTermsAndConditions:
        !!formData.agreeToTerms || !!formData.agreedTermsAndConditions,
      agreedPrivacyPolicy:
        !!formData.agreeToPrivacy || !!formData.agreedPrivacyPolicy,
      agreedProfessionalTerms: !!formData.agreedProfessionalTerms,
      confirmAccuracy: !!formData.confirmAccuracy,
    };
  };

  const handleNext = async () => {
    const validationData = getValidationData(currentStep);
    const rawStepErrors = validateStep(currentStep, validationData);

    const mappedStepErrors = { ...rawStepErrors };

    if (mappedStepErrors.caCertificateFile) {
      mappedStepErrors.caCertificate = mappedStepErrors.caCertificateFile;
    }

    if (mappedStepErrors.authorizeCredentialCheck) {
      mappedStepErrors.authorizeVerification =
        mappedStepErrors.authorizeCredentialCheck;
    }

    if (Object.keys(rawStepErrors).length > 0) {
      setErrors(mappedStepErrors);
      setFormError('Please fix the errors before continuing.');
      return;
    }

    setErrors({});
    setFormError('');

    try {
      setSaving(true);
      saveLocalDraft(formData);
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Failed to continue:', error);
      setFormError('Failed to continue. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePrevious = () => {
    saveLocalDraft(formData);
    setCurrentStep((prev) => prev - 1);
    setFormError('');
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationData = getSubmitValidationData();
    const rawStepErrors = validateStep(8, validationData);

    const mappedStepErrors = { ...rawStepErrors };

    if (mappedStepErrors.agreedTermsAndConditions) {
      mappedStepErrors.agreeToTerms =
        mappedStepErrors.agreedTermsAndConditions;
    }

    if (mappedStepErrors.agreedPrivacyPolicy) {
      mappedStepErrors.agreeToPrivacy =
        mappedStepErrors.agreedPrivacyPolicy;
    }

    if (Object.keys(rawStepErrors).length > 0) {
      setErrors(mappedStepErrors);
      setFormError('Please fix the errors before submitting.');
      return;
    }

    setErrors({});
    setFormError('');
    setLoading(true);

    try {
      const cleanPhone = (formData.phone || '').replace(/\D/g, '');

      const registrationPayload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        role: 'ca',
        userType: 'professional',
        phoneNumber: cleanPhone,
        province: formData.province || formData.provinceOfRegistration || 'ON',
        firmName: formData.firmName || '',
        caNumber: formData.caNumber || '',
      };

      const registrationResult = await register(registrationPayload);

      if (!registrationResult?.success) {
        throw new Error(
          registrationResult?.error ||
            'Unable to create account before submission'
        );
      }

      let attempts = 0;
      while (!localStorage.getItem('token') && attempts < 15) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not set after registration');
      }

      const stepPayloads = [
        buildStepPayload(1, formData),
        buildStepPayload(2, formData),
        buildStepPayload(3, formData),
        buildStepPayload(4, formData),
        buildStepPayload(5, formData),
        buildStepPayload(6, formData),
        buildStepPayload(7, formData),
      ];

      for (let i = 0; i < stepPayloads.length; i++) {
        try {
          await caRegistrationAPI.saveDraft(stepPayloads[i]);
        } catch (err) {
          console.error(`STEP ${i + 1} FAILED`, err?.response?.data || err);
          throw err;
        }
      }

      const finalPayload = buildStepPayload(8, formData);
      await caRegistrationAPI.submit(finalPayload);

      localStorage.removeItem(LOCAL_DRAFT_KEY);
      navigate('/ca/verification-pending');
    } catch (error) {
      console.error('Registration failed:', error?.response?.data || error);
      setFormError(
        error?.response?.data?.message ||
          error?.message ||
          'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AccountDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />
        );

      case 2:
        return (
          <ProfessionalDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleArrayChange={handleArrayChange}
          />
        );

      case 3:
        return (
          <FirmDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />
        );

      case 4:
        return (
          <CredentialsDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleFileUpload={handleFileUpload}
            uploadedFiles={uploadedFiles}
          />
        );

      case 5:
        return (
          <PracticeDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleArrayChange={handleArrayChange}
          />
        );

      case 6:
        return (
          <SpecialtiesDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleArrayChange={handleArrayChange}
          />
        );

      case 7:
        return (
          <VerificationDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleFileUpload={handleFileUpload}
            uploadedFiles={uploadedFiles}
          />
        );

      case 8:
        return (
          <ReviewDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary-600">TaxVault</h1>
          </Link>
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">
            CA Registration
          </h2>
          <p className="text-gray-600 mt-2">
            Join as a Chartered Accountant and grow your practice
          </p>
        </div>

        <VerificationNotice />
        <ProgressSteps currentStep={currentStep} />

        <Card className="shadow-xl">
          <Card.Body className="p-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <ErrorAlert message={formError} />
              {renderStep()}

              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 8 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={saving}
                    className="ml-auto px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Next'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                )}
              </div>
            </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default RegisterCA;