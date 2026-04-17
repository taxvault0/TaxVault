import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  Eye,
  FileUp,
  Folder,
  List,
  Plus,
  Search,
  Wrench,
  Fuel,
  Car,
  Smartphone,
  ShoppingBag,
  Shield,
  UtensilsCrossed,
  HeartPulse,
  GraduationCap,
  Gift,
  PiggyBank,
  Baby,
  Truck,
  Home,
  MoreHorizontal,
  X,
  Briefcase,
  Package,
  Receipt,
  Trash2,
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';
import { useAuth } from '../../auth/context/AuthContext';

const CATEGORY_META = {
  all: {
    label: 'All Receipts',
    description: 'All recurring expense uploads and frequent receipts.',
    icon: Folder,
    iconWrap: 'bg-gray-100',
    iconColor: 'text-gray-700',
    chip: 'bg-gray-100 text-gray-700',
  },
  fuel: {
    label: 'Fuel',
    description: 'Gas, diesel, EV charging, and fuel-related receipts.',
    icon: Fuel,
    iconWrap: 'bg-orange-100',
    iconColor: 'text-orange-700',
    chip: 'bg-orange-100 text-orange-700',
  },
  maintenance: {
    label: 'Maintenance',
    description: 'Repairs, oil changes, parts, tires, and service receipts.',
    icon: Wrench,
    iconWrap: 'bg-red-100',
    iconColor: 'text-red-700',
    chip: 'bg-red-100 text-red-700',
  },
  parking_tolls: {
    label: 'Parking / Tolls',
    description: 'Parking fees, tolls, meters, and road charges.',
    icon: Car,
    iconWrap: 'bg-purple-100',
    iconColor: 'text-purple-700',
    chip: 'bg-purple-100 text-purple-700',
  },
  mobile_internet: {
    label: 'Mobile / Internet',
    description: 'Phone, data, mobile plans, and internet bills.',
    icon: Smartphone,
    iconWrap: 'bg-blue-100',
    iconColor: 'text-blue-700',
    chip: 'bg-blue-100 text-blue-700',
  },
  supplies: {
    label: 'Supplies',
    description: 'Supplies, tools, small equipment, and frequent purchases.',
    icon: ShoppingBag,
    iconWrap: 'bg-green-100',
    iconColor: 'text-green-700',
    chip: 'bg-green-100 text-green-700',
  },
  equipment: {
    label: 'Equipment',
    description: 'Devices, tools, and business equipment purchases.',
    icon: Package,
    iconWrap: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    chip: 'bg-emerald-100 text-emerald-700',
  },
  insurance: {
    label: 'Insurance',
    description: 'Recurring insurance premium receipts or confirmations.',
    icon: Shield,
    iconWrap: 'bg-indigo-100',
    iconColor: 'text-indigo-700',
    chip: 'bg-indigo-100 text-indigo-700',
  },
  meals: {
    label: 'Meals',
    description: 'Business meals and food receipts where applicable.',
    icon: UtensilsCrossed,
    iconWrap: 'bg-amber-100',
    iconColor: 'text-amber-700',
    chip: 'bg-amber-100 text-amber-700',
  },
  medical: {
    label: 'Medical',
    description: 'Medical expense receipts and recurring health-related payments.',
    icon: HeartPulse,
    iconWrap: 'bg-rose-100',
    iconColor: 'text-rose-700',
    chip: 'bg-rose-100 text-rose-700',
  },
  tuition: {
    label: 'Tuition',
    description: 'Tuition and education-related receipt uploads.',
    icon: GraduationCap,
    iconWrap: 'bg-teal-100',
    iconColor: 'text-teal-700',
    chip: 'bg-teal-100 text-teal-700',
  },
  donations: {
    label: 'Donations',
    description: 'Donation receipts you upload frequently before annual packaging.',
    icon: Gift,
    iconWrap: 'bg-pink-100',
    iconColor: 'text-pink-700',
    chip: 'bg-pink-100 text-pink-700',
  },
  rrsp: {
    label: 'RRSP',
    description: 'Contribution confirmations you want to track quickly.',
    icon: PiggyBank,
    iconWrap: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    chip: 'bg-emerald-100 text-emerald-700',
  },
  childcare: {
    label: 'Child Care',
    description: 'Daycare, babysitting, and child care payment receipts.',
    icon: Baby,
    iconWrap: 'bg-cyan-100',
    iconColor: 'text-cyan-700',
    chip: 'bg-cyan-100 text-cyan-700',
  },
  moving: {
    label: 'Moving',
    description: 'Moving expenses and relocation-related receipts.',
    icon: Truck,
    iconWrap: 'bg-yellow-100',
    iconColor: 'text-yellow-700',
    chip: 'bg-yellow-100 text-yellow-700',
  },
  home_office: {
    label: 'Home Office',
    description: 'Home office supplies, internet, utilities, and workspace expenses.',
    icon: Home,
    iconWrap: 'bg-slate-100',
    iconColor: 'text-slate-700',
    chip: 'bg-slate-100 text-slate-700',
  },
  rent_utilities: {
    label: 'Rent / Utilities',
    description: 'Rent, utilities, and occupancy-related records.',
    icon: Home,
    iconWrap: 'bg-sky-100',
    iconColor: 'text-sky-700',
    chip: 'bg-sky-100 text-sky-700',
  },
  vehicle_expenses: {
    label: 'Vehicle Expenses',
    description: 'Combined vehicle cost records for business or gig use.',
    icon: Car,
    iconWrap: 'bg-orange-100',
    iconColor: 'text-orange-700',
    chip: 'bg-orange-100 text-orange-700',
  },
  vehicle_purchase: {
    label: 'Vehicle Bill of Sale',
    description: 'Bill of sale, lease, finance, and purchase paperwork for a work vehicle.',
    icon: Car,
    iconWrap: 'bg-orange-100',
    iconColor: 'text-orange-700',
    chip: 'bg-orange-100 text-orange-700',
  },
  payroll_expenses: {
    label: 'Payroll Expenses',
    description: 'Payroll cost records and wage support.',
    icon: Briefcase,
    iconWrap: 'bg-fuchsia-100',
    iconColor: 'text-fuchsia-700',
    chip: 'bg-fuchsia-100 text-fuchsia-700',
  },
  inventory_purchases: {
    label: 'Inventory Purchases',
    description: 'Inventory buying records and purchase invoices.',
    icon: Package,
    iconWrap: 'bg-stone-100',
    iconColor: 'text-stone-700',
    chip: 'bg-stone-100 text-stone-700',
  },
  professional_fees: {
    label: 'Professional Fees',
    description: 'Accounting, legal, and professional service invoices.',
    icon: Receipt,
    iconWrap: 'bg-violet-100',
    iconColor: 'text-violet-700',
    chip: 'bg-violet-100 text-violet-700',
  },
  other: {
    label: 'Other',
    description: 'Other recurring expenses not covered above.',
    icon: MoreHorizontal,
    iconWrap: 'bg-gray-100',
    iconColor: 'text-gray-700',
    chip: 'bg-gray-100 text-gray-700',
  },
};

