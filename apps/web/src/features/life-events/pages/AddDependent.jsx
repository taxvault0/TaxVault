import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Baby, Calendar, Hash, User, Bell, CheckCircle, ArrowLeft } from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import { useLifeEvents } from '../hooks/useLifeEvents';

const AddDependent = () => {
  const navigate = useNavigate();
  const { addDependent, loading } = useLifeEvents();
  const [formData, setFormData] = useState({
    name: '',
    sin: '',
    dateOfBirth: '',
    relationship: 'child',
    isClaimedForCCB: true,
    notifyCA: true,
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    try {
      await addDependent(formData);
      setSuccess(true);
      setTimeout(() => navigate('/life-events'), 3000);
    } catch (error) {
      console.error('Failed to add dependent:', error);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Card>
          <Card.Body className="text-center py-12">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Dependent Added!</h2>
            <p className="text-gray-600 mb-6">
              Your dependent has been added. {formData.notifyCA && 'Your CA has been notified to adjust CCB and other benefits.'}
            </p>
            <Button variant="primary" onClick={() => navigate('/life-events')}>
              Return to Life Events
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

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
            <Baby className="mr-2 text-green-500" size={28} />
            Add a Child / Dependent
          </h2>
          <p className="text-gray-500">
            Adding a dependent affects Canada Child Benefit (CCB), GST/HST credits, and childcare deductions.
          </p>
        </Card.Header>

        <Card.Body className="space-y-6">
          <Input
            label="Child's Full Legal Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            icon={<User size={18} />}
            required
          />

          <Input
            label="Social Insurance Number (SIN)"
            name="sin"
            value={formData.sin}
            onChange={handleChange}
            icon={<Hash size={18} />}
            type="password"
            required
          />

          <Input
            label="Date of Birth"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            icon={<Calendar size={18} />}
            required
            max={new Date().toISOString().split('T')[0]}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
            <select
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="child">Child</option>
              <option value="grandchild">Grandchild</option>
              <option value="other">Other Dependent</option>
            </select>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isClaimedForCCB"
                checked={formData.isClaimedForCCB}
                onChange={handleChange}
                className="mr-3 w-5 h-5"
              />
              <div>
                <p className="font-medium">Claim for Canada Child Benefit (CCB)</p>
                <p className="text-sm text-gray-600">
                  This will notify CRA to adjust your CCB payments
                </p>
              </div>
            </label>
          </div>

          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-100">
            <input
              type="checkbox"
              name="notifyCA"
              checked={formData.notifyCA}
              onChange={handleChange}
              className="mr-3 w-5 h-5"
            />
            <div>
              <p className="font-medium">Notify my Chartered Accountant</p>
              <p className="text-sm text-gray-500">Your CA will be alerted to adjust your filings</p>
            </div>
          </label>

          <div className="flex justify-end pt-6 border-t">
            <Button 
              variant="success" 
              onClick={handleSubmit}
              loading={loading}
              disabled={!formData.name || !formData.sin || !formData.dateOfBirth}
            >
              Add Dependent
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddDependent;










