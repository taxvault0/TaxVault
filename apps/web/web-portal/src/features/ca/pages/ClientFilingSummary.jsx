import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  IdCard,
  Calendar,
  MapPin,
  Briefcase,
  FileText,
  Receipt,
  PiggyBank,
  HeartPulse,
  GraduationCap,
  Gift,
  AlertTriangle,
  CheckCircle2,
  Copy,
  FolderOpen,
  ShieldCheck,
} from 'lucide-react';

const currency = (value) => {
  const amount = Number(value || 0);
  return amount.toLocaleString('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const sumBy = (items = [], key) =>
  items.reduce((total, item) => total + Number(item?.[key] || 0), 0);

const badgeClasses = {
  ready: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  missing: 'bg-amber-100 text-amber-700 border border-amber-200',
  review: 'bg-blue-100 text-blue-700 border border-blue-200',
  filed: 'bg-violet-100 text-violet-700 border border-violet-200',
};

const mockClientDatabase = {
  'client-001': {
    client: {
      id: 'TV-2026-001',
      fullName: 'Aman Sharma',
      phone: '+1 (780) 555-0192',
      email: 'aman.sharma@email.com',
      taxYear: 2025,
      province: 'Alberta',
      maritalStatus: 'Single',
      dateOfBirth: '1992-08-14',
      assignedCA: 'Neha Kapoor, CPA',
      status: 'review',
      accountType: 'Employment + Gig Work',
    },
    slips: {
      t4: [
        {
          employerName: 'North Peak Logistics Ltd.',
          employmentIncome: 68500,
          incomeTaxDeducted: 11240,
          cppContributions: 3867.5,
          eiPremiums: 1049.12,
          rppContributions: 2250,
          unionDues: 480,
          pensionAdjustment: 1900,
        },
      ],
      t4a: [
        {
          payerName: 'DashGo Delivery',
          selfEmploymentIncome: 12480,
          taxDeducted: 0,
        },
      ],
      t5: [
        {
          institution: 'RBC',
          interestIncome: 185.35,
          dividendIncome: 0,
        },
      ],
    },
    deductions: {
      rrsp: 6500,
      fhsa: 3200,
      tfsaContribution: 6000,
      donations: 425,
      medical: 890,
      tuition: 0,
      childCare: 0,
      workFromHome: 240,
      unionDuesExtra: 0,
    },
    receipts: {
      fuel: 1480,
      maintenance: 620,
      parking: 210,
      mobile: 720,
      internet: 420,
      meals: 380,
      supplies: 195,
      insurance: 840,
      other: 160,
    },
    reviewFlags: [
      'Gig work receipts uploaded but not all are categorized.',
      'T5 uploaded and extracted successfully.',
      'FHSA contribution slip matched to tax year 2025.',
    ],
  },

  default: {
    client: {
      id: 'TV-2026-999',
      fullName: 'Client Name',
      phone: '+1 (780) 555-0100',
      email: 'client@email.com',
      taxYear: 2025,
      province: 'Alberta',
      maritalStatus: 'Single',
      dateOfBirth: '1990-01-01',
      assignedCA: 'Assigned CA',
      status: 'missing',
      accountType: 'Employment',
    },
    slips: {
      t4: [
        {
          employerName: 'Demo Employer Ltd.',
          employmentIncome: 72000,
          incomeTaxDeducted: 11800,
          cppContributions: 3867.5,
          eiPremiums: 1049.12,
          rppContributions: 0,
          unionDues: 0,
          pensionAdjustment: 0,
        },
      ],
      t4a: [],
      t5: [],
    },
    deductions: {
      rrsp: 0,
      fhsa: 0,
      tfsaContribution: 0,
      donations: 0,
      medical: 0,
      tuition: 0,
      childCare: 0,
      workFromHome: 0,
      unionDuesExtra: 0,
    },
    receipts: {
      fuel: 0,
      maintenance: 0,
      parking: 0,
      mobile: 0,
      internet: 0,
      meals: 0,
      supplies: 0,
      insurance: 0,
      other: 0,
    },
    reviewFlags: ['Add real client data mapping from uploaded documents.'],
  },
};

function SectionCard({ title, icon: Icon, subtitle, children, rightAction }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-slate-100 p-2.5">
            <Icon className="h-5 w-5 text-slate-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {subtitle ? (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {rightAction}
      </div>
      {children}
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <div className="text-sm font-medium text-slate-900">{value || '—'}</div>
    </div>
  );
}

function AmountRow({ label, value, source, strong = false }) {
  return (
    <div
      className={`grid grid-cols-12 gap-3 border-b border-slate-100 py-3 text-sm last:border-b-0 ${
        strong ? 'font-semibold text-slate-900' : 'text-slate-700'
      }`}
    >
      <div className="col-span-5">{label}</div>
      <div className="col-span-3 text-right">{currency(value)}</div>
      <div className="col-span-4 text-slate-500">{source}</div>
    </div>
  );
}

function SmallStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}

