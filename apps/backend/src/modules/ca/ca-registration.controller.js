const CARegistration = require('./ca-registration.model');
const CAProfile = require('./ca-profile.model');
const User = require('../auth/user.model');
const { mapDraftPayload, hasAnyKnownSection } = require('./ca-registration.mapper');

const STEP_ORDER = [
  'account',
  'professional',
  'firm-details',
  'credentials',
  'practice',
  'specialties',
  'verification',
  'review'
];

const PROVINCE_NAME_TO_CODE = {
  Alberta: 'AB',
  'British Columbia': 'BC',
  Manitoba: 'MB',
  'New Brunswick': 'NB',
  Newfoundland: 'NL',
  'Newfoundland and Labrador': 'NL',
  'Nova Scotia': 'NS',
  Ontario: 'ON',
  'Prince Edward Island': 'PE',
  Quebec: 'QC',
  Saskatchewan: 'SK',
  'Northwest Territories': 'NT',
  Nunavut: 'NU',
  Yukon: 'YT',
  AB: 'AB',
  BC: 'BC',
  MB: 'MB',
  NB: 'NB',
  NL: 'NL',
  NS: 'NS',
  ON: 'ON',
  PE: 'PE',
  QC: 'QC',
  SK: 'SK',
  NT: 'NT',
  NU: 'NU',
  YT: 'YT'
};

const { createStepValidator } = require('./ca-registration.validation');

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj || {}, key);

const normalizeProvince = (value) => {
  if (!value) return value;
  return PROVINCE_NAME_TO_CODE[value] || value;
};

const normalizePhone = (value = '') => String(value).replace(/\D/g, '');

const normalizeLanguage = (value = '') => {
  const normalized = String(value).trim().toLowerCase();

  const languageMap = {
    english: 'english',
    french: 'french',
    spanish: 'spanish',
    mandarin: 'mandarin',
    cantonese: 'cantonese',
    punjabi: 'punjabi',
    arabic: 'arabic',
    hindi: 'hindi',
    'persian (farsi)': 'persian',
    persian: 'persian',
    farsi: 'persian',
    'tagalog (filipino)': 'tagalog',
    tagalog: 'tagalog',
    filipino: 'tagalog',
    other: 'other'
  };

  return languageMap[normalized] || normalized;
};

const normalizeLanguages = (languages = []) => {
  if (!Array.isArray(languages)) return [];
  return [...new Set(languages.map(normalizeLanguage).filter(Boolean))];
};

const normalizeFile = (file) => {
  if (!file) return undefined;

  return {
    originalName: file.originalName || file.name || '',
    fileName: file.fileName || file.filename || '',
    filePath: file.filePath || file.path || '',
    fileUrl: file.fileUrl || file.url || '',
    mimeType: file.mimeType || file.mimetype || '',
    size: file.size || 0,
    uploadedAt: file.uploadedAt || new Date()
  };
};

const isValidHoursOfOperation = (hours) => {
  if (!hours || typeof hours !== 'object' || Array.isArray(hours)) return false;

  for (const day of Object.keys(hours)) {
    const entry = hours[day];

    if (!entry || typeof entry !== 'object') return false;

    const closed = !!entry.closed;
    const open = entry.open || '';
    const close = entry.close || '';

    if (closed) continue;

    if (!open || !close) return false;
    if (close <= open) return false;
  }

  return true;
};

