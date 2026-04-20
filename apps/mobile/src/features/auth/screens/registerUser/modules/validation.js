export const validateRegisterUserStep = ({ currentStep, form }) => {
  const errors = {};

  const safeTrim = (value = '') => String(value || '').trim();

  const normalizePhoneNumber = (phone = '') => {
    const digits = String(phone || '').replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('1')) {
      return digits;
    }
    return digits;
  };

  const isValidEmail = (email = '') => /\S+@\S+\.\S+/.test(safeTrim(email));

  const isValidPhone = (phone = '') =>
    /^(1)?\d{10}$/.test(normalizePhoneNumber(phone));

  const isValidPassword = (password = '') =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(
      String(password || '')
    );

  const isMarriedLike = (familyStatus = '') =>
    ['Married', 'Common Law'].includes(safeTrim(familyStatus));

  if (currentStep === 1) {
    if (!safeTrim(form.firstName)) {
      errors.firstName = 'First name required';
    }

    if (!safeTrim(form.lastName)) {
      errors.lastName = 'Last name required';
    }

    if (!safeTrim(form.email)) {
      errors.email = 'Email required';
    } else if (!isValidEmail(form.email)) {
      errors.email = 'Invalid email';
    }

    if (!safeTrim(form.phone)) {
      errors.phone = 'Phone required';
    } else if (!isValidPhone(form.phone)) {
      errors.phone = 'Invalid phone number';
    }

    if (!safeTrim(form.password)) {
      errors.password = 'Password required';
    } else if (!isValidPassword(form.password)) {
      errors.password =
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character';
    }

    if (!safeTrim(form.confirmPassword)) {
      errors.confirmPassword = 'Confirm password required';
    } else if (String(form.password) !== String(form.confirmPassword)) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }

  if (currentStep === 2) {
    if (!safeTrim(form.province)) {
      errors.province = 'Province required';
    }

    if (!safeTrim(form.userType)) {
      errors.userType = 'User type required';
    }
  }

  if (currentStep === 3) {
    if (!safeTrim(form.familyStatus)) {
      errors.familyStatus = 'Family status required';
    }

    if (isMarriedLike(form.familyStatus) && !safeTrim(form.spouseName)) {
      errors.spouseName = 'Spouse name required';
    }

    if (
      safeTrim(form.numberOfDependents) &&
      Number.isNaN(Number(form.numberOfDependents))
    ) {
      errors.numberOfDependents = 'Enter a valid number';
    }
  }

  if (currentStep === 5) {
    if (form.vehicleOwned && (!Array.isArray(form.vehicleUse) || form.vehicleUse.length === 0)) {
      errors.vehicleUse = 'Select at least one vehicle use';
    }
  }

  if (currentStep === 7) {
    if (!form.agreeToTerms) {
      errors.agreeToTerms = 'Accept terms';
    }

    if (!form.agreeToPrivacy) {
      errors.agreeToPrivacy = 'Accept privacy';
    }

    if (!form.confirmAccuracy) {
      errors.confirmAccuracy = 'Confirm accuracy';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default validateRegisterUserStep;