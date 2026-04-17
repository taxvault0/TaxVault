const normalizeBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    return ['true', '1', 'yes', 'y'].includes(v);
  }
  if (typeof value === 'number') return value === 1;
  return false;
};

const safeArray = (value) => (Array.isArray(value) ? value : []);

export const buildPersonProfile = (raw = {}) => {
  const taxProfile = raw?.taxProfile || {};
  const incomeSources = safeArray(raw?.incomeSources).map((item) =>
    String(item).trim().toLowerCase()
  );

  const employment =
    normalizeBoolean(taxProfile.employment) ||
    incomeSources.includes('employment') ||
    incomeSources.includes('employed');

  const gigWork =
    normalizeBoolean(taxProfile.gigWork) ||
    normalizeBoolean(taxProfile.selfEmployment) ||
    incomeSources.includes('gig-work') ||
    incomeSources.includes('gig') ||
    incomeSources.includes('self-employed') ||
    incomeSources.includes('self employed');

  const business =
    normalizeBoolean(taxProfile.business) ||
    normalizeBoolean(taxProfile.incorporatedBusiness) ||
    incomeSources.includes('business');

  return {
    employment,
    gigWork,
    business,
    rrsp: normalizeBoolean(taxProfile.rrsp),
    fhsa: normalizeBoolean(taxProfile.fhsa),
    investments: normalizeBoolean(taxProfile.investments),
    donations: normalizeBoolean(taxProfile.donations),
    spouse: normalizeBoolean(taxProfile.spouse),
  };
};

export const estimateFilingReadiness = (user = {}) => {
  const profile = buildPersonProfile(user);

  let total = 0;
  let ready = 0;

  if (profile.employment) total += 1;
  if (profile.gigWork) total += 1;
  if (profile.business) total += 1;
  if (profile.rrsp) total += 1;
  if (profile.fhsa) total += 1;
  if (profile.investments) total += 1;
  if (profile.donations) total += 1;

  ready += profile.rrsp ? 1 : 0;
  ready += profile.fhsa ? 1 : 0;

  if (profile.employment || profile.gigWork || profile.business) {
    total += 1;
  }

  const percentage = total === 0 ? 20 : Math.max(20, Math.min(95, Math.round((ready / total) * 100)));

  return {
    percentage,
    readyForReview: percentage >= 70,
    recommendedAppointmentType: percentage >= 70 ? 'Tax Filing Appointment' : 'Consultation',
  };
};

export const getCAState = (user = {}) => {
  const assignedCA = user?.assignedCA || null;
  const appointments = safeArray(user?.appointments);
  const readiness = estimateFilingReadiness(user);

  return {
    hasAssignedCA: !!assignedCA,
    assignedCA,
    appointments,
    readiness,
  };
};

export default getCAState;


