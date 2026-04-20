import {
  normalizeFirmSize,
  normalizePhoneNumber,
  normalizePostalCode,
  normalizeWebsite,
  safeArray
} from './helpers';

export const buildCARegisterPayload = (form) => ({
  name: `${String(form.firstName || '').trim()} ${String(form.lastName || '').trim()}`.trim(),
  email: String(form.email || '').trim(),
  password: String(form.password || ''),
  role: 'ca'
});

export const buildCADraftPayload = (form) => ({
  accountInformation: {
    firstName: String(form.firstName || '').trim(),
    lastName: String(form.lastName || '').trim(),
    email: String(form.email || '').trim(),
    primaryPhone: normalizePhoneNumber(form.phone || form.primaryPhone),
    alternatePhone: normalizePhoneNumber(form.alternatePhone)
  },
  professionalInformation: {
    caDesignation: String(form.caDesignation || '').trim(),
    caNumber: String(form.caNumber || '').trim(),
    provinceOfRegistration: String(form.provinceOfRegistration || '').trim(),
    yearAdmitted: String(form.yearAdmitted || '').trim(),
    yearsOfExperience: Number(form.yearsOfExperience || 0) || 0,
    firmName: String(form.firmName || '').trim(),
    firmWebsite: normalizeWebsite(form.firmWebsite),
    areasOfExpertise: safeArray(form.areasOfExpertise),
    languagesSpoken: safeArray(form.languages),
    otherLanguage: String(form.otherLanguage || '').trim(),
    professionalDesignations: safeArray(form.professionalDesignations)
  },
  firmDetails: {
    firmAddress: String(form.firmAddress || '').trim(),
    city: String(form.city || '').trim(),
    province: String(form.province || '').trim(),
    postalCode: normalizePostalCode(form.firmPostalCode),
    country: String(form.firmCountry || 'Canada').trim(),
    firmPhone: normalizePhoneNumber(form.firmPhone),
    firmEmail: String(form.firmEmail || '').trim(),
    firmSize: normalizeFirmSize(form.firmSize),
    numberOfPartners: Number(form.numberOfPartners || 0) || 0,
    numberOfStaff: Number(form.numberOfStaff || 0) || 0,
    yearEstablished: String(form.yearEstablished || '').trim()
  },
  credentials: {
    professionalLiabilityInsurance: !!form.professionalLiabilityInsurance,
    insuranceProvider: String(form.insuranceProvider || '').trim(),
    policyNumber: String(form.policyNumber || '').trim(),
    policyExpiryDate: form.policyExpiryDate || '',
    peerReviewCompleted: !!form.peerReviewCompleted,
    peerReviewDate: form.peerReviewDate || ''
  },
  practiceDetails: {
    practiceType: String(form.practiceType || '').trim(),
    taxServicesOffered: safeArray(form.taxServicesOffered),
    clientTypesServed: safeArray(form.clientTypesServed),
    industriesServed: safeArray(form.industriesServed),
    serviceAreas: safeArray(form.serviceAreas)
  },
  verification: {
    referenceName: String(form.referenceName || '').trim(),
    referenceEmail: String(form.referenceEmail || '').trim(),
    authorizeCredentialCheck: !!form.authorizeCredentialCheck,
    agreedTermsAndConditions: !!form.agreedTermsAndConditions,
    agreedPrivacyPolicy: !!form.agreedPrivacyPolicy,
    agreedProfessionalTerms: !!form.agreedProfessionalTerms,
    confirmAccuracy: !!form.confirmAccuracy
  }
});

export const buildCASubmitPayload = (form) => buildCADraftPayload(form);