import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Home, Bell, CheckCircle, ArrowLeft } from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import { PROVINCES } from 'constants/provinces';
import { useLifeEvents } from '../hooks/useLifeEvents';

const ChangeAddress = () => {
  const navigate = useNavigate();
  const { updateAddress, loading } = useLifeEvents();
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    province: 'ON',
    postalCode: '',
    movedInDate: '',
    notifyCA: true,
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updateAddress(formData);
      setSuccess(true);
      setTimeout(() => navigate('/life-events'), 3000);
    } catch (error) {
      console.error('Failed to update address:', error);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Card>
          <Card.Body className="text-center py-12">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Address Updated!</h2>
            <p className="text-gray-600 mb-6">
              Your address has been updated. {formData.notifyCA && 'Your CA has been notified.'}
            </p>
            <Button variant="primary" onClick={() => navigate('/life-events')}>
              Return to Life Events
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  const selectedProvince = PROVINCES.find(p => p.id === formData.province);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <button
        onClick={() => navigate('/life-events')}
        className="flex items-center text-gray-600 hover:text-primary-600 mb-4"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Life Events
      </button>

      <Card>
        <Card.Header>
          <h2 className="text-2xl font-bold flex items-center">
            <MapPin className="mr-2 text-blue-500" size={28} />
            Change of Address
          </h2>
          <p className="text-gray-500">
            Moving to a new province affects your tax rates, health premiums, and credits.
          </p>
        </Card.Header>

        <Card.Body className="space-y-6">
          <Input
            label="Street Address"
            name="street"
            value={formData.street}
            onChange={handleChange}
            icon={<Home size={18} />}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                {PROVINCES.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="A1A 1A1"
            required
          />

          <Input
            label="Date Moved In"
            type="date"
            name="movedInDate"
            value={formData.movedInDate}
            onChange={handleChange}
            icon={<Calendar size={18} />}
            required
            max={new Date().toISOString().split('T')[0]}
          />

          {selectedProvince && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Tax Information for {selectedProvince.name}:</strong> {selectedProvince.taxSystem}<br />
                <span className="text-xs">
                  {selectedProvince.taxSystem === 'GST only' && `GST Rate: ${selectedProvince.gst}%`}
                  {selectedProvince.taxSystem === 'GST + PST' && `GST ${selectedProvince.gst}% + PST ${selectedProvince.pst}%`}
                  {selectedProvince.taxSystem === 'GST + QST' && `GST ${selectedProvince.gst}% + QST ${selectedProvince.qst}%`}
                  {selectedProvince.taxSystem === 'HST' && `HST Rate: ${selectedProvince.hst}%`}
                </span>
              </p>
            </div>
          )}

          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-100">
            <input
              type="checkbox"
              name="notifyCA"
              checked={formData.notifyCA}
              onChange={(e) => setFormData(prev => ({ ...prev, notifyCA: e.target.checked }))}
              className="mr-3 w-5 h-5"
            />
            <div>
              <p className="font-medium">Notify my Chartered Accountant</p>
              <p className="text-sm text-gray-500">Your CA will be alerted to update your provincial tax profile</p>
            </div>
          </label>

          <div className="flex justify-end pt-6 border-t">
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              loading={loading}
              disabled={!formData.street || !formData.city || !formData.postalCode || !formData.movedInDate}
            >
              Update Address
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChangeAddress;










