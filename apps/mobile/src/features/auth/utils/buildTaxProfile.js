export const normalizeBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    return ['true', '1', 'yes', 'y'].includes(v);
  }
  if (typeof value === 'number') return value === 1;
  return false;
};

const hasValue = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value);
};

export const buildPersonTaxProfile = (rawUser = {}) => {
  const taxProfile = rawUser?.taxProfile || {};
  const incomeSources = rawUser?.incomeSources || [];
  const businessInfo = rawUser?.businessInfo || {};

  const userType = String(rawUser?.userType || rawUser?.roleType || '')
    .trim()
    .toLowerCase();

  const incomeSet = new Set(
    Array.isArray(incomeSources)
      ? incomeSources.map((item) => String(item).trim().toLowerCase())
      : []
  );

  const employment =
    normalizeBoolean(taxProfile.employment) ||
    normalizeBoolean(rawUser.employment) ||
    incomeSet.has('employment') ||
    incomeSet.has('employed') ||
    userType.includes('employed') ||
    userType.includes('employee');

  const gigWork =
    normalizeBoolean(taxProfile.gigWork) ||
    normalizeBoolean(taxProfile.selfEmployed) ||
    normalizeBoolean(rawUser.gigWork) ||
    normalizeBoolean(rawUser.selfEmployed) ||
    incomeSet.has('gig') ||
    incomeSet.has('gig work') ||
    incomeSet.has('self-employed') ||
    incomeSet.has('self employed') ||
    userType.includes('gig') ||
    userType.includes('self-employed') ||
    userType.includes('self employed');

  const business =
    normalizeBoolean(taxProfile.business) ||
    normalizeBoolean(rawUser.business) ||
    normalizeBoolean(businessInfo.hasBusiness) ||
    normalizeBoolean(businessInfo.isBusinessOwner) ||
    incomeSet.has('business') ||
    userType.includes('business');

  const unemployed =
    normalizeBoolean(taxProfile.unemployed) ||
    normalizeBoolean(rawUser.unemployed) ||
    (!employment && !gigWork && !business);

  return {
    employment,
    gigWork,
    business,
    unemployed,

    rrsp:
      normalizeBoolean(taxProfile.rrsp) ||
      normalizeBoolean(rawUser.rrsp),

    fhsa:
      normalizeBoolean(taxProfile.fhsa) ||
      normalizeBoolean(rawUser.fhsa),

    tfsa:
      normalizeBoolean(taxProfile.tfsa) ||
      normalizeBoolean(rawUser.tfsa),

    investments:
      normalizeBoolean(taxProfile.investments) ||
      normalizeBoolean(rawUser.investments),

    donations:
      normalizeBoolean(taxProfile.donations) ||
      normalizeBoolean(rawUser.donations),

    ccb:
      normalizeBoolean(taxProfile.ccb) ||
      normalizeBoolean(rawUser.ccb),

    workFromHome:
      normalizeBoolean(taxProfile.workFromHome) ||
      normalizeBoolean(rawUser.workFromHome),

    hasAnyIncome: employment || gigWork || business,
  };
};

export const buildHouseholdProfile = (rawUser = {}) => {
  const user = buildPersonTaxProfile(rawUser);
  const spouse = buildPersonTaxProfile(rawUser?.spouse || {});

  return {
    user,
    spouse,
    hasSpouse: hasValue(rawUser?.spouse),
    householdHasEmployment: user.employment || spouse.employment,
    householdHasGigWork: user.gigWork || spouse.gigWork,
    householdHasBusiness: user.business || spouse.business,
    householdHasAnyIncome: user.hasAnyIncome || spouse.hasAnyIncome,
  };
};

export default buildHouseholdProfile;


