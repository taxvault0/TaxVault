import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  FileText,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  AlertCircle,
  CheckCircle,
  Upload,
  Download,
  Edit
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';
import Input from 'components/ui/Input';
import { PROVINCES } from 'constants/provinces';

const BusinessInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [province, setProvince] = useState('ON');

  const [businessInfo, setBusinessInfo] = useState({
    businessName: "Marcus' Convenience Store",
    businessNumber: "123456789",
    businessType: "Retail - Convenience Store",
    yearEstablished: "2018",
    address: "123 Main Street",
    city: "Toronto",
    province: "ON",
    postalCode: "M5V 2H1",
    phone: "(416) 555-0123",
    email: "marcus@store.ca",
    website: "www.marcusstore.ca",
    franchise: false,
    franchiseName: "",
    franchiseNumber: ""
  });

  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Business License',
      status: 'verified',
      expiryDate: '2024-12-31',
      uploadedDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Business Number (BN) Certificate',
      status: 'verified',
      expiryDate: null,
      uploadedDate: '2024-01-15'
    },
    {
      id: 3,
      name: 'Notice of Assessment (Previous Year)',
      status: 'verified',
      expiryDate: null,
      uploadedDate: '2024-02-20'
    },
    {
      id: 4,
      name: 'Lease Agreement',
      status: 'verified',
      expiryDate: '2025-12-31',
      uploadedDate: '2024-01-10'
    },
    {
      id: 5,
      name: 'Franchise Agreement',
      status: 'pending',
      expiryDate: '2030-01-15',
      uploadedDate: null
    },
    {
      id: 6,
      name: 'Insurance Certificate',
      status: 'pending',
      expiryDate: '2024-06-30',
      uploadedDate: null
    }
  ]);

  const provinceInfo = PROVINCES.find(p => p.id === province);

  const handleFileUpload = (docId) => {
    // Simulate file upload
    alert(`Upload document ${docId}`);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'verified': return 'success';
      case 'pending': return 'warning';
      case 'expired': return 'error';
      default: return 'info';
    }
  };

  const checkExpiryStatus = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysLeft = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return 'expired';
    if (daysLeft < 30) return 'warning';
    return 'valid';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Information</h1>
          <p className="text-gray-500 mt-1">Manage your business profile and documents</p>
        </div>
        <Button
          variant={isEditing ? 'primary' : 'outline'}
          onClick={() => setIsEditing(!isEditing)}
          icon={<Edit size={16} />}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      {/* Province Info Banner */}
      <Card className="bg-primary-50 border-primary-200">
        <Card.Body>
          <div className="flex items-center">
            <MapPin className="text-primary-500 mr-3" size={20} />
            <div className="flex-1">
              <p className="font-medium text-primary-700">Business Province: {provinceInfo?.name}</p>
              <p className="text-sm text-primary-600">
                Tax System: {provinceInfo?.taxSystem} | 
                Rates: {provinceInfo?.taxSystem === 'GST only' && `GST ${provinceInfo.gst}%`}
                {provinceInfo?.taxSystem === 'GST + PST' && `GST ${provinceInfo.gst}% + PST ${provinceInfo.pst}%`}
                {provinceInfo?.taxSystem === 'GST + QST' && `GST ${provinceInfo.gst}% + QST ${provinceInfo.qst}%`}
                {provinceInfo?.taxSystem === 'HST' && `HST ${provinceInfo.hst}%`}
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Business Details */}
      <Card>
        <Card.Header>
          <h3 className="font-semibold">Business Details</h3>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Business Name"
              value={businessInfo.businessName}
              onChange={(e) => setBusinessInfo({...businessInfo, businessName: e.target.value})}
              disabled={!isEditing}
              icon={<Building size={18} />}
            />

            <Input
              label="Business Number (BN)"
              value={businessInfo.businessNumber}
              onChange={(e) => setBusinessInfo({...businessInfo, businessNumber: e.target.value})}
              disabled={!isEditing}
              icon={<FileText size={18} />}
            />

            <Input
              label="Business Type"
              value={businessInfo.businessType}
              onChange={(e) => setBusinessInfo({...businessInfo, businessType: e.target.value})}
              disabled={!isEditing}
            />

            <Input
              label="Year Established"
              value={businessInfo.yearEstablished}
              onChange={(e) => setBusinessInfo({...businessInfo, yearEstablished: e.target.value})}
              disabled={!isEditing}
              icon={<Calendar size={18} />}
            />

            <div className="col-span-2">
              <Input
                label="Street Address"
                value={businessInfo.address}
                onChange={(e) => setBusinessInfo({...businessInfo, address: e.target.value})}
                disabled={!isEditing}
                icon={<MapPin size={18} />}
              />
            </div>

            <Input
              label="City"
              value={businessInfo.city}
              onChange={(e) => setBusinessInfo({...businessInfo, city: e.target.value})}
              disabled={!isEditing}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
              <select
                value={businessInfo.province}
                onChange={(e) => setBusinessInfo({...businessInfo, province: e.target.value})}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
              >
                {PROVINCES.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <Input
              label="Postal Code"
              value={businessInfo.postalCode}
              onChange={(e) => setBusinessInfo({...businessInfo, postalCode: e.target.value})}
              disabled={!isEditing}
            />

            <Input
              label="Phone"
              value={businessInfo.phone}
              onChange={(e) => setBusinessInfo({...businessInfo, phone: e.target.value})}
              disabled={!isEditing}
              icon={<Phone size={18} />}
            />

            <Input
              label="Email"
              type="email"
              value={businessInfo.email}
              onChange={(e) => setBusinessInfo({...businessInfo, email: e.target.value})}
              disabled={!isEditing}
              icon={<Mail size={18} />}
            />

            <Input
              label="Website"
              value={businessInfo.website}
              onChange={(e) => setBusinessInfo({...businessInfo, website: e.target.value})}
              disabled={!isEditing}
              icon={<Globe size={18} />}
            />
          </div>

          {/* Franchise Information */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center mb-4">
              <Award className="text-primary-500 mr-2" size={20} />
              <h4 className="font-medium">Franchise Information</h4>
            </div>
            
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="isFranchise"
                checked={businessInfo.franchise}
                onChange={(e) => setBusinessInfo({...businessInfo, franchise: e.target.checked})}
                disabled={!isEditing}
                className="w-4 h-4 text-primary-500 rounded"
              />
              <label htmlFor="isFranchise" className="ml-2 text-sm text-gray-700">
                This is a franchise location
              </label>
            </div>

            {businessInfo.franchise && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Franchise Name"
                  value={businessInfo.franchiseName}
                  onChange={(e) => setBusinessInfo({...businessInfo, franchiseName: e.target.value})}
                  disabled={!isEditing}
                />
                <Input
                  label="Franchise Number"
                  value={businessInfo.franchiseNumber}
                  onChange={(e) => setBusinessInfo({...businessInfo, franchiseNumber: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Required Documents */}
      <Card>
        <Card.Header>
          <h3 className="font-semibold">Required Documents</h3>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            {documents.map(doc => {
              const expiryStatus = checkExpiryStatus(doc.expiryDate);
              
              return (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center">
                      <FileText size={18} className="text-gray-400 mr-2" />
                      <span className="font-medium">{doc.name}</span>
                    </div>
                    
                    {doc.uploadedDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Uploaded: {doc.uploadedDate}
                      </p>
                    )}
                    
                    {doc.expiryDate && (
                      <p className={`text-xs mt-1 ${
                        expiryStatus === 'expired' ? 'text-red-600' :
                        expiryStatus === 'warning' ? 'text-yellow-600' :
                        'text-gray-500'
                      }`}>
                        Expires: {doc.expiryDate}
                        {expiryStatus === 'expired' && ' (Expired)'}
                        {expiryStatus === 'warning' && ' (Expiring soon)'}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <Badge variant={getStatusVariant(expiryStatus === 'expired' ? 'error' : doc.status)}>
                      {expiryStatus === 'expired' ? 'Expired' : doc.status}
                    </Badge>

                    {doc.status === 'verified' ? (
                      <button className="p-2 hover:bg-white rounded-lg">
                        <Download size={18} className="text-gray-500" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFileUpload(doc.id)}
                        className="p-2 hover:bg-white rounded-lg"
                      >
                        <Upload size={18} className="text-primary-500" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CRA Notice */}
          <div className="mt-6 p-4 bg-warning-50 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="text-warning-600 mr-3 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="text-sm font-medium text-warning-700">Keep Documents Updated</p>
                <p className="text-xs text-warning-600 mt-1">
                  Business licenses and permits must be kept current. Expired documents can result in penalties during a CRA audit.
                  Keep all documents for at least 6 years.
                </p>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BusinessInfo;







