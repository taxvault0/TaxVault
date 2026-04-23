import {
  DEFAULT_OFFICE_HOURS,
  OFFICE_HOUR_DAYS,
} from './schema';

export const normalizeOfficeHours = (value = {}) => {
  const merged = {
    ...DEFAULT_OFFICE_HOURS,
    ...value,
    schedules: {
      ...DEFAULT_OFFICE_HOURS.schedules,
      ...(value?.schedules || {}),
    },
  };

  OFFICE_HOUR_DAYS.forEach((day) => {
    merged.schedules[day] = {
      ...DEFAULT_OFFICE_HOURS.schedules[day],
      ...(merged.schedules?.[day] || {}),
    };
  });

  return merged;
};

export const updateDaySchedule = (officeHours, day, patch) => ({
  ...officeHours,
  schedules: {
    ...officeHours.schedules,
    [day]: {
      ...officeHours.schedules[day],
      ...patch,
    },
  },
});

export const validateOfficeHours = (officeHours) => {
  const errors = {};

  if (!officeHours?.timezone?.trim()) {
    errors.timezone = 'Timezone is required';
  }

  if (
    !Number.isInteger(Number(officeHours.slotDurationMinutes)) ||
    Number(officeHours.slotDurationMinutes) <= 0
  ) {
    errors.slotDurationMinutes = 'Slot duration must be greater than 0';
  }

  if (
    !Number.isInteger(Number(officeHours.bufferMinutes)) ||
    Number(officeHours.bufferMinutes) < 0
  ) {
    errors.bufferMinutes = 'Buffer must be 0 or more';
  }

  if (
    !Number.isInteger(Number(officeHours.maxAdvanceDays)) ||
    Number(officeHours.maxAdvanceDays) <= 0
  ) {
    errors.maxAdvanceDays = 'Max advance days must be greater than 0';
  }

  Object.entries(officeHours?.schedules || {}).forEach(([day, schedule]) => {
    if (!schedule.enabled) return;

    if (!schedule.startTime) {
      errors[`${day}.startTime`] = 'Start time is required';
    }

    if (!schedule.endTime) {
      errors[`${day}.endTime`] = 'End time is required';
    }

    if (
      schedule.startTime &&
      schedule.endTime &&
      schedule.startTime >= schedule.endTime
    ) {
      errors[`${day}.endTime`] = 'End time must be after start time';
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};