const buildPayload = (body = {}) => {
  const payload = {};

  if (hasOwn(body, 'accountInformation')) {
    payload.accountInformation = {
      firstName: body.accountInformation?.firstName ?? '',
      lastName: body.accountInformation?.lastName ?? '',
      email: body.accountInformation?.email ?? '',
      primaryPhone: normalizePhone(body.accountInformation?.primaryPhone ?? ''),
      alternatePhone: normalizePhone(body.accountInformation?.alternatePhone ?? '')
    };
  }

  if (hasOwn(body, 'professionalInformation')) {
    payload.professionalInformation = {
      caDesignation: body.professionalInformation?.caDesignation ?? '',
      caNumber: (body.professionalInformation?.caNumber ?? '').toString().trim().toUpperCase(),
      provinceOfRegistration: normalizeProvince(body.professionalInformation?.provinceOfRegistration),
      yearAdmitted:
        body.professionalInformation?.yearAdmitted !== undefined &&
        body.professionalInformation?.yearAdmitted !== null &&
        body.professionalInformation?.yearAdmitted !== ''
          ? Number(body.professionalInformation.yearAdmitted)
          : null,
      yearsOfExperience:
        body.professionalInformation?.yearsOfExperience !== undefined &&
        body.professionalInformation?.yearsOfExperience !== null &&
        body.professionalInformation?.yearsOfExperience !== ''
          ? Number(body.professionalInformation.yearsOfExperience)
          : null,
      firmName: body.professionalInformation?.firmName ?? '',
      firmWebsite: body.professionalInformation?.firmWebsite ?? '',
      areasOfExpertise: Array.isArray(body.professionalInformation?.areasOfExpertise)
        ? body.professionalInformation.areasOfExpertise
        : [],
      languagesSpoken: normalizeLanguages(body.professionalInformation?.languagesSpoken ?? []),
      otherLanguage: body.professionalInformation?.otherLanguage ?? ''
    };
  }

  if (hasOwn(body, 'firmDetails')) {
    payload.firmDetails = {
      firmAddress: body.firmDetails?.firmAddress ?? '',
      city: body.firmDetails?.city ?? '',
      province: normalizeProvince(body.firmDetails?.province),
      postalCode: body.firmDetails?.postalCode ?? '',
      country: body.firmDetails?.country ?? 'Canada',
      addressData: body.firmDetails?.addressData || null,
      firmPhone: normalizePhone(body.firmDetails?.firmPhone ?? ''),
      firmEmail: body.firmDetails?.firmEmail ?? '',
      firmSize: body.firmDetails?.firmSize ?? 'Solo',
      numberOfPartners:
        body.firmDetails?.numberOfPartners !== undefined &&
        body.firmDetails?.numberOfPartners !== null &&
        body.firmDetails?.numberOfPartners !== ''
          ? Number(body.firmDetails.numberOfPartners)
          : 0,
      numberOfStaff:
        body.firmDetails?.numberOfStaff !== undefined &&
        body.firmDetails?.numberOfStaff !== null &&
        body.firmDetails?.numberOfStaff !== ''
          ? Number(body.firmDetails.numberOfStaff)
          : 0,
      yearEstablished:
        body.firmDetails?.yearEstablished !== undefined &&
        body.firmDetails?.yearEstablished !== null &&
        body.firmDetails?.yearEstablished !== ''
          ? Number(body.firmDetails.yearEstablished)
          : null
    };
  }

  if (hasOwn(body, 'professionalCredentials')) {
    payload.professionalCredentials = {
      professionalLiabilityInsurance: {
        hasInsurance:
          body.professionalCredentials?.professionalLiabilityInsurance?.hasInsurance ?? false,
        provider: body.professionalCredentials?.professionalLiabilityInsurance?.provider ?? '',
        policyNumber:
          (body.professionalCredentials?.professionalLiabilityInsurance?.policyNumber ?? '')
            .toString()
            .trim()
            .toUpperCase(),
        coverageAmount:
          body.professionalCredentials?.professionalLiabilityInsurance?.coverageAmount ?? 0,
        expiryDate:
          body.professionalCredentials?.professionalLiabilityInsurance?.expiryDate ?? undefined,
        certificateFile: normalizeFile(
          body.professionalCredentials?.professionalLiabilityInsurance?.certificateFile
        )
      },

      cpaMembership: {
        isMemberInGoodStanding:
          body.professionalCredentials?.cpaMembership?.isMemberInGoodStanding ?? false,
        licenseVerificationNumber:
          body.professionalCredentials?.cpaMembership?.licenseVerificationNumber ?? ''
      },

      peerReview: {
        completedWithinLast3Years:
          body.professionalCredentials?.peerReview?.completedWithinLast3Years ?? false,
        reviewDate: body.professionalCredentials?.peerReview?.reviewDate ?? undefined,
        outcome: body.professionalCredentials?.peerReview?.outcome ?? '',
        reportFile: normalizeFile(body.professionalCredentials?.peerReview?.reportFile)
      },

      disciplinaryHistory: {
        hasHistory: body.professionalCredentials?.disciplinaryHistory?.hasHistory ?? false,
        details: body.professionalCredentials?.disciplinaryHistory?.details ?? ''
      },

      criminalRecordCheck: {
        consentGiven: body.professionalCredentials?.criminalRecordCheck?.consentGiven ?? false,
        documentFile: normalizeFile(body.professionalCredentials?.criminalRecordCheck?.documentFile)
      }
    };
  }

  if (hasOwn(body, 'practiceInformation')) {
    payload.practiceInformation = {
      practiceType: body.practiceInformation?.practiceType ?? '',
      acceptingNewClients: body.practiceInformation?.acceptingNewClients ?? true,
      primaryClientTypes: Array.isArray(body.practiceInformation?.primaryClientTypes)
        ? body.practiceInformation.primaryClientTypes
        : [],
      averageClientsPerYear:
        body.practiceInformation?.averageClientsPerYear !== undefined &&
        body.practiceInformation?.averageClientsPerYear !== null &&
        body.practiceInformation?.averageClientsPerYear !== ''
          ? Number(body.practiceInformation.averageClientsPerYear)
          : 0,
      minimumFee:
        body.practiceInformation?.minimumFee !== undefined &&
        body.practiceInformation?.minimumFee !== null &&
        body.practiceInformation?.minimumFee !== ''
          ? Number(body.practiceInformation.minimumFee)
          : 0,
      maximumFee:
        body.practiceInformation?.maximumFee !== undefined &&
        body.practiceInformation?.maximumFee !== null &&
        body.practiceInformation?.maximumFee !== ''
          ? Number(body.practiceInformation.maximumFee)
          : 0,
      serviceOfferings: Array.isArray(body.practiceInformation?.serviceOfferings)
        ? body.practiceInformation.serviceOfferings
        : [],
      serviceRadiusKm:
        body.practiceInformation?.serviceRadiusKm !== undefined &&
        body.practiceInformation?.serviceRadiusKm !== null &&
        body.practiceInformation?.serviceRadiusKm !== ''
          ? Number(body.practiceInformation.serviceRadiusKm)
          : 50,
      hoursOfOperation: isValidHoursOfOperation(body.practiceInformation?.hoursOfOperation)
        ? body.practiceInformation.hoursOfOperation
        : {}
    };
  }

  if (hasOwn(body, 'specialtiesAndTechnology')) {
    payload.specialtiesAndTechnology = {
      taxSpecialties: Array.isArray(body.specialtiesAndTechnology?.taxSpecialties)
        ? body.specialtiesAndTechnology.taxSpecialties
        : [],
      provincialSpecialties: Array.isArray(body.specialtiesAndTechnology?.provincialSpecialties)
        ? body.specialtiesAndTechnology.provincialSpecialties
        : [],
      internationalSpecialties: Array.isArray(body.specialtiesAndTechnology?.internationalSpecialties)
        ? body.specialtiesAndTechnology.internationalSpecialties
        : [],
      accountingSoftware: Array.isArray(body.specialtiesAndTechnology?.accountingSoftware)
        ? body.specialtiesAndTechnology.accountingSoftware
        : [],
      taxSoftware: Array.isArray(body.specialtiesAndTechnology?.taxSoftware)
        ? body.specialtiesAndTechnology.taxSoftware
        : [],
      practiceManagementSoftware: body.specialtiesAndTechnology?.practiceManagementSoftware ?? '',
      clientPortalAccess: body.specialtiesAndTechnology?.clientPortalAccess ?? false,
      digitalDocumentSigning: body.specialtiesAndTechnology?.digitalDocumentSigning ?? false,
      endToEndEncryption: body.specialtiesAndTechnology?.endToEndEncryption ?? false,
      twoFactorAuthentication: body.specialtiesAndTechnology?.twoFactorAuthentication ?? false
    };
  }

  if (hasOwn(body, 'verificationAndDocuments')) {
    payload.verificationAndDocuments = {
      caCertificateFile: normalizeFile(body.verificationAndDocuments?.caCertificateFile),
      professionalHeadshotFile: normalizeFile(
        body.verificationAndDocuments?.professionalHeadshotFile
      ),
      firmLogoFile: normalizeFile(body.verificationAndDocuments?.firmLogoFile),
      professionalReferences: Array.isArray(body.verificationAndDocuments?.professionalReferences)
        ? body.verificationAndDocuments.professionalReferences.map((ref) => ({
            referenceName: ref?.referenceName ?? '',
            email: ref?.email ?? '',
            phone: normalizePhone(ref?.phone ?? ''),
            relationship: ref?.relationship ?? '',
            yearsKnown:
              ref?.yearsKnown !== undefined &&
              ref?.yearsKnown !== null &&
              ref?.yearsKnown !== ''
                ? Number(ref.yearsKnown)
                : 0
          }))
        : [],
      authorizeTaxVaultVerification:
        body.verificationAndDocuments?.authorizeTaxVaultVerification ?? false,
      consentBackgroundCheck: body.verificationAndDocuments?.consentBackgroundCheck ?? false
    };
  }

  if (hasOwn(body, 'reviewAndSubmit')) {
    payload.reviewAndSubmit = {
      agreedTermsAndConditions: body.reviewAndSubmit?.agreedTermsAndConditions ?? false,
      agreedPrivacyPolicy: body.reviewAndSubmit?.agreedPrivacyPolicy ?? false,
      agreedProfessionalTerms: body.reviewAndSubmit?.agreedProfessionalTerms ?? false,
      confirmAccuracy: body.reviewAndSubmit?.confirmAccuracy ?? false
    };
  }

  if (hasOwn(body, 'onboarding')) {
    payload.onboarding = {
      currentStep: body.onboarding?.currentStep ?? 'account',
      completedSteps: Array.isArray(body.onboarding?.completedSteps)
        ? body.onboarding.completedSteps
        : [],
      percentComplete:
        body.onboarding?.percentComplete !== undefined &&
        body.onboarding?.percentComplete !== null &&
        body.onboarding?.percentComplete !== ''
          ? Number(body.onboarding.percentComplete)
          : 0
    };
  }

  return payload;
};

