export const provinces = [
  { value: 'AB', label: 'Alberta' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NL', label: 'Newfoundland and Labrador' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'ON', label: 'Ontario' },
  { value: 'PE', label: 'Prince Edward Island' },
  { value: 'QC', label: 'Quebec' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'NT', label: 'Northwest Territories' },
  { value: 'NU', label: 'Nunavut' },
  { value: 'YT', label: 'Yukon' }
];

export const caDesignations = [
  { value: 'CPA', label: 'Chartered Professional Accountant (CPA)' },
  { value: 'CA', label: 'Chartered Accountant (CA)' },
  { value: 'CMA', label: 'Certified Management Accountant (CMA)' },
  { value: 'CGA', label: 'Certified General Accountant (CGA)' },
  { value: 'Other', label: 'Other International Designation' }
];

export const expertiseAreas = [
  'Personal Tax', 'Corporate Tax', 'GST/HST', 'Payroll', 'Bookkeeping',
  'Audit & Assurance', 'Financial Planning', 'Estate Planning', 'Business Valuation',
  'Mergers & Acquisitions', 'Insolvency', 'Forensic Accounting', 'International Tax',
  'US Cross-Border', 'Non-Profit Organizations', 'Indigenous Organizations',
  'Real Estate', 'Construction', 'Technology', 'Healthcare', 'Legal Professionals',
  'Entertainment', 'Agriculture', 'Fishing', 'Mining', 'Oil & Gas'
];

export const taxSpecialties = [
  'Personal Income Tax', 'Corporate Tax Planning', 'GST/HST Returns',
  'PST Returns', 'QST Returns', 'Payroll Remittances', 'T2 Corporation Returns',
  'T1 Personal Returns', 'T3 Trust Returns', 'T4/T4A Preparation',
  'T5013 Partnership Returns', 'Scientific Research & Experimental Development (SR&ED)',
  'Capital Gains Planning', 'Estate Planning', 'Tax Litigation',
  'Voluntary Disclosures', 'Tax Audits', 'CRA Representation'
];

export const provincialSpecialties = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island',
  'Quebec', 'Saskatchewan', 'Northwest Territories', 'Nunavut', 'Yukon',
  'Multiple Provinces', 'All Provinces'
];

export const clientIndustries = [
  'Construction', 'Real Estate', 'Technology', 'Healthcare',
  'Professional Services', 'Retail', 'Manufacturing', 'Transportation',
  'Agriculture', 'Mining', 'Oil & Gas', 'Hospitality',
  'Non-Profit', 'Indigenous Organizations', 'Entertainment', 'Education'
];

export const primaryClientTypes = [
  'Individuals', 'Families', 'Small Businesses', 'Corporations',
  'Non-Profits', 'Indigenous Organizations', 'High-Net-Worth Individuals',
  'Professionals (Doctors, Lawyers)', 'Contractors', 'Gig Workers',
  'Newcomers to Canada', 'Seniors', 'Students', 'Farmers'
];

export const accountingSoftware = [
  'QuickBooks Online', 'QuickBooks Desktop', 'Xero', 'Sage 50',
  'Sage Intacct', 'FreshBooks', 'Wave', 'Oracle NetSuite',
  'Microsoft Dynamics', 'SAP', 'Other'
];

export const taxSoftware = [
  'Profile', 'TaxPrep', 'DT Max', 'CanTax', 'QuickTax',
  'TurboTax', 'UFile', 'TaxCycle', 'CCH iFirm', 'Other'
];

export const billingMethods = [
  'Hourly Rate', 'Flat Fee', 'Value-Based', 'Retainer',
  'Contingency', 'Subscription', 'Project-Based'
];

export const professionalMemberships = [
  'CPA Canada', 'Provincial CPA Body', 'CICA', 'CMA Canada',
  'CGA Canada', 'AICPA', 'CRA Advisory Committee',
  'Canadian Tax Foundation', 'STEP Canada', 'CFA Institute',
  'IIA', 'CIA', 'CISA'
];

