export const initialRegisterFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',

  dateOfBirth: '',
  sin: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
  country: 'Canada',

  taxProfile: {
    employment: true,
    gigWork: false,
    selfEmployment: false,
    incorporatedBusiness: false,
  },

  employmentStatus: '',
  taxFilingStatus: '',
  maritalStatus: '',
  hasSpouse: false,
  numberOfDependents: 0,

  businessName: '',
  businessType: '',
  businessNumber: '',
  gstRegistered: false,
  gstNumber: '',
  hstRegistered: false,
  hstNumber: '',
  qstRegistered: false,
  qstNumber: '',
  businessAddress: '',
  yearEstablished: '',
  numberOfEmployees: 0,
  annualRevenue: '',

  platforms: [],
  vehicleType: '',
  vehicleYear: '',
  vehicleMake: '',
  vehicleModel: '',
  vehicleLicensePlate: '',
  primaryUse: '',
  averageWeeklyKm: '',

  employerName: '',
  employerBusinessNumber: '',
  employerAddress: '',
  employeeId: '',
  t4Expected: true,
  commissionBased: false,

  contractType: '',
  clientIndustries: [],
  hasHstNumber: false,
  quarterlyFiling: false,
  annualFiling: true,

  hasInvestments: false,
  hasT5: false,
  hasT3: false,
  hasT5008: false,
  hasRentalIncome: false,
  rentalProperties: 0,
  hasForeignIncome: false,
  foreignCountry: '',
  hasCrypto: false,
  cryptoExchanges: [],

  hasRRSP: false,
  rrspContribution: '',
  hasFHSA: false,
  fhsaContribution: '',
  hasTFSA: false,
  tfsaContribution: '',
  hasTuition: false,
  tuitionAmount: '',
  hasMedicalExpenses: false,
  medicalExpenses: '',
  hasCharitableDonations: false,
  donationAmount: '',
  hasChildCareExpenses: false,
  childCareExpenses: '',
  hasMovingExpenses: false,
  hasUnionDues: false,
  hasProfessionalDues: false,
  hasToolExpenses: false,
  hasHomeOffice: false,
  homeOfficeExpenses: '',
  hasVehicleExpenses: false,
  vehicleExpenses: '',

  spouseName: '',
  spouseSin: '',
  spouseDob: '',
  spouseIncome: '',
  shareWithSpouse: false,
  children: [],

  priorYearNoticeOfAssessment: false,
  priorYearBalance: '',
  priorYearRRSPDeductionLimit: '',

  preferredLanguage: 'en',
  notificationEmail: true,
  notificationSMS: false,
  twoFactorAuth: false,
  dataSharingConsent: false,

  agreeToTerms: false,
  agreeToPrivacy: false,
  confirmAccuracy: false,
};

export const provinces = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Nova Scotia',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan',
  'Northwest Territories',
  'Nunavut',
  'Yukon',
];

export const employmentStatuses = [
  'Full-time',
  'Part-time',
  'Contract',
  'Seasonal',
  'Self-employed',
  'Unemployed',
  'Retired',
];

export const taxFilingStatuses = [
  'Single',
  'Married',
  'Common-Law',
  'Separated',
  'Divorced',
  'Widowed',
];

export const businessTypes = [
  'Sole Proprietorship',
  'Partnership',
  'Corporation',
  'Cooperative',
  'Non-profit',
];

export const platforms = [
  'Uber',
  'DoorDash',
  'SkipTheDishes',
  'Instacart',
  'Amazon Flex',
  'Lyft',
  'TaskRabbit',
  'Fiverr',
  'Upwork',
  'Other',
];

export const vehicleTypes = [
  'Car',
  'SUV',
  'Truck',
  'Van',
  'Motorcycle',
  'Bicycle',
  'Scooter',
];

