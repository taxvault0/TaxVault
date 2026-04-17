import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  MapPin,
  FileText,
  TrendingUp,
  DollarSign,
  Clock,
  AlertTriangle,
  Briefcase,
  Car,
  Receipt,
  ChevronRight,
  ChevronDown,
  Building2,
  CheckCircle2,
  PiggyBank,
  Landmark,
  Home,
  Gift,
  Wallet,
  BadgeDollarSign,
  Store,
  Package,
  Percent,
  HeartHandshake,
  Target,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Stethoscope,
} from 'lucide-react';

import { useAuth } from '../../auth/context/AuthContext';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';
import { buildHouseholdProfile, getOptionalProfiles } from 'utils/taxProfile';

const SLIP_LABELS = {
  T4: 'T4 Employment Slip',
  T4A: 'T4A Contract / Gig Income',
  T5: 'T5 Investment Income',
  T3: 'T3 Trust Income',
  T5008: 'T5008 Securities Transactions',
  RRSP: 'RRSP Contribution Receipt',
  FHSA: 'FHSA Contribution Record',
  TFSA: 'TFSA Records',
  TUITION: 'Tuition / T2202',
  MEDICAL: 'Medical Receipts',
  DONATIONS: 'Donation Receipts',
  CHILD_CARE: 'Child Care Receipts',
  MOVING: 'Moving Expense Records',
  RENTAL: 'Rental Income Records',
  FOREIGN: 'Foreign Income Documents',
  CRYPTO: 'Crypto Transaction Records',
  BUSINESS_RECORDS: 'Business Records / Statements',
  GST_HST: 'GST / HST Records',
  PAYROLL: 'Payroll Records',
  INVENTORY: 'Inventory Records',
  HOME_OFFICE: 'Home Office Records',
};

const RECEIPT_LABELS = {
  fuel: 'Fuel',
  maintenance: 'Maintenance',
  parking_tolls: 'Parking / Tolls',
  meals: 'Meals',
  mobile_internet: 'Mobile / Internet',
  supplies: 'Supplies',
  equipment: 'Equipment',
  insurance: 'Insurance',
  rent_utilities: 'Rent / Utilities',
  home_office: 'Home Office',
  vehicle_expenses: 'Vehicle Expenses',
  payroll_expenses: 'Payroll Expenses',
  inventory_purchases: 'Inventory Purchases',
  professional_fees: 'Professional Fees',
  other: 'Other Receipts',
};

const OPTIONAL_PROFILE_TO_SLIP = {
  TFSA: 'TFSA',
  RRSP: 'RRSP',
  FHSA: 'FHSA',
  Investments: 'T5',
  Donations: 'DONATIONS',
};

const GIG_PLATFORM_CONFIG = {
  uber: {
    name: 'Uber Records',
    description: 'Trip earnings, payouts, and annual tax summaries',
    to: '/documents?category=uber',
    icon: Car,
  },
  doordash: {
    name: 'DoorDash Records',
    description: 'Delivery earnings, payouts, and tax summaries',
    to: '/documents?category=doordash',
    icon: Receipt,
  },
  skip: {
    name: 'Skip Records',
    description: 'Order earnings, payouts, and yearly records',
    to: '/documents?category=skip',
    icon: FileText,
  },
  instacart: {
    name: 'Instacart Records',
    description: 'Shopper earnings, payouts, and tax summaries',
    to: '/documents?category=instacart',
    icon: Store,
  },
};

const money = (value) =>
  new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(Math.max(0, Number(value || 0)));

const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const getSlipRoute = (slip, isSpouse = false) => {
  const prefix = isSpouse ? 'spouse-' : '';

  switch (slip) {
    case 'T4':
      return `/documents?category=${prefix}t4`;
    case 'T4A':
      return isSpouse ? '/documents?category=spouse-gig' : '/documents?category=t4a';
    case 'RRSP':
      return `/documents?category=${prefix}rrsp`;
    case 'FHSA':
      return `/documents?category=${prefix}fhsa`;
    case 'TFSA':
      return `/documents?category=${prefix}tfsa`;
    case 'TUITION':
      return `/documents?category=${prefix}tuition`;
    case 'MEDICAL':
      return `/documents?category=${prefix}medical`;
    case 'DONATIONS':
      return `/documents?category=${prefix}donations`;
    case 'CHILD_CARE':
      return `/documents?category=${prefix}child-care`;
    case 'MOVING':
      return `/documents?category=${prefix}moving`;
    case 'T5':
    case 'T3':
    case 'T5008':
      return `/documents?category=${prefix}investments`;
    case 'RENTAL':
      return `/documents?category=${prefix}rental`;
    case 'FOREIGN':
      return `/documents?category=${prefix}foreign-income`;
    case 'CRYPTO':
      return `/documents?category=${prefix}crypto`;
    case 'BUSINESS_RECORDS':
      return isSpouse ? '/documents?category=spouse-business' : '/business/sales-income';
    case 'GST_HST':
      return isSpouse ? '/documents?category=spouse-business' : '/business/gst-records';
    case 'PAYROLL':
      return isSpouse ? '/documents?category=spouse-business' : '/business/payroll';
    case 'INVENTORY':
      return isSpouse ? '/documents?category=spouse-business' : '/business/inventory';
    case 'HOME_OFFICE':
      return '/receipts';
    default:
      return '/documents';
  }
};

const getReceiptRoute = (receipt) => {
  switch (receipt) {
    case 'rent_utilities':
      return '/business/rent-utilities';
    case 'payroll_expenses':
      return '/business/payroll';
    case 'inventory_purchases':
      return '/business/inventory';
    default:
      return '/receipts';
  }
};

const getPersonBusinessName = (person, fallback) =>
  person?.businessInfo?.businessName ||
  person?.businessName ||
  person?.companyName ||
  fallback;

const getHouseholdMedicalRoute = () => '/documents?category=medical';
const getHouseholdDonationsRoute = () => '/documents?category=donations';
const getHouseholdCcbRoute = () => '/accounts';

const HouseholdSummaryCard = ({ household }) => {
  const spouse = household.spouse;

  return (
    <Card className="border-indigo-200 bg-indigo-50">
      <Card.Body>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-900">Household Tax Summary</p>
            <p className="mt-1 text-sm text-indigo-700">
              Your dashboard includes both your tax profile and your spouse profile.
            </p>
          </div>

          {/* <div className="flex flex-wrap gap-2">
            {household.user.employment && <Badge variant="info">You: T4</Badge>}
            {household.user.gigWork && <Badge variant="success">You: Gig</Badge>}
            {household.user.business && <Badge variant="warning">You: Business</Badge>}
            {spouse?.employment && <Badge variant="info">Spouse: T4</Badge>}
            {spouse?.gigWork && <Badge variant="success">Spouse: Gig</Badge>}
            {spouse?.business && <Badge variant="warning">Spouse: Business</Badge>}
            {spouse?.unemployed && <Badge variant="default">Spouse: Unemployed</Badge>}
          </div> */}
        </div>
      </Card.Body>
    </Card>
  );
};

