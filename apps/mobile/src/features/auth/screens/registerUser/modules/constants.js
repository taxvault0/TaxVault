export const registerUserSteps = [
  { number: 1, key: 'account', title: 'Account' },
  { number: 2, key: 'profile', title: 'Profile' },
  { number: 3, key: 'family', title: 'Family' },
  { number: 4, key: 'income', title: 'Income' },
  { number: 5, key: 'vehicle', title: 'Vehicle' },
  { number: 6, key: 'deductions', title: 'Deductions' },
  { number: 7, key: 'review', title: 'Review' },
];

export const registerUserInitialValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',

  province: 'ON',
  userType: 'gig-worker',
  profileNotes: '',

  familyStatus: 'Single',
  spouseName: '',
  numberOfDependents: '',

  gigPlatforms: [],
  additionalIncomeSources: [],

  vehicleOwned: false,
  vehicleUse: [],

  deductions: [],
  receiptTypes: [],

  agreeToTerms: false,
  agreeToPrivacy: false,
  confirmAccuracy: false,
};

export const provinceOptions = [
  { label: 'Alberta', value: 'AB' },
  { label: 'British Columbia', value: 'BC' },
  { label: 'Manitoba', value: 'MB' },
  { label: 'New Brunswick', value: 'NB' },
  { label: 'Newfoundland and Labrador', value: 'NL' },
  { label: 'Nova Scotia', value: 'NS' },
  { label: 'Northwest Territories', value: 'NT' },
  { label: 'Nunavut', value: 'NU' },
  { label: 'Ontario', value: 'ON' },
  { label: 'Prince Edward Island', value: 'PE' },
  { label: 'Quebec', value: 'QC' },
  { label: 'Saskatchewan', value: 'SK' },
  { label: 'Yukon', value: 'YT' },
];

export const userTypeOptions = [
  { label: 'Employee', value: 'employee' },
  { label: 'Gig Worker', value: 'gig-worker' },
  { label: 'Self Employed', value: 'self-employed' },
  { label: 'Student', value: 'student' },
  { label: 'Retired', value: 'retired' },
  { label: 'Other', value: 'other' },
];

export const familyStatusOptions = [
  { label: 'Single', value: 'Single' },
  { label: 'Married', value: 'Married' },
  { label: 'Common Law', value: 'Common Law' },
  { label: 'Separated', value: 'Separated' },
  { label: 'Divorced', value: 'Divorced' },
  { label: 'Widowed', value: 'Widowed' },
];

export const gigPlatformOptions = [
  'Uber',
  'Uber Eats',
  'DoorDash',
  'SkipTheDishes',
  'Instacart',
  'Lyft',
  'Amazon',
  'Airbnb',
  'Etsy',
  'Freelancer',
  'Upwork',
  'Other',
];

export const additionalIncomeSourceOptions = [
  'Rental Income',
  'Investment Income',
  'Foreign Income',
  'Side Business',
  'Tips',
  'Commission',
  'Cash Jobs',
  'Pension',
  'Support Payments',
  'Other',
];

export const vehicleUseOptions = [
  'Work',
  'Gig',
  'Business',
  'Delivery',
  'Personal',
];

export const deductionOptions = [
  'Home Office',
  'Vehicle Expenses',
  'Fuel',
  'Insurance',
  'Maintenance',
  'Phone Bill',
  'Internet',
  'Meals',
  'Travel',
  'Supplies',
  'Professional Fees',
  'Advertising',
  'Rent',
  'Utilities',
  'Other',
];

export const receiptTypeOptions = [
  'Fuel Receipts',
  'Meal Receipts',
  'Travel Receipts',
  'Phone Bills',
  'Internet Bills',
  'Maintenance Receipts',
  'Insurance Documents',
  'Rent Receipts',
  'Utility Bills',
  'Office Supplies',
  'Tax Slips',
  'Other',
];

export const REGEX = {
  email: /^\S+@\S+\.\S+$/,
  phone: /^(1)?\d{10}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
};

export const errorMessages = {
  required: 'This field is required',
  invalidEmail: 'Enter a valid email address',
  invalidPhone: 'Enter a valid 10-digit phone number',
  invalidPassword:
    'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
  passwordMismatch: 'Passwords do not match',
  termsRequired: 'You must accept terms and conditions',
  privacyRequired: 'You must accept the privacy policy',
  accuracyRequired: 'Please confirm the information is accurate',
};