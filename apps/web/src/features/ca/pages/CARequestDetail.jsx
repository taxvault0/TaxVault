import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  DollarSign,
  Video,
  MessageCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  FileText,
  Download,
  ArrowLeft,
  Send,
  User,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';
import Input from 'components/ui/Input';
import { useAuth } from '../../auth/context/AuthContext';

const CARequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Mock data - replace with API call
    setTimeout(() => {
      setRequest({
        id: id,
        clientName: 'Marcus Chen',
        clientEmail: 'marcus.chen@email.com',
        clientPhone: '(416) 555-0123',
        clientAvatar: 'MC',
        clientType: 'gig-worker',
        type: 'tax-planning',
        topic: '2024 Tax Planning for Gig Income',
        description: 'I drive for Uber and DoorDash full-time. Need help understanding what deductions I can claim, how to track expenses properly, and strategies to minimize my tax bill for 2024. Also have questions about whether I should incorporate.',
        duration: 30,
        caRate: 150,
        totalAmount: 82.50,
        urgency: 'medium',
        status: 'pending',
        preferredDates: ['2025-03-25', '2025-03-26', '2025-03-27'],
        preferredTimes: ['10:00', '14:00', '16:00'],
        timezone: 'America/Toronto',
        attachments: [
          { id: 1, name: '2023 Tax Return.pdf', size: '245 KB', url: '#' },
          { id: 2, name: 'Uber Summary 2023.pdf', size: '178 KB', url: '#' },
          { id: 3, name: 'Vehicle Expenses.xlsx', size: '156 KB', url: '#' }
        ],
        questions: [
          { question: 'What expenses can I deduct as a gig worker?', answer: null },
          { question: 'Should I register for GST/HST?', answer: null },
          { question: 'Is incorporation beneficial at my income level?', answer: null }
        ],
        createdAt: '2025-03-18T10:30:00'
      });

      setMessages([
        {
          id: 1,
          from: 'client',
          text: 'Hi, I have a few questions about my tax situation for 2024.',
          time: '2025-03-18T10:30:00',
          read: true
        },
        {
          id: 2,
          from: 'client',
          text: 'Ive attached my 2023 return and some documents for reference.',
          time: '2025-03-18T10:32:00',
          read: true
        }
      ]);

      setLoading(false);
    }, 1000);
  }, [id]);

  const getTypeLabel = (type) => {
    const types = {
      'tax-planning': 'Tax Planning',
      'audit-support': 'Audit Support',
      'business-structure': 'Business Structure',
      'gst-hst-advice': 'GST/HST Advice',
      'payroll-support': 'Payroll Support',
      'investment-tax': 'Investment Tax',
      'estate-planning': 'Estate Planning',
      'cross-border': 'Cross-Border',
      'general-advice': 'General Advice'
    };
    return types[type] || type;
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'urgent':
        return <Badge variant="error">Urgent</Badge>;
      case 'high':
        return <Badge variant="warning">High</Badge>;
      case 'medium':
        return <Badge variant="info">Medium</Badge>;
      default:
        return <Badge variant="success">Low</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const copyMeetingLink = () => {
    navigator.clipboard.writeText('https://meet.google.com/abc-defg-hij');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const newMessage = {
      id: messages.length + 1,
      from: 'ca',
      text: message,
      time: new Date().toISOString(),
      read: false
    };
    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const handleAccept = () => {
    setShowScheduleModal(true);
  };

  const handleSchedule = () => {
    // API call would go here
    alert(`Scheduled for ${selectedDate} at ${selectedTime}`);
    setShowScheduleModal(false);
    navigate(`/ca/requests/${id}`);
  };

  const ScheduleModal = () => {
    if (!showScheduleModal) return null;

    const dates = ['2025-03-25', '2025-03-26', '2025-03-27', '2025-03-28', '2025-03-29'];
    const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowScheduleModal(false)} />

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Schedule Consultation</h3>
                <button onClick={() => setShowScheduleModal(false)} className="text-gray-400 hover:text-gray-500">
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {dates.map((date) => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`p-2 text-sm rounded-lg border ${
                          selectedDate === date
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {new Date(date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {times.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 text-sm rounded-lg border ${
                          selectedTime === time
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Client's preferred dates: {request?.preferredDates.map(d => 
                      new Date(d).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
                    ).join(', ')}
                  </p>
                </div>

                <div className="flex space-x-3 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowScheduleModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSchedule}
                    className="flex-1"
                    disabled={!selectedDate || !selectedTime}
                  >
                    Confirm Schedule
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading request details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/ca/requests')}
        className="flex items-center text-gray-600 hover:text-primary-600"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Requests
      </button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Consultation Request</h1>
          <p className="text-gray-500 mt-1">ID: {id}</p>
        </div>
        {request.status === 'pending' && (
          <div className="flex space-x-3">
            <Button variant="success" onClick={handleAccept}>
              Accept Request
            </Button>
            <Button variant="outline">
              Decline
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Client Info & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Info */}
          <Card>
            <Card.Body>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-600">
                      {request.clientAvatar}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-bold">{request.clientName}</h2>
                    <p className="text-gray-500 capitalize">{request.clientType?.replace('-', ' ')}</p>
                    <div className="flex items-center mt-1 space-x-3">
                      <a href={`mailto:${request.clientEmail}`} className="text-sm text-primary-600 hover:underline flex items-center">
                        <Mail size={14} className="mr-1" />
                        Email
                      </a>
                      <a href={`tel:${request.clientPhone}`} className="text-sm text-primary-600 hover:underline flex items-center">
                        <Phone size={14} className="mr-1" />
                        Call
                      </a>
                    </div>
                  </div>
                </div>
                {getUrgencyBadge(request.urgency)}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Consultation Type</p>
                  <p className="font-medium">{getTypeLabel(request.type)}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-medium">{request.duration} minutes</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Your Rate</p>
                  <p className="font-medium">{formatCurrency(request.caRate)}/hr</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Total Fee</p>
                  <p className="font-medium text-primary-600">{formatCurrency(request.totalAmount)}</p>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Request Details */}
          <Card>
            <Card.Header>
              <h3 className="font-medium">Request Details</h3>
            </Card.Header>
            <Card.Body>
              <h4 className="font-semibold text-gray-900 mb-2">{request.topic}</h4>
              <p className="text-gray-700 mb-4">{request.description}</p>

              <div className="space-y-3">
                <h5 className="font-medium text-sm">Client's Questions:</h5>
                {request.questions.map((q, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium">{q.question}</p>
                    {q.answer && (
                      <p className="text-sm text-gray-600 mt-1">{q.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Attachments */}
          {request.attachments.length > 0 && (
            <Card>
              <Card.Header>
                <h3 className="font-medium">Attached Documents</h3>
              </Card.Header>
              <Card.Body>
                <div className="space-y-2">
                  {request.attachments.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.url}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <FileText size={16} className="text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.size}</p>
                        </div>
                      </div>
                      <Download size={16} className="text-gray-400" />
                    </a>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}
        </div>

        {/* Right Column - Scheduling & Messages */}
        <div className="space-y-6">
          {/* Scheduling Info */}
          <Card>
            <Card.Header>
              <h3 className="font-medium">Preferred Times</h3>
            </Card.Header>
            <Card.Body>
              <p className="text-sm text-gray-600 mb-3">
                Client's preferred dates and times:
              </p>
              <div className="space-y-2">
                {request.preferredDates.map((date, idx) => (
                  <div key={idx} className="p-2 bg-gray-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar size={14} className="text-gray-400 mr-2" />
                      <span className="text-sm">
                        {new Date(date).toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <span className="text-sm text-primary-600">
                      {request.preferredTimes[idx] || request.preferredTimes[0]}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Timezone: {request.timezone}
              </p>
            </Card.Body>
          </Card>

          {/* Meeting Link (if scheduled) */}
          {request.status === 'scheduled' && (
            <Card>
              <Card.Header>
                <h3 className="font-medium">Meeting Details</h3>
              </Card.Header>
              <Card.Body>
                <div className="p-3 bg-primary-50 rounded-lg mb-3">
                  <p className="text-sm font-medium">Scheduled for:</p>
                  <p className="text-lg font-bold text-primary-700">March 25, 2025 at 2:00 PM</p>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Video size={16} className="text-primary-500 mr-2" />
                    <span className="text-sm font-medium">Meeting Link</span>
                  </div>
                  <button
                    onClick={copyMeetingLink}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <a
                  href="https://meet.google.com/abc-defg-hij"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block w-full"
                >
                  <Button variant="primary" className="w-full">
                    <Video size={16} className="mr-2" />
                    Join Meeting
                  </Button>
                </a>
              </Card.Body>
            </Card>
          )}

          {/* Messages */}
          <Card>
            <Card.Header>
              <h3 className="font-medium">Messages</h3>
            </Card.Header>
            <Card.Body>
              <div className="h-64 overflow-y-auto mb-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.from === 'ca' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${
                        msg.from === 'ca'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  variant="primary"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <Send size={16} />
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      <ScheduleModal />
    </div>
  );
};

export default CARequestDetail;







