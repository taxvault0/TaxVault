// import React, { useMemo, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   Platform,
//   Switch,
//   Modal,
//   FlatList,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import * as DocumentPicker from 'expo-document-picker';

// import Card from '@/components/ui/Card';
// import { colors } from '@/styles/theme';
// import { useAuth } from '@/features/auth/context/AuthContext';
// import styles from './register/RegisterScreen.styles';

// const GOOGLE_PLACES_API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY';

// const provinces = [
//   'Alberta',
//   'British Columbia',
//   'Manitoba',
//   'New Brunswick',
//   'Newfoundland and Labrador',
//   'Nova Scotia',
//   'Ontario',
//   'Prince Edward Island',
//   'Quebec',
//   'Saskatchewan',
//   'Northwest Territories',
//   'Nunavut',
//   'Yukon',
// ];

// const provinceCities = {
//   Alberta: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat', 'Grande Prairie', 'Other'],
//   'British Columbia': ['Vancouver', 'Surrey', 'Burnaby', 'Richmond', 'Victoria', 'Kelowna', 'Abbotsford', 'Other'],
//   Manitoba: ['Winnipeg', 'Brandon', 'Steinbach', 'Thompson', 'Portage la Prairie', 'Other'],
//   'New Brunswick': ['Moncton', 'Saint John', 'Fredericton', 'Miramichi', 'Edmundston', 'Other'],
//   'Newfoundland and Labrador': ['St. John’s', 'Mount Pearl', 'Corner Brook', 'Gander', 'Happy Valley-Goose Bay', 'Other'],
//   'Nova Scotia': ['Halifax', 'Sydney', 'Dartmouth', 'Truro', 'New Glasgow', 'Other'],
//   Ontario: ['Toronto', 'Ottawa', 'Mississauga', 'Brampton', 'Hamilton', 'London', 'Kitchener', 'Windsor', 'Other'],
//   'Prince Edward Island': ['Charlottetown', 'Summerside', 'Stratford', 'Cornwall', 'Other'],
//   Quebec: ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke', 'Trois-Rivières', 'Other'],
//   Saskatchewan: ['Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw', 'Swift Current', 'Other'],
//   'Northwest Territories': ['Yellowknife', 'Hay River', 'Inuvik', 'Fort Smith', 'Other'],
//   Nunavut: ['Iqaluit', 'Rankin Inlet', 'Arviat', 'Cambridge Bay', 'Other'],
//   Yukon: ['Whitehorse', 'Dawson City', 'Watson Lake', 'Haines Junction', 'Other'],
// };

// const profileOptions = [
//   {
//     key: 'employment',
//     label: 'Employment',
//     description: 'T4 salary / payroll',
//     icon: 'briefcase-outline',
//   },
//   {
//     key: 'gigWork',
//     label: 'Gig Work',
//     description: 'Uber, DoorDash, etc.',
//     icon: 'car-outline',
//   },
//   {
//     key: 'selfEmployment',
//     label: 'Self-Employed',
//     description: 'Freelance / contract',
//     icon: 'coffee-outline',
//   },
//   {
//     key: 'incorporatedBusiness',
//     label: 'Business Owner',
//     description: 'Corporation / active business',
//     icon: 'office-building-outline',
//   },
//   {
//     key: 'unemployed',
//     label: 'Unemployed',
//     description: 'Currently not working',
//     icon: 'account-off-outline',
//   },
// ];

// const employmentStatuses = [
//   'Full-time',
//   'Part-time',
//   'Contract',
//   'Seasonal',
//   'Self-employed',
//   'Unemployed',
//   'Retired',
// ];

// const taxFilingStatuses = [
//   'Single',
//   'Married',
//   'Common-Law',
//   'Separated',
//   'Divorced',
//   'Widowed',
// ];

// const spouseEmploymentStatuses = [
//   'Full-time',
//   'Part-time',
//   'Contract',
//   'Self-employed',
//   'Business owner',
//   'Gig worker',
//   'Student',
//   'Unemployed',
//   'Retired',
// ];

// const businessTypes = [
//   'Sole Proprietorship',
//   'Partnership',
//   'Corporation',
//   'Cooperative',
//   'Non-profit',
// ];

// const platforms = [
//   'Uber',
//   'DoorDash',
//   'SkipTheDishes',
//   'Instacart',
//   'Amazon Flex',
//   'Lyft',
//   'TaskRabbit',
//   'Fiverr',
//   'Upwork',
//   'Other',
// ];

// const dependentOptions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];

// const receiptOptions = [
//   { key: 'fuel', label: 'Fuel' },
//   { key: 'maintenance', label: 'Maintenance' },
//   { key: 'parking_tolls', label: 'Parking / Tolls' },
//   { key: 'meals', label: 'Meals' },
//   { key: 'mobile_internet', label: 'Mobile / Internet' },
//   { key: 'supplies', label: 'Supplies' },
//   { key: 'equipment', label: 'Equipment' },
//   { key: 'insurance', label: 'Insurance' },
//   { key: 'rent_utilities', label: 'Rent / Utilities' },
//   { key: 'home_office', label: 'Home Office' },
//   { key: 'vehicle_expenses', label: 'Vehicle Expenses' },
//   { key: 'professional_fees', label: 'Professional Fees' },
//   { key: 'other', label: 'Other Receipts' },
// ];

// const vehicleOwnershipOptions = ['Owned / Cash purchase', 'Financed', 'Leased'];

// const getVehicleUseOptions = (taxProfile) => {
//   const options = [];

//   if (taxProfile.gigWork) options.push('Gig Work');
//   if (taxProfile.selfEmployment) options.push('Self-Employment');
//   if (taxProfile.incorporatedBusiness) options.push('Business Use');

//   return options;
// };

// const steps = [
//   { number: 1, title: 'Account', icon: 'account-outline' },
//   { number: 2, title: 'Personal', icon: 'card-account-details-outline' },
//   { number: 3, title: 'Tax', icon: 'file-document-outline' },
//   { number: 4, title: 'Income', icon: 'cash-multiple' },
//   { number: 5, title: 'Vehicle', icon: 'car-info' },
//   { number: 6, title: 'Deductions', icon: 'heart-outline' },
//   { number: 7, title: 'Family', icon: 'account-group-outline' },
//   { number: 8, title: 'Review', icon: 'check-circle-outline' },
// ];

// const RegisterScreen = ({ navigation }) => {
//   const { register } = useAuth();

//   const scrollRef = useRef(null);
//   const fieldRefs = useRef({});

//   const [currentStep, setCurrentStep] = useState(1);
//   const [showDobPicker, setShowDobPicker] = useState(false);
//   const [showSpouseDobPicker, setShowSpouseDobPicker] = useState(false);
// const [showVehiclePurchaseDatePicker, setShowVehiclePurchaseDatePicker] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [customCity, setCustomCity] = useState(false);

//   const [selectorVisible, setSelectorVisible] = useState(false);
//   const [selectorTitle, setSelectorTitle] = useState('');
//   const [selectorOptions, setSelectorOptions] = useState([]);
//   const [selectorValue, setSelectorValue] = useState('');
//   const [selectorFieldKey, setSelectorFieldKey] = useState('');
//   const [selectorOnChange, setSelectorOnChange] = useState(null);

//   const [formData, setFormData] = useState({
//   firstName: '',
//   lastName: '',
//   email: '',
//   password: '',
//   confirmPassword: '',
//   phone: '',

//   dateOfBirth: '',
//   sin: '',
//   address: '',
//   city: '',
//   province: '',
//   postalCode: '',
//   country: 'Canada',

//   taxProfile: {
//     employment: true,
//     gigWork: false,
//     selfEmployment: false,
//     incorporatedBusiness: false,
//     unemployed: false,
//   },

//   employmentStatus: '',
//   taxFilingStatus: '',
//   maritalStatus: '',
//   numberOfDependents: '0',

//   businessName: '',
//   businessType: '',
//   businessNumber: '',
//   yearEstablished: '',
//   numberOfEmployees: '',

//   platforms: [],
//   averageWeeklyKm: '',

//   employerName: '',
//   employerBusinessNumber: '',
//   employeeId: '',

//   contractType: '',
//   quarterlyFiling: false,

//   hasInvestments: false,
//   hasRentalIncome: false,
//   hasForeignIncome: false,
//   hasCrypto: false,

//   hasRRSP: false,
//   hasFHSA: false,
//   hasTFSA: false,
//   hasTuition: false,
//   hasMedicalExpenses: false,
//   hasCharitableDonations: false,
//   hasChildCareExpenses: false,
//   hasMovingExpenses: false,
//   hasUnionDues: false,
//   hasToolExpenses: false,
//   hasHomeOffice: false,
//   hasVehicleExpenses: false,

//   spouseName: '',
//   spouseSin: '',
//   spouseDob: '',
//   spouseIncome: '',
//   spouseEmploymentStatus: '',
//   spouseJobTitle: '',
//   spouseEmployerName: '',
//   spouseFinancialSituation: '',
//   shareWithSpouse: false,

//   spousePlatforms: [],
//   spouseAverageWeeklyKm: '',
//   spouseContractType: '',
//   spouseQuarterlyFiling: false,
//   spouseBusinessName: '',
//   spouseBusinessType: '',
//   spouseBusinessNumber: '',
//   spouseYearEstablished: '',
//   spouseNumberOfEmployees: '',

//   spouseTaxProfile: {
//     employment: false,
//     gigWork: false,
//     selfEmployment: false,
//     incorporatedBusiness: false,
//     unemployed: false,
//   },

//   agreeToTerms: false,
//   agreeToPrivacy: false,
//   confirmAccuracy: false,

