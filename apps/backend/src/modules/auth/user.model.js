const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const backupCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'ca', 'admin'],
      default: 'user',
    },
    userType: {
      type: String,
      default: 'employee',
    },
    phoneNumber: {
      type: String,
      default: '',
    },
    alternatePhone: {
      type: String,
      default: '',
    },
    province: {
      type: String,
      default: 'ON',
    },
    clientId: {
      type: String,
      unique: true,
      sparse: true,
    },
    firmName: {
      type: String,
      default: '',
    },
    caNumber: {
      type: String,
      default: '',
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
      select: false,
    },
    emailVerificationExpire: {
      type: Date,
      default: null,
      select: false,
    },

    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
      select: false,
    },

    loginAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    lockUntil: {
      type: Date,
      default: null,
      select: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },

    mfaEnabled: {
      type: Boolean,
      default: false,
      select: false,
    },
    mfaSecret: {
      type: String,
      default: null,
      select: false,
    },
    mfaBackupCodes: {
      type: [backupCodeSchema],
      default: [],
      select: false,
    },

    termsAccepted: {
      type: Boolean,
      default: false,
    },
    privacyAccepted: {
      type: Boolean,
      default: false,
    },
    professionalTermsAccepted: {
      type: Boolean,
      default: false,
    },
    termsAcceptedAt: {
      type: Date,
      default: null,
    },

    profile: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    businessNumber: {
      type: String,
      default: '',
    },
    provincialTaxRegistered: {
      type: Boolean,
      default: false,
    },
    provincialTaxNumber: {
      type: String,
      default: '',
    },
    filingFrequency: {
      type: String,
      default: '',
    },
    taxRegistrationDate: {
      type: Date,
      default: null,
    },
    exceededProvincialThreshold: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

userSchema.methods.createEmailVerificationToken = function () {
  const rawToken = crypto.randomBytes(32).toString('hex');

  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;

  return rawToken;
};

userSchema.methods.createPasswordResetToken = function () {
  const rawToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return rawToken;
};

module.exports = mongoose.model('User', userSchema);