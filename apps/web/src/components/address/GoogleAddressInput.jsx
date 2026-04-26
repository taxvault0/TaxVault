import React, { useRef } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { normalizeGoogleAddress } from '@taxvault/shared/address/normalizeAddress';

const libraries = ['places'];

const GoogleAddressInput = ({ value, onChange }) => {
  const autocompleteRef = useRef(null);

  const onLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    const normalized = normalizeGoogleAddress(place);

    onChange(normalized);
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          componentRestrictions: { country: 'ca' }, // 🇨🇦 IMPORTANT
        }}
      >
        <input
          type="text"
          placeholder="Enter address"
          defaultValue={value?.formattedAddress || ''}
          style={{
            width: '100%',
            height: '48px',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        />
      </Autocomplete>
    </LoadScript>
  );
};

export default GoogleAddressInput;