const SavingOpportunityCard = ({ item }) => {
  const Icon = item.icon;
  const progress = clamp(item.progress || 0);
  const remaining = Math.max(0, item.maxSaving - item.currentSaving);

  return (
    <Link
      to={item.to}
      className="group rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.iconBg}`}>
          <Icon size={18} className={item.iconColor} />
        </div>
        <Badge variant={item.variant || 'success'}>{item.tag}</Badge>
      </div>

      <div className="mt-3">
        <h3 className="text-xs font-semibold text-gray-900">{item.title}</h3>
        <p className="mt-0.5 text-[11px] leading-4 text-gray-500">{item.description}</p>
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-gray-500">Captured</span>
          <span className="font-medium text-gray-700">
            {money(item.currentSaving)} / {money(item.maxSaving)}
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="font-medium text-green-700">{money(remaining)} still possible</span>
          <span className="text-gray-400 group-hover:text-gray-600">Open</span>
        </div>
      </div>
    </Link>
  );
};

const SectionCard = ({ title, icon: Icon, colorClass, children, description, action }) => (
  <Card className={`border-l-4 ${colorClass}`}>
    <Card.Header>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center text-lg font-bold">
            <Icon size={20} className="mr-2" />
            {title}
          </h3>
          {description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : null}
        </div>
        {action || null}
      </div>
    </Card.Header>
    <Card.Body>{children}</Card.Body>
  </Card>
);

const PersonSubCard = ({ title, icon: Icon, items, emptyText = 'Nothing required here right now.' }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-4">
    <div className="mb-4 flex items-center gap-2">
      <div className="rounded-xl bg-gray-100 p-2 text-gray-700">
        <Icon size={16} />
      </div>
      <h4 className="font-semibold text-gray-900">{title}</h4>
    </div>

    {items.length > 0 ? (
      <div className="space-y-3">
        {items.map((item) => {
          const ItemIcon = item.icon || FileText;

          return (
            <Link
              key={item.name}
              to={item.to}
              className="flex items-start justify-between gap-3 rounded-xl bg-gray-50 p-3 transition hover:bg-gray-100"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-white p-2 text-gray-700 shadow-sm">
                  <ItemIcon size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </div>
              <ChevronRight size={16} className="mt-1 shrink-0 text-gray-400" />
            </Link>
          );
        })}
      </div>
    ) : (
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
        {emptyText}
      </div>
    )}
  </div>
);

