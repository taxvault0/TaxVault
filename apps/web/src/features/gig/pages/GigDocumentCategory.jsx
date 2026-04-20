import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  DollarSign,
  Car,
  Smartphone,
  Wifi,
  Shield,
  Wrench,
  FileText,
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';
import { GIG_DOCUMENT_TYPES } from '../data/gigDocumentTypes';

const iconMap = {
  income: DollarSign,
  fuel: Car,
  mobile: Smartphone,
  internet: Wifi,
  insurance: Shield,
  maintenance: Wrench,
  other: FileText,
};

const mockUploads = {
  'income-records': [
    { id: 1, name: 'Uber Annual Summary 2025.pdf', label: 'Uber', date: '2026-02-10' },
    { id: 2, name: 'DoorDash T4A 2025.pdf', label: 'DoorDash', date: '2026-02-18' },
  ],
  'fuel-receipts': [
    { id: 1, name: 'Fuel Receipt Jan 08.jpg', label: 'Fuel', date: '2026-01-08' },
    { id: 2, name: 'Fuel Receipt Jan 12.jpg', label: 'Fuel', date: '2026-01-12' },
    { id: 3, name: 'Fuel Receipt Jan 16.jpg', label: 'Fuel', date: '2026-01-16' },
  ],
  'mobile-bills': [
    { id: 1, name: 'Rogers Jan Bill.pdf', label: 'Rogers', date: '2026-01-31' },
  ],
  'internet-bills': [],
  insurance: [
    { id: 1, name: 'Insurance Policy 2026.pdf', label: 'Annual Policy', date: '2026-01-03' },
  ],
  maintenance: [
    { id: 1, name: 'Oil Change Receipt.pdf', label: 'Oil Change', date: '2026-01-20' },
  ],
  'other-deductions': [],
};

export default function GigDocumentCategory() {
  const { categoryId } = useParams();
  const [files] = useState(mockUploads[categoryId] || []);

  const category = useMemo(
    () => GIG_DOCUMENT_TYPES.find((item) => item.id === categoryId),
    [categoryId]
  );

  if (!category) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-gray-700">Category not found.</p>
      </div>
    );
  }

  const Icon = iconMap[category.iconKey];
  const alreadyUploaded = files.length > 0;
  const showSingleUploadWarning = !category.recurring && !category.allowsMultiplePerYear && alreadyUploaded;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/gig/documents" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
          <ArrowLeft size={16} className="mr-2" />
          Back to Gig Documents
        </Link>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-primary-50 p-3">
              <Icon size={22} className="text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{category.title}</h1>
              <p className="mt-2 text-sm text-gray-600">{category.description}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="info">{category.frequencyLabel}</Badge>
                <Badge variant={category.recurring ? 'warning' : 'success'}>
                  {category.recurring ? 'Recurring uploads' : 'Year-based upload'}
                </Badge>
                {category.allowsMultiplePerYear && (
                  <Badge variant="info">Multiple uploads allowed</Badge>
                )}
              </div>
            </div>
          </div>

          <Button variant="primary">
            <Upload size={16} className="mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {showSingleUploadWarning && (
        <Card className="border-green-200 bg-green-50">
          <Card.Body>
            <p className="text-sm font-medium text-green-900">
              This category is usually uploaded once per year and already has a file for the current year.
            </p>
            <p className="mt-1 text-sm text-green-700">
              You can still replace or re-upload if the document changed.
            </p>
          </Card.Body>
        </Card>
      )}

      {!showSingleUploadWarning && !category.recurring && alreadyUploaded && (
        <Card className="border-blue-200 bg-blue-50">
          <Card.Body>
            <p className="text-sm font-medium text-blue-900">
              Documents already uploaded for this year.
            </p>
            <p className="mt-1 text-sm text-blue-700">
              This is normal for annual records. Some categories, like income records, can still have multiple uploads for different platforms.
            </p>
          </Card.Body>
        </Card>
      )}

      <Card>
        <Card.Header>
          <h2 className="text-lg font-semibold">What to upload</h2>
        </Card.Header>
        <Card.Body>
          <div className="flex flex-wrap gap-2">
            {category.examples.map((item) => (
              <span
                key={item}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
              >
                {item}
              </span>
            ))}
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Uploaded files</h2>
            <span className="text-sm text-gray-500">{files.length} file(s)</span>
          </div>
        </Card.Header>
        <Card.Body>
          {files.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-6 text-center">
              <p className="text-sm text-gray-600">No files uploaded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 p-4"
                >
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {file.label} • {file.date}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View</Button>
                    <Button variant="outline" size="sm">Replace</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
