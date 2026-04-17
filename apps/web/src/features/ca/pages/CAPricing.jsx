import React, { useMemo, useState } from 'react';
import {
  BadgeDollarSign,
  Briefcase,
  Building2,
  Calculator,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileSpreadsheet,
  Home,
  Info,
  ReceiptText,
  Sparkles,
  Users,
  Video,
  WalletCards,
} from 'lucide-react';

const PRICE_OPTIONS = [
  0, 25, 30, 40, 50, 60, 75, 90, 100, 110, 125, 150, 175, 200, 225, 250, 275, 300, 350, 400, 500, 600, 750, 1000,
];

const TIME_OPTIONS = [
  { value: '15', label: '15 Minutes' },
  { value: '30', label: '30 Minutes' },
  { value: '45', label: '45 Minutes' },
  { value: '60', label: '60 Minutes' },
];

const formatCAD = (value) => `CAD $${Number(value || 0).toLocaleString('en-CA')}`;

const SelectField = ({ label, value, onChange, options, helper }) => {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-700">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          {options.map((option) => {
            const optionValue = typeof option === 'object' ? option.value : String(option);
            const optionLabel =
              typeof option === 'object'
                ? option.label
                : `CAD $${Number(option).toLocaleString('en-CA')}`;

            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>

        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
      {helper ? <p className="mt-1.5 text-[11px] leading-4 text-slate-500">{helper}</p> : null}
    </div>
  );
};

const ToggleCard = ({
  icon: Icon,
  title,
  subtitle,
  enabled,
  onToggle,
  children,
  accent = 'blue',
}) => {
  const accentStyles = {
    blue: 'from-blue-50 to-indigo-50 border-blue-100',
    emerald: 'from-emerald-50 to-teal-50 border-emerald-100',
    amber: 'from-amber-50 to-orange-50 border-amber-100',
    violet: 'from-violet-50 to-fuchsia-50 border-violet-100',
    rose: 'from-rose-50 to-pink-50 border-rose-100',
    slate: 'from-slate-50 to-slate-100 border-slate-200',
  };

  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${accentStyles[accent]} p-4 shadow-sm`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 shadow-sm">
            <Icon size={18} className="text-slate-700" />
          </div>
          <div>
            <h3 className="text-base font-bold leading-5 text-slate-900">{title}</h3>
            <p className="mt-1 text-xs leading-5 text-slate-600">{subtitle}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className={`relative h-6 w-12 rounded-full transition ${
            enabled ? 'bg-slate-900' : 'bg-slate-300'
          }`}
        >
          <span
            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
              enabled ? 'left-7' : 'left-1'
            }`}
          />
        </button>
      </div>

      {enabled ? children : (
        <p className="text-xs font-medium text-slate-500">Currently hidden from clients.</p>
      )}
    </div>
  );
};

