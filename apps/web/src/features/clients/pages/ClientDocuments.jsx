import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Eye, 
  ChevronLeft,
  Search,
  Filter,
  Calendar,
  User,
  Mail,
  Phone,
  Briefcase,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  File,
  Image,
  FileSpreadsheet
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';
import Input from 'components/ui/Input';
import Avatar from 'components/ui/Avatar';

const ClientDocuments = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedDocs, setSelectedDocs] = useState([]);

  // Mock client data
  const client = {
    id: id,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(416) 555-0123',
    businessType: 'Gig Worker',
    clientSince: '2023-01-15',
    status: 'active',
  };

  // Mock documents data
  const documents = [
    {
      id: '1',
      name: 'T4 Slip 2024.pdf',
      type: 'pdf',
      category: 'tax',
      date: '2024-03-15',
      size: '245 KB',
      status: 'verified',
      uploadedBy: 'Client',
    },
    {
      id: '2',
      name: 'Business Income Statement Q1.jpg',
      type: 'image',
      category: 'income',
      date: '2024-03-10',
      size: '512 KB',
      status: 'pending',
      uploadedBy: 'Client',
    },
    {
      id: '3',
      name: 'Fuel Receipts March.xlsx',
      type: 'spreadsheet',
      category: 'expenses',
      date: '2024-03-08',
      size: '128 KB',
      status: 'verified',
      uploadedBy: 'Client',
    },
    {
      id: '4',
      name: 'Vehicle Maintenance Records.pdf',
      type: 'pdf',
      category: 'vehicle',
      date: '2024-03-05',
      size: '1.2 MB',
      status: 'verified',
      uploadedBy: 'Client',
    },
    {
      id: '5',
      name: 'GST Return Q1 2024.pdf',
      type: 'pdf',
      category: 'tax',
      date: '2024-03-01',
      size: '890 KB',
      status: 'pending_review',
      uploadedBy: 'CA',
    },
    {
      id: '6',
      name: 'Business License.pdf',
      type: 'pdf',
      category: 'business',
      date: '2024-02-28',
      size: '450 KB',
      status: 'verified',
      uploadedBy: 'Client',
    },
  ];

  const documentTypes = [
    { id: 'all', label: 'All Documents', icon: FileText },
    { id: 'tax', label: 'Tax Documents', icon: FileText },
    { id: 'income', label: 'Income', icon: FileSpreadsheet },
    { id: 'expenses', label: 'Expenses', icon: FileText },
    { id: 'vehicle', label: 'Vehicle', icon: FileText },
    { id: 'business', label: 'Business', icon: Briefcase },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle size={16} className="text-success-500" />;
      case 'pending':
      case 'pending_review':
        return <Clock size={16} className="text-warning-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Pending';
      case 'pending_review':
        return 'Needs Review';
      default:
        return status;
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText size={20} className="text-warning-500" />;
      case 'image':
        return <Image size={20} className="text-primary-500" />;
      case 'spreadsheet':
        return <FileSpreadsheet size={20} className="text-success-500" />;
      default:
        return <File size={20} className="text-gray-500" />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || doc.category === filterType;
    return matchesSearch && matchesType;
  });

  const toggleDocument = (docId) => {
    setSelectedDocs(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const selectAll = () => {
    if (selectedDocs.length === filteredDocuments.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(filteredDocuments.map(doc => doc.id));
    }
  };

  const handleBulkVerify = () => {
    // Handle bulk verify
    console.log('Verifying documents:', selectedDocs);
  };

  const handleBulkDownload = () => {
    // Handle bulk download
    console.log('Downloading documents:', selectedDocs);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(`/ca/clients/${id}`)}
                className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <ChevronLeft size={20} />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Client Documents</h1>
            </div>
            {selectedDocs.length > 0 && (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDownload}
                >
                  <Download size={16} className="mr-2" />
                  Download ({selectedDocs.length})
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleBulkVerify}
                >
                  <CheckCircle size={16} className="mr-2" />
                  Verify Selected
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Client Info */}
        <div className="w-80 border-r border-gray-200 bg-white p-6 hidden lg:block">
          <div className="text-center mb-6">
            <Avatar name={client.name} size="xl" className="mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">{client.name}</h2>
            <Badge variant={client.status === 'active' ? 'success' : 'warning'} className="mt-2">
              {client.status}
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <Mail size={18} className="mr-3 text-gray-400" />
              <span className="text-sm">{client.email}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Phone size={18} className="mr-3 text-gray-400" />
              <span className="text-sm">{client.phone}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Briefcase size={18} className="mr-3 text-gray-400" />
              <span className="text-sm">{client.businessType}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar size={18} className="mr-3 text-gray-400" />
              <span className="text-sm">Client since {client.clientSince}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary-500">{documents.length}</p>
                <p className="text-xs text-gray-500">Total Docs</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-success-500">
                  {documents.filter(d => d.status === 'verified').length}
                </p>
                <p className="text-xs text-gray-500">Verified</p>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            fullWidth
            className="mt-6"
            onClick={() => {/* Handle upload */}}
          >
            <Upload size={18} className="mr-2" />
            Upload Document
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Search and Filter Bar */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search size={18} />}
              />
            </div>
            <Button variant="outline" onClick={() => {}}>
              <Filter size={18} className="mr-2" />
              Filter
            </Button>
          </div>

          {/* Document Type Tabs */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            {documentTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setFilterType(type.id)}
                className={`
                  flex items-center px-4 py-2 rounded-lg whitespace-nowrap transition-colors
                  ${filterType === type.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }
                `}
              >
                <type.icon size={16} className="mr-2" />
                {type.label}
              </button>
            ))}
          </div>

          {/* Select All Bar */}
          {filteredDocuments.length > 0 && (
            <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-lg border border-gray-200">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedDocs.length === filteredDocuments.length}
                  onChange={selectAll}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Select All ({filteredDocuments.length} documents)
                </span>
              </label>
              <span className="text-sm text-gray-500">
                {selectedDocs.length} selected
              </span>
            </div>
          )}

          {/* Documents List */}
          <div className="space-y-3">
            {filteredDocuments.map(doc => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedDocs.includes(doc.id)}
                    onChange={() => toggleDocument(doc.id)}
                    className="mr-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  
                  <div className="flex-1 flex items-center">
                    <div className="mr-4">
                      {getFileIcon(doc.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-900">{doc.name}</h3>
                        <Badge
                          variant={
                            doc.status === 'verified' ? 'success' :
                            doc.status === 'pending' ? 'warning' : 'info'
                          }
                          className="ml-3"
                        >
                          <span className="flex items-center">
                            {getStatusIcon(doc.status)}
                            <span className="ml-1">{getStatusText(doc.status)}</span>
                          </span>
                        </Badge>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span>{doc.date}</span>
                        <span className="mx-2">•</span>
                        <span>{doc.size}</span>
                        <span className="mx-2">•</span>
                        <span>Uploaded by {doc.uploadedBy}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {/* Handle view */}}
                      className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => {/* Handle download */}}
                      className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "This client hasn't uploaded any documents yet"}
              </p>
              <Button variant="primary" onClick={() => {/* Handle upload */}}>
                <Upload size={18} className="mr-2" />
                Upload First Document
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDocuments;