//   documentPreferences: {
//     selectedReceiptCategories: [],
//   },

//   vehicleInfo: {
//     hasVehiclePurchase: false,
//     ownerPerson: '',
//     ownershipType: '',
//     mainUse: '',
//     purchaseDate: '',
//     purchasePrice: '',
//     gstHstPaid: '',
//     vin: '',
//     billOfSale: null,
//   },
// });

//   const hasEmployment = !!formData.taxProfile.employment;
// const hasGigWork = !!formData.taxProfile.gigWork;
// const hasSelfEmployment = !!formData.taxProfile.selfEmployment;
// const hasBusiness = !!formData.taxProfile.incorporatedBusiness;

// const spouseHasEmployment = !!formData.spouseTaxProfile.employment;
// const spouseHasGigWork = !!formData.spouseTaxProfile.gigWork;
// const spouseHasSelfEmployment = !!formData.spouseTaxProfile.selfEmployment;
// const spouseHasBusiness = !!formData.spouseTaxProfile.incorporatedBusiness;

// const hasSpouseVehicleEligibleProfile =
//   (formData.maritalStatus === 'Married' || formData.maritalStatus === 'Common-Law') &&
//   (
//     formData.spouseTaxProfile.gigWork ||
//     formData.spouseTaxProfile.selfEmployment ||
//     formData.spouseTaxProfile.incorporatedBusiness
//   );

// const showVehicleStep =
//   formData.taxProfile.gigWork ||
//   formData.taxProfile.selfEmployment ||
//   formData.taxProfile.incorporatedBusiness ||
//   hasSpouseVehicleEligibleProfile;

// const getVehicleOwnerOptions = (data) => {
//   const options = [];

//   const userEligible =
//     data.taxProfile.gigWork ||
//     data.taxProfile.selfEmployment ||
//     data.taxProfile.incorporatedBusiness;

//   const spouseEligible =
//     (data.maritalStatus === 'Married' || data.maritalStatus === 'Common-Law') &&
//     (
//       data.spouseTaxProfile.gigWork ||
//       data.spouseTaxProfile.selfEmployment ||
//       data.spouseTaxProfile.incorporatedBusiness
//     );

//   if (userEligible) options.push('Primary Taxpayer');
//   if (spouseEligible) options.push('Spouse');

//   return options;
// };

// const getVehicleUseOptionsByOwner = (data) => {
//   if (data.vehicleInfo.ownerPerson === 'Spouse') {
//     return getVehicleUseOptions(data.spouseTaxProfile);
//   }

//   return getVehicleUseOptions(data.taxProfile);
// };

// const vehicleOwnerOptions = useMemo(
//   () => getVehicleOwnerOptions(formData),
//   [formData]
// );

// const vehicleUseOptions = useMemo(
//   () => getVehicleUseOptionsByOwner(formData),
//   [formData]
// );

// const getNextStep = (step) => {
//   if (step === 4 && !showVehicleStep) return 6;
//   return Math.min(step + 1, steps.length);
// };

// const getPreviousStep = (step) => {
//   if (step === 6 && !showVehicleStep) return 4;
//   return Math.max(step - 1, 1);
// };

// const updateField = (field, value) => {
//   setFormData((prev) => ({ ...prev, [field]: value }));
// };

// const updateVehicleField = (field, value) => {
//   setFormData((prev) => ({
//     ...prev,
//     vehicleInfo: {
//       ...prev.vehicleInfo,
//       [field]: value,
//     },
//   }));
// };

// const clearVehicleFields = () => {
//   setFormData((prev) => ({
//     ...prev,
//     vehicleInfo: {
//       hasVehiclePurchase: false,
//       ownerPerson: '',
//       ownershipType: '',
//       mainUse: '',
//       purchaseDate: '',
//       purchasePrice: '',
//       gstHstPaid: '',
//       vin: '',
//       billOfSale: null,
//     },
//   }));
// };

// const toggleSpouseArrayItem = (field, value) => {
//   setFormData((prev) => {
//     const current = prev[field] || [];
//     const exists = current.includes(value);

//     return {
//       ...prev,
//       [field]: exists
//         ? current.filter((item) => item !== value)
//         : [...current, value],
//     };
//   });
// };

// const updateTaxProfile = (key) => {
//   setFormData((prev) => {
//     const currentlySelected = !!prev.taxProfile[key];

//     if (key === 'unemployed') {
//       const nextUnemployed = !currentlySelected;

//       return {
//         ...prev,
//         taxProfile: {
//           employment: false,
//           gigWork: false,
//           selfEmployment: false,
//           incorporatedBusiness: false,
//           unemployed: nextUnemployed,
//         },
//         employmentStatus: nextUnemployed ? 'Unemployed' : prev.employmentStatus,
//       };
//     }

//     return {
//       ...prev,
//       taxProfile: {
//         ...prev.taxProfile,
//         unemployed: false,
//         [key]: !currentlySelected,
//       },
//       employmentStatus:
//         prev.taxProfile.unemployed && prev.employmentStatus === 'Unemployed'
//           ? ''
//           : prev.employmentStatus,
//     };
//   });
// };

// const updateSpouseTaxProfile = (key) => {
//   setFormData((prev) => {
//     const currentlySelected = !!prev.spouseTaxProfile[key];

//     if (key === 'unemployed') {
//       const nextUnemployed = !currentlySelected;

//       return {
//         ...prev,
//         spouseTaxProfile: {
//           employment: false,
//           gigWork: false,
//           selfEmployment: false,
//           incorporatedBusiness: false,
//           unemployed: nextUnemployed,
//         },
//         spouseEmploymentStatus: nextUnemployed ? 'Unemployed' : prev.spouseEmploymentStatus,
//       };
//     }

//     return {
//       ...prev,
//       spouseTaxProfile: {
//         ...prev.spouseTaxProfile,
//         unemployed: false,
//         [key]: !currentlySelected,
//       },
//       spouseEmploymentStatus:
//         prev.spouseTaxProfile.unemployed && prev.spouseEmploymentStatus === 'Unemployed'
//           ? ''
//           : prev.spouseEmploymentStatus,
//     };
//   });
// };
//   const toggleArrayItem = (field, value) => {
//     setFormData((prev) => {
//       const exists = prev[field].includes(value);
//       return {
//         ...prev,
//         [field]: exists
//           ? prev[field].filter((item) => item !== value)
//           : [...prev[field], value],
//       };
//     });
//   };

//   const toggleReceiptCategory = (value) => {
//     setFormData((prev) => {
//       const current = prev.documentPreferences.selectedReceiptCategories;
//       const exists = current.includes(value);

//       return {
//         ...prev,
//         documentPreferences: {
//           ...prev.documentPreferences,
//           selectedReceiptCategories: exists
//             ? current.filter((item) => item !== value)
//             : [...current, value],
//         },
//       };
//     });
//   };

//   const openSelector = ({ title, options, value, fieldKey, onSelect }) => {
//     setSelectorTitle(title);
//     setSelectorOptions(options);
//     setSelectorValue(value);
//     setSelectorFieldKey(fieldKey || '');
//     setSelectorOnChange(() => onSelect);
//     setSelectorVisible(true);
//   };

//   const setFieldRef = (field) => (event) => {
//     const y = event?.nativeEvent?.layout?.y ?? 0;
//     fieldRefs.current[field] = y;
//   };

//   const scrollToField = (field) => {
//     const y = fieldRefs.current[field];
//     if (scrollRef.current && typeof y === 'number') {
//       scrollRef.current.scrollTo({ y: Math.max(y - 24, 0), animated: true });
//     }
//   };

//   const clearFieldError = (field) => {
//     setFieldErrors((prev) => {
//       if (!prev[field]) return prev;
//       const next = { ...prev };
//       delete next[field];
//       return next;
//     });
//   };

//   const formatDate = (date) => {
//     if (!date) return '';
//     const year = date.getFullYear();
//     const month = `${date.getMonth() + 1}`.padStart(2, '0');
//     const day = `${date.getDate()}`.padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   const calculateAge = (dateString) => {
//     if (!dateString) return 0;

//     const today = new Date();
//     const dob = new Date(dateString);

//     let age = today.getFullYear() - dob.getFullYear();
//     const monthDiff = today.getMonth() - dob.getMonth();

//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
//       age -= 1;
//     }

//     return age;
//   };

//   const formatPhoneNumber = (value) => {
//     const digits = value.replace(/\D/g, '').slice(0, 10);

//     if (digits.length === 0) return '';
//     if (digits.length < 4) return `(${digits}`;
//     if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
//     return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
//   };

//   const formatPostalCode = (value) => {
//     const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
//     if (cleaned.length <= 3) return cleaned;
//     return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
//   };

//   const isValidEmail = (email) => {
//     const trimmed = String(email || '').trim().toLowerCase();
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

//     if (!emailRegex.test(trimmed)) return false;

//     const blockedDomains = ['gm.com', 'gamil.com', 'gmail.co', 'gmail.con', 'yaho.com'];
//     const domain = trimmed.split('@')[1] || '';

//     if (blockedDomains.includes(domain)) return false;

//     return true;
//   };

//   const syncFamilyAndFilingStatus = (field, value) => {
//     if (field === 'taxFilingStatus') {
//       updateField('taxFilingStatus', value);

//       if (value === 'Single') {
//         updateField('maritalStatus', 'Single');
//       }

//       if (value === 'Married' || value === 'Common-Law') {
//         updateField('maritalStatus', value);
//       }
//     }

//     if (field === 'maritalStatus') {
//       updateField('maritalStatus', value);

//       if (value === 'Single') {
//         updateField('taxFilingStatus', 'Single');
//       }

