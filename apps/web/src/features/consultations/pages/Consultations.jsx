// src/pages/user/Consultations.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Filter,
  Plus,
  ChevronRight,
  Loader
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';
import { consultationService } from '../services/consultationService';
import { useAuth } from '../../auth/context/AuthContext';

const Consultations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [consultations, setConsultations] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadConsultations();
  }, [filter]);

  const loadConsultations = async () => {
    setLoading(true);
    try {
      const response = await consultationService.getMyConsultations(filter);
      setConsultations(response.data);
    } catch (error) {
      console.error('Error loading consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { label: 'Awaiting Response', variant: 'warning' },
      'awaiting-payment': { label: 'Awaiting Payment', variant: 'info' },
      'scheduled': { label: 'Scheduled', variant: 'success' },
      'completed': { label: 'Completed', variant: 'success' },
      'cancelled': { label: 'Cancelled', variant: 'error' },
      'declined': { label: 'Declined', variant: 'error' },
      'no-show': { label: 'No Show', variant: 'error' }
    };
    const config = statusMap[status] || { label: status, variant: 'info' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeIcon = (type) => {
    const icons = {
      'tax-planning': '💰',
      'audit-support': '🔍',
      'business-structure': '🏢',
      'gst-hst-advice': '📊',
      'payroll-support': '👥',
      'investment-tax': '📈',
      'estate-planning': '📜',
      'cross-border': '🌍',
      'general-advice': '💬'
    };
    return icons[type] || '💬';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-CA', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ConsultationCard = ({ consultation }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate(`/consultations/${consultation.id}`)}>
      <Card.Body>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">{getTypeIcon(consultation.type)}</span>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {consultation.type.split('-').map(w => 
                    w.charAt(0).toUpperCase() + w.slice(1)
                  ).join(' ')}
                </h3>
                <p className="text-sm text-gray-500">with {consultation.caName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-center text-sm text-gray-600">
                <Clock size={14} className="mr-2" />
                {consultation.duration} min
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign size={14} className="mr-2" />
                ${consultation.totalAmount}
              </div>
              {consultation.selectedDateTime && (
                <div className="flex items-center text-sm text-gray-600 col-span-2">
                  <Calendar size={14} className="mr-2" />
                  {formatDate(consultation.selectedDateTime)}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              {getStatusBadge(consultation.status)}
              {consultation.meetingLink && consultation.status === 'scheduled' && (
                <a
                  href={consultation.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Video size={14} className="mr-1" />
                  Join Meeting
                </a>
              )}
            </div>
          </div>
          <ChevronRight className="text-gray-400" size={20} />
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Consultations</h1>
          <p className="text-gray-500 mt-1">
            Schedule and manage meetings with your CA
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/find-ca')}
          icon={<Plus size={16} />}
        >
          New Consultation
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <Card.Body>
          <div className="flex items-center space-x-4">
            <Filter size={18} className="text-gray-400" />
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All' },
                { value: 'pending', label: 'Pending' },
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'completed', label: 'Completed' }
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === f.value
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Consultations List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader className="animate-spin h-8 w-8 text-primary-500 mx-auto" />
          <p className="mt-4 text-gray-500">Loading consultations...</p>
        </div>
      ) : consultations.length === 0 ? (
        <Card className="text-center py-12">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No consultations found</h3>
          <p className="text-gray-500 mb-6">
            Schedule your first consultation with a CA to get expert tax advice
          </p>
          <Button variant="primary" onClick={() => navigate('/find-ca')}>
            Find a CA
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {consultations.map((consultation) => (
            <ConsultationCard key={consultation.id} consultation={consultation} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Consultations;







