import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Mail, Phone, Users, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import { useLifeEvents } from '../hooks/useLifeEvents';

const LegacyContact = () => {
  const navigate = useNavigate();
  const { setLegacyContact, loading } = useLifeEvents();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    relationship: '',
    accessLevel: 'read-only',
  });
  const [success, setSuccess] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await setLegacyContact(formData);
      setSuccess(true);
    } catch (error) {
      console.error('Failed to set legacy contact:', error);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Card>
          <Card.Body className="text-center py-12">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Legacy Contact Set!</h2>
            <p className="text-gray-600 mb-6">
              {formData.name} has been designated as your legacy contact. They will receive instructions
              on how to access your tax documents in case of emergency.
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
            <Shield className="mr-2 text-purple-500" size={28} />
            Legacy Contact / Executor Access
          </h2>
          <p className="text-gray-500">
            Designate someone to manage your tax documents in case of emergency or death.
          </p>
        </Card.Header>

        <Card.Body className="space-y-6">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-4">
            <div className="flex items-start">
              <AlertCircle className="text-purple-600 mr-3 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="text-sm font-medium text-purple-700">What is a Legacy Contact?</p>
                <p className="text-xs text-purple-600 mt-1">
                  A legacy contact is someone you trust who can request access to your tax documents
                  in case of death or incapacitation. They will need to provide verification before access is granted.
                </p>
              </div>
            </div>
          </div>

          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            icon={<User size={18} />}
            required
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            icon={<Mail size={18} />}
            required
          />

          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            icon={<Phone size={18} />}
            placeholder="(416) 555-0123"
            required
          />

          <Input
            label="Relationship"
            name="relationship"
            value={formData.relationship}
            onChange={handleChange}
            icon={<Users size={18} />}
            placeholder="e.g., Spouse, Child, Executor"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
            <select
              name="accessLevel"
              value={formData.accessLevel}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="read-only">Read-only (Can view documents only)</option>
              <option value="download">Download (Can view and download)</option>
              <option value="full">Full access (Can view, download, and share)</option>
            </select>
          </div>

          {!confirmDialog ? (
            <Button 
              variant="primary" 
              onClick={() => setConfirmDialog(true)}
              className="w-full"
              disabled={!formData.name || !formData.email || !formData.phone || !formData.relationship}
            >
              Set Legacy Contact
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Confirm:</strong> Are you sure you want to designate {formData.name} as your legacy contact?
                  They will have {formData.accessLevel === 'read-only' ? 'read-only' : formData.accessLevel === 'download' ? 'download' : 'full'} access
                  to your tax documents upon verification.
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setConfirmDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  variant="success" 
                  onClick={handleSubmit}
                  loading={loading}
                  className="flex-1"
                >
                  Confirm
                </Button>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default LegacyContact;










