import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  ChevronDown,
  Download,
  Eye,
  FileText,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  History,
  Landmark,
  Lock,
  PiggyBank,
  Receipt,
  Search,
  Settings2,
  Shield,
  Upload,
  Wallet,
  X,
  Home,
  TrendingUp,
  Package,
  Percent,
  Smartphone,
  Car,
  Gift,
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import { useAuth } from '../../auth/context/AuthContext';
import { buildHouseholdProfile } from 'utils/taxProfile';

const CATEGORY_META = {
  all: {
    label: 'All',
    icon: FileText,
    pillClass: 'bg-gray-100 text-gray-700',
  },
  employment: {
    label: 'Employment',
    icon: Briefcase,
    pillClass: 'bg-blue-100 text-blue-700',
  },
  t4: {
    label: 'T4',
    icon: Briefcase,
    pillClass: 'bg-blue-100 text-blue-700',
  },
  t4a: {
    label: 'T4A',
    icon: Briefcase,
    pillClass: 'bg-amber-100 text-amber-700',
  },
  'gig-income': {
    label: 'Gig Income',
    icon: Receipt,
    pillClass: 'bg-amber-100 text-amber-700',
  },
  investments: {
    label: 'Investments',
    icon: Landmark,
    pillClass: 'bg-purple-100 text-purple-700',
  },
  savings: {
    label: 'Savings',
    icon: PiggyBank,
    pillClass: 'bg-green-100 text-green-700',
  },
  insurance: {
    label: 'Insurance',
    icon: Shield,
    pillClass: 'bg-indigo-100 text-indigo-700',
  },
  education: {
    label: 'Education',
    icon: GraduationCap,
    pillClass: 'bg-teal-100 text-teal-700',
  },
  'medical-donations': {
    label: 'Medical / Donations',
    icon: HeartPulse,
    pillClass: 'bg-rose-100 text-rose-700',
  },
  rrsp: {
    label: 'RRSP',
    icon: PiggyBank,
    pillClass: 'bg-green-100 text-green-700',
  },
  fhsa: {
    label: 'FHSA',
    icon: Home,
    pillClass: 'bg-cyan-100 text-cyan-700',
  },
  tfsa: {
    label: 'TFSA',
    icon: Wallet,
    pillClass: 'bg-lime-100 text-lime-700',
  },
  tuition: {
    label: 'Tuition',
    icon: GraduationCap,
    pillClass: 'bg-teal-100 text-teal-700',
  },
  rental: {
    label: 'Rental',
    icon: Home,
    pillClass: 'bg-orange-100 text-orange-700',
  },
  'foreign-income': {
    label: 'Foreign Income',
    icon: FileText,
    pillClass: 'bg-slate-100 text-slate-700',
  },
  crypto: {
    label: 'Crypto',
    icon: TrendingUp,
    pillClass: 'bg-violet-100 text-violet-700',
  },
  business: {
    label: 'Business',
    icon: Building2,
    pillClass: 'bg-indigo-100 text-indigo-700',
  },
  'gst-hst': {
    label: 'GST / HST',
    icon: Percent,
    pillClass: 'bg-fuchsia-100 text-fuchsia-700',
  },
  payroll: {
    label: 'Payroll',
    icon: Briefcase,
    pillClass: 'bg-yellow-100 text-yellow-700',
  },
  inventory: {
    label: 'Inventory',
    icon: Package,
    pillClass: 'bg-stone-100 text-stone-700',
  },
  'home-office': {
    label: 'Home Office',
    icon: Home,
    pillClass: 'bg-sky-100 text-sky-700',
  },

  'spouse-t4': {
    label: 'Spouse T4',
    icon: HeartHandshake,
    pillClass: 'bg-sky-100 text-sky-700',
  },
  'spouse-gig': {
    label: 'Spouse Gig Income',
    icon: HeartHandshake,
    pillClass: 'bg-teal-100 text-teal-700',
  },
  'spouse-gig-expenses': {
    label: 'Spouse Gig Expenses',
    icon: Receipt,
    pillClass: 'bg-cyan-100 text-cyan-700',
  },
  'spouse-business': {
    label: 'Spouse Business',
    icon: Building2,
    pillClass: 'bg-fuchsia-100 text-fuchsia-700',
  },
  'spouse-optional': {
    label: 'Spouse Optional',
    icon: Wallet,
    pillClass: 'bg-violet-100 text-violet-700',
  },
};

const TABS = Object.keys(CATEGORY_META);

const normalizeQueryCategory = (value) => {
  const category = String(value || '').trim().toLowerCase();

  const aliasMap = {
    medical: 'medical-donations',
    donations: 'medical-donations',
    'child-care': 'medical-donations',
    moving: 'medical-donations',
    foreign: 'foreign-income',
  };

  const normalized = aliasMap[category] || category;
  return TABS.includes(normalized) ? normalized : 'all';
};