//       if (value === 'Married' || value === 'Common-Law') {
//         updateField('taxFilingStatus', value);
//       }
//     }
//   };

//   // 3) REPLACE YOUR ENTIRE validateStep WITH THIS
// const validateStep = () => {
//   setFieldErrors({});

//   if (currentStep === 1) {
//     const errors: Record<string, string> = {};

//     if (!formData.firstName.trim()) errors.firstName = 'First name is required.';
//     if (!formData.lastName.trim()) errors.lastName = 'Last name is required.';
//     if (!formData.email.trim()) errors.email = 'Email is required.';
//     if (!formData.phone.trim()) errors.phone = 'Phone number is required.';
//     if (!formData.password) errors.password = 'Password is required.';
//     if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm password.';

//     if (Object.keys(errors).length > 0) {
//       setFieldErrors(errors);
//       const firstField = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword'].find(
//         (key) => errors[key]
//       );
//       if (firstField) requestAnimationFrame(() => scrollToField(firstField));
//       return false;
//     }

//     if (!isValidEmail(formData.email)) {
//       setFieldErrors({ email: 'Please enter a valid email address.' });
//       requestAnimationFrame(() => scrollToField('email'));
//       return false;
//     }

//     const phoneDigits = formData.phone.replace(/\D/g, '');
//     if (phoneDigits.length !== 10) {
//       setFieldErrors({ phone: 'Please enter a valid 10-digit phone number.' });
//       requestAnimationFrame(() => scrollToField('phone'));
//       return false;
//     }

//     if (formData.password.length < 8) {
//       setFieldErrors({ password: 'Password must be at least 8 characters.' });
//       requestAnimationFrame(() => scrollToField('password'));
//       return false;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setFieldErrors({ confirmPassword: 'Passwords do not match.' });
//       requestAnimationFrame(() => scrollToField('confirmPassword'));
//       return false;
//     }

//     return true;
//   }

//   if (currentStep === 2) {
//     const errors: Record<string, string> = {};

//     if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required.';
//     if (!formData.address.trim()) errors.address = 'Street address is required.';
//     if (!formData.province) errors.province = 'Province is required.';
//     if (!formData.city.trim()) errors.city = 'City is required.';
//     if (!formData.postalCode.trim()) errors.postalCode = 'Postal code is required.';

//     if (Object.keys(errors).length > 0) {
//       setFieldErrors(errors);
//       const firstField = ['dateOfBirth', 'address', 'province', 'city', 'postalCode'].find(
//         (key) => errors[key]
//       );
//       if (firstField) requestAnimationFrame(() => scrollToField(firstField));
//       return false;
//     }

//     const age = calculateAge(formData.dateOfBirth);
//     if (age < 18) {
//       Alert.alert('Not eligible', 'You should reach minimum age to create account.');
//       return false;
//     }

//     if (formData.sin?.trim()) {
//       const sinDigits = formData.sin.replace(/\D/g, '');
//       if (sinDigits.length !== 9) {
//         setFieldErrors({ sin: 'SIN must be 9 digits.' });
//         requestAnimationFrame(() => scrollToField('sin'));
//         return false;
//       }
//     }

//     return true;
//   }

//   if (currentStep === 3) {
//     const selected = Object.values(formData.taxProfile).some(Boolean);
//     if (!selected) {
//       Alert.alert('Tax profile', 'Please select at least one income type.');
//       return false;
//     }

//     const errors: Record<string, string> = {};
//     if (!formData.employmentStatus) errors.employmentStatus = 'Employment status is required.';
//     if (!formData.taxFilingStatus) errors.taxFilingStatus = 'Tax filing status is required.';
//     if (!formData.maritalStatus) errors.maritalStatus = 'Family status is required.';

//     if (Object.keys(errors).length > 0) {
//       setFieldErrors(errors);
//       const firstField = ['employmentStatus', 'taxFilingStatus', 'maritalStatus'].find(
//         (key) => errors[key]
//       );
//       if (firstField) requestAnimationFrame(() => scrollToField(firstField));
//       return false;
//     }

//     const marriedLike = ['Married', 'Common-Law'];
//     const isTaxMarriedLike = marriedLike.includes(formData.taxFilingStatus);
//     const isFamilyMarriedLike = marriedLike.includes(formData.maritalStatus);

//     if (
//       (formData.taxFilingStatus === 'Single' && formData.maritalStatus !== 'Single') ||
//       (formData.maritalStatus === 'Single' && formData.taxFilingStatus !== 'Single') ||
//       (isTaxMarriedLike && !isFamilyMarriedLike) ||
//       (isFamilyMarriedLike && !isTaxMarriedLike)
//     ) {
//       Alert.alert('Status mismatch', 'Tax filing status and family status must match.');
//       return false;
//     }

//     return true;
//   }

//   if (currentStep === 5 && showVehicleStep) {
//     const { vehicleInfo } = formData;

//     if (vehicleInfo.hasVehiclePurchase) {
//       const errors: Record<string, string> = {};

//       if (!vehicleInfo.ownerPerson) errors.vehicleOwnerPerson = 'Vehicle owner is required.';
//       if (!vehicleInfo.ownershipType) errors.vehicleOwnershipType = 'Ownership type is required.';
//       if (!vehicleInfo.mainUse) errors.vehicleMainUse = 'Main use is required.';
//       if (!vehicleInfo.purchaseDate) errors.vehiclePurchaseDate = 'Purchase date is required.';
//       if (!vehicleInfo.purchasePrice?.trim()) errors.vehiclePurchasePrice = 'Purchase price is required.';
//       if (!vehicleInfo.gstHstPaid?.trim()) errors.vehicleGstHstPaid = 'GST / HST paid is required.';

//       if (Object.keys(errors).length > 0) {
//         setFieldErrors(errors);
//         const firstField = [
//           'vehicleOwnerPerson',
//           'vehicleOwnershipType',
//           'vehicleMainUse',
//           'vehiclePurchaseDate',
//           'vehiclePurchasePrice',
//           'vehicleGstHstPaid',
//         ].find((key) => errors[key]);

//         if (firstField) requestAnimationFrame(() => scrollToField(firstField));
//         return false;
//       }
//     }

//     return true;
//   }

//   if (currentStep === 7) {
//     const needsSpouse =
//       formData.maritalStatus === 'Married' || formData.maritalStatus === 'Common-Law';

//     if (!needsSpouse) return true;

//     const errors: Record<string, string> = {};

//     if (!formData.spouseName.trim()) {
//       errors.spouseName = 'Spouse name is required.';
//     }

//     if (!formData.spouseDob) {
//       errors.spouseDob = 'Spouse date of birth is required.';
//     }

//     if (!Object.values(formData.spouseTaxProfile).some(Boolean)) {
//       errors.spouseTaxProfile = 'Please select at least one spouse tax profile.';
//     }

//     if (!formData.spouseEmploymentStatus) {
//       errors.spouseEmploymentStatus = 'Spouse employment status is required.';
//     }

//     if (Object.keys(errors).length > 0) {
//       setFieldErrors(errors);
//       const firstField = ['spouseName', 'spouseDob', 'spouseTaxProfile', 'spouseEmploymentStatus'].find(
//         (key) => errors[key]
//       );
//       if (firstField) requestAnimationFrame(() => scrollToField(firstField));
//       return false;
//     }

//     return true;
//   }

//   return true;
// };

//   const renderStepHeader = (title, subtitle) => (
//     <View style={styles.sectionHeader}>
//       <Text style={styles.sectionTitle}>{title}</Text>
//       <Text style={styles.sectionSubtitle}>{subtitle}</Text>
//     </View>
//   );

//   const renderInput = ({
//     label,
//     value,
//     onChangeText,
//     placeholder,
//     keyboardType = 'default',
//     secureTextEntry = false,
//     autoCapitalize = 'sentences',
//     multiline = false,
//     editable = true,
//     error,
//     fieldKey,
//   }) => (
//     <View style={styles.field} onLayout={fieldKey ? setFieldRef(fieldKey) : undefined}>
//       <Text style={styles.label}>{label}</Text>
//       <TextInput
//         style={[
//           styles.input,
//           multiline && styles.textArea,
//           !editable && styles.inputDisabled,
//           error && styles.inputError,
//         ]}
//         value={value}
//         onChangeText={(text) => {
//           if (fieldKey) clearFieldError(fieldKey);
//           onChangeText(text);
//         }}
//         placeholder={placeholder}
//         placeholderTextColor={colors.gray[400]}
//         keyboardType={keyboardType}
//         secureTextEntry={secureTextEntry}
//         autoCapitalize={autoCapitalize}
//         multiline={multiline}
//         editable={editable}
//       />
//       {!!error && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );

//   const renderPasswordInput = ({
//     label,
//     value,
//     onChangeText,
//     placeholder,
//     secureTextEntry,
//     onToggleVisibility,
//     error,
//     fieldKey,
//   }) => (
//     <View style={styles.field} onLayout={fieldKey ? setFieldRef(fieldKey) : undefined}>
//       <Text style={styles.label}>{label}</Text>
//       <View style={[styles.passwordWrap, error && styles.inputError]}>
//         <TextInput
//           style={styles.passwordInput}
//           value={value}
//           onChangeText={(text) => {
//             if (fieldKey) clearFieldError(fieldKey);
//             onChangeText(text);
//           }}
//           placeholder={placeholder}
//           placeholderTextColor={colors.gray[400]}
//           secureTextEntry={secureTextEntry}
//           autoCapitalize="none"
//         />
//         <TouchableOpacity style={styles.eyeButton} onPress={onToggleVisibility}>
//           <Icon
//             name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'}
//             size={20}
//             color={colors.gray[500]}
//           />
//         </TouchableOpacity>
//       </View>
//       {!!error && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );

