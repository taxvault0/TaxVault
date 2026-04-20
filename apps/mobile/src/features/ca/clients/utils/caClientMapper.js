const safeText = (value = '') => String(value || '').trim();

const getId = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value._id || value.id || '';
};

const buildName = (client = {}) => {
  const fullName =
    safeText(client.name) ||
    [safeText(client.firstName), safeText(client.lastName)].filter(Boolean).join(' ').trim();

  return fullName || 'Unnamed Client';
};

export const mapCAClient = (client = {}) => {
  const onboarding = client.onboarding || client.taxProfile || {};
  const assignedCase = client.assignedCase || client.case || null;

  return {
    id: getId(client),
    name: buildName(client),
    email: safeText(client.email),
    phone: safeText(client.phoneNumber || client.phone),
    province: safeText(client.province || onboarding.province || 'ON'),
    userType: safeText(client.userType),
    onboardingStatus: safeText(
      client.onboardingStatus ||
        onboarding.status ||
        (onboarding ? 'available' : 'not-started')
    ),
    hasAssignedCase: !!assignedCase,
    assignedCaseId: getId(assignedCase),
    assignedCaseStatus: safeText(assignedCase?.status),
    raw: client,
  };
};

export const mapCAClientDetails = (client = {}) => {
  const mapped = mapCAClient(client);

  return {
    ...mapped,
    profileNotes: safeText(client.profileNotes),
    familyStatus: safeText(
      client.familyStatus || client?.onboarding?.personalDetails?.familyStatus
    ),
    spouseName: safeText(
      client.spouseName || client?.onboarding?.personalDetails?.spouse?.name
    ),
    numberOfDependents:
      client.numberOfDependents ??
      client?.onboarding?.personalDetails?.numberOfDependents ??
      0,
    gigPlatforms:
      client.gigPlatforms ||
      client?.onboarding?.incomeDetails?.gigPlatforms ||
      [],
    additionalIncomeSources:
      client.additionalIncomeSources ||
      client?.onboarding?.incomeDetails?.additionalIncomeSources ||
      [],
    vehicleOwned:
      client?.vehicleOwned ??
      client?.onboarding?.vehicle?.owned ??
      false,
    vehicleUse:
      client?.vehicleUse ||
      client?.onboarding?.vehicle?.usage ||
      [],
    deductions:
      client?.deductions?.selectedDeductions ||
      client?.onboarding?.deductions?.selectedDeductions ||
      [],
    receiptTypes:
      client?.deductions?.receiptTypes ||
      client?.onboarding?.deductions?.receiptTypes ||
      [],
    documentsCount:
      client.documentsCount ??
      client?.documents?.length ??
      0,
  };
};