const deepMergeSection = (existingValue, incomingValue) => {
  if (incomingValue === undefined) return existingValue;
  if (incomingValue === null) return null;
  if (Array.isArray(incomingValue)) return incomingValue;
  if (incomingValue instanceof Date) return incomingValue;

  if (incomingValue && typeof incomingValue === 'object') {
    const existingObject =
      existingValue && typeof existingValue.toObject === 'function'
        ? existingValue.toObject()
        : existingValue && typeof existingValue === 'object'
          ? existingValue
          : {};

    const result = { ...existingObject };

    Object.keys(incomingValue).forEach((key) => {
      result[key] = deepMergeSection(existingObject[key], incomingValue[key]);
    });

    return result;
  }

  return incomingValue;
};

const validateSubmission = (registration) => {
  const validator = createStepValidator();

  const flatForm = {
    firstName: registration.accountInformation?.firstName || '',
    lastName: registration.accountInformation?.lastName || '',
    email: registration.accountInformation?.email || '',
    phone: registration.accountInformation?.primaryPhone || '',
    alternatePhone: registration.accountInformation?.alternatePhone || '',
    password: 'placeholder-password',
    confirmPassword: 'placeholder-password',

    caDesignation: registration.professionalInformation?.caDesignation || '',
    caNumber: registration.professionalInformation?.caNumber || '',
    provinceOfRegistration: registration.professionalInformation?.provinceOfRegistration || '',
    yearAdmitted: registration.professionalInformation?.yearAdmitted ?? '',
    yearsOfExperience: registration.professionalInformation?.yearsOfExperience ?? '',
    firmName: registration.professionalInformation?.firmName || '',
    firmWebsite: registration.professionalInformation?.firmWebsite || '',
    areasOfExpertise: registration.professionalInformation?.areasOfExpertise || [],
    languagesSpoken: registration.professionalInformation?.languagesSpoken || [],
    otherLanguage: registration.professionalInformation?.otherLanguage || '',

    firmAddress: registration.firmDetails?.firmAddress || '',
    city: registration.firmDetails?.city || '',
    province: registration.firmDetails?.province || '',
    firmPostalCode: registration.firmDetails?.postalCode || '',
    country: registration.firmDetails?.country || 'Canada',
    firmPhone: registration.firmDetails?.firmPhone || '',
    firmEmail: registration.firmDetails?.firmEmail || '',
    firmSize: registration.firmDetails?.firmSize || '',
    yearEstablished: registration.firmDetails?.yearEstablished ?? '',
    numberOfPartners: registration.firmDetails?.numberOfPartners ?? '',
    numberOfStaff: registration.firmDetails?.numberOfStaff ?? '',

    policyNumber:
      registration.professionalCredentials?.professionalLiabilityInsurance?.policyNumber || '',
    coverageAmount:
      registration.professionalCredentials?.professionalLiabilityInsurance?.coverageAmount ?? '',
    insuranceProvider:
      registration.professionalCredentials?.professionalLiabilityInsurance?.provider || '',
    peerReviewed:
      registration.professionalCredentials?.peerReview?.completedWithinLast3Years || false,
    lastPeerReviewDate: registration.professionalCredentials?.peerReview?.reviewDate || '',
    disciplinaryAction:
      registration.professionalCredentials?.disciplinaryHistory?.hasHistory || false,
    disciplinaryDetails:
      registration.professionalCredentials?.disciplinaryHistory?.details || '',

    practiceType: registration.practiceInformation?.practiceType || '',
    servicesOffered: registration.practiceInformation?.serviceOfferings || [],
    clientTypes: registration.practiceInformation?.primaryClientTypes || [],
    averageClientsPerYear: registration.practiceInformation?.averageClientsPerYear ?? '',
    minimumFee: registration.practiceInformation?.minimumFee ?? '',
    maximumFee: registration.practiceInformation?.maximumFee ?? '',
    serviceRadius: registration.practiceInformation?.serviceRadiusKm ?? '',

    taxServices: registration.specialtiesAndTechnology?.taxSpecialties || [],
    businessServices: registration.specialtiesAndTechnology?.businessServices || [],
    bookkeepingServices: registration.specialtiesAndTechnology?.bookkeepingServices || [],
    advisoryServices: registration.specialtiesAndTechnology?.advisoryServices || [],
    softwareSkills: registration.specialtiesAndTechnology?.accountingSoftware || [],
    certifications: registration.specialtiesAndTechnology?.certifications || [],
    nicheExpertise: registration.specialtiesAndTechnology?.nicheExpertise || [],

    agreedTermsAndConditions: registration.reviewAndSubmit?.agreedTermsAndConditions || false,
    agreedPrivacyPolicy: registration.reviewAndSubmit?.agreedPrivacyPolicy || false,
    agreedProfessionalTerms: registration.reviewAndSubmit?.agreedProfessionalTerms || false,
    confirmAccuracy: registration.reviewAndSubmit?.confirmAccuracy || false
  };

  const errors = validator.validateAll(flatForm);
  const finalErrors = Object.values(errors);

  const cert = registration.verificationAndDocuments?.caCertificateFile;
  if (!cert || (!cert.fileName && !cert.fileUrl && !cert.filePath && !cert.originalName)) {
    finalErrors.push('CA certificate is required');
  }

  if (!registration.verificationAndDocuments?.authorizeTaxVaultVerification) {
    finalErrors.push('Authorization for TaxVault verification is required');
  }

  if (!registration.verificationAndDocuments?.consentBackgroundCheck) {
    finalErrors.push('Background check consent is required');
  }

  return finalErrors;
};