//   const renderPicker = ({
//     label,
//     value,
//     onValueChange,
//     options,
//     placeholder = 'Select option',
//     error,
//     fieldKey,
//   }) => (
//     <View style={styles.field} onLayout={fieldKey ? setFieldRef(fieldKey) : undefined}>
//       <Text style={styles.label}>{label}</Text>

//       <TouchableOpacity
//         activeOpacity={0.85}
//         style={[styles.selectField, error && styles.inputError]}
//         onPress={() =>
//           openSelector({
//             title: label,
//             options,
//             value,
//             fieldKey,
//             onSelect: (selected) => {
//               if (fieldKey) clearFieldError(fieldKey);
//               onValueChange(selected);
//               setSelectorVisible(false);
//             },
//           })
//         }
//       >
//         <Text style={[styles.selectFieldText, !value && styles.placeholderText]} numberOfLines={1}>
//           {value || placeholder}
//         </Text>
//         <Icon name="chevron-down" size={20} color={colors.gray[500]} />
//       </TouchableOpacity>

//       {!!error && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );

//   const renderDateField = ({ label, value, onPress, error, fieldKey }) => (
//     <View style={styles.field} onLayout={fieldKey ? setFieldRef(fieldKey) : undefined}>
//       <Text style={styles.label}>{label}</Text>
//       <TouchableOpacity
//         style={[styles.dateInput, error && styles.inputError]}
//         onPress={() => {
//           if (fieldKey) clearFieldError(fieldKey);
//           onPress();
//         }}
//         activeOpacity={0.85}
//       >
//         <Text style={[styles.dateText, !value && styles.placeholderText]}>
//           {value || 'Select date'}
//         </Text>
//         <Icon name="calendar-month-outline" size={20} color={colors.primaryScale[500]} />
//       </TouchableOpacity>
//       {!!error && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );

//   const renderTaxCard = (item, selected, onPress, disabled = false) => (
//   <TouchableOpacity
//     key={item.key}
//     onPress={disabled ? undefined : onPress}
//     disabled={disabled}
//     style={[
//       styles.taxCardSmall,
//       selected && styles.taxCardSmallActive,
//       disabled && { opacity: 0.45 },
//     ]}
//     activeOpacity={0.9}
//   >
//     <View style={styles.taxCardRow}>
//       <Icon
//         name={item.icon}
//         size={18}
//         color={selected ? colors.primaryScale[600] : colors.textSecondary}
//       />
//       <Text
//         style={[styles.taxCardTitle, selected && styles.taxCardTitleActive]}
//         numberOfLines={1}
//       >
//         {item.label}
//       </Text>
//     </View>
//     <Text style={styles.taxCardDescription}>{item.description}</Text>
//   </TouchableOpacity>
// );

//   React.useEffect(() => {
//   if (!showVehicleStep) {
//     setFormData((prev) => ({
//       ...prev,
//       vehicleInfo: {
//         hasVehiclePurchase: false,
//         ownerPerson: '',
//         ownershipType: '',
//         mainUse: '',
//         purchaseDate: '',
//         purchasePrice: '',
//         gstHstPaid: '',
//         vin: '',
//         billOfSale: null,
//       },
//     }));

//     if (currentStep === 5) {
//       setCurrentStep(4);
//     }
//   }
// }, [showVehicleStep, currentStep]);

//   const renderNavButton = ({ label, onPress, variant = 'primary', disabled = false }) => {
//     const isOutline = variant === 'outline';

//     return (
//       <TouchableOpacity
//         onPress={onPress}
//         disabled={disabled}
//         activeOpacity={0.85}
//         style={[
//           styles.localNavButton,
//           isOutline ? styles.localNavButtonOutline : styles.localNavButtonPrimary,
//           disabled && styles.localNavButtonDisabled,
//         ]}
//       >
//         <Text
//           style={[
//             styles.localNavButtonText,
//             isOutline ? styles.localNavButtonTextOutline : styles.localNavButtonTextPrimary,
//           ]}
//         >
//           {label}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView
//         ref={scrollRef}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//       >
//         <View style={styles.heroCard}>
//           <Text style={styles.title}>Create Your Account</Text>
//           <Text style={styles.subtitle}>
//             Set up your account, tax profile, and documents in a mobile-friendly flow.
//           </Text>
//         </View>

//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.progressScrollContent}
//           style={styles.progressScroll}
//         >
//           {steps.map((step, index) => (
//             <React.Fragment key={step.number}>
//               <View style={styles.progressItem}>
//                 <View
//                   style={[
//                     styles.progressDot,
//                     currentStep >= step.number && styles.progressDotActive,
//                   ]}
//                 >
//                   <Icon
//                     name={currentStep > step.number ? 'check' : step.icon}
//                     size={16}
//                     color={currentStep >= step.number ? colors.white : colors.textSecondary}
//                   />
//                 </View>
//                 <Text
//                   style={[
//                     styles.progressLabel,
//                     currentStep >= step.number && styles.progressLabelActive,
//                   ]}
//                 >
//                   {step.title}
//                 </Text>
//               </View>
//               {index < steps.length - 1 && (
//                 <View
//                   style={[
//                     styles.progressLine,
//                     currentStep > step.number && styles.progressLineActive,
//                   ]}
//                 />
//               )}
//             </React.Fragment>
//           ))}
//           <View style={styles.localNavActions}>
//   {currentStep > 1 &&
//     renderNavButton({
//       label: 'Back',
//       onPress: handlePrevious,
//       variant: 'outline',
//       disabled: loading,
//     })}

//   {currentStep < 8
//     ? renderNavButton({
//         label: 'Next',
//         onPress: handleNext,
//         variant: 'primary',
//         disabled: loading,
//       })
//     : renderNavButton({
//         label: loading ? 'Creating...' : 'Create Account',
//         onPress: handleSubmit,
//         variant: 'primary',
//         disabled: loading,
//       })}
// </View>
//         </ScrollView>

//         {currentStep === 1 && (
//           <Card style={styles.card}>
//             {renderStepHeader('Account Information', 'Start with your basic account details.')}

//             <View style={styles.row}>
//               <View style={styles.half}>
//                 {renderInput({
//                   label: 'First Name',
//                   value: formData.firstName,
//                   onChangeText: (text) => updateField('firstName', text),
//                   placeholder: 'John',
//                   error: fieldErrors.firstName,
//                   fieldKey: 'firstName',
//                 })}
//               </View>
//               <View style={styles.half}>
//                 {renderInput({
//                   label: 'Last Name',
//                   value: formData.lastName,
//                   onChangeText: (text) => updateField('lastName', text),
//                   placeholder: 'Doe',
//                   error: fieldErrors.lastName,
//                   fieldKey: 'lastName',
//                 })}
//               </View>
//             </View>

//             {renderInput({
//               label: 'Email Address',
//               value: formData.email,
//               onChangeText: (text) => updateField('email', text),
//               placeholder: 'john@example.com',
//               keyboardType: 'email-address',
//               autoCapitalize: 'none',
//               error: fieldErrors.email,
//               fieldKey: 'email',
//             })}

//             {renderInput({
//               label: 'Phone Number',
//               value: formData.phone,
//               onChangeText: (text) => updateField('phone', formatPhoneNumber(text)),
//               placeholder: '(416) 555-0123',
//               keyboardType: 'phone-pad',
//               error: fieldErrors.phone,
//               fieldKey: 'phone',
//             })}

//             <View style={styles.row}>
//               <View style={styles.half}>
//                 {renderPasswordInput({
//                   label: 'Password',
//                   value: formData.password,
//                   onChangeText: (text) => updateField('password', text),
//                   placeholder: 'Minimum 8 characters',
//                   secureTextEntry: !showPassword,
//                   onToggleVisibility: () => setShowPassword((prev) => !prev),
//                   error: fieldErrors.password,
//                   fieldKey: 'password',
//                 })}
//               </View>
//               <View style={styles.half}>
//                 {renderPasswordInput({
//                   label: 'Confirm Password',
//                   value: formData.confirmPassword,
//                   onChangeText: (text) => updateField('confirmPassword', text),
//                   placeholder: 'Re-enter password',
//                   secureTextEntry: !showConfirmPassword,
//                   onToggleVisibility: () => setShowConfirmPassword((prev) => !prev),
//                   error: fieldErrors.confirmPassword,
//                   fieldKey: 'confirmPassword',
//                 })}
//               </View>
//             </View>

//             <View style={styles.infoBanner}>
//               <Icon name="shield-check-outline" size={18} color={colors.primaryScale[600]} />
//               <Text style={styles.infoBannerText}>
//                 Your information is protected with bank-level encryption.
//               </Text>
//             </View>
//           </Card>
//         )}

//         {currentStep === 2 && (
//           <Card style={styles.card}>
//             {renderStepHeader('Personal Information', 'Add personal and address details.')}

//             {renderDateField({
//               label: 'Date of Birth',
//               value: formData.dateOfBirth,
//               onPress: () => setShowDobPicker(true),
//               error: fieldErrors.dateOfBirth,
//               fieldKey: 'dateOfBirth',
//             })}

//             {showDobPicker && (
//               <DateTimePicker
//                 value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date(2000, 0, 1)}
//                 mode="date"
//                 display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                 maximumDate={new Date()}
//                 onChange={(_, selectedDate) => {
//                   if (Platform.OS === 'android') setShowDobPicker(false);
//                   if (selectedDate) {
//                     clearFieldError('dateOfBirth');
//                     updateField('dateOfBirth', formatDate(selectedDate));
//                   }
//                 }}
//               />
//             )}

