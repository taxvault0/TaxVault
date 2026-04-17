const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PHONE_REGEX = /^(1)?\d{10}$/;
const CA_NUMBER_REGEX = /^[A-Z0-9-]{5,15}$/;
const POLICY_NUMBER_REGEX = /^[A-Za-z0-9/-]{6,20}$/;
const POSTAL_CODE_REGEX = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i;

const PROVINCE_CODES = [
  'AB',
  'BC',
  'MB',
  'NB',
  'NL',
  'NS',
  'NT',
  'NU',
  'ON',
  'PE',
  'QC',
  'SK',
  'YT',
];

const normalizeString = (value = '') => String(value ?? '').trim();

const normalizeUpper = (value = '') => normalizeString(value).toUpperCase();

const normalizePhone = (value = '') => String(value ?? '').replace(/\D/g, '');

const normalizePostalCode = (value = '') => {
  const cleaned = normalizeUpper(value).replace(/[^A-Z0-9]/g, '').slice(0, 6);
  if (!cleaned) return '';
  if (cleaned.length <= 3) return cleaned;
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
};

const normalizeNumber = (value, fallback = null) => {
  if (value === '' || value === null || value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeArray = (value) => (Array.isArray(value) ? value : []);

const isValidEmail = (value = '') => !value || EMAIL_REGEX.test(normalizeString(value));

const isValidPhone = (value = '') => !value || PHONE_REGEX.test(normalizePhone(value));

const isValidProvince = (value = '') => !value || PROVINCE_CODES.includes(normalizeUpper(value));

const isValidPostalCode = (value = '') =>
  !value || POSTAL_CODE_REGEX.test(normalizePostalCode(value));

const isValidCANumber = (value = '') =>
  !value || CA_NUMBER_REGEX.test(normalizeUpper(value));

const isValidPolicyNumber = (value = '') =>
  !value || POLICY_NUMBER_REGEX.test(normalizeString(value));

const isValidYear = (value, { min = 1900, max = new Date().getFullYear() } = {}) => {
  if (value === null || value === undefined || value === '') return true;
  const str = String(value);
  if (!/^\d{4}$/.test(str)) return false;
  const year = Number(str);
  return year >= min && year <= max;
};

const validateExperience = (yearAdmitted, yearsOfExperience) => {
  if (
    yearAdmitted === null ||
    yearAdmitted === undefined ||
    yearAdmitted === '' ||
    yearsOfExperience === null ||
    yearsOfExperience === undefined ||
    yearsOfExperience === ''
  ) {
    return true;
  }

  const currentYear = new Date().getFullYear();
  return Number(yearsOfExperience) <= currentYear - Number(yearAdmitted);
};

const validateStep1 = (form) => {
  const errors = {};

  if (!normalizeString(form.firstName)) {
    errors.firstName = 'First name is required';
  }

  if (!normalizeString(form.lastName)) {
    errors.lastName = 'Last name is required';
  }

  if (!normalizeString(form.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(form.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!normalizePhone(form.primaryPhone)) {
    errors.primaryPhone = 'Phone number is required';
  } else if (!isValidPhone(form.primaryPhone)) {
    errors.primaryPhone = 'Enter a valid 10-digit phone number';
  }

  if (normalizePhone(form.alternatePhone) && !isValidPhone(form.alternatePhone)) {
    errors.alternatePhone = 'Enter a valid 10-digit phone number';
  }

  if (!normalizeString(form.password)) {
    errors.password = 'Password is required';
  } else if (String(form.password).length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (!normalizeString(form.confirmPassword)) {
    errors.confirmPassword = 'Confirm your password';
  } else if (String(form.password) !== String(form.confirmPassword)) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

const validateStep2 = (form) => {
  const errors = {};
  const currentYear = new Date().getFullYear();

  if (!normalizeString(form.caDesignation)) {
    errors.caDesignation = 'Select a designation';
  }

  if (!normalizeString(form.caNumber)) {
    errors.caNumber = 'CA number is required';
  } else if (!isValidCANumber(form.caNumber)) {
    errors.caNumber =
      'CA number must be 5 to 15 characters and only allow letters, numbers, and hyphen';
  }

  if (!normalizeString(form.provinceOfRegistration)) {
    errors.provinceOfRegistration = 'Select province of registration';
  } else if (!isValidProvince(form.provinceOfRegistration)) {
    errors.provinceOfRegistration = 'Select a valid province';
  }

  if (!normalizeString(form.yearAdmitted)) {
    errors.yearAdmitted = 'Year admitted is required';
  } else if (!isValidYear(form.yearAdmitted, { min: 1950, max: currentYear })) {
    errors.yearAdmitted = `Year must be between 1950 and ${currentYear}`;
  }

  const yearsOfExperience = normalizeNumber(form.yearsOfExperience, null);

  if (yearsOfExperience === null && normalizeString(form.yearsOfExperience)) {
    errors.yearsOfExperience = 'Enter valid years of experience';
  } else if (yearsOfExperience !== null && yearsOfExperience < 0) {
    errors.yearsOfExperience = 'Years of experience cannot be negative';
  } else if (!validateExperience(form.yearAdmitted, yearsOfExperience)) {
    errors.yearsOfExperience = 'Years of experience cannot be more than years since admitted';
  }

  if (!normalizeString(form.firmName)) {
    errors.firmName = 'Firm name is required';
  }

  const languages = normalizeArray(form.languagesSpoken).map((item) =>
    String(item).trim().toLowerCase()
  );

  if (languages.includes('other') && !normalizeString(form.otherLanguage)) {
    errors.otherLanguage = 'Please enter the other language';
  }

  return errors;
};

const validateStep3 = (form) => {
  const errors = {};
  const currentYear = new Date().getFullYear();

  if (!normalizeString(form.firmAddress)) {
    errors.firmAddress = 'Firm address is required';
  }

  if (!normalizeString(form.city)) {
    errors.city = 'City is required';
  }

  if (!normalizeString(form.province)) {
    errors.province = 'Province is required';
  } else if (!isValidProvince(form.province)) {
    errors.province = 'Select a valid province';
  }

  if (!normalizeString(form.firmPostalCode)) {
    errors.firmPostalCode = 'Postal code is required';
  } else if (!isValidPostalCode(form.firmPostalCode)) {
    errors.firmPostalCode = 'Enter postal code in format A1A 1A1';
  }

  if (!normalizePhone(form.firmPhone)) {
    errors.firmPhone = 'Firm phone is required';
  } else if (!isValidPhone(form.firmPhone)) {
    errors.firmPhone = 'Enter a valid 10-digit phone number';
  }

  if (!normalizeString(form.firmEmail)) {
    errors.firmEmail = 'Firm email is required';
  } else if (!isValidEmail(form.firmEmail)) {
    errors.firmEmail = 'Enter a valid firm email';
  }

  if (
    normalizeString(form.yearEstablished) &&
    !isValidYear(form.yearEstablished, { min: 1900, max: currentYear })
  ) {
    errors.yearEstablished = 'Year established must be a valid 4-digit year';
  }

  ['numberOfPartners', 'numberOfStaff'].forEach((field) => {
    const value = normalizeNumber(form[field], null);
    if (value !== null && value < 0) {
      errors[field] = 'Value cannot be negative';
    }
  });

  return errors;
};

const validateStep4 = (form) => {
  const errors = {};

  if (normalizeString(form.policyNumber) && !isValidPolicyNumber(form.policyNumber)) {
    errors.policyNumber =
      'Policy number must be 6 to 20 characters and only allow letters, numbers, slash, and hyphen';
  }

  if (normalizeString(form.coverageAmount)) {
    const coverageAmount = normalizeNumber(form.coverageAmount, null);
    if (coverageAmount === null || coverageAmount < 0) {
      errors.coverageAmount = 'Enter a valid coverage amount';
    }
  }

  if (form.peerReviewed && !normalizeString(form.lastPeerReviewDate)) {
    errors.lastPeerReviewDate = 'Peer review date is required';
  }

  if (form.disciplinaryHistory && !normalizeString(form.disciplinaryDetails)) {
    errors.disciplinaryDetails = 'Please provide disciplinary details';
  }

  return errors;
};

const validateStep5 = (form) => {
  const errors = {};

  if (!normalizeString(form.practiceType)) {
    errors.practiceType = 'Practice type is required';
  }

  if (normalizeArray(form.servicesOffered).length === 0) {
    errors.servicesOffered = 'Select at least one service offered';
  }

  if (normalizeArray(form.clientTypes).length === 0) {
    errors.clientTypes = 'Select at least one client type';
  }

  ['averageClientsPerYear', 'minimumFee', 'maximumFee', 'serviceRadius'].forEach((field) => {
    if (normalizeString(form[field])) {
      const value = normalizeNumber(form[field], null);
      if (value === null || value < 0) {
        errors[field] = 'Enter a valid non-negative number';
      }
    }
  });

  const minimumFee = normalizeNumber(form.minimumFee, null);
  const maximumFee = normalizeNumber(form.maximumFee, null);

  if (minimumFee !== null && maximumFee !== null && maximumFee < minimumFee) {
    errors.maximumFee = 'Maximum fee cannot be less than minimum fee';
  }

  return errors;
};

const validateStep6 = (form) => {
  const errors = {};

  const hasAnySelection =
    normalizeArray(form.taxServices).length ||
    normalizeArray(form.businessServices).length ||
    normalizeArray(form.bookkeepingServices).length ||
    normalizeArray(form.advisoryServices).length ||
    normalizeArray(form.softwareSkills).length ||
    normalizeArray(form.certifications).length ||
    normalizeArray(form.nicheExpertise).length;

  if (!hasAnySelection) {
    errors.specialties =
      'Select at least one specialty, software skill, certification, or niche expertise';
  }

  return errors;
};

const validateStep7 = (form) => {
  const errors = {};

  if (!form.caCertificate) {
    errors.caCertificate = 'CA certificate is required';
  }

  if (!form.authorizeVerification) {
    errors.authorizeVerification = 'You must authorize credential verification';
  }

  return errors;
};

export const validateRegisterCAStep = ({ currentStep, form }) => {
  let errors = {};

  switch (currentStep) {
    case 1:
      errors = validateStep1(form);
      break;
    case 2:
      errors = validateStep2(form);
      break;
    case 3:
      errors = validateStep3(form);
      break;
    case 4:
      errors = validateStep4(form);
      break;
    case 5:
      errors = validateStep5(form);
      break;
    case 6:
      errors = validateStep6(form);
      break;
    case 7:
    case 8:
      errors = validateStep7(form);
      break;
    default:
      errors = {};
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateFullCAForm = (form) => {
  const errors = {
    ...validateStep1(form),
    ...validateStep2(form),
    ...validateStep3(form),
    ...validateStep4(form),
    ...validateStep5(form),
    ...validateStep6(form),
    ...validateStep7(form),
  };

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};