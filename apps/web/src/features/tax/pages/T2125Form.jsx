import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  ChevronDown, 
  ChevronUp,
  MapPin,
  Building,
  DollarSign,
  Percent,
  Car,
  Home,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  Calculator
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Badge from 'components/ui/Badge';
import { PROVINCES, calculateTax, getTaxRateDisplay } from 'constants/provinces';

const T2125Form = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [province, setProvince] = useState('ON');
  const [expandedSections, setExpandedSections] = useState({
    identification: true,
    income: true,
    expenses: true,
    vehicle: true,
    homeOffice: true,
    summary: true
  });

  const [formData, setFormData] = useState({
    // Part 1: Identification
    businessName: 'Marcus Chen - Uber Driver',
    businessAddress: '123 Main Street',
    city: 'Toronto',
    province: 'ON',
    postalCode: 'M5V 2H1',
    businessNumber: '123456789',
    businessType: 'Ride-sharing services',
    mainProduct: 'Transportation services',
    accountingMethod: 'cash', // cash or accrual
    gstRegistered: true,
    gstNumber: '123456789RT0001',

    // Part 2: Income
    grossBusinessIncome: 42350.00,
    commissionsPaid: 0,
    businessUseOfHome: 0,
    otherIncome: 0,
    netIncome: 42350.00,

    // Part 3: Business Expenses
    expenses: {
      advertising: 0,
      mealsEntertainment: 450.00,
      insurance: 2400.00,
      interest: 0,
      maintenance: 1890.00,
      managementFees: 0,
      officeExpenses: 0,
      supplies: 320.00,
      legalAccounting: 0,
      propertyTaxes: 0,
      rent: 0,
      salaries: 0,
      travel: 0,
      telephoneUtilities: 960.00,
      fuel: 4230.00,
      delivery: 0,
      professionalFees: 0,
      otherExpenses: 515.00
    },

    // Part 4: Vehicle Expenses
    vehicleExpenses: {
      fuel: 4230.00,
      maintenance: 1890.00,
      insurance: 2400.00,
      licenseFees: 120.00,
      leasePayments: 0,
      interest: 0,
      parking: 350.00,
      supplies: 0,
      totalExpenses: 8990.00,
      totalKm: 34500,
      businessKm: 23450,
      businessPercentage: 68,
      deductibleAmount: 6113.20
    },

    // Part 5: Business-Use-of-Home Expenses
    homeExpenses: {
      utilities: 0,
      maintenance: 0,
      insurance: 0,
      mortgageInterest: 0,
      propertyTaxes: 0,
      rent: 0,
      totalExpenses: 0,
      workSpacePercentage: 0,
      deductibleAmount: 0
    },

    // Part 6: Summary
    totalExpenses: 12445.00,
    netBusinessIncome: 29905.00
  });

  const years = [2024, 2023, 2022, 2021];
  const provinceInfo = PROVINCES.find(p => p.id === province);
  const taxRate = getTaxRateDisplay(province);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const calculateTotals = () => {
    const totalExpenses = Object.values(formData.expenses).reduce((sum, val) => sum + val, 0) +
                         formData.vehicleExpenses.deductibleAmount +
                         formData.homeExpenses.deductibleAmount;
    
    const netIncome = formData.grossBusinessIncome - totalExpenses;

    setFormData(prev => ({
      ...prev,
      totalExpenses,
      netBusinessIncome: netIncome
    }));
  };

  const updateVehicleDeduction = () => {
    const deductible = formData.vehicleExpenses.totalExpenses * 
                      (formData.vehicleExpenses.businessPercentage / 100);
    
    setFormData(prev => ({
      ...prev,
      vehicleExpenses: {
        ...prev.vehicleExpenses,
        deductibleAmount: parseFloat(deductible.toFixed(2))
      }
    }));
  };

  const SectionHeader = ({ title, section, icon: Icon }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg mb-2"
    >
      <div className="flex items-center space-x-3">
        {Icon && <Icon size={20} className="text-primary-600" />}
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      {expandedSections[section] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
  );

  const InfoRow = ({ label, value, isTotal = false, format = 'currency' }) => (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className={`text-gray-600 ${isTotal ? 'font-semibold' : ''}`}>{label}</span>
      <span className={`${isTotal ? 'font-bold text-primary-600' : 'font-medium'}`}>
        {format === 'currency' ? `$${value.toFixed(2)}` : 
         format === 'percent' ? `${value}%` : 
         format === 'number' ? value : value}
      </span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">T2125 - Statement of Business Activities</h1>
          <p className="text-gray-500 mt-1">For self-employed individuals and gig workers</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Printer size={16} className="mr-2" />
            Print
          </Button>
          <Button variant="primary" size="sm">
            <Download size={16} className="mr-2" />
            Save as PDF
          </Button>
        </div>
      </div>

      {/* Year and Province Selector */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
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
        <div className="flex items-center space-x-2">
          <MapPin size={18} className="text-gray-400" />
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {PROVINCES.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tax Information Banner */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <div className="flex items-center">
          <Percent className="text-primary-600 mr-3" size={20} />
          <div>
            <p className="text-sm font-medium text-primary-800">
              Tax System: {provinceInfo?.taxSystem} | Rate: {taxRate}
            </p>
            <p className="text-xs text-primary-600 mt-1">
              This form calculates your net business income based on {provinceInfo?.name} tax rules.
              File this with your T1 income tax return.
            </p>
          </div>
        </div>
      </div>

      {/* Part 1 - Identification */}
      <Card>
        <SectionHeader title="Part 1 - Business Identification" section="identification" icon={Building} />
        {expandedSections.identification && (
          <Card.Body className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Business Name"
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                icon={<Building size={18} />}
              />
              <Input
                label="Business Number (BN)"
                value={formData.businessNumber}
                onChange={(e) => setFormData({...formData, businessNumber: e.target.value})}
                icon={<FileText size={18} />}
              />
              <div className="col-span-2">
                <Input
                  label="Business Address"
                  value={formData.businessAddress}
                  onChange={(e) => setFormData({...formData, businessAddress: e.target.value})}
                  icon={<Home size={18} />}
                />
              </div>
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
              <select
                value={province}
                onChange={(e) => {
                  setProvince(e.target.value);
                  setFormData({...formData, province: e.target.value});
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {PROVINCES.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <Input
                label="Postal Code"
                value={formData.postalCode}
                onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
              />
              <Input
                label="Main Product/Services"
                value={formData.mainProduct}
                onChange={(e) => setFormData({...formData, mainProduct: e.target.value})}
                className="col-span-2"
              />
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">GST/HST Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.gstRegistered}
                      onChange={(e) => setFormData({...formData, gstRegistered: e.target.checked})}
                      className="w-4 h-4 text-primary-500 rounded"
                    />
                    <span className="ml-2 text-sm">GST/HST Registered</span>
                  </label>
                </div>
                {formData.gstRegistered && (
                  <Input
                    label="GST/HST Number"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({...formData, gstNumber: e.target.value})}
                  />
                )}
              </div>
            </div>
          </Card.Body>
        )}
      </Card>

      {/* Part 2 - Income */}
      <Card>
        <SectionHeader title="Part 2 - Business Income" section="income" icon={DollarSign} />
        {expandedSections.income && (
          <Card.Body className="pt-4">
            <div className="space-y-3">
              <InfoRow label="Gross business income" value={formData.grossBusinessIncome} />
              <InfoRow label="Commissions paid to agents" value={formData.commissionsPaid} />
              <InfoRow label="Business use of home expenses (from Part 5)" value={formData.businessUseOfHome} />
              <InfoRow label="Other income" value={formData.otherIncome} />
              <div className="pt-3 mt-3 border-t-2 border-primary-500">
                <InfoRow label="Net income (loss)" value={formData.netIncome} isTotal />
              </div>
            </div>
          </Card.Body>
        )}
      </Card>

      {/* Part 3 - Business Expenses */}
      <Card>
        <SectionHeader title="Part 3 - Business Expenses" section="expenses" icon={Calculator} />
        {expandedSections.expenses && (
          <Card.Body className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="Advertising" value={formData.expenses.advertising} />
              <InfoRow label="Meals & entertainment (50%)" value={formData.expenses.mealsEntertainment} />
              <InfoRow label="Insurance" value={formData.expenses.insurance} />
              <InfoRow label="Interest" value={formData.expenses.interest} />
              <InfoRow label="Maintenance & repairs" value={formData.expenses.maintenance} />
              <InfoRow label="Management fees" value={formData.expenses.managementFees} />
              <InfoRow label="Office expenses" value={formData.expenses.officeExpenses} />
              <InfoRow label="Supplies" value={formData.expenses.supplies} />
              <InfoRow label="Legal & accounting" value={formData.expenses.legalAccounting} />
              <InfoRow label="Property taxes" value={formData.expenses.propertyTaxes} />
              <InfoRow label="Rent" value={formData.expenses.rent} />
              <InfoRow label="Salaries & wages" value={formData.expenses.salaries} />
              <InfoRow label="Travel" value={formData.expenses.travel} />
              <InfoRow label="Telephone & utilities" value={formData.expenses.telephoneUtilities} />
              <InfoRow label="Fuel" value={formData.expenses.fuel} />
              <InfoRow label="Delivery/freight" value={formData.expenses.delivery} />
              <InfoRow label="Professional fees" value={formData.expenses.professionalFees} />
              <InfoRow label="Other expenses" value={formData.expenses.otherExpenses} />
            </div>
          </Card.Body>
        )}
      </Card>

      {/* Part 4 - Motor Vehicle Expenses */}
      <Card>
        <SectionHeader title="Part 4 - Motor Vehicle Expenses" section="vehicle" icon={Car} />
        {expandedSections.vehicle && (
          <Card.Body className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="Fuel" value={formData.vehicleExpenses.fuel} />
              <InfoRow label="Maintenance & repairs" value={formData.vehicleExpenses.maintenance} />
              <InfoRow label="Insurance" value={formData.vehicleExpenses.insurance} />
              <InfoRow label="License & registration" value={formData.vehicleExpenses.licenseFees} />
              <InfoRow label="Lease payments" value={formData.vehicleExpenses.leasePayments} />
              <InfoRow label="Interest" value={formData.vehicleExpenses.interest} />
              <InfoRow label="Parking" value={formData.vehicleExpenses.parking} />
              <InfoRow label="Supplies" value={formData.vehicleExpenses.supplies} />
              <div className="col-span-2 pt-3 mt-3 border-t">
                <InfoRow label="Total vehicle expenses" value={formData.vehicleExpenses.totalExpenses} isTotal />
              </div>
            </div>

            {/* Business Use Calculation */}
            <div className="mt-4 p-4 bg-primary-50 rounded-lg">
              <h4 className="font-medium mb-3">Business Use Calculation</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-600">Total kilometers</label>
                  <input
                    type="number"
                    value={formData.vehicleExpenses.totalKm}
                    onChange={(e) => {
                      const totalKm = parseInt(e.target.value) || 0;
                      const businessKm = formData.vehicleExpenses.businessKm;
                      const percentage = totalKm > 0 ? (businessKm / totalKm) * 100 : 0;
                      setFormData({
                        ...formData,
                        vehicleExpenses: {
                          ...formData.vehicleExpenses,
                          totalKm,
                          businessPercentage: parseFloat(percentage.toFixed(1))
                        }
                      });
                      setTimeout(updateVehicleDeduction, 100);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Business kilometers</label>
                  <input
                    type="number"
                    value={formData.vehicleExpenses.businessKm}
                    onChange={(e) => {
                      const businessKm = parseInt(e.target.value) || 0;
                      const totalKm = formData.vehicleExpenses.totalKm;
                      const percentage = totalKm > 0 ? (businessKm / totalKm) * 100 : 0;
                      setFormData({
                        ...formData,
                        vehicleExpenses: {
                          ...formData.vehicleExpenses,
                          businessKm,
                          businessPercentage: parseFloat(percentage.toFixed(1))
                        }
                      });
                      setTimeout(updateVehicleDeduction, 100);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Business use %</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={formData.vehicleExpenses.businessPercentage}
                      onChange={(e) => {
                        const percentage = parseFloat(e.target.value) || 0;
                        setFormData({
                          ...formData,
                          vehicleExpenses: {
                            ...formData.vehicleExpenses,
                            businessPercentage: percentage
                          }
                        });
                        setTimeout(updateVehicleDeduction, 100);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <span className="ml-2">%</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Allowable vehicle expenses:</span>
                  <span className="text-xl font-bold text-primary-600">
                    ${formData.vehicleExpenses.deductibleAmount.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Based on {formData.vehicleExpenses.businessPercentage}% business use
                </p>
              </div>
            </div>
          </Card.Body>
        )}
      </Card>

      {/* Part 5 - Business-Use-of-Home Expenses */}
      <Card>
        <SectionHeader title="Part 5 - Business-Use-of-Home Expenses" section="homeOffice" icon={Home} />
        {expandedSections.homeOffice && (
          <Card.Body className="pt-4">
            <div className="p-4 bg-warning-50 rounded-lg mb-4">
              <div className="flex items-start">
                <AlertCircle size={18} className="text-warning-600 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-warning-700">
                  Only claim home office expenses if you regularly use the space for business (more than 50% of the time) and it's your principal place of business.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="Utilities" value={formData.homeExpenses.utilities} />
              <InfoRow label="Maintenance & repairs" value={formData.homeExpenses.maintenance} />
              <InfoRow label="Insurance" value={formData.homeExpenses.insurance} />
              <InfoRow label="Mortgage interest" value={formData.homeExpenses.mortgageInterest} />
              <InfoRow label="Property taxes" value={formData.homeExpenses.propertyTaxes} />
              <InfoRow label="Rent" value={formData.homeExpenses.rent} />
              <div className="col-span-2 pt-3 mt-3 border-t">
                <InfoRow label="Total home expenses" value={formData.homeExpenses.totalExpenses} isTotal />
              </div>
            </div>

            <div className="mt-4 p-4 bg-primary-50 rounded-lg">
              <h4 className="font-medium mb-3">Work Space Calculation</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-600">Work space percentage</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={formData.homeExpenses.workSpacePercentage}
                      onChange={(e) => {
                        const percentage = parseFloat(e.target.value) || 0;
                        const deductible = formData.homeExpenses.totalExpenses * (percentage / 100);
                        setFormData({
                          ...formData,
                          homeExpenses: {
                            ...formData.homeExpenses,
                            workSpacePercentage: percentage,
                            deductibleAmount: parseFloat(deductible.toFixed(2))
                          }
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="e.g., 15"
                    />
                    <span className="ml-2">%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Percentage of home used for business
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Deductible amount</label>
                  <div className="text-xl font-bold text-primary-600 mt-2">
                    ${formData.homeExpenses.deductibleAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        )}
      </Card>

      {/* Part 6 - Summary */}
      <Card className="bg-success-50 border-success-200">
        <SectionHeader title="Summary - Net Business Income" section="summary" icon={FileText} />
        {expandedSections.summary && (
          <Card.Body className="pt-4">
            <div className="space-y-3">
              <InfoRow label="Total business income" value={formData.grossBusinessIncome} />
              <InfoRow label="Total business expenses" value={formData.totalExpenses} />
              <div className="pt-4 mt-4 border-t-2 border-success-600">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Net business income</span>
                  <span className="text-2xl font-bold text-success-600">
                    ${formData.netBusinessIncome.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Report this amount on line 13500 of your T1 income tax return.
                  {formData.gstRegistered && (
                    <span className="block mt-1 text-primary-600">
                      Don't forget to file your GST/HST return separately.
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* CRA Filing Information */}
            <div className="mt-6 p-4 bg-white rounded-lg">
              <h4 className="font-medium mb-3 flex items-center">
                <FileText size={18} className="mr-2 text-primary-600" />
                CRA Filing Information
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-success-500 mr-2 mt-0.5" />
                  Keep all supporting documents for 6 years
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-success-500 mr-2 mt-0.5" />
                  File this form with your T1 income tax return by April 30
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-success-500 mr-2 mt-0.5" />
                  If self-employed, you have until June 15 to file, but taxes are still due April 30
                </li>
                {formData.gstRegistered && (
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-success-500 mr-2 mt-0.5" />
                    GST/HST returns must be filed quarterly/monthly - separate from T2125
                  </li>
                )}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => calculateTotals()}>
                <Calculator size={16} className="mr-2" />
                Recalculate
              </Button>
              <Button variant="primary" className="flex-1">
                <Download size={16} className="mr-2" />
                Download PDF
              </Button>
            </div>
          </Card.Body>
        )}
      </Card>

      {/* Help Text */}
      <Card className="bg-info-50 border-info-200">
        <Card.Body>
          <div className="flex items-start">
            <AlertCircle className="text-info-600 mr-3 flex-shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-info-700">About Form T2125</h4>
              <p className="text-sm text-info-600 mt-1">
                This form calculates your net business income for tax purposes. All amounts should be in Canadian dollars.
                Keep detailed records of all income and expenses. The CRA may request supporting documents.
              </p>
              <a 
                href="https://www.canada.ca/en/revenue-agency/services/forms-publications/tax-packages-years/general-income-tax-benefit-package/5000-c1.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-info-700 font-medium mt-2 hover:underline"
              >
                View official CRA T2125 form
              </a>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default T2125Form;







