import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  ChevronLeft,
  ChevronRight,
  Users,
  Filter
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';

const CACalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Mock appointments data
  const appointments = [
    {
      id: 1,
      client: 'Marcus Chen',
      time: '10:00 AM',
      duration: 30,
      type: 'Tax Planning',
      status: 'confirmed',
      meetingLink: 'https://meet.google.com/abc'
    },
    {
      id: 2,
      client: 'Priya Sharma',
      time: '2:00 PM',
      duration: 60,
      type: 'Business Structure',
      status: 'confirmed',
      meetingLink: 'https://meet.google.com/def'
    },
    {
      id: 3,
      client: 'Mike Thompson',
      time: '4:30 PM',
      duration: 45,
      type: 'Audit Support',
      status: 'pending',
      meetingLink: null
    }
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-500 mt-1">Manage your consultation schedule</p>
        </div>
        <Button variant="primary">
          <Filter size={16} className="mr-2" />
          Filter
        </Button>
      </div>

      {/* Calendar Grid */}
      <Card>
        <Card.Body>
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-xl font-semibold">
                {monthName} {year}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="success">● Confirmed</Badge>
              <Badge variant="warning">● Pending</Badge>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square bg-gray-50 rounded-lg" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dateStr = `${year}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayAppointments = day === 25 ? appointments : day === 26 ? [appointments[1]] : [];

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`aspect-square p-2 rounded-lg border ${
                    selectedDate === dateStr
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <span className="text-sm font-medium">{day}</span>
                  {dayAppointments.length > 0 && (
                    <div className="mt-1">
                      {dayAppointments.map((apt, idx) => (
                        <div
                          key={idx}
                          className={`text-[10px] px-1 py-0.5 rounded mb-0.5 ${
                            apt.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {apt.time}
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </Card.Body>
      </Card>

      {/* Selected Date Appointments */}
      {selectedDate && (
        <Card>
          <Card.Header>
            <h3 className="font-medium">
              Appointments for {new Date(selectedDate).toLocaleDateString('en-CA', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold">
                        {apt.client.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">{apt.client}</h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock size={14} className="mr-1" />
                        {apt.time} ({apt.duration} min)
                        <span className="mx-2">•</span>
                        <span>{apt.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={apt.status === 'confirmed' ? 'success' : 'warning'}>
                      {apt.status}
                    </Badge>
                    {apt.meetingLink && (
                      <a
                        href={apt.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <Video size={18} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default CACalendar;







