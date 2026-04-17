export const formatDate = (date: Date | null | undefined): string => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const calculateAge = (dateString: string): number => {
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

export const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 10);

  if (digits.length === 0) return '';
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

export const formatPostalCode = (value: string): string => {
  const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  if (cleaned.length <= 3) return cleaned;
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
};

export const isValidEmail = (email: string): boolean => {
  const trimmed = String(email || '').trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!emailRegex.test(trimmed)) return false;

  const blockedDomains = ['gm.com', 'gamil.com', 'gmail.co', 'gmail.con', 'yaho.com'];
  const domain = trimmed.split('@')[1] || '';

  return !blockedDomains.includes(domain);
};

type TaxProfile = {
  gigWork?: boolean;
  selfEmployment?: boolean;
  incorporatedBusiness?: boolean;
};

export const getVehicleUseOptions = (taxProfile: TaxProfile): string[] => {
  const options: string[] = [];

  if (taxProfile.gigWork) options.push('Gig Work');
  if (taxProfile.selfEmployment) options.push('Self-Employment');
  if (taxProfile.incorporatedBusiness) options.push('Business Use');

  return options;
};