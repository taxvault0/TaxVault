const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    ca: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    taxCase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TaxCase',
      default: null,
    },
    title: {
      type: String,
      trim: true,
      default: '',
    },
    consultationType: {
      type: String,
      enum: [
        'initial-review',
        'tax-planning',
        'filing-help',
        'document-review',
        'audit-support',
        'other',
      ],
      default: 'initial-review',
    },
    mode: {
      type: String,
      enum: ['phone', 'video', 'in-person'],
      default: 'video',
    },
    status: {
      type: String,
      enum: [
        'requested',
        'confirmed',
        'rescheduled',
        'completed',
        'cancelled',
        'no-show',
      ],
      default: 'requested',
      index: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
      index: true,
    },
    durationMinutes: {
      type: Number,
      default: 30,
      min: 15,
      max: 240,
    },
    timezone: {
      type: String,
      trim: true,
      default: 'America/Toronto',
    },
    notesFromClient: {
      type: String,
      trim: true,
      default: '',
      maxlength: 2000,
    },
    notesFromCA: {
      type: String,
      trim: true,
      default: '',
      maxlength: 2000,
    },
    meetingLink: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    cancellationReason: {
      type: String,
      trim: true,
      default: '',
      maxlength: 1000,
    },
    rescheduleReason: {
      type: String,
      trim: true,
      default: '',
      maxlength: 1000,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

consultationSchema.index({ client: 1, status: 1, scheduledDate: -1 });
consultationSchema.index({ ca: 1, status: 1, scheduledDate: -1 });

module.exports = mongoose.model('Consultation', consultationSchema);