const AttentionAccordionItem = ({
  id,
  title,
  items,
  icon: Icon,
  tone = 'blue',
  isOpen,
  onToggle,
  previewCount = 1,
}) => {
  if (!items?.length) return null;

  const styles = {
    blue: {
      card: 'border-blue-200 bg-blue-50/70 hover:bg-blue-50',
      icon: 'bg-blue-100 text-blue-700',
      badge: 'bg-blue-100 text-blue-700',
      accent: 'text-blue-800',
    },
    green: {
      card: 'border-emerald-200 bg-emerald-50/70 hover:bg-emerald-50',
      icon: 'bg-emerald-100 text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-700',
      accent: 'text-emerald-800',
    },
    indigo: {
      card: 'border-indigo-200 bg-indigo-50/70 hover:bg-indigo-50',
      icon: 'bg-indigo-100 text-indigo-700',
      badge: 'bg-indigo-100 text-indigo-700',
      accent: 'text-indigo-800',
    },
    purple: {
      card: 'border-purple-200 bg-purple-50/70 hover:bg-purple-50',
      icon: 'bg-purple-100 text-purple-700',
      badge: 'bg-purple-100 text-purple-700',
      accent: 'text-purple-800',
    },
  }[tone];

  const previewItems = items.slice(0, previewCount);

  return (
    <div className={`overflow-hidden rounded-2xl border transition ${styles.card}`}>
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full px-4 py-3 text-left"
        aria-expanded={isOpen}
        aria-controls={`attention-panel-${id}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}>
                <Icon size={17} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={`truncate text-sm font-semibold ${styles.accent}`}>{title}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${styles.badge}`}>
                    {items.length}
                  </span>
                </div>

                {!isOpen && previewItems.length > 0 && (
                  <p className="mt-1 truncate text-xs text-gray-600">
                    {previewItems[0].text}
                    {items.length > 1 ? ` +${items.length - 1} more` : ''}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-1 text-gray-500">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
        </div>
      </button>

      {isOpen && (
        <div id={`attention-panel-${id}`} className="border-t border-white/70 px-3 pb-3 pt-2">
          <div className="space-y-2">
            {items.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                className="flex items-start justify-between gap-3 rounded-xl bg-white px-3 py-2.5 text-sm text-gray-800 shadow-sm transition hover:bg-gray-50"
              >
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2">{item.text}</p>
                </div>
                <ChevronRight size={16} className="mt-0.5 shrink-0 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const WhatNeedsAttentionSection = ({
  employmentAttention,
  gigAttention,
  businessAttention,
  receiptAttention,
  householdAttention,
  registeredAccountsAttention,
}) => {
  const groups = useMemo(
    () =>
      [
        {
          id: 'employment',
          title: 'Employment',
          icon: Briefcase,
          tone: 'blue',
          items: employmentAttention,
          priority: 1,
        },
        {
          id: 'gig',
          title: 'Gig / Self-Employment',
          icon: Car,
          tone: 'green',
          items: gigAttention,
          priority: 2,
        },
        {
          id: 'business',
          title: 'Business',
          icon: Store,
          tone: 'indigo',
          items: businessAttention,
          priority: 3,
        },
        {
          id: 'receipts',
          title: 'Receipt Categories',
          icon: Receipt,
          tone: 'green',
          items: receiptAttention,
          priority: 4,
        },
        {
          id: 'household',
          title: 'Household Tax Items',
          icon: HeartHandshake,
          tone: 'purple',
          items: householdAttention,
          priority: 5,
        },
        {
          id: 'accounts',
          title: 'Registered Accounts',
          icon: Landmark,
          tone: 'purple',
          items: registeredAccountsAttention,
          priority: 6,
        },
      ]
        .filter((group) => group.items?.length > 0)
        .sort((a, b) => {
          if (b.items.length !== a.items.length) return b.items.length - a.items.length;
          return a.priority - b.priority;
        }),
    [
      employmentAttention,
      gigAttention,
      businessAttention,
      receiptAttention,
      householdAttention,
      registeredAccountsAttention,
    ]
  );

  const [openGroup, setOpenGroup] = useState(groups[0]?.id ?? null);

  const totalItems = groups.reduce((sum, group) => sum + group.items.length, 0);
  const urgentItems = groups.flatMap((group) => group.items).slice(0, 3);

  if (!groups.length) return null;

  return (
    <Card>
      <Card.Header>
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="flex items-center text-xl font-bold">
              <AlertTriangle size={20} className="mr-2 text-primary-500" />
              What Needs Attention
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Prioritized actions first, with compact expandable groups.
            </p>
          </div>

          {urgentItems.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-amber-900">Top actions</p>
                <Badge variant="warning">{totalItems} total</Badge>
              </div>

              <div className="space-y-2">
                {urgentItems.map((item) => (
                  <Link
                    key={`urgent-${item.key}`}
                    to={item.to}
                    className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm text-gray-800 transition hover:bg-gray-50"
                  >
                    <span className="truncate">{item.text}</span>
                    <ChevronRight size={16} className="shrink-0 text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card.Header>

      <Card.Body>
        <div className="space-y-3">
          {groups.map((group) => (
            <AttentionAccordionItem
              key={group.id}
              id={group.id}
              title={group.title}
              icon={group.icon}
              tone={group.tone}
              items={group.items}
              isOpen={openGroup === group.id}
              onToggle={(id) => setOpenGroup((prev) => (prev === id ? null : id))}
            />
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

const ReceiptCategoryGrid = ({ categories }) => {
  if (!categories.length) return null;

  return (
    <SectionCard
      title="Receipt Categories"
      icon={Receipt}
      colorClass="border-emerald-500"
      description="Keep all recurring deduction-related receipts in one place."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((receipt) => (
          <Link
            key={receipt}
            to={getReceiptRoute(receipt)}
            className="rounded-xl bg-gray-50 p-4 transition hover:bg-gray-100"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Receipt size={16} />
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {RECEIPT_LABELS[receipt] || receipt}
                </p>
                <p className="text-xs text-gray-500">Track this to reduce missed deductions</p>
              </div>
              <ChevronRight size={16} className="mt-1 shrink-0 text-gray-400" />
            </div>
          </Link>
        ))}
      </div>
    </SectionCard>
  );
};

const HouseholdTaxDocumentsSection = ({
  householdItems,
  myOptionalProfiles,
  spouseOptionalProfiles,
  hasSpouse,
}) => {
  const iconMap = {
    TFSA: Landmark,
    RRSP: PiggyBank,
    FHSA: Home,
    Investments: TrendingUp,
  };

  const personalItems = (profiles) =>
    profiles
      .filter((item) => ['TFSA', 'RRSP', 'FHSA', 'Investments'].includes(item.label))
      .map((item) => ({
        name: item.label,
        description: 'Manage related records',
        to: item.to,
        icon: iconMap[item.label] || FileText,
      }));

  const householdDocCards = householdItems.map((item) => ({
    name: item.label,
    description: item.description,
    to: item.to,
    icon: item.icon,
  }));

  return (
    <SectionCard
      title="Household Tax Documents"
      icon={Wallet}
      colorClass="border-purple-500"
      description="Household-managed items stay together, while registered accounts remain person-specific."
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-xl bg-gray-100 p-2 text-gray-700">
              <HeartHandshake size={16} />
            </div>
            <h4 className="font-semibold text-gray-900">Household Items</h4>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {householdDocCards.map((item) => {
              const Icon = item.icon || FileText;
              return (
                <Link
                  key={item.name}
                  to={item.to}
                  className="rounded-xl bg-gray-50 p-4 transition hover:bg-gray-100"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                        <Icon size={16} />
                      </div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                    <ChevronRight size={16} className="mt-1 shrink-0 text-gray-400" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className={`grid grid-cols-1 gap-4 ${hasSpouse ? 'lg:grid-cols-2' : ''}`}>
          <PersonSubCard
            title="Your Registered Accounts"
            icon={User}
            items={personalItems(myOptionalProfiles)}
            emptyText="No personal registered tax accounts selected for you."
          />

          {hasSpouse && (
            <PersonSubCard
              title="Spouse Registered Accounts"
              icon={Users}
              items={personalItems(spouseOptionalProfiles)}
              emptyText="No personal registered tax accounts selected for spouse."
            />
          )}
        </div>
      </div>
    </SectionCard>
  );
};

const Dashboard = () => {
  const { user } = useAuth();

  const household = useMemo(() => buildHouseholdProfile(user), [user]);
  const profile = household.user;
  const spouse = household.spouse;
  const hasSpouse = household.hasSpouse;

  const myOptionalProfiles = getOptionalProfiles(profile);
  const spouseOptionalProfiles = getOptionalProfiles(spouse || {});

  const selectedSlips = user?.documentPreferences?.selectedSlips || [];
  const selectedReceiptCategories = user?.documentPreferences?.selectedReceiptCategories || [];
  const suggestedSlips = user?.onboarding?.suggestedSlips || [];
  const suggestedReceiptCategories = user?.onboarding?.suggestedReceiptCategories || [];

  const baseSlipKeys = useMemo(() => {
    const merged = new Set([...selectedSlips, ...suggestedSlips]);

    if (profile.employment) merged.add('T4');
    if (profile.gigWork || profile.selfEmployment) merged.add('T4A');

    if (profile.business) {
      merged.add('BUSINESS_RECORDS');
      merged.add('GST_HST');
      merged.add('PAYROLL');
      merged.add('INVENTORY');
    }

    myOptionalProfiles.forEach((item) => {
      const mapped = OPTIONAL_PROFILE_TO_SLIP[item.label];
      if (mapped) merged.add(mapped);
    });

    return Array.from(merged);
  }, [selectedSlips, suggestedSlips, profile, myOptionalProfiles]);

  const finalReceiptCategories = useMemo(() => {
    const merged = new Set([...selectedReceiptCategories, ...suggestedReceiptCategories]);

    if (profile.gigWork) {
      merged.add('fuel');
      merged.add('maintenance');
      merged.add('parking_tolls');
      merged.add('mobile_internet');
      merged.add('vehicle_expenses');
      merged.add('insurance');
      merged.add('meals');
    }

    if (profile.selfEmployment) {
      merged.add('mobile_internet');
      merged.add('supplies');
      merged.add('equipment');
      merged.add('professional_fees');
      merged.add('home_office');
      merged.add('meals');
    }

    if (profile.business) {
      merged.add('rent_utilities');
      merged.add('payroll_expenses');
      merged.add('inventory_purchases');
      merged.add('insurance');
      merged.add('supplies');
      merged.add('equipment');
      merged.add('professional_fees');
    }

    return Array.from(merged);
  }, [selectedReceiptCategories, suggestedReceiptCategories, profile]);

  const spouseReceiptCategories = useMemo(() => {
    if (!hasSpouse) return [];

    const merged = new Set(spouse?.selectedReceiptCategories || spouse?.receiptCategories || []);

    if (spouse?.gigWork) {
      merged.add('fuel');
      merged.add('maintenance');
      merged.add('parking_tolls');
      merged.add('mobile_internet');
      merged.add('vehicle_expenses');
      merged.add('insurance');
      merged.add('meals');
    }

    if (spouse?.selfEmployment) {
      merged.add('mobile_internet');
      merged.add('supplies');
      merged.add('equipment');
      merged.add('professional_fees');
      merged.add('home_office');
      merged.add('meals');
    }

    if (spouse?.business) {
      merged.add('rent_utilities');
      merged.add('payroll_expenses');
      merged.add('inventory_purchases');
      merged.add('insurance');
      merged.add('supplies');
      merged.add('equipment');
      merged.add('professional_fees');
    }

    return Array.from(merged);
  }, [hasSpouse, spouse]);

  const normalizedGigPlatforms = useMemo(() => {
    const rawPlatforms =
      user?.gigPlatforms ||
      user?.onboarding?.gigPlatforms ||
      user?.documentPreferences?.gigPlatforms ||
      [];

    return rawPlatforms
      .map((platform) => String(platform).trim().toLowerCase())
      .filter(Boolean);
  }, [user]);

  const gigPlatformCards = useMemo(
    () => normalizedGigPlatforms.map((platform) => GIG_PLATFORM_CONFIG[platform]).filter(Boolean),
    [normalizedGigPlatforms]
  );

  const myEmploymentItems = profile.employment
    ? [
        {
          name: 'T4 Slip',
          icon: FileText,
          description: 'Employment income slip',
          to: '/documents?category=t4',
        },
      ]
    : [];

  const spouseEmploymentItems =
    hasSpouse && spouse?.employment
      ? [
          {
            name: 'Spouse T4 Slip',
            icon: FileText,
            description: 'Employment income slip',
            to: '/documents?category=spouse-t4',
          },
        ]
      : [];

  const myGigItems =
    profile.gigWork || profile.selfEmployment
      ? [
          {
            name: 'T4A / Other Gig Income',
            icon: DollarSign,
            description: 'Contract, commission, or platform income',
            to: '/documents?category=t4a',
          },
          ...gigPlatformCards,
          {
            name: 'Mileage',
            icon: MapPin,
            description: 'Track work-related driving',
            to: '/mileage',
          },
        ]
      : [];

  const spouseGigItems =
    hasSpouse && spouse?.gigWork
      ? [
          {
            name: 'Spouse T4A / Income',
            icon: DollarSign,
            description: 'Spouse gig income records',
            to: '/documents?category=spouse-gig',
          },
          {
            name: 'Spouse Expense Receipts',
            icon: Receipt,
            description: 'Spouse gig-related receipts',
            to: '/documents?category=spouse-gig-expenses',
          },
        ]
      : [];

  const sameBusiness =
    Boolean(user?.householdBusiness?.shared) ||
    Boolean(user?.sameBusinessAsSpouse) ||
    Boolean(spouse?.sameBusinessAsUser) ||
    Boolean(household?.sharedBusiness);

  const sharedBusinessName =
    user?.householdBusiness?.businessName ||
    getPersonBusinessName(profile) ||
    getPersonBusinessName(spouse) ||
    'Shared Business';

  const sharedBusinessItems =
    sameBusiness && (profile.business || spouse?.business)
      ? [
          {
            name: 'Business Dashboard',
            icon: Store,
            description: `${sharedBusinessName} overview`,
            to: '/business/dashboard',
          },
          {
            name: 'Sales & Income',
            icon: DollarSign,
            description: 'Combined business income records',
            to: '/business/sales-income',
          },
          {
            name: 'GST / HST Records',
            icon: Percent,
            description: 'Shared GST tracking and records',
            to: '/business/gst-records',
          },
          {
            name: 'Payroll Records',
            icon: Briefcase,
            description: 'Payroll setup and records',
            to: '/business/payroll',
          },
          {
            name: 'Inventory',
            icon: Package,
            description: 'Stock and product records',
            to: '/business/inventory',
          },
        ]
      : [];

  const myBusinessItems =
    !sameBusiness && profile.business
      ? [
          {
            name: 'Business Dashboard',
            icon: Store,
            description: `${getPersonBusinessName(profile, 'Your Business')} overview`,
            to: '/business/dashboard',
          },
          {
            name: 'Sales & Income',
            icon: DollarSign,
            description: 'Business income records',
            to: '/business/sales-income',
          },
          {
            name: 'GST / HST Records',
            icon: Percent,
            description: 'GST tracking and records',
            to: '/business/gst-records',
          },
          {
            name: 'Payroll Records',
            icon: Briefcase,
            description: 'Payroll setup and records',
            to: '/business/payroll',
          },
          {
            name: 'Inventory',
            icon: Package,
            description: 'Stock and product records',
            to: '/business/inventory',
          },
        ]
      : [];

  const spouseBusinessItems =
    !sameBusiness && hasSpouse && spouse?.business
      ? [
          {
            name: 'Business Dashboard',
            icon: Store,
            description: `${getPersonBusinessName(spouse, 'Spouse Business')} overview`,
            to: '/business/dashboard',
          },
          {
            name: 'Sales & Income',
            icon: DollarSign,
            description: 'Business income records',
            to: '/documents?category=spouse-business',
          },
          {
            name: 'GST / HST Records',
            icon: Percent,
            description: 'Business tax records',
            to: '/documents?category=spouse-business',
          },
          {
            name: 'Payroll Records',
            icon: Briefcase,
            description: 'Payroll-related records',
            to: '/documents?category=spouse-business',
          },
          {
            name: 'Inventory',
            icon: Package,
            description: 'Inventory and stock records',
            to: '/documents?category=spouse-business',
          },
        ]
      : [];

  const householdTaxItems = useMemo(() => {
    const items = [];

    const hasDonations =
      myOptionalProfiles.some((item) => item.label === 'Donations') ||
      spouseOptionalProfiles.some((item) => item.label === 'Donations') ||
      baseSlipKeys.includes('DONATIONS');

    const hasCcb =
      myOptionalProfiles.some((item) => item.label === 'CCB') ||
      spouseOptionalProfiles.some((item) => item.label === 'CCB');

    const hasMedical = baseSlipKeys.includes('MEDICAL');

    if (hasMedical) {
      items.push({
        label: 'Medical Expenses',
        description: 'Household medical receipts and related records',
        to: getHouseholdMedicalRoute(),
        icon: Stethoscope,
      });
    }

    if (hasDonations) {
      items.push({
        label: 'Donations',
        description: 'Household donation receipts and related records',
        to: getHouseholdDonationsRoute(),
        icon: Gift,
      });
    }

    if (hasCcb) {
      items.push({
        label: 'Canada Child Benefit',
        description: 'Household child benefit records',
        to: getHouseholdCcbRoute(),
        icon: BadgeDollarSign,
      });
    }

    return items;
  }, [myOptionalProfiles, spouseOptionalProfiles, baseSlipKeys]);

  const myAdditionalDocItems = baseSlipKeys
    .filter((slip) =>
      [
        'RRSP',
        'FHSA',
        'TFSA',
        'TUITION',
        'CHILD_CARE',
        'MOVING',
        'T5',
        'T3',
        'T5008',
        'RENTAL',
        'FOREIGN',
        'CRYPTO',
        'HOME_OFFICE',
      ].includes(slip)
    )
    .map((slip) => ({
      name: SLIP_LABELS[slip] || slip,
      description: 'Upload and manage records',
      to: getSlipRoute(slip),
      icon: FileText,
    }));

  const quickActions = [
    {
      to: '/documents',
      label: 'Upload Tax Docs',
      description: 'Slips and tax records',
      icon: FileText,
      classes: 'bg-blue-50 hover:bg-blue-100 text-blue-600',
      show: true,
    },
    {
      to: '/receipts',
      label: 'Upload Receipt',
      description: 'Expenses and proof',
      icon: Receipt,
      classes: 'bg-green-50 hover:bg-green-100 text-green-600',
      show: true,
    },
    {
      to: '/find-ca',
      label: 'Find a CA',
      description: 'Get expert help',
      icon: Briefcase,
      classes: 'bg-rose-50 hover:bg-rose-100 text-rose-600',
      show: true,
    },
    {
      to: '/mileage',
      label: 'Log Mileage',
      description: 'Track work trips',
      icon: MapPin,
      classes: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600',
      show: profile.gigWork || profile.selfEmployment || spouse?.gigWork || spouse?.selfEmployment,
    },
    {
      to: '/business/dashboard',
      label: 'Business Area',
      description: 'Open business tools',
      icon: Building2,
      classes: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600',
      show: profile.business || spouse?.business,
    },
    {
      to: '/tax-checklist',
      label: 'Checklist',
      description: hasSpouse ? 'Combined household checklist' : 'See what is missing',
      icon: CheckCircle2,
      classes: 'bg-orange-50 hover:bg-orange-100 text-orange-600',
      show: true,
    },
  ].filter((item) => item.show);

  const employmentAttention = [
    ...(profile.employment
      ? [{ key: 'me-t4', text: 'Upload your T4 employment slip', to: '/documents?category=t4' }]
      : []),
    ...(hasSpouse && spouse?.employment
      ? [{ key: 'spouse-t4', text: 'Upload spouse T4 slip', to: '/documents?category=spouse-t4' }]
      : []),
  ];

  const gigAttention = [
    ...(profile.gigWork || profile.selfEmployment
      ? [
          {
            key: 'me-gig',
            text: 'Upload your T4A / contract / gig income slip',
            to: '/documents?category=t4a',
          },
        ]
      : []),
    ...(hasSpouse && spouse?.gigWork
      ? [
          {
            key: 'spouse-gig',
            text: 'Upload spouse T4A and spouse gig expenses',
            to: '/documents?category=spouse-gig',
          },
        ]
      : []),
  ];

  const businessAttention = sameBusiness
    ? profile.business || spouse?.business
      ? [
          {
            key: 'shared-business-records',
            text: 'Review shared business records',
            to: '/business/sales-income',
          },
          {
            key: 'shared-gst',
            text: 'Review shared GST / HST records',
            to: '/business/gst-records',
          },
          {
            key: 'shared-payroll',
            text: 'Review shared payroll records',
            to: '/business/payroll',
          },
          {
            key: 'shared-inventory',
            text: 'Review shared inventory records',
            to: '/business/inventory',
          },
        ]
      : []
    : [
        ...(profile.business
          ? [
              {
                key: 'me-business-records',
                text: 'Upload your business records and statements',
                to: '/business/sales-income',
              },
              {
                key: 'me-gst',
                text: 'Upload your GST / HST records',
                to: '/business/gst-records',
              },
              {
                key: 'me-payroll',
                text: 'Upload your payroll records',
                to: '/business/payroll',
              },
              {
                key: 'me-inventory',
                text: 'Upload your inventory records',
                to: '/business/inventory',
              },
            ]
          : []),
        ...(hasSpouse && spouse?.business
          ? [
              {
                key: 'spouse-business',
                text: 'Review spouse business records',
                to: '/documents?category=spouse-business',
              },
            ]
          : []),
      ];

  const receiptAttention = finalReceiptCategories.map((receipt) => ({
    key: `receipt-${receipt}`,
    text: `Upload ${
      receipt === 'parking_tolls'
        ? 'your parking and toll receipts'
        : receipt === 'mobile_internet'
        ? 'your mobile and internet bills'
        : receipt === 'rent_utilities'
        ? 'your rent and utility records'
        : receipt === 'inventory_purchases'
        ? 'your inventory purchase records'
        : receipt === 'professional_fees'
        ? 'your professional fee receipts'
        : receipt === 'vehicle_expenses'
        ? 'your vehicle expense records'
        : receipt === 'payroll_expenses'
        ? 'your payroll expense records'
        : receipt === 'fuel'
        ? 'your fuel receipts'
        : receipt === 'maintenance'
        ? 'your maintenance receipts'
        : receipt === 'insurance'
        ? 'your insurance receipts'
        : receipt === 'meals'
        ? 'your meal receipts'
        : receipt === 'supplies'
        ? 'your supply receipts'
        : receipt === 'equipment'
        ? 'your equipment receipts'
        : `your ${RECEIPT_LABELS[receipt] || receipt}`
    }`,
    to: getReceiptRoute(receipt),
  }));

  const householdAttention = householdTaxItems.map((item) => ({
    key: `household-${item.label}`,
    text:
      item.label === 'Canada Child Benefit'
        ? 'Review household Canada Child Benefit records'
        : item.label === 'Donations'
        ? 'Review household donation receipts'
        : item.label === 'Medical Expenses'
        ? 'Review household medical receipts'
        : `Review household ${item.label.toLowerCase()}`,
    to: item.to,
  }));

  const registeredAccountsAttention = [
    ...myOptionalProfiles
      .filter((item) => ['TFSA', 'RRSP', 'FHSA', 'Investments'].includes(item.label))
      .map((item) => ({
        key: `my-${item.key}`,
        text:
          item.label === 'TFSA'
            ? 'Review your TFSA records and contribution history'
            : item.label === 'RRSP'
            ? 'Upload your RRSP contribution receipts'
            : item.label === 'FHSA'
            ? 'Upload your FHSA contribution records'
            : 'Upload your investment statements and slips',
        to: item.to,
      })),
    ...spouseOptionalProfiles
      .filter((item) => ['TFSA', 'RRSP', 'FHSA', 'Investments'].includes(item.label))
      .map((item) => ({
        key: `spouse-${item.key}`,
        text:
          item.label === 'TFSA'
            ? 'Review spouse TFSA records and contribution history'
            : item.label === 'RRSP'
            ? 'Review spouse RRSP contribution receipts'
            : item.label === 'FHSA'
            ? 'Review spouse FHSA contribution records'
            : 'Review spouse investment statements and slips',
        to: item.to,
      })),
  ];

  const documentStats = useMemo(() => {
    const total =
      Math.max(
        baseSlipKeys.length +
          finalReceiptCategories.length +
          spouseReceiptCategories.length +
          myOptionalProfiles.length +
          spouseOptionalProfiles.length +
          householdTaxItems.length +
          (hasSpouse ? 2 : 0),
        1
      );

    const uploadedSeed =
      Math.floor(baseSlipKeys.length * 0.45) +
      Math.floor(finalReceiptCategories.length * 0.35) +
      Math.floor(spouseReceiptCategories.length * 0.35) +
      Math.floor(householdTaxItems.length * 0.4) +
      myOptionalProfiles.length +
      Math.min(spouseOptionalProfiles.length, 2);

    const uploaded = Math.min(uploadedSeed, total);
    const pending = Math.max(total - uploaded, 0);

    return {
      total,
      uploaded,
      pending,
      completion: Math.round((uploaded / total) * 100),
    };
  }, [
    baseSlipKeys.length,
    finalReceiptCategories.length,
    spouseReceiptCategories.length,
    myOptionalProfiles.length,
    spouseOptionalProfiles.length,
    householdTaxItems.length,
    hasSpouse,
  ]);

  const buildPersonSavings = (person, receiptCategories = [], optionalProfiles = [], personLabel = 'You') => {
    const items = [];

    const pushItem = (item) => items.push(item);

    if (person.gigWork || person.selfEmployment) {
      pushItem({
        key: `${personLabel}-vehicle`,
        title: `${personLabel} Vehicle Expenses`,
        description: 'Fuel, maintenance, insurance, parking, mileage and work driving',
        to: '/receipts',
        icon: Car,
        maxSaving: 1400,
        currentSaving: receiptCategories.includes('fuel') ? 350 : 0,
        tag: 'High impact',
        variant: 'success',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-700',
      });
    }

    if (person.selfEmployment || person.business) {
      pushItem({
        key: `${personLabel}-home-office`,
        title: `${personLabel} Home Office`,
        description: 'Workspace, utilities, internet and eligible home-use expenses',
        to: '/receipts',
        icon: Home,
        maxSaving: 850,
        currentSaving: receiptCategories.includes('home_office') ? 150 : 0,
        tag: 'Often missed',
        variant: 'warning',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-700',
      });
    }

    if (person.selfEmployment || person.business) {
      pushItem({
        key: `${personLabel}-phone-internet`,
        title: `${personLabel} Phone & Internet`,
        description: 'Business-use portion of mobile and internet costs',
        to: '/receipts',
        icon: MapPin,
        maxSaving: 450,
        currentSaving: receiptCategories.includes('mobile_internet') ? 120 : 0,
        tag: 'Easy win',
        variant: 'info',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-700',
      });
    }

    if (person.selfEmployment || person.business) {
      pushItem({
        key: `${personLabel}-supplies-fees`,
        title: `${personLabel} Supplies & Professional Fees`,
        description: 'Tools, supplies, subscriptions, accounting and service fees',
        to: '/receipts',
        icon: Receipt,
        maxSaving: 950,
        currentSaving:
          receiptCategories.includes('supplies') || receiptCategories.includes('professional_fees')
            ? 250
            : 0,
        tag: 'Business write-off',
        variant: 'success',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-700',
      });
    }

    if (person.business) {
      pushItem({
        key: `${personLabel}-business-overhead`,
        title: `${personLabel} Rent, Utilities & Operations`,
        description: 'Business overhead that can directly lower taxable profit',
        to: '/business/rent-utilities',
        icon: Building2,
        maxSaving: 1200,
        currentSaving: receiptCategories.includes('rent_utilities') ? 350 : 0,
        tag: 'Core business',
        variant: 'warning',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-700',
      });
    }

    if (person.business) {
      pushItem({
        key: `${personLabel}-inventory-payroll`,
        title: `${personLabel} Inventory & Payroll`,
        description: 'Track stock purchases and payroll costs correctly',
        to: '/business/dashboard',
        icon: Package,
        maxSaving: 900,
        currentSaving:
          receiptCategories.includes('inventory_purchases') ||
          receiptCategories.includes('payroll_expenses')
            ? 220
            : 0,
        tag: 'Track properly',
        variant: 'default',
        iconBg: 'bg-slate-100',
        iconColor: 'text-slate-700',
      });
    }

    if (person.employment || optionalProfiles.some((item) => item.label === 'RRSP')) {
      pushItem({
        key: `${personLabel}-rrsp`,
        title: `${personLabel} RRSP Contributions`,
        description: 'Contributions can reduce taxable income and improve refund outcome',
        to: '/documents?category=rrsp',
        icon: PiggyBank,
        maxSaving: 2000,
        currentSaving: optionalProfiles.some((item) => item.label === 'RRSP') ? 600 : 0,
        tag: 'Powerful lever',
        variant: 'success',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-700',
      });
    }

    if (optionalProfiles.some((item) => item.label === 'FHSA')) {
      pushItem({
        key: `${personLabel}-fhsa`,
        title: `${personLabel} FHSA Contributions`,
        description: 'A strong tax-saving account if contributions are being made',
        to: '/documents?category=fhsa',
        icon: Landmark,
        maxSaving: 1600,
        currentSaving: 500,
        tag: 'Smart account',
        variant: 'info',
        iconBg: 'bg-cyan-100',
        iconColor: 'text-cyan-700',
      });
    }

    if (optionalProfiles.some((item) => item.label === 'Investments')) {
      pushItem({
        key: `${personLabel}-investments`,
        title: `${personLabel} Investment Records`,
        description: 'Track taxable investment slips and related deductions',
        to: '/documents?category=investments',
        icon: TrendingUp,
        maxSaving: 350,
        currentSaving: 100,
        tag: 'Worth reviewing',
        variant: 'info',
        iconBg: 'bg-sky-100',
        iconColor: 'text-sky-700',
      });
    }

    return items.map((item) => ({
      ...item,
      progress: clamp((item.currentSaving / item.maxSaving) * 100),
    }));
  };

  const householdSavingsItems = useMemo(() => {
    const items = [];

    if (householdTaxItems.some((item) => item.label === 'Donations')) {
      items.push({
        key: 'household-donations',
        title: 'Household Donations',
        description: 'Donation receipts can be coordinated across the household',
        to: getHouseholdDonationsRoute(),
        icon: Gift,
        maxSaving: 500,
        currentSaving: 120,
        tag: 'Household credit',
        variant: 'warning',
        iconBg: 'bg-rose-100',
        iconColor: 'text-rose-700',
        progress: clamp((120 / 500) * 100),
      });
    }

    if (householdTaxItems.some((item) => item.label === 'Medical Expenses')) {
      items.push({
        key: 'household-medical',
        title: 'Household Medical Expenses',
        description: 'Medical receipts are often best reviewed at the household level',
        to: getHouseholdMedicalRoute(),
        icon: Stethoscope,
        maxSaving: 900,
        currentSaving: 200,
        tag: 'Family optimization',
        variant: 'info',
        iconBg: 'bg-teal-100',
        iconColor: 'text-teal-700',
        progress: clamp((200 / 900) * 100),
      });
    }

    return items;
  }, [householdTaxItems]);

    const [savingsSort, setSavingsSort] = useState('remaining');

  const savingsOpportunities = useMemo(() => {
    const mine = buildPersonSavings(profile, finalReceiptCategories, myOptionalProfiles, 'You');
    const spouseItems =
      hasSpouse
        ? buildPersonSavings(spouse || {}, spouseReceiptCategories, spouseOptionalProfiles, 'Spouse')
        : [];

    return [...mine, ...spouseItems, ...householdSavingsItems];
  }, [
    profile,
    spouse,
    hasSpouse,
    finalReceiptCategories,
    spouseReceiptCategories,
    myOptionalProfiles,
    spouseOptionalProfiles,
    householdSavingsItems,
  ]);

  const sortedSavingsOpportunities = useMemo(() => {
    const items = [...savingsOpportunities];

    switch (savingsSort) {
      case 'highest':
        return items.sort((a, b) => b.maxSaving - a.maxSaving);

      case 'lowest':
        return items.sort((a, b) => a.maxSaving - b.maxSaving);

      case 'remaining':
        return items.sort(
          (a, b) => (b.maxSaving - b.currentSaving) - (a.maxSaving - a.currentSaving)
        );

      case 'captured':
        return items.sort((a, b) => b.currentSaving - a.currentSaving);

      case 'progress':
        return items.sort((a, b) => b.progress - a.progress);

      case 'title':
        return items.sort((a, b) => a.title.localeCompare(b.title));

      default:
        return items;
    }
  }, [savingsOpportunities, savingsSort]);

  const totalPossibleSavings = savingsOpportunities.reduce((sum, item) => sum + item.maxSaving, 0);
  const capturedSavings = savingsOpportunities.reduce((sum, item) => sum + item.currentSaving, 0);
  const remainingSavings = Math.max(0, totalPossibleSavings - capturedSavings);
  const savingsCompletion = totalPossibleSavings
    ? Math.round((capturedSavings / totalPossibleSavings) * 100)
    : 0;

  const topSavings = savingsOpportunities
    .slice()
    .sort((a, b) => b.maxSaving - a.maxSaving)
    .slice(0, 4);

  const savingsHeadline = useMemo(() => {
    if (hasSpouse) return 'Household savings view detected';
    if (profile.business && (profile.gigWork || profile.selfEmployment) && profile.employment) {
      return 'Business + Employment + Self-Employment detected';
    }
    if (profile.business && profile.employment) return 'Business + Employment detected';
    if (profile.business && (profile.gigWork || profile.selfEmployment))
      return 'Business + Self-Employment detected';
    if (profile.employment && (profile.gigWork || profile.selfEmployment))
      return 'Employment + Self-Employment detected';
    if (profile.business) return 'Business profile detected';
    if (profile.gigWork || profile.selfEmployment) return 'Self-employment profile detected';
    if (profile.employment) return 'Employment profile detected';
    return 'Profile detected';
  }, [profile, hasSpouse]);

  const taxHealth = useMemo(() => {
    if (remainingSavings >= 3000) return 'Large tax-saving opportunity still open';
    if (remainingSavings >= 1500) return 'Good tax-saving opportunity still open';
    if (remainingSavings > 0) return 'Some deductions are already being captured';
    return 'Great job - most visible savings areas are covered';
  }, [remainingSavings]);

  const upcomingDeadlines = [
    {
      id: 1,
      task: hasSpouse ? 'Household Tax Filing Deadline' : 'Tax Filing Deadline',
      date: 'Apr 30, 2026',
      daysLeft: 40,
      priority: 'high',
    },
    (profile.business || spouse?.business) && {
      id: 2,
      task: sameBusiness ? 'Review Shared Business Records' : 'Review Business Records',
      date: 'Apr 20, 2026',
      daysLeft: 30,
      priority: 'info',
    },
    (profile.gigWork || profile.selfEmployment) && {
      id: 3,
      task: 'Review Self-Employment Expenses',
      date: 'Apr 15, 2026',
      daysLeft: 25,
      priority: 'warning',
    },
    hasSpouse && spouse?.gigWork && {
      id: 4,
      task: 'Review Spouse Gig Expenses',
      date: 'Apr 15, 2026',
      daysLeft: 25,
      priority: 'warning',
    },
  ].filter(Boolean);

  const taxNews = [
    { id: 1, title: 'Track expenses year-round to reduce missed deductions', date: 'Mar 2026' },
    { id: 2, title: 'Separate business and personal receipts for cleaner filing', date: 'Mar 2026' },
    { id: 3, title: 'RRSP and FHSA contributions can improve final tax outcome', date: 'Mar 2026' },
  ];

  const activeProfiles = [
    profile.employment ? 'My T4' : null,
    profile.gigWork ? 'My Gig Work' : null,
    profile.business ? 'My Business' : null,
    ...myOptionalProfiles.map((item) => `My ${item.label}`),
    ...(hasSpouse
      ? [
          spouse?.employment ? 'Spouse T4' : null,
          spouse?.gigWork ? 'Spouse Gig Work' : null,
          spouse?.business ? 'Spouse Business' : null,
          ...spouseOptionalProfiles.map((item) => `Spouse ${item.label}`),
        ]
      : []),
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-gray-600">
          {hasSpouse
            ? 'Your dashboard reflects both your profile and your spouse profile.'
            : 'Your dashboard changes based on your tax profile, accounts, and uploaded records.'}
        </p>
      </div>

      {hasSpouse && <HouseholdSummaryCard household={household} />}

      <Card className="overflow-hidden border border-green-200 bg-gradient-to-r from-green-50 via-white to-emerald-50">
        <Card.Body>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="xl:col-span-8">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                  <Sparkles size={24} />
                </div>

                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant="success">Tax Savings Engine</Badge>
                    <Badge variant="info">{savingsHeadline}</Badge>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900">
                    You can still save about {money(remainingSavings)} in taxes
                  </h2>

                  <p className="mt-2 max-w-3xl text-sm text-gray-600">
                    Estimated savings are now based on all visible user and spouse documents in a
                    household account, or just the primary user in a single account.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {topSavings.map((item) => (
                      <Link
                        key={item.key}
                        to={item.to}
                        className="inline-flex items-center rounded-full border border-green-200 bg-white px-3 py-1.5 text-xs font-medium text-green-800 transition hover:bg-green-50"
                      >
                        <span className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                        {item.title}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link to="/receipts">
                      <Button>Start Saving More</Button>
                    </Link>

                    <Link to="/tax-checklist">
                      <Button variant="outline">Review Tax Checklist</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-4">
              <div className="rounded-2xl border border-green-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">Savings Progress</p>
                  <Target size={18} className="text-green-600" />
                </div>

                <p className="mt-3 text-3xl font-bold text-green-700">{money(capturedSavings)}</p>
                <p className="mt-1 text-xs text-gray-500">
                  Captured so far out of {money(totalPossibleSavings)} visible opportunity
                </p>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-green-100">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all"
                    style={{ width: `${clamp(savingsCompletion)}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-gray-500">{savingsCompletion}% captured</span>
                  <span className="font-medium text-green-700">{money(remainingSavings)} left</span>
                </div>

                <div className="mt-4 rounded-xl bg-green-50 p-3">
                  <div className="flex items-start gap-2">
                    <ShieldCheck size={16} className="mt-0.5 text-green-700" />
                    <div>
                      <p className="text-sm font-medium text-green-900">{taxHealth}</p>
                      <p className="mt-1 text-xs text-green-700">
                        Household and individual tax opportunities are combined intelligently.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

            <Card>
        <Card.Header>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="flex items-center text-xl font-bold">
                <TrendingUp size={20} className="mr-2 text-green-600" />
                Where You Can Reduce Tax
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Show deduction opportunities first, not just uploads.
              </p>
            </div>

            <div className="w-full md:w-auto">
              <label
                htmlFor="savings-sort"
                className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500"
              >
                Sort by
              </label>
              <select
                id="savings-sort"
                value={savingsSort}
                onChange={(e) => setSavingsSort(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 md:w-56"
              >
                <option value="remaining">Most still possible</option>
                <option value="highest">Highest savings</option>
                <option value="lowest">Lowest savings</option>
                <option value="captured">Most already captured</option>
                <option value="progress">Best progress</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </div>
        </Card.Header>

        <Card.Body>
          {sortedSavingsOpportunities.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {sortedSavingsOpportunities.map((item) => (
                <SavingOpportunityCard key={item.key} item={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-5 text-sm text-gray-600">
              No tax-saving opportunities are visible yet. Update the user profile or upload
              records to unlock savings guidance.
            </div>
          )}
        </Card.Body>
      </Card><Card>
        <Card.Header>
          <h2 className="text-xl font-bold">Quick Actions</h2>
          <p className="mt-1 text-sm text-gray-500">Start with the most common actions first.</p>
        </Card.Header>

        <Card.Body>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.label}
                  to={action.to}
                  className={`rounded-lg p-4 text-center transition-colors ${action.classes}`}
                >
                  <Icon size={24} className="mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-gray-900">{action.label}</h3>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </Link>
              );
            })}
          </div>
        </Card.Body>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Potential Savings Left</p>
            <p className="mt-2 text-3xl font-bold text-green-700">{money(remainingSavings)}</p>
            <p className="mt-1 text-xs text-gray-500">Visible opportunities still open</p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Documents Uploaded</p>
            <p className="mt-2 text-3xl font-bold text-primary-600">{documentStats.uploaded}</p>
            <p className="mt-1 text-xs text-gray-500">Estimated from selected setup</p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Pending Items</p>
            <p className="mt-2 text-3xl font-bold text-warning-600">{documentStats.pending}</p>
            <p className="mt-1 text-xs text-gray-500">Still needs attention</p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Active Tax Areas</p>
            <p className="mt-2 text-3xl font-bold text-blue-700">{activeProfiles.length}</p>
            <p className="mt-1 text-xs text-gray-500">
              {hasSpouse ? 'User + spouse combined' : 'Primary user only'}
            </p>
          </Card.Body>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <WhatNeedsAttentionSection
  employmentAttention={employmentAttention}
  gigAttention={gigAttention}
  businessAttention={businessAttention}
  receiptAttention={receiptAttention}
  householdAttention={householdAttention}
  registeredAccountsAttention={registeredAccountsAttention}
/>

          {(myEmploymentItems.length > 0 || spouseEmploymentItems.length > 0) && (
            <SectionCard
              title="Employment"
              icon={Briefcase}
              colorClass="border-blue-500"
              description="Employment documents grouped together for you and your spouse."
            >
              <div className={`grid grid-cols-1 gap-4 ${hasSpouse ? 'lg:grid-cols-2' : ''}`}>
                <PersonSubCard
                  title="Your Employment"
                  icon={User}
                  items={myEmploymentItems}
                  emptyText="No employment documents required for you."
                />
                {hasSpouse && (
                  <PersonSubCard
                    title="Spouse Employment"
                    icon={Users}
                    items={spouseEmploymentItems}
                    emptyText="No employment documents required for spouse."
                  />
                )}
              </div>
            </SectionCard>
          )}

          {(myGigItems.length > 0 || spouseGigItems.length > 0) && (
            <SectionCard
              title="Gig / Self-Employment"
              icon={Car}
              colorClass="border-green-500"
              description="Keep contract income, platform records, and mileage together."
            >
              <div className={`grid grid-cols-1 gap-4 ${hasSpouse ? 'lg:grid-cols-2' : ''}`}>
                <PersonSubCard
                  title="Your Gig / Self-Employment"
                  icon={User}
                  items={myGigItems}
                  emptyText="No gig or self-employment records required for you."
                />
                {hasSpouse && (
                  <PersonSubCard
                    title="Spouse Gig / Self-Employment"
                    icon={Users}
                    items={spouseGigItems}
                    emptyText="No gig or self-employment records required for spouse."
                  />
                )}
              </div>
            </SectionCard>
          )}

          {(sharedBusinessItems.length > 0 ||
            myBusinessItems.length > 0 ||
            spouseBusinessItems.length > 0) && (
            <SectionCard
              title="Business"
              icon={Building2}
              colorClass="border-indigo-500"
              description={
                sameBusiness
                  ? 'A shared business is shown once for the household.'
                  : 'Business records are grouped by person when they operate separately.'
              }
            >
              {sameBusiness ? (
                <div className="grid grid-cols-1 gap-4">
                  <PersonSubCard
                    title={`Shared Business${sharedBusinessName ? ` · ${sharedBusinessName}` : ''}`}
                    icon={HeartHandshake}
                    items={sharedBusinessItems}
                    emptyText="No shared business records required."
                  />
                </div>
              ) : (
                <div className={`grid grid-cols-1 gap-4 ${hasSpouse ? 'lg:grid-cols-2' : ''}`}>
                  <PersonSubCard
                    title="Your Business"
                    icon={User}
                    items={myBusinessItems}
                    emptyText="No business records required for you."
                  />
                  {hasSpouse && (
                    <PersonSubCard
                      title="Spouse Business"
                      icon={Users}
                      items={spouseBusinessItems}
                      emptyText="No business records required for spouse."
                    />
                  )}
                </div>
              )}
            </SectionCard>
          )}

          {myAdditionalDocItems.length > 0 && (
            <SectionCard
              title="Additional Tax Documents"
              icon={FileText}
              colorClass="border-amber-500"
              description="Other tax-related documents that do not fit the main grouped sections."
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {myAdditionalDocItems.map((item) => {
                  const ItemIcon = item.icon || FileText;

                  return (
                    <Link
                      key={item.name}
                      to={item.to}
                      className="rounded-lg bg-gray-50 p-3 transition hover:bg-gray-100"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                            <ItemIcon size={16} />
                          </div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                        <ChevronRight size={16} className="mt-1 shrink-0 text-gray-400" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </SectionCard>
          )}

          <ReceiptCategoryGrid categories={[...new Set([...finalReceiptCategories, ...spouseReceiptCategories])]} />

          <HouseholdTaxDocumentsSection
            householdItems={householdTaxItems}
            myOptionalProfiles={myOptionalProfiles}
            spouseOptionalProfiles={spouseOptionalProfiles}
            hasSpouse={hasSpouse}
          />

          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h2 className="flex items-center text-xl font-bold">
                  <Bell size={20} className="mr-2 text-primary-500" />
                  Tax Updates & Reminders
                </h2>
              </div>
            </Card.Header>

            <Card.Body>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-yellow-800">Latest Tips</span>
                    <Badge variant="warning">{taxNews.length} items</Badge>
                  </div>

                  <ul className="space-y-2">
                    {taxNews.map((news) => (
                      <li key={news.id} className="text-sm">
                        <span className="text-gray-700">{news.title}</span>
                        <span className="block text-xs text-gray-500">{news.date}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="mb-2 flex items-center">
                    <AlertTriangle size={18} className="mr-2 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      Next Important Deadline
                    </span>
                  </div>

                  <p className="text-2xl font-bold text-red-700">Apr 30, 2026</p>
                  <p className="mt-1 text-xs text-red-600">
                    Review your {hasSpouse ? 'household' : 'tax'} checklist before filing
                  </p>

                  <Link to="/tax-checklist">
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      Review Checklist
                    </Button>
                  </Link>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="space-y-6 xl:col-span-4">
          <Card className="border border-green-200 bg-gradient-to-br from-green-50 to-white">
            <Card.Body>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center text-lg font-bold">
                  <TrendingUp size={20} className="mr-2 text-green-600" />
                  Estimated Tax Savings
                </h3>
                <Badge variant="success">{hasSpouse ? 'Household total' : 'Single account'}</Badge>
              </div>

              <p className="mb-2 text-3xl font-bold text-green-700">{money(capturedSavings)}</p>
              <p className="mb-4 text-xs text-gray-600">
                Estimated savings already being captured from all visible user and spouse records
                when applicable
              </p>

              <div className="space-y-2 text-sm">
                {savingsOpportunities.slice(0, 6).map((item) => (
                  <div key={item.key} className="flex justify-between rounded bg-white p-2">
                    <span className="text-gray-600">{item.title}</span>
                    <span className="font-medium">{money(item.currentSaving)}</span>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card className="border-warning-200 bg-warning-50">
            <Card.Header>
              <h3 className="flex items-center text-lg font-bold">
                <Clock size={20} className="mr-2 text-warning-600" />
                Upcoming Deadlines
              </h3>
            </Card.Header>

            <Card.Body>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline) => (
                  <div
                    key={deadline.id}
                    className="flex items-center justify-between rounded-lg bg-white p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{deadline.task}</p>
                      <p className="text-xs text-gray-500">Due: {deadline.date}</p>
                    </div>
                    <Badge
                      variant={
                        deadline.priority === 'high'
                          ? 'danger'
                          : deadline.priority === 'warning'
                          ? 'warning'
                          : 'info'
                      }
                    >
                      {deadline.daysLeft} days
                    </Badge>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <Card.Body>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <DollarSign size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-900">Why this dashboard works</p>
                  <p className="mt-1 text-sm text-blue-800">
                    It reduces clutter, groups related tasks together, and shows household tax
                    opportunities more realistically.
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>

          {user?.vehiclePurchase?.wantsBillOfSaleUpload && !user?.vehiclePurchase?.uploaded && (
            <Card className="border border-orange-200 bg-gradient-to-br from-orange-50 to-white">
              <Card.Body>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-orange-100 p-3">
                      <Car className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Upload your vehicle bill of sale
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        You told us you bought a vehicle for work use this year. Upload the bill of
                        sale so your CA can review it.
                      </p>
                    </div>
                  </div>

                  <Link to="/receipts?category=vehicle_purchase">
                    <Button>Upload now</Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