//             {Platform.OS === 'ios' && showDobPicker && (
//               <TouchableOpacity style={styles.doneButton} onPress={() => setShowDobPicker(false)}>
//                 <Text style={styles.doneButtonText}>Done</Text>
//               </TouchableOpacity>
//             )}

//             {renderInput({
//               label: 'SIN Number (Optional)',
//               value: formData.sin,
//               onChangeText: (text) => updateField('sin', text.replace(/\D/g, '').slice(0, 9)),
//               placeholder: '123456789',
//               keyboardType: 'number-pad',
//               error: fieldErrors.sin,
//               fieldKey: 'sin',
//             })}

//             <Text style={styles.helperText}>
//               Optional â€” you can provide this later if needed.
//             </Text>

//             <View style={styles.field} onLayout={setFieldRef('address')}>
//               <Text style={styles.label}>Street Address</Text>
//               <GooglePlacesAutocomplete
//                 placeholder="Start typing your address"
//                 fetchDetails
//                 onPress={(data, details = null) => {
//                   clearFieldError('address');
//                   clearFieldError('province');
//                   clearFieldError('city');
//                   clearFieldError('postalCode');

//                   const addressText = details?.formatted_address || data?.description || '';
//                   let city = '';
//                   let province = '';
//                   let postalCode = '';

//                   const components = details?.address_components || [];

//                   components.forEach((component) => {
//                     if (component.types.includes('locality')) city = component.long_name;
//                     if (component.types.includes('administrative_area_level_1')) province = component.long_name;
//                     if (component.types.includes('postal_code')) postalCode = component.long_name;
//                   });

//                   setCustomCity(false);

//                   setFormData((prev) => ({
//                     ...prev,
//                     address: addressText,
//                     city: city || prev.city,
//                     province: province || prev.province,
//                     postalCode: postalCode ? formatPostalCode(postalCode) : prev.postalCode,
//                     country: 'Canada',
//                   }));

//                   requestAnimationFrame(() => scrollToField('province'));
//                 }}
//                 textInputProps={{
//                   value: formData.address,
//                   onChangeText: (text) => {
//                     clearFieldError('address');
//                     updateField('address', text);
//                   },
//                   placeholderTextColor: colors.gray[400],
//                 }}
//                 query={{
//                   key: GOOGLE_PLACES_API_KEY,
//                   language: 'en',
//                   components: 'country:ca',
//                 }}
//                 enablePoweredByContainer={false}
//                 keyboardShouldPersistTaps="handled"
//                 listViewDisplayed="auto"
//                 styles={{
//                   textInputContainer: styles.googleInputContainer,
//                   textInput: [
//                     styles.googleInput,
//                     fieldErrors.address ? styles.inputError : null,
//                   ],
//                   listView: styles.googleListView,
//                   row: styles.googleRow,
//                   description: styles.googleDescription,
//                 }}
//               />
//               {!!fieldErrors.address && <Text style={styles.errorText}>{fieldErrors.address}</Text>}
//             </View>

//             {renderPicker({
//               label: 'Province',
//               value: formData.province,
//               onValueChange: (value) => {
//                 updateField('province', value);
//                 updateField('city', '');
//                 setCustomCity(false);
//               },
//               options: provinces,
//               placeholder: 'Select province',
//               error: fieldErrors.province,
//               fieldKey: 'province',
//             })}

//             {renderPicker({
//               label: 'City',
//               value: customCity ? 'Other' : formData.city,
//               onValueChange: (value) => {
//                 if (value === 'Other') {
//                   setCustomCity(true);
//                   updateField('city', '');
//                   requestAnimationFrame(() => scrollToField('otherCity'));
//                 } else {
//                   setCustomCity(false);
//                   updateField('city', value);
//                   requestAnimationFrame(() => scrollToField('postalCode'));
//                 }
//               },
//               options: formData.province
//                 ? provinceCities[formData.province] || ['Other']
//                 : ['Other'],
//               placeholder: formData.province
//                 ? 'Select city'
//                 : 'Select province first',
//               error: fieldErrors.city,
//               fieldKey: 'city',
//             })}

//             {customCity &&
//               renderInput({
//                 label: 'Other City',
//                 value: formData.city,
//                 onChangeText: (text) => updateField('city', text),
//                 placeholder: 'Enter city',
//                 error: fieldErrors.city,
//                 fieldKey: 'otherCity',
//               })}

//             <View style={styles.row}>
//               <View style={styles.half}>
//                 {renderInput({
//                   label: 'Postal Code',
//                   value: formData.postalCode,
//                   onChangeText: (text) => updateField('postalCode', formatPostalCode(text)),
//                   placeholder: 'M5V 2H1',
//                   autoCapitalize: 'characters',
//                   error: fieldErrors.postalCode,
//                   fieldKey: 'postalCode',
//                 })}
//               </View>
//               <View style={styles.half}>
//                 {renderInput({
//                   label: 'Country',
//                   value: formData.country,
//                   editable: false,
//                   placeholder: 'Canada',
//                   editable: false,
//                 })}
//               </View>
//             </View>
//           </Card>
//         )}

//         {currentStep === 3 && (
//           <Card style={styles.card}>
//             {renderStepHeader('Tax Profile', 'Choose the options that apply to you.')}

//             <View style={styles.taxCardGrid}>
//   {profileOptions.map((item) =>
//     renderTaxCard(
//       item,
//       !!formData.taxProfile[item.key],
//       () => updateTaxProfile(item.key),
//       formData.taxProfile.unemployed && item.key !== 'unemployed'
//     )
//   )}
// </View>

//             {renderPicker({
//   label: 'Employment Status',
//   value: formData.employmentStatus,
//   onValueChange: (value) => {
//     updateField('employmentStatus', value);

//     if (value === 'Unemployed') {
//       setFormData((prev) => ({
//         ...prev,
//         taxProfile: {
//           employment: false,
//           gigWork: false,
//           selfEmployment: false,
//           incorporatedBusiness: false,
//           unemployed: true,
//         },
//       }));
//     } else if (formData.taxProfile.unemployed) {
//       setFormData((prev) => ({
//         ...prev,
//         taxProfile: {
//           ...prev.taxProfile,
//           unemployed: false,
//         },
//       }));
//     }
//   },
//   options: employmentStatuses,
//   placeholder: 'Employment status',
//   error: fieldErrors.employmentStatus,
//   fieldKey: 'employmentStatus',
// })}

//             {renderPicker({
//               label: 'Tax Filing Status',
//               value: formData.taxFilingStatus,
//               onValueChange: (value) => {
//                 clearFieldError('taxFilingStatus');
//                 clearFieldError('maritalStatus');
//                 syncFamilyAndFilingStatus('taxFilingStatus', value);
//               },
//               options: taxFilingStatuses,
//               placeholder: 'Tax filing status',
//               error: fieldErrors.taxFilingStatus,
//               fieldKey: 'taxFilingStatus',
//             })}

//             <View style={styles.field} onLayout={setFieldRef('maritalStatus')}>
//               <Text style={styles.label}>Family Status</Text>
//               <View style={styles.chipWrap}>
//                 {taxFilingStatuses.map((status) => (
//                   <TouchableOpacity
//                     key={status}
//                     style={[
//                       styles.choiceChip,
//                       formData.maritalStatus === status && styles.choiceChipActive,
//                       fieldErrors.maritalStatus && styles.choiceChipError,
//                     ]}
//                     onPress={() => {
//                       clearFieldError('maritalStatus');
//                       clearFieldError('taxFilingStatus');
//                       syncFamilyAndFilingStatus('maritalStatus', status);
//                     }}
//                   >
//                     <Text
//                       style={[
//                         styles.choiceChipText,
//                         formData.maritalStatus === status && styles.choiceChipTextActive,
//                       ]}
//                     >
//                       {status}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//               {!!fieldErrors.maritalStatus && (
//                 <Text style={styles.errorText}>{fieldErrors.maritalStatus}</Text>
//               )}
//             </View>

//             {(formData.maritalStatus === 'Married' ||
//               formData.maritalStatus === 'Common-Law') && (
//               <View style={styles.inlineSpouseHint}>
//                 <Icon name="information-outline" size={18} color={colors.primaryScale[600]} />
//                 <Text style={styles.inlineSpouseHintText}>
//                   Spouse details will be requested in the Family section.
//                 </Text>
//               </View>
//             )}
//           </Card>
//         )}

//         {currentStep === 4 && (
//           <Card style={styles.card}>
//             {renderStepHeader('Income Information', 'Add the details that match your income sources.')}

//             {hasEmployment && (
//               <View style={styles.sectionBlock}>
//                 <Text style={styles.blockTitle}>Employment Income</Text>
//                 {renderInput({
//                   label: 'Employer Name',
//                   value: formData.employerName,
//                   onChangeText: (text) => updateField('employerName', text),
//                   placeholder: 'ABC Company',
//                 })}
//                 {renderInput({
//                   label: 'Employer Business Number',
//                   value: formData.employerBusinessNumber,
//                   onChangeText: (text) => updateField('employerBusinessNumber', text),
//                   placeholder: 'Business number',
//                 })}
//                 {renderInput({
//                   label: 'Employee ID',
//                   value: formData.employeeId,
//                   onChangeText: (text) => updateField('employeeId', text),
//                   placeholder: 'Employee ID',
//                 })}
//               </View>
//             )}

