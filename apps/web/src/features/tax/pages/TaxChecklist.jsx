import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  Eye,
  TrendingUp,
  Briefcase,
  Home,
  Car,
  Baby,
  GraduationCap,
  Heart,
  PiggyBank,
  Gift,
  AlertTriangle,
  Info,
  Sparkles,
  ArrowRight,
  Target,
  FileText,
  Percent,
  MapPin,
  Flame,
  Wrench,
  Shield,
  Smartphone,
  Hammer,
  Receipt,
  Building2,
  Package,
  Wallet,
  Clock,
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';
import { useAuth } from '../../auth/context/AuthContext';
import { PROVINCES } from 'constants/provinces';

const SLIP_CONFIG = {
  T4: {
    id: 't4',
    name: 'T4 - Employment Income',
    description: 'Statement of remuneration from employer.',
    category: 'income',
    deadline: 'February 28, 2026',
    taxSlip: true,
    estimatedValue: 45000,
    taxImpact: 'Needed to report employment income correctly.',
    icon: FileText,
    purpose: 'required',
  },
  T4A: {
    id: 't4a',
    name: 'T4A - Self-Employed / Gig Income',
    description:
      'Annual income slips or platform summaries from Uber, DoorDash, Skip, Instacart, and similar apps.',
    category: 'income',
    deadline: 'February 28, 2026',
    taxSlip: true,
    estimatedValue: 12000,
    taxImpact: 'Needed to report self-employment or gig income.',
    icon: Briefcase,
    purpose: 'required',
  },
  T5: {
    id: 't5',
    name: 'T5 - Investment Income',
    description: 'Dividends and interest from investments.',
    category: 'investment',
    deadline: 'February 28, 2026',
    taxSlip: true,
    estimatedValue: 3500,
    taxImpact: 'Needed to report investment income.',
    icon: TrendingUp,
    purpose: 'required',
  },
  T3: {
    id: 't3',
    name: 'T3 - Trust Income',
    description: 'Income from trusts and mutual funds.',
    category: 'investment',
    deadline: 'March 31, 2026',
    taxSlip: true,
    estimatedValue: 1200,
    taxImpact: 'Needed to report trust income.',
    icon: FileText,
    purpose: 'required',
  },
  T5008: {
    id: 't5008',
    name: 'T5008 - Securities Transactions',
    description: 'Stock sales and capital gains/losses.',
    category: 'investment',
    deadline: 'February 28, 2026',
    taxSlip: true,
    estimatedValue: 5000,
    taxImpact: 'Needed to report capital gains or losses.',
    icon: TrendingUp,
    purpose: 'required',
  },
  RRSP: {
    id: 'rrsp-contributions',
    name: 'RRSP Contribution Receipts',
    description: 'Receipts for RRSP contributions.',
    category: 'savings',
    deadline: 'March 1, 2026',
    taxSlip: true,
    estimatedValue: 5000,
    taxImpact: 'Can reduce your taxable income.',
    icon: PiggyBank,
    purpose: 'deduction',
  },
  FHSA: {
    id: 'fhsa-contributions',
    name: 'FHSA Contribution Receipts',
    description: 'First Home Savings Account contributions.',
    category: 'savings',
    deadline: 'December 31, 2026',
    taxSlip: true,
    estimatedValue: 8000,
    taxImpact: 'Can reduce your taxable income.',
    icon: Home,
    purpose: 'deduction',
  },
  TFSA: {
    id: 'tfsa-records',
    name: 'TFSA Records',
    description: 'Tax-Free Savings Account contribution and activity records.',
    category: 'savings',
    deadline: 'December 31, 2026',
    taxSlip: true,
    estimatedValue: 3000,
    taxImpact: 'Helpful for tax-free growth tracking and contribution room.',
    icon: Wallet,
    purpose: 'deduction',
  },
  TUITION: {
    id: 'tuition-slips',
    name: 'Tuition Slips (T2202)',
    description: 'Post-secondary education amounts.',
    category: 'education',
    deadline: 'February 28, 2026',
    taxSlip: true,
    estimatedValue: 5000,
    taxImpact: 'May increase tax credits.',
    icon: GraduationCap,
    purpose: 'deduction',
  },
  MEDICAL: {
    id: 'medical-expenses',
    name: 'Medical Expense Receipts',
    description: 'Eligible medical expenses.',
    category: 'deductions',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 1500,
    taxImpact: 'May increase medical expense credits.',
    icon: Heart,
    purpose: 'deduction',
  },
  DONATIONS: {
    id: 'charitable-donations',
    name: 'Charitable Donation Receipts',
    description: 'Donations to registered charities.',
    category: 'deductions',
    deadline: 'December 31, 2026',
    taxSlip: true,
    estimatedValue: 500,
    taxImpact: 'May increase donation credits.',
    icon: Gift,
    purpose: 'deduction',
  },
  CHILD_CARE: {
    id: 'child-care-expenses',
    name: 'Child Care Expense Receipts',
    description: 'Daycare, babysitting, and camps.',
    category: 'deductions',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 5000,
    taxImpact: 'May reduce taxable income for eligible families.',
    icon: Baby,
    purpose: 'deduction',
  },
  MOVING: {
    id: 'moving-expenses',
    name: 'Moving Expense Receipts',
    description: 'Expenses for an eligible work or school move (40km+).',
    category: 'deductions',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 2000,
    taxImpact: 'May reduce taxable income.',
    icon: Car,
    purpose: 'deduction',
  },
  RENTAL: {
    id: 'rental-income',
    name: 'Rental Income Records',
    description: 'Rental income and expense records.',
    category: 'income',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 10000,
    taxImpact: 'Needed to report rental income and expenses.',
    icon: Home,
    purpose: 'required',
  },
  FOREIGN: {
    id: 'foreign-income',
    name: 'Foreign Income Documents',
    description: 'Foreign income statements and supporting documents.',
    category: 'income',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 5000,
    taxImpact: 'Needed to report foreign income and credits.',
    icon: FileText,
    purpose: 'required',
  },
  CRYPTO: {
    id: 'crypto-transactions',
    name: 'Crypto Transaction Records',
    description: 'Cryptocurrency buys, sells, swaps, and income records.',
    category: 'investment',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 2500,
    taxImpact: 'Needed to report gains, losses, or income.',
    icon: TrendingUp,
    purpose: 'required',
  },
  BUSINESS_RECORDS: {
    id: 'business-records',
    name: 'Business Records / Statements',
    description: 'Business income, expense, and account records.',
    category: 'business',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 15000,
    taxImpact: 'Needed to support business income and expenses.',
    icon: Building2,
    purpose: 'required',
  },
  GST_HST: {
    id: 'gst-hst',
    name: 'GST / HST Records',
    description: 'GST/HST returns, remittances, and supporting records.',
    category: 'business',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 3500,
    taxImpact: 'Needed if GST/HST applies to your business.',
    icon: Percent,
    purpose: 'required',
  },
  PAYROLL: {
    id: 'payroll',
    name: 'Payroll Records',
    description: 'Employee payroll summaries and remittances.',
    category: 'business',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 8000,
    taxImpact: 'Needed for payroll and business reporting.',
    icon: Briefcase,
    purpose: 'required',
  },
  INVENTORY: {
    id: 'inventory',
    name: 'Inventory Records',
    description: 'Stock purchases, valuations, and inventory counts.',
    category: 'business',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 6000,
    taxImpact: 'Needed for inventory and cost calculations.',
    icon: Package,
    purpose: 'required',
  },
  HOME_OFFICE: {
    id: 'home-office-expenses',
    name: 'Home Office Expense Records',
    description:
      'T2200, T777, utilities, rent share, internet, and workspace expenses.',
    category: 'deductions',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 1200,
    taxImpact: 'May increase home office deductions if eligible.',
    icon: Home,
    purpose: 'deduction',
  },
};

