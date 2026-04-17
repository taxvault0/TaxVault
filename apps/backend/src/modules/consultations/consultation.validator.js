const mongoose = require('mongoose');

const ALLOWED_TYPES = [
  'initial-review',
  'tax-planning',
  'filing-help',
  'document-review',
  'audit-support',
  'other',
];

const ALLOWED_MODES = ['phone', 'video', 'in-person'];

const ALLOWED_STATUSES = [
  'requested',
  'confirmed',
  'rescheduled',
  'completed',
  'cancelled',
  'no-show',
];

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const validateCreateConsultation = (payload = {}) => {
  const errors = [];

  if (!payload.caId || !isValidObjectId(payload.caId)) {
    errors.push('Valid CA ID is required');
  }

  if (!payload.scheduledDate || Number.isNaN(new Date(payload.scheduledDate).getTime())) {
    errors.push('Valid scheduled date is required');
  }

  if (
    payload.consultationType &&
    !ALLOWED_TYPES.includes(payload.consultationType)
  ) {
    errors.push('Invalid consultation type');
  }

  if (payload.mode && !ALLOWED_MODES.includes(payload.mode)) {
    errors.push('Invalid consultation mode');
  }

  if (
    payload.durationMinutes !== undefined &&
    (!Number.isFinite(Number(payload.durationMinutes)) ||
      Number(payload.durationMinutes) < 15 ||
      Number(payload.durationMinutes) > 240)
  ) {
    errors.push('Duration must be between 15 and 240 minutes');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateStatus = (status) => ALLOWED_STATUSES.includes(status);

module.exports = {
  ALLOWED_TYPES,
  ALLOWED_MODES,
  ALLOWED_STATUSES,
  validateCreateConsultation,
  validateStatus,
  isValidObjectId,
};