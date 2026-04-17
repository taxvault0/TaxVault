const safeTrim = (value = '') => String(value || '').trim();

const normalizePhoneNumber = (phone = '') => {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) {
    return digits;
  }
  return digits;
};

const normalizeProvince = (province = '') =>
  String(province || '').trim().toUpperCase();

const sanitizeArray = (value) =>
  Array.isArray(value)
    ? value.map((item) => safeTrim(item)).filter(Boolean)
    : [];

const isMarriedLike = (familyStatus = '') =>
  ['Married', 'Common Law'].includes(safeTrim(familyStatus));

export const getUserRegisterPayload = (form = {}) => ({
  name: `${safeTrim(form.firstName)} ${safeTrim(form.lastName)}`.trim(),
  email: safeTrim(form.email).toLowerCase(),
  password: String(form.password || ''),
  role: 'user',
  userType: safeTrim(form.userType) || 'gig-worker',
  phoneNumber: normalizePhoneNumber(form.phone),
  province: normalizeProvince(form.province) || 'ON',
});

export const getUserOnboardingPayload = (form = {}) => ({
  personalDetails: {
    province: normalizeProvince(form.province) || 'ON',
    familyStatus: safeTrim(form.familyStatus),
    numberOfDependents: form.numberOfDependents
      ? Number(form.numberOfDependents)
      : 0,
    spouse: {
      name: isMarriedLike(form.familyStatus) ? safeTrim(form.spouseName) : '',
    },
  },

  incomeDetails: {
    userType: safeTrim(form.userType) || 'gig-worker',
    profileNotes: safeTrim(form.profileNotes),
    gigPlatforms: sanitizeArray(form.gigPlatforms),
    additionalIncomeSources: sanitizeArray(form.additionalIncomeSources),
  },

  vehicle: {
    owned: !!form.vehicleOwned,
    usage: !!form.vehicleOwned ? sanitizeArray(form.vehicleUse) : [],
  },

  deductions: {
    selectedDeductions: sanitizeArray(form.deductions),
    receiptTypes: sanitizeArray(form.receiptTypes),
  },

  declarations: {
    agreeToTerms: !!form.agreeToTerms,
    agreeToPrivacy: !!form.agreeToPrivacy,
    confirmAccuracy: !!form.confirmAccuracy,
  },
});

export default {
  getUserRegisterPayload,
  getUserOnboardingPayload,
};