const ClientFilingSummary = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();

  const data = useMemo(() => {
    return mockClientDatabase[clientId] || mockClientDatabase.default;
  }, [clientId]);

  const { client, slips, deductions, receipts, reviewFlags } = data;

  const t4EmploymentIncome = sumBy(slips.t4, 'employmentIncome');
  const t4TaxDeducted = sumBy(slips.t4, 'incomeTaxDeducted');
  const t4Cpp = sumBy(slips.t4, 'cppContributions');
  const t4Ei = sumBy(slips.t4, 'eiPremiums');
  const t4Rpp = sumBy(slips.t4, 'rppContributions');
  const t4Union = sumBy(slips.t4, 'unionDues');
  const t4PensionAdjustment = sumBy(slips.t4, 'pensionAdjustment');

  const t4aIncome = sumBy(slips.t4a, 'selfEmploymentIncome');
  const t5Interest = sumBy(slips.t5, 'interestIncome');
  const t5Dividend = sumBy(slips.t5, 'dividendIncome');

  const grossIncomeTotal =
    t4EmploymentIncome + t4aIncome + t5Interest + t5Dividend;

  const totalTaxDeducted = t4TaxDeducted + sumBy(slips.t4a, 'taxDeducted');

  const receiptTotal = Object.values(receipts || {}).reduce(
    (total, amount) => total + Number(amount || 0),
    0
  );

  const quickEntryLines = [
    {
      label: 'Employment income',
      value: t4EmploymentIncome,
      source: `${slips.t4.length} T4 slip(s)`,
    },
    {
      label: 'Self-employment / T4A income',
      value: t4aIncome,
      source: `${slips.t4a.length} T4A slip(s)`,
    },
    {
      label: 'Interest income',
      value: t5Interest,
      source: `${slips.t5.length} T5 slip(s)`,
    },
    {
      label: 'Dividend income',
      value: t5Dividend,
      source: `${slips.t5.length} T5 slip(s)`,
    },
    {
      label: 'Line 15000 - Total income',
      value: grossIncomeTotal,
      source: 'Combined slips',
      strong: true,
    },
    {
      label: 'Income tax deducted',
      value: totalTaxDeducted,
      source: 'T4 / other slips',
    },
    {
      label: 'CPP contributions',
      value: t4Cpp,
      source: 'T4 slips',
    },
    {
      label: 'EI premiums',
      value: t4Ei,
      source: 'T4 slips',
    },
    {
      label: 'RPP contributions',
      value: t4Rpp,
      source: 'T4 slips',
    },
    {
      label: 'Union dues',
      value: t4Union,
      source: 'T4 slips',
    },
    {
      label: 'Pension adjustment',
      value: t4PensionAdjustment,
      source: 'T4 slips',
    },
    {
      label: 'RRSP contributions',
      value: deductions.rrsp,
      source: 'RRSP slips',
    },
    {
      label: 'FHSA contributions',
      value: deductions.fhsa,
      source: 'FHSA records',
    },
    {
      label: 'TFSA contributions',
      value: deductions.tfsaContribution,
      source: 'TFSA records',
    },
    {
      label: 'Donations',
      value: deductions.donations,
      source: 'Donation receipts',
    },
    {
      label: 'Medical expenses',
      value: deductions.medical,
      source: 'Medical receipts',
    },
    {
      label: 'Tuition',
      value: deductions.tuition,
      source: 'Tuition slips',
    },
    {
      label: 'Child care',
      value: deductions.childCare,
      source: 'Child care receipts',
    },
    {
      label: 'Work-from-home expenses',
      value: deductions.workFromHome,
      source: 'Home office support',
    },
    {
      label: 'Gig/business receipts total',
      value: receiptTotal,
      source: 'Expense receipts',
      strong: true,
    },
  ];

  const copyQuickSummary = async () => {
    const text = quickEntryLines
      .map((row) => `${row.label}: ${currency(row.value)} (${row.source})`)
      .join('\n');

    try {
      await navigator.clipboard.writeText(text);
      window.alert('Quick entry totals copied.');
    } catch (error) {
      console.error(error);
      window.alert('Could not copy totals.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-2xl border border-slate-200 p-3 text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div>
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Client Filing Summary
                </h1>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    badgeClasses[client.status] || badgeClasses.review
                  }`}
                >
                  {client.status === 'review'
                    ? 'Ready for review'
                    : client.status === 'missing'
                    ? 'Missing items'
                    : client.status}
                </span>
              </div>

              <p className="text-sm text-slate-500">
                CA-ready entry view for slips, deductions, receipts, and quick
                filing totals.
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  {client.fullName}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  {client.id}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  Tax Year {client.taxYear}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  {client.accountType}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copyQuickSummary}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Copy className="h-4 w-4" />
              Copy Totals
            </button>

            <button
              type="button"
              onClick={() => navigate(`/ca/clients/${clientId || 'default'}/documents`)}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <FolderOpen className="h-4 w-4" />
              Open Documents
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <ShieldCheck className="h-4 w-4" />
              Mark Reviewed
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SmallStat label="Line 15000 Total Income" value={currency(grossIncomeTotal)} />
          <SmallStat label="Tax Deducted" value={currency(totalTaxDeducted)} />
          <SmallStat label="RRSP + FHSA" value={currency(Number(deductions.rrsp || 0) + Number(deductions.fhsa || 0))} />
          <SmallStat label="Receipt Total" value={currency(receiptTotal)} />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-4">
            <SectionCard
              title="Client Snapshot"
              icon={User}
              subtitle="Basic filing identity and contact details."
            >
              <div className="grid grid-cols-1 gap-3">
                <InfoItem icon={User} label="Full Name" value={client.fullName} />
                <InfoItem icon={IdCard} label="Client ID" value={client.id} />
                <InfoItem icon={Phone} label="Phone" value={client.phone} />
                <InfoItem icon={Mail} label="Email" value={client.email} />
                <InfoItem icon={Calendar} label="Date of Birth" value={client.dateOfBirth} />
                <InfoItem icon={MapPin} label="Province" value={client.province} />
                <InfoItem icon={Briefcase} label="Account Type" value={client.accountType} />
                <InfoItem icon={User} label="Assigned CA" value={client.assignedCA} />
              </div>
            </SectionCard>

            <SectionCard
              title="Slip Counts"
              icon={FileText}
              subtitle="Quick view of what has been uploaded and extracted."
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <SmallStat label="T4 Slips" value={String(slips.t4.length)} />
                <SmallStat label="T4A Slips" value={String(slips.t4a.length)} />
                <SmallStat label="T5 Slips" value={String(slips.t5.length)} />
              </div>
            </SectionCard>

            <SectionCard
              title="Review Flags"
              icon={AlertTriangle}
              subtitle="Items the CA may want to verify before filing."
            >
              <div className="space-y-3">
                {reviewFlags?.length ? (
                  reviewFlags.map((flag, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
                    >
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{flag}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>No review flags detected.</span>
                  </div>
                )}
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6 xl:col-span-8">
            <SectionCard
              title="Employment Slips"
              icon={Briefcase}
              subtitle="T4 values extracted for easy entry into tax software."
            >
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="grid grid-cols-12 gap-3 bg-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  <div className="col-span-4">Employer</div>
                  <div className="col-span-2 text-right">Income</div>
                  <div className="col-span-2 text-right">Tax</div>
                  <div className="col-span-2 text-right">CPP</div>
                  <div className="col-span-2 text-right">EI</div>
                </div>

                {slips.t4.length ? (
                  slips.t4.map((item, index) => (
                    <div
                      key={`${item.employerName}-${index}`}
                      className="grid grid-cols-12 gap-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-700"
                    >
                      <div className="col-span-4 font-medium text-slate-900">
                        {item.employerName}
                      </div>
                      <div className="col-span-2 text-right">
                        {currency(item.employmentIncome)}
                      </div>
                      <div className="col-span-2 text-right">
                        {currency(item.incomeTaxDeducted)}
                      </div>
                      <div className="col-span-2 text-right">
                        {currency(item.cppContributions)}
                      </div>
                      <div className="col-span-2 text-right">
                        {currency(item.eiPremiums)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-sm text-slate-500">
                    No T4 slips added.
                  </div>
                )}

                <div className="grid grid-cols-12 gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900">
                  <div className="col-span-4">Total</div>
                  <div className="col-span-2 text-right">{currency(t4EmploymentIncome)}</div>
                  <div className="col-span-2 text-right">{currency(t4TaxDeducted)}</div>
                  <div className="col-span-2 text-right">{currency(t4Cpp)}</div>
                  <div className="col-span-2 text-right">{currency(t4Ei)}</div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Other Income Slips"
              icon={Receipt}
              subtitle="T4A, T5, and other non-employment amounts."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 text-sm font-semibold text-slate-900">
                    T4A Income
                  </div>
                  {slips.t4a.length ? (
                    <div className="space-y-2">
                      {slips.t4a.map((item, index) => (
                        <div
                          key={`${item.payerName}-${index}`}
                          className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm"
                        >
                          <span className="text-slate-700">{item.payerName}</span>
                          <span className="font-semibold text-slate-900">
                            {currency(item.selfEmploymentIncome)}
                          </span>
                        </div>
                      ))}
                      <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-sm font-semibold text-slate-900">
                        <span>Total T4A</span>
                        <span>{currency(t4aIncome)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500">No T4A slips added.</div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 text-sm font-semibold text-slate-900">
                    T5 Income
                  </div>
                  {slips.t5.length ? (
                    <div className="space-y-2">
                      {slips.t5.map((item, index) => (
                        <div
                          key={`${item.institution}-${index}`}
                          className="rounded-xl bg-white px-3 py-2 text-sm"
                        >
                          <div className="mb-1 font-medium text-slate-800">
                            {item.institution}
                          </div>
                          <div className="flex items-center justify-between text-slate-600">
                            <span>Interest</span>
                            <span>{currency(item.interestIncome)}</span>
                          </div>
                          <div className="mt-1 flex items-center justify-between text-slate-600">
                            <span>Dividends</span>
                            <span>{currency(item.dividendIncome)}</span>
                          </div>
                        </div>
                      ))}
                      <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-sm font-semibold text-slate-900">
                        <span>Total T5</span>
                        <span>{currency(t5Interest + t5Dividend)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500">No T5 slips added.</div>
                  )}
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Contributions, Credits, and Deductions"
              icon={PiggyBank}
              subtitle="Amounts the CA can quickly copy into filing software."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <InfoItem icon={PiggyBank} label="RRSP" value={currency(deductions.rrsp)} />
                <InfoItem icon={PiggyBank} label="FHSA" value={currency(deductions.fhsa)} />
                <InfoItem icon={PiggyBank} label="TFSA Contributions" value={currency(deductions.tfsaContribution)} />
                <InfoItem icon={Gift} label="Donations" value={currency(deductions.donations)} />
                <InfoItem icon={HeartPulse} label="Medical" value={currency(deductions.medical)} />
                <InfoItem icon={GraduationCap} label="Tuition" value={currency(deductions.tuition)} />
                <InfoItem icon={Receipt} label="Child Care" value={currency(deductions.childCare)} />
                <InfoItem icon={Briefcase} label="Work From Home" value={currency(deductions.workFromHome)} />
                <InfoItem icon={FileText} label="Extra Union Dues" value={currency(deductions.unionDuesExtra)} />
              </div>
            </SectionCard>

            <SectionCard
              title="Receipts Summary"
              icon={Receipt}
              subtitle="Main expense totals gathered from uploaded receipts."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <InfoItem icon={Receipt} label="Fuel" value={currency(receipts.fuel)} />
                <InfoItem icon={Receipt} label="Maintenance" value={currency(receipts.maintenance)} />
                <InfoItem icon={Receipt} label="Parking / Tolls" value={currency(receipts.parking)} />
                <InfoItem icon={Receipt} label="Mobile" value={currency(receipts.mobile)} />
                <InfoItem icon={Receipt} label="Internet" value={currency(receipts.internet)} />
                <InfoItem icon={Receipt} label="Meals" value={currency(receipts.meals)} />
                <InfoItem icon={Receipt} label="Supplies" value={currency(receipts.supplies)} />
                <InfoItem icon={Receipt} label="Insurance" value={currency(receipts.insurance)} />
                <InfoItem icon={Receipt} label="Other" value={currency(receipts.other)} />
              </div>
            </SectionCard>

            <SectionCard
              title="Tax Software Quick Entry"
              icon={FileText}
              subtitle="Copy-friendly values for ProFile, TaxCycle, DT Max, or Taxprep."
              rightAction={
                <button
                  type="button"
                  onClick={copyQuickSummary}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </button>
              }
            >
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="grid grid-cols-12 gap-3 bg-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  <div className="col-span-5">Item</div>
                  <div className="col-span-3 text-right">Amount</div>
                  <div className="col-span-4">Source</div>
                </div>

                <div className="px-4">
                  {quickEntryLines.map((row) => (
                    <AmountRow
                      key={row.label}
                      label={row.label}
                      value={row.value}
                      source={row.source}
                      strong={row.strong}
                    />
                  ))}
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientFilingSummary;