const deriveProfileFlags = (user) => {
  const taxProfile = user?.taxProfile || {};
  const dependents = Array.isArray(user?.dependents) ? user.dependents : [];

  return {
    employment: !!taxProfile.employment,
    gig: !!taxProfile.gigWork || !!taxProfile.selfEmployment,
    business: !!taxProfile.business || !!taxProfile.incorporatedBusiness,
    investments: !!taxProfile.investments,
    rrsp: !!taxProfile.rrsp,
    fhsa: !!taxProfile.fhsa,
    tfsa: !!taxProfile.tfsa,
    donations: !!taxProfile.donations,
    workFromHome: !!taxProfile.workFromHome,
    ccb: !!taxProfile.ccb,
    hasChildren: !!user?.hasChildren || dependents.length > 0,
  };
};

const deriveFinalSlips = ({
  selectedSlips = [],
  suggestedSlips = [],
  profileFlags,
}) => {
  const baseSlips =
    selectedSlips.length > 0 ? [...selectedSlips] : [...suggestedSlips];

  if (profileFlags.employment && !baseSlips.includes('T4')) {
    baseSlips.push('T4');
  }

  if (profileFlags.gig && !baseSlips.includes('T4A')) {
    baseSlips.push('T4A');
  }

  if (profileFlags.investments) {
    ['T5', 'T3', 'T5008'].forEach((slip) => {
      if (!baseSlips.includes(slip)) {
        baseSlips.push(slip);
      }
    });
  }

  if (
    (profileFlags.employment ||
      profileFlags.gig ||
      profileFlags.business ||
      profileFlags.rrsp) &&
    !baseSlips.includes('RRSP')
  ) {
    baseSlips.push('RRSP');
  }

  if (profileFlags.fhsa && !baseSlips.includes('FHSA')) {
    baseSlips.push('FHSA');
  }

  if (profileFlags.tfsa && !baseSlips.includes('TFSA')) {
    baseSlips.push('TFSA');
  }

  if (!baseSlips.includes('MEDICAL')) {
    baseSlips.push('MEDICAL');
  }

  if (!baseSlips.includes('DONATIONS')) {
    baseSlips.push('DONATIONS');
  }

  if (profileFlags.hasChildren && !baseSlips.includes('CHILD_CARE')) {
    baseSlips.push('CHILD_CARE');
  }

  if (profileFlags.workFromHome && !baseSlips.includes('HOME_OFFICE')) {
    baseSlips.push('HOME_OFFICE');
  }

  if (!baseSlips.includes('TUITION')) {
    baseSlips.push('TUITION');
  }

  if (!baseSlips.includes('MOVING')) {
    baseSlips.push('MOVING');
  }

  return Array.from(new Set(baseSlips));
};

const deriveFinalReceiptCategories = ({
  selectedReceiptCategories = [],
  suggestedReceiptCategories = [],
  profileFlags,
  wantsBillOfSaleUpload,
}) => {
  const baseCategories =
    selectedReceiptCategories.length > 0
      ? [...selectedReceiptCategories]
      : [...suggestedReceiptCategories];

  if (profileFlags.gig) {
    [
      'fuel',
      'maintenance',
      'parking_tolls',
      'mobile_internet',
      'insurance',
      'meals',
      'vehicle_expenses',
      'supplies',
    ].forEach((category) => {
      if (!baseCategories.includes(category)) {
        baseCategories.push(category);
      }
    });
  }

  if (profileFlags.business) {
    [
      'supplies',
      'equipment',
      'professional_fees',
      'rent_utilities',
      'insurance',
      'payroll_expenses',
      'inventory_purchases',
      'home_office',
      'mobile_internet',
    ].forEach((category) => {
      if (!baseCategories.includes(category)) {
        baseCategories.push(category);
      }
    });
  }

  if (profileFlags.workFromHome && !baseCategories.includes('home_office')) {
    baseCategories.push('home_office');
  }

  if (wantsBillOfSaleUpload && !baseCategories.includes('vehicle_purchase')) {
    baseCategories.push('vehicle_purchase');
  }

  return Array.from(new Set(baseCategories));
};

