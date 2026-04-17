import React, { useState } from 'react';
import { Calculator, Percent, Car, AlertCircle, Save, MapPin } from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import { PROVINCES } from 'constants/provinces';

const BusinessUseCalculator = () => {
  const [method, setMethod] = useState('estimate');
  const [businessPercentage, setBusinessPercentage] = useState(70);
  const [totalKm, setTotalKm] = useState('');
  const [businessKm, setBusinessKm] = useState('');
  const [personalKm, setPersonalKm] = useState('');
  const [province, setProvince] = useState('ON');
  const [vehicleType, setVehicleType] = useState('car');

  const calculateFromLogs = () => {
    alert('This will use your actual mileage logs');
  };

  const savePercentage = () => {
    alert('Business use percentage saved successfully!');
  };

  const calculatedPercentage = totalKm && businessKm
    ? ((parseFloat(businessKm) / parseFloat(totalKm)) * 100).toFixed(1)
    : 0;

  // CRA mileage rates by province (2024)
  const mileageRates = {
    'AB': 0.61,
    'BC': 0.61,
    'MB': 0.61,
    'NB': 0.61,
    'NL': 0.61,
    'NS': 0.61,
    'ON': 0.61,
    'PE': 0.61,
    'QC': 0.61,
    'SK': 0.61,
    'NT': 0.64,
    'NU': 0.64,
    'YT': 0.64
  };

  const currentRate = mileageRates[province] || 0.61;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Use Calculator</h1>
          <p className="text-gray-500 mt-1">Calculate your vehicle business use percentage</p>
        </div>
      </div>

      {/* Province Selector */}
      <Card className="bg-primary-50 border-primary-200">
        <Card.Body>
          <div className="flex items-center">
            <MapPin className="text-primary-500 mr-3" size={20} />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Your Province
              </label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {PROVINCES.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">
                CRA Mileage Rate for {PROVINCES.find(p => p.id === province)?.name}: ${currentRate}/km
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* CRA Notice */}
      <Card className="bg-warning-50 border-warning-200">
        <Card.Body>
          <div className="flex items-start">
            <AlertCircle className="text-warning-600 mr-3 flex-shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-warning-700">Why This Matters</h4>
              <p className="text-sm text-warning-600 mt-1">
                The CRA requires you to track business vs personal use of your vehicle. 
                This percentage determines how much of your vehicle expenses you can deduct.
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Method Selection */}
      <Card>
        <Card.Body>
          <h3 className="font-semibold mb-4">Calculation Method</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => setMethod('estimate')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                method === 'estimate'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <Percent className={`mx-auto mb-2 ${
                method === 'estimate' ? 'text-primary-500' : 'text-gray-400'
              }`} size={24} />
              <p className={`font-medium ${
                method === 'estimate' ? 'text-primary-700' : 'text-gray-600'
              }`}>Estimate</p>
            </button>

            <button
              onClick={() => setMethod('manual')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                method === 'manual'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <Calculator className={`mx-auto mb-2 ${
                method === 'manual' ? 'text-primary-500' : 'text-gray-400'
              }`} size={24} />
              <p className={`font-medium ${
                method === 'manual' ? 'text-primary-700' : 'text-gray-600'
              }`}>Manual</p>
            </button>

            <button
              onClick={() => setMethod('logs')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                method === 'logs'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <Car className={`mx-auto mb-2 ${
                method === 'logs' ? 'text-primary-500' : 'text-gray-400'
              }`} size={24} />
              <p className={`font-medium ${
                method === 'logs' ? 'text-primary-700' : 'text-gray-600'
              }`}>From Logs</p>
            </button>
          </div>
        </Card.Body>
      </Card>

      {/* Calculator Content */}
      <Card>
        <Card.Body>
          {method === 'estimate' && (
            <div className="space-y-6">
              <h3 className="font-semibold">Estimated Business Use</h3>
              
              <div className="text-center">
                <p className="text-5xl font-bold text-primary-600">{businessPercentage}%</p>
                <p className="text-gray-500 mt-2">of vehicle use is for business</p>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={businessPercentage}
                onChange={(e) => setBusinessPercentage(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />

              <p className="text-sm text-gray-500">
                Drag the slider to estimate your business use percentage based on your typical driving pattern.
              </p>
            </div>
          )}

          {method === 'manual' && (
            <div className="space-y-4">
              <h3 className="font-semibold">Manual Calculation</h3>
              
              <Input
                label="Total Kilometers (Year to Date)"
                type="number"
                value={totalKm}
                onChange={(e) => setTotalKm(e.target.value)}
                placeholder="Enter total km"
              />

              <Input
                label="Business Kilometers"
                type="number"
                value={businessKm}
                onChange={(e) => setBusinessKm(e.target.value)}
                placeholder="Enter business km"
              />

              <Input
                label="Personal Kilometers"
                type="number"
                value={personalKm}
                onChange={(e) => setPersonalKm(e.target.value)}
                placeholder="Enter personal km"
              />

              {totalKm && businessKm && (
                <div className="mt-4 p-4 bg-primary-50 rounded-lg">
                  <p className="text-sm text-gray-600">Calculated Business Use</p>
                  <p className="text-3xl font-bold text-primary-600">{calculatedPercentage}%</p>
                </div>
              )}
            </div>
          )}

          {method === 'logs' && (
            <div className="text-center py-8">
              <Car size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Use Your Mileage Logs</h3>
              <p className="text-gray-500 mb-6">
                You need to track at least 30 days of trips to calculate accurately
              </p>
              <Button onClick={calculateFromLogs}>
                Use My Mileage Logs
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Impact on Deductions */}
      <Card>
        <Card.Header>
          <h3 className="font-semibold">Impact on Deductions</h3>
        </Card.Header>
        <Card.Body>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Vehicle Expenses (estimated)</span>
              <span className="font-semibold">$8,500/year</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Business Use</span>
              <span className="font-semibold text-primary-600">{businessPercentage}%</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between">
                <span className="font-semibold">Deductible Amount</span>
                <span className="text-xl font-bold text-success-600">
                  ${((8500 * businessPercentage) / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            *Based on estimated annual vehicle expenses. Track your actual expenses for accurate calculations.
          </p>
        </Card.Body>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={savePercentage}>
          <Save size={16} className="mr-2" />
          Save Business Use Percentage
        </Button>
      </div>
    </div>
  );
};

export default BusinessUseCalculator;







