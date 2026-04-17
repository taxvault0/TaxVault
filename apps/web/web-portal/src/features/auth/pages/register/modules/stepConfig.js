import {
  STEP_TITLES,
  PROFILE_OPTIONS,
  EMPLOYMENT_STATUSES,
  SPOUSE_EMPLOYMENT_STATUSES,
  TAX_FILING_STATUSES,
  BUSINESS_TYPES,
  PLATFORMS,
  DEPENDENT_OPTIONS,
  RECEIPT_OPTIONS,
  VEHICLE_OWNERSHIP_OPTIONS,
  PROVINCES,
} from './constants';

export const stepConfig = [
  { step: 1, key: 'account', title: STEP_TITLES[0] },
  { step: 2, key: 'personal', title: STEP_TITLES[1] },
  { step: 3, key: 'tax', title: STEP_TITLES[2] },
  { step: 4, key: 'income', title: STEP_TITLES[3] },
  { step: 5, key: 'deductions', title: STEP_TITLES[4] },
  { step: 6, key: 'review', title: STEP_TITLES[5] },
];

export const registerOptions = {
  profileOptions: PROFILE_OPTIONS,
  employmentStatuses: EMPLOYMENT_STATUSES,
  spouseEmploymentStatuses: SPOUSE_EMPLOYMENT_STATUSES,
  taxFilingStatuses: TAX_FILING_STATUSES,
  businessTypes: BUSINESS_TYPES,
  platforms: PLATFORMS,
  dependentOptions: DEPENDENT_OPTIONS,
  receiptOptions: RECEIPT_OPTIONS,
  vehicleOwnershipOptions: VEHICLE_OWNERSHIP_OPTIONS,
  provinces: PROVINCES,
};