const mapSlipToDocumentCategory = (slip) => {
  switch (slip) {
    case 'T4':
      return 't4';
    case 'T4A':
      return 't4a';
    case 'T5':
    case 'T3':
    case 'T5008':
      return 'investments';
    case 'RRSP':
      return 'rrsp';
    case 'FHSA':
      return 'fhsa';
    case 'TFSA':
      return 'tfsa';
    case 'TUITION':
      return 'tuition';
    case 'MEDICAL':
    case 'DONATIONS':
    case 'CHILD_CARE':
    case 'MOVING':
      return 'medical-donations';
    case 'RENTAL':
      return 'rental';
    case 'FOREIGN':
      return 'foreign-income';
    case 'CRYPTO':
      return 'crypto';
    case 'BUSINESS_RECORDS':
      return 'business';
    case 'GST_HST':
      return 'gst-hst';
    case 'PAYROLL':
      return 'payroll';
    case 'INVENTORY':
      return 'inventory';
    case 'HOME_OFFICE':
      return 'home-office';
    default:
      return 'all';
  }
};

const getSlipMeta = (slip) => {
  const metaMap = {
    T4: {
      name: 'T4 - Employment Slip',
      issuer: 'Employer',
      documentType: 'T4 Slip',
      notes: 'Employment income slip.',
    },
    T4A: {
      name: 'T4A - Contract / Gig Income',
      issuer: 'Platform / Client',
      documentType: 'T4A / Income Summary',
      notes: 'Contract, commission, or gig income support.',
    },
    T5: {
      name: 'T5 - Investment Income',
      issuer: 'Financial Institution',
      documentType: 'T5 Slip',
      notes: 'Interest and investment income statement.',
    },
    T3: {
      name: 'T3 - Trust Income',
      issuer: 'Trust / Fund',
      documentType: 'T3 Slip',
      notes: 'Trust income support.',
    },
    T5008: {
      name: 'T5008 - Securities Transactions',
      issuer: 'Brokerage',
      documentType: 'T5008 Slip',
      notes: 'Capital gains and securities transaction support.',
    },
    RRSP: {
      name: 'RRSP Contribution Slip',
      issuer: 'Bank / Brokerage',
      documentType: 'RRSP Receipt',
      notes: 'Registered retirement contribution support.',
    },
    FHSA: {
      name: 'FHSA Contribution Record',
      issuer: 'Bank / Brokerage',
      documentType: 'FHSA Statement',
      notes: 'First Home Savings Account contribution support.',
    },
    TFSA: {
      name: 'TFSA Account Records',
      issuer: 'Bank / Brokerage',
      documentType: 'TFSA Statement',
      notes: 'Tax-Free Savings Account records.',
    },
    TUITION: {
      name: 'Tuition / T2202',
      issuer: 'School / Institution',
      documentType: 'Education Slip',
      notes: 'Post-secondary tuition support.',
    },
    MEDICAL: {
      name: 'Medical Records',
      issuer: 'Clinic / Pharmacy / Provider',
      documentType: 'Medical Support',
      notes: 'Eligible medical expense records.',
    },
    DONATIONS: {
      name: 'Donation Receipts',
      issuer: 'Registered Charity',
      documentType: 'Donation Receipt',
      notes: 'Official charitable donation receipt summary.',
    },
    CHILD_CARE: {
      name: 'Child Care Receipts',
      issuer: 'Daycare / Provider',
      documentType: 'Child Care Receipt',
      notes: 'Child care expense support.',
    },
    MOVING: {
      name: 'Moving Expense Records',
      issuer: 'Multiple Issuers',
      documentType: 'Moving Support',
      notes: 'Moving expense support.',
    },
    RENTAL: {
      name: 'Rental Income Records',
      issuer: 'User Uploaded',
      documentType: 'Rental Package',
      notes: 'Rental income and expense support.',
    },
    FOREIGN: {
      name: 'Foreign Income Records',
      issuer: 'Foreign Issuer',
      documentType: 'Foreign Income Support',
      notes: 'Foreign income statements and supporting records.',
    },
    CRYPTO: {
      name: 'Crypto Transaction Records',
      issuer: 'Exchange / Wallet Export',
      documentType: 'Crypto Statement',
      notes: 'Crypto transaction summary and export.',
    },
    BUSINESS_RECORDS: {
      name: 'Business Records / Statements',
      issuer: 'Business',
      documentType: 'Business Package',
      notes: 'Business income and expense records.',
    },
    GST_HST: {
      name: 'GST / HST Records',
      issuer: 'CRA / Business',
      documentType: 'GST/HST Support',
      notes: 'GST/HST returns and support.',
    },
    PAYROLL: {
      name: 'Payroll Records',
      issuer: 'Payroll System',
      documentType: 'Payroll Package',
      notes: 'Payroll summaries and remittance support.',
    },
    INVENTORY: {
      name: 'Inventory Records',
      issuer: 'Business',
      documentType: 'Inventory Records',
      notes: 'Inventory purchases and stock records.',
    },
    HOME_OFFICE: {
      name: 'Home Office Records',
      issuer: 'User Uploaded',
      documentType: 'Home Office Support',
      notes: 'Workspace-at-home support records.',
    },
  };

  return metaMap[slip] || {
    name: slip,
    issuer: 'User Uploaded',
    documentType: 'Tax Document',
    notes: 'Uploaded tax support document.',
  };
};