const EMPLOYEE_FALLBACK = [
  'medical',
  'tuition',
  'donations',
  'rrsp',
  'childcare',
  'moving',
  'home_office',
  'other',
];

const GIG_FALLBACK = [
  'fuel',
  'maintenance',
  'parking_tolls',
  'mobile_internet',
  'supplies',
  'insurance',
  'meals',
  'vehicle_expenses',
  'vehicle_purchase',
  'other',
];

const BUSINESS_FALLBACK = [
  'fuel',
  'maintenance',
  'parking_tolls',
  'mobile_internet',
  'supplies',
  'equipment',
  'insurance',
  'rent_utilities',
  'payroll_expenses',
  'inventory_purchases',
  'professional_fees',
  'home_office',
  'vehicle_purchase',
  'other',
];

const mapLegacyCategory = (category) => {
  const aliasMap = {
    parking: 'parking_tolls',
    mobile: 'mobile_internet',
    childcare: 'childcare',
    'home-office': 'home_office',
  };

  return aliasMap[category] || category;
};

const InfoTile = ({ label, value }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
    <p className="mt-2 text-sm font-semibold text-gray-900">{value}</p>
  </div>
);

function generateMockReceipts(categories) {
  const today = new Date();

  const buildReceipt = (
    id,
    vendor,
    category,
    amount,
    daysAgo,
    notes,
    paymentMethod = 'Credit Card'
  ) => {
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);

    return {
      id,
      vendor,
      category,
      amount,
      date: date.toISOString().split('T')[0],
      gst: Math.round(amount * 0.05 * 100) / 100,
      paymentMethod,
      notes,
      imageUrl: `https://placehold.co/900x1200/f8fafc/334155?text=${encodeURIComponent(
        `${vendor} Receipt`
      )}`,
    };
  };

  const templates = {
    fuel: ['Shell', 'Petro-Canada', 'Esso'],
    maintenance: ['Canadian Tire', 'Midas', 'Jiffy Lube'],
    parking_tolls: ['Green P', 'Impark', '407 ETR'],
    mobile_internet: ['Rogers', 'Bell', 'Telus'],
    supplies: ['Staples', 'Walmart', 'Costco'],
    equipment: ['Best Buy', 'Amazon', 'Home Depot'],
    insurance: ['Intact Insurance', 'Aviva', 'TD Insurance'],
    meals: ['Tim Hortons', 'A&W', 'Subway'],
    medical: ['Shoppers Drug Mart', 'Dental Clinic', 'Pharmacy'],
    tuition: ['University Payment', 'College Fees', 'Course Portal'],
    donations: ['United Way', 'Red Cross', 'Local Charity'],
    rrsp: ['RBC', 'TD Direct Investing', 'Wealthsimple'],
    childcare: ['BrightPath', 'Daycare Center', 'Child Care Provider'],
    moving: ['U-Haul', 'Moving Supplies', 'Truck Rental'],
    home_office: ['Staples', 'Telus', 'IKEA'],
    rent_utilities: ['Landlord Payment', 'ATCO', 'Enmax'],
    vehicle_expenses: ['Auto Expense Bundle', 'Vehicle Log Upload', 'Driving Costs'],
    vehicle_purchase: ['Toyota Edmonton', 'Westgate Chevrolet', 'Honda Dealership'],
    payroll_expenses: ['Payroll Provider', 'Wage Summary', 'Salary Records'],
    inventory_purchases: ['Wholesale Supplier', 'Inventory Vendor', 'Stock Purchase'],
    professional_fees: ['Accountant Invoice', 'Legal Invoice', 'Consulting Fee'],
    other: ['Other Expense', 'Misc Expense', 'General Receipt'],
  };

  let id = 1;
  const rows = [];

  categories.forEach((category, index) => {
    const vendors = templates[category] || templates.other;

    vendors.slice(0, 2).forEach((vendor, vendorIndex) => {
      const isVehiclePurchase = category === 'vehicle_purchase';

      rows.push(
        buildReceipt(
          id++,
          vendor,
          category,
          isVehiclePurchase
            ? Number((38250 + vendorIndex * 1750).toFixed(2))
            : Number((25 + index * 17 + vendorIndex * 21.35).toFixed(2)),
          2 + index * 3 + vendorIndex * 5,
          isVehiclePurchase
            ? 'Vehicle bill of sale uploaded for tax support.'
            : `${CATEGORY_META[category]?.label || 'Receipt'} uploaded for tax support.`,
          isVehiclePurchase ? 'Financing' : 'Credit Card'
        )
      );
    });
  });

  return rows;
}

