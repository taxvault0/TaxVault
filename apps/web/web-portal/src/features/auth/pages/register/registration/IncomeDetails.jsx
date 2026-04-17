import React, { useState } from 'react';
import FormField from './FormField';

const HelpTooltip = ({ text }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-semibold text-slate-500 transition hover:border-slate-400 hover:text-slate-700"
        aria-label="Show help"
      >
        ?
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-20 w-72 rounded-xl border border-slate-200 bg-white p-3 text-left text-sm text-slate-600 shadow-lg">
          {text}
        </div>
      )}
    </div>
  );
};

const SectionShell = ({ title, description, children }) => (
  <section className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 md:p-7">
    <div className="mb-5 border-b border-slate-200 pb-4">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
    <div className="space-y-5">{children}</div>
  </section>
);

const IncomeCard = ({ title, description, helpText, children }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {helpText && <HelpTooltip text={helpText} />}
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
  </div>
);

const SelectionStatusCard = ({ subtitle }) => (
  <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-5">
    <span className="inline-flex rounded-full bg-slate-900 px-2.5 py-1 text-xs font-medium text-white">
      Selected
    </span>
    <p className="mt-4 text-lg font-semibold text-slate-900 md:text-xl">
      {subtitle}
    </p>
  </div>
);

const EmptyStateCard = ({ text }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
    {text}
  </div>
);

const canadianGigPlatforms = [
  'Uber',
  'Uber Eats',
  'DoorDash',
  'Instacart',
  'SkipTheDishes',
  'Lyft',
  'Amazon Flex',
  'TaskRabbit',
  'Etsy',
  'Airbnb',
];

const hasSelected = (group, key) => !!group?.[key];