const syncProfileFromRegistration = async (registration, userId) => {
  const lng = registration.firmDetails?.addressData?.lng;
  const lat = registration.firmDetails?.addressData?.lat;

  const coordinates =
    Number.isFinite(Number(lng)) && Number.isFinite(Number(lat))
      ? [Number(lng), Number(lat)]
      : [-79.3832, 43.6532];

  const languages = normalizeLanguages(
    registration.professionalInformation?.languagesSpoken || []
  );

  const otherLanguage = languages.includes('other')
    ? registration.professionalInformation?.otherLanguage || ''
    : '';

  const yearAdmitted = registration.professionalInformation?.yearAdmitted;
  const yearsOfExperience = registration.professionalInformation?.yearsOfExperience;

  const safeExperience =
    yearAdmitted !== null &&
    yearAdmitted !== undefined &&
    yearsOfExperience !== null &&
    yearsOfExperience !== undefined
      ? Math.min(Number(yearsOfExperience), new Date().getFullYear() - Number(yearAdmitted))
      : yearsOfExperience;

  await CAProfile.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      firmName: registration.professionalInformation?.firmName || '',
      firmLogo:
        registration.verificationAndDocuments?.firmLogoFile?.fileUrl ||
        registration.verificationAndDocuments?.firmLogoFile?.filePath ||
        '',
      yearsOfExperience: safeExperience,
      otherLanguage,
      licenseNumber: registration.professionalInformation?.caNumber || '',
      policyNumber:
        registration.professionalCredentials?.professionalLiabilityInsurance?.policyNumber || '',
      yearAdmitted,
      peerReviewDate: registration.professionalCredentials?.peerReview?.reviewDate,
      address: {
        street: registration.firmDetails?.firmAddress || '',
        city: registration.firmDetails?.city || '',
        province: registration.firmDetails?.province || '',
        postalCode: registration.firmDetails?.postalCode || '',
        country: registration.firmDetails?.country || 'Canada',
        formattedAddress:
          registration.firmDetails?.addressData?.formattedAddress || '',
        placeId: registration.firmDetails?.addressData?.placeId || '',
        lat: registration.firmDetails?.addressData?.lat || null,
        lng: registration.firmDetails?.addressData?.lng || null
      },
      location: {
        type: 'Point',
        coordinates
      },
      serviceRadius: registration.practiceInformation?.serviceRadiusKm || 50,
      specializations: registration.specialtiesAndTechnology?.taxSpecialties || [],
      services: registration.practiceInformation?.serviceOfferings || [],
      languages,
      phone: normalizePhone(registration.accountInformation?.primaryPhone || ''),
      alternatePhone: registration.accountInformation?.alternatePhone || '',
      firmphone: normalizePhone(registration.firmDetails?.firmPhone || ''),
      website: registration.professionalInformation?.firmWebsite || '',
      hoursOfOperation: registration.practiceInformation?.hoursOfOperation || {},
      acceptingNewClients: registration.practiceInformation?.acceptingNewClients ?? true,
      availabilityStatus:
        registration.practiceInformation?.acceptingNewClients ?? true ? 'active' : 'not-accepting',
      verified: registration.status === 'approved',
      verifiedAt: registration.status === 'approved' ? new Date() : null,
      updatedAt: new Date()
    },
    { upsert: true, new: true, runValidators: false }
  );
};

