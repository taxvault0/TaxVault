import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, DollarSign, MessageCircle, Video, ArrowLeft } from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';

const ConsultationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock consultation data
  const consultation = {
    id: id,
    caName: 'Jane Smith, CA',
    caImage: null,
    date: '2024-03-20',
    time: '14:00',
    duration: 60,
    status: 'upcoming', // upcoming, completed, cancelled
    type: 'video', // video, phone, in-person
    topic: 'Tax Planning for Gig Workers',
    notes: 'Discuss Q1 earnings and estimated tax payments',
    amount: 150,
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    documents: [
      { name: 'Q1 Income Summary.pdf', size: '245 KB' },
      { name: 'Mileage Log.pdf', size: '128 KB' }
    ]
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'upcoming':
        return <Badge variant="info">Upcoming</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="warning">Cancelled</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/consultations')}
        className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Consultations
      </button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Consultation Details</h1>
        {getStatusBadge(consultation.status)}
      </div>

      {/* Main Info Card */}
      <Card>
        <Card.Body>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-2xl font-medium text-primary-700">
                  {consultation.caName.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{consultation.caName}</h2>
                <p className="text-gray-500">Chartered Accountant</p>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={16} className="mr-1 text-primary-500" />
                    {new Date(consultation.date).toLocaleDateString('en-CA', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock size={16} className="mr-1 text-primary-500" />
                    {consultation.time} ({consultation.duration} min)
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-600">${consultation.amount}</p>
              <p className="text-sm text-gray-500">Consultation fee</p>
            </div>
          </div>

          {consultation.status === 'upcoming' && consultation.type === 'video' && (
            <div className="mt-6 p-4 bg-primary-50 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <Video size={20} className="text-primary-500 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Video consultation link</p>
                  <a 
                    href={consultation.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:underline"
                  >
                    {consultation.meetingLink}
                  </a>
                </div>
              </div>
              <Button variant="primary" size="sm" onClick={() => window.open(consultation.meetingLink, '_blank')}>
                Join Meeting
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Consultation Details */}
        <Card className="md:col-span-2">
          <Card.Header>
            <h3 className="font-semibold">Consultation Details</h3>
          </Card.Header>
          <Card.Body className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Topic</p>
              <p className="font-medium">{consultation.topic}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Notes</p>
              <p className="text-gray-700">{consultation.notes}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Documents Shared</p>
              {consultation.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-3">
                      <span className="text-xs font-medium">PDF</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.size}</p>
                    </div>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700 text-sm">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Actions & Info */}
        <Card>
          <Card.Header>
            <h3 className="font-semibold">Actions</h3>
          </Card.Header>
          <Card.Body className="space-y-3">
            <Button variant="outline" fullWidth>
              <MessageCircle size={16} className="mr-2" />
              Message CA
            </Button>
            <Button variant="outline" fullWidth>
              <Calendar size={16} className="mr-2" />
              Reschedule
            </Button>
            {consultation.status === 'upcoming' && (
              <Button variant="danger" fullWidth>
                Cancel Consultation
              </Button>
            )}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Need help? Contact our support team at support@taxvault.ca
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ConsultationDetail;







