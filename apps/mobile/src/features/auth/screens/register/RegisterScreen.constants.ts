import { MaterialCommunityIcons } from '@expo/vector-icons';

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

export const provinceCities = {
  Alberta: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat', 'Grande Prairie', 'Other'],
  'British Columbia': ['Vancouver', 'Surrey', 'Burnaby', 'Richmond', 'Victoria', 'Kelowna', 'Abbotsford', 'Other'],
  Manitoba: ['Winnipeg', 'Brandon', 'Steinbach', 'Thompson', 'Portage la Prairie', 'Other'],
  'New Brunswick': ['Moncton', 'Saint John', 'Fredericton', 'Miramichi', 'Edmundston', 'Other'],
  'Newfoundland and Labrador': ['St. John’s', 'Mount Pearl', 'Corner Brook', 'Gander', 'Happy Valley-Goose Bay', 'Other'],
  'Nova Scotia': ['Halifax', 'Sydney', 'Dartmouth', 'Truro', 'New Glasgow', 'Other'],
  Ontario: ['Toronto', 'Ottawa', 'Mississauga', 'Brampton', 'Hamilton', 'London', 'Kitchener', 'Windsor', 'Other'],
  'Prince Edward Island': ['Charlottetown', 'Summerside', 'Stratford', 'Cornwall', 'Other'],
  Quebec: ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke', 'Trois-Rivières', 'Other'],
  Saskatchewan: ['Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw', 'Swift Current', 'Other'],
  'Northwest Territories': ['Yellowknife', 'Hay River', 'Inuvik', 'Fort Smith', 'Other'],
  Nunavut: ['Iqaluit', 'Rankin Inlet', 'Arviat', 'Cambridge Bay', 'Other'],
  Yukon: ['Whitehorse', 'Dawson City', 'Watson Lake', 'Haines Junction', 'Other'],
};

export const profileOptions = [
  { key: 'employment', label: 'Employment', description: 'T4 salary / payroll', icon: 'briefcase-outline' },
  { key: 'gigWork', label: 'Gig Work', description: 'Uber, DoorDash, etc.', icon: 'car-outline' },
  { key: 'selfEmployment', label: 'Self-Employed', description: 'Freelance / contract', icon: 'coffee-outline' },
  { key: 'incorporatedBusiness', label: 'Business Owner', description: 'Corporation / active business', icon: 'office-building-outline' },
  { key: 'unemployed', label: 'Unemployed', description: 'Currently not working', icon: 'account-off-outline' },
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

export const spouseEmploymentStatuses = [
  'Full-time',
  'Part-time',
  'Contract',
  'Self-employed',
  'Business owner',
  'Gig worker',
  'Student',
  'Unemployed',
  'Retired',
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

export const dependentOptions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];

export const receiptOptions = [
  { key: 'fuel', label: 'Fuel' },
  { key: 'maintenance', label: 'Maintenance' },
  { key: 'parking_tolls', label: 'Parking / Tolls' },
  { key: 'meals', label: 'Meals' },
  { key: 'mobile_internet', label: 'Mobile / Internet' },
  { key: 'supplies', label: 'Supplies' },
  { key: 'equipment', label: 'Equipment' },
  { key: 'insurance', label: 'Insurance' },
  { key: 'rent_utilities', label: 'Rent / Utilities' },
  { key: 'home_office', label: 'Home Office' },
  { key: 'vehicle_expenses', label: 'Vehicle Expenses' },
  { key: 'professional_fees', label: 'Professional Fees' },
  { key: 'other', label: 'Other Receipts' },
];

export const vehicleOwnershipOptions = ['Owned / Cash purchase', 'Financed', 'Leased'];

export type StepItem = {
  number: number;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

export const steps = [
  { number: 1, title: 'Account', icon: 'account-outline' },
  { number: 2, title: 'Personal', icon: 'card-account-details-outline' },
  { number: 3, title: 'Tax', icon: 'file-document-outline' },
  { number: 4, title: 'Income', icon: 'cash-multiple' },
  { number: 5, title: 'Deductions', icon: 'heart-outline' },
  { number: 6, title: 'Review', icon: 'check-circle-outline' },
];