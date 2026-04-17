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

export const PROVINCE_CODES = {
  Alberta: 'AB',
  'British Columbia': 'BC',
  Manitoba: 'MB',
  'New Brunswick': 'NB',
  'Newfoundland and Labrador': 'NL',
  'Nova Scotia': 'NS',
  Ontario: 'ON',
  'Prince Edward Island': 'PE',
  Quebec: 'QC',
  Saskatchewan: 'SK',
  'Northwest Territories': 'NT',
  Nunavut: 'NU',
  Yukon: 'YT',
};

export const PROVINCE_CITIES = {
  Alberta: [
    'Calgary',
    'Edmonton',
    'Red Deer',
    'Lethbridge',
    'Medicine Hat',
    'Grande Prairie',
    'Other',
  ],
  'British Columbia': [
    'Vancouver',
    'Surrey',
    'Burnaby',
    'Richmond',
    'Victoria',
    'Kelowna',
    'Abbotsford',
    'Other',
  ],
  Manitoba: [
    'Winnipeg',
    'Brandon',
    'Steinbach',
    'Thompson',
    'Portage la Prairie',
    'Other',
  ],
  'New Brunswick': [
    'Moncton',
    'Saint John',
    'Fredericton',
    'Miramichi',
    'Edmundston',
    'Other',
  ],
  'Newfoundland and Labrador': [
    'St. John’s',
    'Mount Pearl',
    'Corner Brook',
    'Gander',
    'Happy Valley-Goose Bay',
    'Other',
  ],
  'Nova Scotia': ['Halifax', 'Sydney', 'Dartmouth', 'Truro', 'New Glasgow', 'Other'],
  Ontario: [
    'Toronto',
    'Ottawa',
    'Mississauga',
    'Brampton',
    'Hamilton',
    'London',
    'Kitchener',
    'Windsor',
    'Other',
  ],
  'Prince Edward Island': ['Charlottetown', 'Summerside', 'Stratford', 'Cornwall', 'Other'],
  Quebec: [
    'Montreal',
    'Quebec City',
    'Laval',
    'Gatineau',
    'Longueuil',
    'Sherbrooke',
    'Trois-Rivières',
    'Other',
  ],
  Saskatchewan: ['Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw', 'Swift Current', 'Other'],
  'Northwest Territories': ['Yellowknife', 'Hay River', 'Inuvik', 'Fort Smith', 'Other'],
  Nunavut: ['Iqaluit', 'Rankin Inlet', 'Arviat', 'Cambridge Bay', 'Other'],
  Yukon: ['Whitehorse', 'Dawson City', 'Watson Lake', 'Haines Junction', 'Other'],
};

export const PROFILE_OPTIONS = [
  { key: 'employment', label: 'Employment', description: 'T4 salary / payroll' },
  { key: 'gigWork', label: 'Gig Work', description: 'Uber, DoorDash, etc.' },
  { key: 'selfEmployment', label: 'Self-Employed', description: 'Freelance / contract' },
  {
    key: 'incorporatedBusiness',
    label: 'Business Owner',
    description: 'Corporation / active business',
  },
  { key: 'unemployed', label: 'Unemployed', description: 'Currently not working' },
];

export const EMPLOYMENT_STATUSES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Seasonal',
  'Self-employed',
  'Unemployed',
  'Retired',
];

export const SPOUSE_EMPLOYMENT_STATUSES = [
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

export const TAX_FILING_STATUSES = [
  'Single',
  'Married',
  'Common-Law',
  'Separated',
  'Divorced',
  'Widowed',
];

export const BUSINESS_TYPES = [
  'Sole Proprietorship',
  'Partnership',
  'Corporation',
  'Cooperative',
  'Non-profit',
];

export const PLATFORMS = [
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

export const DEPENDENT_OPTIONS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];

export const RECEIPT_OPTIONS = [
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

export const VEHICLE_OWNERSHIP_OPTIONS = [
  'Owned / Cash purchase',
  'Financed',
  'Leased',
];

export const STEP_TITLES = [
  'Account',
  'Personal',
  'Tax',
  'Income',
  'Deductions',
  'Review',
];
