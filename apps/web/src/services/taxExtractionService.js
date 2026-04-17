const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const formatCurrency = (value = 0) =>
  new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

export const ALL_TAX_SLIP_TYPES = [
  {
    key: 'T4',
    label: 'T4',
    fullName: 'Statement of Remuneration Paid',
    category: 'Employment',
    dueWindow: 'Usually by end of February',
    fields: [
      { code: '14', label: 'Employment income', required: true, format: 'currency' },
      { code: '22', label: 'Income tax deducted', required: false, format: 'currency' },
      { code: '16', label: 'CPP contributions', required: false, format: 'currency' },
      { code: '18', label: 'EI premiums', required: false, format: 'currency' },
      { code: '44', label: 'Union dues', required: false, format: 'currency' },
      { code: '52', label: 'Pension adjustment', required: false, format: 'currency' },
      { code: '10', label: 'Province of employment', required: false, format: 'text' },
      { code: '29', label: 'Employment code', required: false, format: 'text' },
    ],
  },
  {
    key: 'T4A',
    label: 'T4A',
    fullName: 'Statement of Pension, Retirement, Annuity, and Other Income',
    category: 'Other income',
    dueWindow: 'Usually by end of February',
    fields: [
      { code: '16', label: 'Pension or superannuation', required: false, format: 'currency' },
      { code: '18', label: 'Lump-sum payments', required: false, format: 'currency' },
      { code: '20', label: 'Self-employed commissions', required: false, format: 'currency' },
      { code: '22', label: 'Income tax deducted', required: false, format: 'currency' },
      { code: '24', label: 'Annuities', required: false, format: 'currency' },
      { code: '48', label: 'Fees for services', required: false, format: 'currency' },
    ],
  },
  {
    key: 'T4A(OAS)',
    label: 'T4A(OAS)',
    fullName: 'Statement of Old Age Security',
    category: 'Benefits',
    dueWindow: 'Usually by end of February',
    fields: [
      { code: '18', label: 'Old Age Security pension paid', required: false, format: 'currency' },
      { code: '22', label: 'Income tax deducted', required: false, format: 'currency' },
    ],
  },
  {
    key: 'T4A(P)',
    label: 'T4A(P)',
    fullName: 'Statement of Canada Pension Plan Benefits',
    category: 'Benefits',
    dueWindow: 'Usually by end of February',
    fields: [
      { code: '20', label: 'Taxable CPP benefits', required: false, format: 'currency' },
      { code: '22', label: 'Income tax deducted', required: false, format: 'currency' },
    ],
  },
  {
    key: 'T4E',
    label: 'T4E',
    fullName: 'Statement of Employment Insurance and Other Benefits',
    category: 'Benefits',
    dueWindow: 'Usually by end of February',
    fields: [
      { code: '14', label: 'Total benefits paid', required: false, format: 'currency' },
      { code: '15', label: 'Income tax deducted', required: false, format: 'currency' },
    ],
  },
  {
    key: 'T4FHSA',
    label: 'T4FHSA',
    fullName: 'First Home Savings Account Statement',
    category: 'Registered accounts',
    dueWindow: 'Usually by end of February',
    fields: [
      { code: '18', label: 'FHSA contributions', required: false, format: 'currency' },
      { code: '20', label: 'FHSA withdrawals', required: false, format: 'currency' },
    ],
  },
  {
    key: 'T4RIF',
    label: 'T4RIF',
    fullName: 'Statement of Income From a Registered Retirement Income Fund',
    category: 'Registered accounts',
    dueWindow: 'Usually by end of February',
    fields: [
      { code: '16', label: 'Taxable amount', required: false, format: 'currency' },
      { code: '22', label: 'Income tax deducted', required: false, format: 'currency' },
    ],
  },
  {
    key: 'T4RSP',
    label: 'T4RSP',
    fullName: 'Statement of RRSP Income',
    category: 'Registered accounts',
    dueWindow: 'Usually by end of February',
    fields: [
      { code: '22', label: 'Income tax deducted', required: false, format: 'currency' },
      { code: '34', label: 'Refund of premiums', required: false, format: 'currency' },
    ],
  },
  {
    key: 'T5',
    label: 'T5',
    fullName: 'Statement of Investment Income',
    category: 'Investment income',
    dueWindow: 'Usually by end of February',
    fields: [
      { code: '13', label: 'Interest from Canadian sources', required: false, format: 'currency' },
      { code: '15', label: 'Foreign income', required: false, format: 'currency' },
      { code: '22', label: 'Dividend income', required: false, format: 'currency' },
      { code: '25', label: 'Taxable amount of eligible dividends', required: false, format: 'currency' },
    ],
  },
  {
    key: 'T5007',
    label: 'T5007',
    fullName: 'Statement of Benefits',
    category: 'Benefits',
    dueWindow: 'Usually by end of February',
    fields: [
      { code: '11', label: 'Social assistance payments', required: false, format: 'currency' },
      { code: '12', label: 'Workers’ compensation benefits', required: false, format: 'currency' },
    ],
  },
  {
    key: 'T5008',
    label: 'T5008',
    fullName: 'Statement of Securities Transactions',
    category: 'Investment income',
    dueWindow: 'Usually by end of February',
    fields: [
      { code: '20', label: 'Cost or book value', required: false, format: 'currency' },
      { code: '21', label: 'Proceeds of disposition', required: false, format: 'currency' },
    ],
  },
  {
    key: 'T5013',
    label: 'T5013',
    fullName: 'Statement of Partnership Income',
    category: 'Business / partnership',
    dueWindow: 'May arrive by end of March',
    fields: [
      { code: '118', label: 'Business income (loss)', required: false, format: 'currency' },
      { code: '128', label: 'Rental income (loss)', required: false, format: 'currency' },
      { code: '210', label: 'Capital gains (losses)', required: false, format: 'currency' },
    ],
  },
  {
    key: 'T5018',
    label: 'T5018',
    fullName: 'Statement of Contract Payments',
    category: 'Business / contract',
    dueWindow: 'Usually by end of February',
    fields: [
      { code: '22', label: 'Total contract payments', required: false, format: 'currency' },
    ],
  },
  {
    key: 'T3',
    label: 'T3',
    fullName: 'Statement of Trust Income Allocations and Designations',
    category: 'Investment income',
    dueWindow: 'May arrive by end of March',
    fields: [
      { code: '26', label: 'Other income', required: false, format: 'currency' },
      { code: '49', label: 'Capital gains', required: false, format: 'currency' },
      { code: '50', label: 'Dividend income', required: false, format: 'currency' },
    ],
  },
  {
    key: 'T2202',
    label: 'T2202',
    fullName: 'Tuition and Enrolment Certificate',
    category: 'Education',
    dueWindow: 'Usually by end of February',
    fields: [
      { code: '23', label: 'Eligible tuition fees', required: false, format: 'currency' },
      { code: '25', label: 'Months part-time', required: false, format: 'number' },
      { code: '26', label: 'Months full-time', required: false, format: 'number' },
    ],
  },
  {
    key: 'T1204',
    label: 'T1204',
    fullName: 'Government Services Contract Payments',
    category: 'Business / contract',
    dueWindow: 'Usually by end of February',
    fields: [
      { code: '82', label: 'Contract payment amount', required: false, format: 'currency' },
    ],
  },
  {
    key: 'RC62',
    label: 'RC62',
    fullName: 'Universal Child Care Benefit Statement',
    category: 'Benefits',
    dueWindow: 'Usually by end of February',
    fields: [
      { code: '10', label: 'Universal Child Care Benefit', required: false, format: 'currency' },
    ],
  },
  {
    key: 'RRSP_RECEIPT',
    label: 'RRSP Receipt',
    fullName: 'RRSP Contribution Receipt',
    category: 'Deductions',
    dueWindow: 'Can arrive as late as May for first 60 days contributions',
    fields: [
      { code: 'RRSP', label: 'RRSP contribution amount', required: false, format: 'currency' },
    ],
  },
  {
    key: 'PRPP_RECEIPT',
    label: 'PRPP Receipt',
    fullName: 'PRPP Contribution Receipt',
    category: 'Deductions',
    dueWindow: 'Can arrive as late as May for first 60 days contributions',
    fields: [
      { code: 'PRPP', label: 'PRPP contribution amount', required: false, format: 'currency' },
    ],
  },
];

