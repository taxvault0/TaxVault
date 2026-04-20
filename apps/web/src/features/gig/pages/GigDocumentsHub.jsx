import React from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  DollarSign,
  Receipt,
  Smartphone,
  Wifi,
  Shield,
  Wrench,
  FileText,
  ArrowRight,
} from 'lucide-react';
import Card from 'components/ui/Card';
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

const mockStatus = {
  'income-records': { uploadedCount: 2, completed: true },
  'fuel-receipts': { uploadedCount: 24, completed: false },
  'mobile-bills': { uploadedCount: 4, completed: false },
  'internet-bills': { uploadedCount: 3, completed: false },
  insurance: { uploadedCount: 1, completed: true },
  maintenance: { uploadedCount: 2, completed: false },
  'other-deductions': { uploadedCount: 6, completed: false },
};

export default function GigDocumentsHub() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Gig / Self-Employment Documents</h1>
        <p className="mt-2 text-sm text-gray-600">
          Upload and manage all records related to gig work, contract income, and self-employment deductions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {GIG_DOCUMENT_TYPES.map((item) => {
          const Icon = iconMap[item.iconKey];
          const status = mockStatus[item.id] || { uploadedCount: 0, completed: false };

          return (
            <Link key={item.id} to={`/gig/documents/${item.id}`}>
              <Card className="h-full border transition hover:border-primary-300 hover:shadow-md">
                <Card.Body className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="rounded-xl bg-primary-50 p-3">
                      <Icon size={20} className="text-primary-600" />
                    </div>
                    <Badge variant={status.completed ? 'success' : 'warning'}>
                      {status.completed ? 'Updated' : 'Needs Review'}
                    </Badge>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
                    <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{item.frequencyLabel}</span>
                    <span>{status.uploadedCount} uploaded</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-sm font-medium text-primary-600">
                    <span>Open category</span>
                    <ArrowRight size={16} />
                  </div>
                </Card.Body>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
