import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { normalizeGoogleAddress } from '@taxvault/shared/address/normalizeAddress';

const GoogleAddressInput = ({ onChange }) => {
  return (
    <GooglePlacesAutocomplete
      placeholder="Enter address"
      fetchDetails={true}
      onPress={(data, details = null) => {
        const normalized = normalizeGoogleAddress(details);
        onChange(normalized);
      }}
      query={{
        key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        language: 'en',
        components: 'country:ca', // 🇨🇦 IMPORTANT
      }}
      styles={{
        textInput: {
          height: 48,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 12,
        },
      }}
    />
  );
};

export default GoogleAddressInput;