const RECEIPT_CONFIG = {
  fuel: {
    id: 'fuel-receipts',
    name: 'Fuel Receipts',
    description: 'Recurring fuel receipts for work-related driving.',
    category: 'business',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 3200,
    taxImpact: 'Can support vehicle expense deductions.',
    icon: Flame,
    purpose: 'deduction',
  },
  maintenance: {
    id: 'maintenance-receipts',
    name: 'Maintenance & Parts Receipts',
    description: 'Oil changes, repairs, tires, and vehicle maintenance.',
    category: 'business',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 850,
    taxImpact: 'Can support vehicle expense deductions.',
    icon: Wrench,
    purpose: 'deduction',
  },
  parking_tolls: {
    id: 'parking-receipts',
    name: 'Parking & Tolls',
    description: 'Business parking and highway tolls.',
    category: 'business',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 450,
    taxImpact: 'May increase eligible business deductions.',
    icon: MapPin,
    purpose: 'deduction',
  },
  meals: {
    id: 'meals-receipts',
    name: 'Meals & Entertainment',
    description: 'Client meetings and business meals.',
    category: 'business',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 600,
    taxImpact: 'May increase eligible meal deductions.',
    icon: Receipt,
    purpose: 'deduction',
  },
  mobile_internet: {
    id: 'service-receipts',
    name: 'Mobile / Internet Bills',
    description: 'Phone and internet bills used for work.',
    category: 'business',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 1800,
    taxImpact: 'May increase business-use deductions.',
    icon: Smartphone,
    purpose: 'deduction',
  },
  supplies: {
    id: 'supplies-receipts',
    name: 'Office Supplies',
    description: 'Paper, ink, office expenses, and supplies.',
    category: 'business',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 350,
    taxImpact: 'May increase deductions.',
    icon: Receipt,
    purpose: 'deduction',
  },
  equipment: {
    id: 'equipment-receipts',
    name: 'Equipment Purchases',
    description: 'Tools, devices, and work equipment.',
    category: 'business',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 950,
    taxImpact: 'Can support capital cost allowance claims.',
    icon: Hammer,
    purpose: 'deduction',
  },
  insurance: {
    id: 'insurance-receipts',
    name: 'Insurance Receipts',
    description: 'Vehicle, business, or liability insurance.',
    category: 'business',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 1200,
    taxImpact: 'May increase eligible deductions.',
    icon: Shield,
    purpose: 'deduction',
  },
  rent_utilities: {
    id: 'rent-utilities',
    name: 'Rent / Utilities Records',
    description: 'Office rent, utilities, and related occupancy expenses.',
    category: 'business',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 4000,
    taxImpact: 'May increase business occupancy deductions.',
    icon: Home,
    purpose: 'deduction',
  },
  home_office: {
    id: 'home-office',
    name: 'Home Office Expenses',
    description: 'Workspace-at-home utility, rent, and internet support.',
    category: 'deductions',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 900,
    taxImpact: 'May increase workspace deductions.',
    icon: Home,
    purpose: 'deduction',
  },
  vehicle_expenses: {
    id: 'vehicle-expenses',
    name: 'Vehicle Expense Records',
    description:
      'Combined vehicle logs, insurance, fuel, and maintenance support.',
    category: 'business',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 2500,
    taxImpact: 'May increase vehicle-use deductions.',
    icon: Car,
    purpose: 'deduction',
  },
  vehicle_purchase: {
    id: 'vehicle-purchase',
    name: 'Vehicle Bill of Sale',
    description:
      'Bill of sale, financing or lease agreement, and purchase details for a work-use vehicle.',
    category: 'business',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 35000,
    taxImpact: 'CA review for capital asset / vehicle purchase treatment.',
    icon: Car,
    purpose: 'deduction',
  },
  payroll_expenses: {
    id: 'payroll-expenses',
    name: 'Payroll Expense Records',
    description: 'Payroll summaries, wages, and remittance support.',
    category: 'business',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 5000,
    taxImpact: 'Can support payroll expense claims.',
    icon: Briefcase,
    purpose: 'deduction',
  },
  inventory_purchases: {
    id: 'inventory-purchases',
    name: 'Inventory Purchase Records',
    description: 'Purchase invoices and stock cost records.',
    category: 'business',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 3000,
    taxImpact: 'Can support cost of goods sold.',
    icon: Package,
    purpose: 'deduction',
  },
  professional_fees: {
    id: 'professional-fees',
    name: 'Professional Fees',
    description: 'Legal, accounting, and professional service invoices.',
    category: 'business',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 1200,
    taxImpact: 'May increase deductions.',
    icon: Receipt,
    purpose: 'deduction',
  },
  other: {
    id: 'other-receipts',
    name: 'Other Receipts',
    description: 'Other eligible work or tax-related receipts.',
    category: 'business',
    deadline: 'December 31, 2026',
    taxSlip: false,
    estimatedValue: 500,
    taxImpact: 'Review for deduction eligibility.',
    icon: Receipt,
    purpose: 'deduction',
  },
};

