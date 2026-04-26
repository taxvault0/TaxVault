const mongoose = require('mongoose');
const CAProfile = require('./ca-profile.model');

const escapeRegex = (value = '') =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parsePriceRange = (value) => {
  if (!value || value === 'all') return null;

  const [rawMin, rawMax] = String(value).split('-');
  const min = Number(rawMin);
  const max = Number(rawMax);

  if (Number.isNaN(min) || Number.isNaN(max)) return null;

  return { min, max };
};

const normalizeArray = (value) => (Array.isArray(value) ? value : []);

const buildSearchOrConditions = (searchValue) => {
  if (!searchValue || !String(searchValue).trim()) return [];

  const regex = new RegExp(escapeRegex(String(searchValue).trim()), 'i');

  return [
    { firmName: regex },
    { bio: regex },
    { specializations: regex },
    { services: regex },
    { languages: regex },
    { otherLanguage: regex },
    { 'address.city': regex },
    { 'address.province': regex },
  ];
};

const formatDistanceKm = (distanceMeters) => {
  if (distanceMeters == null) return null;
  return Math.round((distanceMeters / 1000) * 10) / 10;
};

const formatProfileSummary = (profile, hasCoordinates = false, searchLat = null, searchLng = null) => {
  let distanceKm = null;

  if (profile.distanceMeters != null) {
    distanceKm = formatDistanceKm(profile.distanceMeters);
  } else if (
    hasCoordinates &&
    profile.location?.coordinates &&
    Array.isArray(profile.location.coordinates) &&
    profile.location.coordinates.length === 2
  ) {
    distanceKm = calculateDistance(
      parseFloat(searchLat),
      parseFloat(searchLng),
      profile.location.coordinates[1],
      profile.location.coordinates[0]
    );
  }

  return {
    _id: profile._id,
    id: profile._id,
    userId: profile.user?._id || profile.user || null,
    fullName: profile.user?.name || '',
    name: profile.user?.name || '',
    email: profile.user?.email || '',
    firmName: profile.firmName || '',
    bio: profile.bio || '',
    yearsOfExperience: profile.yearsOfExperience || 0,
    city: profile.address?.city || '',
    province: profile.address?.province || '',
    address: profile.address || null,
    serviceRadius: profile.serviceRadius || 0,
    distanceKm,
    areasOfExpertise: normalizeArray(profile.specializations),
    specializations: normalizeArray(profile.specializations),
    serviceOfferings: normalizeArray(profile.services),
    services: normalizeArray(profile.services),
    languages: normalizeArray(profile.languages),
    otherLanguage: profile.otherLanguage || '',
    phone: profile.phone || '',
    alternatePhone: profile.alternatePhone || '',
    firmPhone: profile.firmPhone || '',
    website: profile.website || '',
    availableFor: normalizeArray(profile.availableFor),
    acceptingNewClients: Boolean(profile.acceptingNewClients),
    availabilityStatus: profile.availabilityStatus || 'inactive',
    profileViews: profile.profileViews || 0,
    connectionRequests: profile.connectionRequests || 0,
    rating: profile.rating || 0,
    reviewCount: profile.reviewCount || 0,
    yearAdmitted: profile.yearAdmitted || null,
    licenseNumber: profile.licenseNumber || profile.caNumber || '',
    policyNumber: profile.policyNumber || '',
    peerReviewDate: profile.peerReviewDate || null,
    hoursOfOperation: profile.hoursOfOperation || {},
    minimumFee:
      profile.minimumFee != null && !Number.isNaN(Number(profile.minimumFee))
        ? Number(profile.minimumFee)
        : null,
    maximumFee:
      profile.maximumFee != null && !Number.isNaN(Number(profile.maximumFee))
        ? Number(profile.maximumFee)
        : null,
    nextAvailable: profile.nextAvailable || null,
    verified: Boolean(profile.verified),
    isVerified: Boolean(profile.verified),
    location: profile.location || null,
  };
};

