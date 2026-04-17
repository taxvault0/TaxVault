import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PiggyBank, // RRSP
  Gift, // TFSA
  Home, // FHSA
  GraduationCap, // RESP
  Heart, // RDSP
  TrendingDown, // RRIF
  Briefcase, // Non-reg
  Baby, // CCB
  Plus,
  Upload,
  Eye,
  Download,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';

const AccountDocuments = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      type: 'rrsp',
      institution: 'RBC',
      accountNumber: '1234-5678',
      documents: [
        { type: 'contribution-receipt', year: 2024, status: 'uploaded', amount: 5000 },
        { type: 't4rsp', year: 2024, status: 'pending' }
      ],
      status: 'partial',
      contributionSummary: {
        total: 5000,
        first60Days: 2000,
        deductionLimit: 31560
      }
    },
    {
      id: 2,
      type: 'fhsa',
      institution: 'TD',
      accountNumber: '8765-4321',
      documents: [
        { type: 't4fhsa', year: 2024, status: 'uploaded', amount: 8000 }
      ],
      status: 'complete',
      contributionSummary: {
        total: 8000,
        deductionLimit: 8000
      }
    },
    {
      id: 3,
      type: 'resp',
      institution: 'Wealthsimple',
      accountNumber: 'RESP-123',
      documents: [
        { type: 't4a', year: 2024, status: 'pending' }
      ],
      status: 'incomplete',
      contributionSummary: {
        total: 2500,
        grants: 500, // CESG
        beneficiaries: ['Emma (age 8)', 'Noah (age 5)']
      }
    },
    {
      id: 4,
      type: 'ccb',
      documents: [
        { type: 'ccb-notice', year: 2024, status: 'uploaded' }
      ],
      status: 'complete',
      children: ['Emma (DOB: 2016-03-15)', 'Noah (DOB: 2019-08-22)']
    }
  ]);

  const years = [2024, 2023, 2022, 2021];

  const accountIcons = {
    rrsp: PiggyBank,
    tfsa: Gift,
    fhsa: Home,
    resp: GraduationCap,
    rdsp: Heart,
    rrif: TrendingDown,
    'non-registered': Briefcase,
    ccb: Baby
  };

  const accountColors = {
    rrsp: 'primary',
    tfsa: 'success',
    fhsa: 'info',
    resp: 'gold',
    rdsp: 'warning',
    rrif: 'secondary',
    'non-registered': 'primary',
    ccb: 'success'
  };

  const accountLabels = {
    rrsp: 'RRSP',
    tfsa: 'TFSA',
    fhsa: 'FHSA',
    resp: 'RESP',
    rdsp: 'RDSP',
    rrif: 'RRIF',
    'non-registered': 'Non-Registered',
    ccb: 'Canada Child Benefit'
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'complete':
        return <Badge variant="success">Complete</Badge>;
      case 'partial':
        return <Badge variant="warning">Partial</Badge>;
      default:
        return <Badge variant="error">Missing Documents</Badge>;
    }
  };

  const getDocumentIcon = (status) => {
    switch(status) {
      case 'uploaded':
        return <CheckCircle size={16} className="text-success-500" />;
      case 'pending':
        return <Clock size={16} className="text-warning-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-300" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Documents</h1>
          <p className="text-gray-500 mt-1">
            Track RRSP, TFSA, FHSA, RESP, and other registered accounts
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Plus size={16} className="mr-2" />
            Add Account
          </Button>
          <Button variant="primary">
            <Upload size={16} className="mr-2" />
            Upload Documents
          </Button>
        </div>
      </div>

      {/* Year Selector */}
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

      {/* CRA Info Banner */}
      <Card className="bg-primary-50 border-primary-200">
        <Card.Body>
          <div className="flex items-start">
            <AlertCircle className="text-primary-600 mr-3 flex-shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-primary-700">Important Tax Information</h4>
              <p className="text-sm text-primary-600 mt-1">
                • RRSP contributions: Deductible up to your contribution limit. Report first 60 days of 2025 on 2024 return.
                • FHSA: Tax-deductible contributions, tax-free withdrawals for first home.
                • RESP: CESG grants (20% matching) are tax-free until withdrawn.
                • TFSA: No tax slips - CRA tracks contributions separately.
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Account Cards */}
      <div className="space-y-4">
        {accounts.map(account => {
          const Icon = accountIcons[account.type];
          const color = accountColors[account.type];
          
          return (
            <Card key={account.id} className="hover:shadow-md transition-shadow">
              <Card.Body>
                {/* Account Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`p-3 bg-${color}-100 rounded-lg mr-4`}>
                      <Icon size={24} className={`text-${color}-600`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {accountLabels[account.type]}
                      </h3>
                      {account.institution && (
                        <p className="text-sm text-gray-500">
                          {account.institution} • {account.accountNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(account.status)}
                </div>

                {/* Account Summary */}
                {account.type === 'rrsp' && (
                  <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">Total Contributions</p>
                      <p className="font-semibold">${account.contributionSummary.total}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">First 60 Days</p>
                      <p className="font-semibold">${account.contributionSummary.first60Days}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Deduction Limit</p>
                      <p className="font-semibold">${account.contributionSummary.deductionLimit}</p>
                    </div>
                  </div>
                )}

                {account.type === 'fhsa' && (
                  <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">Total Contributions</p>
                      <p className="font-semibold">${account.contributionSummary.total}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Deduction Limit</p>
                      <p className="font-semibold">${account.contributionSummary.deductionLimit}</p>
                    </div>
                  </div>
                )}

                {account.type === 'resp' && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Total Contributions</p>
                        <p className="font-semibold">${account.contributionSummary.total}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">CESG Grants</p>
                        <p className="font-semibold text-success-600">+${account.contributionSummary.grants}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">Beneficiaries</p>
                      <p className="text-sm">{account.contributionSummary.beneficiaries.join(' • ')}</p>
                    </div>
                  </div>
                )}

                {account.type === 'ccb' && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Children</p>
                    <p className="text-sm">{account.children.join(' • ')}</p>
                  </div>
                )}

                {/* Documents List */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Required Documents</h4>
                  {account.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        {getDocumentIcon(doc.status)}
                        <span className="ml-3 text-sm">
                          {doc.type === 'contribution-receipt' && 'RRSP Contribution Receipt'}
                          {doc.type === 't4rsp' && 'T4RSP - RRSP Withdrawal'}
                          {doc.type === 't4fhsa' && 'T4FHSA - FHSA Statement'}
                          {doc.type === 't4a' && 'T4A - RESP Educational Assistance'}
                          {doc.type === 'ccb-notice' && 'CCB Notice (from CRA)'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {doc.amount && (
                          <span className="text-sm font-medium">${doc.amount}</span>
                        )}
                        {doc.status === 'uploaded' ? (
                          <>
                            <button className="p-1 hover:bg-gray-200 rounded">
                              <Eye size={16} className="text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-200 rounded">
                              <Download size={16} className="text-gray-600" />
                            </button>
                          </>
                        ) : (
                          <Button size="sm" variant="outline">
                            <Upload size={14} className="mr-1" />
                            Upload
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>

      {/* Educational Resources */}
      <Card className="bg-info-50 border-info-200">
        <Card.Body>
          <h3 className="font-medium text-info-700 mb-2">Understanding Your Account Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">RRSP</p>
              <p className="text-info-600">Contribution receipts reduce taxable income. T4RSP for withdrawals.</p>
            </div>
            <div>
              <p className="font-semibold">FHSA</p>
              <p className="text-info-600">Deductible contributions, tax-free withdrawals for first home.</p>
            </div>
            <div>
              <p className="font-semibold">RESP</p>
              <p className="text-info-600">CESG grants add 20% to contributions. T4A when child withdraws.</p>
            </div>
            <div>
              <p className="font-semibold">TFSA</p>
              <p className="text-info-600">No tax slips - track contribution room in CRA My Account.</p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AccountDocuments;







