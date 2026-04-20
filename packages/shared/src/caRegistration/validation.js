import {
  currentYear,
  isStrongPassword,
  isValidCanadianPostalCode,
  isValidEmail,
  isValidPhone,
  safeArray
} from './helpers';

const addError = (errors, key, message) => {
  errors[key] = message;
};

export const validateCAAccountStep = (form) => {
  const errors = {};

  if (!String(form.firstName || '').trim()) addError(errors, 'firstName', 'First name is required');
  if (!String(form.lastName || '').trim()) addError(errors, 'lastName', 'Last name is required');

  if (!String(form.email || '').trim()) {
    addError(errors, 'email', 'Email is required');
  } else if (!isValidEmail(form.email)) {
    addError(errors, 'email', 'Enter a valid email address');
  }

  if (!String(form.password || '')) {
    addError(errors, 'password', 'Password is required');
  } else if (!isStrongPassword(form.password)) {
    addError(
      errors,
      'password',
      'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
    );
  }

  if (!String(form.confirmPassword || '')) {
    addError(errors, 'confirmPassword', 'Please confirm your password');
  } else if (form.password !== form.confirmPassword) {
    addError(errors, 'confirmPassword', 'Passwords do not match');
  }

  const phoneValue = form.phone || form.primaryPhone || '';

  if (!String(phoneValue).trim()) {
    addError(errors, 'phone', 'Phone number is required');
  } else if (!isValidPhone(phoneValue)) {
    addError(errors, 'phone', 'Enter a valid 10-digit phone number');
  }

  if (String(form.alternatePhone || '').trim() && !isValidPhone(form.alternatePhone)) {
    addError(errors, 'alternatePhone', 'Enter a valid 10-digit alternate phone number');
  }

  return errors;
};

export const validateCAProfessionalStep = (form) => {
  const errors = {};

  if (!String(form.caDesignation || '').trim()) {
    addError(errors, 'caDesignation', 'Designation is required');
  }

  if (!String(form.caNumber || '').trim()) {
    addError(errors, 'caNumber', 'CA number is required');
  }

  if (!String(form.provinceOfRegistration || '').trim()) {
    addError(errors, 'provinceOfRegistration', 'Province of registration is required');
  }

  const yearAdmitted = String(form.yearAdmitted || '').trim();

  if (!yearAdmitted) {
    addError(errors, 'yearAdmitted', 'Year admitted is required');
  } else if (!/^\d{4}$/.test(yearAdmitted)) {
    addError(errors, 'yearAdmitted', 'Year admitted must be exactly 4 digits');
  } else {
    const year = Number(yearAdmitted);
    if (year < 1950 || year > currentYear) {
      addError(errors, 'yearAdmitted', `Enter a valid year between 1950 and ${currentYear}`);
    }
  }

  if (!String(form.firmName || '').trim()) {
    addError(errors, 'firmName', 'Firm name is required');
  }

  if (safeArray(form.languages).includes('Other') && !String(form.otherLanguage || '').trim()) {
    addError(errors, 'otherLanguage', 'Please enter the other language');
  }

  return errors;
};

export const validateCAFirmStep = (form) => {
  const errors = {};

  if (!String(form.firmAddress || '').trim()) addError(errors, 'firmAddress', 'Firm address is required');
  if (!String(form.city || '').trim()) addError(errors, 'city', 'City is required');
  if (!String(form.province || '').trim()) addError(errors, 'province', 'Province is required');

  if (!String(form.firmPostalCode || '').trim()) {
    addError(errors, 'firmPostalCode', 'Postal code is required');
  } else if (!isValidCanadianPostalCode(form.firmPostalCode)) {
    addError(errors, 'firmPostalCode', 'Enter a valid Canadian postal code');
  }

  if (String(form.firmPhone || '').trim() && !isValidPhone(form.firmPhone)) {
    addError(errors, 'firmPhone', 'Enter a valid 10-digit firm phone number');
  }

  if (String(form.firmEmail || '').trim() && !isValidEmail(form.firmEmail)) {
    addError(errors, 'firmEmail', 'Enter a valid firm email address');
  }

  return errors;
};

export const validateCACredentialsStep = (form) => {
  const errors = {};

  if (form.professionalLiabilityInsurance) {
    if (!String(form.insuranceProvider || '').trim()) {
      addError(errors, 'insuranceProvider', 'Insurance provider is required');
    }

    if (!String(form.policyNumber || '').trim()) {
      addError(errors, 'policyNumber', 'Policy number is required');
    }
  }

  if (form.peerReviewCompleted && !String(form.peerReviewDate || '').trim()) {
    addError(errors, 'peerReviewDate', 'Peer review date is required');
  }

  return errors;
};

export const validateCAPracticeStep = (form) => {
  const errors = {};

  if (!String(form.practiceType || '').trim()) {
    addError(errors, 'practiceType', 'Practice type is required');
  }

  return errors;
};

export const validateCASpecialtiesStep = () => ({});

export const validateCAVerificationStep = (form) => {
  const errors = {};

  if (!form.caCertificateFile) {
    addError(errors, 'caCertificateFile', 'CA certificate is required');
  }

  if (!form.authorizeCredentialCheck) {
    addError(errors, 'authorizeCredentialCheck', 'Authorization is required');
  }

  return errors;
};

export const validateCAReviewStep = (form) => {
  const errors = {};

  if (!form.agreedTermsAndConditions) {
    addError(errors, 'agreedTermsAndConditions', 'You must agree to the terms and conditions');
  }

  if (!form.agreedPrivacyPolicy) {
    addError(errors, 'agreedPrivacyPolicy', 'You must agree to the privacy policy');
  }

  if (!form.agreedProfessionalTerms) {
    addError(errors, 'agreedProfessionalTerms', 'You must agree to the professional terms');
  }

  if (!form.confirmAccuracy) {
    addError(errors, 'confirmAccuracy', 'You must confirm accuracy');
  }

  return errors;
};

export const validateCAStep = (step, form) => {
  switch (step) {
    case 1:
    case 'account':
      return validateCAAccountStep(form);
    case 2:
    case 'professional':
      return validateCAProfessionalStep(form);
    case 3:
    case 'firm':
      return validateCAFirmStep(form);
    case 4:
    case 'credentials':
      return validateCACredentialsStep(form);
    case 5:
    case 'practice':
      return validateCAPracticeStep(form);
    case 6:
    case 'specialties':
      return validateCASpecialtiesStep(form);
    case 7:
    case 'verification':
      return validateCAVerificationStep(form);
    case 8:
    case 'review':
      return validateCAReviewStep(form);
    default:
      return {};
  }
};

export const hasStepErrors = (errors) => Object.keys(errors).length > 0;