const getReceiptMeta = (receipt) => {
  const metaMap = {
    fuel: {
      name: 'Fuel Receipts',
      issuer: 'Gas Stations',
      documentType: 'Expense Bundle',
      notes: 'Fuel receipt support for work use.',
    },
    maintenance: {
      name: 'Maintenance Receipts',
      issuer: 'Repair / Service Providers',
      documentType: 'Expense Bundle',
      notes: 'Vehicle maintenance and parts support.',
    },
    parking_tolls: {
      name: 'Parking / Toll Records',
      issuer: 'Parking / Toll Providers',
      documentType: 'Expense Bundle',
      notes: 'Parking and toll support.',
    },
    meals: {
      name: 'Meal Receipts',
      issuer: 'Restaurants / Vendors',
      documentType: 'Expense Bundle',
      notes: 'Meal expense support.',
    },
    mobile_internet: {
      name: 'Mobile / Internet Bills',
      issuer: 'Telecom Provider',
      documentType: 'Service Statements',
      notes: 'Phone and internet bills used for work.',
    },
    supplies: {
      name: 'Supply Receipts',
      issuer: 'Office / Retail Stores',
      documentType: 'Expense Bundle',
      notes: 'Supplies and office purchase records.',
    },
    equipment: {
      name: 'Equipment Receipts',
      issuer: 'Retailer / Supplier',
      documentType: 'Expense Bundle',
      notes: 'Tools, devices, and equipment purchases.',
    },
    insurance: {
      name: 'Insurance Records',
      issuer: 'Insurance Provider',
      documentType: 'Insurance Statement',
      notes: 'Insurance support records.',
    },
    rent_utilities: {
      name: 'Rent / Utilities Records',
      issuer: 'Landlord / Utility Providers',
      documentType: 'Occupancy Support',
      notes: 'Rent and utility support.',
    },
    home_office: {
      name: 'Home Office Expenses',
      issuer: 'Multiple Issuers',
      documentType: 'Expense Bundle',
      notes: 'Home office expense records.',
    },
    vehicle_expenses: {
      name: 'Vehicle Expense Records',
      issuer: 'Multiple Issuers',
      documentType: 'Expense Bundle',
      notes: 'Vehicle support records.',
    },
    payroll_expenses: {
      name: 'Payroll Expense Records',
      issuer: 'Payroll Provider',
      documentType: 'Payroll Support',
      notes: 'Payroll expense records.',
    },
    inventory_purchases: {
      name: 'Inventory Purchase Records',
      issuer: 'Suppliers',
      documentType: 'Inventory Support',
      notes: 'Inventory purchase invoices and records.',
    },
    professional_fees: {
      name: 'Professional Fee Records',
      issuer: 'Lawyer / Accountant / Consultant',
      documentType: 'Expense Bundle',
      notes: 'Professional service invoices.',
    },
    other: {
      name: 'Other Receipts',
      issuer: 'Multiple Issuers',
      documentType: 'Expense Bundle',
      notes: 'Other eligible receipt records.',
    },
    vehicle_purchase: {
      name: 'Vehicle Bill of Sale',
      issuer: 'Dealer / Seller',
      documentType: 'Purchase Record',
      notes: 'Vehicle bill of sale and purchase support.',
    },
  };

  return metaMap[receipt] || {
    name: receipt,
    issuer: 'User Uploaded',
    documentType: 'Expense Bundle',
    notes: 'Uploaded receipt support.',
  };
};

const InfoItem = ({ label, value }) => (
  <div className="rounded-xl bg-gray-50 p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
    <p className="mt-1 text-sm font-medium text-gray-900">{value || '—'}</p>
  </div>
);

