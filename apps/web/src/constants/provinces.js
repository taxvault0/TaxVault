// Canadian provinces with their tax rates and rules
export const PROVINCES = [
  { 
    id: 'AB', 
    name: 'Alberta', 
    gst: 5, 
    pst: 0, 
    hst: 0,
    taxSystem: 'GST only',
    notes: 'No provincial sales tax'
  },
  { 
    id: 'BC', 
    name: 'British Columbia', 
    gst: 5, 
    pst: 7, 
    hst: 0,
    taxSystem: 'GST + PST',
    notes: 'PST applies to most goods and services'
  },
  { 
    id: 'MB', 
    name: 'Manitoba', 
    gst: 5, 
    pst: 7, 
    hst: 0,
    taxSystem: 'GST + PST',
    notes: 'PST applies to most goods, some exceptions'
  },
  { 
    id: 'NB', 
    name: 'New Brunswick', 
    gst: 0, 
    pst: 0, 
    hst: 15,
    taxSystem: 'HST',
    notes: 'HST rate: 15% (5% federal + 10% provincial)'
  },
  { 
    id: 'NL', 
    name: 'Newfoundland and Labrador', 
    gst: 0, 
    pst: 0, 
    hst: 15,
    taxSystem: 'HST',
    notes: 'HST rate: 15% (5% federal + 10% provincial)'
  },
  { 
    id: 'NS', 
    name: 'Nova Scotia', 
    gst: 0, 
    pst: 0, 
    hst: 15,
    taxSystem: 'HST',
    notes: 'HST rate: 15% (5% federal + 10% provincial)'
  },
  { 
    id: 'ON', 
    name: 'Ontario', 
    gst: 0, 
    pst: 0, 
    hst: 13,
    taxSystem: 'HST',
    notes: 'HST rate: 13% (5% federal + 8% provincial)'
  },
  { 
    id: 'PE', 
    name: 'Prince Edward Island', 
    gst: 0, 
    pst: 0, 
    hst: 15,
    taxSystem: 'HST',
    notes: 'HST rate: 15% (5% federal + 10% provincial)'
  },
  { 
    id: 'QC', 
    name: 'Quebec', 
    gst: 5, 
    qst: 9.975, 
    hst: 0,
    taxSystem: 'GST + QST',
    notes: 'QST rate: 9.975%, administered by Revenu Québec'
  },
  { 
    id: 'SK', 
    name: 'Saskatchewan', 
    gst: 5, 
    pst: 6, 
    hst: 0,
    taxSystem: 'GST + PST',
    notes: 'PST rate: 6%'
  },
  { 
    id: 'NT', 
    name: 'Northwest Territories', 
    gst: 5, 
    pst: 0, 
    hst: 0,
    taxSystem: 'GST only',
    notes: 'No territorial sales tax'
  },
  { 
    id: 'NU', 
    name: 'Nunavut', 
    gst: 5, 
    pst: 0, 
    hst: 0,
    taxSystem: 'GST only',
    notes: 'No territorial sales tax'
  },
  { 
    id: 'YT', 
    name: 'Yukon', 
    gst: 5, 
    pst: 0, 
    hst: 0,
    taxSystem: 'GST only',
    notes: 'No territorial sales tax'
  }
];

// Tax calculation helper
export const calculateTax = (amount, province, type = 'sales') => {
  const prov = PROVINCES.find(p => p.id === province);
  if (!prov) return { gst: 0, pst: 0, hst: 0, qst: 0, total: 0 };

  let gst = 0, pst = 0, hst = 0, qst = 0;

  switch (prov.taxSystem) {
    case 'GST only':
      gst = amount * (prov.gst / 100);
      break;
    case 'GST + PST':
      gst = amount * (prov.gst / 100);
      pst = amount * (prov.pst / 100);
      break;
    case 'GST + QST':
      gst = amount * (prov.gst / 100);
      qst = amount * (prov.qst / 100);
      break;
    case 'HST':
      hst = amount * (prov.hst / 100);
      break;
  }

  const totalTax = gst + pst + hst + qst;
  
  return {
    gst: parseFloat(gst.toFixed(2)),
    pst: parseFloat(pst.toFixed(2)),
    hst: parseFloat(hst.toFixed(2)),
    qst: parseFloat(qst.toFixed(2)),
    total: parseFloat(totalTax.toFixed(2)),
    grandTotal: parseFloat((amount + totalTax).toFixed(2)),
    province: prov.name,
    taxSystem: prov.taxSystem
  };
};

// Get tax rate display for a province
export const getTaxRateDisplay = (provinceId) => {
  const prov = PROVINCES.find(p => p.id === provinceId);
  if (!prov) return '';

  switch (prov.taxSystem) {
    case 'GST only':
      return `GST ${prov.gst}%`;
    case 'GST + PST':
      return `GST ${prov.gst}% + PST ${prov.pst}%`;
    case 'GST + QST':
      return `GST ${prov.gst}% + QST ${prov.qst}%`;
    case 'HST':
      return `HST ${prov.hst}%`;
    default:
      return '';
  }
};





