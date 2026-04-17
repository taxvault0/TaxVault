import React from 'react';

const PRACTICE_TYPES = [
  'Solo Practice',
  'Partnership',
  'Corporation',
  'Remote Practice',
  'Hybrid Practice',
];

const PRIMARY_CLIENT_TYPES = [
  'Individuals',
  'Families',
  'Self-Employed',
  'Small Businesses',
  'Corporations',
  'Non-Residents',
  'Students',
  'Seniors',
  'New Immigrants',
  'Investors',
];

const SERVICE_OFFERINGS = [
  'Personal Tax Filing',
  'Corporate Tax Filing',
  'Bookkeeping',
  'Payroll Services',
  'GST/HST Filing',
  'Tax Planning',
  'Financial Statements',
  'Audit Support',
  'CRA Representation',
  'Business Advisory',
];

const PracticeDetails = ({
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

  const handleNumberChange = (field) => (e) => {
    const rawValue = e.target.value;

    if (rawValue === '') {
      setFieldValue(field, '');
      return;
    }

    const cleanedValue = rawValue.replace(/[^\d]/g, '');
    setFieldValue(field, cleanedValue);
  };

  const renderError = (field) =>
    errors[field] ? (
      <p className="text-sm text-red-600 mt-1">{errors[field]}</p>
    ) : null;

  const renderInput = (label, field, placeholder, options = {}) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={options.type || 'text'}
        name={field}
        value={formData[field] ?? ''}
        onChange={
          options.type === 'number'
            ? handleNumberChange(field)
            : (e) => setFieldValue(field, e.target.value)
        }
        min={options.min}
        inputMode={options.inputMode}
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

  const renderSingleChoice = (label, field, options) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = formData[field] === option;

          return (
            <button
              type="button"
              key={option}
              onClick={() => setFieldValue(field, option)}
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

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Practice Information
      </h3>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm font-medium text-blue-800">
          Practice Profile
        </p>
        <p className="text-xs text-blue-700 mt-1">
          Tell clients about your services, coverage area, and availability.
        </p>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-4">
        {renderSingleChoice('Practice Type *', 'practiceType', PRACTICE_TYPES)}

        {renderMultiChoice(
          'Services Offered *',
          'servicesOffered',
          SERVICE_OFFERINGS
        )}

        {renderMultiChoice(
          'Primary Client Types *',
          'clientTypes',
          PRIMARY_CLIENT_TYPES
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput('Average Clients Per Year', 'averageClientsPerYear', '150', {
            type: 'number',
            inputMode: 'numeric',
            min: 0,
          })}

          {renderInput('Service Radius (km)', 'serviceRadius', '50', {
            type: 'number',
            inputMode: 'numeric',
            min: 0,
          })}

          {renderInput('Minimum Fee', 'minimumFee', '150', {
            type: 'number',
            inputMode: 'numeric',
            min: 0,
          })}

          {renderInput('Maximum Fee', 'maximumFee', '1500', {
            type: 'number',
            inputMode: 'numeric',
            min: 0,
          })}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-800">Availability</h4>

        <div className="space-y-3">
          {renderSwitchRow('Accepting New Clients', 'acceptingNewClients')}
          {renderSwitchRow('Offers Virtual Services', 'offersVirtualServices')}
          {renderSwitchRow('Offers In-Person Services', 'offersInPersonServices')}
        </div>
      </div>
    </div>
  );
};

export default PracticeDetails;