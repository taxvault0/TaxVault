export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://172.20.10.5:5000/api';

export const SOCKET_URL =
  process.env.EXPO_PUBLIC_SOCKET_URL || 'http://172.20.10.5:5000';

export const TAX_YEARS = [2025, 2024, 2023, 2022, 2021, 2020];

export const RECEIPT_CATEGORIES = [
  { id: 'fuel', label: 'Fuel', icon: 'gas-station' },
  { id: 'vehicle-maintenance', label: 'Maintenance', icon: 'wrench' },
  { id: 'insurance', label: 'Insurance', icon: 'shield' },
  { id: 'office-supplies', label: 'Office Supplies', icon: 'briefcase' },
  { id: 'internet', label: 'Internet', icon: 'wifi' },
  { id: 'rent', label: 'Rent', icon: 'home' },
  { id: 'utilities', label: 'Utilities', icon: 'flash' },
  { id: 'meals', label: 'Meals', icon: 'food' },
  { id: 'software', label: 'Software', icon: 'laptop' },
  { id: 'advertising', label: 'Advertising', icon: 'megaphone' },
  { id: 'professional-fees', label: 'Professional Fees', icon: 'account-tie' },
  { id: 'tools', label: 'Tools', icon: 'hammer' },
  { id: 'training', label: 'Training', icon: 'school' },
  { id: 'telephone', label: 'Telephone', icon: 'phone' },
  { id: 'home-office', label: 'Home Office', icon: 'desk' },
  { id: 'other', label: 'Other', icon: 'dots-horizontal' },
];

export const DOCUMENT_TYPES = [
  { id: 't4', label: 'T4 Slip' },
  { id: 't4a', label: 'T4A Slip' },
  { id: 't5', label: 'T5 Slip' },
  { id: 't3', label: 'T3 Slip' },
  { id: 't5008', label: 'T5008' },
  { id: 'business-income', label: 'Business Income' },
  { id: 'gst-return', label: 'GST/HST Return' },
  { id: 'notice-of-assessment', label: 'Notice of Assessment' },
  { id: 'rental-income', label: 'Rental Income' },
  { id: 'capital-gains', label: 'Capital Gains' },
  { id: 'rrsp-contribution', label: 'RRSP Contribution' },
  { id: 'medical-expense', label: 'Medical Expense' },
  { id: 'charitable-donation', label: 'Charitable Donation' },
  { id: 'child-care-expense', label: 'Child Care Expense' },
  { id: 'tuition-slip', label: 'Tuition Slip' },
  { id: 'other', label: 'Other' },
];

export const MILEAGE_PURPOSES = [
  { id: 'business', label: 'Business', icon: 'briefcase' },
  { id: 'commute', label: 'Commute', icon: 'home' },
  { id: 'personal', label: 'Personal', icon: 'account' },
];

export const USER_TYPES = [
  { id: 'gig-worker', label: 'Gig Worker', icon: 'car' },
  { id: 'contractor', label: 'Contractor', icon: 'laptop' },
  { id: 'trades', label: 'Trades', icon: 'tools' },
  { id: 'shop-owner', label: 'Shop Owner', icon: 'store' },
  { id: 'student', label: 'Student', icon: 'school' },
  { id: 'employee', label: 'Employee', icon: 'account' },
  { id: 'other', label: 'Other', icon: 'dots-horizontal' },
];

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Up to 10 receipts/month',
      'Basic categories',
      'Manual mileage entry',
      'Limited support',
    ],
  },
  {
    id: 'individual',
    name: 'Individual',
    price: 8,
    features: [
      'Unlimited receipts',
      'AI receipt scanning',
      'Auto mileage tracking',
      'Export reports',
      'Email support',
    ],
  },
  {
    id: 'self-employed',
    name: 'Self-Employed',
    price: 19,
    features: [
      'Everything in Individual',
      'GST/HST tracking',
      'CA collaboration',
      'Advanced analytics',
      'Priority support',
    ],
  },
  {
    id: 'corporate',
    name: 'Corporate',
    price: 39,
    features: [
      'Everything in Self-Employed',
      'Multi-user access',
      'Corporate tax tools',
      'Dedicated account manager',
      'API access',
    ],
  },
];



