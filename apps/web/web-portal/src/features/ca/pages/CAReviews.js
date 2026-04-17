import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  ExclamationTriangleIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import Card from 'components/ui/Card';
import Badge from 'components/ui/Badge';
import { taxExtractionService } from 'services/taxExtractionService';

const getConfidenceClasses = (confidence) => {
  if (confidence >= 0.95) return 'bg-emerald-100 text-emerald-700';
  if (confidence >= 0.85) return 'bg-amber-100 text-amber-700';
  return 'bg-rose-100 text-rose-700';
};

const CAReviews = () => {
  const [taxYear, setTaxYear] = useState(new Date().getFullYear());

  const { data = [], isLoading } = useQuery(['ca-review-queue', taxYear], () =>
    taxExtractionService.getReviewQueue(taxYear)
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Slip Review Queue</h1>
          <p className="mt-1 text-sm text-gray-600">
            Review extracted slip fields before final tax filing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            className="input-field w-32"
            value={taxYear}
            onChange={(e) => setTaxYear(Number(e.target.value))}
          >
            {[2026, 2025, 2024, 2023].map((year) => (
              <option key={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Items in Queue</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{data.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Low Confidence</p>
          <p className="mt-2 text-2xl font-bold text-amber-600">
            {data.filter((item) => item.confidence < 0.9).length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Ready After Review</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {Math.max(data.length - 1, 0)}
          </p>
        </div>
      </div>

      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Documents Needing Review</h2>
            <Badge variant="warning" className="px-3 py-1 text-xs">
              CA Review
            </Badge>
          </div>
        </Card.Header>

        <Card.Body className="space-y-4">
          {data.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-gray-200 bg-white p-4"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-900">
                      {item.clientName}
                    </h3>
                    <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
                      {item.type}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${getConfidenceClasses(item.confidence)}`}
                    >
                      {Math.round(item.confidence * 100)}% confidence
                    </span>
                  </div>

                  <p className="text-sm text-gray-600">
                    {item.issuer} • {item.documentName}
                  </p>

                  <p className="text-xs text-gray-500">Uploaded {item.uploadedAt}</p>

                  {item.flags?.length > 0 && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                      <div className="flex items-start gap-2">
                        <ExclamationTriangleIcon className="mt-0.5 h-4 w-4 text-amber-500" />
                        <div className="space-y-1 text-sm text-amber-700">
                          {item.flags.map((flag) => (
                            <p key={flag}>{flag}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {item.missingFields?.length > 0 && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                      Missing fields: {item.missingFields.join(', ')}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 lg:min-w-[220px]">
                  <Link
                    to={`/ca/clients/${item.clientId}/tax-summary`}
                    className="btn-primary text-center"
                  >
                    <CheckBadgeIcon className="mr-2 inline h-4 w-4" />
                    Review Tax Data
                  </Link>

                  <Link
                    to={`/ca/clients/${item.clientId}/documents`}
                    className="btn-outline text-center"
                  >
                    <ArrowTopRightOnSquareIcon className="mr-2 inline h-4 w-4" />
                    Open Source File
                  </Link>

                  <Link
                    to={`/ca/clients/${item.clientId}`}
                    className="btn-outline text-center"
                  >
                    <MagnifyingGlassIcon className="mr-2 inline h-4 w-4" />
                    Open Client Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {data.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
              No extracted slips need review for this tax year.
            </div>
          )}
        </Card.Body>
      </Card>

      <Card className="border-primary-200 bg-primary-50">
        <Card.Body className="p-4">
          <div className="flex items-start gap-3">
            <FunnelIcon className="mt-0.5 h-5 w-5 text-primary-600" />
            <div>
              <p className="text-sm font-semibold text-primary-900">How this helps the CA</p>
              <p className="mt-1 text-sm text-primary-700">
                The CA can review only the exceptions here instead of opening every uploaded
                slip one by one.
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CAReviews;
