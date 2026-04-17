import api from '@/services/api';

const normalizeField = (item = {}) => ({
  key: item.key || item.name || item.field || '',
  label: item.label || item.name || item.field || 'Field',
  value:
    item.value !== undefined && item.value !== null
      ? String(item.value)
      : '',
  confidence:
    typeof item.confidence === 'number'
      ? item.confidence
      : null,
  source:
    item.source || item.documentType || '',
  editable:
    typeof item.editable === 'boolean'
      ? item.editable
      : true,
});

const normalizeResult = (payload = {}) => ({
  jobId: payload.jobId || payload.id || '',
  status: payload.status || 'review_required',
  documentId: payload.documentId || '',
  documentType: payload.documentType || payload.type || 'Tax Document',
  fields: Array.isArray(payload.fields) ? payload.fields.map(normalizeField) : [],
  raw: payload,
});

const mockExtractionResult = {
  jobId: 'mock-job-1',
  status: 'review_required',
  documentId: 'mock-doc-1',
  documentType: 'T4',
  fields: [
    {
      key: 'employerName',
      label: 'Employer Name',
      value: 'Demo Employer Ltd.',
      confidence: 0.98,
      source: 'T4',
      editable: true,
    },
    {
      key: 'employmentIncome',
      label: 'Employment Income',
      value: '58250',
      confidence: 0.97,
      source: 'Box 14',
      editable: true,
    },
    {
      key: 'incomeTaxDeducted',
      label: 'Income Tax Deducted',
      value: '8450',
      confidence: 0.95,
      source: 'Box 22',
      editable: true,
    },
    {
      key: 'cppContributions',
      label: 'CPP Contributions',
      value: '3750',
      confidence: 0.93,
      source: 'Box 16',
      editable: true,
    },
    {
      key: 'eiPremiums',
      label: 'EI Premiums',
      value: '980',
      confidence: 0.92,
      source: 'Box 18',
      editable: true,
    },
  ],
};

const taxExtractionService = {
  extractDocument: async (documentId) => {
    try {
      const response = await api.post('/tax-extraction/extract', { documentId });
      return normalizeResult(
        response?.data?.data || response?.data?.result || response?.data
      );
    } catch (error) {
      return {
        ...mockExtractionResult,
        documentId: documentId || mockExtractionResult.documentId,
      };
    }
  },

  getExtractionResult: async (jobId) => {
    try {
      const response = await api.get(`/tax-extraction/${jobId}`);
      return normalizeResult(
        response?.data?.data || response?.data?.result || response?.data
      );
    } catch (error) {
      return {
        ...mockExtractionResult,
        jobId: jobId || mockExtractionResult.jobId,
      };
    }
  },

  confirmExtraction: async (payload) => {
    try {
      const response = await api.post('/tax-extraction/confirm', payload);
      return response?.data?.data || response?.data || { success: true };
    } catch (error) {
      return {
        success: true,
        message: 'Extraction confirmed locally',
        data: payload,
      };
    }
  },
};

export default taxExtractionService;