const uploadedSlipRecords = [
  {
    id: 'slip-t4-1',
    type: 'T4',
    issuer: 'ABC Manufacturing Ltd.',
    documentName: 'T4_ABC_Manufacturing_2025.pdf',
    uploadedAt: '2026-03-18',
    status: 'verified',
    confidence: 0.97,
    sourceDocumentId: 'doc-t4-1',
    fields: {
      '14': 68500,
      '22': 11240,
      '16': 3867.5,
      '18': 1049.12,
      '44': 620,
      '52': 2100,
      '10': 'AB',
      '29': '11',
    },
    flags: [],
  },
  {
    id: 'slip-t4a-1',
    type: 'T4A',
    issuer: 'North Peak Media Inc.',
    documentName: 'T4A_NorthPeak_2025.pdf',
    uploadedAt: '2026-03-19',
    status: 'review',
    confidence: 0.86,
    sourceDocumentId: 'doc-t4a-1',
    fields: {
      '20': 24300,
      '48': 12800,
      '22': 0,
    },
    flags: [
      'Box 48 confidence is lower than normal.',
      'Please verify issuer and uploaded tax year before filing.',
    ],
  },
  {
    id: 'slip-t5-1',
    type: 'T5',
    issuer: 'CIBC',
    documentName: 'T5_CIBC_2025.pdf',
    uploadedAt: '2026-03-14',
    status: 'review',
    confidence: 0.83,
    sourceDocumentId: 'doc-t5-1',
    fields: {
      '13': 420.55,
      '22': 210.35,
    },
    flags: ['Payer name needs manual confirmation.'],
  },
  {
    id: 'slip-rrsp-1',
    type: 'RRSP_RECEIPT',
    issuer: 'RBC Direct Investing',
    documentName: 'RRSP_RBC_2025.pdf',
    uploadedAt: '2026-03-15',
    status: 'verified',
    confidence: 0.98,
    sourceDocumentId: 'doc-rrsp-1',
    fields: {
      RRSP: 6000,
    },
    flags: [],
  },
  {
    id: 'slip-t2202-1',
    type: 'T2202',
    issuer: 'Northern Alberta Institute',
    documentName: 'T2202_NAIT_2025.pdf',
    uploadedAt: '2026-03-11',
    status: 'verified',
    confidence: 0.95,
    sourceDocumentId: 'doc-t2202-1',
    fields: {
      '23': 3200,
      '25': 0,
      '26': 8,
    },
    flags: [],
  },
];

