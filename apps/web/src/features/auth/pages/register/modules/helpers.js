export const formatPhoneNumber = (value = '') => {
  const digits = String(value).replace(/\D/g, '').slice(0, 10);

  if (!digits.length) return '';
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

export const formatPostalCode = (value = '') => {
  const cleaned = String(value)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 6);

  if (cleaned.length <= 3) return cleaned;
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
};

export const isValidEmail = (email = '') => {
  const trimmed = String(email).trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!emailRegex.test(trimmed)) return false;

  const blockedDomains = ['gm.com', 'gamil.com', 'gmail.co', 'gmail.con', 'yaho.com'];
  const domain = trimmed.split('@')[1] || '';

  return !blockedDomains.includes(domain);
};

export const calculateAge = (dateString = '') => {
  if (!dateString) return 0;

  const today = new Date();
  const dob = new Date(dateString);

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }

  return age;
};

export const toggleArrayItem = (array = [], value) => {
  if (array.includes(value)) {
    return array.filter((item) => item !== value);
  }

  return [...array, value];
};

export const getVehicleUseOptions = (taxProfile = {}) => {
  const options = [];

  if (taxProfile.gigWork) options.push('Gig Work');
  if (taxProfile.selfEmployment) options.push('Self-Employment');
  if (taxProfile.incorporatedBusiness) options.push('Business Use');

  return options;
};

export const getVehicleOwnerOptions = (formData) => {
  const options = [];

  const userEligible =
    formData?.taxProfile?.gigWork ||
    formData?.taxProfile?.selfEmployment ||
    formData?.taxProfile?.incorporatedBusiness;

  const spouseEligible =
    (formData?.maritalStatus === 'Married' || formData?.maritalStatus === 'Common-Law') &&
    (formData?.spouseTaxProfile?.gigWork ||
      formData?.spouseTaxProfile?.selfEmployment ||
      formData?.spouseTaxProfile?.incorporatedBusiness);

  if (userEligible) options.push('Primary Taxpayer');
  if (spouseEligible) options.push('Spouse');

  return options;
};

export const clearVehicleFields = () => ({
  hasVehiclePurchase: false,
  ownerPerson: '',
  ownershipType: '',
  mainUse: '',
  purchaseDate: '',
  purchasePrice: '',
  gstHstPaid: '',
  vin: '',
  billOfSale: null,
});
