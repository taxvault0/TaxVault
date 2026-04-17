import React from 'react';

const TAX_SPECIALTIES = [
  'Personal Income Tax',
  'Corporate Tax Planning',
  'GST/HST Returns',
  'PST Returns',
  'QST Returns',
  'Payroll Remittances',
  'T2 Corporation Returns',
  'T1 Personal Returns',
  'T3 Trust Returns',
  'T4/T4A Preparation',
  'T5013 Partnership Returns',
  'Scientific Research & Experimental Development (SR&ED)',
  'Capital Gains Planning',
  'Estate Planning',
  'Tax Litigation',
  'Voluntary Disclosures',
  'Tax Audits',
  'CRA Representation',
];

const PROVINCIAL_SPECIALTIES = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Nova Scotia',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan',
  'Northwest Territories',
  'Nunavut',
  'Yukon',
  'Multiple Provinces',
  'All Provinces',
];

const INTERNATIONAL_SPECIALTIES = [
  'International Tax',
  'US Tax',
  'Cross-Border',
  'Estate Planning',
  'Corporate Restructuring',
  'Mergers & Acquisitions',
];

const ACCOUNTING_SOFTWARE = [
  'QuickBooks Online',
  'QuickBooks Desktop',
  'Xero',
  'Sage 50',
  'Sage Intacct',
  'FreshBooks',
  'Wave',
  'Oracle NetSuite',
  'Microsoft Dynamics',
  'SAP',
  'Other',
];

const TAX_SOFTWARE = [
  'Profile',
  'TaxPrep',
  'DT Max',
  'CanTax',
  'QuickTax',
  'TurboTax',
  'UFile',
  'TaxCycle',
  'CCH iFirm',
  'Other',
];

const SpecialtiesDetails = ({
  formData = {},
  errors = {},
  handleChange,
  updateField,
}) => {
  const setFieldValue = (field, value) => {
    if (typeof updateField === 'function') {
      updateField(field, value);
      return;
    }

    if (typeof handleChange === 'function') {
      handleChange({
        target: {
          name: field,
          value,
          type: typeof value === 'boolean' ? 'checkbox' : 'text',
          checked: typeof value === 'boolean' ? value : undefined,
        },
      });
    }
  };

  const toggleMultiValue = (field, option) => {
    const currentValues = Array.isArray(formData[field]) ? formData[field] : [];
    const updatedValues = currentValues.includes(option)
      ? currentValues.filter((item) => item !== option)
      : [...currentValues, option];

    setFieldValue(field, updatedValues);
  };

  const renderError = (field) =>
    errors[field] ? (
      <p className="text-sm text-red-600 mt-1">{errors[field]}</p>
    ) : null;

  const renderMultiChoice = (label, field, options) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected =
            Array.isArray(formData[field]) && formData[field].includes(option);

          return (
            <button
              type="button"
              key={option}
              onClick={() => toggleMultiValue(field, option)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                selected
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500 hover:text-primary-600'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {renderError(field)}
    </div>
  );

  const renderInput = (label, field, placeholder) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        name={field}
        value={formData[field] ?? ''}
        onChange={(e) => setFieldValue(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
          errors[field]
            ? 'border-red-500 focus:ring-red-200 bg-red-50'
            : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
        }`}
      />
      {renderError(field)}
    </div>
  );

  const renderSwitchRow = (label, field) => (
    <label
      key={field}
      className="flex items-center justify-between border border-gray-200 rounded-lg p-4 cursor-pointer"
    >
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        type="checkbox"
        name={field}
        checked={!!formData[field]}
        onChange={(e) => setFieldValue(field, e.target.checked)}
        className="h-4 w-4"
      />
    </label>
  );

  const accountingSoftware = Array.isArray(formData.accountingSoftware)
    ? formData.accountingSoftware
    : [];
  const taxSoftware = Array.isArray(formData.taxSoftware)
    ? formData.taxSoftware
    : [];

  const showOtherAccountingSoftware = accountingSoftware.includes('Other');
  const showOtherTaxSoftware = taxSoftware.includes('Other');

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Specialties &amp; Technology
      </h3>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm font-medium text-blue-800">
          Expertise &amp; Tools
        </p>
        <p className="text-xs text-blue-700 mt-1">
          Show your areas of expertise, software knowledge, and client security practices.
        </p>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-6">
        {renderMultiChoice('Tax Specialties', 'taxSpecialties', TAX_SPECIALTIES)}

        {renderMultiChoice(
          'Provincial Specialties',
          'provincialSpecialties',
          PROVINCIAL_SPECIALTIES
        )}

        {renderMultiChoice(
          'International & Advanced Specialties',
          'internationalSpecialties',
          INTERNATIONAL_SPECIALTIES
        )}
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-6">
        <h4 className="font-medium text-gray-800">Software Expertise</h4>

        {renderMultiChoice(
          'Accounting Software',
          'accountingSoftware',
          ACCOUNTING_SOFTWARE
        )}

        {showOtherAccountingSoftware &&
          renderInput(
            'Other Accounting Software',
            'otherAccountingSoftware',
            'Enter other accounting software'
          )}

        {renderMultiChoice('Tax Software', 'taxSoftware', TAX_SOFTWARE)}

        {showOtherTaxSoftware &&
          renderInput(
            'Other Tax Software',
            'otherTaxSoftware',
            'Enter other tax software'
          )}

        {renderInput(
          'Practice Management Software',
          'practiceManagementSoftware',
          'e.g. Karbon, Jetpack Workflow, Canopy'
        )}
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-800">
          Client Experience &amp; Security
        </h4>

        <div className="space-y-3">
          {renderSwitchRow('Offers client portal access', 'offersPortalAccess')}
          {renderSwitchRow(
            'Accepts digital documents / e-signatures',
            'acceptsDigitalDocuments'
          )}
          {renderSwitchRow('Uses end-to-end encryption', 'usesEncryption')}
          {renderSwitchRow('Uses two-factor authentication', 'twoFactorAuth')}
        </div>
      </div>
    </div>
  );
};

export default SpecialtiesDetails;