import React, { useState } from 'react';
import {
  Home,
  Zap,
  Droplets,
  Flame,
  Wifi,
  Trash2,
  Calendar,
  DollarSign,
  Upload,
  Download,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';
import { PROVINCES } from 'constants/provinces';

const BusinessExpenses = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [expandedMonth, setExpandedMonth] = useState(null);
  const [province, setProvince] = useState('ON');

  const years = [2024, 2023, 2022, 2021];

  const [lease, setLease] = useState({
    monthlyRent: 3500,
    leaseStart: '2020-01-01',
    leaseEnd: '2025-12-31',
    landlord: 'ABC Properties Inc.',
    document: 'uploaded'
  });

  const [monthlyBills, setMonthlyBills] = useState([
    {
      id: 1,
      month: 'January',
      year: 2024,
      bills: {
        rent: { amount: 3500, paid: true, receipt: 'uploaded', dueDate: '2024-01-05' },
        hydro: { amount: 245.30, paid: true, receipt: 'uploaded', dueDate: '2024-01-15' },
        water: { amount: 85.50, paid: true, receipt: 'uploaded', dueDate: '2024-01-20' },
        gas: { amount: 120.75, paid: true, receipt: 'pending', dueDate: '2024-01-25' },
        internet: { amount: 89.99, paid: true, receipt: 'uploaded', dueDate: '2024-01-10' },
        waste: { amount: 45.00, paid: true, receipt: 'uploaded', dueDate: '2024-01-12' }
      },
      totalExpenses: 4086.54,
      status: 'partial'
    },
    {
      id: 2,
      month: 'February',
      year: 2024,
      bills: {
        rent: { amount: 3500, paid: true, receipt: 'uploaded', dueDate: '2024-02-05' },
        hydro: { amount: 235.80, paid: true, receipt: 'uploaded', dueDate: '2024-02-15' },
        water: { amount: 82.30, paid: false, receipt: 'missing', dueDate: '2024-02-20' },
        gas: { amount: 115.40, paid: true, receipt: 'pending', dueDate: '2024-02-25' },
        internet: { amount: 89.99, paid: true, receipt: 'uploaded', dueDate: '2024-02-10' },
        waste: { amount: 45.00, paid: true, receipt: 'uploaded', dueDate: '2024-02-12' }
      },
      totalExpenses: 4068.49,
      status: 'partial'
    },
    {
      id: 3,
      month: 'March',
      year: 2024,
      bills: {
        rent: { amount: 3500, paid: false, receipt: 'missing', dueDate: '2024-03-05' },
        hydro: { amount: 0, paid: false, receipt: 'missing', dueDate: '2024-03-15' },
        water: { amount: 0, paid: false, receipt: 'missing', dueDate: '2024-03-20' },
        gas: { amount: 0, paid: false, receipt: 'missing', dueDate: '2024-03-25' },
        internet: { amount: 89.99, paid: false, receipt: 'missing', dueDate: '2024-03-10' },
        waste: { amount: 45.00, paid: false, receipt: 'missing', dueDate: '2024-03-12' }
      },
      totalExpenses: 3634.99,
      status: 'missing'
    }
  ]);

  const provinceInfo = PROVINCES.find(p => p.id === province);

  const getUtilityIcon = (utility) => {
    const icons = {
      rent: Home,
      hydro: Zap,
      water: Droplets,
      gas: Flame,
      internet: Wifi,
      waste: Trash2
    };
    return icons[utility] || Home;
  };

  const handleFileUpload = (monthId, utility) => {
    alert(`Upload receipt for ${utility} - Month ${monthId}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return <Badge variant="success">Complete</Badge>;
      case 'partial':
        return <Badge variant="warning">Partial</Badge>;
      default:
        return <Badge variant="error">Missing</Badge>;
    }
  };

  const calculateYTD = () => {
    const currentYearBills = monthlyBills.filter(b => b.year === selectedYear);
    const total = currentYearBills.reduce((sum, b) => sum + b.totalExpenses, 0);
    const rentTotal = currentYearBills.reduce((sum, b) => sum + b.bills.rent.amount, 0);
    return { total, rentTotal };
  };

  const ytd = calculateYTD();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rent & Utilities</h1>
          <p className="text-gray-500 mt-1">Track monthly business expenses</p>
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

      {/* Lease Information */}
      <Card className="bg-primary-50 border-primary-200">
        <Card.Header>
          <div className="flex items-center">
            <Home className="text-primary-500 mr-2" size={20} />
            <h3 className="font-semibold">Lease Agreement</h3>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500">Monthly Rent</p>
              <p className="text-xl font-bold text-primary-600">${lease.monthlyRent}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Lease Period</p>
              <p className="font-medium">{lease.leaseStart} to {lease.leaseEnd}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Landlord</p>
              <p className="font-medium">{lease.landlord}</p>
            </div>
            <div className="flex items-center justify-end">
              {lease.document === 'uploaded' ? (
                <button className="flex items-center text-primary-600 hover:underline">
                  <Download size={16} className="mr-1" />
                  View Lease
                </button>
              ) : (
                <button className="flex items-center text-primary-600 hover:underline">
                  <Upload size={16} className="mr-1" />
                  Upload Lease
                </button>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* YTD Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">YTD Rent</p>
            <p className="text-2xl font-bold text-primary-600">${ytd.rentTotal.toLocaleString()}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">YTD Utilities</p>
            <p className="text-2xl font-bold text-warning-600">
              ${(ytd.total - ytd.rentTotal).toLocaleString()}
            </p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="text-2xl font-bold text-success-600">${ytd.total.toLocaleString()}</p>
          </Card.Body>
        </Card>
      </div>

      {/* Monthly Bills */}
      <div className="space-y-4">
        {monthlyBills
          .filter(b => b.year === selectedYear)
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
                        Total: ${month.totalExpenses.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(month.status)}
                    {expandedMonth === month.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                {/* Expanded Details */}
                {expandedMonth === month.id && (
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="space-y-3">
                      {Object.entries(month.bills).map(([utility, data]) => {
                        const Icon = getUtilityIcon(utility);
                        const isOverdue = !data.paid && new Date(data.dueDate) < new Date();
                        
                        return (
                          <div
                            key={utility}
                            className="flex items-center justify-between p-3 bg-white rounded-lg"
                          >
                            <div className="flex items-center flex-1">
                              <Icon size={18} className="text-gray-400 mr-3" />
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <span className="font-medium capitalize">{utility}</span>
                                  {data.paid ? (
                                    <CheckCircle size={14} className="text-success-500 ml-2" />
                                  ) : (
                                    <AlertCircle size={14} className="text-warning-500 ml-2" />
                                  )}
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <span>${data.amount.toFixed(2)}</span>
                                  <span className="mx-2">•</span>
                                  <span>Due: {data.dueDate}</span>
                                  {isOverdue && (
                                    <>
                                      <span className="mx-2">•</span>
                                      <span className="text-red-500">Overdue</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {data.receipt === 'uploaded' ? (
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                  <Download size={16} className="text-primary-500" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleFileUpload(month.id, utility)}
                                  className="px-3 py-1 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                                >
                                  Upload
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Monthly Total */}
                    <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Monthly Total</span>
                        <span className="text-xl font-bold text-primary-600">
                          ${month.totalExpenses.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
      </div>

      {/* CRA Info */}
      <Card className="bg-info-50 border-info-200">
        <Card.Body>
          <div className="flex items-start">
            <AlertCircle className="text-info-600 mr-3 flex-shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-info-700">Rent & Utilities Deductions</h4>
              <p className="text-sm text-info-600 mt-1">
                Rent and utilities for your business location are fully deductible. Keep all receipts for 6 years.
                If you operate from home, you may be eligible for business-use-of-home expenses.
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BusinessExpenses;








