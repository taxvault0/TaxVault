import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, AlertTriangle, Link2, UserPlus, CheckCircle, ArrowLeft } from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import { useLifeEvents } from '../hooks/useLifeEvents';

const SeparationDivorce = () => {
  const navigate = useNavigate();
  const { unlinkSpouse, loading } = useLifeEvents();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    effectiveDate: '',
    unlinkData: true,
    spouseEmail: '',
    spouseAction: 'notify',
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
      await unlinkSpouse(formData);
      setSuccess(true);
    } catch (error) {
      console.error('Failed to unlink:', error);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Card>
          <Card.Body className="text-center py-12">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Status Updated Successfully</h2>
            <p className="text-gray-600 mb-6">
              Your marital status has been updated. Your financial data has been unlinked from your former spouse.
              {formData.notifyCA && ' Your CA has been notified.'}
            </p>
            <div className="space-y-3">
              {formData.spouseAction === 'new-account' && formData.spouseEmail && (
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/register', { state: { email: formData.spouseEmail } })}
                  className="w-full"
                >
                  <UserPlus size={16} className="mr-2" />
                  Create Account for Former Spouse
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate('/life-events')} className="w-full">
                Return to Life Events
              </Button>
            </div>
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
          <h2 className="text-2xl font-bold text-red-700">Separation / Divorce</h2>
          <p className="text-gray-600">
            This action will update your tax profile and unlink your financial data from your former spouse.
          </p>
        </Card.Header>

        <Card.Body className="space-y-6">
          {step === 1 && (
            <>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-start">
                  <AlertTriangle className="text-red-600 mr-3 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-red-700">Important: Data Separation</p>
                    <p className="text-sm text-red-600">
                      Unlinking data is permanent. Your former spouse will lose all access to your vault. 
                      You should both review what shared documents you need before proceeding.
                    </p>
                  </div>
                </div>
              </div>

              <Input
                label="Effective Date of Separation"
                type="date"
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleChange}
                icon={<Calendar size={18} />}
                required
                max={new Date().toISOString().split('T')[0]}
              />
              <p className="text-xs text-gray-500 -mt-2">
                This date is critical for CRA to determine when spousal credits and obligations cease.
              </p>

              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  name="unlinkData"
                  checked={formData.unlinkData}
                  onChange={handleChange}
                  className="mr-3"
                />
                <div>
                  <p className="font-medium">Unlink my data from my former spouse</p>
                  <p className="text-sm text-gray-500">They will no longer have access to your files.</p>
                </div>
              </label>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="font-semibold text-lg">Help your former spouse get started</h3>
              
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg">
                  <input
                    type="radio"
                    name="spouseAction"
                    value="notify"
                    checked={formData.spouseAction === 'notify'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium">Notify them to create their own account</p>
                    <p className="text-sm text-gray-500">We'll send an email with instructions</p>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded-lg">
                  <input
                    type="radio"
                    name="spouseAction"
                    value="new-account"
                    checked={formData.spouseAction === 'new-account'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium">Create a new account for them now</p>
                    <p className="text-sm text-gray-500">They can claim shared documents later</p>
                  </div>
                </label>

                {formData.spouseAction === 'new-account' && (
                  <Input
                    label="Spouse's Email"
                    type="email"
                    name="spouseEmail"
                    value={formData.spouseEmail}
                    onChange={handleChange}
                    placeholder="spouse@email.com"
                    className="mt-3"
                    required
                  />
                )}
              </div>

              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-100 mt-4">
                <input
                  type="checkbox"
                  name="notifyCA"
                  checked={formData.notifyCA}
                  onChange={handleChange}
                  className="mr-3"
                />
                <div>
                  <p className="font-medium">Notify my Chartered Accountant</p>
                  <p className="text-sm text-gray-500">Your CA will be alerted to this change</p>
                </div>
              </label>
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
            {step < 2 ? (
              <Button 
                variant="primary" 
                onClick={() => setStep(step + 1)}
                disabled={!formData.effectiveDate}
              >
                Next
              </Button>
            ) : (
              <Button 
                variant="warning" 
                onClick={handleSubmit}
                loading={loading}
              >
                <Link2 size={16} className="mr-2" />
                Confirm & Unlink
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Step Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-primary-500' : 'bg-gray-300'}`} />
        <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-primary-500' : 'bg-gray-300'}`} />
      </div>
    </div>
  );
};

export default SeparationDivorce;