export const languages = [
  'English',
  'French',
  'Punjabi',
  'Hindi',
  'Spanish',
  'Mandarin',
  'Cantonese',
  'Arabic',
  'Russian',
  'Persian (Farsi)',
  'Tagalog (Filipino)',
  'German',
  'Italian',
  'Portuguese',
  'Vietnamese',
  'Urdu',
  'Other'
];

export const initialValues = {
  // Account Information
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  alternatePhone: '',

  // Professional Information
  caDesignation: '',
  caNumber: '',
  provinceOfRegistration: '',
  yearAdmitted: '',
  firmName: '',
  firmWebsite: '',
  yearsOfExperience: '',
  areasOfExpertise: [],
  languages: [],
  otherLanguage: '',
  professionalDesignations: [],

  // Firm Information
  firmAddress: '',
  city: '',
  province: '',
  firmPostalCode: '',
  firmCountry: 'Canada',
  firmPhone: '',
  firmEmail: '',
  firmSize: '',
  numberOfPartners: '',
  numberOfStaff: '',
  yearEstablished: '',

  // Professional Credentials
  professionalLiabilityInsurance: false,
  insuranceProvider: '',
  policyNumber: '',
  coverageAmount: '',
  expiryDate: '',
  peerReviewCompleted: false,
  peerReviewDate: '',
  peerReviewOutcome: '',
  peerReviewBody: '',

  // Regulatory Compliance
  cpaMemberInGoodStanding: false,
  licenseVerification: '',
  disciplinaryHistory: false,
  disciplinaryDetails: '',
  backgroundCheckConsent: false,

  // Practice Information
  practiceType: '',
  servicesOffered: [],
  clientTypes: [],
  clientIndustries: [],
  averageClientsPerYear: '',
  minimumFee: '',
  maximumFee: '',
  acceptsCRA: false,
  acceptingNewClients: true,
  offersVirtualServices: false,
  offersInPersonServices: true,
  serviceRadius: '',
  hoursOfOperation: {
    Monday: { closed: false, start: '', end: '' },
    Tuesday: { closed: false, start: '', end: '' },
    Wednesday: { closed: false, start: '', end: '' },
    Thursday: { closed: false, start: '', end: '' },
    Friday: { closed: false, start: '', end: '' },
    Saturday: { closed: true, start: '', end: '' },
    Sunday: { closed: true, start: '', end: '' },
  },
  weekendAvailability: false,
  emergencyContact: false,

  // Specialties & Technology
  taxSpecialties: [],
  provincialSpecialties: [],
  internationalSpecialties: [],
  internationalTax: false,
  usTax: false,
  crossBorder: false,
  estatePlanning: false,
  corporateRestructuring: false,
  mergersAcquisitions: false,

  // Technology & Tools
  accountingSoftware: [],
  otherAccountingSoftware: '',
  taxSoftware: [],
  otherTaxSoftware: '',
  practiceManagementSoftware: '',
  offersPortalAccess: true,
  acceptsDigitalDocuments: true,
  usesEncryption: true,
  twoFactorAuth: true,

  // Billing & Payment
  billingMethod: '',
  acceptsCreditCard: false,
  acceptsInterac: false,
  acceptsCheque: true,
  paymentPlans: false,
  flatFees: false,
  hourlyRates: false,
  contingencyFees: false,

  // Professional Memberships
  professionalMemberships: [],
  localChapter: '',
  committeeMemberships: [],
  conferenceAttendance: false,
  continuingEducation: true,
  cpdHours: '',

  // References
  professionalReferences: [
    { name: '', email: '', phone: '', relationship: '', yearsKnown: '' },
  ],
  clientReferences: [
    { name: '', email: '', phone: '', company: '', yearsServed: '' },
  ],

  // Marketing Preferences
  profilePublic: true,
  featuredProfessional: false,
  receiveReferrals: true,
  newsletterSubscribed: true,

  // Verification Documents
  caCertificate: null,
  insuranceCertificate: null,
  peerReviewReport: null,
  criminalRecordCheckDocument: null,
  professionalHeadshot: null,
  firmLogo: null,

  // Terms
  agreeToTerms: false,
  agreeToPrivacy: false,
  agreedProfessionalTerms: false,
  confirmAccuracy: false,
  authorizeVerification: false,
};