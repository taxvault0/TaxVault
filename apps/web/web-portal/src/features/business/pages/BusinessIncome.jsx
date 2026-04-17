import React, { useState } from 'react';
import {
  DollarSign,
  Calendar,
  Download,
  Upload,
  TrendingUp,
  Percent,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Plus
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Badge from 'components/ui/Badge';
import { PROVINCES, calculateTax, getTaxRateDisplay } from 'constants/provinces';

const BusinessIncome = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [province, setProvince] = useState('ON');
  const [expandedMonth, setExpandedMonth] = useState(null);

  const years = [2024, 2023, 2022, 2021];

  const [monthlySales, setMonthlySales] = useState([
    {
      id: 1,
      month: 'January',
      year: 2024,
      totalSales: 45230.50,
      posSystem: 'Square',
      documents: {
        posSummary: 'uploaded',
        invoices: 'pending',
        processorStatements: 'uploaded'
      },
      status: 'partial'
    },
    {
      id: 2,
      month: 'February',
      year: 2024,
      totalSales: 48750.75,
      posSystem: 'Square',
      documents: {
        posSummary: 'uploaded',
        invoices: 'uploaded',
        processorStatements: 'pending'
      },
      status: 'partial'
    },
    {
      id: 3,
      month: 'March',
      year: 2024,
      totalSales: 0,
      posSystem: 'Square',
      documents: {
        posSummary: 'missing',
        invoices: 'missing',
        processorStatements: 'missing'
      },
      status: 'missing'
    },
    {
      id: 4,
      month: 'December',
      year: 2023,
      totalSales: 52340.25,
      posSystem: 'Square',
      documents: {
        posSummary: 'uploaded',
        invoices: 'uploaded',
        processorStatements: 'uploaded'
      },
      status: 'verified'
    }
  ]);

  const [showAddMonth, setShowAddMonth] = useState(false);
  const [newSale, setNewSale] = useState({
    month: '',
    totalSales: '',
    posSystem: 'Square'
  });

  const provinceInfo = PROVINCES.find(p => p.id === province);
  const taxRate = getTaxRateDisplay(province);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const calculateYTD = () => {
    const currentYearSales = monthlySales.filter(s => s.year === selectedYear);
    const total = currentYearSales.reduce((sum, s) => sum + s.totalSales, 0);
    const gst = calculateTax(total, province).total;
    return { total, gst };
  };

  const ytd = calculateYTD();

  const handleFileUpload = (monthId, docType) => {
    alert(`Upload ${docType} for month ${monthId}`);
  };

  const getDocumentStatusIcon = (status) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircle size={16} className="text-success-500" />;
      case 'pending':
        return <AlertCircle size={16} className="text-warning-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-300" />;
    }
  };

  const getMonthStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return <Badge variant="success">Complete</Badge>;
      case 'partial':
        return <Badge variant="warning">Partial</Badge>;
      default:
        return <Badge variant="error">Missing</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales & Income</h1>
          <p className="text-gray-500 mt-1">Track monthly sales and upload supporting documents</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setShowAddMonth(true)}>
            <Plus size={16} className="mr-2" />
            Add Month
          </Button>
          <Button variant="primary">
            <Download size={16} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Year and Province Selector */}
      <div className="flex items-center justify-between">
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
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {PROVINCES.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* YTD Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary-50 border-primary-200">
          <Card.Body>
            <p className="text-sm text-gray-600">Year-to-Date Sales</p>
            <p className="text-3xl font-bold text-primary-600 mt-2">
              ${ytd.total.toLocaleString()}
            </p>
          </Card.Body>
        </Card>
        <Card className="bg-success-50 border-success-200">
          <Card.Body>
            <p className="text-sm text-gray-600">GST/HST Collected</p>
            <p className="text-3xl font-bold text-success-600 mt-2">
              ${ytd.gst.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">{taxRate}</p>
          </Card.Body>
        </Card>
        <Card className="bg-info-50 border-info-200">
          <Card.Body>
            <p className="text-sm text-gray-600">Months Completed</p>
            <p className="text-3xl font-bold text-info-600 mt-2">
              {monthlySales.filter(s => s.year === selectedYear && s.status === 'verified').length}/12
            </p>
          </Card.Body>
        </Card>
      </div>

      {/* Tax Info Banner */}
      <Card className="bg-warning-50 border-warning-200">
        <Card.Body>
          <div className="flex items-start">
            <Percent className="text-warning-600 mr-3 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-medium text-warning-700">Sales Tax Requirements - {provinceInfo?.name}</p>
              <p className="text-sm text-warning-600 mt-1">
                You must charge {taxRate} on all taxable sales. Keep detailed records of all sales for GST/HST returns.
                Monthly sales summaries from your POS system are required for each month.
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Monthly Sales List */}
      <div className="space-y-4">
        {monthlySales
          .filter(s => s.year === selectedYear)
          .sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month))
          .map((month) => (
            <Card key={month.id}>
              <Card.Body className="p-0">
                {/* Month Header */}
                <button
                  onClick={() => setExpandedMonth(expandedMonth === month.id ? null : month.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Calendar size={20} className="text-gray-400" />
                    <div>
                      <h3 className="font-semibold">{month.month} {month.year}</h3>
                      <p className="text-sm text-gray-500">
                        Total Sales: ${month.totalSales.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {getMonthStatusBadge(month.status)}
                    {expandedMonth === month.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                {/* Expanded Details */}
                {expandedMonth === month.id && (
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    {month.totalSales === 0 ? (
                      <div className="text-center py-8">
                        <DollarSign size={48} className="mx-auto text-gray-300 mb-4" />
                        <h4 className="font-medium text-gray-700 mb-2">No Sales Recorded</h4>
                        <p className="text-sm text-gray-500 mb-4">
                          Add your monthly sales to track income and calculate taxes
                        </p>
                        <Button size="sm" onClick={() => setShowAddMonth(true)}>
                          Add Sales for {month.month}
                        </Button>
                      </div>
                    ) : (
                      <>
                        {/* Sales Details */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <p className="text-xs text-gray-500">Total Sales (before tax)</p>
                            <p className="text-xl font-bold">${month.totalSales.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">POS System</p>
                            <p className="font-medium">{month.posSystem}</p>
                          </div>
                        </div>

                        {/* Tax Calculation */}
                        <div className="bg-white p-4 rounded-lg mb-6">
                          <h4 className="font-medium mb-3">Tax Calculation ({taxRate})</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">GST/HST Collected</span>
                              <span className="font-semibold">
                                ${calculateTax(month.totalSales, province).total.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between pt-2 border-t">
                              <span className="font-medium">Total with Tax</span>
                              <span className="font-bold text-primary-600">
                                ${calculateTax(month.totalSales, province).grandTotal.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Required Documents */}
                        <h4 className="font-medium mb-3">Required Documents</h4>
                        <div className="space-y-3">
                          {/* POS Summary */}
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div className="flex items-center">
                              {getDocumentStatusIcon(month.documents.posSummary)}
                              <span className="ml-3 text-sm">POS System Summary</span>
                            </div>
                            {month.documents.posSummary === 'uploaded' ? (
                              <button className="text-primary-600 text-sm hover:underline">
                                View
                              </button>
                            ) : (
                              <button
                                onClick={() => handleFileUpload(month.id, 'posSummary')}
                                className="text-primary-600 text-sm hover:underline"
                              >
                                Upload
                              </button>
                            )}
                          </div>

                          {/* Invoices */}
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div className="flex items-center">
                              {getDocumentStatusIcon(month.documents.invoices)}
                              <span className="ml-3 text-sm">Customer Invoices (if applicable)</span>
                            </div>
                            {month.documents.invoices === 'uploaded' ? (
                              <button className="text-primary-600 text-sm hover:underline">
                                View
                              </button>
                            ) : (
                              <button
                                onClick={() => handleFileUpload(month.id, 'invoices')}
                                className="text-primary-600 text-sm hover:underline"
                              >
                                Upload
                              </button>
                            )}
                          </div>

                          {/* Processor Statements */}
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div className="flex items-center">
                              {getDocumentStatusIcon(month.documents.processorStatements)}
                              <span className="ml-3 text-sm">Payment Processor Statements</span>
                            </div>
                            {month.documents.processorStatements === 'uploaded' ? (
                              <button className="text-primary-600 text-sm hover:underline">
                                View
                              </button>
                            ) : (
                              <button
                                onClick={() => handleFileUpload(month.id, 'processorStatements')}
                                className="text-primary-600 text-sm hover:underline"
                              >
                                Upload
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
      </div>

      {/* Add Month Modal - Simplified */}
      {showAddMonth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full">
            <Card.Header>
              <h3 className="font-semibold">Add Monthly Sales</h3>
            </Card.Header>
            <Card.Body className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <select
                  value={newSale.month}
                  onChange={(e) => setNewSale({...newSale, month: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select month</option>
                  {months.map(m => (
                    <option key={m} value={m}>{m} {selectedYear}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Total Sales ($)"
                type="number"
                value={newSale.totalSales}
                onChange={(e) => setNewSale({...newSale, totalSales: e.target.value})}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">POS System</label>
                <select
                  value={newSale.posSystem}
                  onChange={(e) => setNewSale({...newSale, posSystem: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Square">Square</option>
                  <option value="Lightspeed">Lightspeed</option>
                  <option value="Shopify">Shopify POS</option>
                  <option value="Clover">Clover</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowAddMonth(false)} className="flex-1">
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setShowAddMonth(false)} className="flex-1">
                  Add Month
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BusinessIncome;








