export const onlyDigits = (value = '') => String(value).replace(/\D/g, '');

export const normalizePhoneNumber = (value = '') => {
  const digits = onlyDigits(value);

  if (digits.length === 11 && digits.startsWith('1')) {
    return digits.slice(1);
  }

  return digits.slice(0, 10);
};

export const formatPhoneNumber = (value = '') => {
  const digits = normalizePhoneNumber(value);

  if (!digits) return '';
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

export const normalizePostalCode = (value = '') => {
  const cleaned = String(value).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  if (cleaned.length <= 3) return cleaned;
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
};

export const normalizeFirmSize = (value = '') => {
  const map = {
    solo: 'Solo',
    small: 'Small',
    medium: 'Medium',
    large: 'Large'
  };

  const key = String(value || '').trim().toLowerCase();
  return map[key] || value || '';
};

export const normalizeWebsite = (value = '') => {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

export const isValidEmail = (value = '') => /^\S+@\S+\.\S+$/.test(String(value).trim());

export const isValidCanadianPostalCode = (value = '') =>
  /^[A-Z]\d[A-Z][ ]?\d[A-Z]\d$/.test(String(value).trim().toUpperCase());

export const isValidPhone = (value = '') => normalizePhoneNumber(value).length === 10;

export const isStrongPassword = (value = '') =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(String(value));

export const safeArray = (value) => (Array.isArray(value) ? value : []);

export const currentYear = new Date().getFullYear();