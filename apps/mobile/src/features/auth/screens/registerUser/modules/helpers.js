import { errorMessages, REGEX } from './constants';

export const safeTrim = (value = '') => String(value || '').trim();

export const normalizePhoneNumber = (phone = '') => {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) {
    return digits;
  }
  return digits;
};

export const normalizeProvince = (province = '') =>
  String(province || '').trim().toUpperCase();

export const buildFullName = (firstName = '', lastName = '') =>
  [safeTrim(firstName), safeTrim(lastName)].filter(Boolean).join(' ').trim();

export const sanitizeArray = (value) =>
  Array.isArray(value)
    ? value.map((item) => safeTrim(item)).filter(Boolean)
    : [];

export const isMarriedLike = (familyStatus = '') =>
  ['Married', 'Common Law'].includes(safeTrim(familyStatus));

export const isValidEmail = (email = '') => REGEX.email.test(safeTrim(email));

export const isValidPhone = (phone = '') =>
  REGEX.phone.test(normalizePhoneNumber(phone));

export const isValidPassword = (password = '') =>
  REGEX.password.test(String(password || ''));

export const getAccountStepErrors = (values = {}) => {
  const errors = {};

  if (!safeTrim(values.firstName)) {
    errors.firstName = errorMessages.required;
  }

  if (!safeTrim(values.lastName)) {
    errors.lastName = errorMessages.required;
  }

  if (!safeTrim(values.email)) {
    errors.email = errorMessages.required;
  } else if (!isValidEmail(values.email)) {
    errors.email = errorMessages.invalidEmail;
  }

  if (!safeTrim(values.phone)) {
    errors.phone = errorMessages.required;
  } else if (!isValidPhone(values.phone)) {
    errors.phone = errorMessages.invalidPhone;
  }

  if (!safeTrim(values.password)) {
    errors.password = errorMessages.required;
  } else if (!isValidPassword(values.password)) {
    errors.password = errorMessages.invalidPassword;
  }

  if (!safeTrim(values.confirmPassword)) {
    errors.confirmPassword = errorMessages.required;
  } else if (String(values.confirmPassword) !== String(values.password)) {
    errors.confirmPassword = errorMessages.passwordMismatch;
  }

  return errors;
};

export const getProfileStepErrors = (values = {}) => {
  const errors = {};

  if (!safeTrim(values.province)) {
    errors.province = errorMessages.required;
  }

  if (!safeTrim(values.userType)) {
    errors.userType = errorMessages.required;
  }

  return errors;
};

export const getFamilyStepErrors = (values = {}) => {
  const errors = {};

  if (!safeTrim(values.familyStatus)) {
    errors.familyStatus = errorMessages.required;
  }

  if (isMarriedLike(values.familyStatus) && !safeTrim(values.spouseName)) {
    errors.spouseName = errorMessages.required;
  }

  if (
    safeTrim(values.numberOfDependents) &&
    Number.isNaN(Number(values.numberOfDependents))
  ) {
    errors.numberOfDependents = 'Enter a valid number';
  }

  return errors;
};

export const getIncomeStepErrors = () => ({});

export const getVehicleStepErrors = (values = {}) => {
  const errors = {};

  if (values.vehicleOwned && sanitizeArray(values.vehicleUse).length === 0) {
    errors.vehicleUse = 'Select at least one vehicle use';
  }

  return errors;
};

export const getDeductionsStepErrors = () => ({});

export const getReviewStepErrors = (values = {}) => {
  const errors = {};

  if (!values.agreeToTerms) {
    errors.agreeToTerms = errorMessages.termsRequired;
  }

  if (!values.agreeToPrivacy) {
    errors.agreeToPrivacy = errorMessages.privacyRequired;
  }

  if (!values.confirmAccuracy) {
    errors.confirmAccuracy = errorMessages.accuracyRequired;
  }

  return errors;
};

export const getRegisterUserStepErrors = (stepKey, values = {}) => {
  switch (stepKey) {
    case 'account':
      return getAccountStepErrors(values);
    case 'profile':
      return getProfileStepErrors(values);
    case 'family':
      return getFamilyStepErrors(values);
    case 'income':
      return getIncomeStepErrors(values);
    case 'vehicle':
      return getVehicleStepErrors(values);
    case 'deductions':
      return getDeductionsStepErrors(values);
    case 'review':
      return getReviewStepErrors(values);
    default:
      return {};
  }
};