const deductions = [
  { id: 'ded-1', label: 'RRSP Contributions', amount: 6000, type: 'deduction' },
  { id: 'ded-2', label: 'Medical Expenses', amount: 980, type: 'credit' },
  { id: 'ded-3', label: 'Donations', amount: 250, type: 'credit' },
  { id: 'ded-4', label: 'Tuition', amount: 3200, type: 'credit' },
];

const buildSlipInstance = (definition, record) => {
  const fields = definition.fields.map((field) => ({
    ...field,
    value: record?.fields?.[field.code] ?? null,
  }));

  return {
    id: record?.id || `${definition.key.toLowerCase()}-missing`,
    type: definition.key,
    label: definition.label,
    fullName: definition.fullName,
    category: definition.category,
    dueWindow: definition.dueWindow,
    issuer: record?.issuer || 'Not uploaded',
    documentName: record?.documentName || null,
    uploadedAt: record?.uploadedAt || null,
    status: record?.status || 'missing',
    confidence: record?.confidence ?? null,
    sourceDocumentId: record?.sourceDocumentId || null,
    fields,
    flags:
      record?.flags?.length > 0
        ? record.flags
        : record
          ? []
          : ['Client has not uploaded this slip or receipt yet.'],
    isUploaded: !!record,
  };
};

