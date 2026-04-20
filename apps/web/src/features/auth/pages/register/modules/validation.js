import { calculateAge, isValidEmail } from './helpers';

export const validateStep = (step, formData) => {
  const errors = {};
  const familyStatus = formData.familyStatus || formData.maritalStatus || '';
  const needsSpouse =
    familyStatus === 'Married' || familyStatus === 'Common-Law';

  if (step === 1) {
    if (!formData.firstName?.trim()) {
      errors.firstName = 'First name is required.';
    }

    if (!formData.lastName?.trim()) {
      errors.lastName = 'Last name is required.';
    }

    if (!formData.email?.trim()) {
      errors.email = 'Email is required.';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Enter a valid email address.';
    }

    if ((formData.phone || '').replace(/\D/g, '').length !== 10) {
      errors.phone = 'Enter a valid phone number.';
    }

    if ((formData.password || '').length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
  }

  if (step === 2) {
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required.';
    } else if (calculateAge(formData.dateOfBirth) < 18) {
      errors.dateOfBirth = 'You must be at least 18 years old.';
    }

    if (!formData.address?.trim()) {
      errors.address = 'Address is required.';
    }

    if (!formData.province) {
      errors.province = 'Province is required.';
    }

    if (!formData.city) {
      errors.city = 'City is required.';
    }

    if ((formData.postalCode || '').replace(/\s/g, '').length < 6) {
      errors.postalCode = 'Postal code is required.';
    }

    if (!familyStatus) {
      errors.familyStatus = 'Family status is required.';
    }

    if (needsSpouse) {
      if (!formData.spouseName?.trim()) {
        errors.spouseName = 'Spouse name is required.';
      }

      if (!formData.spouseDob) {
        errors.spouseDob = 'Spouse date of birth is required.';
      }
    }
  }

  if (step === 3) {
    if (!formData.employmentStatus) {
      errors.employmentStatus = 'Employment status is required.';
    }

    if (!Object.values(formData.taxProfile || {}).some(Boolean)) {
      errors.taxProfile = 'Select at least one tax profile option.';
    }

    if (needsSpouse) {
      if (!Object.values(formData.spouseTaxProfile || {}).some(Boolean)) {
        errors.spouseTaxProfile = 'Select at least one spouse tax profile option.';
      }

      if (!formData.spouseEmploymentStatus) {
        errors.spouseEmploymentStatus = 'Spouse employment status is required.';
      }
    }
  }

  if (step === 4) {
    if (formData.taxProfile?.gigWork) {
      if (
        (!formData.gigPlatforms || formData.gigPlatforms.length === 0) &&
        !formData.gigPlatformOther?.trim()
      ) {
        errors.gigPlatforms = 'Select at least one platform or add another.';
      }
    }

    if (
      formData.taxProfile?.selfEmployed &&
      !formData.selfEmploymentBusinessName?.trim()
    ) {
      errors.selfEmploymentBusinessName = 'Business / trade name is required.';
    }

    if (formData.taxProfile?.businessOwner) {
      if (!formData.businessName?.trim()) {
        errors.businessName = 'Business name is required.';
      }

      if (!formData.businessNumber?.trim()) {
        errors.businessNumber = 'Business number is required.';
      }
    }

    if (needsSpouse && formData.spouseTaxProfile?.gigWork) {
      if (
        (!formData.spouseGigPlatforms || formData.spouseGigPlatforms.length === 0) &&
        !formData.spouseGigPlatformOther?.trim()
      ) {
        errors.spouseGigPlatforms =
          'Select at least one platform or add another.';
      }
    }

    if (
      needsSpouse &&
      formData.spouseTaxProfile?.selfEmployed &&
      !formData.spouseSelfEmploymentBusinessName?.trim()
    ) {
      errors.spouseSelfEmploymentBusinessName =
        'Business / trade name is required.';
    }

    if (needsSpouse && formData.spouseTaxProfile?.businessOwner) {
      if (!formData.spouseBusinessName?.trim()) {
        errors.spouseBusinessName = 'Business name is required.';
      }

      if (!formData.spouseBusinessNumber?.trim()) {
        errors.spouseBusinessNumber = 'Business number is required.';
      }
    }
  }

  if (step === 5 && formData.vehiclePurchasedForWork) {
    if (!formData.vehicles || formData.vehicles.length === 0) {
      errors.vehicles = 'Add at least one vehicle.';
    } else {
      formData.vehicles.forEach((vehicle, index) => {
        if (!vehicle.ownerPerson) {
          errors[`vehicles.${index}.ownerPerson`] = 'Select vehicle owner.';
        }

        if (!vehicle.ownershipType) {
          errors[`vehicles.${index}.ownershipType`] = 'Select ownership type.';
        }

        if (!vehicle.mainUse) {
          errors[`vehicles.${index}.mainUse`] = 'Select main use.';
        }

        if (!vehicle.purchaseDate) {
          errors[`vehicles.${index}.purchaseDate`] = 'Purchase date is required.';
        }

        if (!vehicle.purchasePrice) {
          errors[`vehicles.${index}.purchasePrice`] = 'Purchase price is required.';
        }
      });
    }
  }

  if (step === 6) {
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms.';
    }

    if (!formData.agreeToPrivacy) {
      errors.agreeToPrivacy = 'You must agree to the privacy policy.';
    }

    if (!formData.confirmAccuracy) {
      errors.confirmAccuracy = 'Please confirm your information is accurate.';
    }
  }

  return errors;
};