const updateUserFromRegistration = async (userId, registration) => {
  const updateData = {
    role: 'ca',
    userType: 'other'
  };

  const firstName = registration.accountInformation?.firstName || '';
  const lastName = registration.accountInformation?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim();

  if (fullName) updateData.name = fullName;
  if (registration.accountInformation?.email) {
    updateData.email = registration.accountInformation.email;
  }
  if (registration.accountInformation?.primaryPhone) {
    updateData.phoneNumber = registration.accountInformation.primaryPhone;
  }
  if (registration.firmDetails?.province) {
    updateData.province = registration.firmDetails.province;
  }

  await User.findByIdAndUpdate(userId, updateData);
};

exports.saveDraft = async (req, res) => {
  try {
    const userId = req.user._id;

    let registration = await CARegistration.findOne({ user: userId });

    if (!registration) {
      registration = new CARegistration({
        user: userId,
        status: 'draft'
      });
    }

    const incoming = hasAnyKnownSection(req.body) ? mapDraftPayload(req.body) : req.body;

    Object.keys(incoming || {}).forEach((section) => {
      const nextValue = incoming[section];

      if (
        nextValue &&
        typeof nextValue === 'object' &&
        !Array.isArray(nextValue) &&
        !(nextValue instanceof Date)
      ) {
        registration[section] = deepMergeSection(registration[section], nextValue);
      } else {
        registration[section] = nextValue;
      }
    });

    registration.status = 'draft';

    await registration.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: 'CA registration draft saved successfully',
      registration
    });
  } catch (error) {
    console.error('saveDraft error:', error);
    console.error('saveDraft req.body:', JSON.stringify(req.body, null, 2));
    console.error('saveDraft mapped:', JSON.stringify(
      hasAnyKnownSection(req.body) ? mapDraftPayload(req.body) : req.body,
      null,
      2
    ));

    return res.status(500).json({
      success: false,
      message: 'Could not save CA registration draft',
      error: error.message
    });
  }
};

