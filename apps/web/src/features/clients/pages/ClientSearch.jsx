import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  User,
  Mail,
  Briefcase,
  QrCode,
  Scan,
  CheckCircle,
  XCircle,
  Loader
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Badge from 'components/ui/Badge';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuth } from '../../auth/context/AuthContext';
import axios from 'axios';

const ClientSearch = () => {
  const navigate = useNavigate();
  const [searchMethod, setSearchMethod] = useState('manual'); // 'manual' or 'scan'
  const [clientId, setClientId] = useState('');
  const [searching, setSearching] = useState(false);
  const [foundClient, setFoundClient] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Find Client</h1>
        <p className="text-gray-500 mt-2">
          Enter the client's unique ID to connect with them
        </p>
      </div>

      {/* Search Method Toggle */}
      <Card>
        <Card.Body>
          <div className="flex space-x-4">
            <button
              onClick={() => setSearchMethod('manual')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                searchMethod === 'manual'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <Search className={`mx-auto mb-2 ${
                searchMethod === 'manual' ? 'text-primary-500' : 'text-gray-400'
              }`} size={24} />
              <p className={`font-medium ${
                searchMethod === 'manual' ? 'text-primary-700' : 'text-gray-600'
              }`}>Manual Entry</p>
            </button>

            <button
              onClick={() => setSearchMethod('scan')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                searchMethod === 'scan'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <Scan className={`mx-auto mb-2 ${
                searchMethod === 'scan' ? 'text-primary-500' : 'text-gray-400'
              }`} size={24} />
              <p className={`font-medium ${
                searchMethod === 'scan' ? 'text-primary-700' : 'text-gray-600'
              }`}>Scan QR Code</p>
            </button>
          </div>
        </Card.Body>
      </Card>

      {searchMethod === 'manual' && (
        <Card>
          <Card.Body className="space-y-4">
            <Input
              label="Client ID"
              value={clientId}
              onChange={(e) => setClientId(e.target.value.toUpperCase())}
              placeholder="TV-2024-ABC123"
              icon={<Search size={18} />}
              error={error}
            />

            <Button
              variant="primary"
              onClick={handleSearch}
              loading={searching}
              disabled={searching}
              className="w-full"
            >
              Search Client
            </Button>
          </Card.Body>
        </Card>
      )}

      {searchMethod === 'scan' && (
        <Card>
          <Card.Body className="text-center py-8">
            <div className="bg-gray-100 w-64 h-64 mx-auto rounded-lg flex items-center justify-center">
              <Scan size={64} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Position the QR code within the frame to scan
            </p>
            <Button variant="primary" className="mt-4">
              Start Camera
            </Button>
          </Card.Body>
        </Card>
      )}

      {/* Search Results */}
      {searching && (
        <Card className="text-center py-8">
          <Loader className="animate-spin mx-auto mb-4" size={32} />
          <p>Searching for client...</p>
        </Card>
      )}

      {foundClient && (
        <Card className="border-success-200 bg-success-50">
          <Card.Body>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <CheckCircle className="text-success-500 mr-2" size={24} />
                <h3 className="font-semibold text-success-700">Client Found</h3>
              </div>
              <Badge variant="success">Active</Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center p-3 bg-white rounded-lg">
                <User size={18} className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{foundClient.name}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-white rounded-lg">
                <Mail size={18} className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{foundClient.email}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-white rounded-lg">
                <Briefcase size={18} className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">User Type</p>
                  <p className="font-medium capitalize">{foundClient.userType?.replace('-', ' ')}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-white rounded-lg">
                <QrCode size={18} className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Client ID</p>
                  <p className="font-mono font-medium">{foundClient.clientId}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button variant="primary" className="flex-1" onClick={handleConnect}>
                Connect Client
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ClientSearch;







