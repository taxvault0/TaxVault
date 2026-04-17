// Provincial tax configurations for Canada
export const PROVINCES = [
  { code: 'AB', name: 'Alberta', type: 'GST Only', taxAgency: 'CRA' },
  { code: 'BC', name: 'British Columbia', type: 'GST + PST', taxAgency: 'CRA + BC Ministry' },
  { code: 'MB', name: 'Manitoba', type: 'GST + RST', taxAgency: 'CRA + Manitoba Finance' },
  { code: 'NB', name: 'New Brunswick', type: 'HST', taxAgency: 'CRA' },
  { code: 'NL', name: 'Newfoundland and Labrador', type: 'HST', taxAgency: 'CRA' },
  { code: 'NS', name: 'Nova Scotia', type: 'HST', taxAgency: 'CRA' },
  { code: 'NT', name: 'Northwest Territories', type: 'GST Only', taxAgency: 'CRA' },
  { code: 'NU', name: 'Nunavut', type: 'GST Only', taxAgency: 'CRA' },
  { code: 'ON', name: 'Ontario', type: 'HST', taxAgency: 'CRA' },
  { code: 'PE', name: 'Prince Edward Island', type: 'HST', taxAgency: 'CRA' },
  { code: 'QC', name: 'Quebec', type: 'GST + QST', taxAgency: 'Revenu Québec + CRA' },
  { code: 'SK', name: 'Saskatchewan', type: 'GST + PST', taxAgency: 'CRA + Sask Finance' },
  { code: 'YT', name: 'Yukon', type: 'GST Only', taxAgency: 'CRA' },
];

// Tax rates by province (2024 rates)
export const TAX_RATES = {
  federal: { gst: 0.05 },
  provincial: {
    'AB': { type: 'GST', rate: 0 },
    'BC': { type: 'PST', rate: 0.07 },
    'MB': { type: 'RST', rate: 0.07 },
    'NB': { type: 'HST', rate: 0.15 },
    'NL': { type: 'HST', rate: 0.15 },
    'NS': { type: 'HST', rate: 0.15 },
    'NT': { type: 'GST', rate: 0 },
    'NU': { type: 'GST', rate: 0 },
    'ON': { type: 'HST', rate: 0.13 },
    'PE': { type: 'HST', rate: 0.15 },
    'QC': { type: 'QST', rate: 0.09975 },
    'SK': { type: 'PST', rate: 0.06 },
    'YT': { type: 'GST', rate: 0 },
  },
};

// Business number formats by province
export const BUSINESS_NUMBER_FORMAT = {
  default: { prefix: 'RT', length: 15, pattern: '123456789RT0001' },
  'QC': { prefix: 'RQ', length: 15, pattern: '123456789RQ0001', agency: 'Revenu Québec' },
};

// Provincial filing deadlines (monthly/quarterly/annual)
export const FILING_DEADLINES = {
  default: {
    monthly: '15th of following month',
    quarterly: '1 month after quarter end',
    annual: 'June 15',
  },
  'QC': {
    monthly: '15th of following month',
    quarterly: '1 month after quarter end',
    annual: 'June 15',
    note: 'File separately with Revenu Québec',
  },
};

// CRA mileage rates by province (2024)
export const MILEAGE_RATES = {
  default: 0.61,
  // Some provinces may have different rates for provincial tax
  'QC': 0.61, // Same as federal
};

// Provincial small business tax rates (for informational purposes)
export const CORPORATE_TAX_RATES = {
  'AB': 0.02, // 2% small business rate
  'BC': 0.02,
  'MB': 0.00,
  'NB': 0.025,
  'NL': 0.03,
  'NS': 0.025,
  'NT': 0.04,
  'NU': 0.04,
  'ON': 0.032,
  'PE': 0.032,
  'QC': 0.032,
  'SK': 0.02,
  'YT': 0.00,
};

/**
 * Calculate taxes based on province
 * @param {number} amount - The amount to calculate tax on
 * @param {string} province - Province code (ON, BC, QC, etc.)
 * @returns {object} - Tax breakdown
 */
export const calculateTaxes = (amount, province) => {
  const gst = amount * TAX_RATES.federal.gst;
  const provincial = TAX_RATES.provincial[province] || { type: 'GST', rate: 0 };
  
  let pst = 0;
  let hst = 0;
  let qst = 0;
  let totalTax = gst;
  
  switch (provincial.type) {
    case 'HST':
      hst = amount * provincial.rate;
      totalTax = hst; // HST includes GST
      break;
    case 'PST':
    case 'RST':
      pst = amount * provincial.rate;
      totalTax = gst + pst;
      break;
    case 'QST':
      qst = amount * provincial.rate;
      totalTax = gst + qst;
      break;
    default:
      // GST only
      break;
  }
  
  return {
    gst,
    pst,
    hst,
    qst,
    total: totalTax,
    type: provincial.type,
    provinceRate: provincial.rate,
  };
};

/**
 * Get tax agency information by province
 * @param {string} province - Province code
 * @returns {object} - Tax agency details
 */
export const getTaxAgency = (province) => {
  const provinceInfo = PROVINCES.find(p => p.code === province);
  return {
    agency: provinceInfo?.taxAgency || 'CRA',
    hasSeparateProvincial: ['QC', 'BC', 'MB', 'SK'].includes(province),
    separateAgency: province === 'QC' ? 'Revenu Québec' : 
                    province === 'BC' ? 'BC Ministry of Finance' : null,
  };
};

/**
 * Get business number format by province
 * @param {string} province - Province code
 * @returns {object} - Business number format
 */
export const getBusinessNumberFormat = (province) => {
  return BUSINESS_NUMBER_FORMAT[province] || BUSINESS_NUMBER_FORMAT.default;
};

/**
 * Get filing deadline information
 * @param {string} province - Province code
 * @param {string} frequency - monthly, quarterly, annual
 * @returns {object} - Deadline info
 */
export const getFilingDeadline = (province, frequency = 'quarterly') => {
  const deadlines = FILING_DEADLINES[province] || FILING_DEADLINES.default;
  return {
    deadline: deadlines[frequency],
    note: deadlines.note || null,
  };
};

/**
 * Get mileage deduction rate by province
 * @param {string} province - Province code
 * @returns {number} - Rate per km
 */
export const getMileageRate = (province) => {
  return MILEAGE_RATES[province] || MILEAGE_RATES.default;
};

/**
 * Format business number based on province
 * @param {string} bn - Business number
 * @param {string} province - Province code
 * @returns {string} - Formatted business number
 */
export const formatBusinessNumber = (bn, province) => {
  const format = getBusinessNumberFormat(province);
  // Simple formatting - in real app, validate pattern
  return bn;
};



