import React from 'react';
import { View, Text } from 'react-native';
import { theme } from '@/styles/theme';

const BADGE_VARIANTS = {
  verified: { container: 'success', text: 'successText', label: 'Verified' },
  success: { container: 'success', text: 'successText', label: 'Success' },
  business: { container: 'success', text: 'successText', label: 'Business' },

  pending: { container: 'warning', text: 'warningText', label: 'Pending' },
  warning: { container: 'warning', text: 'warningText', label: 'Warning' },
  commute: { container: 'warning', text: 'warningText', label: 'Commute' },

  active: { container: 'info', text: 'infoText', label: 'Active' },
  info: { container: 'info', text: 'infoText', label: 'Info' },
  personal: { container: 'info', text: 'infoText', label: 'Personal' },

  gold: { container: 'gold', text: 'goldText', label: 'Premium' },
  premium: { container: 'gold', text: 'goldText', label: 'Premium' },
};

const Badge = ({ status = 'info', text }) => {
  const variant = BADGE_VARIANTS[status] || BADGE_VARIANTS.info;

  const containerStyle = theme?.components?.badge?.[variant.container] || {};
  const textStyle = theme?.components?.badge?.[variant.text] || {};

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{text || variant.label || status}</Text>
    </View>
  );
};

export default Badge;