exports.submitRegistration = async (req, res) => {
  try {
    const existing = await CARegistration.findOne({ user: req.user.id });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'No CA registration draft found'
      });
    }

    if (existing.status === 'submitted') {
      return res.status(400).json({
        success: false,
        message: 'Registration already submitted'
      });
    }

    if (req.body && Object.keys(req.body).length > 0) {
      const payload = buildPayload(req.body);

      Object.keys(payload).forEach((key) => {
        existing[key] = deepMergeSection(existing[key], payload[key]);
      });
    }

    const errors = validateSubmission(existing);

    if (errors.length > 0) {
      existing.reviewSummary = existing.reviewSummary || {};
      existing.reviewSummary.reviewErrors = errors;
      await existing.save();

      return res.status(400).json({
        success: false,
        message: 'Please fix the validation errors before submitting',
        errors
      });
    }

    existing.status = 'submitted';
    existing.reviewSummary = existing.reviewSummary || {};
    existing.reviewSummary.submittedAt = new Date();
    existing.reviewSummary.reviewErrors = [];
    existing.onboarding = existing.onboarding || {};
    existing.onboarding.currentStep = 'review';
    existing.onboarding.completedSteps = STEP_ORDER;
    existing.onboarding.percentComplete = 100;

    await existing.save();

    await updateUserFromRegistration(req.user.id, existing);
    await syncProfileFromRegistration(existing, req.user.id);

    return res.json({
      success: true,
      message: 'CA registration submitted successfully',
      registration: existing
    });
  } catch (error) {
    console.error('submitRegistration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit CA registration',
      error: error.message
    });
  }
};