// @desc    Search for CAs near a location / directory listing
// @route   GET /api/ca/search
exports.searchCAs = async (req, res) => {
  try {
    const {
      lat,
      lng,
      maxDistanceKm,
      maxDistance,
      specialization,
      service,
      acceptingNewClients,
      userType,
      search,
      q,
      language,
      province,
      priceRange,
      limit = 20,
      page = 1,
    } = req.query;

    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

    const requestedKm =
      parseInt(maxDistanceKm, 10) ||
      (parseInt(maxDistance, 10) ? Math.round(parseInt(maxDistance, 10) / 1000) : 50);

    const parsedMaxDistanceMeters = Math.max(requestedKm * 1000, 1000);

    const hasCoordinates =
      lat !== undefined &&
      lng !== undefined &&
      !Number.isNaN(parseFloat(lat)) &&
      !Number.isNaN(parseFloat(lng));

    const textSearch = q || search || '';
    const price = parsePriceRange(priceRange);

    const baseQuery = {
      verified: true,
    };

    if (acceptingNewClients === 'true') {
      baseQuery.acceptingNewClients = true;
    } else if (acceptingNewClients === 'false') {
      baseQuery.acceptingNewClients = false;
    }

    if (userType && userType !== 'all') {
      baseQuery.availableFor = { $in: [userType, 'all'] };
    }

    if (specialization && specialization !== 'all') {
      baseQuery.specializations = { $in: [specialization] };
    }

    if (service && service !== 'all') {
      baseQuery.services = { $in: [service] };
    }

    if (language && language !== 'all') {
      baseQuery.languages = { $in: [language] };
    }

    if (province && province !== 'all') {
      baseQuery['address.province'] = String(province).trim().toUpperCase();
    }

    const andConditions = [];

    const searchOrConditions = buildSearchOrConditions(textSearch);
    if (searchOrConditions.length > 0) {
      andConditions.push({ $or: searchOrConditions });
    }

    if (price) {
      andConditions.push({
        $or: [
          {
            minimumFee: {
              $gte: price.min,
              $lte: price.max,
            },
          },
          {
            maximumFee: {
              $gte: price.min,
              $lte: price.max,
            },
          },
          {
            $and: [
              { minimumFee: { $lte: price.min } },
              { maximumFee: { $gte: price.max } },
            ],
          },
        ],
      });
    }

    if (andConditions.length > 0) {
      baseQuery.$and = andConditions;
    }

    let profiles = [];
    let total = 0;

    if (hasCoordinates) {
      const aggregatePipeline = [
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            distanceField: 'distanceMeters',
            maxDistance: parsedMaxDistanceMeters,
            spherical: true,
            query: baseQuery,
          },
        },
        {
          $sort: {
            distanceMeters: 1,
            rating: -1,
            reviewCount: -1,
            createdAt: -1,
          },
        },
        {
          $facet: {
            results: [
              { $skip: (parsedPage - 1) * parsedLimit },
              { $limit: parsedLimit },
              {
                $lookup: {
                  from: 'users',
                  localField: 'user',
                  foreignField: '_id',
                  as: 'user',
                },
              },
              {
                $unwind: {
                  path: '$user',
                  preserveNullAndEmptyArrays: true,
                },
              },
            ],
            totalCount: [{ $count: 'count' }],
          },
        },
      ];

      const aggregateResult = await CAProfile.aggregate(aggregatePipeline);
      const facet = aggregateResult[0] || {};
      profiles = facet.results || [];
      total = facet.totalCount?.[0]?.count || 0;
    } else {
      const sort = { rating: -1, reviewCount: -1, createdAt: -1 };
      const skip = (parsedPage - 1) * parsedLimit;

      const result = await Promise.all([
        CAProfile.find(baseQuery)
          .populate('user', 'name email')
          .sort(sort)
          .skip(skip)
          .limit(parsedLimit)
          .lean(),
        CAProfile.countDocuments(baseQuery),
      ]);

      profiles = result[0];
      total = result[1];
    }

    const results = profiles.map((profile) =>
      formatProfileSummary(profile, hasCoordinates, lat, lng)
    );

    return res.json({
      success: true,
      data: results,
      results,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        pages: Math.ceil(total / parsedLimit),
      },
      total,
    });
  } catch (error) {
    console.error('Error searching CAs:', error);
    return res.status(500).json({
      success: false,
      message: 'Error searching for CAs',
    });
  }
};

// @desc    Get CA profile by user ID / public directory profile
// @route   GET /api/ca/profile/:id
exports.getCAProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { $or: [{ user: id }, { _id: id }] }
      : { user: id };

    const profile = await CAProfile.findOne(query)
      .populate('user', 'name email')
      .lean();

    if (!profile || !profile.verified) {
      return res.status(404).json({
        success: false,
        message: 'CA profile not found',
      });
    }

    await CAProfile.updateOne({ _id: profile._id }, { $inc: { profileViews: 1 } });

    const formatted = formatProfileSummary(profile);

    return res.json({
      success: true,
      profile: {
        ...formatted,
        profileViews: (formatted.profileViews || 0) + 1,
      },
    });
  } catch (error) {
    console.error('Error fetching CA profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching profile',
    });
  }
};

// @desc    Get CA availability by profile ID
// @route   GET /api/ca/profile/:id/availability
exports.getCAAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { $or: [{ user: id }, { _id: id }] }
      : { user: id };

    const profile = await CAProfile.findOne(query).lean();

    if (!profile || !profile.verified) {
      return res.status(404).json({
        success: false,
        message: 'CA availability not found',
      });
    }

    const rawAvailability =
      profile.availability ||
      profile.availableSlots ||
      profile.calendarAvailability ||
      [];

    const slots = Array.isArray(rawAvailability)
      ? rawAvailability
          .filter((slot) => slot && slot.start && (slot.status || 'available') === 'available')
          .map((slot) => ({
            id: slot._id,
            _id: slot._id,
            start: slot.start,
            end: slot.end || null,
            type: slot.type || 'Consultation',
            status: slot.status || 'available',
          }))
      : [];

    return res.json({
      success: true,
      data: { slots },
      slots,
    });
  } catch (error) {
    console.error('Error fetching CA availability:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching availability',
    });
  }
};

// Helper function to calculate distance between coordinates in KM
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}