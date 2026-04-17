import { PROVINCE_CITIES } from './constants';

export const needsSpouseFields = (formData) => {
  const familyStatus = formData.familyStatus || formData.maritalStatus || '';
  return familyStatus === 'Married' || familyStatus === 'Common-Law';
};

export const hasEmployment = (formData) => !!formData.taxProfile?.employment;
export const hasGigWork = (formData) => !!formData.taxProfile?.gigWork;
export const hasSelfEmployment = (formData) => !!formData.taxProfile?.selfEmployed;
export const hasBusiness = (formData) => !!formData.taxProfile?.businessOwner;

export const spouseHasGigWork = (formData) => !!formData.spouseTaxProfile?.gigWork;
export const spouseHasSelfEmployment = (formData) =>
  !!formData.spouseTaxProfile?.selfEmployed;
export const spouseHasBusiness = (formData) =>
  !!formData.spouseTaxProfile?.businessOwner;

export const getCitiesByProvince = (province) => PROVINCE_CITIES[province] || [];

export const getAvailableVehicleOwners = () => [
  'Primary Taxpayer',
  'Spouse',
  'Joint',
];

export const getAvailableVehicleUses = () => [
  'Employment',
  'Gig Work',
  'Self-Employment',
  'Business',
];