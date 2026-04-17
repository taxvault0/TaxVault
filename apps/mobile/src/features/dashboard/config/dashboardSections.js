export const DASHBOARD_SECTION_KEYS = {
  EMPLOYMENT: 'employment',
  GIG: 'gig',
  BUSINESS: 'business',
  RRSP: 'rrsp',
  FHSA: 'fhsa',
  INVESTMENTS: 'investments',
  DONATIONS: 'donations',
  SPOUSE: 'spouse',
  START: 'start',
};

export const dashboardSectionCatalog = {
  [DASHBOARD_SECTION_KEYS.START]: {
    key: DASHBOARD_SECTION_KEYS.START,
    title: 'Get Started',
    cards: [
      {
        key: 'upload-t4',
        title: 'Upload T4',
        subtitle: 'Add your employment slip',
        icon: 'file-document-outline',
        routeName: 'UploadT4',
        visibility: (profile) => profile.user.employment,
      },
      {
        key: 'tax-documents',
        title: 'Tax Documents',
        subtitle: 'Manage slips and statements',
        icon: 'folder-outline',
        routeName: 'Documents',
        visibility: () => true,
      },
      {
        key: 'receipts',
        title: 'Receipts & Expenses',
        subtitle: 'Track recurring expense proofs',
        icon: 'receipt',
        routeName: 'Receipts',
        visibility: (profile) => profile.user.gigWork || profile.user.business,
      },
    ],
  },

  [DASHBOARD_SECTION_KEYS.EMPLOYMENT]: {
    key: DASHBOARD_SECTION_KEYS.EMPLOYMENT,
    title: 'Employment',
    cards: [
      {
        key: 'employment-t4',
        title: 'Upload T4',
        subtitle: 'Employment income slip',
        icon: 'briefcase-outline',
        routeName: 'UploadT4',
        visibility: (profile) => profile.user.employment,
      },
      {
        key: 'work-from-home',
        title: 'Work From Home',
        subtitle: 'Home office related claims',
        icon: 'home-outline',
        routeName: 'Documents',
        params: { category: 'work-from-home' },
        visibility: (profile) => profile.user.employment && profile.user.workFromHome,
      },
    ],
  },

  [DASHBOARD_SECTION_KEYS.GIG]: {
    key: DASHBOARD_SECTION_KEYS.GIG,
    title: 'Gig / Self-Employment',
    cards: [
      {
        key: 'gig-income',
        title: 'Gig Income',
        subtitle: 'T4A and annual summaries',
        icon: 'cash-multiple',
        routeName: 'Documents',
        params: { category: 'gig-income' },
        visibility: (profile) => profile.user.gigWork,
      },
      {
        key: 'gig-receipts',
        title: 'Gig Receipts',
        subtitle: 'Fuel, parking, meals, supplies',
        icon: 'receipt-outline',
        routeName: 'Receipts',
        params: { category: 'gig-expenses' },
        visibility: (profile) => profile.user.gigWork,
      },
      {
        key: 'mileage',
        title: 'Mileage',
        subtitle: 'Track business driving',
        icon: 'map-marker-distance',
        routeName: 'Mileage',
        visibility: (profile) => profile.user.gigWork,
      },
    ],
  },

  [DASHBOARD_SECTION_KEYS.BUSINESS]: {
    key: DASHBOARD_SECTION_KEYS.BUSINESS,
    title: 'Business Owner',
    cards: [
      {
        key: 'business-docs',
        title: 'Business Records',
        subtitle: 'Sales, rent, payroll, inventory',
        icon: 'office-building-outline',
        routeName: 'Documents',
        params: { category: 'business' },
        visibility: (profile) => profile.user.business,
      },
      {
        key: 'business-receipts',
        title: 'Business Expenses',
        subtitle: 'Store supporting receipts',
        icon: 'file-cabinet',
        routeName: 'Receipts',
        params: { category: 'business-expenses' },
        visibility: (profile) => profile.user.business,
      },
    ],
  },

  [DASHBOARD_SECTION_KEYS.RRSP]: {
    key: DASHBOARD_SECTION_KEYS.RRSP,
    title: 'Registered Accounts',
    cards: [
      {
        key: 'rrsp',
        title: 'RRSP',
        subtitle: 'Contribution slips',
        icon: 'chart-line',
        routeName: 'Documents',
        params: { category: 'rrsp' },
        visibility: (profile) => profile.user.rrsp,
      },
      {
        key: 'fhsa',
        title: 'FHSA',
        subtitle: 'First home savings documents',
        icon: 'home-city-outline',
        routeName: 'Documents',
        params: { category: 'fhsa' },
        visibility: (profile) => profile.user.fhsa,
      },
      {
        key: 'investments',
        title: 'Investments',
        subtitle: 'T5s and account statements',
        icon: 'finance',
        routeName: 'Documents',
        params: { category: 'investments' },
        visibility: (profile) => profile.user.investments || profile.user.tfsa,
      },
    ],
  },

  [DASHBOARD_SECTION_KEYS.DONATIONS]: {
    key: DASHBOARD_SECTION_KEYS.DONATIONS,
    title: 'Credits & Claims',
    cards: [
      {
        key: 'donations',
        title: 'Donations',
        subtitle: 'Charitable contribution receipts',
        icon: 'gift-outline',
        routeName: 'Documents',
        params: { category: 'donations' },
        visibility: (profile) => profile.user.donations,
      },
    ],
  },

  [DASHBOARD_SECTION_KEYS.SPOUSE]: {
    key: DASHBOARD_SECTION_KEYS.SPOUSE,
    title: 'Spouse',
    cards: [
      {
        key: 'spouse-t4',
        title: 'Spouse Employment',
        subtitle: 'Upload spouse T4 documents',
        icon: 'account-heart-outline',
        routeName: 'Documents',
        params: { category: 'spouse-t4' },
        visibility: (profile) => profile.hasSpouse && profile.spouse.employment,
      },
      {
        key: 'spouse-gig',
        title: 'Spouse Gig Work',
        subtitle: 'Income and expense records',
        icon: 'account-cash-outline',
        routeName: 'Documents',
        params: { category: 'spouse-gig' },
        visibility: (profile) => profile.hasSpouse && profile.spouse.gigWork,
      },
      {
        key: 'spouse-business',
        title: 'Spouse Business',
        subtitle: 'Business records and uploads',
        icon: 'account-tie-outline',
        routeName: 'Documents',
        params: { category: 'spouse-business' },
        visibility: (profile) => profile.hasSpouse && profile.spouse.business,
      },
    ],
  },
};

export default dashboardSectionCatalog;


