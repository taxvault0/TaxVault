import React from 'react';
import FormField from './FormField';
import SpouseFields from './SpouseFields';
import { PROVINCES, getCitiesByProvince } from '../modules';

const familyStatusOptions = [
  'Single',
  'Married',
  'Common-Law',
  'Separated',
  'Divorced',
  'Widowed',
];

const PersonalDetails = ({ formData, errors, handleChange, setFormData }) => {
  const familyStatus = formData.familyStatus || formData.maritalStatus || '';
  const showSpouse =
    familyStatus === 'Married' || familyStatus === 'Common-Law';

  const cityOptions = getCitiesByProvince(formData.province);

  const handleProvinceChange = (e) => {
    const province = e.target.value;

    setFormData((prev) => ({
      ...prev,
      province,
      city: '',
    }));
  };

  const handleFamilyStatusChange = (e) => {
    const nextValue = e.target.value;

    setFormData((prev) => ({
      ...prev,
      familyStatus: nextValue,
      maritalStatus: nextValue,
    }));
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 md:p-7">
        <div className="mb-5 border-b border-slate-200 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Personal Information
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Add account details, family status and address information.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            error={errors.dateOfBirth}
            placeholder="MM/DD/YYYY"
            maxDate={new Date()}
          />

          <FormField
            label="SIN Number (Optional)"
            name="sinNumber"
            value={formData.sinNumber}
            onChange={handleChange}
            error={errors.sinNumber}
          />

          <FormField
            label="Number of Dependents"
            name="numberOfDependents"
            type="number"
            value={formData.numberOfDependents}
            onChange={handleChange}
            error={errors.numberOfDependents}
            placeholder="0"
          />

          <FormField
            label="Family Status"
            name="familyStatus"
            value={familyStatus}
            onChange={handleFamilyStatusChange}
            error={errors.familyStatus || errors.maritalStatus}
            isPills
            options={familyStatusOptions}
          />

          <div className="md:col-span-2">
            <FormField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
            />
          </div>

          <FormField
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            error={errors.postalCode}
          />

          <FormField
            label="Country"
            name="country"
            value={formData.country || 'Canada'}
            onChange={handleChange}
            error={errors.country}
            disabled
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Province</label>
            <select
              name="province"
              value={formData.province}
              onChange={handleProvinceChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Select</option>
              {PROVINCES.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
            {errors.province && (
              <p className="text-xs font-medium text-red-500">{errors.province}</p>
            )}
          </div>

          <FormField
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            error={errors.city}
            isSelect
            options={cityOptions}
            disabled={!formData.province}
          />
        </div>
      </div>

      {showSpouse && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="mb-4 text-base font-semibold text-slate-900">
            Spouse Information
          </h3>

          <SpouseFields
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />
        </div>
      )}
    </div>
  );
};

export default PersonalDetails;