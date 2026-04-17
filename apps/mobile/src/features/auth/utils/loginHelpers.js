export const validateLoginForm = ({ email, password }, role = 'user', caNumber = '') => {
  const errors = {};

  if (!email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'Enter a valid email';
  }

  if (!password?.trim()) {
    errors.password = 'Password is required';
  }

  if (role === 'ca' && !caNumber?.trim()) {
    errors.caNumber = 'CA number is required';
  }

  return errors;
};

export const getRememberedDemoPayload = (scenario) => ({
  email: scenario.email,
  password: scenario.password,
  role: scenario.role || 'user',
  caNumber: scenario.caNumber || '',
});

export const normalizeEmail = (value = '') => value.trim().toLowerCase();