const buildClientSummary = (clientId, taxYear) => {
  const supportedSlips = ALL_TAX_SLIP_TYPES.map((definition) => {
    const match = uploadedSlipRecords.find((item) => item.type === definition.key);
    return buildSlipInstance(definition, match);
  });

  const getTotalFor = (type, code) =>
    supportedSlips
      .filter((slip) => slip.type === type)
      .reduce(
        (sum, slip) =>
          sum + Number(slip.fields.find((field) => field.code === code)?.value || 0),
        0
      );

  const employmentIncomeTotal = getTotalFor('T4', '14');
  const selfEmploymentIncomeTotal =
    getTotalFor('T4A', '20') +
    getTotalFor('T4A', '48') +
    getTotalFor('T5018', '22') +
    getTotalFor('T1204', '82');

  const totalTaxDeducted = supportedSlips.reduce((sum, slip) => {
    const deductibleField = slip.fields.find((field) => field.code === '22');
    return sum + Number(deductibleField?.value || 0);
  }, 0);

  const missingSlipTypes = supportedSlips
    .filter((slip) => !slip.isUploaded)
    .map((slip) => slip.label);

  const reviewItems = supportedSlips
    .filter(
      (slip) =>
        slip.isUploaded && (slip.status === 'review' || Number(slip.confidence || 1) < 0.9)
    )
    .map((slip) => ({
      id: slip.id,
      clientId,
      clientName: clientId === '1' ? 'John Doe' : `Client ${clientId}`,
      type: slip.label,
      issuer: slip.issuer,
      confidence: slip.confidence,
      documentName: slip.documentName,
      uploadedAt: slip.uploadedAt,
      missingFields: slip.fields
        .filter((field) => field.required && (field.value === null || field.value === ''))
        .map((field) => field.label),
      flags: slip.flags || [],
    }));

  return {
    clientId,
    clientName: clientId === '1' ? 'John Doe' : `Client ${clientId}`,
    taxYear,
    supportedSlips,
    deductions,
    missingSlipTypes,
    flags: [
      ...reviewItems.flatMap((item) => item.flags || []).slice(0, 3),
      ...(missingSlipTypes.length > 0
        ? [`${missingSlipTypes.length} supported slip/receipt types are still missing.`]
        : []),
    ],
    summary: {
      slipsReceived: supportedSlips.filter((slip) => slip.isUploaded).length,
      slipsExpected: supportedSlips.length,
      documentsNeedingReview: reviewItems.length,
      readyToFile: reviewItems.length === 0 && missingSlipTypes.length === 0,
      employmentIncomeTotal,
      selfEmploymentIncomeTotal,
      totalTaxDeducted,
      rrspTotal: getTotalFor('RRSP_RECEIPT', 'RRSP'),
      deductionsTotal: deductions.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    },
    reviewItems,
  };
};

export const taxExtractionService = {
  async getClientTaxSummary(clientId, taxYear = new Date().getFullYear()) {
    await delay();
    return buildClientSummary(String(clientId), Number(taxYear));
  },

  async getReviewQueue(taxYear = new Date().getFullYear()) {
    await delay();

    const clients = ['1', '2', '3'];
    const queue = clients.flatMap((clientId) => {
      const summary = buildClientSummary(clientId, taxYear);
      return summary.reviewItems.map((item) => ({
        ...item,
        clientName:
          clientId === '1'
            ? 'John Doe'
            : clientId === '2'
              ? 'Jane Smith'
              : 'Alice Brown',
      }));
    });

    return queue;
  },
};

export default taxExtractionService;
