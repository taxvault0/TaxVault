import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from 'services/api';
import {
  MapPin,
  Search,
  Filter,
  Star,
  Globe,
  Phone,
  ChevronRight,
  Navigation,
  X,
  Briefcase,
  Car,
  Building2,
  FileText,
  CalendarDays,
  Languages,
  DollarSign,
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';
import { useAuth } from '../../auth/context/AuthContext';

const getUserTaxProfile = (user) => {
  if (user?.taxProfile) return user.taxProfile;

  return {
    employment:
      user?.userType === 'employee' ||
      user?.userType === 'regular' ||
      !user?.userType,
    gigWork: user?.userType === 'gig-worker',
    selfEmployment:
      user?.userType === 'self-employed' ||
      user?.userType === 'contractor',
    incorporatedBusiness:
      user?.userType === 'Business-owner' ||
      user?.userType === 'small-business' ||
      user?.userType === 'business',
  };
};

const SPECIALIZATIONS = [
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

const SERVICES = [
  { value: 'personal-tax', label: 'Personal Tax' },
  { value: 'corporate-tax', label: 'Corporate Tax' },
  { value: 'gst-hst', label: 'GST/HST' },
  { value: 'payroll', label: 'Payroll' },
  { value: 'bookkeeping', label: 'Bookkeeping' },
  { value: 'financial-planning', label: 'Financial Planning' },
];

const PROVINCES = [
  { value: 'all', label: 'All Provinces' },
  { value: 'AB', label: 'Alberta' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NL', label: 'Newfoundland and Labrador' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'NT', label: 'Northwest Territories' },
  { value: 'NU', label: 'Nunavut' },
  { value: 'ON', label: 'Ontario' },
  { value: 'PE', label: 'Prince Edward Island' },
  { value: 'QC', label: 'Quebec' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'YT', label: 'Yukon' },
];

const LANGUAGES = [
  { value: 'all', label: 'All Languages' },
  { value: 'english', label: 'English' },
  { value: 'french', label: 'French' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'punjabi', label: 'Punjabi' },
  { value: 'mandarin', label: 'Mandarin' },
  { value: 'cantonese', label: 'Cantonese' },
  { value: 'arabic', label: 'Arabic' },
];

const PRICE_RANGES = [
  { value: 'all', label: 'Any Price' },
  { value: '0-100', label: '$0 - $100' },
  { value: '100-250', label: '$100 - $250' },
  { value: '250-500', label: '$250 - $500' },
  { value: '500-100000', label: '$500+' },
];

const getSpecializationLabel = (value) => {
  const match = SPECIALIZATIONS.find((item) => item.value === value);
  return match ? match.label : value;
};

const getServiceLabel = (value) => {
  const match = SERVICES.find((item) => item.value === value);
  return match ? match.label : value;
};

const normalizeWebsite = (website) => {
  if (!website) return '';
  if (website.startsWith('http://') || website.startsWith('https://')) {
    return website;
  }
  return `https://${website}`;
};

const formatCurrencyRange = (minFee, maxFee) => {
  if (minFee == null && maxFee == null) return 'Price not listed';
  if (minFee != null && maxFee != null) return `$${minFee} - $${maxFee}`;
  if (minFee != null) return `From $${minFee}`;
  return `Up to $${maxFee}`;
};

const formatAvailabilitySlot = (slot) => {
  if (!slot?.start) return '';
  try {
    return new Date(slot.start).toLocaleString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return slot.start;
  }
};

const FindCA = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const taxProfile = getUserTaxProfile(user);

  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locationDenied, setLocationDenied] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    acceptingNewClients: 'all',
    specialization: 'all',
    province: user?.province || 'all',
    language: 'all',
    priceRange: 'all',
    distance: 50,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCA, setSelectedCA] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');

  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const [availabilitySlots, setAvailabilitySlots] = useState([]);

  const recommendedSpecializations = useMemo(() => {
    const items = [];
    if (taxProfile.employment) items.push('employment-income');
    if (taxProfile.gigWork) items.push('gig-economy', 'rideshare');
    if (taxProfile.selfEmployment) items.push('self-employed', 'gst-hst');
    if (taxProfile.incorporatedBusiness) {
      items.push('corporate-tax', 'small-business', 'payroll');
    }
    return items;
  }, [taxProfile]);

  const profileBadges = [
    taxProfile.employment && { key: 'employment', label: 'Employment', icon: Briefcase },
    taxProfile.gigWork && { key: 'gig', label: 'Gig Work', icon: Car },
    taxProfile.selfEmployment && { key: 'self', label: 'Self-Employment', icon: FileText },
    taxProfile.incorporatedBusiness && { key: 'business', label: 'Business', icon: Building2 },
  ].filter(Boolean);

  const mapBackendCA = useCallback((ca) => {
    const displayName =
      ca?.fullName ||
      ca?.name ||
      ca?.user?.name ||
      'Chartered Accountant';

    const designation = ca?.designation || ca?.caDesignation || 'CA';

    return {
      id: ca?._id || ca?.id,
      firmName: ca?.firmName || 'Independent Practice',
      user: {
        id: ca?._id || ca?.id,
        name: `${displayName}${designation ? `, ${designation}` : ''}`,
      },
      rating: Number(ca?.rating || 0),
      reviewCount: Number(ca?.reviewCount || 0),
      distance: ca?.distanceKm != null ? Number(ca.distanceKm) : null,
      specializations: Array.isArray(ca?.areasOfExpertise) ? ca.areasOfExpertise : [],
      services: Array.isArray(ca?.serviceOfferings) ? ca.serviceOfferings : [],
      languages: Array.isArray(ca?.languages) ? ca.languages : [],
      acceptingNewClients: !!ca?.acceptingNewClients,
      verified: !!(ca?.isVerified || ca?.verified),
      bio:
        ca?.bio ||
        'Experienced tax professional available to support individuals and businesses.',
      phone: ca?.phone || ca?.firmPhone || '',
      website: ca?.website || ca?.firmWebsite || '',
      province: ca?.province || '',
      city: ca?.city || '',
      minFee: ca?.minimumFee != null ? Number(ca.minimumFee) : null,
      maxFee: ca?.maximumFee != null ? Number(ca.maximumFee) : null,
      nextAvailable: ca?.nextAvailable || null,
    };
  }, []);

  const fetchCAs = useCallback(
  async (override = {}) => {
    try {
      setLoading(true);
      setError('');

      const params = {
        q: override.searchTerm ?? searchTerm.trim(),
        acceptingNewClients:
          override.acceptingNewClients ?? filters.acceptingNewClients,
        specialization: override.specialization ?? filters.specialization,
        province: override.province ?? filters.province,
        language: override.language ?? filters.language,
        priceRange: override.priceRange ?? filters.priceRange,
        maxDistanceKm: override.distance ?? filters.distance,
        recommendedFor: recommendedSpecializations.join(','),
      };

      // Keep geo disabled for now until page is stable
      // if (location.lat != null && location.lng != null) {
      //   params.lat = location.lat;
      //   params.lng = location.lng;
      //   params.useGeo = true;
      // }

      const response = await api.get('/ca/search', { params });

      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data?.results)
        ? response.data.results
        : [];

      const mappedResults = data.map(mapBackendCA);

      setSearchResults(mappedResults);
    } catch (err) {
      console.error('Failed to load CAs:', err);
      setError(err.response?.data?.message || 'Failed to load CAs');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  },
  [
    filters,
    mapBackendCA,
    recommendedSpecializations,
    searchTerm,
  ]
);

  const fetchAvailability = useCallback(async (caId) => {
    try {
      setAvailabilityLoading(true);
      setAvailabilityError('');
      setAvailabilitySlots([]);

      const response = await api.get(`/ca/profile/${caId}/availability`, {
        params: { days: 14 },
      });

      const slots =
        response?.data?.data?.slots ||
        response?.data?.slots ||
        response?.data?.availability ||
        [];

      setAvailabilitySlots(Array.isArray(slots) ? slots : []);
    } catch (err) {
      console.error('Failed to load availability:', err);
      setAvailabilityError(
        err.response?.data?.message || 'Could not load availability'
      );
      setAvailabilitySlots([]);
    } finally {
      setAvailabilityLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationDenied(true);
      fetchCAs();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setLocationDenied(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, [fetchCAs]);

  useEffect(() => {
    fetchCAs();
  }, [location.lat, location.lng, fetchCAs]);

  useEffect(() => {
    if (selectedCA?.id) {
      fetchAvailability(selectedCA.id);
    } else {
      setAvailabilitySlots([]);
      setAvailabilityError('');
      setAvailabilityLoading(false);
    }
  }, [selectedCA, fetchAvailability]);

  const handleSearch = () => {
    fetchCAs();
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const sortedResults = useMemo(() => {
    const results = [...searchResults];

    results.sort((a, b) => {
      const aScore = (a.specializations || []).filter((item) =>
        recommendedSpecializations.includes(item)
      ).length;
      const bScore = (b.specializations || []).filter((item) =>
        recommendedSpecializations.includes(item)
      ).length;

      if (bScore !== aScore) return bScore - aScore;

      if (a.distance != null && b.distance != null) {
        return a.distance - b.distance;
      }

      return (b.rating || 0) - (a.rating || 0);
    });

    return results;
  }, [recommendedSpecializations, searchResults]);

  const CADetailModal = ({ ca, onClose }) => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                  <span className="text-2xl font-bold text-primary-600">
                    {ca.user?.name?.charAt(0) || 'C'}
                  </span>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold">{ca.firmName}</h3>
                  <p className="text-gray-500">{ca.user?.name}</p>
                  {(ca.city || ca.province) && (
                    <p className="mt-1 text-sm text-gray-500">
                      {[ca.city, ca.province].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              </div>

              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {ca.acceptingNewClients ? (
                <Badge variant="success">Accepting New Clients</Badge>
              ) : (
                <Badge variant="error">Not Accepting Clients</Badge>
              )}
              {ca.verified && <Badge variant="info">Verified</Badge>}
              <Badge variant="gold">{formatCurrencyRange(ca.minFee, ca.maxFee)}</Badge>
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

            {ca.distance != null && (
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Navigation size={14} className="mr-1" />
                {ca.distance} km away
              </div>
            )}

            <p className="mt-4 text-gray-700">{ca.bio}</p>

            <div className="mt-4">
              <h4 className="mb-2 font-medium">Specializations</h4>
              <div className="flex flex-wrap gap-2">
                {(ca.specializations || []).map((spec) => (
                  <Badge key={spec} variant="info">
                    {getSpecializationLabel(spec)}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="mb-2 font-medium">Services Offered</h4>
              <div className="flex flex-wrap gap-2">
                {(ca.services || []).map((service) => (
                  <Badge key={service} variant="success">
                    {getServiceLabel(service)}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="mb-2 font-medium">Languages</h4>
              <div className="flex flex-wrap gap-2">
                {(ca.languages || []).map((lang) => (
                  <Badge key={lang} variant="gold">
                    {String(lang).charAt(0).toUpperCase() + String(lang).slice(1)}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center">
                <CalendarDays size={18} className="mr-2 text-primary-500" />
                <h4 className="font-medium">Availability Calendar</h4>
              </div>

              {availabilityLoading ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                  Loading available slots...
                </div>
              ) : availabilityError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  {availabilityError}
                </div>
              ) : availabilitySlots.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                  No upcoming availability published yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {availabilitySlots.slice(0, 6).map((slot, index) => (
                    <div
                      key={`${slot.start || 'slot'}-${index}`}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                    >
                      <div className="font-medium text-gray-800">
                        {formatAvailabilitySlot(slot)}
                      </div>
                      {slot.type && (
                        <div className="mt-1 text-xs text-gray-500">
                          {slot.type}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                  href={normalizeWebsite(ca.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center rounded-lg bg-gray-50 p-3 hover:bg-gray-100"
                >
                  <Globe size={18} className="mr-2 text-primary-500" />
                  <span>Website</span>
                </a>
              )}

              <button
                type="button"
                onClick={() =>
                  navigate(`/ca/${ca.id}/availability`, {
                    state: { ca },
                  })
                }
                className="flex items-center rounded-lg bg-gray-50 p-3 hover:bg-gray-100"
              >
                <CalendarDays size={18} className="mr-2 text-primary-500" />
                <span>Full Calendar</span>
              </button>
            </div>

            <div className="mt-6 flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() =>
                  navigate(`/ca/${ca.id}/availability`, {
                    state: { ca },
                  })
                }
              >
                Check Availability
              </Button>

              <Button
                variant="primary"
                className="flex-1"
                disabled={!ca.acceptingNewClients}
                onClick={() =>
                  navigate(`/consultations/request/${ca.id}`, {
                    state: { ca },
                  })
                }
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
          {location.lat && location.lng ? (
            <p className="mt-2 text-xs text-primary-700">
              Using your current location to sort by nearby CAs.
            </p>
          ) : locationDenied ? (
            <p className="mt-2 text-xs text-primary-700">
              Location permission was not granted. Showing general results instead.
            </p>
          ) : null}
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
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
            <div className="mt-4 grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Accepting Clients
                </label>
                <select
                  value={filters.acceptingNewClients}
                  onChange={(e) =>
                    handleFilterChange('acceptingNewClients', e.target.value)
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
                    handleFilterChange('specialization', e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  {SPECIALIZATIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Province
                </label>
                <select
                  value={filters.province}
                  onChange={(e) =>
                    handleFilterChange('province', e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  {PROVINCES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Language
                </label>
                <div className="relative">
                  <Languages
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <select
                    value={filters.language}
                    onChange={(e) =>
                      handleFilterChange('language', e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Price Range
                </label>
                <div className="relative">
                  <DollarSign
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <select
                    value={filters.priceRange}
                    onChange={(e) =>
                      handleFilterChange('priceRange', e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3"
                  >
                    {PRICE_RANGES.map((price) => (
                      <option key={price.value} value={price.value}>
                        {price.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Max Distance (km)
                </label>
                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={filters.distance}
                  onChange={(e) =>
                    handleFilterChange('distance', parseInt(e.target.value, 10))
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

      {error && (
        <Card className="border-red-200 bg-red-50">
          <Card.Body>
            <p className="text-sm text-red-600">{error}</p>
          </Card.Body>
        </Card>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary-500" />
            <p className="mt-4 text-gray-500">Searching for CAs near you...</p>
          </div>
        ) : sortedResults.length === 0 ? (
          <Card className="py-12 text-center">
            <Card.Body>
              <Search size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">No CAs found</h3>
              <p className="text-gray-500">
                Try adjusting your filters or search area
              </p>
            </Card.Body>
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
                      {ca.user?.name?.charAt(0) || 'C'}
                    </span>
                  </div>

                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{ca.firmName}</h3>
                        <p className="text-gray-500">{ca.user?.name}</p>
                        {(ca.city || ca.province) && (
                          <p className="mt-1 text-xs text-gray-500">
                            {[ca.city, ca.province].filter(Boolean).join(', ')}
                          </p>
                        )}
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

                    <div className="mt-2 flex flex-wrap items-center">
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

                      {ca.distance != null && (
                        <>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-xs text-gray-500">
                            {ca.distance} km away
                          </span>
                        </>
                      )}

                      {(ca.minFee != null || ca.maxFee != null) && (
                        <>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-xs text-gray-500">
                            {formatCurrencyRange(ca.minFee, ca.maxFee)}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {(ca.specializations || []).slice(0, 3).map((spec) => (
                        <Badge key={spec} variant="info" size="sm">
                          {getSpecializationLabel(spec)}
                        </Badge>
                      ))}

                      {(ca.specializations || []).length > 3 && (
                        <Badge variant="info" size="sm">
                          +{ca.specializations.length - 3}
                        </Badge>
                      )}
                    </div>

                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">{ca.bio}</p>

                    {ca.nextAvailable && (
                      <p className="mt-2 text-xs font-medium text-primary-600">
                        Next available: {formatAvailabilitySlot({ start: ca.nextAvailable })}
                      </p>
                    )}
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