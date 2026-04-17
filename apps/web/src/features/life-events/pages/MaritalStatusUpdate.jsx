import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Hash, Bell, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import { useLifeEvents } from '../hooks/useLifeEvents';

const MaritalStatusUpdate = () => {
  const navigate = useNavigate();
  const { updateMaritalStatus, loading } = useLifeEvents();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    status: 'married',
    effectiveDate: '',
    spouseName: '',
    spouseSin: '',
    spouseDob: '',
    shareAccess: false,
    accessLevel: 'read-only',
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
      await updateMaritalStatus(formData);
      setSuccess(true);
      setTimeout(() => navigate('/life-events'), 3000);
    } catch (error) {
      console.error('Failed to update:', error);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Card>
          <Card.Body className="text-center py-12">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Marital Status Updated!</h2>
            <p className="text-gray-600 mb-6">
              Your information has been saved. {formData.notifyCA && 'Your CA has been notified.'}
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
          <h2 className="text-2xl font-bold">Update Marital Status</h2>
          <p className="text-gray-500">
            This change affects spousal credits, income splitting, and your tax filing status.
          </p>
        </Card.Header>

        <Card.Body className="space-y-6">
          {/* Step 1: Select Status */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select New Status
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {['married', 'common-law'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFormData({...formData, status})}
                      className={`p-4 border-2 rounded-lg text-center capitalize ${
                        formData.status === status 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {status.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Effective Date"
                type="date"
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleChange}
                icon={<Calendar size={18} />}
                required
                max={new Date().toISOString().split('T')[0]}
              />

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Why this matters:</strong> The CRA uses this date to determine when 
                  spousal credits become applicable.
                </p>
              </div>
            </>
          )}

          {/* Step 2: Spouse Information */}
          {step === 2 && (
            <>
              <h3 className="font-semibold text-lg">Spouse/Partner Information</h3>
              
              <Input
                label="Full Legal Name"
                name="spouseName"
                value={formData.spouseName}
                onChange={handleChange}
                icon={<User size={18} />}
                required
              />
              
              <Input
                label="Social Insurance Number (SIN)"
                name="spouseSin"
                value={formData.spouseSin}
                onChange={handleChange}
                icon={<Hash size={18} />}
                type="password"
                required
              />
              
              <Input
                label="Date of Birth"
                type="date"
                name="spouseDob"
                value={formData.spouseDob}
                onChange={handleChange}
                icon={<Calendar size={18} />}
                required
              />

              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-sm text-amber-700">
                  <strong>Note:</strong> Your spouse's SIN is encrypted and stored separately. 
                  It will only be used for tax filing purposes with their consent.
                </p>
              </div>
            </>
          )}

          {/* Step 3: Privacy & Notifications */}
          {step === 3 && (
            <>
              <h3 className="font-semibold text-lg">Privacy & Notifications</h3>
              
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex-1">
                    <p className="font-medium">Share access to my vault</p>
                    <p className="text-sm text-gray-500">
                      Allow your spouse to view selected documents
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="shareAccess"
                    checked={formData.shareAccess}
                    onChange={handleChange}
                    className="ml-4 w-5 h-5"
                  />
                </label>

                {formData.shareAccess && (
                  <div className="ml-6 p-4 bg-gray-50 rounded-lg space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="accessLevel"
                        value="read-only"
                        checked={formData.accessLevel === 'read-only'}
                        onChange={handleChange}
                        className="mr-3"
                      />
                      <Eye size={18} className="text-gray-400 mr-2" />
                      <div>
                        <p className="font-medium">Read-only access</p>
                        <p className="text-xs text-gray-500">Can view documents, cannot edit or share</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="accessLevel"
                        value="full"
                        checked={formData.accessLevel === 'full'}
                        onChange={handleChange}
                        className="mr-3"
                      />
                      <EyeOff size={18} className="text-gray-400 mr-2" />
                      <div>
                        <p className="font-medium">Full access</p>
                        <p className="text-xs text-gray-500">Can view, comment, and share with their CA</p>
                      </div>
                    </label>
                  </div>
                )}

                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex-1">
                    <p className="font-medium">Notify my Chartered Accountant</p>
                    <p className="text-sm text-gray-500">
                      Your CA will be alerted to this change
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="notifyCA"
                    checked={formData.notifyCA}
                    onChange={handleChange}
                    className="ml-4 w-5 h-5"
                  />
                </label>
              </div>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Previous
              </Button>
            )}
            <div className="flex-1" />
            {step < 3 ? (
              <Button 
                variant="primary" 
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !formData.effectiveDate}
              >
                Next
              </Button>
            ) : (
              <Button 
                variant="success" 
                onClick={handleSubmit}
                loading={loading}
                disabled={!formData.spouseName || !formData.spouseSin}
              >
                Confirm & Update
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Step Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-3 h-3 rounded-full ${
              s === step ? 'bg-primary-500' : s < step ? 'bg-green-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default MaritalStatusUpdate;










