const mongoose = require('mongoose');

const availabilitySlotSchema = new mongoose.Schema(
  {
    start: { type: Date, required: true },
    end: { type: Date },
    type: {
      type: String,
      enum: ['Consultation', 'In-Person', 'Virtual'],
      default: 'Consultation',
    },
  },
  { _id: false }
);

const caProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    firmName: { type: String, default: '' },
    firmLogo: { type: String, default: '' },

    yearsOfExperience: { type: Number, default: 0 },
    otherLanguage: { type: String, default: '' },

    licenseNumber: { type: String, default: '' },
    policyNumber: { type: String, default: '' },

    yearAdmitted: { type: Number },
    peerReviewDate: { type: Date },

    // 📍 ADDRESS
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      province: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country: { type: String, default: 'Canada' },
    },

    // 🌍 GEO LOCATION (CRITICAL for distance search)
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [lng, lat]
        default: [0, 0],
      },
    },

    serviceRadius: { type: Number, default: 50 },

    specializations: { type: [String], default: [] },
    services: { type: [String], default: [] },
    languages: { type: [String], default: [] },

    phone: { type: String, default: '' },
    alternatePhone: { type: String, default: '' },
    firmPhone: { type: String, default: '' },

    website: { type: String, default: '' },

    hoursOfOperation: { type: Object, default: {} },

    // 💰 PRICE (NEW)
    minimumFee: { type: Number, default: null },
    maximumFee: { type: Number, default: null },

    // 📅 AVAILABILITY (NEW)
    availability: {
      type: [availabilitySlotSchema],
      default: [],
    },

    nextAvailable: { type: Date, default: null },

    acceptingNewClients: { type: Boolean, default: true },

    availabilityStatus: {
      type: String,
      enum: ['active', 'not-accepting'],
      default: 'active',
    },

    verified: { type: Boolean, default: false },
    verifiedAt: { type: Date },

    profileViews: { type: Number, default: 0 },
    connectionRequests: { type: Number, default: 0 },

    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);


// 🚨 CRITICAL FOR GEO SEARCH
caProfileSchema.index({ location: '2dsphere' });

module.exports =
  mongoose.models.CAProfile ||
  mongoose.model('CAProfile', caProfileSchema);