const Receipts = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('folders');
  const [dateRange, setDateRange] = useState('year');
  const [sortBy, setSortBy] = useState('date-desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [previewReceipt, setPreviewReceipt] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedReceiptCategories =
    user?.documentPreferences?.selectedReceiptCategories || [];
  const suggestedReceiptCategories =
    user?.onboarding?.suggestedReceiptCategories || [];
  const selectedSlips = user?.documentPreferences?.selectedSlips || [];
  const suggestedSlips = user?.onboarding?.suggestedSlips || [];

  const finalSlips = selectedSlips.length > 0 ? selectedSlips : suggestedSlips;

  const fallbackCategories = useMemo(() => {
    const taxProfile = user?.taxProfile || {};

    if (taxProfile?.incorporatedBusiness) return BUSINESS_FALLBACK;
    if (taxProfile?.gigWork || taxProfile?.selfEmployment) return GIG_FALLBACK;
    return EMPLOYEE_FALLBACK;
  }, [user]);

  const finalReceiptCategories = useMemo(() => {
    const base =
      selectedReceiptCategories.length > 0
        ? selectedReceiptCategories
        : suggestedReceiptCategories.length > 0
          ? suggestedReceiptCategories
          : fallbackCategories;

    const normalized = base.map(mapLegacyCategory);

    if (finalSlips.includes('RRSP') && !normalized.includes('rrsp')) {
      normalized.push('rrsp');
    }
    if (finalSlips.includes('MEDICAL') && !normalized.includes('medical')) {
      normalized.push('medical');
    }
    if (finalSlips.includes('TUITION') && !normalized.includes('tuition')) {
      normalized.push('tuition');
    }
    if (finalSlips.includes('DONATIONS') && !normalized.includes('donations')) {
      normalized.push('donations');
    }
    if (finalSlips.includes('CHILD_CARE') && !normalized.includes('childcare')) {
      normalized.push('childcare');
    }
    if (finalSlips.includes('MOVING') && !normalized.includes('moving')) {
      normalized.push('moving');
    }
    if (finalSlips.includes('HOME_OFFICE') && !normalized.includes('home_office')) {
      normalized.push('home_office');
    }
    if (
      user?.vehiclePurchase?.wantsBillOfSaleUpload &&
      !normalized.includes('vehicle_purchase')
    ) {
      normalized.push('vehicle_purchase');
    }

    return Array.from(new Set(normalized)).filter((key) => CATEGORY_META[key]);
  }, [
    selectedReceiptCategories,
    suggestedReceiptCategories,
    fallbackCategories,
    finalSlips,
    user?.vehiclePurchase?.wantsBillOfSaleUpload,
  ]);

  const visibleCategories = useMemo(() => {
    return ['all', ...finalReceiptCategories];
  }, [finalReceiptCategories]);

  useEffect(() => {
    const mockReceipts = generateMockReceipts(finalReceiptCategories);

    if (user?.vehiclePurchase?.wantsBillOfSaleUpload) {
      const hasVehiclePurchase = mockReceipts.some(
        (receipt) => receipt.category === 'vehicle_purchase'
      );

      if (!hasVehiclePurchase) {
        mockReceipts.push({
          id: 'vehicle-purchase-1',
          category: 'vehicle_purchase',
          vendor: 'Toyota Edmonton',
          amount: 38250,
          gst: 1912.5,
          date: '2026-02-14',
          paymentMethod: 'Financing',
          status: 'uploaded',
          notes: '2024 Toyota Corolla bill of sale for gig work vehicle',
          fileName: 'toyota-bill-of-sale.pdf',
          imageUrl:
            'https://placehold.co/900x1200/f8fafc/334155?text=Toyota%20Edmonton%20Bill%20of%20Sale',
        });
      }
    }

    setReceipts(mockReceipts);
    setLoading(false);
  }, [finalReceiptCategories, user?.vehiclePurchase?.wantsBillOfSaleUpload]);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');

    if (categoryFromUrl && visibleCategories.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
      setViewMode('list');
    } else if (!categoryFromUrl) {
      setSelectedCategory('all');
    }
  }, [searchParams, visibleCategories]);

  useEffect(() => {
    if (!visibleCategories.includes(selectedCategory)) {
      setSelectedCategory('all');
      setSearchParams({});
    }
  }, [visibleCategories, selectedCategory, setSearchParams]);

  const handleCategoryChange = (categoryKey, mode = 'list') => {
    setSelectedCategory(categoryKey);
    setViewMode(mode);

    if (categoryKey === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryKey });
    }
  };

  const categoryCounts = useMemo(() => {
    const counts = visibleCategories.reduce((acc, category) => {
      acc[category] = 0;
      return acc;
    }, {});

    counts.all = receipts.length;

    receipts.forEach((receipt) => {
      if (counts[receipt.category] !== undefined) {
        counts[receipt.category] += 1;
      }
    });

    return counts;
  }, [receipts, visibleCategories]);

  const filteredReceipts = useMemo(() => {
    const now = new Date();

    const matchesDateRange = (receiptDate) => {
      const d = new Date(receiptDate);

      if (dateRange === 'month') {
        const cutoff = new Date(now);
        cutoff.setDate(now.getDate() - 30);
        return d >= cutoff;
      }

      if (dateRange === 'quarter') {
        const cutoff = new Date(now);
        cutoff.setMonth(now.getMonth() - 3);
        return d >= cutoff;
      }

      if (dateRange === 'year') {
        return d.getFullYear() === now.getFullYear();
      }

      return true;
    };

    const list = receipts.filter((receipt) => {
      if (selectedCategory !== 'all' && receipt.category !== selectedCategory) {
        return false;
      }

      if (!matchesDateRange(receipt.date)) {
        return false;
      }

      if (!searchTerm.trim()) return true;

      const value = searchTerm.toLowerCase();
      return (
        receipt.vendor.toLowerCase().includes(value) ||
        receipt.notes.toLowerCase().includes(value) ||
        receipt.category.toLowerCase().includes(value) ||
        receipt.paymentMethod.toLowerCase().includes(value)
      );
    });

    return [...list].sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        case 'date-desc':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });
  }, [receipts, selectedCategory, searchTerm, sortBy, dateRange]);

  const totalAmount = filteredReceipts.reduce((sum, item) => sum + item.amount, 0);
  const totalGST = filteredReceipts.reduce((sum, item) => sum + (item.gst || 0), 0);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const setupMode = user?.documentPreferences?.skippedAtRegistration
    ? 'Skipped at registration'
    : user?.documentPreferences?.needsSuggestions
      ? 'Suggested by app'
      : 'Selected by user';

  const DeleteModal = () => {
    if (!showDeleteModal || !selectedReceipt) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4 py-8">
          <div className="fixed inset-0 bg-gray-900/50" onClick={() => setShowDeleteModal(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-red-100 p-3">
                  <AlertCircle size={20} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete receipt</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Delete {selectedReceipt.vendor} from your receipt uploads. This cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t px-6 py-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>

              <button
                className="flex-1 rounded-lg border border-red-200 bg-red-50 px-4 py-2 font-medium text-red-700 transition hover:bg-red-100"
                onClick={() => {
                  setReceipts((current) =>
                    current.filter((receipt) => receipt.id !== selectedReceipt.id)
                  );
                  setShowDeleteModal(false);
                  setSelectedReceipt(null);
                  if (previewReceipt?.id === selectedReceipt.id) {
                    setPreviewReceipt(null);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ReceiptPreviewModal = () => {
    if (!previewReceipt) return null;

    const meta = CATEGORY_META[previewReceipt.category] || CATEGORY_META.other;
    const Icon = meta.icon;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4 py-8">
          <div
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={() => setPreviewReceipt(null)}
          />

          <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
                  Receipt Preview
                </p>
                <h3 className="mt-1 text-xl font-semibold text-gray-900">
                  {previewReceipt.vendor}
                </h3>
              </div>

              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
                onClick={() => setPreviewReceipt(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="border-b border-gray-100 bg-gray-50 p-5 lg:border-b-0 lg:border-r">
                <div className="flex h-full min-h-[420px] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gray-200 bg-white">
                  <img
                    src={previewReceipt.imageUrl}
                    alt={`${previewReceipt.vendor} receipt`}
                    className="h-full max-h-[70vh] w-full object-contain"
                  />
                </div>
              </div>

              <div className="space-y-5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${meta.chip}`}
                    >
                      <Icon size={12} className="mr-2" />
                      {meta.label}
                    </div>
                    <p className="mt-3 text-sm text-gray-500">
                      Uploaded • {formatDate(previewReceipt.date)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Total
                    </p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">
                      ${previewReceipt.amount.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <InfoTile label="GST/HST" value={`$${previewReceipt.gst.toFixed(2)}`} />
                  <InfoTile label="Payment" value={previewReceipt.paymentMethod} />
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Note
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {previewReceipt.notes || 'No notes added for this receipt.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Link to={`/receipts/${previewReceipt.id}`}>
                    <Button variant="outline" className="w-full">
                      <Eye size={16} className="mr-2" />
                      Open details page
                    </Button>
                  </Link>

                  <button
                    className="inline-flex w-full items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100"
                    onClick={() => {
                      setSelectedReceipt(previewReceipt);
                      setShowDeleteModal(true);
                    }}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete receipt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ReceiptCard = ({ receipt }) => {
    const meta = CATEGORY_META[receipt.category] || CATEGORY_META.other;
    const Icon = meta.icon;

    return (
      <button
        type="button"
        onClick={() => setPreviewReceipt(receipt)}
        className="w-full text-left"
      >
        <Card className="group h-full overflow-hidden border border-gray-200 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <Card.Body className="p-0">
            <div className="relative">
              <div className="h-32 overflow-hidden bg-gray-100">
                <img
                  src={receipt.imageUrl}
                  alt={`${receipt.vendor} receipt`}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
              </div>

              <div className="absolute left-3 top-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium shadow-sm ${meta.chip}`}
                >
                  <Icon size={11} className="mr-1.5" />
                  {meta.label}
                </span>
              </div>

              <div className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1.5 shadow-sm">
                <span className="text-sm font-bold text-gray-900">
                  ${receipt.amount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-3 p-4">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-gray-900">
                      {receipt.vendor}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">{formatDate(receipt.date)}</p>
                  </div>

                  <div className="rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700">
                    View
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl bg-gray-50 px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    GST/HST
                  </p>
                  <p className="mt-1 font-semibold text-gray-800">
                    ${receipt.gst.toFixed(2)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    Payment
                  </p>
                  <p className="mt-1 truncate font-semibold text-gray-800">
                    {receipt.paymentMethod}
                  </p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </button>
    );
  };

  const EmptyState = () => (
    <Card>
      <Card.Body>
        <div className="py-10 text-center">
          <FileUp size={40} className="mx-auto text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No receipts found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Start adding recurring expense receipts so they are ready for tax filing.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link to="/receipts/new">
              <Button variant="primary">
                <Plus size={16} className="mr-2" />
                Add Receipt
              </Button>
            </Link>
            <Link to="/documents">
              <Button variant="outline">Open Tax Documents</Button>
            </Link>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900">Receipts &amp; Expense Uploads</h1>
          <p className="mt-2 text-gray-600">
            Store recurring expense receipts and day-to-day tax proof such as fuel, maintenance,
            parking, mobile bills, supplies, meals, and other frequent uploads.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Built from your selected or suggested receipt setup.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/documents">
            <Button variant="outline">Open Tax Documents</Button>
          </Link>
          <Link to="/receipts/new">
            <Button variant="primary">
              <Plus size={16} className="mr-2" />
              Add Receipt
            </Button>
          </Link>
        </div>
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <Card.Body>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="info">{setupMode}</Badge>
            <Badge variant="success">{finalReceiptCategories.length} receipt categories</Badge>
            <Badge variant="warning">{finalSlips.length} related slip types</Badge>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search receipts by vendor, category, note, or payment method..."
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" onClick={() => setShowFilters((prev) => !prev)}>
                Filters
              </Button>

              <button
                onClick={() => setViewMode('folders')}
                className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                  viewMode === 'folders'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Folder size={16} className="mr-2" />
                Folders
              </button>

              <button
                onClick={() => setViewMode('list')}
                className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                  viewMode === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <List size={16} className="mr-2" />
                List
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="year">This Year</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="month">Last 30 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="amount-desc">Highest Amount</option>
                  <option value="amount-asc">Lowest Amount</option>
                </select>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      <div className="flex flex-wrap gap-2">
        {visibleCategories.map((categoryKey) => {
          const meta = CATEGORY_META[categoryKey];
          const isActive = selectedCategory === categoryKey;

          return (
            <button
              key={categoryKey}
              onClick={() => handleCategoryChange(categoryKey, 'list')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {meta.label} ({categoryCounts[categoryKey] || 0})
            </button>
          );
        })}
      </div>

      {viewMode === 'list' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <Card.Body>
              <p className="text-sm text-gray-500">Visible Receipts</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{filteredReceipts.length}</p>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="mt-1 text-2xl font-bold text-green-600">${totalAmount.toFixed(2)}</p>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <p className="text-sm text-gray-500">GST/HST Paid</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">${totalGST.toFixed(2)}</p>
            </Card.Body>
          </Card>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary-500" />
          <p className="mt-4 text-sm text-gray-500">Loading receipts...</p>
        </div>
      ) : viewMode === 'folders' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {visibleCategories.map((categoryKey) => {
            const meta = CATEGORY_META[categoryKey];
            const Icon = meta.icon;

            return (
              <Card
                key={categoryKey}
                className={`cursor-pointer transition hover:shadow-md ${
                  selectedCategory === categoryKey ? 'ring-2 ring-primary-500' : ''
                }`}
                onClick={() => handleCategoryChange(categoryKey, 'list')}
              >
                <Card.Body>
                  <div className="mb-4 flex items-center justify-between">
                    <div className={`rounded-xl p-3 ${meta.iconWrap}`}>
                      <Icon size={22} className={meta.iconColor} />
                    </div>
                    <Badge variant="info">{categoryCounts[categoryKey] || 0}</Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900">{meta.label}</h3>
                  <p className="mt-2 text-sm text-gray-500">{meta.description}</p>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      ) : filteredReceipts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredReceipts.map((receipt) => (
            <ReceiptCard key={receipt.id} receipt={receipt} />
          ))}
        </div>
      )}

      <ReceiptPreviewModal />
      <DeleteModal />
    </div>
  );
};

export default Receipts;
