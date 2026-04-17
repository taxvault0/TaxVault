import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, Users, Baby, MapPin, Shield, AlertTriangle, ChevronRight 
} from 'lucide-react';
import Card from 'components/ui/Card';
import { useAuth } from '../../auth/context/AuthContext';

const LifeEventsHub = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const events = [
    { 
      id: 'marriage', 
      icon: Heart, 
      title: 'Marriage / Common-Law', 
      description: 'Add a spouse. Affects spousal credits and income splitting.',
      path: '/life-events/marriage', 
      color: 'pink',
      showFor: ['single', 'divorced', 'widowed']
    },
    { 
      id: 'separation', 
      icon: AlertTriangle, 
      title: 'Separation / Divorce', 
      description: 'Update status and unlink financial data.',
      path: '/life-events/separation', 
      color: 'red',
      showFor: ['married', 'common-law']
    },
    { 
      id: 'child', 
      icon: Baby, 
      title: 'Add a Child / Dependent', 
      description: 'For Canada Child Benefit (CCB) and childcare deductions.',
      path: '/life-events/add-dependent', 
      color: 'green',
      showFor: ['married', 'common-law', 'single', 'divorced', 'widowed']
    },
    { 
      id: 'move', 
      icon: MapPin, 
      title: 'Change of Address', 
      description: 'Update province. Affects provincial tax rates.',
      path: '/life-events/change-address', 
      color: 'blue',
      showFor: ['married', 'common-law', 'single', 'divorced', 'widowed']
    },
    { 
      id: 'legacy', 
      icon: Shield, 
      title: 'Legacy Contact', 
      description: 'Designate someone to manage your vault.',
      path: '/life-events/legacy-contact', 
      color: 'purple',
      showFor: ['married', 'common-law', 'single', 'divorced', 'widowed']
    },
  ];

  // Filter events based on user's current marital status
  const filteredEvents = events.filter(event => 
    !event.showFor || event.showFor.includes(user?.maritalStatus || 'single')
  );

  const colorClasses = {
    pink: 'border-pink-200 hover:border-pink-300 bg-pink-50',
    red: 'border-red-200 hover:border-red-300 bg-red-50',
    green: 'border-green-200 hover:border-green-300 bg-green-50',
    blue: 'border-blue-200 hover:border-blue-300 bg-blue-50',
    purple: 'border-purple-200 hover:border-purple-300 bg-purple-50',
  };

  const iconColors = {
    pink: 'text-pink-600',
    red: 'text-red-600',
    green: 'text-green-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Life Events</h1>
        <p className="text-gray-600 mt-2">
          Major life changes affect your taxes. Keep your information up to date to maximize benefits 
          and ensure accurate filings. Your Chartered Accountant will be notified of relevant changes.
        </p>
      </div>

      {/* Current Status Card */}
      <Card className="mb-8 bg-gray-50">
        <Card.Body>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Current Marital Status</p>
              <p className="text-xl font-semibold capitalize">{user?.maritalStatus || 'Single'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Province of Residence</p>
              <p className="text-xl font-semibold">{user?.province || 'Ontario'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Connected CA</p>
              <p className="text-xl font-semibold">{user?.connectedCA ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((event) => {
          const Icon = event.icon;
          return (
            <Card
              key={event.id}
              className={`border-2 cursor-pointer transition-all hover:shadow-md ${colorClasses[event.color]}`}
              onClick={() => navigate(event.path)}
            >
              <Card.Body className="flex items-start space-x-4">
                <div className={`p-3 rounded-full ${iconColors[event.color]}`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.description}</p>
                </div>
                <ChevronRight className="text-gray-400" />
              </Card.Body>
            </Card>
          );
        })}
      </div>

      {/* Info Banner */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Shield className="text-blue-600 mr-3 flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="text-sm font-medium text-blue-700">Privacy First</p>
            <p className="text-xs text-blue-600 mt-1">
              Your sensitive information (SIN, spouse details) is encrypted. You control exactly what 
              information is shared with your spouse or CA. All life events are logged for your records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeEventsHub;










