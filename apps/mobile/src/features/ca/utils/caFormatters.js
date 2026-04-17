export const formatAccountType = (value) => {
  if (value === 'household') return 'Household';
  return 'Single';
};

export const formatWorkflowStatus = (status) => {
  const map = {
    lead: 'Lead',
    consultation_requested: 'Consultation Requested',
    consultation_accepted: 'Consultation Accepted',
    onboarding: 'Onboarding',
    awaiting_documents: 'Awaiting Documents',
    documents_received: 'Documents Received',
    review_in_progress: 'Review In Progress',
    awaiting_client_response: 'Awaiting Client Response',
    ready_to_file: 'Ready to File',
    filed: 'Filed',
    closed: 'Closed',
    rejected: 'Rejected',
  };

  return map[status] || 'Active';
};

export const maskClientId = (value) => {
  if (!value) return 'Not available';
  const str = String(value);
  if (str.length <= 4) return `****${str}`;
  return `****${str.slice(-4)}`;
};

export const getProvinceLabel = (provinceCode) => {
  const provinces = {
    AB: 'Alberta',
    BC: 'British Columbia',
    MB: 'Manitoba',
    NB: 'New Brunswick',
    NL: 'Newfoundland and Labrador',
    NS: 'Nova Scotia',
    NT: 'Northwest Territories',
    NU: 'Nunavut',
    ON: 'Ontario',
    PE: 'Prince Edward Island',
    QC: 'Quebec',
    SK: 'Saskatchewan',
    YT: 'Yukon',
  };

  return provinces[provinceCode] || provinceCode || 'Canada';
};

export const getStatusStyle = (status) => {
  const styles = {
    consultation_requested: {
      bg: '#EDE9FE',
      text: '#6D28D9',
    },
    consultation_accepted: {
      bg: '#DBEAFE',
      text: '#1D4ED8',
    },
    onboarding: {
      bg: '#E0F2FE',
      text: '#0369A1',
    },
    awaiting_documents: {
      bg: '#FEF3C7',
      text: '#B45309',
    },
    documents_received: {
      bg: '#DCFCE7',
      text: '#15803D',
    },
    review_in_progress: {
      bg: '#DBEAFE',
      text: '#1D4ED8',
    },
    awaiting_client_response: {
      bg: '#FCE7F3',
      text: '#BE185D',
    },
    ready_to_file: {
      bg: '#D1FAE5',
      text: '#047857',
    },
    filed: {
      bg: '#DCFCE7',
      text: '#166534',
    },
    closed: {
      bg: '#E5E7EB',
      text: '#374151',
    },
    rejected: {
      bg: '#FEE2E2',
      text: '#B91C1C',
    },
    lead: {
      bg: '#F3F4F6',
      text: '#374151',
    },
  };

  return styles[status] || { bg: '#F3F4F6', text: '#374151' };
};

export const getPriorityStyle = (priority) => {
  const map = {
    high: { bg: '#FEE2E2', text: '#B91C1C' },
    medium: { bg: '#FEF3C7', text: '#B45309' },
    low: { bg: '#DBEAFE', text: '#1D4ED8' },
  };

  return map[priority] || { bg: '#F3F4F6', text: '#374151' };
};