exports.getMyRegistration = async (req, res) => {
  try {
    const registration = await CARegistration.findOne({ user: req.user.id }).populate(
      'user',
      'name email role phoneNumber province'
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'CA registration not found'
      });
    }

    return res.json({
      success: true,
      registration
    });
  } catch (error) {
    console.error('getMyRegistration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch CA registration',
      error: error.message
    });
  }
};

exports.getDashboardSummary = async (req, res) => {
  try {
    const registration = await CARegistration.findOne({ user: req.user.id }).lean();

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'CA registration not found'
      });
    }

    return res.json({
      success: true,
      dashboard: {
        status: registration.status,
        submittedAt: registration.reviewSummary?.submittedAt || null,
        professionalSummary: {
          name: `${registration.accountInformation?.firstName || ''} ${
            registration.accountInformation?.lastName || ''
          }`.trim(),
          designation: registration.professionalInformation?.caDesignation || '',
          caNumber: registration.professionalInformation?.caNumber || '',
          province: registration.professionalInformation?.provinceOfRegistration || '',
          experience: registration.professionalInformation?.yearsOfExperience || 0,
          firm: registration.professionalInformation?.firmName || ''
        },
        credentialsStatus: {
          hasInsurance:
            registration.professionalCredentials?.professionalLiabilityInsurance?.hasInsurance ||
            false,
          cpaMemberInGoodStanding:
            registration.professionalCredentials?.cpaMembership?.isMemberInGoodStanding || false,
          hasDisciplinaryHistory:
            registration.professionalCredentials?.disciplinaryHistory?.hasHistory || false
        },
        documentsUploaded: {
          caCertificate: registration.verificationAndDocuments?.caCertificateFile || null,
          professionalHeadshot:
            registration.verificationAndDocuments?.professionalHeadshotFile || null,
          firmLogo: registration.verificationAndDocuments?.firmLogoFile || null
        },
        reviewErrors: registration.reviewSummary?.reviewErrors || []
      }
    });
  } catch (error) {
    console.error('getDashboardSummary error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard summary',
      error: error.message
    });
  }
};