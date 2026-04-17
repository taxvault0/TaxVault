import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  Search,
  User,
  Mail,
  Briefcase,
  QrCode,
  Scan,
  CheckCircle,
  XCircle,
  Loader,
  Filter,
  Download,
  ChevronRight,
  Calendar,
  MapPin,
  Clock,
  AlertCircle
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Badge from 'components/ui/Badge';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuth } from '../../auth/context/AuthContext';
import { caAPI } from 'services/api';
import axios from 'axios';

const Clients = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State for client list
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [taxYear, setTaxYear] = useState(new Date().getFullYear());
  
  // State for client search by ID
  const [searchMethod, setSearchMethod] = useState('list'); // 'list', 'manual', 'scan'
  const [clientId, setClientId] = useState('');
  const [searching, setSearching] = useState(false);
  const [foundClient, setFoundClient] = useState(null);
  const [error, setError] = useState('');

  // Fetch clients list
  const { data: clients, isLoading, refetch } = useQuery(
    ['ca-clients', searchTerm, statusFilter, taxYear],
    () => caAPI.getClients({ 
      search: searchTerm, 
      status: statusFilter, 
      taxYear 
    }).then(res => res.data)
  );

  const handleSearchById = async () => {
    if (!clientId.trim()) {
      setError('Please enter a Client ID');
      return;
    }

    setSearching(true);
    setError('');
    setFoundClient(null);

    try {
      const response = await axios.get(`/api/users/client/${clientId.trim()}`);
      setFoundClient(response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Client not found');
    } finally {
      setSearching(false);
    }
  };

  const handleConnect = () => {
    if (foundClient) {
      navigate(`/ca/clients/${foundClient.id}`, {
        state: { client: foundClient }
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="info">Active</Badge>;
      case 'ready':
        return <Badge variant="success">Ready to File</Badge>;
      case 'attention':
        return <Badge variant="warning">Needs Attention</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      default:
        return <Badge variant="info">{status}</Badge>;
    }
  };

  const getUserTypeIcon = (type) => {
    switch (type) {
      case 'gig-worker':
        return '🚗';
      case 'Business-owner':
        return '🏪';
      case 'contractor':
        return '💻';
      case 'trades':
        return '🔧';
      case 'student':
        return '🎓';
      case 'franchise':
        return '🏢';
      default:
        return '👤';
    }
  };

  const getProgressColor = (uploaded, required) => {
    const percentage = (uploaded / required) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 70) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const stats = {
    total: clients?.total || 0,
    active: clients?.data?.filter(c => c.status === 'active').length || 0,
    ready: clients?.data?.filter(c => c.status === 'ready').length || 0,
    attention: clients?.data?.filter(c => c.status === 'attention').length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 mt-1">
            Manage and review all your client tax documents.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setSearchMethod(searchMethod === 'list' ? 'manual' : 'list')}
          >
            {searchMethod === 'list' ? (
              <>
                <Search size={16} className="mr-2" />
                Find by ID
              </>
            ) : (
              <>
                <User size={16} className="mr-2" />
                View All Clients
              </>
            )}
          </Button>
          <Button variant="primary">
            <Download size={16} className="mr-2" />
            Export List
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {searchMethod === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <Card.Body>
              <p className="text-sm text-gray-500">Total Clients</p>
              <p className="text-2xl font-bold text-primary-600">{stats.total}</p>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <p className="text-sm text-gray-500">Ready to File</p>
              <p className="text-2xl font-bold text-green-600">{stats.ready}</p>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <p className="text-sm text-gray-500">Needs Attention</p>
              <p className="text-2xl font-bold text-orange-600">{stats.attention}</p>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Search/Filter Section */}
      <Card>
        <Card.Body>
          {searchMethod === 'list' ? (
            /* Client List View - Filters */
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Search clients by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="ready">Ready to File</option>
                  <option value="attention">Needs Attention</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Tax Year */}
              <div>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={taxYear}
                  onChange={(e) => setTaxYear(parseInt(e.target.value))}
                >
                  {[2025, 2024, 2023, 2022, 2021].map(year => (
                    <option key={year} value={year}>{year} Tax Year</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            /* Find by ID View */
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="flex space-x-4 mb-4">
                  <button
                    onClick={() => setSearchMethod('manual')}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      searchMethod === 'manual'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <Search className={`mx-auto mb-1 ${
                      searchMethod === 'manual' ? 'text-primary-500' : 'text-gray-400'
                    }`} size={20} />
                    <p className={`text-sm font-medium ${
                      searchMethod === 'manual' ? 'text-primary-700' : 'text-gray-600'
                    }`}>Manual Entry</p>
                  </button>

                  <button
                    onClick={() => setSearchMethod('scan')}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      searchMethod === 'scan'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <Scan className={`mx-auto mb-1 ${
                      searchMethod === 'scan' ? 'text-primary-500' : 'text-gray-400'
                    }`} size={20} />
                    <p className={`text-sm font-medium ${
                      searchMethod === 'scan' ? 'text-primary-700' : 'text-gray-600'
                    }`}>Scan QR Code</p>
                  </button>
                </div>

                {searchMethod === 'manual' && (
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Enter Client ID (e.g., TV-2024-ABC123)"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value.toUpperCase())}
                        error={error}
                      />
                    </div>
                    <Button
                      variant="primary"
                      onClick={handleSearchById}
                      loading={searching}
                    >
                      Search
                    </Button>
                  </div>
                )}

                {searchMethod === 'scan' && (
                  <div className="text-center py-4">
                    <div className="bg-gray-100 w-48 h-48 mx-auto rounded-lg flex items-center justify-center">
                      <Scan size={48} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      Position the QR code within the frame to scan
                    </p>
                    <Button variant="primary" className="mt-4">
                      Start Camera
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Search Results - Found Client */}
      {searching && searchMethod !== 'list' && (
        <Card className="text-center py-8">
          <Loader className="animate-spin mx-auto mb-4" size={32} />
          <p>Searching for client...</p>
        </Card>
      )}

      {foundClient && searchMethod !== 'list' && (
        <Card className="border-green-200 bg-green-50">
          <Card.Body>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <CheckCircle className="text-green-500 mr-2" size={24} />
                <h3 className="font-semibold text-green-700">Client Found</h3>
              </div>
              <Badge variant="success">Active</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center p-3 bg-white rounded-lg">
                <User size={18} className="text-gray-400 mr-3" />
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-medium">{foundClient.name}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-white rounded-lg">
                <Mail size={18} className="text-gray-400 mr-3" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{foundClient.email}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-white rounded-lg">
                <Briefcase size={18} className="text-gray-400 mr-3" />
                <div>
                  <p className="text-xs text-gray-500">User Type</p>
                  <p className="font-medium capitalize">{foundClient.userType?.replace('-', ' ')}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-white rounded-lg">
                <QrCode size={18} className="text-gray-400 mr-3" />
                <div>
                  <p className="text-xs text-gray-500">Client ID</p>
                  <p className="font-mono font-medium">{foundClient.clientId}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setFoundClient(null)}>
                Clear
              </Button>
              <Button variant="primary" className="flex-1" onClick={handleConnect}>
                View Client Details
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Client List */}
      {searchMethod === 'list' && (
        <div>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {clients?.data?.length || 0} of {clients?.total || 0} clients
                </p>
              </div>

              {/* Client Cards for Mobile, Table for Desktop */}
              <div className="hidden md:block">
                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documents</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Activity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {clients?.data?.map((client) => {
                          const progressPercentage = (client.documentsUploaded / client.documentsRequired) * 100;
                          
                          return (
                            <tr 
                              key={client.id} 
                              className="hover:bg-gray-50 cursor-pointer transition-colors"
                              onClick={() => navigate(`/ca/clients/${client.id}`)}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                    <span className="text-primary-700 font-medium">
                                      {client.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                    </span>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                                    <div className="text-sm text-gray-500 flex items-center">
                                      {getUserTypeIcon(client.userType)} {client.type || client.userType}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {getStatusBadge(client.status)}
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                  {client.documentsUploaded}/{client.documentsRequired}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="w-24">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-medium text-gray-700">
                                      {Math.round(progressPercentage)}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`${getProgressColor(client.documentsUploaded, client.documentsRequired)} h-2 rounded-full`}
                                      style={{ width: `${progressPercentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center text-sm text-gray-500">
                                  <Calendar size={14} className="mr-1" />
                                  {new Date(client.lastActivity).toLocaleDateString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <Button size="sm" variant="ghost">
                                  <ChevronRight size={16} />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

              {/* Mobile View - Card Grid */}
              <div className="md:hidden grid grid-cols-1 gap-4">
                {clients?.data?.map((client) => {
                  const progressPercentage = (client.documentsUploaded / client.documentsRequired) * 100;
                  
                  return (
                    <Card 
                      key={client.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/ca/clients/${client.id}`)}
                    >
                      <Card.Body>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-primary-700 font-bold text-lg">
                                {client.name?.split(' ').map(n => n[0]).join('') || 'U'}
                              </span>
                            </div>
                            <div className="ml-3">
                              <h3 className="font-semibold text-gray-900">{client.name}</h3>
                              <p className="text-sm text-gray-500 flex items-center">
                                {getUserTypeIcon(client.userType)} {client.type || client.userType}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(client.status)}
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <p className="text-xs text-gray-500">Documents</p>
                            <p className="font-medium">{client.documentsUploaded}/{client.documentsRequired}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Last Activity</p>
                            <p className="font-medium text-sm">
                              {new Date(client.lastActivity).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-700">Progress</span>
                            <span className="text-xs font-medium text-gray-700">{Math.round(progressPercentage)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`${getProgressColor(client.documentsUploaded, client.documentsRequired)} h-2 rounded-full`}
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Clients;