function generateMockDocuments(user) {
  const household = buildHouseholdProfile(user);
  const spouse = household.spouse;

  const selectedSlips = user?.documentPreferences?.selectedSlips || [];
  const selectedReceiptCategories =
    user?.documentPreferences?.selectedReceiptCategories || [];
  const suggestedSlips = user?.onboarding?.suggestedSlips || [];
  const suggestedReceiptCategories =
    user?.onboarding?.suggestedReceiptCategories || [];

  const profileFlags = deriveProfileFlags(user);

  const finalSlips = deriveFinalSlips({
    selectedSlips,
    suggestedSlips,
    profileFlags,
  });

  const finalReceiptCategories = deriveFinalReceiptCategories({
    selectedReceiptCategories,
    suggestedReceiptCategories,
    profileFlags,
    wantsBillOfSaleUpload: user?.vehiclePurchase?.wantsBillOfSaleUpload,
  });

  let id = 1;
  const nextId = () => id++;

  const docs = [];

  finalSlips.forEach((slip, index) => {
    const meta = getSlipMeta(slip);
    const category = mapSlipToDocumentCategory(slip);

    docs.push({
      id: nextId(),
      category,
      documentType: meta.documentType,
      name: meta.name,
      fileName: `${slip.toLowerCase()}_2025.pdf`,
      issuer: meta.issuer,
      taxYear: 2025,
      uploadDate: `2026-02-${String(10 + index).padStart(2, '0')}`,
      size: `${150 + index * 12} KB`,
      permissions: 'view-only',
      viewedBy: index % 2 === 0 ? ['You', 'David Chen (CA)'] : ['You'],
      lastViewed: `2026-03-${String(10 + index).padStart(2, '0')}`,
      notes: meta.notes,
    });
  });

  finalReceiptCategories.forEach((receipt, index) => {
    const meta = getReceiptMeta(receipt);

    docs.push({
      id: nextId(),
      category:
        receipt === 'insurance'
          ? 'insurance'
          : receipt === 'home_office'
            ? 'home-office'
            : receipt === 'rent_utilities'
              ? 'business'
              : receipt === 'inventory_purchases'
                ? 'inventory'
                : receipt === 'payroll_expenses'
                  ? 'payroll'
                  : 'gig-income',
      documentType: meta.documentType,
      name: meta.name,
      fileName: `${receipt}_bundle_2025.pdf`,
      issuer: meta.issuer,
      taxYear: 2025,
      uploadDate: `2026-03-${String(1 + index).padStart(2, '0')}`,
      size: `${210 + index * 8} KB`,
      permissions: 'view-only',
      viewedBy: ['You'],
      lastViewed: `2026-03-${String(15 + index).padStart(2, '0')}`,
      notes: meta.notes,
    });
  });

  if (household.hasSpouse && spouse?.employment) {
    docs.push({
      id: nextId(),
      category: 'spouse-t4',
      documentType: 'T4 Slip',
      name: 'Spouse T4 - Employment Slip',
      fileName: 'spouse_t4_2025.pdf',
      issuer: spouse?.employerName || 'Spouse Employer',
      taxYear: 2025,
      uploadDate: '2026-02-27',
      size: '148 KB',
      permissions: 'view-only',
      viewedBy: ['You', 'David Chen (CA)'],
      lastViewed: '2026-03-18',
      notes: 'Spouse employment income slip.',
    });
  }

  if (household.hasSpouse && spouse?.gigWork) {
    docs.push(
      {
        id: nextId(),
        category: 'spouse-gig',
        documentType: 'T4A / Platform Income',
        name: 'Spouse Gig Income Summary',
        fileName: 'spouse_gig_income_2025.pdf',
        issuer: 'Gig Platform',
        taxYear: 2025,
        uploadDate: '2026-02-23',
        size: '232 KB',
        permissions: 'view-only',
        viewedBy: ['You'],
        lastViewed: '2026-03-17',
        notes: 'Spouse annual gig income record.',
      },
      {
        id: nextId(),
        category: 'spouse-gig-expenses',
        documentType: 'Expense Summary',
        name: 'Spouse Gig Expense Bundle',
        fileName: 'spouse_gig_expenses_2025.pdf',
        issuer: 'Uploaded by user',
        taxYear: 2025,
        uploadDate: '2026-03-02',
        size: '410 KB',
        permissions: 'view-only',
        viewedBy: ['You'],
        lastViewed: '2026-03-19',
        notes: 'Fuel, maintenance, phone, and insurance for spouse gig work.',
      }
    );
  }

  if (household.hasSpouse && spouse?.business) {
    docs.push({
      id: nextId(),
      category: 'spouse-business',
      documentType: 'Business Records',
      name: 'Spouse Business Record Package',
      fileName: 'spouse_business_records_2025.pdf',
      issuer: spouse?.businessInfo?.businessName || 'Spouse Business',
      taxYear: 2025,
      uploadDate: '2026-03-03',
      size: '520 KB',
      permissions: 'downloadable',
      viewedBy: ['You', 'David Chen (CA)'],
      lastViewed: '2026-03-20',
      notes: 'Spouse business income, expenses, and related records.',
    });
  }

  if (
    household.hasSpouse &&
    (spouse?.unemployed ||
      spouse?.rrsp ||
      spouse?.tfsa ||
      spouse?.fhsa ||
      spouse?.ccb ||
      spouse?.investments ||
      spouse?.donations)
  ) {
    docs.push({
      id: nextId(),
      category: 'spouse-optional',
      documentType: 'Optional Tax Records',
      name: 'Spouse RRSP / TFSA / FHSA Bundle',
      fileName: 'spouse_optional_records_2025.pdf',
      issuer: 'Multiple issuers',
      taxYear: 2025,
      uploadDate: '2026-03-05',
      size: '290 KB',
      permissions: 'view-only',
      viewedBy: ['You'],
      lastViewed: '2026-03-20',
      notes: 'Optional spouse tax account records and supporting slips.',
    });
  }

  return docs;
}

