// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Calculate GST/HST
export const calculateGST = (amount, rate = 0.05) => {
  return amount * rate;
};

// Calculate business use percentage
export const calculateBusinessPercentage = (businessKm, totalKm) => {
  if (!totalKm) return 0;
  return (businessKm / totalKm) * 100;
};

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate SIN (Canadian)
export const validateSIN = (sin) => {
  const sinStr = sin.replace(/\s/g, '');
  return /^\d{9}$/.test(sinStr);
};

// Validate postal code
export const validatePostalCode = (postalCode) => {
  const re = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
  return re.test(postalCode);
};

// Validate phone number
export const formatPhoneNumber = (value = '') => {
  const digits = String(value).replace(/\D/g, '').slice(0, 10);

  if (!digits) return '';

  if (digits.length > 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  if (digits.length > 3) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits}`;
};
