import React from 'react';
import {
  PROFILE_OPTIONS,
  EMPLOYMENT_STATUSES,
  SPOUSE_EMPLOYMENT_STATUSES,
} from '../modules';

const CardCheckbox = ({ checked, onChange, title, description }) => (
  <label className="cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="peer hidden"
    />
    <div
      className={`rounded-2xl border p-4 shadow-sm transition-colors duration-150 ${
        checked
          ? 'border-blue-600 bg-blue-50'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      {description && (
        <div className="mt-1 text-xs text-slate-500">{description}</div>
      )}
    </div>
  </label>
);

const RegisterStepTax = ({
  formData,
  errors,
  handleChange,
  handleProfileToggle,
}) => {
  const showSpouse =
    formData.maritalStatus === 'Married' ||
    formData.maritalStatus === 'Common-Law';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Employment Status
          </label>
          <select
            name="employmentStatus"
            value={formData.employmentStatus}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">Select</option>
            {EMPLOYMENT_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.employmentStatus && (
            <p className="text-xs text-red-500">{errors.employmentStatus}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium text-slate-700">
          Primary Taxpayer Profile
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {PROFILE_OPTIONS.map((item) => (
            <CardCheckbox
              key={item.key}
              checked={!!formData.taxProfile[item.key]}
              onChange={() => handleProfileToggle('taxProfile', item.key)}
              title={item.label}
              description={item.description}
            />
          ))}
        </div>

        {errors.taxProfile && (
          <p className="mt-2 text-xs text-red-500">{errors.taxProfile}</p>
        )}
      </div>

      {showSpouse && (
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-base font-semibold text-slate-900">
            Spouse Tax Details
          </h3>

          <div className="flex flex-col gap-1.5 md:max-w-md">
            <label className="text-sm font-medium text-slate-700">
              Spouse Employment Status
            </label>
            <select
              name="spouseEmploymentStatus"
              value={formData.spouseEmploymentStatus}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Select</option>
              {SPOUSE_EMPLOYMENT_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.spouseEmploymentStatus && (
              <p className="text-xs text-red-500">
                {errors.spouseEmploymentStatus}
              </p>
            )}
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-slate-700">
              Spouse Tax Profile
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {PROFILE_OPTIONS.map((item) => (
                <CardCheckbox
                  key={item.key}
                  checked={!!formData.spouseTaxProfile[item.key]}
                  onChange={() =>
                    handleProfileToggle('spouseTaxProfile', item.key)
                  }
                  title={item.label}
                  description={item.description}
                />
              ))}
            </div>

            {errors.spouseTaxProfile && (
              <p className="mt-2 text-xs text-red-500">
                {errors.spouseTaxProfile}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


export default RegisterStepTax;