//             {hasGigWork && (
//               <View style={styles.sectionBlock}>
//                 <Text style={styles.blockTitle}>Gig Work</Text>
//                 <Text style={styles.label}>Platforms you work with</Text>
//                 <View style={styles.chipWrap}>
//                   {platforms.map((platform) => (
//                     <TouchableOpacity
//                       key={platform}
//                       style={[
//                         styles.choiceChip,
//                         formData.platforms.includes(platform) && styles.choiceChipActive,
//                       ]}
//                       onPress={() => toggleArrayItem('platforms', platform)}
//                     >
//                       <Text
//                         style={[
//                           styles.choiceChipText,
//                           formData.platforms.includes(platform) && styles.choiceChipTextActive,
//                         ]}
//                       >
//                         {platform}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>

//                 {renderInput({
//                   label: 'Average Weekly KM',
//                   value: formData.averageWeeklyKm,
//                   onChangeText: (text) => updateField('averageWeeklyKm', text),
//                   placeholder: '250',
//                   keyboardType: 'numeric',
//                 })}
//               </View>
//             )}

//             {hasSelfEmployment && (
//               <View style={styles.sectionBlock}>
//                 <Text style={styles.blockTitle}>Self-Employment / Contract Work</Text>
//                 {renderInput({
//                   label: 'Contract Type / Service',
//                   value: formData.contractType,
//                   onChangeText: (text) => updateField('contractType', text),
//                   placeholder: 'Consulting, design, software, etc.',
//                 })}

//                 <View style={styles.switchRow}>
//                   <Text style={styles.switchLabel}>Quarterly Filing</Text>
//                   <Switch
//                     value={formData.quarterlyFiling}
//                     onValueChange={(value) => updateField('quarterlyFiling', value)}
//                   />
//                 </View>
//               </View>
//             )}

//             {hasBusiness && (
//               <View style={styles.sectionBlock}>
//                 <Text style={styles.blockTitle}>Corporation / Business Information</Text>

//                 {renderInput({
//                   label: 'Business Name',
//                   value: formData.businessName,
//                   onChangeText: (text) => updateField('businessName', text),
//                   placeholder: 'Business name',
//                 })}

//                 {renderPicker({
//                   label: 'Business Type',
//                   value: formData.businessType,
//                   onValueChange: (value) => updateField('businessType', value),
//                   options: businessTypes,
//                   placeholder: 'Business type',
//                 })}

//                 {renderInput({
//                   label: 'Business Number (BN)',
//                   value: formData.businessNumber,
//                   onChangeText: (text) => updateField('businessNumber', text),
//                   placeholder: '123456789RT0001',
//                 })}

//                 {renderInput({
//                   label: 'Year Established',
//                   value: formData.yearEstablished,
//                   onChangeText: (text) => updateField('yearEstablished', text),
//                   placeholder: '2022',
//                   keyboardType: 'numeric',
//                 })}

//                 {renderInput({
//                   label: 'Number of Employees',
//                   value: formData.numberOfEmployees,
//                   onChangeText: (text) => updateField('numberOfEmployees', text),
//                   placeholder: '4',
//                   keyboardType: 'numeric',
//                 })}
//               </View>
//             )}

//             <View style={styles.sectionBlock}>
//               <Text style={styles.blockTitle}>Other Income Sources</Text>

//               {[
//                 ['hasInvestments', 'Investments'],
//                 ['hasRentalIncome', 'Rental Income'],
//                 ['hasForeignIncome', 'Foreign Income'],
//                 ['hasCrypto', 'Cryptocurrency'],
//               ].map(([key, label]) => (
//                 <View key={key} style={styles.switchRow}>
//                   <Text style={styles.switchLabel}>{label}</Text>
//                   <Switch
//                     value={!!formData[key]}
//                     onValueChange={(value) => updateField(key, value)}
//                   />
//                 </View>
//               ))}
//             </View>
//           </Card>
//         )}

//                 {currentStep === 5 && showVehicleStep && (
//   <Card style={styles.card}>
//     {renderStepHeader(
//       'Vehicle Purchase for Work',
//       'Tell us if you or your spouse bought a vehicle this year for gig work, self-employment, or business use so your CA can review the bill of sale.'
//     )}

//     <View style={styles.sectionBlock}>
//       <Text style={styles.blockTitle}>Vehicle Purchase</Text>

//       <View style={styles.switchRow}>
//         <Text style={styles.switchLabel}>
//           I bought a vehicle this year for work use
//         </Text>
//         <Switch
//           value={!!formData.vehicleInfo.hasVehiclePurchase}
//           onValueChange={(value) => {
//             if (!value) {
//               clearFieldError('vehicleOwnerPerson');
//               clearFieldError('vehicleOwnershipType');
//               clearFieldError('vehicleMainUse');
//               clearFieldError('vehiclePurchaseDate');
//               clearFieldError('vehiclePurchasePrice');
//               clearFieldError('vehicleGstHstPaid');
//               clearVehicleFields();
//             } else {
//               updateVehicleField('hasVehiclePurchase', true);
//             }
//           }}
//         />
//       </View>

//       {formData.vehicleInfo.hasVehiclePurchase && (
//         <>
//           {renderPicker({
//             label: 'Who bought the vehicle?',
//             value: formData.vehicleInfo.ownerPerson,
//             onValueChange: (value) => {
//               updateVehicleField('ownerPerson', value);
//               updateVehicleField('mainUse', '');
//             },
//             options: vehicleOwnerOptions,
//             placeholder: 'Select owner',
//             error: fieldErrors.vehicleOwnerPerson,
//             fieldKey: 'vehicleOwnerPerson',
//           })}

//           {renderPicker({
//             label: 'Ownership Type',
//             value: formData.vehicleInfo.ownershipType,
//             onValueChange: (value) => updateVehicleField('ownershipType', value),
//             options: vehicleOwnershipOptions,
//             placeholder: 'Select ownership type',
//             error: fieldErrors.vehicleOwnershipType,
//             fieldKey: 'vehicleOwnershipType',
//           })}

//           {renderPicker({
//             label: 'Main Use',
//             value: formData.vehicleInfo.mainUse,
//             onValueChange: (value) => updateVehicleField('mainUse', value),
//             options: vehicleUseOptions,
//             placeholder: 'Select main use',
//             error: fieldErrors.vehicleMainUse,
//             fieldKey: 'vehicleMainUse',
//           })}

//           {renderDateField({
//             label: 'Purchase Date',
//             value: formData.vehicleInfo.purchaseDate,
//             onPress: () => setShowVehiclePurchaseDatePicker(true),
//             error: fieldErrors.vehiclePurchaseDate,
//             fieldKey: 'vehiclePurchaseDate',
//           })}

//           {showVehiclePurchaseDatePicker && (
//             <DateTimePicker
//               value={
//                 formData.vehicleInfo.purchaseDate
//                   ? new Date(formData.vehicleInfo.purchaseDate)
//                   : new Date()
//               }
//               mode="date"
//               display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//               maximumDate={new Date()}
//               onChange={(_, selectedDate) => {
//                 if (Platform.OS === 'android') setShowVehiclePurchaseDatePicker(false);
//                 if (selectedDate) {
//                   clearFieldError('vehiclePurchaseDate');
//                   updateVehicleField('purchaseDate', formatDate(selectedDate));
//                 }
//               }}
//             />
//           )}

//           {Platform.OS === 'ios' && showVehiclePurchaseDatePicker && (
//             <TouchableOpacity
//               style={styles.doneButton}
//               onPress={() => setShowVehiclePurchaseDatePicker(false)}
//             >
//               <Text style={styles.doneButtonText}>Done</Text>
//             </TouchableOpacity>
//           )}

//           <View style={styles.row}>
//             <View style={styles.half}>
//               {renderInput({
//                 label: 'Purchase Price',
//                 value: formData.vehicleInfo.purchasePrice,
//                 onChangeText: (text) =>
//                   updateVehicleField('purchasePrice', text.replace(/[^0-9.]/g, '')),
//                 placeholder: '35000',
//                 keyboardType: 'numeric',
//                 error: fieldErrors.vehiclePurchasePrice,
//                 fieldKey: 'vehiclePurchasePrice',
//               })}
//             </View>

//             <View style={styles.half}>
//               {renderInput({
//                 label: 'GST / HST Paid',
//                 value: formData.vehicleInfo.gstHstPaid,
//                 onChangeText: (text) =>
//                   updateVehicleField('gstHstPaid', text.replace(/[^0-9.]/g, '')),
//                 placeholder: '1750',
//                 keyboardType: 'numeric',
//                 error: fieldErrors.vehicleGstHstPaid,
//                 fieldKey: 'vehicleGstHstPaid',
//               })}
//             </View>
//           </View>

//           {renderInput({
//             label: 'VIN (Optional)',
//             value: formData.vehicleInfo.vin,
//             onChangeText: (text) => updateVehicleField('vin', text.toUpperCase()),
//             placeholder: 'Vehicle Identification Number',
//             autoCapitalize: 'characters',
//           })}

//           <View style={styles.field}>
//             <Text style={styles.label}>Upload Vehicle Bill of Sale</Text>

//             <TouchableOpacity
//               style={styles.uploadBox}
//              const handleVehicleUpload = async () => {
//   try {
//     const result = await DocumentPicker.getDocumentAsync({
//       type: ['application/pdf', 'image/*'],
//       copyToCacheDirectory: true,
//       multiple: false,
//     });

//     if (result.canceled) return;

//     const file = result.assets?.[0];
//     if (!file) return;

//     updateVehicleField('billOfSale', {
//       name: file.name,
//       uri: file.uri,
//       mimeType: file.mimeType,
//       size: file.size,
//     });
//   } catch (err) {
//     console.error('Upload error:', err);
//     Alert.alert('Upload failed', 'Could not upload file.');
//   }
// };
// const handleNext = () => {
//   if (!validateStep()) return;

