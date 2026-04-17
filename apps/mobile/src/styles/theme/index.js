const colors = {
  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceAlt: '#F3F4F6',
  border: '#E5E7EB',

  white: '#FFFFFF',
  black: '#000000',
  shadow: '#000000',

  success: '#10B981',
  successSoft: '#ECFDF5',

  warning: '#F59E0B',
  warningSoft: '#FFFBEB',

  error: '#EF4444',
  errorSoft: '#FEF2F2',

  danger: '#EF4444',
  dangerSoft: '#FEF2F2',

  info: '#06B6D4',
  infoSoft: '#ECFEFF',

  text: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',

  textColors: {
    primary: '#111827',
    secondary: '#6B7280',
    muted: '#9CA3AF',
    inverse: '#FFFFFF',
  },

  primary: '#2563EB',
  primarySoft: '#DBEAFE',
  primaryDark: '#1D4ED8',

  primaryScale: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  secondary: '#7C3AED',
  secondarySoft: '#EDE9FE',
  secondaryDark: '#6D28D9',

  secondaryScale: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },

  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  grayScale: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  gold: {
    main: '#D4AF37',
  },
};

const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
  pill: 9999,
};

const radius = borderRadius;

const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },

  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  strong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,

  layout: {
    screenPadding: 16,
    cardPadding: 16,
    sectionGap: 16,
  },

  // backward-compat aliases
  radius: borderRadius,
  borderRadius,
  shadows,
  shadow: shadows,
};

const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },

  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    semiBold: '600',
    bold: '700',
    extrabold: '800',
  },

  display: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: -0.8,
  },

  h1: {
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 44,
  },
  h2: {
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 38,
  },
  h3: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  h6: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },

  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  bodyMedium: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },
  small: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },

  styles: {
    h2: {
      fontSize: 30,
      fontWeight: '700',
      lineHeight: 38,
    },
    h3: {
      fontSize: 24,
      fontWeight: '700',
      lineHeight: 32,
    },
    h4: {
      fontSize: 20,
      fontWeight: '700',
      lineHeight: 28,
    },
    h5: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 26,
    },
    h6: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
    },
    body1: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    },
    body2: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 18,
    },
  },
};

const theme = {
  colors,
  spacing,
  radius,
  borderRadius,
  typography,
  shadows,
};

export {
  theme,
  colors,
  spacing,
  radius,
  borderRadius,
  typography,
  shadows,
};

export default theme;