import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  MessageCircle,
  Settings,
  Bell,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';
import axios from 'axios';

const CADirectoryDashboard = () => {
  const [acceptingClients, setAcceptingClients] = useState(true);
  const [stats, setStats] = useState({
    profileViews: 0,
    connectionRequests: 0,
    totalConnections: 0,
    pendingRequests: 0,
    activeClients: 0,
    recentRequests: []
  });
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState({
    firmName: '',
    bio: '',
    yearsOfExperience: '',
    phone: '',
    website: '',
    specializations: [],
    services: [],
    languages: [],
    availableFor: []
  });

  useEffect(() => {
    fetchStats();
    fetchProfile();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/ca/dashboard/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/ca/profile');
      setProfile(response.data.profile);
      setAcceptingClients(response.data.profile.acceptingNewClients);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const toggleAcceptingStatus = async () => {
    try {
      const newStatus = !acceptingClients;
      await axios.put('/api/ca/toggle-status', { accepting: newStatus });
      setAcceptingClients(newStatus);
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleRequest = async (requestId, action) => {
    try {
      await axios.post(`/api/ca/requests/${requestId}`, { action });
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error('Error handling request:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CA Directory Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your presence and client connections</p>
        </div>
        <Button variant="primary" onClick={() => setShowProfileModal(true)}>
          <Settings size={16} className="mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Status Toggle */}
      <Card className="bg-primary-50 border-primary-200">
        <Card.Body>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {acceptingClients ? (
                <ToggleRight size={32} className="text-success-500" />
              ) : (
                <ToggleLeft size={32} className="text-gray-400" />
              )}
              <div className="ml-3">
                <h3 className="font-semibold text-gray-900">
                  {acceptingClients ? 'Accepting New Clients' : 'Not Accepting New Clients'}
                </h3>
                <p className="text-sm text-gray-500">
                  {acceptingClients 
                    ? 'Your profile is visible in search results'
                    : 'Your profile is hidden from search results'}
                </p>
              </div>
            </div>
            <Button
              variant={acceptingClients ? 'warning' : 'success'}
              onClick={toggleAcceptingStatus}
            >
              {acceptingClients ? 'Pause Listings' : 'Start Accepting'}
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Profile Views</p>
                <p className="text-2xl font-bold mt-1">{stats.profileViews}</p>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <Eye className="text-primary-500" size={20} />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Connection Requests</p>
                <p className="text-2xl font-bold mt-1">{stats.connectionRequests}</p>
              </div>
              <div className="p-3 bg-warning-50 rounded-lg">
                <UserPlus className="text-warning-500" size={20} />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Clients</p>
                <p className="text-2xl font-bold mt-1">{stats.activeClients}</p>
              </div>
              <div className="p-3 bg-success-50 rounded-lg">
                <Users className="text-success-500" size={20} />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold mt-1">{stats.pendingRequests}</p>
              </div>
              <div className="p-3 bg-info-50 rounded-lg">
                <Clock className="text-info-500" size={20} />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Recent Requests */}
      <Card>
        <Card.Header>
          <h3 className="font-semibold">Recent Connection Requests</h3>
        </Card.Header>
        <Card.Body>
          {stats.recentRequests.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No pending requests</p>
          ) : (
            <div className="space-y-4">
              {stats.recentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary-600">
                          {request.clientName?.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{request.clientName}</p>
                        <p className="text-sm text-gray-500 capitalize">
                          {request.clientType?.replace('-', ' ')}
                        </p>
                      </div>
                    </div>
                    {request.message && (
                      <p className="text-sm text-gray-600 mt-2 ml-13">
                        "{request.message}"
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="warning">Pending</Badge>
                    <Button size="sm" variant="success" onClick={() => handleRequest(request.id, 'accept')}>
                      <CheckCircle size={14} className="mr-1" />
                      Accept
                    </Button>
                    <Button size="sm" variant="warning" onClick={() => handleRequest(request.id, 'reject')}>
                      <XCircle size={14} className="mr-1" />
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Profile Edit Modal - Simplified */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowProfileModal(false)} />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Edit CA Profile</h3>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Firm Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      value={profile.firmName}
                      onChange={(e) => setProfile({ ...profile, firmName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="url"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      value={profile.website}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    />
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <Button variant="outline" className="flex-1" onClick={() => setShowProfileModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" className="flex-1">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CADirectoryDashboard;







