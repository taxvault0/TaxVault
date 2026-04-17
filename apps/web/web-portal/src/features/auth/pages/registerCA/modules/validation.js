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

const isStrongPassword = (value = '') =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(String(value));

const isValidEmail = (value = '') => !value || EMAIL_REGEX.test(normalizeString(value));
const isValidPhone = (value = '') => !value || PHONE_REGEX.test(normalizePhone(value));
const isValidProvince = (value = '') => !value || PROVINCE_CODES.includes(normalizeUpper(value));
const isValidPostalCode = (value = '') =>
  !value || POSTAL_CODE_REGEX.test(normalizePostalCode(value));
const isValidCALicense = (value = '') =>
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

const hasFile = (value) => {
  if (!value) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
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

const validateStep1 = (formData) => {
  const errors = {};

  if (!normalizeString(formData.firstName)) {
    errors.firstName = 'First name is required';
  }

  if (!normalizeString(formData.lastName)) {
    errors.lastName = 'Last name is required';
  }

  if (!normalizeString(formData.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!normalizeString(formData.password)) {
    errors.password = 'Password is required';
  } else if (!isStrongPassword(formData.password)) {
    errors.password =
      'Password must be at least 8 characters and include uppercase, lowercase, number, and special character';
  }

  if (!normalizeString(formData.confirmPassword)) {
    errors.confirmPassword = 'Confirm your password';
  } else if (String(formData.password) !== String(formData.confirmPassword)) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!normalizePhone(formData.phone)) {
    errors.phone = 'Phone is required';
  } else if (!isValidPhone(formData.phone)) {
    errors.phone = 'Enter a valid 10-digit phone number';
  }

  if (normalizePhone(formData.alternatePhone) && !isValidPhone(formData.alternatePhone)) {
    errors.alternatePhone = 'Enter a valid 10-digit phone number';
  }

  return errors;
};

const validateStep2 = (formData) => {
  const errors = {};
  const currentYear = new Date().getFullYear();

  if (!normalizeString(formData.caDesignation)) {
    errors.caDesignation = 'Required';
  }

  if (!normalizeString(formData.caNumber)) {
    errors.caNumber = 'Required';
  } else if (!isValidCALicense(formData.caNumber)) {
    errors.caNumber = 'Invalid CA / license number format';
  }

  if (!normalizeString(formData.provinceOfRegistration)) {
    errors.provinceOfRegistration = 'Required';
  } else if (!isValidProvince(formData.provinceOfRegistration)) {
    errors.provinceOfRegistration = 'Select a valid province';
  }

  if (!normalizeString(formData.yearAdmitted)) {
    errors.yearAdmitted = 'Required';
  } else if (!isValidYear(formData.yearAdmitted, { min: 1950, max: currentYear })) {
    errors.yearAdmitted = `Year must be between 1950 and ${currentYear}`;
  }

  const yearsOfExperience = normalizeNumber(formData.yearsOfExperience, null);

  if (yearsOfExperience === null && normalizeString(formData.yearsOfExperience)) {
    errors.yearsOfExperience = 'Invalid years of experience';
  } else if (yearsOfExperience !== null && yearsOfExperience < 0) {
    errors.yearsOfExperience = 'Invalid years of experience';
  } else if (!validateExperience(formData.yearAdmitted, yearsOfExperience)) {
    errors.yearsOfExperience =
      'Years of experience cannot be more than years since admitted';
  }

  if (!normalizeString(formData.firmName)) {
    errors.firmName = 'Required';
  }

  const languages = normalizeArray(formData.languages).map((item) =>
    String(item).trim().toLowerCase()
  );

  if (languages.includes('other') && !normalizeString(formData.otherLanguage)) {
    errors.otherLanguage = 'Please enter the other language';
  }

  return errors;
};

const validateStep3 = (formData) => {
  const errors = {};
  const currentYear = new Date().getFullYear();

  if (!normalizeString(formData.firmAddress)) {
    errors.firmAddress = 'Required';
  }

  if (!normalizeString(formData.city)) {
    errors.city = 'Required';
  }

  if (!normalizeString(formData.province)) {
    errors.province = 'Required';
  } else if (!isValidProvince(formData.province)) {
    errors.province = 'Select a valid province';
  }

  if (!normalizeString(formData.firmPostalCode)) {
    errors.firmPostalCode = 'Required';
  } else if (!isValidPostalCode(formData.firmPostalCode)) {
    errors.firmPostalCode = 'Enter postal code in format A1A 1A1';
  }

  if (!normalizePhone(formData.firmPhone)) {
    errors.firmPhone = 'Required';
  } else if (!isValidPhone(formData.firmPhone)) {
    errors.firmPhone = 'Enter a valid 10-digit phone number';
  }

  if (!normalizeString(formData.firmEmail)) {
    errors.firmEmail = 'Required';
  } else if (!isValidEmail(formData.firmEmail)) {
    errors.firmEmail = 'Invalid email';
  }

  if (
    normalizeString(formData.yearEstablished) &&
    !isValidYear(formData.yearEstablished, { min: 1900, max: currentYear })
  ) {
    errors.yearEstablished = 'Year established must be a valid 4-digit year';
  }

  ['numberOfPartners', 'numberOfStaff'].forEach((field) => {
    const value = normalizeNumber(formData[field], null);
    if (value !== null && value < 0) {
      errors[field] = 'Value cannot be negative';
    }
  });

  return errors;
};

const validateStep4 = (formData) => {
  const errors = {};

  if (
    normalizeString(formData.policyNumber) &&
    !isValidPolicyNumber(formData.policyNumber)
  ) {
    errors.policyNumber = 'Invalid policy number format';
  }

  if (normalizeString(formData.coverageAmount)) {
    const coverageAmount = normalizeNumber(formData.coverageAmount, null);
    if (coverageAmount === null || coverageAmount < 0) {
      errors.coverageAmount = 'Enter a valid coverage amount';
    }
  }

  if (formData.peerReviewCompleted && !normalizeString(formData.peerReviewDate)) {
    errors.peerReviewDate = 'Peer review date is required';
  }

  if (formData.disciplinaryHistory && !normalizeString(formData.disciplinaryDetails)) {
    errors.disciplinaryDetails = 'Please provide disciplinary details';
  }

  return errors;
};

const validateStep5 = (formData) => {
  const errors = {};

  if (!normalizeString(formData.practiceType)) {
    errors.practiceType = 'Practice type is required';
  }

  if (normalizeArray(formData.servicesOffered).length === 0) {
    errors.servicesOffered = 'Select at least one service offered';
  }

  if (normalizeArray(formData.clientTypes).length === 0) {
    errors.clientTypes = 'Select at least one client type';
  }

  ['averageClientsPerYear', 'minimumFee', 'maximumFee', 'serviceRadius'].forEach((field) => {
    if (normalizeString(formData[field])) {
      const value = normalizeNumber(formData[field], null);
      if (value === null || value < 0) {
        errors[field] = 'Enter a valid non-negative number';
      }
    }
  });

  const minimumFee = normalizeNumber(formData.minimumFee, null);
  const maximumFee = normalizeNumber(formData.maximumFee, null);

  if (minimumFee !== null && maximumFee !== null && maximumFee < minimumFee) {
    errors.maximumFee = 'Maximum fee cannot be less than minimum fee';
  }

  if (formData.hoursOfOperation && typeof formData.hoursOfOperation === 'object') {
    for (const [day, value] of Object.entries(formData.hoursOfOperation)) {
      if (!value?.closed) {
        if (!value?.start || !value?.end) {
          errors.hoursOfOperation = `${day}: start and end time required`;
          break;
        }

        if (value.start >= value.end) {
          errors.hoursOfOperation = `${day}: end time must be after start time`;
          break;
        }
      }
    }
  }

  return errors;
};

const validateStep6 = (formData) => {
  const errors = {};

  const hasAnySelection =
    normalizeArray(formData.taxSpecialties).length ||
    normalizeArray(formData.provincialSpecialties).length ||
    normalizeArray(formData.internationalSpecialties).length ||
    normalizeArray(formData.accountingSoftware).length ||
    normalizeArray(formData.taxSoftware).length ||
    normalizeString(formData.practiceManagementSoftware);

  if (!hasAnySelection) {
    errors.specialties = 'Select at least one specialty or software';
  }

  return errors;
};

const validateStep7 = (formData) => {
  const errors = {};

  if (!hasFile(formData.caCertificate)) {
    errors.caCertificate = 'CA certificate is required';
  }

  if (!formData.authorizeVerification) {
    errors.authorizeVerification = 'You must authorize credential verification';
  }

  return errors;
};

const validateStep8 = (formData) => {
  const errors = {};

  if (!formData.agreeToTerms) {
    errors.agreeToTerms = 'You must accept terms';
  }

  if (!formData.agreeToPrivacy) {
    errors.agreeToPrivacy = 'You must accept privacy policy';
  }

  if (!formData.agreedProfessionalTerms) {
    errors.agreedProfessionalTerms = 'You must accept professional terms';
  }

  if (!formData.confirmAccuracy) {
    errors.confirmAccuracy = 'Confirm that information is accurate';
  }

  return errors;
};

export const validateStep = (step, formData) => {
  switch (step) {
    case 1:
      return validateStep1(formData);
    case 2:
      return validateStep2(formData);
    case 3:
      return validateStep3(formData);
    case 4:
      return validateStep4(formData);
    case 5:
      return validateStep5(formData);
    case 6:
      return validateStep6(formData);
    case 7:
      return validateStep7(formData);
    case 8:
      return validateStep8(formData);
    default:
      return {};
  }
};

export const validateFullCAForm = (formData) => {
  return {
    ...validateStep1(formData),
    ...validateStep2(formData),
    ...validateStep3(formData),
    ...validateStep4(formData),
    ...validateStep5(formData),
    ...validateStep6(formData),
    ...validateStep7(formData),
    ...validateStep8(formData),
  };
};