import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Search,
  Filter,
  Star,
  Globe,
  Phone,
  MessageCircle,
  ChevronRight,
  Navigation,
  X,
  Briefcase,
  Car,
  Building2,
  FileText,
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';
import { useAuth } from '../../auth/context/AuthContext';

const getUserTaxProfile = (user) => {
  if (user?.taxProfile) return user.taxProfile;

  return {
    employment: user?.userType === 'employee' || user?.userType === 'regular' || !user?.userType,
    gigWork: user?.userType === 'gig-worker',
    selfEmployment: user?.userType === 'self-employed' || user?.userType === 'contractor',
    incorporatedBusiness:
      user?.userType === 'Business-owner' ||
      user?.userType === 'small-business' ||
      user?.userType === 'business',
  };
};

const FindCA = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const taxProfile = getUserTaxProfile(user);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    acceptingNewClients: 'all',
    specialization: 'all',
    distance: 50,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCA, setSelectedCA] = useState(null);

  const [searchResults] = useState([
    {
      id: 1,
      firmName: 'Chen & Associates',
      user: { name: 'David Chen, CPA', id: 1 },
      rating: 4.8,
      reviewCount: 124,
      distance: 2.3,
      specializations: ['corporate-tax', 'small-business', 'employment-income'],
      services: ['personal-tax', 'corporate-tax', 'gst-hst'],
      languages: ['english', 'mandarin'],
      acceptingNewClients: true,
      verified: true,
      bio: 'Specializing in employment, business, and incorporated tax planning.',
      phone: '(416) 555-0123',
      website: 'www.chenassociates.ca',
    },
    {
      id: 2,
      firmName: 'Thompson Tax Solutions',
      user: { name: 'Sarah Thompson, CA', id: 2 },
      rating: 4.9,
      reviewCount: 89,
      distance: 3.7,
      specializations: ['payroll', 'small-business', 'gst-hst'],
      services: ['payroll', 'bookkeeping', 'gst-hst'],
      languages: ['english', 'french'],
      acceptingNewClients: true,
      verified: true,
      bio: 'Strong fit for payroll, small business, and owner-managed corporations.',
      phone: '(416) 555-0456',
      website: 'www.thompsontax.ca',
    },
    {
      id: 3,
      firmName: 'Patel Professional Corp',
      user: { name: 'Michael Patel, CPA', id: 3 },
      rating: 4.7,
      reviewCount: 156,
      distance: 5.1,
      specializations: ['gig-economy', 'rideshare', 'self-employed', 'gst-hst'],
      services: ['personal-tax', 'gst-hst', 'bookkeeping'],
      languages: ['english', 'hindi'],
      acceptingNewClients: true,
      verified: true,
      bio: 'Expert in gig economy and self-employed taxes. Great for drivers, delivery, and side-income workers.',
      phone: '(416) 555-0789',
      website: 'www.patelcpa.ca',
    },
    {
      id: 4,
      firmName: 'Wong Financial',
      user: { name: 'Lisa Wong, CPA', id: 4 },
      rating: 4.9,
      reviewCount: 203,
      distance: 4.1,
      specializations: ['corporate-tax', 'investments', 'estate-planning'],
      services: ['corporate-tax', 'financial-planning', 'estate-planning'],
      languages: ['english', 'cantonese'],
      acceptingNewClients: false,
      verified: true,
      bio: 'Specializing in corporate structure, investment tax, and estate planning.',
      phone: '(416) 555-0234',
      website: 'www.wongfinancial.ca',
    },
  ]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 700);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {}
      );
    }

    return () => clearTimeout(timer);
  }, []);

  const recommendedSpecializations = useMemo(() => {
    const items = [];
    if (taxProfile.employment) items.push('employment-income');
    if (taxProfile.gigWork) items.push('gig-economy', 'rideshare');
    if (taxProfile.selfEmployment) items.push('self-employed', 'gst-hst');
    if (taxProfile.incorporatedBusiness) items.push('corporate-tax', 'small-business', 'payroll');
    return items;
  }, [taxProfile]);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  };

  const filteredResults = searchResults.filter((ca) => {
    if (
      filters.acceptingNewClients !== 'all' &&
      ca.acceptingNewClients !== (filters.acceptingNewClients === 'true')
    ) {
      return false;
    }

    if (
      filters.specialization !== 'all' &&
      !ca.specializations.includes(filters.specialization)
    ) {
      return false;
    }

    if (ca.distance > filters.distance) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const haystack = [
        ca.firmName,
        ca.user?.name,
        ca.bio,
        ...(ca.specializations || []),
        ...(ca.services || []),
      ]
        .join(' ')
        .toLowerCase();

      if (!haystack.includes(q)) return false;
    }

    return true;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    const aScore = a.specializations.filter((s) =>
      recommendedSpecializations.includes(s)
    ).length;
    const bScore = b.specializations.filter((s) =>
      recommendedSpecializations.includes(s)
    ).length;

    if (bScore !== aScore) return bScore - aScore;
    return a.distance - b.distance;
  });

  const specializations = [
    { value: 'all', label: 'All Specializations' },
    { value: 'employment-income', label: 'Employment Income' },
    { value: 'gig-economy', label: 'Gig Economy' },
    { value: 'rideshare', label: 'Rideshare & Delivery' },
    { value: 'self-employed', label: 'Self-Employment' },
    { value: 'small-business', label: 'Small Business' },
    { value: 'corporate-tax', label: 'Corporate Tax' },
    { value: 'gst-hst', label: 'GST/HST' },
    { value: 'payroll', label: 'Payroll' },
    { value: 'investments', label: 'Investments' },
  ];

  const services = [
    { value: 'personal-tax', label: 'Personal Tax' },
    { value: 'corporate-tax', label: 'Corporate Tax' },
    { value: 'gst-hst', label: 'GST/HST' },
    { value: 'payroll', label: 'Payroll' },
    { value: 'bookkeeping', label: 'Bookkeeping' },
    { value: 'financial-planning', label: 'Financial Planning' },
  ];

  const getSpecializationLabel = (value) => {
    const spec = specializations.find((s) => s.value === value);
    return spec ? spec.label : value;
  };

  const profileBadges = [
    taxProfile.employment && {
      key: 'employment',
      label: 'Employment',
      icon: Briefcase,
    },
    taxProfile.gigWork && {
      key: 'gig',
      label: 'Gig Work',
      icon: Car,
    },
    taxProfile.selfEmployment && {
      key: 'self',
      label: 'Self-Employment',
      icon: FileText,
    },
    taxProfile.incorporatedBusiness && {
      key: 'business',
      label: 'Business',
      icon: Building2,
    },
  ].filter(Boolean);

  const CADetailModal = ({ ca, onClose }) => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                  <span className="text-2xl font-bold text-primary-600">
                    {ca.user?.name?.charAt(0)}
                  </span>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold">{ca.firmName}</h3>
                  <p className="text-gray-500">{ca.user?.name}</p>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 flex items-center space-x-2">
              {ca.acceptingNewClients ? (
                <Badge variant="success">Accepting New Clients</Badge>
              ) : (
                <Badge variant="error">Not Accepting Clients</Badge>
              )}
              {ca.verified && <Badge variant="info">Verified</Badge>}
            </div>

            <div className="mt-4 flex items-center">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={
                      star <= Math.round(ca.rating)
                        ? 'fill-current text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {ca.rating} ({ca.reviewCount} reviews)
              </span>
            </div>

            {ca.distance && (
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Navigation size={14} className="mr-1" />
                {ca.distance} km away
              </div>
            )}

            <p className="mt-4 text-gray-700">{ca.bio}</p>

            <div className="mt-4">
              <h4 className="mb-2 font-medium">Specializations</h4>
              <div className="flex flex-wrap gap-2">
                {ca.specializations?.map((spec) => (
                  <Badge key={spec} variant="info">
                    {getSpecializationLabel(spec)}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="mb-2 font-medium">Services Offered</h4>
              <div className="flex flex-wrap gap-2">
                {ca.services?.map((service) => {
                  const s = services.find((item) => item.value === service);
                  return (
                    <Badge key={service} variant="success">
                      {s ? s.label : service}
                    </Badge>
                  );
                })}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="mb-2 font-medium">Languages</h4>
              <div className="flex flex-wrap gap-2">
                {ca.languages?.map((lang) => (
                  <Badge key={lang} variant="gold">
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              {ca.phone && (
                <a
                  href={`tel:${ca.phone}`}
                  className="flex items-center rounded-lg bg-gray-50 p-3 hover:bg-gray-100"
                >
                  <Phone size={18} className="mr-2 text-primary-500" />
                  <span>Call</span>
                </a>
              )}
              {ca.website && (
                <a
                  href={`https://${ca.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center rounded-lg bg-gray-50 p-3 hover:bg-gray-100"
                >
                  <Globe size={18} className="mr-2 text-primary-500" />
                  <span>Website</span>
                </a>
              )}
            </div>

            <div className="mt-6 flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate(`/ca-availability/${ca.id}`)}
              >
                Check Availability
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                disabled={!ca.acceptingNewClients}
                onClick={() => navigate(`/consultations/request/${ca.id}`)}
              >
                Request Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Find a Chartered Accountant
          </h1>
          <p className="mt-1 text-gray-500">
            Connect with verified CAs who match your tax needs
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {profileBadges.map((item) => {
            const Icon = item.icon;
            return (
              <Badge key={item.key} variant="info">
                <Icon size={14} className="mr-1" />
                {item.label}
              </Badge>
            );
          })}
        </div>
      </div>

      <Card className="border-primary-100 bg-primary-50">
        <Card.Body>
          <h3 className="font-semibold text-primary-800">Recommended for you</h3>
          <p className="mt-1 text-sm text-primary-600">
            Results are prioritized based on your active tax profiles.
          </p>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <MapPin
                className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Enter city, postal code, or specialty"
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button variant="primary" onClick={handleSearch} loading={loading}>
              <Search size={16} className="mr-2" />
              Search
            </Button>

            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter size={16} className="mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Accepting Clients
                </label>
                <select
                  value={filters.acceptingNewClients}
                  onChange={(e) =>
                    setFilters({ ...filters, acceptingNewClients: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="all">All</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Specialization
                </label>
                <select
                  value={filters.specialization}
                  onChange={(e) =>
                    setFilters({ ...filters, specialization: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  {specializations.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Max Distance (km)
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={filters.distance}
                  onChange={(e) =>
                    setFilters({ ...filters, distance: parseInt(e.target.value, 10) })
                  }
                  className="w-full"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Within {filters.distance} km
                </p>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary-500" />
            <p className="mt-4 text-gray-500">Searching for CAs near you...</p>
          </div>
        ) : sortedResults.length === 0 ? (
          <Card className="py-12 text-center">
            <Search size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">No CAs found</h3>
            <p className="text-gray-500">Try adjusting your filters or search area</p>
          </Card>
        ) : (
          sortedResults.map((ca) => (
            <Card
              key={ca.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => setSelectedCA(ca)}
            >
              <Card.Body>
                <div className="flex items-start">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                    <span className="text-2xl font-bold text-primary-600">
                      {ca.user?.name?.charAt(0)}
                    </span>
                  </div>

                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{ca.firmName}</h3>
                        <p className="text-gray-500">{ca.user?.name}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {ca.acceptingNewClients ? (
                          <Badge variant="success">Accepting</Badge>
                        ) : (
                          <Badge variant="error">Not Accepting</Badge>
                        )}
                        {ca.verified && <Badge variant="info">Verified</Badge>}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={
                              star <= Math.round(ca.rating)
                                ? 'fill-current text-yellow-400'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-xs text-gray-500">
                        {ca.rating} ({ca.reviewCount} reviews)
                      </span>
                      {ca.distance && (
                        <>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-xs text-gray-500">
                            {ca.distance} km away
                          </span>
                        </>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {ca.specializations?.slice(0, 3).map((spec) => (
                        <Badge key={spec} variant="info" size="sm">
                          {getSpecializationLabel(spec)}
                        </Badge>
                      ))}
                      {ca.specializations?.length > 3 && (
                        <Badge variant="info" size="sm">
                          +{ca.specializations.length - 3}
                        </Badge>
                      )}
                    </div>

                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">{ca.bio}</p>
                  </div>

                  <ChevronRight className="ml-4 text-gray-400" size={20} />
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>

      {selectedCA && (
        <CADetailModal ca={selectedCA} onClose={() => setSelectedCA(null)} />
      )}
    </div>
  );
};

export default FindCA;

