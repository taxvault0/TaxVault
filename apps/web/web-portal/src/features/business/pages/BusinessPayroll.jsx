import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  DollarSign,
  Calendar,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
  Clock,
  TrendingUp
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Badge from 'components/ui/Badge';
import { PROVINCES } from 'constants/provinces';

const BusinessPayroll = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [province, setProvince] = useState('ON');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const years = [2024, 2023, 2022, 2021];

  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'Cashier',
      startDate: '2023-06-15',
      sin: '***-***-1234',
      hourlyRate: 18.50,
      hoursPerWeek: 35,
      status: 'active',
      documents: {
        t4: 'uploaded',
        contract: 'uploaded',
        sin: 'uploaded'
      }
    },
    {
      id: 2,
      name: 'Mike Chen',
      position: 'Stock Clerk',
      startDate: '2023-08-01',
      sin: '***-***-5678',
      hourlyRate: 19.75,
      hoursPerWeek: 40,
      status: 'active',
      documents: {
        t4: 'pending',
        contract: 'uploaded',
        sin: 'uploaded'
      }
    },
    {
      id: 3,
      name: 'Lisa Patel',
      position: 'Part-time Cashier',
      startDate: '2024-01-10',
      sin: '***-***-9012',
      hourlyRate: 17.25,
      hoursPerWeek: 20,
      status: 'active',
      documents: {
        t4: 'missing',
        contract: 'uploaded',
        sin: 'uploaded'
      }
    }
  ]);

  const [payrollDocuments, setPayrollDocuments] = useState({
    payrollSummaries: {
      'Q1-2024': 'uploaded',
      'Q2-2024': 'pending',
      'Q3-2024': 'missing',
      'Q4-2024': 'missing'
    },
    sourceDeductions: {
      'January-2024': 'uploaded',
      'February-2024': 'uploaded',
      'March-2024': 'pending',
      'April-2024': 'missing'
    },
    pd7aStatements: {
      'January-2024': 'uploaded',
      'February-2024': 'uploaded',
      'March-2024': 'pending',
      'April-2024': 'missing'
    },
    t4Slips: {
      '2023': 'uploaded',
      '2024': 'missing'
    }
  });

  const provinceInfo = PROVINCES.find(p => p.id === province);

  const calculatePayrollCosts = () => {
    // Simplified calculation - in real app, this would be more complex
    const totalHourly = employees.reduce((sum, e) => sum + (e.hourlyRate * e.hoursPerWeek * 52), 0);
    const cpp = totalHourly * 0.0595; // 5.95% CPP contribution
    const ei = totalHourly * 0.0163; // 1.63% EI premium
    const totalCost = totalHourly + cpp + ei;
    
    return {
      wages: totalHourly,
      cpp,
      ei,
      total: totalCost
    };
  };

  const payrollCosts = calculatePayrollCosts();

  const handleFileUpload = (category, period) => {
    alert(`Upload ${category} for ${period}`);
  };

  const DocumentSection = ({ title, icon: Icon, data, category }) => (
    <Card className="mb-4">
      <Card.Header>
        <div className="flex items-center">
          <Icon size={20} className="text-primary-500 mr-2" />
          <h3 className="font-semibold">{title}</h3>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="space-y-3">
          {Object.entries(data).map(([period, status]) => (
            <div
              key={period}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                {status === 'uploaded' ? (
                  <CheckCircle size={16} className="text-success-500 mr-3" />
                ) : (
                  <AlertCircle size={16} className="text-warning-500 mr-3" />
                )}
                <span className="font-medium">{period}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant={status === 'uploaded' ? 'success' : 'warning'}>
                  {status}
                </Badge>
                {status !== 'uploaded' && (
                  <button
                    onClick={() => handleFileUpload(category, period)}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    Upload
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-500 mt-1">Manage employees and payroll documents</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <UserPlus size={16} className="mr-2" />
            Add Employee
          </Button>
          <Button variant="primary">
            <Download size={16} className="mr-2" />
            Run Payroll
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

      {/* Payroll Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Total Employees</p>
            <p className="text-2xl font-bold text-primary-600">{employees.length}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Annual Wages</p>
            <p className="text-2xl font-bold text-success-600">
              ${payrollCosts.wages.toLocaleString()}
            </p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">CPP + EI</p>
            <p className="text-2xl font-bold text-warning-600">
              ${(payrollCosts.cpp + payrollCosts.ei).toLocaleString()}
            </p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <p className="text-sm text-gray-500">Total Payroll Cost</p>
            <p className="text-2xl font-bold text-info-600">
              ${payrollCosts.total.toLocaleString()}
            </p>
          </Card.Body>
        </Card>
      </div>

      {/* Employees List */}
      <Card>
        <Card.Header>
          <h3 className="font-semibold">Active Employees</h3>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            {employees.map(employee => (
              <div
                key={employee.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedEmployee(selectedEmployee === employee.id ? null : employee.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-primary-600">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{employee.name}</h4>
                      <p className="text-sm text-gray-500">{employee.position}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-400">
                        <Calendar size={12} className="mr-1" />
                        <span>Started: {employee.startDate}</span>
                        <span className="mx-2">•</span>
                        <Clock size={12} className="mr-1" />
                        <span>{employee.hoursPerWeek} hrs/week</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">${employee.hourlyRate}/hr</p>
                    <Badge variant={employee.status === 'active' ? 'success' : 'warning'}>
                      {employee.status}
                    </Badge>
                  </div>
                </div>

                {/* Expanded Employee Details */}
                {selectedEmployee === employee.id && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">SIN</p>
                        <p className="font-medium">{employee.sin}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Annual Salary (est.)</p>
                        <p className="font-medium">
                          ${(employee.hourlyRate * employee.hoursPerWeek * 52).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Documents</p>
                        <div className="flex space-x-2 mt-1">
                          {Object.entries(employee.documents).map(([doc, status]) => (
                            <Badge key={doc} variant={status === 'uploaded' ? 'success' : 'warning'} size="sm">
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="outline" size="sm">Process T4</Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Payroll Documents */}
      <DocumentSection
        title="Payroll Summaries"
        icon={FileText}
        data={payrollDocuments.payrollSummaries}
        category="payrollSummaries"
      />

      <DocumentSection
        title="Source Deductions (CPP, EI, Tax)"
        icon={TrendingUp}
        data={payrollDocuments.sourceDeductions}
        category="sourceDeductions"
      />

      <DocumentSection
        title="PD7A Statements"
        icon={FileText}
        data={payrollDocuments.pd7aStatements}
        category="pd7aStatements"
      />

      <DocumentSection
        title="T4 Slips"
        icon={FileText}
        data={payrollDocuments.t4Slips}
        category="t4Slips"
      />

      {/* CRA Info */}
      <Card className="bg-warning-50 border-warning-200">
        <Card.Body>
          <div className="flex items-start">
            <AlertCircle className="text-warning-600 mr-3 flex-shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-warning-700">Payroll Deadlines</h4>
              <p className="text-sm text-warning-600 mt-1">
                • Remit source deductions by the 15th of each month
                • T4 slips must be filed by the last day of February
                • PD7A statements are issued quarterly
                • Keep all payroll records for 6 years
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BusinessPayroll;







