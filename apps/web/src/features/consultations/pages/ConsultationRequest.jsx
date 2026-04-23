import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  FileText,
  Check,
  ChevronLeft,
  Shield,
  Star,
  Calendar,
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Badge from 'components/ui/Badge';
import { consultationService } from '../services/consultationService';
import { documentAPI } from 'services/api';
import { useAuth } from '../../auth/context/AuthContext';

const getUserTaxProfile = (user) => {
  if (user?.taxProfile) return user.taxProfile;

  return {
    employment:
      user?.userType === 'employee' ||
      user?.userType === 'regular' ||
      !user?.userType,
    gigWork: user?.userType === 'gig-worker',
    selfEmployment:
      user?.userType === 'self-employed' ||
      user?.userType === 'contractor',
    incorporatedBusiness:
      user?.userType === 'Business-owner' ||
      user?.userType === 'small-business' ||
      user?.userType === 'business',
  };
};

const ConsultationRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { caId } = useParams();
  const { user } = useAuth();

  const taxProfile = getUserTaxProfile(user);

  const [loading, setLoading] = useState(false);
  const [caProfile, setCaProfile] = useState(null);
  const [step, setStep] = useState(1);
  const [availableDocs, setAvailableDocs] = useState([]);

  const [formData, setFormData] = useState({
    type: '',
    duration: 30,
    urgency: 'medium',
    topic: '',
    description: '',
    preferredDates: location.state?.date ? [location.state.date] : [],
    selectedDate: location.state?.date || '',
    selectedTime: location.state?.time || '',
    attachments: [],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  useEffect(() => {
    loadCAProfile();
    loadDocuments();
  }, [caId]);

  const loadCAProfile = async () => {
    try {
      setCaProfile({
        id: caId,
        name: 'David Chen, CPA',
        firm: 'Chen & Associates',
        rating: 4.9,
        reviewCount: 124,
        rates: {
          'employment-review': 120,
          'tax-planning': 150,
          'audit-support': 200,
          'business-structure': 175,
          'gst-hst-advice': 120,
          'payroll-support': 130,
          'investment-tax': 160,
          'estate-planning': 180,
          'cross-border': 220,
          'general-advice': 100,
        },
      });
    } catch (error) {
      console.error('Error loading CA profile:', error);
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await documentAPI.getDocuments();

      const docs = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.documents)
        ? response.data.documents
        : Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

      setAvailableDocs(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
      setAvailableDocs([]);
    }
  };

  const consultationTypes = useMemo(() => {
    const base = [
      { value: 'tax-planning', label: 'Tax Planning & Strategy', icon: '💰' },
      { value: 'audit-support', label: 'Audit Support', icon: '🔍' },
      { value: 'investment-tax', label: 'Investment Tax Planning', icon: '📈' },
      { value: 'estate-planning', label: 'Estate Planning', icon: '📜' },
      { value: 'cross-border', label: 'Cross-Border Taxation', icon: '🌍' },
      { value: 'general-advice', label: 'General Tax Advice', icon: '💬' },
    ];

    if (taxProfile.employment) {
      base.unshift({
        value: 'employment-review',
        label: 'Employment Return Review',
        icon: '🧾',
      });
    }

    if (taxProfile.gigWork || taxProfile.selfEmployment) {
      base.push({
        value: 'gst-hst-advice',
        label: 'GST/HST Advice',
        icon: '📊',
      });
    }

    if (taxProfile.incorporatedBusiness) {
      base.push({
        value: 'business-structure',
        label: 'Business Structure Advice',
        icon: '🏢',
      });
      base.push({
        value: 'payroll-support',
        label: 'Payroll Support',
        icon: '👥',
      });
    }

    return base;
  }, [taxProfile]);

  const durations = [15, 30, 45, 60, 90];

  const calculateTotal = () => {
    if (!caProfile || !formData.type) {
      return { subtotal: 0, fee: 0, total: 0 };
    }

    const rate = caProfile.rates[formData.type] || 100;
    const durationRate = rate * (formData.duration / 60);
    const platformFee = durationRate * 0.1;

    return {
      subtotal: durationRate,
      fee: platformFee,
      total: durationRate + platformFee,
    };
  };

  const pricing = calculateTotal();

  const profileSummary = [
    taxProfile.employment && 'Employment',
    taxProfile.gigWork && 'Gig Work',
    taxProfile.selfEmployment && 'Self-Employment',
    taxProfile.incorporatedBusiness && 'Business / Corporation',
  ].filter(Boolean);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const requestData = {
        ...formData,
        caId,
        estimatedTotal: pricing.total,
        taxProfile,
        businessName: user?.businessName || '',
        clientName: user?.name || '',
      };

      const response = await consultationService.createRequest(requestData);
      navigate(`/consultations/${response?.data?.id || 'new-request'}`);
    } catch (error) {
      console.error('Error creating request:', error);
    } finally {
      setLoading(false);
    }
  };

  const Step1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Select Consultation Type</h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {consultationTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setFormData({ ...formData, type: type.value })}
            className={`rounded-lg border-2 p-4 text-left transition-all ${
              formData.type === type.value
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300'
            }`}
          >
            <span className="mb-2 block text-2xl">{type.icon}</span>
            <h4 className="font-medium">{type.label}</h4>
            {caProfile?.rates[type.value] && (
              <p className="mt-1 text-sm text-gray-600">
                ${caProfile.rates[type.value]}/hour
              </p>
            )}
          </button>
        ))}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Duration
        </label>
        <div className="flex flex-wrap gap-2">
          {durations.map((d) => (
            <button
              key={d}
              onClick={() => setFormData({ ...formData, duration: d })}
              className={`rounded-lg px-4 py-2 font-medium ${
                formData.duration === d
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {d} min
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Urgency
        </label>
        <div className="flex space-x-2">
          {[
            { value: 'low', label: 'Low', icon: '😊' },
            { value: 'medium', label: 'Medium', icon: '😐' },
            { value: 'high', label: 'High', icon: '😟' },
            { value: 'urgent', label: 'Urgent', icon: '🚨' },
          ].map((u) => (
            <button
              key={u.value}
              onClick={() => setFormData({ ...formData, urgency: u.value })}
              className={`flex-1 rounded-lg border-2 p-3 ${
                formData.urgency === u.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="mb-1 block text-center">{u.icon}</span>
              <span className="text-sm font-medium">{u.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const Step2 = () => {
    const docs = Array.isArray(availableDocs) ? availableDocs : [];

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Describe Your Question</h3>

        <Card className="border-primary-100 bg-primary-50">
          <Card.Body>
            <p className="text-sm font-medium text-primary-800">Your tax profile</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {profileSummary.map((item) => (
                <Badge key={item} variant="info">
                  {item}
                </Badge>
              ))}
            </div>
            {user?.businessName && (
              <p className="mt-3 text-sm text-primary-700">
                Business: {user.businessName}
              </p>
            )}
          </Card.Body>
        </Card>

        <Input
          label="Topic / Subject"
          placeholder="e.g., Employment + gig income planning for 2026"
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Detailed Description
          </label>
          <textarea
            rows="5"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Describe your question, tax situation, deadlines, and what help you need..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {(formData.selectedDate || formData.selectedTime) && (
          <Card className="border-green-100 bg-green-50">
            <Card.Body>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2 text-green-600" />
                <p className="text-sm text-green-700">
                  Selected slot: {formData.selectedDate || '—'} {formData.selectedTime || ''}
                </p>
              </div>
            </Card.Body>
          </Card>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Attach Relevant Documents (Optional)
          </label>

          {docs.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
              No documents available to attach yet.
            </div>
          ) : (
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {docs.map((doc) => {
                const docId = doc.id || doc._id;
                const docName = doc.name || doc.fileName || doc.originalName || 'Document';

                return (
                  <label
                    key={docId}
                    className="flex cursor-pointer items-center rounded-lg border p-3 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      className="mr-3"
                      checked={formData.attachments.includes(docId)}
                      onChange={(e) => {
                        const newAttachments = e.target.checked
                          ? [...formData.attachments, docId]
                          : formData.attachments.filter((id) => id !== docId);

                        setFormData({ ...formData, attachments: newAttachments });
                      }}
                    />
                    <FileText size={16} className="mr-2 text-gray-400" />
                    <span className="text-sm">{docName}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const Step3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Review & Confirm</h3>

      <Card className="border-primary-200 bg-primary-50">
        <Card.Body>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <span className="text-xl font-bold text-primary-600">
                  {caProfile?.name?.charAt(0)}
                </span>
              </div>
              <div className="ml-3">
                <h4 className="font-semibold">{caProfile?.name}</h4>
                <p className="text-sm text-gray-600">{caProfile?.firm}</p>
                <div className="mt-1 flex items-center">
                  <Star size={14} className="fill-current text-gold" />
                  <span className="ml-1 text-xs">
                    {caProfile?.rating} ({caProfile?.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>
            <Badge variant="info">Verified CA</Badge>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Consultation Type:</span>
              <span className="font-medium">
                {consultationTypes.find((t) => t.value === formData.type)?.label}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{formData.duration} minutes</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Urgency:</span>
              <span className="font-medium capitalize">{formData.urgency}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Profiles:</span>
              <span className="font-medium">{profileSummary.join(', ')}</span>
            </div>
            {formData.topic && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Topic:</span>
                <span className="font-medium">{formData.topic}</span>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h4 className="font-medium">Price Breakdown</h4>
        </Card.Header>
        <Card.Body className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">
              CA Fee ({formData.duration} min @ ${caProfile?.rates?.[formData.type]}/hr)
            </span>
            <span className="font-medium">${pricing.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Platform Fee (10%)</span>
            <span className="font-medium">${pricing.fee.toFixed(2)}</span>
          </div>
          <div className="mt-3 border-t pt-3">
            <div className="flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold text-primary-600">
                ${pricing.total.toFixed(2)}
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>

      <div className="rounded-lg bg-blue-50 p-4">
        <div className="flex items-start">
          <Shield className="mr-3 mt-1 flex-shrink-0 text-blue-600" size={18} />
          <div>
            <p className="text-sm font-medium text-blue-700">Secure Payment</p>
            <p className="mt-1 text-xs text-blue-600">
              You will only be charged after the CA accepts your consultation request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-gray-600 hover:text-primary-600"
      >
        <ChevronLeft size={20} className="mr-1" />
        Back
      </button>

      <Card>
        <Card.Header>
          <h2 className="text-2xl font-bold">Request Consultation</h2>
          <p className="mt-1 text-gray-500">
            Schedule a paid consultation with {caProfile?.name}
          </p>
        </Card.Header>

        <Card.Body>
          <div className="mb-8 flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    step >= s ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > s ? <Check size={16} /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`mx-2 h-1 w-16 ${
                      step > s ? 'bg-primary-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}

          <div className="mt-8 flex justify-between border-t pt-6">
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
                disabled={step === 1 && !formData.type}
              >
                Next Step
              </Button>
            ) : (
              <Button
                variant="success"
                onClick={handleSubmit}
                loading={loading}
                disabled={!formData.topic}
              >
                Submit Request
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ConsultationRequest;