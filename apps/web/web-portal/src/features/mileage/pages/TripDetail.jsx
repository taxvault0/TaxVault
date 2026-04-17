import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Clock,
  TrendingUp,
  Briefcase,
  Home,
  User
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';
import { PROVINCES } from 'constants/provinces';

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // Mock data - replace with API call
  const [trip, setTrip] = useState({
    id: id,
    date: '2024-03-15',
    startTime: '09:30',
    endTime: '10:15',
    startLocation: 'Home - 123 Main St, Toronto',
    endLocation: 'Client Office - 456 King St W, Toronto',
    distance: 23.4,
    purpose: 'business',
    tripType: 'Client Meeting',
    clientName: 'ABC Corp',
    notes: 'Quarterly financial review meeting',
    province: 'ON',
    deductible: 14.27,
    status: 'verified'
  });

  const provinceInfo = PROVINCES.find(p => p.id === trip.province);

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      // API call to delete
      navigate('/mileage');
    }
  };

  const getPurposeIcon = (purpose) => {
    switch (purpose) {
      case 'business':
        return <Briefcase size={20} className="text-success-600" />;
      case 'commute':
        return <Home size={20} className="text-info-600" />;
      default:
        return <User size={20} className="text-warning-600" />;
    }
  };

  const getPurposeColor = (purpose) => {
    switch (purpose) {
      case 'business':
        return 'success';
      case 'commute':
        return 'info';
      default:
        return 'warning';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary-600"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Mileage
        </button>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
            <Edit size={16} className="mr-2" />
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
          <Button variant="warning" size="sm" onClick={handleDelete}>
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Card */}
      <Card>
        <Card.Body className="space-y-6">
          {/* Header with Purpose */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getPurposeIcon(trip.purpose)}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Trip Details</h2>
                <p className="text-gray-500">{trip.date}</p>
              </div>
            </div>
            <Badge variant={getPurposeColor(trip.purpose)}>
              {trip.purpose.charAt(0).toUpperCase() + trip.purpose.slice(1)}
            </Badge>
          </div>

          {/* Distance and Deduction */}
          <div className="grid grid-cols-2 gap-4 bg-primary-50 p-6 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Distance</p>
              <p className="text-3xl font-bold text-primary-600">{trip.distance} km</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Deductible Amount</p>
              <p className="text-3xl font-bold text-success-600">${trip.deductible}</p>
            </div>
          </div>

          {/* Trip Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Start Location */}
            <div>
              <div className="flex items-center text-gray-500 mb-2">
                <MapPin size={16} className="mr-2" />
                <span className="text-sm">Start</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={trip.startLocation}
                  onChange={(e) => setTrip({...trip, startLocation: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <>
                  <p className="font-medium">{trip.startLocation}</p>
                  <p className="text-sm text-gray-500 mt-1">{formatTime(trip.startTime)}</p>
                </>
              )}
            </div>

            {/* End Location */}
            <div>
              <div className="flex items-center text-gray-500 mb-2">
                <MapPin size={16} className="mr-2" />
                <span className="text-sm">End</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={trip.endLocation}
                  onChange={(e) => setTrip({...trip, endLocation: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <>
                  <p className="font-medium">{trip.endLocation}</p>
                  <p className="text-sm text-gray-500 mt-1">{formatTime(trip.endTime)}</p>
                </>
              )}
            </div>

            {/* Duration */}
            <div>
              <div className="flex items-center text-gray-500 mb-2">
                <Clock size={16} className="mr-2" />
                <span className="text-sm">Duration</span>
              </div>
              <p className="font-medium">45 minutes</p>
            </div>

            {/* Trip Type */}
            <div>
              <div className="flex items-center text-gray-500 mb-2">
                <Briefcase size={16} className="mr-2" />
                <span className="text-sm">Trip Type</span>
              </div>
              {isEditing ? (
                <select
                  value={trip.tripType}
                  onChange={(e) => setTrip({...trip, tripType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option>Client Meeting</option>
                  <option>Supplies Pickup</option>
                  <option>Site Visit</option>
                  <option>Other Business</option>
                </select>
              ) : (
                <p className="font-medium">{trip.tripType}</p>
              )}
            </div>

            {/* Client Name */}
            {trip.clientName && (
              <div className="col-span-2">
                <div className="flex items-center text-gray-500 mb-2">
                  <Briefcase size={16} className="mr-2" />
                  <span className="text-sm">Client</span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={trip.clientName}
                    onChange={(e) => setTrip({...trip, clientName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                ) : (
                  <p className="font-medium">{trip.clientName}</p>
                )}
              </div>
            )}

            {/* Notes */}
            <div className="col-span-2">
              <p className="text-sm text-gray-500 mb-2">Notes</p>
              {isEditing ? (
                <textarea
                  value={trip.notes}
                  onChange={(e) => setTrip({...trip, notes: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="text-gray-700">{trip.notes || 'No notes added'}</p>
              )}
            </div>
          </div>

          {/* Province Info */}
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-1">Province</p>
            <p className="font-medium">{provinceInfo?.name} - CRA Rate: $0.61/km</p>
          </div>

          {/* Save Button (when editing) */}
          {isEditing && (
            <div className="flex justify-end pt-4">
              <Button variant="primary" onClick={() => setIsEditing(false)}>
                Save Changes
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default TripDetail;









