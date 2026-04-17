import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Play,
  Pause,
  Square,
  Navigation,
  Clock,
  TrendingUp,
  AlertCircle,
  Save
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Badge from 'components/ui/Badge';
import { PROVINCES } from 'constants/provinces';

const MileageTracker = () => {
  const navigate = useNavigate();
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTrip, setCurrentTrip] = useState({
    startTime: null,
    endTime: null,
    startLocation: '',
    endLocation: '',
    distance: 0,
    purpose: 'business',
    notes: ''
  });
  const [elapsedTime, setElapsedTime] = useState(0);
  const [province, setProvince] = useState('ON');

  useEffect(() => {
    let interval;
    if (isTracking && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        // Simulate distance accumulation (0.1 km per second)
        setCurrentTrip(prev => ({
          ...prev,
          distance: prev.distance + 0.1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, isPaused]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsTracking(true);
    setCurrentTrip({
      ...currentTrip,
      startTime: new Date().toISOString(),
      startLocation: 'Current Location',
      distance: 0
    });
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsTracking(false);
    setIsPaused(false);
    setCurrentTrip({
      ...currentTrip,
      endTime: new Date().toISOString()
    });
  };

  const handleSave = () => {
    // Save trip to database
    console.log('Saving trip:', currentTrip);
    navigate('/mileage');
  };

  const handleDiscard = () => {
    if (window.confirm('Discard this trip?')) {
      setCurrentTrip({
        startTime: null,
        endTime: null,
        startLocation: '',
        endLocation: '',
        distance: 0,
        purpose: 'business',
        notes: ''
      });
      setElapsedTime(0);
      navigate('/mileage');
    }
  };

  // CRA mileage rates by province (2024)
  const mileageRates = {
    'AB': 0.61,
    'BC': 0.61,
    'MB': 0.61,
    'NB': 0.61,
    'NL': 0.61,
    'NS': 0.61,
    'ON': 0.61,
    'PE': 0.61,
    'QC': 0.61,
    'SK': 0.61,
    'NT': 0.64,
    'NU': 0.64,
    'YT': 0.64
  };

  const currentRate = mileageRates[province] || 0.61;
  const estimatedDeduction = currentTrip.distance * currentRate;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Mileage Tracker</h1>
        <Badge variant={isTracking ? 'success' : 'info'}>
          {isTracking ? (isPaused ? 'Paused' : 'Tracking') : 'Ready'}
        </Badge>
      </div>

      {/* Province Selector */}
      <Card className="bg-primary-50 border-primary-200">
        <Card.Body>
          <div className="flex items-center">
            <MapPin className="text-primary-500 mr-3" size={20} />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Your Province
              </label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {PROVINCES.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">
                CRA Mileage Rate: ${currentRate}/km
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Live Tracker Card */}
      <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <Card.Body className="text-center py-8">
          {isTracking ? (
            <>
              <div className="text-6xl font-bold mb-4">
                {currentTrip.distance.toFixed(1)} km
              </div>
              <div className="text-2xl font-mono mb-6">
                {formatTime(elapsedTime)}
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm opacity-90">
                <Navigation size={16} />
                <span>{currentTrip.startLocation}</span>
              </div>
            </>
          ) : (
            <>
              <Navigation size={48} className="mx-auto mb-4 opacity-80" />
              <h3 className="text-xl font-semibold mb-2">Ready to Start</h3>
              <p className="text-sm opacity-90">
                Press start to begin tracking your trip
              </p>
            </>
          )}
        </Card.Body>
      </Card>

      {/* Control Buttons */}
      <div className="flex justify-center space-x-4">
        {!isTracking ? (
          <Button
            variant="primary"
            size="lg"
            onClick={handleStart}
            icon={<Play size={20} />}
          >
            Start Trip
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              size="lg"
              onClick={handlePause}
              icon={isPaused ? <Play size={20} /> : <Pause size={20} />}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              variant="warning"
              size="lg"
              onClick={handleStop}
              icon={<Square size={20} />} // FIXED: Changed from Stop to Square
            >
              Stop
            </Button>
          </>
        )}
      </div>

      {/* Trip Details Form (shown after stop) */}
      {!isTracking && currentTrip.endTime && (
        <Card>
          <Card.Header>
            <h3 className="font-semibold">Trip Details</h3>
          </Card.Header>
          <Card.Body className="space-y-4">
            {/* Start and End Locations */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Location"
                value={currentTrip.startLocation}
                onChange={(e) =>
                  setCurrentTrip({ ...currentTrip, startLocation: e.target.value })
                }
                icon={<MapPin size={18} />}
              />
              <Input
                label="End Location"
                value={currentTrip.endLocation}
                onChange={(e) =>
                  setCurrentTrip({ ...currentTrip, endLocation: e.target.value })
                }
                icon={<MapPin size={18} />}
              />
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trip Purpose
              </label>
              <select
                value={currentTrip.purpose}
                onChange={(e) =>
                  setCurrentTrip({ ...currentTrip, purpose: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="business">Business - Client Meeting</option>
                <option value="business">Business - Supplies Pickup</option>
                <option value="business">Business - Other</option>
                <option value="commute">Commute</option>
                <option value="personal">Personal</option>
              </select>
            </div>

            {/* Notes */}
            <Input
              label="Notes (Optional)"
              value={currentTrip.notes}
              onChange={(e) =>
                setCurrentTrip({ ...currentTrip, notes: e.target.value })
              }
              placeholder="Add notes about this trip"
            />

            {/* Summary */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Distance:</span>
                <span className="font-semibold">{currentTrip.distance.toFixed(1)} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold">{formatTime(elapsedTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Est. Deduction:</span>
                <span className="font-semibold text-success-600">
                  ${estimatedDeduction.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button variant="outline" onClick={handleDiscard} className="flex-1">
                Discard
              </Button>
              <Button variant="primary" onClick={handleSave} className="flex-1">
                <Save size={16} className="mr-2" />
                Save Trip
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* CRA Info */}
      <Card className="bg-info-50 border-info-200">
        <Card.Body>
          <div className="flex items-start">
            <AlertCircle className="text-info-600 mr-3 flex-shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-medium text-info-700">CRA Requirements</h4>
              <p className="text-sm text-info-600 mt-1">
                Keep a detailed log of all business trips including date, destination, purpose, and kilometers.
                This information must be kept for 6 years in case of CRA audit.
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default MileageTracker;








