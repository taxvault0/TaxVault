// Tax years
export const TAX_YEARS = [2025, 2024, 2023, 2022, 2021];

// Canadian provinces
export const PROVINCES = [
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

// User roles / types
export const USER_TYPES = {
  EMPLOYEE: 'employee',
  GIG_WORKER: 'gig-worker',
  BUSINESS_OWNER: 'business_owner',
  CONTRACTOR: 'contractor',
  CA: 'ca',
};

// Income sources
export const INCOME_SOURCES = [
  { id: 'employment', label: 'Employment (T4)' },
  { id: 'self_employed', label: 'Self-Employed / Business' },
  { id: 'investments', label: 'Investments' },
  { id: 'rental', label: 'Rental Income' },
];

// Business types
export const BUSINESS_TYPES = [
  'Sole Proprietor',
  'Corporation',
  'Partnership',
  'Freelancer',
];

// Receipt categories
export const RECEIPT_CATEGORIES = [
  { id: 'fuel', label: 'Fuel', icon: 'fuel' },
  { id: 'maintenance', label: 'Maintenance', icon: 'wrench' },
  { id: 'insurance', label: 'Insurance', icon: 'shield' },
  { id: 'office-supplies', label: 'Office Supplies', icon: 'briefcase' },
  { id: 'internet', label: 'Internet', icon: 'wifi' },
  { id: 'rent', label: 'Rent', icon: 'home' },
  { id: 'utilities', label: 'Utilities', icon: 'zap' },
  { id: 'meals', label: 'Meals', icon: 'coffee' },
  { id: 'software', label: 'Software', icon: 'code' },
  { id: 'other', label: 'Other', icon: 'more-horizontal' },
];

// CRA rates
export const CRA_RATES = {
  MILEAGE_2024: 0.61,
  MILEAGE_2023: 0.62,
  RRSP_LIMIT_2024: 31560,
  TFSA_LIMIT_2024: 7000,
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  USERS: {
    PROFILE: '/users/profile',
    DASHBOARD: '/users/dashboard',
  },
  RECEIPTS: {
    BASE: '/receipts',
    UPLOAD: '/receipts/upload',
  },
  MILEAGE: {
    BASE: '/mileage',
    TRIPS: '/mileage/trips',
  },
  DOCUMENTS: {
    BASE: '/documents',
    UPLOAD: '/documents/upload',
  },
};