const IncomeDetails = ({ formData, errors, handleChange }) => {
  const taxpayer = formData.taxProfile || {};
  const spouse = formData.spouseTaxProfile || {};
  const familyStatus = formData.familyStatus || formData.maritalStatus || '';
  const showSpouse =
    familyStatus === 'Married' || familyStatus === 'Common-Law';

  const primaryName = formData.firstName || 'Primary';
  const spouseName =
    formData.spouseFirstName ||
    formData.spouseName ||
    'Spouse';

  const primaryHasEmployment = hasSelected(taxpayer, 'employment');
  const primaryHasGigWork = hasSelected(taxpayer, 'gigWork');
  const primaryHasSelfEmployment = hasSelected(taxpayer, 'selfEmployed');
  const primaryHasBusiness = hasSelected(taxpayer, 'businessOwner');

  const spouseHasEmployment = hasSelected(spouse, 'employment');
  const spouseHasGigWork = hasSelected(spouse, 'gigWork');
  const spouseHasSelfEmployment = hasSelected(spouse, 'selfEmployed');
  const spouseHasBusiness = hasSelected(spouse, 'businessOwner');

  const hasPrimaryIncomeType =
    primaryHasEmployment ||
    primaryHasGigWork ||
    primaryHasSelfEmployment ||
    primaryHasBusiness ||
    (formData.additionalIncomeSources || []).length > 0;

  const hasSpouseIncomeType =
    spouseHasEmployment ||
    spouseHasGigWork ||
    spouseHasSelfEmployment ||
    spouseHasBusiness ||
    (formData.spouseAdditionalIncomeSources || []).length > 0;

  return (
    <div className="space-y-8">
      <SectionShell
        title={`${primaryName} Income`}
        description={`Choose the income sources that apply to ${primaryName}.`}
      >
        {primaryHasEmployment && (
          <IncomeCard
            title="Employment"
            description="Selected income type"
            helpText="Choose this if this person had employment income. T4 will be uploaded later."
          >
            <SelectionStatusCard subtitle="T4 slip required later" />
          </IncomeCard>
        )}

        {primaryHasGigWork && (
          <IncomeCard
            title="Gig Work"
            description="Select the platforms used"
            helpText="Select the platforms used for gig work. Documents will be requested later based on these selections."
          >
            <div className="md:col-span-2">
              <FormField
                label="Gig Platforms"
                name="gigPlatforms"
                value={formData.gigPlatforms || []}
                onChange={handleChange}
                error={errors.gigPlatforms}
                isMultiPills
                options={canadianGigPlatforms}
              />
            </div>

            <FormField
              label="Other Platform"
              name="gigPlatformOther"
              value={formData.gigPlatformOther}
              onChange={handleChange}
              error={errors.gigPlatformOther}
              placeholder="Add any other app or platform"
            />
          </IncomeCard>
        )}

        {primaryHasSelfEmployment && (
          <IncomeCard
            title="Self-Employment"
            description="Selected income type"
            helpText="Choose this if this person earned freelance or contract income. Supporting documents will be requested later."
          >
            <div className="md:col-span-2">
              <FormField
                label="Business / Trade Name"
                name="selfEmploymentBusinessName"
                value={formData.selfEmploymentBusinessName}
                onChange={handleChange}
                error={errors.selfEmploymentBusinessName}
              />
            </div>
          </IncomeCard>
        )}

        {primaryHasBusiness && (
          <IncomeCard
            title="Business Owner"
            description="Selected income type"
            helpText="Choose this if this person owns a business. Supporting documents will be requested later."
          >
            <FormField
              label="Business Name"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              error={errors.businessName}
            />
            <FormField
              label="Business Number"
              name="businessNumber"
              value={formData.businessNumber}
              onChange={handleChange}
              error={errors.businessNumber}
            />
          </IncomeCard>
        )}

        <IncomeCard
          title="Additional Income"
          description="Select any other income types that apply"
          helpText="Select any additional income sources so the correct documents can be requested later."
        >
          <div className="md:col-span-2">
            <FormField
              label="Additional Income Sources"
              name="additionalIncomeSources"
              value={formData.additionalIncomeSources || []}
              onChange={handleChange}
              error={errors.additionalIncomeSources}
              isMultiPills
              options={['Investments', 'Rental Income', 'Foreign Income', 'Crypto']}
            />
          </div>
        </IncomeCard>

        {!hasPrimaryIncomeType && (
          <EmptyStateCard
            text={`No income type has been selected for ${primaryName} yet. Go back to the Tax step and choose at least one profile.`}
          />
        )}
      </SectionShell>

      {showSpouse && (
        <SectionShell
          title={`${spouseName} Income`}
          description={`Choose the income sources that apply to ${spouseName}.`}
        >
          {spouseHasEmployment && (
            <IncomeCard
              title="Employment"
              description="Selected income type"
              helpText="Choose this if this person had employment income. T4 will be uploaded later."
            >
              <SelectionStatusCard subtitle="T4 slip required later" />
            </IncomeCard>
          )}

          {spouseHasGigWork && (
            <IncomeCard
              title="Gig Work"
              description="Select the platforms used"
              helpText="Select the platforms used for gig work. Documents will be requested later based on these selections."
            >
              <div className="md:col-span-2">
                <FormField
                  label="Gig Platforms"
                  name="spouseGigPlatforms"
                  value={formData.spouseGigPlatforms || []}
                  onChange={handleChange}
                  error={errors.spouseGigPlatforms}
                  isMultiPills
                  options={canadianGigPlatforms}
                />
              </div>

              <FormField
                label="Other Platform"
                name="spouseGigPlatformOther"
                value={formData.spouseGigPlatformOther}
                onChange={handleChange}
                error={errors.spouseGigPlatformOther}
                placeholder="Add any other app or platform"
              />
            </IncomeCard>
          )}

          {spouseHasSelfEmployment && (
            <IncomeCard
              title="Self-Employment"
              description="Selected income type"
              helpText="Choose this if this person earned freelance or contract income. Supporting documents will be requested later."
            >
              <div className="md:col-span-2">
                <FormField
                  label="Business / Trade Name"
                  name="spouseSelfEmploymentBusinessName"
                  value={formData.spouseSelfEmploymentBusinessName}
                  onChange={handleChange}
                  error={errors.spouseSelfEmploymentBusinessName}
                />
              </div>
            </IncomeCard>
          )}

          {spouseHasBusiness && (
            <IncomeCard
              title="Business Owner"
              description="Selected income type"
              helpText="Choose this if this person owns a business. Supporting documents will be requested later."
            >
              <FormField
                label="Business Name"
                name="spouseBusinessName"
                value={formData.spouseBusinessName}
                onChange={handleChange}
                error={errors.spouseBusinessName}
              />
              <FormField
                label="Business Number"
                name="spouseBusinessNumber"
                value={formData.spouseBusinessNumber}
                onChange={handleChange}
                error={errors.spouseBusinessNumber}
              />
            </IncomeCard>
          )}

          <IncomeCard
            title="Additional Income"
            description="Select any other income types that apply"
            helpText="Select any additional income sources so the correct documents can be requested later."
          >
            <div className="md:col-span-2">
              <FormField
                label="Additional Income Sources"
                name="spouseAdditionalIncomeSources"
                value={formData.spouseAdditionalIncomeSources || []}
                onChange={handleChange}
                error={errors.spouseAdditionalIncomeSources}
                isMultiPills
                options={['Investments', 'Rental Income', 'Foreign Income', 'Crypto']}
              />
            </div>
          </IncomeCard>

          {!hasSpouseIncomeType && (
            <EmptyStateCard
              text={`No income type has been selected for ${spouseName} yet. Go back to the Tax step and choose at least one profile if needed.`}
            />
          )}
        </SectionShell>
      )}
    </div>
  );
};

export default IncomeDetails;