import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  FolderOpenIcon,
  ArrowTopRightOnSquareIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';
import { FileText } from 'lucide-react';

import Card from 'components/ui/Card';
import Badge from 'components/ui/Badge';
import {
  formatCurrency,
  taxExtractionService,
} from 'services/taxExtractionService';

const getStatusClasses = (status) => {
  if (status === 'verified') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
  if (status === 'review') {
    return 'bg-amber-50 text-amber-700 border-amber-200';
  }
  return 'bg-rose-50 text-rose-700 border-rose-200';
};

const renderFieldValue = (field) => {
  if (field.value === null || field.value === '') return '—';
  if (field.format === 'currency' && typeof field.value === 'number') {
    return formatCurrency(field.value);
  }
  return String(field.value);
};

const ClientTaxSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [taxYear, setTaxYear] = useState(new Date().getFullYear());
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, isLoading } = useQuery(
    ['client-tax-summary', id, taxYear],
    () => taxExtractionService.getClientTaxSummary(id, taxYear),
    {
      enabled: !!id,
    }
  );

  const filteredSlips = useMemo(() => {
    const slips = data?.supportedSlips || [];
    if (statusFilter === 'all') return slips;
    return slips.filter((slip) => slip.status === statusFilter);
  }, [data, statusFilter]);

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate(`/ca/clients/${id}`)}
            className="mb-3 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="mr-1 h-4 w-4" />
            Back to Client Profile
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            {data?.clientName} — Tax Data Summary
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Every CRA-supported personal tax slip and receipt is listed here,
            whether uploaded or not.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/ca/clients/${id}/filing-summary`)}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <FileText className="h-4 w-4" />
            View Filing Summary
          </button>

          <select
            className="input-field w-32"
            value={taxYear}
            onChange={(e) => setTaxYear(Number(e.target.value))}
          >
            {[2026, 2025, 2024, 2023].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            className="input-field w-40"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="verified">Verified</option>
            <option value="review">Needs review</option>
            <option value="missing">Missing</option>
          </select>

          <Link to={`/ca/clients/${id}/documents`} className="btn-outline">
            <FolderOpenIcon className="mr-2 h-4 w-4" />
            Open Documents
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Uploaded slips</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {data?.summary?.slipsReceived || 0}/{data?.summary?.slipsExpected || 0}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Employment income</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {formatCurrency(data?.summary?.employmentIncomeTotal)}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Contract / T4A income</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {formatCurrency(data?.summary?.selfEmploymentIncomeTotal)}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Tax deducted</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {formatCurrency(data?.summary?.totalTaxDeducted)}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Needs review</p>
          <p className="mt-2 text-2xl font-bold text-amber-600">
            {data?.summary?.documentsNeedingReview || 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    All Tax Slips & Receipts
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    The CA can review uploaded values or quickly see which
                    supported items are still missing.
                  </p>
                </div>
                <Badge variant="info" className="px-3 py-1 text-xs">
                  {filteredSlips.length} items
                </Badge>
              </div>
            </Card.Header>

            <Card.Body className="space-y-4">
              {filteredSlips.map((slip) => (
                <div
                  key={slip.id}
                  className="rounded-2xl border border-gray-200 bg-white p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-900">
                          {slip.label}
                        </h3>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                            slip.status
                          )}`}
                        >
                          {slip.status}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                          {slip.category}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-gray-700">
                        {slip.fullName}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {slip.dueWindow}
                      </p>

                      {slip.isUploaded ? (
                        <>
                          <p className="mt-2 text-sm text-gray-500">
                            {slip.issuer} • {slip.documentName}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            Uploaded {slip.uploadedAt} • Confidence{' '}
                            {Math.round((slip.confidence || 0) * 100)}%
                          </p>
                        </>
                      ) : (
                        <p className="mt-2 text-sm font-medium text-rose-600">
                          Not uploaded by client
                        </p>
                      )}
                    </div>

                    {slip.isUploaded ? (
                      <Link
                        to={`/ca/clients/${id}/documents`}
                        className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        Open source file
                        <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>

                  <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
                    <div className="grid grid-cols-12 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <div className="col-span-2">Box</div>
                      <div className="col-span-6">Field</div>
                      <div className="col-span-4 text-right">Value</div>
                    </div>

                    {slip.fields.map((field) => (
                      <div
                        key={`${slip.id}-${field.code}`}
                        className="grid grid-cols-12 border-t border-gray-100 px-4 py-3 text-sm"
                      >
                        <div className="col-span-2 font-semibold text-gray-700">
                          {field.code}
                        </div>
                        <div className="col-span-6 text-gray-700">
                          {field.label}
                        </div>
                        <div className="col-span-4 text-right font-semibold text-gray-900">
                          {renderFieldValue(field)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {slip.flags?.length > 0 && (
                    <div
                      className={`mt-4 rounded-xl p-3 ${
                        slip.status === 'missing'
                          ? 'border border-rose-200 bg-rose-50'
                          : 'border border-amber-200 bg-amber-50'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <ExclamationTriangleIcon
                          className={`mt-0.5 h-5 w-5 ${
                            slip.status === 'missing'
                              ? 'text-rose-500'
                              : 'text-amber-500'
                          }`}
                        />
                        <div>
                          <p
                            className={`text-sm font-semibold ${
                              slip.status === 'missing'
                                ? 'text-rose-800'
                                : 'text-amber-800'
                            }`}
                          >
                            {slip.status === 'missing'
                              ? 'Missing item'
                              : 'Review notes'}
                          </p>
                          <ul
                            className={`mt-2 space-y-1 text-sm ${
                              slip.status === 'missing'
                                ? 'text-rose-700'
                                : 'text-amber-700'
                            }`}
                          >
                            {slip.flags.map((flag) => (
                              <li key={flag}>• {flag}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </Card.Body>
          </Card>
        </div>

        <div className="space-y-6 xl:col-span-4">
          <Card>
            <Card.Header>
              <h3 className="text-base font-semibold text-gray-900">
                Filing Readiness
              </h3>
            </Card.Header>
            <Card.Body className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-3">
                <span className="text-sm text-gray-600">Ready to file</span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                    data?.summary?.readyToFile
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {data?.summary?.readyToFile ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-3">
                <span className="text-sm text-gray-600">Missing slip types</span>
                <span className="text-sm font-semibold text-gray-900">
                  {data?.missingSlipTypes?.length || 0}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-3">
                <span className="text-sm text-gray-600">RRSP total</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(data?.summary?.rrspTotal)}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-3">
                <span className="text-sm text-gray-600">
                  Deductions & credits
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(data?.summary?.deductionsTotal)}
                </span>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h3 className="text-base font-semibold text-gray-900">
                Missing Items
              </h3>
            </Card.Header>
            <Card.Body className="space-y-2">
              {(data?.missingSlipTypes || []).map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-3 text-sm text-rose-700"
                >
                  {item}
                </div>
              ))}

              {(data?.missingSlipTypes || []).length === 0 && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-700">
                  All supported slips and receipts are present.
                </div>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h3 className="text-base font-semibold text-gray-900">
                Deductions & Credits
              </h3>
            </Card.Header>
            <Card.Body className="space-y-3">
              {(data?.deductions || []).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {item.type}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </Card.Body>
          </Card>

          <Card className="border-primary-200 bg-primary-50">
            <Card.Body className="space-y-3 p-4">
              <div className="flex items-center gap-2">
                <RectangleStackIcon className="h-5 w-5 text-primary-600" />
                <p className="font-semibold text-primary-900">
                  CA Working View
                </p>
              </div>
              <p className="text-sm text-primary-700">
                This screen now lists every supported personal tax slip and
                receipt type, so the CA can see both uploaded values and missing
                items in one place.
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientTaxSummary;
