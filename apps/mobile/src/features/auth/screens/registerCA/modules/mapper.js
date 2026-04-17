const normalizePostalCode = (value = '') => {
  const cleaned = String(value)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 6);

  if (!cleaned) return '';
  if (cleaned.length <= 3) return cleaned;

  return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
};

const normalizePhone = (value = '') =>
  String(value).replace(/\D/g, '').slice(0, 10);

const normalizeNumber = (value, fallback = '') => {
  if (value === '' || value === null || value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const mapFirmSize = (value = '') => {
  if (value === 'small') return 'Small';
  if (value === 'medium') return 'Medium';
  if (value === 'large') return 'Large';
  if (value === 'solo') return 'Solo';
  return value || 'Solo';
};

const uniq = (arr = []) => [...new Set(arr.filter(Boolean))];
const normalizePeerReviewOutcome = (value = '') => {
  const v = String(value || '').trim().toLowerCase();

  if (v === 'pass') return 'Pass';
  if (v === 'pass with conditions') return 'Pass with Conditions';
  if (v === 'pending') return 'Pending';
  if (v === 'other') return 'Other';

  return '';
};

export const getCARegisterPayload = (form) => ({
  name: `${form.firstName || ''} ${form.lastName || ''}`.trim(),
  email: String(form.email || '').trim().toLowerCase(),
  password: form.password || '',
  role: 'ca',
});

export const buildStepPayload = (step, form) => {
  switch (step) {
    case 1:
      return {
        accountInformation: {
          firstName: String(form.firstName || '').trim(),
          lastName: String(form.lastName || '').trim(),
          email: String(form.email || '').trim().toLowerCase(),
          primaryPhone: normalizePhone(form.primaryPhone || form.phone),
          alternatePhone: normalizePhone(form.alternatePhone),
        },
      };

    case 2:
      return {
        professionalInformation: {
          caDesignation: form.caDesignation || '',
          caNumber: String(form.caNumber || '').trim().toUpperCase(),
          provinceOfRegistration: form.provinceOfRegistration || 'ON',
          yearAdmitted: String(form.yearAdmitted || '').slice(0, 4),
          yearsOfExperience: normalizeNumber(form.yearsOfExperience, 0),
          firmName: String(form.firmName || '').trim(),
          firmWebsite: String(form.firmWebsite || '').trim(),
          areasOfExpertise: Array.isArray(form.areasOfExpertise)
            ? form.areasOfExpertise
            : [],
          languagesSpoken: Array.isArray(form.languagesSpoken)
            ? form.languagesSpoken
            : Array.isArray(form.languages)
              ? form.languages
              : [],
          otherLanguage: String(form.otherLanguage || '').trim(),
        },
      };

    case 3:
      return {
        firmDetails: {
          firmAddress: String(form.firmAddress || '').trim(),
          city: String(form.firmCity || form.city || '').trim(),
          province: form.firmProvince || form.province || 'ON',
          postalCode: normalizePostalCode(form.firmPostalCode),
          country: String(form.firmCountry || 'Canada').trim(),
          firmPhone: normalizePhone(form.firmPhone),
          firmEmail: String(form.firmEmail || '').trim().toLowerCase(),
          firmSize: mapFirmSize(form.firmSize),
          numberOfPartners: normalizeNumber(form.numberOfPartners, 0),
          numberOfStaff: normalizeNumber(form.numberOfStaff, 0),
          yearEstablished: String(form.yearEstablished || '').slice(0, 4),
        },
      };

    case 4:
      return {
        professionalCredentials: {
          professionalLiabilityInsurance: {
            hasInsurance: !!form.professionalLiabilityInsurance,
            provider: String(form.insuranceProvider || '').trim(),
            policyNumber: String(form.policyNumber || '').trim().toUpperCase(),
            coverageAmount: normalizeNumber(form.coverageAmount, 0),
          },
          cpaMembership: {
            isMemberInGoodStanding: !!form.cpaMemberInGoodStanding,
            licenseVerificationNumber: String(form.licenseVerification || '').trim(),
          },
          peerReview: {
            completedWithinLast3Years: !!form.peerReviewCompleted,
            reviewDate: form.peerReviewDate || '',
            outcome: normalizePeerReviewOutcome(form.peerReviewOutcome),
          },
          disciplinaryHistory: {
            hasHistory: !!form.disciplinaryHistory,
            details: form.disciplinaryHistory
              ? String(form.disciplinaryDetails || '').trim()
              : '',
          },
          criminalRecordCheck: {
            consentGiven: !!form.backgroundCheckConsent,
          },
        },
      };

    case 5:
  return {
    practiceInformation: {
      practiceType: String(form.practiceType || '').trim(),
      acceptingNewClients: !!form.acceptNewClients,

      // ✅ FIXED (THIS WAS THE BUG)
      primaryClientTypes: Array.isArray(form.clientTypes)
        ? form.clientTypes
        : [],

      averageClientsPerYear: normalizeNumber(form.averageClientsPerYear, 0),
      minimumFee: normalizeNumber(form.minimumFee, 0),
      maximumFee: normalizeNumber(form.maximumFee, 0),

      serviceOfferings: uniq([
        ...(Array.isArray(form.servicesOffered) ? form.servicesOffered : []),
        ...(form.offersVirtualServices ? ['Virtual Services'] : []),
        ...(form.offersInPersonServices ? ['In-Person Services'] : []),
      ]),

      serviceRadiusKm: normalizeNumber(form.serviceRadius, 50),
    },
  };
    case 6:
      return {
        specialtiesAndTechnology: {
          taxSpecialties: uniq([
            ...(Array.isArray(form.taxSpecialties) ? form.taxSpecialties : []),
            ...(Array.isArray(form.provincialSpecialties) ? form.provincialSpecialties : []),
            ...(form.internationalTax ? ['International Tax'] : []),
            ...(form.usTax ? ['US Tax'] : []),
            ...(form.crossBorder ? ['Cross-Border'] : []),
            ...(form.estatePlanning ? ['Estate Planning'] : []),
            ...(form.corporateRestructuring ? ['Corporate Restructuring'] : []),
            ...(form.mergersAcquisitions ? ['Mergers & Acquisitions'] : []),
            ...(Array.isArray(form.advisoryServices) ? form.advisoryServices : []),
            ...(Array.isArray(form.certifications) ? form.certifications : []),
            ...(Array.isArray(form.nicheExpertise) ? form.nicheExpertise : []),
          ]),
          accountingSoftware: uniq([
            ...(Array.isArray(form.accountingSoftware) ? form.accountingSoftware : []),
            ...(Array.isArray(form.softwareSkills) ? form.softwareSkills : []),
          ]),
          taxSoftware: Array.isArray(form.taxSoftware) ? form.taxSoftware : [],
          practiceManagementSoftware: form.practiceManagementSoftware || '',
          clientPortalAccess: !!form.offersPortalAccess,
          digitalDocumentSigning: !!form.acceptsDigitalDocuments,
          endToEndEncryption: !!form.usesEncryption,
          twoFactorAuthentication: !!form.twoFactorAuth,
        },
      };

    case 7:
      return {
        verificationAndDocuments: {
          caCertificateFile: form.caCertificate
            ? {
                originalName:
                  form.caCertificate?.fileName ||
                  form.caCertificate?.name ||
                  'ca-certificate',
                fileName:
                  form.caCertificate?.fileName ||
                  form.caCertificate?.name ||
                  'ca-certificate',
                filePath: form.caCertificate?.uri || '',
                fileUrl: '',
                mimeType: form.caCertificate?.mimeType || form.caCertificate?.type || '',
                size: form.caCertificate?.size || 0,
                uploadedAt: new Date(),
              }
            : undefined,
          professionalHeadshotFile: form.professionalHeadshot
            ? {
                originalName:
                  form.professionalHeadshot?.fileName ||
                  form.professionalHeadshot?.name ||
                  'headshot',
                fileName:
                  form.professionalHeadshot?.fileName ||
                  form.professionalHeadshot?.name ||
                  'headshot',
                filePath: form.professionalHeadshot?.uri || '',
                fileUrl: '',
                mimeType:
                  form.professionalHeadshot?.mimeType || form.professionalHeadshot?.type || '',
                size: form.professionalHeadshot?.size || 0,
                uploadedAt: new Date(),
              }
            : undefined,
          firmLogoFile: form.firmLogo
            ? {
                originalName: form.firmLogo?.fileName || form.firmLogo?.name || 'firm-logo',
                fileName: form.firmLogo?.fileName || form.firmLogo?.name || 'firm-logo',
                filePath: form.firmLogo?.uri || '',
                fileUrl: '',
                mimeType: form.firmLogo?.mimeType || form.firmLogo?.type || '',
                size: form.firmLogo?.size || 0,
                uploadedAt: new Date(),
              }
            : undefined,
          professionalReferences: Array.isArray(form.professionalReferences)
            ? form.professionalReferences
            : [],
          authorizeTaxVaultVerification: !!form.authorizeVerification,
          consentBackgroundCheck: !!form.backgroundCheckConsent,
        },
      };

    case 8:
      return {
        reviewAndSubmit: {
          agreedTermsAndConditions: !!form.agreedTerms,
          agreedPrivacyPolicy: !!form.agreedPrivacy,
          agreedProfessionalTerms: !!form.agreedProfessionalTerms,
          confirmAccuracy: !!form.confirmAccuracy,
        },
      };

    default:
      return {};
  }
};

export const getCASaveDraftPayload = (form, currentStep) => {
  return buildStepPayload(currentStep, form);
};

export const getCASubmitPayload = (form) => ({
  ...buildStepPayload(1, form),
  ...buildStepPayload(2, form),
  ...buildStepPayload(3, form),
  ...buildStepPayload(4, form),
  ...buildStepPayload(5, form),
  ...buildStepPayload(6, form),
  ...buildStepPayload(7, form),
  ...buildStepPayload(8, form),
});