export const profileOptions = [
  {
    key: 'employment',
    label: 'Employment Income',
    description: 'T4 salary, wages, payroll income',
    icon: 'briefcase',
  },
  {
    key: 'gigWork',
    label: 'Gig Work / Platform Income',
    description: 'Uber, DoorDash, Instacart, delivery apps',
    icon: 'car',
  },
  {
    key: 'selfEmployment',
    label: 'Self-Employment / Contract Work',
    description: 'Freelance, consulting, contract income',
    icon: 'coffee',
  },
  {
    key: 'incorporatedBusiness',
    label: 'Corporation / Business Owner',
    description: 'Own a corporation or active business',
    icon: 'building',
  },
];

export const validateRegisterStep = ({
  currentStep,
  formData,
  termsAccepted,
  privacyAccepted,
}) => {
  const newErrors = {};

  if (currentStep === 1) {
    if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone?.trim()) newErrors.phone = 'Phone number is required';
  }

  if (currentStep === 2) {
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';

    if (!formData.sin?.trim()) {
      newErrors.sin = 'SIN is required';
    } else if (!/^\d{9}$/.test(formData.sin.replace(/\s/g, ''))) {
      newErrors.sin = 'SIN must be 9 digits';
    }

    if (!formData.address?.trim()) newErrors.address = 'Address is required';
    if (!formData.city?.trim()) newErrors.city = 'City is required';
    if (!formData.province?.trim()) newErrors.province = 'Province is required';
    if (!formData.postalCode?.trim()) newErrors.postalCode = 'Postal code is required';
  }

  if (currentStep === 3) {
    const selectedProfiles = Object.values(formData.taxProfile || {}).some(Boolean);
    if (!selectedProfiles) newErrors.taxProfile = 'Select at least one tax profile';

    if (!formData.employmentStatus?.trim()) {
      newErrors.employmentStatus = 'Employment status is required';
    }

    if (!formData.taxFilingStatus?.trim()) {
      newErrors.taxFilingStatus = 'Tax filing status is required';
    }

    if (!formData.maritalStatus?.trim()) {
      newErrors.maritalStatus = 'Marital status is required';
    }

    if (
      formData.maritalStatus === 'Married' ||
      formData.maritalStatus === 'Common-Law'
    ) {
      if (!formData.spouseName?.trim()) newErrors.spouseName = 'Spouse name is required';
      if (!formData.spouseSin?.trim()) newErrors.spouseSin = 'Spouse SIN is required';
      if (!formData.spouseDob?.trim()) {
        newErrors.spouseDob = 'Spouse date of birth is required';
      }
    }
  }

  if (currentStep === 7) {
    if (!termsAccepted) {
      newErrors.terms = 'You must agree to the Terms and Conditions';
    }
    if (!privacyAccepted) {
      newErrors.privacy = 'You must agree to the Privacy Policy';
    }
    if (!formData.confirmAccuracy) {
      newErrors.confirmAccuracy = 'You must confirm accuracy';
    }
  }

  return newErrors;
};

export const getLegacyUserType = (formData) => {
  if (formData?.taxProfile?.incorporatedBusiness) return 'business';
  if (formData?.taxProfile?.gigWork) return 'gig-worker';
  if (formData?.taxProfile?.selfEmployment) return 'self-employed';
  return 'employee';
};

export const buildRegisterPayload = (formData) => {
  const hasSpouse =
    formData.maritalStatus === 'Married' ||
    formData.maritalStatus === 'Common-Law';

  return {
    name: `${formData.firstName} ${formData.lastName}`.trim(),
    email: formData.email,
    password: formData.password,

    // backward compatibility
    userType: getLegacyUserType(formData),

    // new structure
    taxProfile: formData.taxProfile,

    maritalStatus: formData.maritalStatus,
    spouseInfo: hasSpouse
      ? {
          name: formData.spouseName,
          sin: formData.spouseSin,
          dateOfBirth: formData.spouseDob,
          income: formData.spouseIncome,
          shareAccess: formData.shareWithSpouse || false,
        }
      : null,
    dependents: formData.children,
    profile: formData,
    termsAccepted: true,
    privacyAccepted: true,
    termsAcceptedAt: new Date().toISOString(),
  };
};


