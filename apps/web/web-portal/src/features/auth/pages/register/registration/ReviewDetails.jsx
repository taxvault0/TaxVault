import React from 'react';

const ReviewRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3">
    <dt className="min-w-[180px] text-sm font-medium text-slate-500">{label}</dt>
    <dd className="text-right text-sm font-semibold text-slate-900">
      {value || '-'}
    </dd>
  </div>
);

const ReviewSection = ({ title, children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <h3 className="mb-3 text-base font-semibold text-slate-900">{title}</h3>
    <dl>{children}</dl>
  </section>
);

const CheckboxRow = ({ checked, onChange, label, error }) => (
  <div>
    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </label>
    {error && <p className="mt-2 text-xs font-medium text-red-500">{error}</p>}
  </div>
);

const ReviewDetails = ({ formData, errors, setFormData }) => {
  const toggle = (key) => {
    setFormData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const familyStatus = formData.familyStatus || formData.maritalStatus || '';
  const showSpouse =
    familyStatus === 'Married' || familyStatus === 'Common-Law';

  const selectedAdditionalIncome = (formData.additionalIncomeSources || []).join(', ');
  const selectedSpouseAdditionalIncome = (
    formData.spouseAdditionalIncomeSources || []
  ).join(', ');
  const selectedGigPlatforms = (formData.gigPlatforms || []).join(', ');
  const selectedSpouseGigPlatforms = (formData.spouseGigPlatforms || []).join(', ');

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 md:p-7">
        <div className="mb-5 border-b border-slate-200 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">Review & Confirm</h2>
          <p className="mt-1 text-sm text-slate-500">
            Review your information before submitting.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ReviewSection title="Account">
            <ReviewRow label="First Name" value={formData.firstName} />
            <ReviewRow label="Last Name" value={formData.lastName} />
            <ReviewRow label="Email" value={formData.email} />
            <ReviewRow label="Phone" value={formData.phone} />
          </ReviewSection>

          <ReviewSection title="Personal Information">
            <ReviewRow label="Date of Birth" value={formData.dateOfBirth} />
            <ReviewRow label="SIN Number" value={formData.sinNumber} />
            <ReviewRow label="Family Status" value={familyStatus} />
            <ReviewRow
              label="Number of Dependents"
              value={formData.numberOfDependents}
            />
            <ReviewRow label="Address" value={formData.address} />
            <ReviewRow label="Postal Code" value={formData.postalCode} />
            <ReviewRow label="Country" value={formData.country || 'Canada'} />
            <ReviewRow label="Province" value={formData.province} />
            <ReviewRow label="City" value={formData.city} />
          </ReviewSection>

          <ReviewSection title="Primary Income">
            <ReviewRow label="Employer Name" value={formData.employerName} />
            <ReviewRow label="T4 Income" value={formData.t4Income} />
            <ReviewRow label="Gig Platforms" value={selectedGigPlatforms} />
            <ReviewRow label="Other Gig Platform" value={formData.gigPlatformOther} />
            <ReviewRow label="Gig Income" value={formData.gigIncome} />
            <ReviewRow label="Self-Employment Income" value={formData.selfEmploymentIncome} />
            <ReviewRow label="Business Income" value={formData.businessIncome} />
            <ReviewRow
              label="Additional Income Sources"
              value={selectedAdditionalIncome}
            />
          </ReviewSection>

          {showSpouse && (
            <ReviewSection title="Spouse Information">
              <ReviewRow label="Spouse Name" value={formData.spouseName} />
              <ReviewRow label="Spouse DOB" value={formData.spouseDob} />
              <ReviewRow label="Spouse SIN" value={formData.spouseSin} />
              <ReviewRow label="Spouse Phone" value={formData.spousePhone} />
              <ReviewRow
                label="Spouse Gig Platforms"
                value={selectedSpouseGigPlatforms}
              />
              <ReviewRow
                label="Spouse Other Gig Platform"
                value={formData.spouseGigPlatformOther}
              />
              <ReviewRow
                label="Spouse Additional Income Sources"
                value={selectedSpouseAdditionalIncome}
              />
            </ReviewSection>
          )}

          <ReviewSection title="Deductions">
            <ReviewRow
              label="Vehicle Purchased for Work"
              value={formData.vehiclePurchasedForWork ? 'Yes' : 'No'}
            />
            <ReviewRow
              label="Vehicles Added"
              value={formData.vehicles?.length ? String(formData.vehicles.length) : '0'}
            />
          </ReviewSection>
        </div>
      </div>

      <div className="space-y-3">
        <CheckboxRow
          checked={!!formData.agreeToTerms}
          onChange={() => toggle('agreeToTerms')}
          label="I agree to the Terms and Conditions"
          error={errors.agreeToTerms}
        />

        <CheckboxRow
          checked={!!formData.agreeToPrivacy}
          onChange={() => toggle('agreeToPrivacy')}
          label="I agree to the Privacy Policy"
          error={errors.agreeToPrivacy}
        />

        <CheckboxRow
          checked={!!formData.confirmAccuracy}
          onChange={() => toggle('confirmAccuracy')}
          label="I confirm the information provided is accurate"
          error={errors.confirmAccuracy}
        />
      </div>
    </div>
  );
};

export default ReviewDetails;