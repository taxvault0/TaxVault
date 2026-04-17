const mongoose = require('mongoose');

const ALLOWED_MAIN_USE = [
  'Employment',
  'Gig Work',
  'Self-Employment',
  'Business',
];

const vehicleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // ✅ Now supports: name OR spouse name OR 'Joint'
    ownerPerson: {
      type: String,
      trim: true,
      required: true,
    },

    ownershipType: {
      type: String,
      enum: ['Owned', 'Financed', 'Leased'],
      required: true,
    },

    // ✅ MULTI-SELECT + validation
    mainUse: {
      type: [String],
      enum: ALLOWED_MAIN_USE,
      default: [],
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: 'At least one main use is required',
      },
    },

    purchaseDate: {
      type: String,
      default: '',
    },

    purchasePrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    gstHstPaid: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);