import React, { useState } from 'react';
import {
  Percent,
  Calendar,
  Download,
  Upload,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  DollarSign
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';
import { PROVINCES, calculateTax, getTaxRateDisplay } from 'constants/provinces';

const BusinessGSTRecords = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [province, setProvince] = useState('ON');
  const [selectedQuarter, setSelectedQuarter] = useState(null);

  const years = [2024, 2023, 2022, 2021];

  const [gstInfo, setGstInfo] = useState({
    registered: true,
    gstNumber: '123456789RT0001',
    filingFrequency: 'quarterly',
    reportingPeriod: 'Monthly'
  });

  const [quarters, setQuarters] = useState([
    {
      id: 1,
      period: 'Q1 2024',
      months: 'Jan - Mar',
      collected: 2125.50,
      paid: 890.25,
      netPayable: 1235.25,
      filingDue: '2024-04-30',
      documents: {
        return: 'uploaded',
        workingPaper: 'uploaded',
        assessment: 'pending'
      },
      sales: 42510.00,
      purchases: 17805.00,
      status: 'filed'
    },
    {
      id: 2,
      period: 'Q4 2023',
      months: 'Oct - Dec',
      collected: 1980.75,
      paid: 765.50,
      netPayable: 1215.25,
      filingDue: '2024-01-31',
      documents: {
        return: 'uploaded',
        workingPaper: 'uploaded',
        assessment: 'uploaded'
      },
      sales: 39615.00,
      purchases: 15310.00,
      status: 'filed'
    },
    {
      id: 3,
      period: 'Q3 2023',
      months: 'Jul - Sep',
      collected: 1850.25,
      paid: 720.30,
      netPayable: 1129.95,
      filingDue: '2023-10-31',
      documents: {
        return: 'uploaded',
        workingPaper: 'uploaded',
        assessment: 'uploaded'
      },
      sales: 37005.00,
      purchases: 14406.00,
      status: 'filed'
    },
    {
      id: 4,
      period: 'Q2 2024',
      months: 'Apr - Jun',
      collected: 0,
      paid: 0,
      netPayable: 0,
      filingDue: '2024-07-31',
      documents: {
        return: 'missing',
        workingPaper: 'missing',
        assessment: 'missing'
      },
      sales: 0,
      purchases: 0,
      status: 'upcoming'
    }
  ]);

  const provinceInfo = PROVINCES.find(p => p.id === province);
  const taxRate = getTaxRateDisplay(province);

  const handleFileUpload = (quarterId, docType) => {
    alert(`Upload ${docType} for quarter ${quarterId}`);
  };

  const calculateITCs = () => {
    // Calculate Input Tax Credits from expenses
    const totalITCs = quarters.reduce((sum, q) => sum + q.paid, 0);
    return totalITCs;
  };

  const calculateTotals = () => {
    const filedQuarters = quarters.filter(q => q.status === 'filed');
    const totalCollected = filedQuarters.reduce((sum, q) => sum + q.collected, 0);
    const totalPaid = filedQuarters.reduce((sum, q) => sum + q.paid, 0);
    const totalSales = filedQuarters.reduce((sum, q) => sum + q.sales, 0);
    const totalPurchases = filedQuarters.reduce((sum, q) => sum + q.purchases, 0);
    
    return {
      collected: totalCollected,
      paid: totalPaid,
      net: totalCollected - totalPaid,
      sales: totalSales,
      purchases: totalPurchases
    };
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GST/HST Records</h1>
          <p className="text-gray-500 mt-1">Track, calculate, and file your GST/HST returns</p>
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

      {/* Province Selector */}
      <div className="flex items-center justify-end">
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {PROVINCES.map(p => (
            <option key={p.id} value={p.id}>{p.name} - {getTaxRateDisplay(p.id)}</option>
          ))}
        </select>
      </div>

      {/* GST Registration Card */}
      <Card className="bg-primary-50 border-primary-200">
        <Card.Body>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg mr-4">
                <Percent className="text-primary-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">GST/HST Number</p>
                <p className="text-xl font-bold text-primary-600">{gstInfo.gstNumber}</p>
              </div>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-xs text-gray-500">Tax System</p>
              <p className="font-medium">{provinceInfo?.taxSystem}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Filing Frequency</p>
              <p className="font-medium capitalize">{gstInfo.filingFrequency}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Tax Rate</p>
              <p className="font-medium">{taxRate}</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* YTD Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Total Sales</p>
            <p className="text-2xl font-bold text-primary-600">
              ${totals.sales.toLocaleString()}
            </p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">GST/HST Collected</p>
            <p className="text-2xl font-bold text-success-600">
              ${totals.collected.toLocaleString()}
            </p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">ITCs Claimed</p>
            <p className="text-2xl font-bold text-info-600">
              ${totals.paid.toLocaleString()}
            </p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Net Payable</p>
            <p className="text-2xl font-bold text-warning-600">
              ${totals.net.toLocaleString()}
            </p>
          </Card.Body>
        </Card>
      </div>

      {/* Quarterly Breakdown */}
      <div className="space-y-4">
        {quarters
          .filter(q => q.period.includes(selectedYear))
          .map(quarter => (
            <Card key={quarter.id}>
              <Card.Body className="p-0">
                {/* Quarter Header */}
                <button
                  onClick={() => setSelectedQuarter(selectedQuarter === quarter.id ? null : quarter.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Calendar size={20} className="text-gray-400" />
                    <div className="text-left">
                      <h3 className="font-semibold">{quarter.period}</h3>
                      <p className="text-sm text-gray-500">{quarter.months}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold">${quarter.netPayable.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Net payable</p>
                    </div>
                    <Badge variant={quarter.status === 'filed' ? 'success' : 'warning'}>
                      {quarter.status}
                    </Badge>
                  </div>
                </button>

                {/* Expanded Details */}
                {selectedQuarter === quarter.id && (
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    {/* Quarter Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Sales (before tax)</p>
                        <p className="text-lg font-semibold">${quarter.sales.toLocaleString()}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Purchases</p>
                        <p className="text-lg font-semibold">${quarter.purchases.toLocaleString()}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Net Sales</p>
                        <p className="text-lg font-semibold">
                          ${(quarter.sales - quarter.purchases).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Tax Calculation */}
                    <div className="bg-white p-4 rounded-lg mb-6">
                      <h4 className="font-medium mb-3">Tax Calculation</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">GST/HST Collected</span>
                          <span className="font-semibold">${quarter.collected.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ITCs Claimed</span>
                          <span className="font-semibold">${quarter.paid.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="font-medium">Net Payable</span>
                          <span className="font-bold text-primary-600">${quarter.netPayable.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Required Documents */}
                    <h4 className="font-medium mb-3">Required Documents</h4>
                    <div className="space-y-3">
                      {/* GST/HST Return */}
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center">
                          <FileText size={16} className="text-gray-400 mr-3" />
                          <span>GST/HST Return (Form)</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          {quarter.documents.return === 'uploaded' ? (
                            <>
                              <CheckCircle size={16} className="text-success-500" />
                              <button className="text-sm text-primary-600 hover:underline">View</button>
                            </>
                          ) : (
                            <>
                              <AlertCircle size={16} className="text-warning-500" />
                              <button
                                onClick={() => handleFileUpload(quarter.id, 'return')}
                                className="text-sm text-primary-600 hover:underline"
                              >
                                Upload
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Working Paper */}
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center">
                          <FileText size={16} className="text-gray-400 mr-3" />
                          <span>Working Paper / Calculation</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          {quarter.documents.workingPaper === 'uploaded' ? (
                            <>
                              <CheckCircle size={16} className="text-success-500" />
                              <button className="text-sm text-primary-600 hover:underline">View</button>
                            </>
                          ) : (
                            <>
                              <AlertCircle size={16} className="text-warning-500" />
                              <button
                                onClick={() => handleFileUpload(quarter.id, 'workingPaper')}
                                className="text-sm text-primary-600 hover:underline"
                              >
                                Upload
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Notice of Assessment */}
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center">
                          <FileText size={16} className="text-gray-400 mr-3" />
                          <span>Notice of Assessment</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          {quarter.documents.assessment === 'uploaded' ? (
                            <>
                              <CheckCircle size={16} className="text-success-500" />
                              <button className="text-sm text-primary-600 hover:underline">View</button>
                            </>
                          ) : (
                            <>
                              <Clock size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-500">Pending</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Filing Actions */}
                    {quarter.status !== 'filed' && (
                      <div className="mt-6 flex space-x-3">
                        <Button variant="outline" className="flex-1">
                          Calculate
                        </Button>
                        <Button variant="primary" className="flex-1">
                          File Return
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
      </div>

      {/* ITC Calculator */}
      <Card className="bg-info-50 border-info-200">
        <Card.Body>
          <div className="flex items-start">
            <TrendingDown className="text-info-600 mr-3 flex-shrink-0 mt-1" size={20} />
            <div className="flex-1">
              <h4 className="font-medium text-info-700">Input Tax Credits (ITCs)</h4>
              <p className="text-sm text-info-600 mt-1">
                You can claim ITCs on business purchases that include GST/HST. Total ITCs claimed YTD: 
                <span className="font-bold ml-1">${totals.paid.toLocaleString()}</span>
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                Calculate ITCs from Expenses
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Filing Requirements */}
      <Card className="bg-warning-50 border-warning-200">
        <Card.Body>
          <div className="flex items-start">
            <AlertCircle className="text-warning-600 mr-3 flex-shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-warning-700">GST/HST Filing Requirements</h4>
              <p className="text-sm text-warning-600 mt-1">
                • File within one month after the end of each reporting period
                • Keep all receipts showing GST/HST paid for ITC claims
                • Report both collected and paid GST/HST
                • Use business percentage to claim ITCs on shared expenses
                • Keep records for 6 years
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BusinessGSTRecords;







