import api from '@/services/api';

const normalizeCA = (item = {}) => ({
  id: item._id || item.id || '',
  firstName: item.firstName || item.accountInformation?.firstName || '',
  lastName: item.lastName || item.accountInformation?.lastName || '',
  fullName:
    item.fullName ||
    [item.firstName || item.accountInformation?.firstName, item.lastName || item.accountInformation?.lastName]
      .filter(Boolean)
      .join(' ')
      .trim(),
  email: item.email || item.accountInformation?.email || '',
  phone:
    item.phone ||
    item.phoneNumber ||
    item.accountInformation?.primaryPhone ||
    item.firmDetails?.firmPhone ||
    '',
  designation:
    item.designation ||
    item.caDesignation ||
    item.professionalInformation?.caDesignation ||
    '',
  caNumber:
    item.caNumber ||
    item.professionalInformation?.caNumber ||
    item.licenseNumber ||
    '',
  firmName:
    item.firmName ||
    item.professionalInformation?.firmName ||
    item.firmDetails?.firmName ||
    '',
  firmWebsite:
    item.firmWebsite ||
    item.professionalInformation?.firmWebsite ||
    '',
  province:
    item.province ||
    item.provinceOfRegistration ||
    item.professionalInformation?.provinceOfRegistration ||
    item.firmDetails?.province ||
    '',
  city: item.city || item.firmDetails?.city || '',
  yearsOfExperience:
    item.yearsOfExperience ||
    item.professionalInformation?.yearsOfExperience ||
    0,
  areasOfExpertise:
    item.areasOfExpertise ||
    item.specialties ||
    item.professionalInformation?.areasOfExpertise ||
    [],
  languages:
    item.languages ||
    item.languagesSpoken ||
    item.professionalInformation?.languagesSpoken ||
    [],
  bio: item.bio || item.about || '',
  profileImage:
    item.profileImage ||
    item.avatar ||
    item.photo ||
    '',
  acceptingNewClients:
    typeof item.acceptingNewClients === 'boolean'
      ? item.acceptingNewClients
      : true,
});

const extractArray = (response) => {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data?.cas)) return response.data.cas;
  if (Array.isArray(response?.data?.results)) return response.data.results;
  if (Array.isArray(response?.data?.profiles)) return response.data.profiles;
  return [];
};

const caService = {
  getCAList: async (params = {}) => {
    const query = new URLSearchParams();

    if (params.search) query.append('search', params.search);
    if (params.province) query.append('province', params.province);
    if (params.expertise) query.append('expertise', params.expertise);

    const queryString = query.toString();
    const url = queryString ? `/ca/search?${queryString}` : '/ca/search';

    const response = await api.get(url);
    const items = extractArray(response);

    return items.map(normalizeCA);
  },

  getCAById: async (id) => {
    const response = await api.get(`/ca/profile/${id}`);
    const data =
      response?.data?.data ||
      response?.data?.profile ||
      response?.data?.ca ||
      response?.data;

    return normalizeCA(data);
  },
};

export default caService;