const getDocumentRoute = (doc) => {
  const receiptCategoryMap = {
    'fuel-receipts': 'fuel',
    'maintenance-receipts': 'maintenance',
    'insurance-receipts': 'insurance',
    'service-receipts': 'mobile_internet',
    'equipment-receipts': 'equipment',
    'parking-receipts': 'parking_tolls',
    'meals-receipts': 'meals',
    'supplies-receipts': 'supplies',
    'home-office-expenses': 'home_office',
    'home-office': 'home_office',
    'vehicle-expenses': 'vehicle_expenses',
    'professional-fees': 'professional_fees',
    'other-receipts': 'other',
  };

  // ✅ If it's a receipt → ALWAYS go to list page
  if (receiptCategoryMap[doc.id]) {
    return `/receipts?category=${receiptCategoryMap[doc.id]}`;
  }

  // ✅ Keep existing behavior for NON-receipts
  if (doc.uploaded && doc.reviewId) {
    return `/receipts/${doc.reviewId}`;
  }

  const map = {
    // your existing map unchanged
  };

  return map[doc.id] || '/documents';
};

const TaxNewsBar = ({ taxNews }) => {
  const unreadNews = taxNews.filter((n) => !n.read).length;

  return (
    <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <AlertTriangle className="text-primary-600" size={24} />
            {unreadNews > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-warning-500 text-xs text-white">
                {unreadNews}
              </span>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-primary-800">Tax Updates & Reminders</h3>
            <p className="text-sm text-primary-600">
              {unreadNews} new update{unreadNews !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>

        <Button variant="outline" size="sm">
          View All Updates
        </Button>
      </div>
    </div>
  );
};

const SectionIntro = ({ icon: Icon, title, countText, tone = 'amber' }) => {
  const toneMap = {
    amber: {
      wrap: 'bg-amber-100',
      icon: 'text-amber-700',
      header: 'border-amber-200 bg-amber-50',
    },
    blue: {
      wrap: 'bg-blue-100',
      icon: 'text-blue-700',
      header: 'border-blue-200 bg-blue-50',
    },
  };

  const styles = toneMap[tone];

  return (
    <div className={`rounded-2xl border p-4 ${styles.header}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`rounded-xl p-2.5 ${styles.wrap}`}>
            <Icon size={18} className={styles.icon} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>

        {countText ? <Badge variant="info">{countText}</Badge> : null}
      </div>
    </div>
  );
};

const KnowledgeBanner = ({ profileLabel, selectedProvince, setupMode }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="info">{setupMode}</Badge>
      <Badge variant="success">{profileLabel}</Badge>
      <Badge variant="warning">{selectedProvince}</Badge>
    </div>
  );
};

const getShortBenefitLabel = (document) => {
  const map = {
    t4: 'Employment income',
    t4a: 'Gig income',
    t5: 'Investment income',
    t3: 'Trust income',
    t5008: 'Capital gains/losses',
    'business-records': 'Business income support',
    'gst-hst': 'GST/HST support',
    payroll: 'Payroll support',
    inventory: 'Inventory support',
    'fuel-receipts': 'Vehicle deduction',
    'maintenance-receipts': 'Vehicle deduction',
    'parking-receipts': 'Driving expense',
    'service-receipts': 'Work-use phone/internet',
    'vehicle-expenses': 'Vehicle expense claim',
    'vehicle-purchase': 'Vehicle purchase review',
    'insurance-receipts': 'Eligible insurance',
    'supplies-receipts': 'Office expense',
    'equipment-receipts': 'Equipment claim',
    'professional-fees': 'Accounting / legal deduction',
    'rent-utilities': 'Occupancy expense',
    'home-office': 'Workspace claim',
    'home-office-expenses': 'Workspace claim',
    'rrsp-contributions': 'Reduces taxable income',
    'fhsa-contributions': 'Reduces taxable income',
    'tfsa-records': 'Tax-free growth tracking',
    'medical-expenses': 'Medical credit',
    'charitable-donations': 'Donation credit',
    'child-care-expenses': 'Family deduction',
    'moving-expenses': 'Moving deduction',
    'tuition-slips': 'Tuition credit',
    'ccb-notice': 'Tax-free family benefit',
    'rent-receipts': 'Possible provincial credit',
    'foreign-income': 'Foreign income reporting',
    'crypto-transactions': 'Crypto reporting',
    'rental-income': 'Rental reporting',
  };

  return map[document.id] || 'Tax support';
};

const getDocumentCountLabel = (document) => {
  const count = document.uploadedCount || 0;

  if (document.taxSlip) {
    if (count <= 0) return '0 slips added';
    if (count === 1) return '1 slip added';
    return `${count} slips added`;
  }

  if (count <= 0) return '0 receipts added';
  if (count === 1) return '1 receipt added';
  return `${count} receipts added`;
};

const CompactActionCard = ({ document, mode = 'required' }) => {
  const Icon = document.icon;
  const uploaded = !!document.uploaded;
  const countLabel = getDocumentCountLabel(document);

  const statusLabel = uploaded
    ? 'Added'
    : mode === 'required'
      ? 'Required'
      : 'Can help';

  const subLabel =
    mode === 'required' ? 'Needed to file' : getShortBenefitLabel(document);

  return (
    <div
      className={`rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${
        mode === 'required'
          ? uploaded
            ? 'border-emerald-200 bg-emerald-50/40'
            : 'border-amber-200 bg-amber-50/50'
          : uploaded
            ? 'border-emerald-200 bg-white'
            : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <div
            className={`rounded-xl p-3 ${
              uploaded
                ? 'bg-emerald-100'
                : mode === 'required'
                  ? 'bg-amber-100'
                  : 'bg-blue-100'
            }`}
          >
            <Icon
              size={18}
              className={
                uploaded
                  ? 'text-emerald-700'
                  : mode === 'required'
                    ? 'text-amber-700'
                    : 'text-blue-700'
              }
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-gray-900">
                {document.name}
              </h3>

              {document.taxSlip && (
                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-medium text-sky-700">
                  Tax Slip
                </span>
              )}
            </div>

            <p className="mt-1 text-sm font-medium text-gray-700">{subLabel}</p>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  uploaded
                    ? 'bg-emerald-100 text-emerald-700'
                    : mode === 'required'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                }`}
              >
                {statusLabel}
              </span>

              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                {countLabel}
              </span>

              {document.estimatedValue > 0 && (
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                  Est. ${document.estimatedValue.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="shrink-0">
          <Link to={getDocumentRoute(document)}>
            <Button size="sm" variant={uploaded ? 'outline' : 'primary'}>
              {uploaded ? (
                <>
                  <Eye size={14} className="mr-1" />
                  Review
                </>
              ) : (
                <>
                  <Upload size={14} className="mr-1" />
                  {mode === 'required' ? 'Upload' : 'Add'}
                </>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const ReasonGroup = ({ title, documents }) => {
  if (!documents.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          {title}
        </h3>
        <span className="text-xs text-gray-400">{documents.length} items</span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {documents.map((document) => (
          <CompactActionCard key={document.id} document={document} mode="saving" />
        ))}
      </div>
    </div>
  );
};

const SavingsItem = ({ label, amount, isHighlighted }) => (
  <div
    className={`flex items-center justify-between rounded-lg px-3 py-2 ${
      isHighlighted ? 'bg-green-50 text-green-700' : 'text-gray-700'
    }`}
  >
    <span className="text-sm">{label}</span>
    <span className="font-medium">${amount.toFixed(2)}</span>
  </div>
);

const TaxChecklist = () => {
  const { user } = useAuth();

  const [taxNews] = useState([
    {
      id: 1,
      title: 'Review all slips before filing',
      date: '2026-03-15',
      content: 'Make sure all selected and suggested documents are reviewed before filing.',
      priority: 'high',
      read: false,
    },
    {
      id: 2,
      title: 'FHSA and RRSP records can affect your deduction room',
      date: '2026-03-10',
      content: 'Keep contribution records organized for faster tax preparation.',
      priority: 'medium',
      read: false,
    },
    {
      id: 3,
      title: 'Receipt categories can be updated later',
      date: '2026-03-01',
      content: 'You can manage receipt categories from your profile and documents flow.',
      priority: 'low',
      read: true,
    },
  ]);

  const selectedProvince = user?.province || user?.businessInfo?.province || 'ON';

  const selectedSlips = user?.documentPreferences?.selectedSlips || [];
  const selectedReceiptCategories =
    user?.documentPreferences?.selectedReceiptCategories || [];
  const suggestedSlips = user?.onboarding?.suggestedSlips || [];
  const suggestedReceiptCategories =
    user?.onboarding?.suggestedReceiptCategories || [];

  const profileFlags = useMemo(() => {
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
  }, [user]);

  const finalSlips = useMemo(() => {
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
      (profileFlags.employment || profileFlags.gig || profileFlags.business || profileFlags.rrsp) &&
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
  }, [selectedSlips, suggestedSlips, profileFlags]);

  const finalReceiptCategories = useMemo(() => {
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

    if (
      user?.vehiclePurchase?.wantsBillOfSaleUpload &&
      !baseCategories.includes('vehicle_purchase')
    ) {
      baseCategories.push('vehicle_purchase');
    }

    return Array.from(new Set(baseCategories));
  }, [
    selectedReceiptCategories,
    suggestedReceiptCategories,
    profileFlags.gig,
    profileFlags.business,
    profileFlags.workFromHome,
    user?.vehiclePurchase?.wantsBillOfSaleUpload,
  ]);

  const profileLabel = useMemo(() => {
    const items = [];

    if (profileFlags.employment) items.push('Employed');
    if (profileFlags.gig) items.push('Gig / Self-employed');
    if (profileFlags.business) items.push('Business Owner');
    if (profileFlags.investments) items.push('Investments');
    if (profileFlags.fhsa) items.push('FHSA');
    if (profileFlags.tfsa) items.push('TFSA');
    if (profileFlags.hasChildren || profileFlags.ccb) items.push('Family / CCB');

    return items.length ? items.join(' • ') : 'General tax profile';
  }, [profileFlags]);

  const getDocumentChecklist = () => {
    const uploadedSeed = new Set([
      'T4',
      'RRSP',
      ...(profileFlags.gig ? ['fuel'] : []),
      ...(user?.vehiclePurchase?.uploaded ? ['vehicle_purchase'] : []),
    ]);

    const slipDocs = finalSlips
      .map((slipKey) => {
        const config = SLIP_CONFIG[slipKey];
        if (!config) return null;

        const uploaded = uploadedSeed.has(slipKey);

        return {
          ...config,
          uploaded,
          uploadedCount: uploaded ? 1 : 0,
          reviewId: null,
          notRequired: false,
          source: selectedSlips.includes(slipKey) ? 'selected' : 'suggested',
        };
      })
      .filter(Boolean);

    const receiptDocs = finalReceiptCategories
      .map((receiptKey) => {
        const config = RECEIPT_CONFIG[receiptKey];
        if (!config) return null;

        const uploaded = uploadedSeed.has(receiptKey);

        const reviewIdMap = {
          fuel: 'fuel-001',
          maintenance: 'maintenance-001',
          parking_tolls: 'parking-001',
          meals: 'meals-001',
          mobile_internet: 'mobile-001',
          supplies: 'supplies-001',
          equipment: 'equipment-001',
          insurance: 'insurance-001',
          rent_utilities: 'rent-001',
          home_office: 'home-office-001',
          vehicle_expenses: 'vehicle-001',
          vehicle_purchase: 'vehicle-purchase-001',
          payroll_expenses: 'payroll-expense-001',
          inventory_purchases: 'inventory-purchase-001',
          professional_fees: 'professional-fees-001',
          other: 'other-001',
        };

        return {
          ...config,
          uploaded,
          uploadedCount: uploaded ? (receiptKey === 'fuel' ? 2 : 1) : 0,
          reviewId: uploaded ? reviewIdMap[receiptKey] || null : null,
          notRequired: false,
          source: selectedReceiptCategories.includes(receiptKey)
            ? 'selected'
            : 'suggested',
        };
      })
      .filter(Boolean);

    const extraDocs = [];

    if (profileFlags.ccb || user?.hasChildren) {
      extraDocs.push({
        id: 'ccb-notice',
        name: 'Canada Child Benefit Notice',
        description: 'CRA child benefit notice and family benefit details.',
        category: 'benefits',
        deadline: 'July 2026',
        taxSlip: false,
        estimatedValue: 7200,
        taxImpact: 'Tax-free family benefit support and helpful for family tax planning.',
        uploaded: false,
        uploadedCount: 0,
        notRequired: false,
        icon: Baby,
        source: 'profile',
        purpose: 'deduction',
      });
    }

    if (selectedProvince === 'QC' || selectedProvince === 'MB') {
      extraDocs.push({
        id: 'rent-receipts',
        name: 'Rent Receipts',
        description: 'Rent paid for principal residence.',
        category: 'credits',
        deadline: 'December 31, 2026',
        taxSlip: false,
        estimatedValue: 12000,
        taxImpact: 'May help with provincial credits if applicable.',
        uploaded: false,
        uploadedCount: 0,
        notRequired: false,
        icon: Home,
        source: 'province',
        purpose: 'deduction',
      });
    }

    const combined = [...slipDocs, ...receiptDocs, ...extraDocs];

    const uniqueById = new Map();
    combined.forEach((doc) => {
      if (!uniqueById.has(doc.id)) {
        uniqueById.set(doc.id, doc);
      }
    });

    return Array.from(uniqueById.values());
  };

  const allDocuments = useMemo(() => getDocumentChecklist(), [
    finalSlips,
    finalReceiptCategories,
    selectedProvince,
    user?.hasChildren,
    user?.vehiclePurchase?.wantsBillOfSaleUpload,
    user?.vehiclePurchase?.uploaded,
    selectedSlips,
    selectedReceiptCategories,
    profileFlags.gig,
    profileFlags.ccb,
  ]);

  const requiredDocuments = useMemo(
    () => allDocuments.filter((doc) => doc.purpose !== 'deduction'),
    [allDocuments]
  );

  const taxSavingDocuments = useMemo(
    () => allDocuments.filter((doc) => doc.purpose === 'deduction'),
    [allDocuments]
  );

  const uploadedRequired = requiredDocuments.filter((doc) => doc.uploaded).length;
  const uploadedSavings = taxSavingDocuments.filter((doc) => doc.uploaded).length;

  const groupedSavingDocs = useMemo(() => {
    const workExpenseIds = new Set([
      'fuel-receipts',
      'maintenance-receipts',
      'parking-receipts',
      'service-receipts',
      'vehicle-expenses',
      'vehicle-purchase',
      'insurance-receipts',
      'meals-receipts',
      'supplies-receipts',
      'equipment-receipts',
      'professional-fees',
      'rent-utilities',
      'home-office',
      'home-office-expenses',
      'payroll-expenses',
      'inventory-purchases',
      'other-receipts',
    ]);

    const savingsIds = new Set([
      'rrsp-contributions',
      'fhsa-contributions',
      'tfsa-records',
    ]);

    const personalCreditIds = new Set([
      'medical-expenses',
      'charitable-donations',
      'child-care-expenses',
      'moving-expenses',
      'tuition-slips',
      'ccb-notice',
      'rent-receipts',
    ]);

    const workRelated = taxSavingDocuments.filter((doc) => workExpenseIds.has(doc.id));
    const savingsRelated = taxSavingDocuments.filter((doc) => savingsIds.has(doc.id));
    const personalCredits = taxSavingDocuments.filter((doc) =>
      personalCreditIds.has(doc.id)
    );

    const groups = [];

    if (workRelated.length) {
      groups.push({
        key: 'work-related',
        title: 'Work / gig / business expenses',
        documents: workRelated,
      });
    }

    if (savingsRelated.length) {
      groups.push({
        key: 'savings-related',
        title: 'Savings and tax-advantaged accounts',
        documents: savingsRelated,
      });
    }

    if (personalCredits.length) {
      groups.push({
        key: 'personal-credits',
        title: 'Personal credits and family benefits',
        documents: personalCredits,
      });
    }

    return groups;
  }, [taxSavingDocuments]);

  const provinceInfo = PROVINCES.find((p) => p.id === selectedProvince);

  const calculateTaxSavings = () => {
    const taxRate = provinceInfo?.hst || provinceInfo?.gst || 5;

    const rrspSavings = finalSlips.includes('RRSP') ? 5000 * (taxRate / 100) : 0;
    const fhsaSavings = finalSlips.includes('FHSA') ? 8000 * (taxRate / 100) : 0;
    const donationSavings = finalSlips.includes('DONATIONS') ? 500 * 0.25 : 0;
    const medicalSavings = finalSlips.includes('MEDICAL') ? 1500 * 0.15 : 0;
    const businessSavings =
      finalSlips.includes('T4A') ||
      finalSlips.includes('BUSINESS_RECORDS') ||
      finalReceiptCategories.length > 0
        ? 1250
        : 0;

    return {
      rrsp: rrspSavings,
      fhsa: fhsaSavings,
      donations: donationSavings,
      medical: medicalSavings,
      business: businessSavings,
      total:
        rrspSavings + fhsaSavings + donationSavings + medicalSavings + businessSavings,
    };
  };

  const taxSavings = calculateTaxSavings();

  const setupMode = user?.documentPreferences?.skippedAtRegistration
    ? 'Skipped at registration'
    : user?.documentPreferences?.needsSuggestions
      ? 'Suggested by app'
      : 'Selected by user';

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <TaxNewsBar taxNews={taxNews} />

      <div className="space-y-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tax Checklist</h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload what is required first, then add tax-saving and benefit-related items that apply to you.
          </p>
        </div>

        <KnowledgeBanner
          profileLabel={profileLabel}
          selectedProvince={selectedProvince}
          setupMode={setupMode}
        />
      </div>

      <div className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <SectionIntro
              icon={Target}
              title="Needed to file"
              countText={`${uploadedRequired}/${requiredDocuments.length} added`}
              tone="amber"
            />

            <div className="space-y-3">
              {requiredDocuments.length > 0 ? (
                requiredDocuments.map((document) => (
                  <CompactActionCard
                    key={document.id}
                    document={document}
                    mode="required"
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-500">
                  No required filing items are showing yet for this profile.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <SectionIntro
              icon={Sparkles}
              title="Can save tax or improve benefits"
              countText={`${uploadedSavings}/${taxSavingDocuments.length} added`}
              tone="blue"
            />

            <div className="space-y-5">
              {groupedSavingDocs.length > 0 ? (
                groupedSavingDocs.map((group) => (
                  <ReasonGroup
                    key={group.key}
                    title={group.title}
                    documents={group.documents}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-500">
                  No extra tax-saving opportunities are showing yet for this profile.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="border-blue-200 bg-blue-50">
            <Card.Body className="p-4">
              <div className="mb-3 flex items-center">
                <Info size={18} className="mr-2 text-blue-600" />
                <h3 className="text-sm font-semibold text-blue-800">
                  How this helps you
                </h3>
              </div>

              <p className="text-sm leading-6 text-blue-700">
                Upload required items first. Then add tax-saving or tax-helpful items
                that apply to you, such as car insurance, fuel, maintenance, mobile bills,
                home office costs, RRSP or FHSA contributions, TFSA records, tuition,
                medical receipts, donations, child care, and CCB notices for family support.
              </p>
            </Card.Body>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <Card.Body className="p-4">
              <div className="mb-3 flex items-center">
                <TrendingUp className="mr-2 text-green-600" size={18} />
                <h3 className="text-sm font-semibold text-green-800">
                  Potential tax savings
                </h3>
              </div>

              <p className="mb-3 text-2xl font-bold text-green-700">
                ${taxSavings.total.toFixed(2)}
              </p>

              <div className="space-y-1.5 text-xs">
                <SavingsItem
                  label="RRSP / FHSA"
                  amount={taxSavings.rrsp + taxSavings.fhsa}
                />
                <SavingsItem label="Donations" amount={taxSavings.donations} />
                <SavingsItem label="Medical" amount={taxSavings.medical} />
                <SavingsItem label="Business / Gig" amount={taxSavings.business} />
                <div className="border-t border-green-200 pt-2">
                  <SavingsItem
                    label="Total estimated opportunity"
                    amount={taxSavings.total}
                    isHighlighted
                  />
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body className="p-4">
              <div className="mb-3 flex items-center">
                <Clock size={18} className="mr-2 text-amber-600" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Savings deadlines
                </h3>
              </div>

              <div className="space-y-2">
                <div className="rounded-lg bg-gray-50 p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium">RRSP deadline</p>
                      <p className="text-[11px] text-gray-500">March 1, 2026</p>
                    </div>
                    <Badge variant="warning">Soon</Badge>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium">Tax filing deadline</p>
                      <p className="text-[11px] text-gray-500">April 30, 2026</p>
                    </div>
                    <Badge variant="info">Upcoming</Badge>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium">GST/HST filing</p>
                      <p className="text-[11px] text-gray-500">April 30, 2026</p>
                    </div>
                    <Badge variant="info">Upcoming</Badge>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="border-slate-200 bg-slate-50">
            <Card.Body className="p-4">
              <div className="mb-3 flex items-center">
                <Sparkles size={18} className="mr-2 text-slate-600" />
                <h3 className="text-sm font-semibold text-slate-800">
                  Did you know?
                </h3>
              </div>

              <p className="text-sm leading-6 text-slate-700">
                The best order is: upload income slips first, then add work and
                deduction documents that apply to your profile. This helps show income
                and tax-saving opportunities clearly.
              </p>

              <div className="mt-4">
                <Link
                  to="/documents"
                  className="inline-flex items-center text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  Review document pages
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaxChecklist;
