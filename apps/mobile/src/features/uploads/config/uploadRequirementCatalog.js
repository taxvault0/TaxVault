const PERSON_OPTIONAL_KEYS = [
  'rrsp',
  'fhsa',
  'investments',
  'donations',
  'medical',
  'tuition',
  'workFromHome',
];

const HOUSEHOLD_OPTIONAL_KEYS = [
  'childCare',
  'dependants',
  'rent',
];

const ownerTitleMap = {
  user: 'You',
  spouse: 'Spouse',
  household: 'Household',
};

const ownerDescriptionMap = {
  user: 'your',
  spouse: 'spouse',
  household: 'household',
};

export const SECTION_TEMPLATES = {
  employment: {
    key: 'employment',
    title: 'Employment Income',
    description: 'Upload employment slips and related forms.',
    requirements: [
      {
        id: 't4',
        label: 'T4 slip',
        description: 'Primary employment tax slip.',
        required: true,
        documentTypes: ['t4'],
      },
      {
        id: 't4-secondary',
        label: 'Additional T4 slips',
        description: 'Upload if there was more than one employer.',
        required: false,
        documentTypes: ['t4'],
        allowMultiple: true,
      },
      {
        id: 't2200',
        label: 'T2200 / work from home form',
        description: 'Needed if claiming eligible work-from-home expenses.',
        required: false,
        conditionalKey: 'workFromHome',
        documentTypes: ['t2200'],
      },
    ],
  },

  gigWork: {
    key: 'gigWork',
    title: 'Gig Work / Self-Employment',
    description: 'Upload self-employment income slips and support records.',
    requirements: [
      {
        id: 't4a-or-annual-summary',
        label: 'T4A or annual platform income summary',
        description: 'At least one self-employment income document is needed.',
        required: true,
        oneOfDocumentTypes: ['t4a', 'annual_income_summary'],
      },
      {
        id: 'gig-receipts',
        label: 'Expense receipts',
        description: 'Fuel, maintenance, meals, phone, internet, supplies, etc.',
        required: true,
        documentTypes: ['gig_receipt'],
        allowMultiple: true,
      },
      {
        id: 'gig-mileage',
        label: 'Mileage log',
        description: 'Required when claiming vehicle expenses.',
        required: true,
        documentTypes: ['mileage_log'],
        allowMarkNotApplicable: true,
      },
    ],
  },

  business: {
    key: 'business',
    title: 'Business Income',
    description: 'Upload business income records and expense support.',
    requirements: [
      {
        id: 'business-income',
        label: 'Business income records',
        description: 'Sales reports, invoices, bookkeeping export, or summary.',
        required: true,
        documentTypes: ['business_income'],
      },
      {
        id: 'business-expenses',
        label: 'Business expense documents',
        description: 'Operating expenses, utilities, rent, payroll support, etc.',
        required: true,
        documentTypes: ['business_expense'],
        allowMultiple: true,
      },
      {
        id: 'business-gst',
        label: 'GST/HST records',
        description: 'Needed when registered for GST/HST.',
        required: false,
        conditionalKey: 'gst',
        documentTypes: ['gst_record'],
      },
    ],
  },

  rrsp: {
    key: 'rrsp',
    title: 'RRSP',
    description: 'Upload RRSP contribution slips.',
    requirements: [
      {
        id: 'rrsp-slip',
        label: 'RRSP contribution slips',
        description: 'Official RRSP slips for the tax year.',
        required: true,
        documentTypes: ['rrsp'],
        allowMultiple: true,
      },
    ],
  },

  fhsa: {
    key: 'fhsa',
    title: 'FHSA',
    description: 'Upload FHSA contribution and statement records.',
    requirements: [
      {
        id: 'fhsa-slip',
        label: 'FHSA slips / statements',
        description: 'Official FHSA statements or contribution slips.',
        required: true,
        documentTypes: ['fhsa'],
        allowMultiple: true,
      },
    ],
  },

  investments: {
    key: 'investments',
    title: 'Investments',
    description: 'Upload investment income slips and annual statements.',
    requirements: [
      {
        id: 't5-slip',
        label: 'T5 / investment slips',
        description: 'Interest, dividends, and other investment income slips.',
        required: true,
        documentTypes: ['t5', 'investment_statement'],
        allowMultiple: true,
      },
    ],
  },

  donations: {
    key: 'donations',
    title: 'Donations',
    description: 'Upload charitable donation receipts.',
    requirements: [
      {
        id: 'donation-receipts',
        label: 'Donation receipts',
        description: 'Official donation receipts for eligible claims.',
        required: true,
        documentTypes: ['donation'],
        allowMultiple: true,
      },
    ],
  },

  medical: {
    key: 'medical',
    title: 'Medical Expenses',
    description: 'Upload medical receipts and statements.',
    requirements: [
      {
        id: 'medical-receipts',
        label: 'Medical receipts',
        description: 'Medical and health-related claim receipts.',
        required: true,
        documentTypes: ['medical'],
        allowMultiple: true,
      },
    ],
  },

  tuition: {
    key: 'tuition',
    title: 'Tuition',
    description: 'Upload tuition slips and school records.',
    requirements: [
      {
        id: 'tuition-slip',
        label: 'Tuition slip',
        description: 'Official tuition tax slip or institution statement.',
        required: true,
        documentTypes: ['tuition'],
      },
    ],
  },

  workFromHome: {
    key: 'workFromHome',
    title: 'Work From Home',
    description: 'Upload work-from-home supporting documents.',
    requirements: [
      {
        id: 'work-from-home-form',
        label: 'Employer work-from-home form',
        description: 'T2200 or equivalent support.',
        required: true,
        documentTypes: ['t2200'],
      },
      {
        id: 'work-from-home-support',
        label: 'Home office support',
        description: 'Utilities, internet, and other eligible support documents.',
        required: false,
        documentTypes: ['home_office'],
        allowMultiple: true,
      },
    ],
  },

  childCare: {
    key: 'childCare',
    title: 'Child Care',
    description: 'Upload child care expense receipts.',
    requirements: [
      {
        id: 'child-care-receipts',
        label: 'Child care receipts',
        description: 'Receipts for daycare, nanny, camps, and related care.',
        required: true,
        documentTypes: ['childcare'],
        allowMultiple: true,
      },
    ],
  },

  dependants: {
    key: 'dependants',
    title: 'Dependants',
    description: 'Upload dependant-related supporting records.',
    requirements: [
      {
        id: 'dependant-support',
        label: 'Dependant support documents',
        description: 'Documents needed to support dependant claims.',
        required: true,
        documentTypes: ['dependant'],
        allowMultiple: true,
      },
    ],
  },

  rent: {
    key: 'rent',
    title: 'Rent / Housing',
    description: 'Upload rent or housing support where needed.',
    requirements: [
      {
        id: 'rent-support',
        label: 'Rent receipts / housing support',
        description: 'Lease, annual rent summary, or rent receipts.',
        required: true,
        documentTypes: ['rent'],
        allowMultiple: true,
      },
    ],
  },
};

export const getOwnerTitle = (owner) => ownerTitleMap[owner] || 'Unknown';
export const getOwnerDescription = (owner) => ownerDescriptionMap[owner] || 'household';

export const getSectionTemplate = (key) => SECTION_TEMPLATES[key];

export const getPersonOptionalKeys = () => PERSON_OPTIONAL_KEYS;
export const getHouseholdOptionalKeys = () => HOUSEHOLD_OPTIONAL_KEYS;


