export const normalizeGoogleAddress = (place = {}) => {
  const components = place.address_components || [];

  const getLong = (type) =>
    components.find((c) => c.types?.includes(type))?.long_name || '';

  const getShort = (type) =>
    components.find((c) => c.types?.includes(type))?.short_name || '';

  const latValue =
    typeof place.geometry?.location?.lat === 'function'
      ? place.geometry.location.lat()
      : place.geometry?.location?.lat;

  const lngValue =
    typeof place.geometry?.location?.lng === 'function'
      ? place.geometry.location.lng()
      : place.geometry?.location?.lng;

  return {
    formattedAddress: place.formatted_address || place.description || '',
    streetNumber: getLong('street_number'),
    streetName: getLong('route'),
    unit: '',
    city:
      getLong('locality') ||
      getLong('postal_town') ||
      getLong('administrative_area_level_2'),
    province: getShort('administrative_area_level_1'),
    postalCode: getLong('postal_code'),
    country: getLong('country') || 'Canada',
    placeId: place.place_id || '',
    lat: latValue || null,
    lng: lngValue || null,
  };
};