export const isRegisterUserStepValid = (stepKey, values = {}) =>
  Object.keys(getRegisterUserStepErrors(stepKey, values)).length === 0;

export const buildRegisterUserPayload = (values = {}) => ({
  name: buildFullName(values.firstName, values.lastName),
  email: safeTrim(values.email).toLowerCase(),
  password: String(values.password || ''),
  role: 'user',
  userType: safeTrim(values.userType) || 'gig-worker',
  phoneNumber: normalizePhoneNumber(values.phone),
  province: normalizeProvince(values.province) || 'ON',
  profile: {
    profileNotes: safeTrim(values.profileNotes),
    familyStatus: safeTrim(values.familyStatus),
    spouseName: isMarriedLike(values.familyStatus)
      ? safeTrim(values.spouseName)
      : '',
    numberOfDependents: values.numberOfDependents
      ? Number(values.numberOfDependents)
      : 0,
    gigPlatforms: sanitizeArray(values.gigPlatforms),
    additionalIncomeSources: sanitizeArray(values.additionalIncomeSources),
    vehicleOwned: !!values.vehicleOwned,
    vehicleUse: values.vehicleOwned ? sanitizeArray(values.vehicleUse) : [],
    deductions: sanitizeArray(values.deductions),
    receiptTypes: sanitizeArray(values.receiptTypes),
    agreeToTerms: !!values.agreeToTerms,
    agreeToPrivacy: !!values.agreeToPrivacy,
    confirmAccuracy: !!values.confirmAccuracy,
  },
});

export const buildRegisterUserApiPayload = (values = {}) => {
  const payload = buildRegisterUserPayload(values);

  return {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: payload.role,
    userType: payload.userType,
    phoneNumber: payload.phoneNumber,
    province: payload.province,
  };
};

export const buildUserOnboardingPayload = (values = {}) => ({
  personalDetails: {
    maritalStatus: safeTrim(values.familyStatus),
    spouseName: isMarriedLike(values.familyStatus)
      ? safeTrim(values.spouseName)
      : '',
    numberOfDependents: values.numberOfDependents
      ? Number(values.numberOfDependents)
      : 0,
    province: normalizeProvince(values.province) || 'ON',
  },
  workDetails: {
    userType: safeTrim(values.userType) || 'gig-worker',
    gigPlatforms: sanitizeArray(values.gigPlatforms),
    additionalIncomeSources: sanitizeArray(values.additionalIncomeSources),
    profileNotes: safeTrim(values.profileNotes),
  },
  vehicleDetails: {
    vehicleOwned: !!values.vehicleOwned,
    vehicleUse: values.vehicleOwned ? sanitizeArray(values.vehicleUse) : [],
  },
  deductions: sanitizeArray(values.deductions),
  receiptTypes: sanitizeArray(values.receiptTypes),
  consents: {
    agreeToTerms: !!values.agreeToTerms,
    agreeToPrivacy: !!values.agreeToPrivacy,
    confirmAccuracy: !!values.confirmAccuracy,
  },
});

export const mapRegisterUserDraftToForm = (data = {}) => ({
  firstName: data.firstName || '',
  lastName: data.lastName || '',
  email: data.email || '',
  password: '',
  confirmPassword: '',
  phone: data.phone || data.phoneNumber || '',
  province: data.province || 'ON',
  userType: data.userType || 'gig-worker',
  profileNotes: data.profileNotes || '',
  familyStatus: data.familyStatus || 'Single',
  spouseName: data.spouseName || '',
  numberOfDependents:
    data.numberOfDependents !== undefined && data.numberOfDependents !== null
      ? String(data.numberOfDependents)
      : '',
  gigPlatforms: Array.isArray(data.gigPlatforms) ? data.gigPlatforms : [],
  additionalIncomeSources: Array.isArray(data.additionalIncomeSources)
    ? data.additionalIncomeSources
    : [],
  vehicleOwned: !!data.vehicleOwned,
  vehicleUse: Array.isArray(data.vehicleUse) ? data.vehicleUse : [],
  deductions: Array.isArray(data.deductions) ? data.deductions : [],
  receiptTypes: Array.isArray(data.receiptTypes) ? data.receiptTypes : [],
  agreeToTerms: !!data.agreeToTerms,
  agreeToPrivacy: !!data.agreeToPrivacy,
  confirmAccuracy: !!data.confirmAccuracy,
});