const Documents = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const household = useMemo(() => buildHouseholdProfile(user), [user]);
  const initialCategory = normalizeQueryCategory(searchParams.get('category'));

  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAccessLogModal, setShowAccessLogModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  const selectedSlips = user?.documentPreferences?.selectedSlips || [];
  const selectedReceiptCategories =
    user?.documentPreferences?.selectedReceiptCategories || [];
  const suggestedSlips = user?.onboarding?.suggestedSlips || [];
  const suggestedReceiptCategories =
    user?.onboarding?.suggestedReceiptCategories || [];

  const profileFlags = useMemo(() => deriveProfileFlags(user), [user]);

  const finalSlips = useMemo(
    () =>
      deriveFinalSlips({
        selectedSlips,
        suggestedSlips,
        profileFlags,
      }),
    [selectedSlips, suggestedSlips, profileFlags]
  );

  const finalReceiptCategories = useMemo(
    () =>
      deriveFinalReceiptCategories({
        selectedReceiptCategories,
        suggestedReceiptCategories,
        profileFlags,
        wantsBillOfSaleUpload: user?.vehiclePurchase?.wantsBillOfSaleUpload,
      }),
    [
      selectedReceiptCategories,
      suggestedReceiptCategories,
      profileFlags,
      user?.vehiclePurchase?.wantsBillOfSaleUpload,
    ]
  );

  useEffect(() => {
    const queryCategory = normalizeQueryCategory(searchParams.get('category'));
    if (queryCategory !== activeCategory) {
      setActiveCategory(queryCategory);
    }
  }, [searchParams, activeCategory]);

  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setDocuments(generateMockDocuments(user));
      } catch (error) {
        console.error('Error loading documents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [user]);

  const visibleTabs = useMemo(() => {
    const tabs = ['all'];

    const categoriesFromSlips = finalSlips
      .map(mapSlipToDocumentCategory)
      .filter((cat) => cat && cat !== 'all');

    categoriesFromSlips.forEach((cat) => {
      if (!tabs.includes(cat)) tabs.push(cat);
    });

    if (finalReceiptCategories.includes('insurance')) {
      if (!tabs.includes('insurance')) tabs.push('insurance');
    }

    if (household.hasSpouse && household.spouse?.employment) {
      tabs.push('spouse-t4');
    }

    if (household.hasSpouse && household.spouse?.gigWork) {
      tabs.push('spouse-gig', 'spouse-gig-expenses');
    }

    if (household.hasSpouse && household.spouse?.business) {
      tabs.push('spouse-business');
    }

    if (household.hasSpouse) {
      const spouseHasOptional =
        household.spouse?.tfsa ||
        household.spouse?.rrsp ||
        household.spouse?.fhsa ||
        household.spouse?.ccb ||
        household.spouse?.investments ||
        household.spouse?.donations ||
        household.spouse?.unemployed;

      if (spouseHasOptional) {
        tabs.push('spouse-optional');
      }
    }

    return Array.from(new Set(tabs)).filter((tab) => CATEGORY_META[tab]);
  }, [household, finalSlips, finalReceiptCategories]);

  const counts = useMemo(() => {
    const result = TABS.reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {});

    result.all = documents.length;

    documents.forEach((doc) => {
      if (result[doc.category] !== undefined) {
        result[doc.category] += 1;
      }
    });

    return result;
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    return documents
      .filter((doc) => {
        if (activeCategory !== 'all' && doc.category !== activeCategory) return false;
        if (!value) return true;

        return (
          doc.name.toLowerCase().includes(value) ||
          doc.fileName.toLowerCase().includes(value) ||
          doc.issuer.toLowerCase().includes(value) ||
          doc.documentType.toLowerCase().includes(value) ||
          String(doc.taxYear).includes(value)
        );
      })
      .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
  }, [documents, activeCategory, searchTerm]);

  const summary = useMemo(() => {
    const usedCategories = new Set(documents.map((doc) => doc.category)).size;

    const latestUpload = documents.length
      ? [...documents].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))[0]
          .uploadDate
      : null;

    return {
      total: documents.length,
      categoriesUsed: usedCategories,
      lastUpload: latestUpload,
    };
  }, [documents]);

  const accessLogs = useMemo(() => {
    return documents
      .flatMap((doc) =>
        (doc.viewedBy || []).map((viewer, index) => ({
          id: `${doc.id}-${viewer}-${index}`,
          viewer,
          document: doc.name,
          timestamp: doc.lastViewed,
        }))
      )
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [documents]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const setCategory = (category) => {
    const normalized = normalizeQueryCategory(category);
    setActiveCategory(normalized);

    if (normalized === 'all') {
      setSearchParams({});
      return;
    }

    setSearchParams({ category: normalized });
  };

  const EmptyState = () => (
    <Card>
      <Card.Body className="py-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <FileText size={24} className="text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No tax documents yet</h3>
        <p className="mt-2 text-sm text-gray-500">
          Upload formal slips, annual statements, and official tax records.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={() => setShowUploadModal(true)}>
            <Upload size={16} className="mr-2" />
            Upload Document
          </Button>

          <Link to="/receipts">
            <Button variant="outline">Open Receipts</Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );

  const UploadModal = () => {
    if (!showUploadModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Upload document</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add a formal tax slip, annual statement, or official record.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowUploadModal(false)}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4 px-6 py-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Document category
              </label>
              <select
                defaultValue={activeCategory === 'all' ? (visibleTabs[1] || 't4') : activeCategory}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary-500"
              >
                {visibleTabs
                  .filter((tab) => tab !== 'all')
                  .map((tab) => (
                    <option key={tab} value={tab}>
                      {CATEGORY_META[tab].label}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">File</label>
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                <Upload size={20} className="mx-auto mb-2 text-gray-500" />
                <p className="text-sm font-medium text-gray-700">Upload PDF, JPG, JPEG, or PNG</p>
                <p className="mt-1 text-xs text-gray-500">
                  Best for official tax slips and annual records
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t px-6 py-4">
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowUploadModal(false)}>Upload Document</Button>
          </div>
        </div>
      </div>
    );
  };

  const AccessLogModal = () => {
    if (!showAccessLogModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Document access log</h3>
              <p className="mt-1 text-sm text-gray-500">
                Recent viewing activity for stored documents.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAccessLogModal(false)}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>

          <div className="max-h-[420px] space-y-3 overflow-y-auto px-6 py-5">
            {accessLogs.length === 0 ? (
              <p className="text-sm text-gray-500">No access history yet.</p>
            ) : (
              accessLogs.map((log) => (
                <div key={log.id} className="rounded-lg border border-gray-200 p-3">
                  <p className="text-sm font-medium text-gray-900">
                    {log.viewer} viewed {log.document}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">{log.timestamp}</p>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end border-t px-6 py-4">
            <Button variant="outline" onClick={() => setShowAccessLogModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const PermissionsModal = () => {
    if (!showPermissionsModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Sharing permissions</h3>
              <p className="mt-1 text-sm text-gray-500">
                Control how your CA can access document categories.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPermissionsModal(false)}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-3 px-6 py-5">
            {visibleTabs
              .filter((tab) => tab !== 'all')
              .map((tab) => {
                const meta = CATEGORY_META[tab];
                const Icon = meta.icon;

                return (
                  <div
                    key={tab}
                    className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-gray-100 p-2">
                        <Icon size={16} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{meta.label}</p>
                        <p className="text-xs text-gray-500">{counts[tab] || 0} docs</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        View Only
                      </button>
                      <button className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        Downloadable
                      </button>
                      <button className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        Restricted
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="flex justify-end gap-3 border-t px-6 py-4">
            <Button variant="outline" onClick={() => setShowPermissionsModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowPermissionsModal(false)}>Save Permissions</Button>
          </div>
        </div>
      </div>
    );
  };

  const DocumentDetailModal = ({ document, onClose }) => {
    if (!document) return null;

    const category = CATEGORY_META[document.category] || CATEGORY_META.all;
    const Icon = category.icon;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
          <div className="flex items-start justify-between border-b px-6 py-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-gray-100 p-2">
                <Icon size={18} className="text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{document.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{document.fileName}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-2">
            <InfoItem label="Document Type" value={document.documentType} />
            <InfoItem label="Issuer" value={document.issuer} />
            <InfoItem label="Tax Year" value={document.taxYear} />
            <InfoItem label="Upload Date" value={formatDate(document.uploadDate)} />
            <InfoItem label="File Size" value={document.size} />
            <InfoItem label="Category" value={category.label} />
          </div>

          {document.notes && (
            <div className="px-6 pb-2">
              <h4 className="text-sm font-semibold text-gray-900">Notes</h4>
              <p className="mt-1 text-sm text-gray-600">{document.notes}</p>
            </div>
          )}

          <div className="px-6 pb-4">
            <h4 className="mb-2 text-sm font-semibold text-gray-900">Access History</h4>
            <div className="space-y-2">
              {(document.viewedBy || []).map((viewer, index) => (
                <div key={`${viewer}-${index}`} className="rounded-lg bg-gray-50 px-3 py-2 text-sm">
                  {viewer} • {document.lastViewed}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t px-6 py-4">
            <Button variant="outline">
              <Eye size={16} className="mr-2" />
              View Document
            </Button>
            <Button>
              <Download size={16} className="mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderDesktopTable = () => (
    <div className="hidden overflow-hidden rounded-xl border border-gray-200 lg:block">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Document
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Category
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Tax Year
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Uploaded
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {filteredDocuments.map((document) => {
            const category = CATEGORY_META[document.category] || CATEGORY_META.all;
            const Icon = category.icon;

            return (
              <tr key={document.id}>
                <td className="px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-gray-100 p-2">
                      <Icon size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{document.name}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {document.issuer} • {document.documentType}
                      </p>
                      {document.notes && (
                        <p className="mt-1 text-xs text-gray-400">{document.notes}</p>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${category.pillClass}`}
                  >
                    {category.label}
                  </span>
                </td>

                <td className="px-4 py-4 text-sm text-gray-700">{document.taxYear}</td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  {formatDate(document.uploadDate)}
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedDocument(document)}>
                      View
                    </Button>
                    <Button size="sm">
                      <Download size={14} className="mr-1" />
                      Download
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderMobileCards = () => (
    <div className="space-y-3 lg:hidden">
      {filteredDocuments.map((document) => {
        const category = CATEGORY_META[document.category] || CATEGORY_META.all;
        const Icon = category.icon;

        return (
          <Card key={document.id}>
            <Card.Body>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-gray-100 p-2">
                  <Icon size={16} className="text-gray-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">{document.name}</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {document.issuer} • {document.documentType} • {document.taxYear}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${category.pillClass}`}
                    >
                      {category.label}
                    </span>

                    <span className="text-xs text-gray-400">
                      Uploaded {formatDate(document.uploadDate)}
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedDocument(document)}>
                      View
                    </Button>
                    <Button size="sm">
                      <Download size={14} className="mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tax Documents & Statements</h1>
          <p className="mt-2 text-gray-600">
            Store official tax slips, annual statements, and supporting records for filing.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Built from your selected or suggested document setup.
          </p>
        </div>

        <div className="flex gap-3">
          <Link to="/receipts">
            <Button variant="outline">Open Receipts</Button>
          </Link>

          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowActionsMenu((prev) => !prev)}
            >
              <ChevronDown size={16} className="mr-2" />
              More
            </Button>

            {showActionsMenu && (
              <div className="absolute right-0 z-10 mt-2 w-52 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                <button
                  onClick={() => {
                    setShowAccessLogModal(true);
                    setShowActionsMenu(false);
                  }}
                  className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <History size={15} className="mr-2" />
                  Access Log
                </button>

                <button
                  onClick={() => {
                    setShowPermissionsModal(true);
                    setShowActionsMenu(false);
                  }}
                  className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Lock size={15} className="mr-2" />
                  Permissions
                </button>
              </div>
            )}
          </div>

          <Button onClick={() => setShowUploadModal(true)}>
            <Upload size={16} className="mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Total Documents</p>
            <p className="mt-2 text-3xl font-bold text-primary-600">{summary.total}</p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Categories Used</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{summary.categoriesUsed}</p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Last Upload</p>
            <p className="mt-2 text-lg font-bold text-gray-900">
              {summary.lastUpload ? formatDate(summary.lastUpload) : '—'}
            </p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Current Filter</p>
            <p className="mt-2 text-lg font-bold text-gray-900">
              {CATEGORY_META[activeCategory]?.label || 'All'}
            </p>
          </Card.Body>
        </Card>
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <Card.Body>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-700">
              {finalSlips.length} slip types
            </span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-700">
              {finalReceiptCategories.length} receipt categories
            </span>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by document name, issuer, type, or tax year"
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {visibleTabs.map((tab) => {
              const meta = CATEGORY_META[tab];
              const isActive = activeCategory === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setCategory(tab)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {meta.label} ({counts[tab] || 0})
                </button>
              );
            })}
          </div>
        </Card.Body>
      </Card>

      {loading ? (
        <Card>
          <Card.Body className="py-12 text-center text-gray-500">
            Loading tax documents...
          </Card.Body>
        </Card>
      ) : filteredDocuments.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {renderDesktopTable()}
          {renderMobileCards()}
        </>
      )}

      <UploadModal />
      <AccessLogModal />
      <PermissionsModal />
      <DocumentDetailModal
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />
    </div>
  );
};

export default Documents;
