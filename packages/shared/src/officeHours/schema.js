export const OFFICE_HOUR_DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export const DAY_LABELS = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

export const DEFAULT_DAY_SCHEDULE = {
  enabled: false,
  startTime: '09:00',
  endTime: '17:00',
};

export const DEFAULT_OFFICE_HOURS = {
  timezone: 'America/Edmonton',
  slotDurationMinutes: 30,
  bufferMinutes: 10,
  maxAdvanceDays: 30,
  schedules: OFFICE_HOUR_DAYS.reduce((acc, day) => {
    acc[day] = { ...DEFAULT_DAY_SCHEDULE };
    return acc;
  }, {}),
};