import React, { useState } from 'react';
import {
  FileText,
  DollarSign,
  Calendar,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Percent,
  Building,
  FileSignature
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';
import { PROVINCES } from 'constants/provinces';

const BusinessStructure = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [province, setProvince] = useState('ON');

  const years = [2024, 2023, 2022, 2021];

  const [franchiseInfo, setFranchiseInfo] = useState({
    franchiseName: '7-Eleven',
    storeNumber: '#12345',
    franchiseeSince: '2020-01-15',
    agreementTerm: '10 years',
    renewalDate: '2030-01-14',
    initialFee: 25000,
    royaltyRate: 5.5,
    marketingRate: 3.0
  });

  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Franchise Agreement',
      description: 'Master franchise contract',
      status: 'uploaded',
      uploadedDate: '2024-01-15',
      expiryDate: '2030-01-14',
      required: true
    },
    {
      id: 2,
      name: 'Franchise Disclosure Document',
      description: 'Pre-signing disclosure',
      status: 'uploaded',
      uploadedDate: '2024-01-15',
      expiryDate: null,
      required: true
    },
    {
      id: 3,
      name: 'Royalty Fee Statements',
      description: 'Monthly royalty fees',
      status: 'partial',
      required: true,
      monthly: {
        'January-2024': 'uploaded',
        'February-2024': 'uploaded',
        'March-2024': 'pending',
        'April-2024': 'missing'
      }
    },
    {
      id: 4,
      name: 'Marketing Fund Contributions',
      description: 'Monthly marketing fees',
      status: 'partial',
      required: true,
      monthly: {
        'January-2024': 'uploaded',
        'February-2024': 'uploaded',
        'March-2024': 'pending',
        'April-2024': 'missing'
      }
    },
    {
      id: 5,
      name: 'Operations Manual',
      description: 'Franchise standards and procedures',
      status: 'uploaded',
      uploadedDate: '2024-02-10',
      expiryDate: null,
      required: true
    }
  ]);

  const [monthlySales, setMonthlySales] = useState([
    { month: 'January', sales: 45230.50, royalty: 2487.68, marketing: 1356.92 },
    { month: 'February', sales: 48750.75, royalty: 2681.29, marketing: 1462.52 },
    { month: 'March', sales: 42340.25, royalty: 2328.71, marketing: 1270.21 }
  ]);

  const provinceInfo = PROVINCES.find(p => p.id === province);

  const handleFileUpload = (docId, month) => {
    alert(`Upload document for ${docId} - ${month || ''}`);
  };

  const calculateYTD = () => {
    const totalSales = monthlySales.reduce((sum, m) => sum + m.sales, 0);
    const totalRoyalty = monthlySales.reduce((sum, m) => sum + m.royalty, 0);
    const totalMarketing = monthlySales.reduce((sum, m) => sum + m.marketing, 0);
    return { totalSales, totalRoyalty, totalMarketing };
  };

  const ytd = calculateYTD();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Franchise Management</h1>
          <p className="text-gray-500 mt-1">Track franchise documents and fees</p>
        </div>
        <div className="flex items-center space-x-2">
          {years.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedYear === year
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Franchise Info Card */}
      <Card className="bg-primary-50 border-primary-200">
        <Card.Body>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Building className="text-primary-500 mr-3" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-primary-700">{franchiseInfo.franchiseName}</h2>
                <p className="text-primary-600">Store {franchiseInfo.storeNumber}</p>
              </div>
            </div>
            <Badge variant="success">Active</Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500">Franchisee Since</p>
              <p className="font-medium">{franchiseInfo.franchiseeSince}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Agreement Term</p>
              <p className="font-medium">{franchiseInfo.agreementTerm}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Renewal Date</p>
              <p className="font-medium text-warning-600">{franchiseInfo.renewalDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Initial Fee</p>
              <p className="font-medium">${franchiseInfo.initialFee.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg">
              <p className="text-xs text-gray-500">Royalty Rate</p>
              <p className="text-lg font-semibold text-primary-600">{franchiseInfo.royaltyRate}%</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-xs text-gray-500">Marketing Rate</p>
              <p className="text-lg font-semibold text-primary-600">{franchiseInfo.marketingRate}%</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* YTD Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">YTD Sales</p>
            <p className="text-2xl font-bold text-success-600">
              ${ytd.totalSales.toLocaleString()}
            </p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Royalties Paid</p>
            <p className="text-2xl font-bold text-warning-600">
              ${ytd.totalRoyalty.toLocaleString()}
            </p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Marketing Fees</p>
            <p className="text-2xl font-bold text-info-600">
              ${ytd.totalMarketing.toLocaleString()}
            </p>
          </Card.Body>
        </Card>
      </div>

      {/* Monthly Breakdown */}
      <Card>
        <Card.Header>
          <h3 className="font-semibold">Monthly Fee Breakdown</h3>
        </Card.Header>
        <Card.Body>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Month</th>
                  <th className="text-right py-3">Sales</th>
                  <th className="text-right py-3">Royalty ({franchiseInfo.royaltyRate}%)</th>
                  <th className="text-right py-3">Marketing ({franchiseInfo.marketingRate}%)</th>
                  <th className="text-right py-3">Total Fees</th>
                </tr>
              </thead>
              <tbody>
                {monthlySales.map((month, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">{month.month}</td>
                    <td className="text-right py-3">${month.sales.toLocaleString()}</td>
                    <td className="text-right py-3 text-warning-600">${month.royalty.toLocaleString()}</td>
                    <td className="text-right py-3 text-info-600">${month.marketing.toLocaleString()}</td>
                    <td className="text-right py-3 font-semibold">
                      ${(month.royalty + month.marketing).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>

      {/* Required Documents */}
      <Card>
        <Card.Header>
          <h3 className="font-semibold">Franchise Documents</h3>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            {documents.map(doc => (
              <div key={doc.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <FileSignature size={18} className="text-primary-500 mr-2" />
                    <h4 className="font-medium">{doc.name}</h4>
                    {doc.required && (
                      <Badge variant="info" className="ml-2">Required</Badge>
                    )}
                  </div>
                  <Badge variant={doc.status === 'uploaded' ? 'success' : 'warning'}>
                    {doc.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mb-3">{doc.description}</p>

                {doc.uploadedDate && (
                  <p className="text-xs text-gray-400 mb-2">Uploaded: {doc.uploadedDate}</p>
                )}

                {doc.monthly ? (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-gray-600">Monthly Statements:</p>
                    {Object.entries(doc.monthly).map(([month, status]) => (
                      <div key={month} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{month}</span>
                        <div className="flex items-center space-x-3">
                          {status === 'uploaded' ? (
                            <CheckCircle size={16} className="text-success-500" />
                          ) : (
                            <AlertCircle size={16} className="text-warning-500" />
                          )}
                          {status !== 'uploaded' && (
                            <button
                              onClick={() => handleFileUpload(doc.id, month)}
                              className="text-xs text-primary-600 hover:underline"
                            >
                              Upload
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : doc.status !== 'uploaded' ? (
                  <button
                    onClick={() => handleFileUpload(doc.id)}
                    className="mt-2 text-sm text-primary-600 hover:underline flex items-center"
                  >
                    <Upload size={16} className="mr-1" />
                    Upload Document
                  </button>
                ) : (
                  <button className="mt-2 text-sm text-primary-600 hover:underline flex items-center">
                    <Download size={16} className="mr-1" />
                    View Document
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Tax Treatment Notice */}
      <Card className="bg-info-50 border-info-200">
        <Card.Body>
          <div className="flex items-start">
            <Percent className="text-info-600 mr-3 flex-shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-info-700">Franchise Fee Tax Treatment</h4>
              <p className="text-sm text-info-600 mt-1">
                • Initial franchise fee: Amortize over life of agreement (usually 10 years)
                • Royalty fees: Fully deductible in year paid
                • Marketing fees: Fully deductible in year paid
                • Keep all franchise documents for 6 years
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BusinessStructure;








