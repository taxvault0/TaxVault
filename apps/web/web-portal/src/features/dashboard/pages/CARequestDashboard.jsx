import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageCircle,
  Video,
  Filter,
  ChevronRight,
  Loader,
  TrendingUp,
  Users,
  Star,
  Zap,
  Search
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';
import Input from 'components/ui/Input';
import { useAuth } from '../../auth/context/AuthContext';

const CARequestDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    pending: 0,
    scheduled: 0,
    completed: 0,
    earnings: 0
  });

  useEffect(() => {
    loadRequests();
  }, [filter]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      // Mock data - replace with API call
      setTimeout(() => {
        const mockRequests = [
          {
            id: 1,
            clientName: 'Marcus Chen',
            clientEmail: 'marcus.chen@email.com',
            clientAvatar: 'MC',
            type: 'tax-planning',
            topic: '2024 Tax Planning for Gig Income',
            description: 'Need help understanding deductions for Uber driving and how to optimize my tax situation.',
            duration: 30,
            caRate: 150,
            urgency: 'medium',
            status: 'pending',
            preferredDates: ['2025-03-25', '2025-03-26', '2025-03-27'],
            createdAt: '2025-03-18T10:30:00',
            attachments: 2
          },
          {
            id: 2,
            clientName: 'Priya Sharma',
            clientEmail: 'priya.sharma@email.com',
            clientAvatar: 'PS',
            type: 'business-structure',
            topic: 'Incorporation Advice for IT Consulting',
            description: 'Looking to incorporate my IT consulting business. Need advice on timing and structure.',
            duration: 60,
            caRate: 175,
            urgency: 'high',
            status: 'pending',
            preferredDates: ['2025-03-24', '2025-03-25'],
            createdAt: '2025-03-17T14:15:00',
            attachments: 1
          },
          {
            id: 3,
            clientName: 'Mike Thompson',
            clientEmail: 'mike.thompson@email.com',
            clientAvatar: 'MT',
            type: 'audit-support',
            topic: 'CRA Audit Support',
            description: 'Received a letter from CRA about my 2023 tax return. Need immediate assistance.',
            duration: 45,
            caRate: 200,
            urgency: 'urgent',
            status: 'scheduled',
            scheduledTime: '2025-03-22T14:00:00',
            meetingLink: 'https://meet.google.com/abc-defg-hij',
            createdAt: '2025-03-16T09:45:00'
          },
          {
            id: 4,
            clientName: 'Sarah Johnson',
            clientEmail: 'sarah.johnson@email.com',
            clientAvatar: 'SJ',
            type: 'gst-hst-advice',
            topic: 'GST/HST Questions for Small Business',
            description: 'Unsure about charging GST on digital services sold to US customers.',
            duration: 30,
            caRate: 120,
            urgency: 'low',
            status: 'completed',
            completedAt: '2025-03-15T11:30:00',
            rating: 5,
            createdAt: '2025-03-14T16:20:00'
          },
          {
            id: 5,
            clientName: 'David Kim',
            clientEmail: 'david.kim@email.com',
            clientAvatar: 'DK',
            type: 'estate-planning',
            topic: 'Estate Planning for Business Owner',
            description: 'Need to set up estate plan for my franchise business and family.',
            duration: 90,
            caRate: 180,
            urgency: 'medium',
            status: 'declined',
            declineReason: 'Schedule conflict, available next week',
            createdAt: '2025-03-13T13:10:00'
          }
        ];

        const filtered = filter === 'all' 
          ? mockRequests 
          : mockRequests.filter(r => r.status === filter);
        
        setRequests(filtered);
        
        // Calculate stats
        setStats({
          pending: mockRequests.filter(r => r.status === 'pending').length,
          scheduled: mockRequests.filter(r => r.status === 'scheduled').length,
          completed: mockRequests.filter(r => r.status === 'completed').length,
          earnings: mockRequests
            .filter(r => r.status === 'completed')
            .reduce((sum, r) => sum + (r.caRate * r.duration / 60), 0)
        });
        
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading requests:', error);
      setLoading(false);
    }
  };

  const handleAccept = (id) => {
    navigate(`/ca/requests/${id}/schedule`);
  };

  const handleDecline = (id) => {
    if (window.confirm('Are you sure you want to decline this request?')) {
      // API call would go here
      alert('Request declined');
    }
  };

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

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'urgent':
        return <Zap size={16} className="text-red-500" />;
      case 'high':
        return <AlertCircle size={16} className="text-orange-500" />;
      case 'medium':
        return <Clock size={16} className="text-yellow-500" />;
      default:
        return <Clock size={16} className="text-blue-500" />;
    }
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'scheduled':
        return <Badge variant="success">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="info">Completed</Badge>;
      case 'declined':
        return <Badge variant="error">Declined</Badge>;
      default:
        return <Badge variant="info">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredRequests = requests.filter(req =>
    req.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const RequestCard = ({ request }) => (
    <Card className="hover:shadow-md transition-shadow">
      <Card.Body>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-primary-600">
                {request.clientAvatar}
              </span>
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-gray-900">{request.clientName}</h3>
              <p className="text-sm text-gray-500">{request.clientEmail}</p>
              <div className="flex items-center mt-1 space-x-2">
                {getUrgencyIcon(request.urgency)}
                <span className="text-xs text-gray-600 capitalize">{request.urgency}</span>
              </div>
            </div>
          </div>
          {getStatusBadge(request.status)}
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-1">{request.topic}</h4>
          <p className="text-sm text-gray-600 line-clamp-2">{request.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock size={14} className="mr-2" />
            {request.duration} min
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign size={14} className="mr-2" />
            {formatCurrency(request.caRate * request.duration / 60)}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={14} className="mr-2" />
            {request.preferredDates?.[0] ? formatDate(request.preferredDates[0]) : formatDate(request.createdAt)}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="px-2 py-1 bg-gray-100 rounded text-xs">
              {getTypeLabel(request.type)}
            </span>
          </div>
        </div>

        {request.attachments > 0 && (
          <div className="mb-4 p-2 bg-gray-50 rounded-lg flex items-center">
            <span className="text-xs text-gray-600">
              📎 {request.attachments} document(s) attached
            </span>
          </div>
        )}

        {request.status === 'pending' && (
          <div className="flex space-x-3">
            <Button
              variant="success"
              onClick={() => handleAccept(request.id)}
              className="flex-1"
            >
              Accept
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDecline(request.id)}
              className="flex-1"
            >
              Decline
            </Button>
          </div>
        )}

        {request.status === 'scheduled' && (
          <div className="flex space-x-3">
            <Button
              variant="primary"
              onClick={() => navigate(`/ca/requests/${request.id}`)}
              className="flex-1"
            >
              View Details
            </Button>
            {request.meetingLink && (
              <a
                href={request.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" className="w-full">
                  <Video size={16} className="mr-2" />
                  Join
                </Button>
              </a>
            )}
          </div>
        )}

        {request.status === 'completed' && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="text-gold fill-current" size={16} />
              <span className="text-sm ml-1">{request.rating}.0</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/ca/requests/${request.id}`)}
            >
              View Summary
            </Button>
          </div>
        )}

        {request.status === 'declined' && (
          <p className="text-sm text-red-600 italic">
            Declined: {request.declineReason}
          </p>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Consultation Requests</h1>
          <p className="text-gray-500 mt-1">
            Manage and respond to client consultation requests
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-warning-600">{stats.pending}</p>
              </div>
              <div className="p-3 bg-warning-50 rounded-lg">
                <Clock className="text-warning-500" size={20} />
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Scheduled</p>
                <p className="text-2xl font-bold text-success-600">{stats.scheduled}</p>
              </div>
              <div className="p-3 bg-success-50 rounded-lg">
                <CheckCircle className="text-success-500" size={20} />
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-primary-600">{stats.completed}</p>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <Users className="text-primary-500" size={20} />
              </div>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Earnings (MTD)</p>
                <p className="text-2xl font-bold text-gold-600">{formatCurrency(stats.earnings)}</p>
              </div>
              <div className="p-3 bg-gold-50 rounded-lg">
                <TrendingUp className="text-gold-600" size={20} />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <Card.Body>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by client name or topic..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="pending">Pending</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="all">All Requests</option>
              </select>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Requests List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader className="animate-spin h-8 w-8 text-primary-500 mx-auto" />
          <p className="mt-4 text-gray-500">Loading requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card className="text-center py-12">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-500">
            When clients request consultations, they'll appear here
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CARequestDashboard;