//   setCurrentStep((prev) => getNextStep(prev));

//   requestAnimationFrame(() => {
//     scrollRef.current?.scrollTo({ y: 0, animated: true });
//   });
// };

// const handlePrevious = () => {
//   setCurrentStep((prev) => getPreviousStep(prev));

//   requestAnimationFrame(() => {
//     scrollRef.current?.scrollTo({ y: 0, animated: true });
//   });
// };

// const handleSubmit = async () => {
//   if (!validateStep()) return;

//   if (!formData.agreeToTerms || !formData.agreeToPrivacy || !formData.confirmAccuracy) {
//     Alert.alert('Missing confirmation', 'Please accept all agreements.');
//     return;
//   }

//   try {
//     setLoading(true);

//     const payload = {
//       firstName: formData.firstName.trim(),
//       lastName: formData.lastName.trim(),
//       email: formData.email.trim().toLowerCase(),
//       phone: formData.phone,
//       password: formData.password,
//       profile: formData,
//     };

//     const result = await register(payload);

//     if (result?.success) {
//       navigation.navigate('Dashboard');
//     } else {
//       Alert.alert('Error', result?.message || 'Registration failed');
//     }
//   } catch (err) {
//     console.error(err);
//     Alert.alert('Error', 'Something went wrong');
//   } finally {
//     setLoading(false);
//   }
// };
//             >
//               <Icon
//                 name="file-upload-outline"
//                 size={22}
//                 color={colors.primaryScale[500]}
//               />

//               <View style={styles.uploadContent}>
//                 <Text style={styles.uploadTitle}>
//                   {formData.vehicleInfo.billOfSale?.name || 'Upload Vehicle Bill of Sale'}
//                 </Text>

//                 <Text style={styles.uploadSubtitle}>
//                   Your CA can use this to review eligible vehicle purchase treatment.
//                 </Text>

//                 <Text style={styles.uploadMeta}>
//                   Accepted: PDF, Image
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.infoBanner}>
//             <Icon name="car-info" size={18} color={colors.primaryScale[600]} />
//             <Text style={styles.infoBannerText}>
//               This helps your CA review CCA, GST/HST credits, and business-use allocation.
//             </Text>
//           </View>
//         </>
//       )}
//     </View>
//   </Card>
// )}
//         {currentStep === 6 && (
//           <Card style={styles.card}>
//             {renderStepHeader('Deductions & Credits', 'Select the deductions that may apply to you.')}

//             <View style={styles.checkListWrap}>
//               {[
//                 ['hasRRSP', 'RRSP Contributions'],
//                 ['hasFHSA', 'FHSA Contributions'],
//                 ['hasTFSA', 'TFSA Contributions'],
//                 ['hasTuition', 'Tuition & Education'],
//                 ['hasMedicalExpenses', 'Medical Expenses'],
//                 ['hasCharitableDonations', 'Charitable Donations'],
//                 ['hasChildCareExpenses', 'Child Care Expenses'],
//                 ['hasMovingExpenses', 'Moving Expenses'],
//                 ['hasUnionDues', 'Union / Professional Dues'],
//                 ['hasToolExpenses', 'Tool Expenses'],
//                 ['hasHomeOffice', 'Home Office Expenses'],
//                 ['hasVehicleExpenses', 'Vehicle Expenses'],
//               ].map(([key, label]) => (
//                 <TouchableOpacity
//                   key={key}
//                   style={styles.checkItem}
//                   onPress={() => updateField(key, !formData[key])}
//                 >
//                   <Icon
//                     name={formData[key] ? 'checkbox-marked' : 'checkbox-blank-outline'}
//                     size={22}
//                     color={formData[key] ? colors.primaryScale[500] : colors.gray[400]}
//                   />
//                   <Text style={styles.checkItemText}>{label}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </Card>
//         )}

//         {currentStep === 7 && (
//           <Card style={styles.card}>
//             {renderStepHeader('Family Information', 'Add spouse and dependent details if applicable.')}

//             {(formData.maritalStatus === 'Married' ||
//               formData.maritalStatus === 'Common-Law') && (
//               <View style={styles.sectionBlock}>
//                 <Text style={styles.blockTitle}>Spouse / Partner Information</Text>

//                 {renderInput({
//                   label: "Spouse's Full Name",
//                   value: formData.spouseName,
//                   onChangeText: (text) => updateField('spouseName', text),
//                   placeholder: 'Full name',
//                   error: fieldErrors.spouseName,
//                   fieldKey: 'spouseName',
//                 })}

//                 {renderInput({
//                   label: "Spouse's SIN (Optional)",
//                   value: formData.spouseSin,
//                   onChangeText: (text) => updateField('spouseSin', text.replace(/\D/g, '').slice(0, 9)),
//                   placeholder: 'Optional',
//                   keyboardType: 'number-pad',
//                 })}

//                 {renderDateField({
//                   label: "Spouse's Date of Birth",
//                   value: formData.spouseDob,
//                   onPress: () => setShowSpouseDobPicker(true),
//                   error: fieldErrors.spouseDob,
//                   fieldKey: 'spouseDob',
//                 })}

//                 {showSpouseDobPicker && (
//                   <DateTimePicker
//                     value={formData.spouseDob ? new Date(formData.spouseDob) : new Date(2000, 0, 1)}
//                     mode="date"
//                     display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                     maximumDate={new Date()}
//                     onChange={(_, selectedDate) => {
//                       if (Platform.OS === 'android') setShowSpouseDobPicker(false);
//                       if (selectedDate) {
//                         clearFieldError('spouseDob');
//                         updateField('spouseDob', formatDate(selectedDate));
//                       }
//                     }}
//                   />
//                 )}

//                 {Platform.OS === 'ios' && showSpouseDobPicker && (
//                   <TouchableOpacity
//                     style={styles.doneButton}
//                     onPress={() => setShowSpouseDobPicker(false)}
//                   >
//                     <Text style={styles.doneButtonText}>Done</Text>
//                   </TouchableOpacity>
//                 )}

//                 <View style={styles.field} onLayout={setFieldRef('spouseTaxProfile')}>
//                   <Text style={styles.label}>Spouse Tax Profile</Text>
//                   <View style={styles.taxCardGrid}>
//   {profileOptions.map((item) =>
//     renderTaxCard(
//       item,
//       !!formData.spouseTaxProfile[item.key],
//       () => {
//         clearFieldError('spouseTaxProfile');
//         updateSpouseTaxProfile(item.key);
//       },
//       formData.spouseTaxProfile.unemployed && item.key !== 'unemployed'
//     )
//   )}
// </View>
//                   {!!fieldErrors.spouseTaxProfile && (
//                     <Text style={styles.errorText}>{fieldErrors.spouseTaxProfile}</Text>
//                   )}
//                 </View>

//                 {renderPicker({
//   label: "Spouse's Employment Status",
//   value: formData.spouseEmploymentStatus,
//   onValueChange: (value) => {
//     updateField('spouseEmploymentStatus', value);

//     if (value === 'Unemployed') {
//       setFormData((prev) => ({
//         ...prev,
//         spouseTaxProfile: {
//           employment: false,
//           gigWork: false,
//           selfEmployment: false,
//           incorporatedBusiness: false,
//           unemployed: true,
//         },
//       }));
//     } else if (formData.spouseTaxProfile.unemployed) {
//       setFormData((prev) => ({
//         ...prev,
//         spouseTaxProfile: {
//           ...prev.spouseTaxProfile,
//           unemployed: false,
//         },
//       }));
//     }
//   },
//   options: spouseEmploymentStatuses,
//   placeholder: 'Select spouse employment status',
//   error: fieldErrors.spouseEmploymentStatus,
//   fieldKey: 'spouseEmploymentStatus',
// })}

//                 {renderInput({
//                   label: "Spouse's Job Title",
//                   value: formData.spouseJobTitle,
//                   onChangeText: (text) => updateField('spouseJobTitle', text),
//                   placeholder: 'Job title / role',
//                 })}

//                 {renderInput({
//                   label: "Spouse's Employer / Business Name",
//                   value: formData.spouseEmployerName,
//                   onChangeText: (text) => updateField('spouseEmployerName', text),
//                   placeholder: 'Employer or business name',
//                 })}

//                 {renderInput({
//                   label: "Spouse's Income (Optional)",
//                   value: formData.spouseIncome,
//                   onChangeText: (text) => updateField('spouseIncome', text),
//                   placeholder: 'Approx annual income',
//                   keyboardType: 'numeric',
//                 })}

//                 {renderInput({
//                   label: "Spouse's Financial Situation",
//                   value: formData.spouseFinancialSituation,
//                   onChangeText: (text) => updateField('spouseFinancialSituation', text),
//                   placeholder: 'Any debts, support payments, unemployment, student status, etc.',
//                   multiline: true,
//                 })}

//                 <View style={styles.switchRow}>
//                   <Text style={styles.switchLabel}>Share account access with spouse</Text>
//                   <Switch
//                     value={formData.shareWithSpouse}
//                     onValueChange={(value) => updateField('shareWithSpouse', value)}
//                   />
//                 </View>
//               </View>
//             )}

//             {renderPicker({
//               label: 'Number of Dependents',
//               value: formData.numberOfDependents,
//               onValueChange: (value) => updateField('numberOfDependents', value),
//               options: dependentOptions,
//               placeholder: 'Select number of dependents',
//               fieldKey: 'numberOfDependents',
//             })}
//           </Card>
//         )}

//         {currentStep === 8 && (
//           <Card style={styles.card}>
//             {renderStepHeader('Review & Confirm', 'Check your details before creating the account.')}

