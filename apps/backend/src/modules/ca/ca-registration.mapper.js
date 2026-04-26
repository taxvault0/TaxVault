const normalizeString = (value = '') => String(value ?? '').trim();

const normalizeUpper = (value = '') => normalizeString(value).toUpperCase();

const normalizePhone = (value = '') =>
  String(value ?? '').replace(/\D/g, '').slice(0, 10);

const normalizePostalCode = (value = '') => {
  const cleaned = normalizeUpper(value).replace(/[^A-Z0-9]/g, '').slice(0, 6);
  if (!cleaned) return '';
  if (cleaned.length <= 3) return cleaned;
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
};

const normalizeNumber = (value, fallback = 0) => {
  if (value === '' || value === null || value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeArray = (value) => (Array.isArray(value) ? value : []);

const hasAnyKnownSection = (body = {}) =>
  Boolean(
    body.accountInformation ||
      body.professionalInformation ||
      body.firmDetails ||
      body.credentialsDetails ||
      body.professionalCredentials ||
      body.practiceDetails ||
      body.specialtiesDetails ||
      body.specialties ||
      body.verificationDetails ||
      body.verification
  );

const mapDraftPayload = (body = {}) => {
  const draft = {};

  // STEP 1
  if (body.accountInformation) {
    draft.accountInformation = {
      firstName: normalizeString(body.accountInformation.firstName),
      lastName: normalizeString(body.accountInformation.lastName),
      email: normalizeString(body.accountInformation.email).toLowerCase(),
      primaryPhone: normalizePhone(body.accountInformation.primaryPhone),
      alternatePhone: normalizePhone(body.accountInformation.alternatePhone),
    };
  }

  // STEP 2
  if (body.professionalInformation) {
    draft.professionalInformation = {
      caDesignation: normalizeString(body.professionalInformation.caDesignation),
      caNumber: normalizeUpper(body.professionalInformation.caNumber),
      provinceOfRegistration: normalizeUpper(
        body.professionalInformation.provinceOfRegistration || 'ON'
      ),
      yearAdmitted: normalizeString(
        body.professionalInformation.yearAdmitted
      ).slice(0, 4),
      yearsOfExperience: normalizeNumber(
        body.professionalInformation.yearsOfExperience,
        0
      ),
      firmName: normalizeString(body.professionalInformation.firmName),
      firmWebsite: normalizeString(body.professionalInformation.firmWebsite),
      areasOfExpertise: normalizeArray(
        body.professionalInformation.areasOfExpertise
      ),
      languagesSpoken: normalizeArray(
        body.professionalInformation.languagesSpoken
      ),
      otherLanguage: normalizeString(
        body.professionalInformation.otherLanguage
      ),
    };
  }

  // STEP 3
  if (body.firmDetails) {
    draft.firmDetails = {
      firmAddress: normalizeString(body.firmDetails.firmAddress),
      city: normalizeString(body.firmDetails.city),
      province: normalizeUpper(body.firmDetails.province || 'ON'),
      postalCode: normalizePostalCode(body.firmDetails.postalCode),
      country: normalizeString(body.firmDetails.country || 'Canada'),
      addressData: body.firmDetails.addressData || null,
      firmPhone: normalizePhone(body.firmDetails.firmPhone),
      firmEmail: normalizeString(body.firmDetails.firmEmail).toLowerCase(),
      firmSize: normalizeString(body.firmDetails.firmSize),
      yearEstablished: normalizeString(body.firmDetails.yearEstablished).slice(0, 4),
      numberOfPartners: normalizeNumber(body.firmDetails.numberOfPartners, 0),
      numberOfStaff: normalizeNumber(body.firmDetails.numberOfStaff, 0),
    };
  }

  // STEP 4 (FIXED STRUCTURE)
  if (body.credentialsDetails || body.professionalCredentials) {
    const src = body.credentialsDetails || body.professionalCredentials;

    draft.professionalCredentials = {
      professionalLiabilityInsurance: {
        hasInsurance: true,
        provider: normalizeString(src.insuranceProvider),
        policyNumber: normalizeUpper(src.policyNumber),
        coverageAmount: normalizeNumber(src.coverageAmount, 0),
      },
      cpaMembership: {
        isMemberInGoodStanding: true,
      },
      peerReview: {
        completedWithinLast3Years: Boolean(src.peerReviewed),
        reviewDate: src.lastPeerReviewDate || '',
      },
      disciplinaryHistory: {
        hasHistory: Boolean(src.disciplinaryAction),
        details: normalizeString(src.disciplinaryDetails),
      },
    };
  }

  // STEP 5
  if (body.practiceDetails) {
    draft.practiceInformation = {
      practiceType: normalizeString(body.practiceDetails.practiceType),
      acceptingNewClients: true,
      primaryClientTypes: normalizeArray(body.practiceDetails.clientTypes),
      serviceOfferings: normalizeArray(body.practiceDetails.servicesOffered),
      averageClientsPerYear: normalizeNumber(body.practiceDetails.averageClientsPerYear, 0),
      minimumFee: normalizeNumber(body.practiceDetails.minimumFee, 0),
      maximumFee: normalizeNumber(body.practiceDetails.maximumFee, 0),
      serviceRadiusKm: normalizeNumber(body.practiceDetails.serviceRadius, 50),
    };
  }

  // STEP 6
  if (body.specialtiesDetails || body.specialties) {
    const src = body.specialtiesDetails || body.specialties;

    draft.specialtiesAndTechnology = {
      taxSpecialties: normalizeArray(src.taxServices),
      accountingSoftware: normalizeArray(src.softwareSkills),
      practiceManagementSoftware: '',
      clientPortalAccess: true,
      digitalDocumentSigning: true,
    };
  }

  // STEP 7
  if (body.verificationDetails || body.verification) {
    const src = body.verificationDetails || body.verification;

    draft.reviewAndSubmit = {
      agreedTermsAndConditions: Boolean(src.agreedTermsAndConditions),
      agreedPrivacyPolicy: Boolean(src.agreedPrivacyPolicy),
      agreedProfessionalTerms: Boolean(src.agreedProfessionalTerms),
      confirmAccuracy: Boolean(src.confirmAccuracy),
    };
  }

  return draft;
};

module.exports = {
  mapDraftPayload,
  hasAnyKnownSection,
};