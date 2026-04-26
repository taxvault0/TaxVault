import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from 'services/api';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import { CalendarDays, Clock, ChevronLeft } from 'lucide-react';

const CAAvailabilityCalendar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const ca = location.state?.ca || null;

  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    fetchAvailability();
  }, [id]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/ca/profile/${id}/availability`, {
        params: { days: 30 },
      });

      const rawSlots =
        response.data?.data?.slots ||
        response.data?.slots ||
        response.data?.availability ||
        [];

      setSlots(Array.isArray(rawSlots) ? rawSlots : []);
    } catch (error) {
      console.error('Error loading availability:', error);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSlot = (slot) => {
    const start = new Date(slot.start);

    const selectedDate = start.toISOString().split('T')[0];
    const selectedTime = start.toTimeString().slice(0, 5);

    navigate(`/consultations/request/${id}`, {
      state: {
        ca,
        date: selectedDate,
        time: selectedTime,
        slot,
        slotId: slot.id || slot._id,
      },
    });
  };

  const formatSlot = (slot) => {
    const start = new Date(slot.start);
    const end = slot.end ? new Date(slot.end) : null;

    return {
      date: start.toLocaleDateString('en-CA', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }),
      time: `${start.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}${end ? ` - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}`,
    };
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-primary-600"
      >
        <ChevronLeft size={20} className="mr-1" />
        Back
      </button>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Available Slots</h1>
        <p className="mt-1 text-gray-500">
          Select a time to request a consultation
          {ca?.firmName ? ` with ${ca.firmName}` : ''}
        </p>
      </div>

      {loading ? (
        <Card>
          <Card.Body>
            <p className="text-gray-500">Loading availability...</p>
          </Card.Body>
        </Card>
      ) : slots.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-12">
            <CalendarDays size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900">No slots available</h3>
            <p className="mt-2 text-gray-500">
              This CA has not published availability yet.
            </p>
          </Card.Body>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {slots.map((slot, index) => {
            const formatted = formatSlot(slot);

            return (
              <Card key={`${slot.start}-${index}`}>
                <Card.Body>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center text-gray-900">
                        <CalendarDays size={18} className="mr-2 text-primary-500" />
                        <span className="font-semibold">{formatted.date}</span>
                      </div>

                      <div className="mt-2 flex items-center text-gray-600">
                        <Clock size={16} className="mr-2" />
                        <span>{formatted.time}</span>
                      </div>

                      <p className="mt-2 text-sm text-gray-500">
                        {slot.type || 'Consultation'}
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSelectSlot(slot)}
                    >
                      Select
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CAAvailabilityCalendar;