//             <View style={styles.summaryCard}>
//               <View style={styles.summaryHeaderRow}>
//                 <Icon name="account-circle-outline" size={22} color={colors.primaryScale[600]} />
//                 <Text style={styles.summaryTitle}>Account Summary</Text>
//               </View>

//               <View style={styles.summaryGrid}>
//                 <View style={styles.summaryItem}>
//                   <Text style={styles.summaryLabel}>Name</Text>
//                   <Text style={styles.summaryValue}>
//                     {formData.firstName} {formData.lastName}
//                   </Text>
//                 </View>

//                 <View style={styles.summaryItem}>
//                   <Text style={styles.summaryLabel}>Email</Text>
//                   <Text style={styles.summaryValue}>{formData.email || '-'}</Text>
//                 </View>

//                 <View style={styles.summaryItem}>
//                   <Text style={styles.summaryLabel}>Phone</Text>
//                   <Text style={styles.summaryValue}>{formData.phone || '-'}</Text>
//                 </View>

//                 <View style={styles.summaryItem}>
//                   <Text style={styles.summaryLabel}>DOB</Text>
//                   <Text style={styles.summaryValue}>{formData.dateOfBirth || '-'}</Text>
//                 </View>

//                 <View style={styles.summaryItem}>
//                   <Text style={styles.summaryLabel}>Province</Text>
//                   <Text style={styles.summaryValue}>{formData.province || '-'}</Text>
//                 </View>

//                 <View style={styles.summaryItem}>
//                   <Text style={styles.summaryLabel}>City</Text>
//                   <Text style={styles.summaryValue}>{formData.city || '-'}</Text>
//                 </View>

//                 <View style={styles.summaryItem}>
//                   <Text style={styles.summaryLabel}>Dependents</Text>
//                   <Text style={styles.summaryValue}>{formData.numberOfDependents || '0'}</Text>
//                 </View>

//                 <View style={styles.summaryItem}>
//                   <Text style={styles.summaryLabel}>Profiles</Text>
//                   <Text style={styles.summaryValue}>
//                     {selectedProfiles.length ? selectedProfiles.map((x) => x.label).join(', ') : 'None'}
//                   </Text>
//                 </View>

//                 {(formData.maritalStatus === 'Married' ||
//                   formData.maritalStatus === 'Common-Law') && (
//                   <View style={styles.summaryItemFull}>
//                     <Text style={styles.summaryLabel}>Spouse Profiles</Text>
//                     <Text style={styles.summaryValue}>
//                       {selectedSpouseProfiles.length
//                         ? selectedSpouseProfiles.map((x) => x.label).join(', ')
//                         : 'None'}
//                     </Text>
//                   </View>
//                 )}
//               </View>
//             </View>

//             <Text style={styles.label}>Expense / Receipt Categories</Text>
//             <View style={styles.chipWrap}>
//               {receiptOptions.map((item) => (
//                 <TouchableOpacity
//                   key={item.key}
//                   style={[
//                     styles.choiceChip,
//                     formData.documentPreferences.selectedReceiptCategories.includes(item.key) &&
//                       styles.choiceChipActive,
//                   ]}
//                   onPress={() => toggleReceiptCategory(item.key)}
//                 >
//                   <Text
//                     style={[
//                       styles.choiceChipText,
//                       formData.documentPreferences.selectedReceiptCategories.includes(item.key) &&
//                         styles.choiceChipTextActive,
//                     ]}
//                   >
//                     {item.label}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//             const handleVehicleUpload = async () => {
//   try {
//     const result = await DocumentPicker.getDocumentAsync({
//       type: ['application/pdf', 'image/*'],
//       copyToCacheDirectory: true,
//       multiple: false,
//     });

//     if (result.canceled) return;

//     const file = result.assets?.[0];
//     if (!file) return;

//     updateVehicleField('billOfSale', {
//       name: file.name,
//       uri: file.uri,
//       type: file.mimeType,
//     });
//   } catch (err) {
//     console.error(err);
//     Alert.alert('Upload failed', 'Could not upload file.');
//   }
// };
// const handleNext = () => {
//   if (!validateStep()) return;
//   setCurrentStep((prev) => getNextStep(prev));
// };

// const handlePrevious = () => {
//   setCurrentStep((prev) => getPreviousStep(prev));
// };

// const handleSubmit = async () => {
//   if (!validateStep()) return;

//   try {
//     setLoading(true);

//     const payload = {
//       firstName: formData.firstName,
//       lastName: formData.lastName,
//       email: formData.email,
//       password: formData.password,
//       profile: formData,
//     };

//     const result = await register(payload);

//     if (result?.success) {
//       navigation.navigate('Dashboard');
//     } else {
//       Alert.alert('Error', result?.message || 'Registration failed');
//     }
//   } catch (err) {
//     console.error(err);
//     Alert.alert('Error', 'Something went wrong');
//   } finally {
//     setLoading(false);
//   }
// };
// <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
//   {currentStep > 1 && (
//     <TouchableOpacity onPress={handlePrevious} style={styles.localNavButtonOutline}>
//       <Text>Back</Text>
//     </TouchableOpacity>
//   )}

//   {currentStep < 8 ? (
//     <TouchableOpacity onPress={handleNext} style={styles.localNavButtonPrimary}>
//       <Text style={{ color: '#fff' }}>Next</Text>
//     </TouchableOpacity>
//   ) : (
//     <TouchableOpacity onPress={handleSubmit} style={styles.localNavButtonPrimary}>
//       <Text style={{ color: '#fff' }}>
//         {loading ? 'Creating...' : 'Create Account'}
//       </Text>
//     </TouchableOpacity>
//   )}
// </View>

//             <TouchableOpacity
//               style={styles.checkItem}
//               onPress={() => updateField('agreeToTerms', !formData.agreeToTerms)}
//             >
//               <Icon
//                 name={formData.agreeToTerms ? 'checkbox-marked' : 'checkbox-blank-outline'}
//                 size={22}
//                 color={formData.agreeToTerms ? colors.primaryScale[500] : colors.gray[400]}
//               />
//               <Text style={styles.checkItemText}>I agree to the Terms and Conditions</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.checkItem}
//               onPress={() => updateField('agreeToPrivacy', !formData.agreeToPrivacy)}
//             >
//               <Icon
//                 name={formData.agreeToPrivacy ? 'checkbox-marked' : 'checkbox-blank-outline'}
//                 size={22}
//                 color={formData.agreeToPrivacy ? colors.primaryScale[500] : colors.gray[400]}
//               />
//               <Text style={styles.checkItemText}>I agree to the Privacy Policy</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.checkItem}
//               onPress={() => updateField('confirmAccuracy', !formData.confirmAccuracy)}
//             >
//               <Icon
//                 name={formData.confirmAccuracy ? 'checkbox-marked' : 'checkbox-blank-outline'}
//                 size={22}
//                 color={formData.confirmAccuracy ? colors.primaryScale[500] : colors.gray[400]}
//               />
//               <Text style={styles.checkItemText}>
//                 I confirm the information provided is accurate
//               </Text>
//             </TouchableOpacity>
//           </Card>
//         )}

//         <View style={styles.navButtons}>
//           {currentStep > 1 ? (
//             renderNavButton({
//               label: 'Back',
//               onPress: handlePrevious,
//               variant: 'outline',
//             })
//           ) : (
//             <View style={styles.navButtonHalf} />
//           )}

//           {currentStep < steps.length ? (
//             renderNavButton({
//               label: 'Next',
//               onPress: handleNext,
//               variant: 'primary',
//             })
//           ) : (
//             renderNavButton({
//               label: loading ? 'Creating...' : 'Create Account',
//               onPress: handleSubmit,
//               variant: 'primary',
//               disabled: loading,
//             })
//           )}
//         </View>

//         <TouchableOpacity style={styles.bottomLink} onPress={() => navigation.navigate('Login')}>
//           <Text style={styles.bottomLinkText}>
//             Already have an account? <Text style={styles.bottomLinkAccent}>Sign in</Text>
//           </Text>
//         </TouchableOpacity>
//       </ScrollView>

//       <Modal
//         visible={selectorVisible}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setSelectorVisible(false)}
//       >
//         <View style={styles.selectorOverlay}>
//           <TouchableOpacity
//             style={styles.selectorBackdrop}
//             activeOpacity={1}
//             onPress={() => setSelectorVisible(false)}
//           />

//           <View style={styles.selectorSheet}>
//             <View style={styles.selectorHeader}>
//               <Text style={styles.selectorTitle}>{selectorTitle}</Text>
//               <TouchableOpacity onPress={() => setSelectorVisible(false)}>
//                 <Text style={styles.selectorDoneText}>Done</Text>
//               </TouchableOpacity>
//             </View>

//             <FlatList
//               data={selectorOptions}
//               keyExtractor={(item) => item}
//               showsVerticalScrollIndicator={false}
//               renderItem={({ item }) => {
//                 const selected = item === selectorValue;

//                 return (
//                   <TouchableOpacity
//                     style={styles.selectorItem}
//                     onPress={() => {
//                       if (selectorFieldKey) clearFieldError(selectorFieldKey);
//                       if (selectorOnChange) selectorOnChange(item);
//                     }}
//                   >
//                     <Text style={[styles.selectorItemText, selected && styles.selectorItemTextSelected]}>
//                       {item}
//                     </Text>
//                     {selected ? (
//                       <Icon name="check" size={18} color={colors.primaryScale[500]} />
//                     ) : null}
//                   </TouchableOpacity>
//                 );
//               }}
//             />
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default RegisterScreen;