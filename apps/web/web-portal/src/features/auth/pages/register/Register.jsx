import React, { useMemo, useState } from 'react';
import { onboardingAPI } from '../../../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import {
  initialValues,
  validateStep,
  stepConfig,
  formatPhoneNumber,
  formatPostalCode,
  PROVINCE_CODES,
} from './modules';

import {
  AccountDetails,
  PersonalDetails,
  TaxDetails,
  IncomeDetails,
  DeductionsDetails,
  ReviewDetails,
} from './registration';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStepMeta = useMemo(
    () => stepConfig.find((item) => item.step === currentStep),
    [currentStep]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let nextValue = type === 'checkbox' ? checked : value;

    if (name === 'phone' || name === 'spousePhone') {
      nextValue = formatPhoneNumber(value);
    }

    if (name === 'postalCode') {
      nextValue = formatPostalCode(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleProfileToggle = (groupName, key) => {
    setFormData((prev) => {
      const updatedGroup = {
        ...prev[groupName],
        [key]: !prev[groupName][key],
      };

      if (key === 'unemployed' && !prev[groupName][key]) {
        Object.keys(updatedGroup).forEach((itemKey) => {
          updatedGroup[itemKey] = itemKey === 'unemployed';
        });
      }

      if (key !== 'unemployed' && !prev[groupName][key]) {
        updatedGroup.unemployed = false;
      }

      return {
        ...prev,
        [groupName]: updatedGroup,
      };
    });

    setErrors((prev) => ({
      ...prev,
      [groupName]: '',
    }));
  };

  const goNext = () => {
    const validationErrors = validateStep(currentStep, formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setCurrentStep((prev) => Math.min(prev + 1, stepConfig.length));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateStep(6, formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setIsSubmitting(true);

      const registerPayload = {
        name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
        email: (formData.email || '').trim().toLowerCase(),
        password: formData.password || '',
        role: 'user',
        userType: formData.userType || 'gig-worker',
        phoneNumber: formData.phone ? formData.phone.replace(/\D/g, '') : '',
        province:
          formData.province && PROVINCE_CODES[formData.province]
            ? PROVINCE_CODES[formData.province]
            : 'ON',
        businessNumber: formData.businessNumber || '',
        provincialTaxRegistered: !!formData.provincialTaxRegistered,
        provincialTaxNumber: formData.provincialTaxNumber || '',
        filingFrequency: formData.filingFrequency || '',
        taxRegistrationDate: formData.taxRegistrationDate || '',
        exceededProvincialThreshold: !!formData.exceededProvincialThreshold,
      };

      const result = await register(registerPayload);

      if (!result?.success || !result?.user) {
        throw new Error(result?.error || 'Registration failed');
      }

      const onboardingPayload = {
        employmentProfiles: Object.keys(formData.primaryProfile || {}).filter(
          (key) => formData.primaryProfile[key]
        ),
        familyStatus: formData.familyStatus || '',
        numberOfDependents: Number(formData.numberOfDependents || 0),
        spouse: {
          name: formData.spouseName || '',
          dob: formData.spouseDob || '',
          sin: formData.spouseSin || '',
          phone: formData.spousePhone
            ? formData.spousePhone.replace(/\D/g, '')
            : '',
          gigPlatforms: formData.spouseGigPlatforms || [],
          additionalIncomeSources: formData.spouseAdditionalIncomeSources || [],
        },
        incomeDetails: {
          employerName: formData.employerName || '',
          t4Income: formData.t4Income || '',
          gigPlatforms: formData.gigPlatforms || [],
          gigPlatformOther: formData.gigPlatformOther || '',
          gigIncome: formData.gigIncome || '',
          selfEmploymentIncome: formData.selfEmploymentIncome || '',
          businessIncome: formData.businessIncome || '',
          additionalIncomeSources: formData.additionalIncomeSources || [],
        },
        deductions: formData.deductions || {},
        receiptTypes: formData.receiptTypes || {},
        vehiclePurchasedForWork: !!formData.vehiclePurchasedForWork,
        vehicles: Array.isArray(formData.vehicles) ? formData.vehicles : [],
        agreeToTerms: !!formData.agreeToTerms,
        agreeToPrivacy: !!formData.agreeToPrivacy,
        confirmAccuracy: !!formData.confirmAccuracy,
      };

      await onboardingAPI.save(onboardingPayload);

      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);

      const backendData = error.response?.data;

      const errorMessage =
        backendData?.errors?.[0]?.message ||
        backendData?.message ||
        error.message ||
        'Something went wrong.';

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
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
          />
        );
      case 2:
        return (
          <PersonalDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            setFormData={setFormData}
          />
        );
      case 3:
        return (
          <TaxDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleProfileToggle={handleProfileToggle}
          />
        );
      case 4:
        return (
          <IncomeDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            setFormData={setFormData}
          />
        );
      case 5:
        return (
          <DeductionsDetails
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            handleChange={handleChange}
          />
        );
      case 6:
        return (
          <ReviewDetails
            formData={formData}
            errors={errors}
            setFormData={setFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-900 px-6 py-8 text-white md:px-8">
            <h1 className="text-2xl font-semibold md:text-3xl">
              Create Your Account
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Step {currentStep} of {stepConfig.length}
            </p>
          </div>

          <div className="border-b border-slate-200 bg-white px-4 py-5 md:px-8">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
              {stepConfig.map((step) => {
                const isActive = currentStep === step.step;
                const isCompleted = currentStep > step.step;

                return (
                  <div
                    key={step.step}
                    className="flex flex-col items-center text-center"
                  >
                    <div
                      className={[
                        'flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-colors duration-200',
                        isCompleted
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : isActive
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 bg-slate-100 text-slate-600',
                      ].join(' ')}
                    >
                      {step.step}
                    </div>

                    <span
                      className={[
                        'mt-2 text-xs font-medium md:text-sm',
                        isActive ? 'text-slate-900' : 'text-slate-500',
                      ].join(' ')}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-4 py-6 md:px-8 md:py-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                {currentStepMeta?.title}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Complete the required details for this section.
              </p>
            </div>

            <div>{renderStep()}</div>

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Back
                  </button>
                )}
              </div>

              <div>
                {currentStep < stepConfig.length ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 sm:w-auto"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;