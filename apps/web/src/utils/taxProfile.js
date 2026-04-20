// src/utils/taxProfile.js

export const toBoolean = (value) => {
  if (value === true) return true;
  if (value === false || value == null) return false;

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return ['true', '1', 'yes', 'y', 'on'].includes(normalized);
  }

  if (typeof value === 'number') {
    return value === 1;
  }

  return false;
};

export const normalizeIncomeSources = (sources) => {
  if (!Array.isArray(sources)) return [];
  return sources.map((item) => String(item || '').trim().toLowerCase());
};

export const normalizeUserType = (userType) =>
  String(userType || '').trim().toLowerCase();

const hasAnyTruthyBusinessInfo = (businessInfo = {}) =>
  Boolean(
    businessInfo?.businessName ||
      businessInfo?.businessType ||
      businessInfo?.gstRegistered ||
      businessInfo?.hasEmployees ||
      businessInfo?.hasInventory
  );

const hasAnyProfileData = (person = {}) => {
  if (!person || typeof person !== 'object') return false;

  return Boolean(
    person?.name ||
      person?.email ||
      person?.userType ||
      (Array.isArray(person?.incomeSources) && person.incomeSources.length > 0) ||
      (person?.taxProfile && Object.keys(person.taxProfile).length > 0) ||
      (person?.optionalProfiles && Object.keys(person.optionalProfiles).length > 0) ||
      (person?.businessInfo && Object.keys(person.businessInfo).length > 0)
  );
};

export const buildIncomeProfile = (person = {}) => {
  const rawTaxProfile = {
    ...(person?.taxProfile || {}),
    ...(person?.optionalProfiles || {}),
  };

  const businessInfo = person?.businessInfo || {};
  const incomeSources = normalizeIncomeSources(person?.incomeSources);
  const userType = normalizeUserType(person?.userType);

  const employment =
    toBoolean(rawTaxProfile.employment) ||
    incomeSources.includes('employment') ||
    incomeSources.includes('t4') ||
    incomeSources.includes('employee') ||
    userType === 'employee' ||
    userType === 't4' ||
    userType === 't4-employee';

  const gigWork =
    toBoolean(rawTaxProfile.gigWork) ||
    toBoolean(rawTaxProfile.selfEmployment) ||
    incomeSources.includes('gig') ||
    incomeSources.includes('gig_work') ||
    incomeSources.includes('gig-work') ||
    incomeSources.includes('self_employed') ||
    incomeSources.includes('self-employed') ||
    userType === 'gig-worker' ||
    userType === 'gig' ||
    userType === 'self-employed';

  const business =
    toBoolean(rawTaxProfile.business) ||
    toBoolean(rawTaxProfile.incorporatedBusiness) ||
    incomeSources.includes('business') ||
    incomeSources.includes('business_owner') ||
    incomeSources.includes('business-owner') ||
    userType === 'business' ||
    userType === 'business_owner' ||
    userType === 'business-owner' ||
    hasAnyTruthyBusinessInfo(businessInfo);

  const unemployed = !employment && !gigWork && !business;

  return {
    employment,
    gigWork,
    business,
    unemployed,

    tfsa: toBoolean(rawTaxProfile.tfsa),
    rrsp: toBoolean(rawTaxProfile.rrsp),
    fhsa: toBoolean(rawTaxProfile.fhsa),
    ccb: toBoolean(rawTaxProfile.ccb),
    investments: toBoolean(rawTaxProfile.investments),
    donations: toBoolean(rawTaxProfile.donations),

    workFromHome: toBoolean(rawTaxProfile.workFromHome),
    spouse: toBoolean(rawTaxProfile.spouse),
  };
};

export const buildHouseholdProfile = (user = {}) => {
  const primary = buildIncomeProfile(user);

  const rawSpouse =
    user?.spouse ||
    user?.spouseProfile ||
    user?.spouseInfo ||
    user?.household?.spouse ||
    null;

  const hasSpouse =
    toBoolean(user?.hasSpouse) ||
    toBoolean(user?.taxProfile?.spouse) ||
    toBoolean(user?.isMarried) ||
    normalizeUserType(user?.maritalStatus) === 'married' ||
    hasAnyProfileData(rawSpouse);

  const spouse = hasSpouse ? buildIncomeProfile(rawSpouse || {}) : null;

  const userBusinessOnly =
    primary.business && !primary.employment && !primary.gigWork;

  const spouseBusinessOnly =
    hasSpouse &&
    spouse?.business &&
    !spouse?.employment &&
    !spouse?.gigWork;

  const userLabel = [
    primary.employment ? 'T4' : null,
    primary.gigWork ? 'Gig' : null,
    primary.business ? 'Business' : null,
    primary.unemployed ? 'Unemployed' : null,
  ]
    .filter(Boolean)
    .join(' + ');

  const spouseLabel = hasSpouse
    ? [
        spouse?.employment ? 'T4' : null,
        spouse?.gigWork ? 'Gig' : null,
        spouse?.business ? 'Business' : null,
        spouse?.unemployed ? 'Unemployed' : null,
      ]
        .filter(Boolean)
        .join(' + ')
    : '';

  return {
    hasSpouse,
    user: primary,
    spouse,
    userBusinessOnly,
    spouseBusinessOnly,
    householdLabel: hasSpouse ? `${userLabel} + Spouse ${spouseLabel}` : userLabel,
  };
};

export const getOptionalProfiles = (profile) =>
  [
    profile?.tfsa && {
      key: 'tfsa',
      label: 'TFSA',
      to: '/documents?category=tfsa',
    },
    profile?.rrsp && {
      key: 'rrsp',
      label: 'RRSP',
      to: '/documents?category=rrsp',
    },
    profile?.fhsa && {
      key: 'fhsa',
      label: 'FHSA',
      to: '/documents?category=fhsa',
    },
    profile?.ccb && {
      key: 'ccb',
      label: 'CCB',
      to: '/documents?category=ccb',
    },
    profile?.investments && {
      key: 'investments',
      label: 'Investments',
      to: '/documents?category=investments',
    },
    profile?.donations && {
      key: 'donations',
      label: 'Donations',
      to: '/documents?category=donations',
    },
  ].filter(Boolean);