const CAPricing = () => {
  const [consultationEnabled, setConsultationEnabled] = useState(true);
  const [consultation15, setConsultation15] = useState('30');
  const [consultation30, setConsultation30] = useState('50');
  const [consultation60, setConsultation60] = useState('90');

  const [specialMeetingEnabled, setSpecialMeetingEnabled] = useState(true);
  const [specialMeetingMode, setSpecialMeetingMode] = useState('time-based');
  const [specialMeetingTime, setSpecialMeetingTime] = useState('45');
  const [specialMeetingPrice, setSpecialMeetingPrice] = useState('75');

  const [singleBasicEnabled, setSingleBasicEnabled] = useState(true);
  const [singleBasicPrice, setSingleBasicPrice] = useState('60');

  const [singleMultiT4Enabled, setSingleMultiT4Enabled] = useState(true);
  const [singleMultiT4Price, setSingleMultiT4Price] = useState('90');

  const [householdBasicEnabled, setHouseholdBasicEnabled] = useState(true);
  const [householdBasicPrice, setHouseholdBasicPrice] = useState('120');

  const [householdMixedEnabled, setHouseholdMixedEnabled] = useState(true);
  const [householdMixedPrice, setHouseholdMixedPrice] = useState('175');

  const [mixedIncomeEnabled, setMixedIncomeEnabled] = useState(true);
  const [mixedIncomePrice, setMixedIncomePrice] = useState('150');

  const [selfEmployedEnabled, setSelfEmployedEnabled] = useState(true);
  const [selfEmployedPrice, setSelfEmployedPrice] = useState('200');

  const [businessBasicEnabled, setBusinessBasicEnabled] = useState(true);
  const [businessBasicPrice, setBusinessBasicPrice] = useState('250');

  const [businessAdvancedEnabled, setBusinessAdvancedEnabled] = useState(true);
  const [businessAdvancedPrice, setBusinessAdvancedPrice] = useState('400');

  const allActiveStates = [
    consultationEnabled,
    specialMeetingEnabled,
    singleBasicEnabled,
    singleMultiT4Enabled,
    householdBasicEnabled,
    householdMixedEnabled,
    mixedIncomeEnabled,
    selfEmployedEnabled,
    businessBasicEnabled,
    businessAdvancedEnabled,
  ];

  const activeServices = useMemo(
    () => allActiveStates.filter(Boolean).length,
    [allActiveStates]
  );

  const startingPrice = useMemo(() => {
    const values = [
      consultationEnabled ? Number(consultation15) : null,
      consultationEnabled ? Number(consultation30) : null,
      consultationEnabled ? Number(consultation60) : null,
      specialMeetingEnabled ? Number(specialMeetingPrice) : null,
      singleBasicEnabled ? Number(singleBasicPrice) : null,
      singleMultiT4Enabled ? Number(singleMultiT4Price) : null,
      householdBasicEnabled ? Number(householdBasicPrice) : null,
      householdMixedEnabled ? Number(householdMixedPrice) : null,
      mixedIncomeEnabled ? Number(mixedIncomePrice) : null,
      selfEmployedEnabled ? Number(selfEmployedPrice) : null,
      businessBasicEnabled ? Number(businessBasicPrice) : null,
      businessAdvancedEnabled ? Number(businessAdvancedPrice) : null,
    ].filter((v) => v !== null);

    return values.length ? Math.min(...values) : 0;
  }, [
    consultationEnabled,
    consultation15,
    consultation30,
    consultation60,
    specialMeetingEnabled,
    specialMeetingPrice,
    singleBasicEnabled,
    singleBasicPrice,
    singleMultiT4Enabled,
    singleMultiT4Price,
    householdBasicEnabled,
    householdBasicPrice,
    householdMixedEnabled,
    householdMixedPrice,
    mixedIncomeEnabled,
    mixedIncomePrice,
    selfEmployedEnabled,
    selfEmployedPrice,
    businessBasicEnabled,
    businessBasicPrice,
    businessAdvancedEnabled,
    businessAdvancedPrice,
  ]);

  const highestPrice = useMemo(() => {
    const values = [
      consultationEnabled ? Number(consultation15) : null,
      consultationEnabled ? Number(consultation30) : null,
      consultationEnabled ? Number(consultation60) : null,
      specialMeetingEnabled ? Number(specialMeetingPrice) : null,
      singleBasicEnabled ? Number(singleBasicPrice) : null,
      singleMultiT4Enabled ? Number(singleMultiT4Price) : null,
      householdBasicEnabled ? Number(householdBasicPrice) : null,
      householdMixedEnabled ? Number(householdMixedPrice) : null,
      mixedIncomeEnabled ? Number(mixedIncomePrice) : null,
      selfEmployedEnabled ? Number(selfEmployedPrice) : null,
      businessBasicEnabled ? Number(businessBasicPrice) : null,
      businessAdvancedEnabled ? Number(businessAdvancedPrice) : null,
    ].filter((v) => v !== null);

    return values.length ? Math.max(...values) : 0;
  }, [
    consultationEnabled,
    consultation15,
    consultation30,
    consultation60,
    specialMeetingEnabled,
    specialMeetingPrice,
    singleBasicEnabled,
    singleBasicPrice,
    singleMultiT4Enabled,
    singleMultiT4Price,
    householdBasicEnabled,
    householdBasicPrice,
    householdMixedEnabled,
    householdMixedPrice,
    mixedIncomeEnabled,
    mixedIncomePrice,
    selfEmployedEnabled,
    selfEmployedPrice,
    businessBasicEnabled,
    businessBasicPrice,
    businessAdvancedEnabled,
    businessAdvancedPrice,
  ]);

  const handleSave = () => {
    alert('Pricing updated successfully. Later we can connect this page to backend saving.');
  };

  const visiblePreviewCount = allActiveStates.filter(Boolean).length;

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-7xl p-4">
        <div className="mb-4 grid gap-4 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-5 text-white shadow-sm">
            <div className="mb-4 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-100">
                <Sparkles size={13} />
                CA Pricing Rules
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                <CheckCircle2 size={13} />
                {activeServices} Active Rules
              </span>
            </div>

            <h1 className="max-w-3xl text-2xl font-bold leading-snug">
              Set charges by consultation, single returns, household accounts, mixed income, and business complexity.
            </h1>

            <p className="mt-2.5 max-w-3xl text-sm leading-6 text-slate-200">
              This page helps you price work the way it actually comes in. Instead of one flat tax filing fee,
              you can charge based on account type and return complexity so clients understand your CAD pricing before booking.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-wide text-slate-300">Starting Visible Price</p>
                <p className="mt-1.5 text-xl font-bold">{formatCAD(startingPrice)}</p>
              </div>

              <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-wide text-slate-300">Highest Visible Price</p>
                <p className="mt-1.5 text-xl font-bold">{formatCAD(highestPrice)}</p>
              </div>

              <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-wide text-slate-300">Currency</p>
                <p className="mt-1.5 text-xl font-bold">CAD</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Info size={18} className="text-blue-700" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">How to use this page</h2>
                <p className="text-xs text-slate-500">Set pricing by the kind of client you serve.</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-800">Single Account</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Use for one taxpayer with simple or multiple employment slips.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-800">Household Account</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Best when spouse returns or mixed household filing needs more work.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-800">Mixed / Business Work</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Charge more for self-employed, expenses, GST, payroll, and business support.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.3fr_0.8fr]">
          <div className="space-y-4">
            <ToggleCard
              icon={Video}
              title="Consultation Pricing"
              subtitle="Set meeting charges before the client starts filing work."
              enabled={consultationEnabled}
              onToggle={() => setConsultationEnabled((prev) => !prev)}
              accent="blue"
            >
              <div className="grid gap-3 md:grid-cols-3">
                <SelectField
                  label="15 Minute Consultation"
                  value={consultation15}
                  onChange={setConsultation15}
                  options={PRICE_OPTIONS}
                  helper="Quick question or first intro call"
                />
                <SelectField
                  label="30 Minute Consultation"
                  value={consultation30}
                  onChange={setConsultation30}
                  options={PRICE_OPTIONS}
                  helper="Most common paid consultation"
                />
                <SelectField
                  label="60 Minute Consultation"
                  value={consultation60}
                  onChange={setConsultation60}
                  options={PRICE_OPTIONS}
                  helper="Deep review or tax planning session"
                />
              </div>
            </ToggleCard>

            <ToggleCard
              icon={Clock3}
              title="Special Meeting Setup"
              subtitle="Add one extra meeting rule based on time or type of work."
              enabled={specialMeetingEnabled}
              onToggle={() => setSpecialMeetingEnabled((prev) => !prev)}
              accent="violet"
            >
              <div className="grid gap-3 md:grid-cols-3">
                <SelectField
                  label="Meeting Type"
                  value={specialMeetingMode}
                  onChange={setSpecialMeetingMode}
                  options={[
                    { value: 'time-based', label: 'Based on Time' },
                    { value: 'work-based', label: 'Based on Type of Work' },
                  ]}
                  helper="Choose how this extra meeting should be positioned"
                />
                <SelectField
                  label="Meeting Duration"
                  value={specialMeetingTime}
                  onChange={setSpecialMeetingTime}
                  options={TIME_OPTIONS}
                  helper="Visible to clients while booking"
                />
                <SelectField
                  label="Meeting Price"
                  value={specialMeetingPrice}
                  onChange={setSpecialMeetingPrice}
                  options={PRICE_OPTIONS}
                  helper="Shown to client in CAD"
                />
              </div>
            </ToggleCard>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <ReceiptText size={18} className="text-emerald-700" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Tax Filing Pricing by Account Type</h2>
                  <p className="text-xs text-slate-500">
                    Create pricing rules that match single, household, mixed, and business clients.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <ToggleCard
                  icon={WalletCards}
                  title="Single Account — 1–2 T4"
                  subtitle="Basic single-user return with straightforward employment slips."
                  enabled={singleBasicEnabled}
                  onToggle={() => setSingleBasicEnabled((prev) => !prev)}
                  accent="emerald"
                >
                  <div className="grid gap-3 md:grid-cols-2">
                    <SelectField
                      label="Price"
                      value={singleBasicPrice}
                      onChange={setSingleBasicPrice}
                      options={PRICE_OPTIONS}
                      helper="Best for simple single-account returns"
                    />
                    <div className="rounded-xl bg-white/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Use this for</p>
                      <p className="mt-1.5 text-xs leading-5 text-slate-700">
                        1 taxpayer, 1–2 T4 slips, limited deductions, no self-employment, no spouse complexity.
                      </p>
                    </div>
                  </div>
                </ToggleCard>

                <ToggleCard
                  icon={Users}
                  title="Single Account — 3+ T4"
                  subtitle="Single user with multiple employers or more review work."
                  enabled={singleMultiT4Enabled}
                  onToggle={() => setSingleMultiT4Enabled((prev) => !prev)}
                  accent="amber"
                >
                  <div className="grid gap-3 md:grid-cols-2">
                    <SelectField
                      label="Price"
                      value={singleMultiT4Price}
                      onChange={setSingleMultiT4Price}
                      options={PRICE_OPTIONS}
                      helper="For more employment slips and extra organizing work"
                    />
                    <div className="rounded-xl bg-white/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Use this for</p>
                      <p className="mt-1.5 text-xs leading-5 text-slate-700">
                        1 taxpayer with 3 or more T4 slips, extra validation, and a more complex employment history.
                      </p>
                    </div>
                  </div>
                </ToggleCard>

                <ToggleCard
                  icon={Home}
                  title="Household Account — T4 + Spouse"
                  subtitle="Simple household filing for couple accounts with straightforward employment."
                  enabled={householdBasicEnabled}
                  onToggle={() => setHouseholdBasicEnabled((prev) => !prev)}
                  accent="blue"
                >
                  <div className="grid gap-3 md:grid-cols-2">
                    <SelectField
                      label="Price"
                      value={householdBasicPrice}
                      onChange={setHouseholdBasicPrice}
                      options={PRICE_OPTIONS}
                      helper="Good base price for household accounts"
                    />
                    <div className="rounded-xl bg-white/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Use this for</p>
                      <p className="mt-1.5 text-xs leading-5 text-slate-700">
                        Primary plus spouse account, mostly T4 income, simple credits and shared household review.
                      </p>
                    </div>
                  </div>
                </ToggleCard>

                <ToggleCard
                  icon={Home}
                  title="Household Account — Mixed Complexity"
                  subtitle="Household account with spouse plus extra slips, investments, or added complexity."
                  enabled={householdMixedEnabled}
                  onToggle={() => setHouseholdMixedEnabled((prev) => !prev)}
                  accent="rose"
                >
                  <div className="grid gap-3 md:grid-cols-2">
                    <SelectField
                      label="Price"
                      value={householdMixedPrice}
                      onChange={setHouseholdMixedPrice}
                      options={PRICE_OPTIONS}
                      helper="For more review and coordination in household accounts"
                    />
                    <div className="rounded-xl bg-white/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Use this for</p>
                      <p className="mt-1.5 text-xs leading-5 text-slate-700">
                        T4 + spouse + additional slips, contributions, investment summaries, or more complex deductions.
                      </p>
                    </div>
                  </div>
                </ToggleCard>

                <ToggleCard
                  icon={Calculator}
                  title="Mixed Income Account"
                  subtitle="Employment plus other income sources for the same client."
                  enabled={mixedIncomeEnabled}
                  onToggle={() => setMixedIncomeEnabled((prev) => !prev)}
                  accent="slate"
                >
                  <div className="grid gap-3 md:grid-cols-2">
                    <SelectField
                      label="Price"
                      value={mixedIncomePrice}
                      onChange={setMixedIncomePrice}
                      options={PRICE_OPTIONS}
                      helper="Useful when T4 is combined with other filing work"
                    />
                    <div className="rounded-xl bg-white/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Use this for</p>
                      <p className="mt-1.5 text-xs leading-5 text-slate-700">
                        T4 plus investments, side income, rental-style records, or additional supporting tax documents.
                      </p>
                    </div>
                  </div>
                </ToggleCard>

                <ToggleCard
                  icon={FileSpreadsheet}
                  title="Self-Employed + Expenses"
                  subtitle="For contractor, gig, and self-employed clients with expense tracking."
                  enabled={selfEmployedEnabled}
                  onToggle={() => setSelfEmployedEnabled((prev) => !prev)}
                  accent="violet"
                >
                  <div className="grid gap-3 md:grid-cols-2">
                    <SelectField
                      label="Price"
                      value={selfEmployedPrice}
                      onChange={setSelfEmployedPrice}
                      options={PRICE_OPTIONS}
                      helper="For receipts, expenses, mileage, and T4A-style work"
                    />
                    <div className="rounded-xl bg-white/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Use this for</p>
                      <p className="mt-1.5 text-xs leading-5 text-slate-700">
                        Self-employed returns, T4A, gig work, business-use calculations, and expense review.
                      </p>
                    </div>
                  </div>
                </ToggleCard>

                <ToggleCard
                  icon={Building2}
                  title="Business Account"
                  subtitle="Business account with standard records and filing review."
                  enabled={businessBasicEnabled}
                  onToggle={() => setBusinessBasicEnabled((prev) => !prev)}
                  accent="emerald"
                >
                  <div className="grid gap-3 md:grid-cols-2">
                    <SelectField
                      label="Price"
                      value={businessBasicPrice}
                      onChange={setBusinessBasicPrice}
                      options={PRICE_OPTIONS}
                      helper="Base price for business-related filing work"
                    />
                    <div className="rounded-xl bg-white/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Use this for</p>
                      <p className="mt-1.5 text-xs leading-5 text-slate-700">
                        Business owners with income, expenses, records, and moderate business filing complexity.
                      </p>
                    </div>
                  </div>
                </ToggleCard>

                <ToggleCard
                  icon={Briefcase}
                  title="Business + GST / Payroll"
                  subtitle="Higher-complexity business work with more compliance and record review."
                  enabled={businessAdvancedEnabled}
                  onToggle={() => setBusinessAdvancedEnabled((prev) => !prev)}
                  accent="amber"
                >
                  <div className="grid gap-3 md:grid-cols-2">
                    <SelectField
                      label="Price"
                      value={businessAdvancedPrice}
                      onChange={setBusinessAdvancedPrice}
                      options={PRICE_OPTIONS}
                      helper="For advanced business work and extra administrative review"
                    />
                    <div className="rounded-xl bg-white/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Use this for</p>
                      <p className="mt-1.5 text-xs leading-5 text-slate-700">
                        Business with GST/HST, payroll, inventory, rent/utilities, or more complex bookkeeping support.
                      </p>
                    </div>
                  </div>
                </ToggleCard>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <BadgeDollarSign size={18} className="text-slate-800" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Live Client Preview</h3>
                  <p className="text-xs text-slate-500">What clients may see before booking</p>
                </div>
              </div>

              <div className="mb-3 rounded-xl bg-slate-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Visible Services</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{visiblePreviewCount}</p>
              </div>

              <div className="space-y-2.5">
                {consultationEnabled && (
                  <div className="rounded-xl border border-slate-200 p-3">
                    <p className="text-sm font-semibold text-slate-900">Consultation</p>
                    <div className="mt-2.5 space-y-1.5 text-sm text-slate-600">
                      <div className="flex items-center justify-between">
                        <span>15 Minutes</span>
                        <span className="font-semibold text-slate-900">{formatCAD(consultation15)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>30 Minutes</span>
                        <span className="font-semibold text-slate-900">{formatCAD(consultation30)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>60 Minutes</span>
                        <span className="font-semibold text-slate-900">{formatCAD(consultation60)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {specialMeetingEnabled && (
                  <div className="rounded-xl border border-slate-200 p-3">
                    <p className="text-sm font-semibold text-slate-900">
                      Special Meeting ({specialMeetingMode === 'time-based' ? 'Time-Based' : 'Work-Based'})
                    </p>
                    <div className="mt-2.5 flex items-center justify-between text-sm text-slate-600">
                      <span>{TIME_OPTIONS.find((t) => t.value === specialMeetingTime)?.label}</span>
                      <span className="font-semibold text-slate-900">{formatCAD(specialMeetingPrice)}</span>
                    </div>
                  </div>
                )}

                {singleBasicEnabled && (
                  <div className="rounded-xl border border-slate-200 p-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Single Account — 1–2 T4</span>
                    <span className="text-sm font-bold text-slate-900">{formatCAD(singleBasicPrice)}</span>
                  </div>
                )}

                {singleMultiT4Enabled && (
                  <div className="rounded-xl border border-slate-200 p-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Single Account — 3+ T4</span>
                    <span className="text-sm font-bold text-slate-900">{formatCAD(singleMultiT4Price)}</span>
                  </div>
                )}

                {householdBasicEnabled && (
                  <div className="rounded-xl border border-slate-200 p-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Household — T4 + Spouse</span>
                    <span className="text-sm font-bold text-slate-900">{formatCAD(householdBasicPrice)}</span>
                  </div>
                )}

                {householdMixedEnabled && (
                  <div className="rounded-xl border border-slate-200 p-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Household — Mixed Complexity</span>
                    <span className="text-sm font-bold text-slate-900">{formatCAD(householdMixedPrice)}</span>
                  </div>
                )}

                {mixedIncomeEnabled && (
                  <div className="rounded-xl border border-slate-200 p-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Mixed Income Account</span>
                    <span className="text-sm font-bold text-slate-900">{formatCAD(mixedIncomePrice)}</span>
                  </div>
                )}

                {selfEmployedEnabled && (
                  <div className="rounded-xl border border-slate-200 p-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Self-Employed + Expenses</span>
                    <span className="text-sm font-bold text-slate-900">{formatCAD(selfEmployedPrice)}</span>
                  </div>
                )}

                {businessBasicEnabled && (
                  <div className="rounded-xl border border-slate-200 p-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Business Account</span>
                    <span className="text-sm font-bold text-slate-900">{formatCAD(businessBasicPrice)}</span>
                  </div>
                )}

                {businessAdvancedEnabled && (
                  <div className="rounded-xl border border-slate-200 p-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Business + GST / Payroll</span>
                    <span className="text-sm font-bold text-slate-900">{formatCAD(businessAdvancedPrice)}</span>
                  </div>
                )}

                {visiblePreviewCount === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
                    No active pricing is visible right now.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-bold text-slate-900">Suggested pricing strategy</h3>
              <div className="mt-3 space-y-2.5 text-sm text-slate-600">
                <div className="rounded-xl bg-slate-50 p-3">
                  Keep a lower starting price for simple single-account returns.
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  Increase pricing when the account becomes household, mixed-income, or self-employed.
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  Use business + GST/payroll as your premium tier because it usually takes more review time.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <CheckCircle2 size={18} />
              Save Pricing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CAPricing;
