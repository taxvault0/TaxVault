// import React, { useMemo, useState } from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   View,
//   ActivityIndicator,
//   Alert,
//   Switch,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { useAuth } from '@/features/auth/context/AuthContext';

// const STEP_TITLES = [
//   'Account',
//   'Professional',
//   'Firm',
//   'Practice',
//   'Review',
// ];

// const PROVINCES = [
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

// const CA_DESIGNATIONS = [
//   'CPA',
//   'CA',
//   'CMA',
//   'CGA',
//   'CPA-USA',
//   'Other International Designation',
// ];

// const EXPERTISE_AREAS = [
//   'Personal Tax',
//   'Corporate Tax',
//   'GST/HST',
//   'Payroll',
//   'Bookkeeping',
//   'Audit & Assurance',
//   'Financial Planning',
//   'Estate Planning',
//   'Business Valuation',
//   'International Tax',
//   'US Cross-Border',
//   'Real Estate',
//   'Construction',
//   'Technology',
//   'Healthcare',
// ];

// const LANGUAGES = [
//   'English',
//   'French',
//   'Punjabi',
//   'Hindi',
//   'Urdu',
//   'Spanish',
//   'Mandarin',
//   'Arabic',
//   'Tagalog',
// ];

// const TAX_SPECIALTIES = [
//   'T1 Personal Returns',
//   'T2 Corporation Returns',
//   'GST/HST Returns',
//   'Payroll Remittances',
//   'T4/T4A Preparation',
//   'Tax Planning',
//   'CRA Representation',
//   'Tax Audits',
//   'Voluntary Disclosures',
//   'Estate Planning',
// ];

// const PRIMARY_CLIENT_TYPES = [
//   'Individuals',
//   'Families',
//   'Small Businesses',
//   'Corporations',
//   'Gig Workers',
//   'Professionals',
//   'Newcomers to Canada',
//   'Students',
//   'Seniors',
// ];

// const emptyForm = {
//   // Account
//   firstName: '',
//   lastName: '',
//   email: '',
//   password: '',
//   confirmPassword: '',
//   phone: '',
//   alternatePhone: '',

//   // Professional
//   caDesignation: '',
//   caNumber: '',
//   provinceOfRegistration: '',
//   yearAdmitted: '',
//   yearsOfExperience: '',
//   firmName: '',
//   firmWebsite: '',
//   areasOfExpertise: [],
//   languages: [],

//   // Firm
//   firmAddress: '',
//   firmCity: '',
//   firmProvince: '',
//   firmPostalCode: '',
//   firmCountry: 'Canada',
//   firmPhone: '',
//   firmEmail: '',
//   firmSize: '',
//   numberOfPartners: '',
//   numberOfStaff: '',
//   yearEstablished: '',

//   // Credentials
//   professionalLiabilityInsurance: false,
//   insuranceProvider: '',
//   policyNumber: '',
//   coverageAmount: '',
//   expiryDate: '',
//   cpaMemberInGoodStanding: false,
//   peerReviewCompleted: false,
//   disciplinaryHistory: false,
//   disciplinaryDetails: '',

//   // Practice
//   practiceType: '',
//   acceptNewClients: true,
//   offersVirtualServices: true,
//   offersInPersonServices: true,
//   weekendAvailability: false,
//   acceptsCRA: false,
//   serviceRadius: '',
//   hoursOfOperation: '',
//   primaryClientType: [],
//   taxSpecialties: [],

//   // Review
//   authorizeVerification: false,
//   confirmAccuracy: false,
//   agreeToTerms: false,
//   agreeToPrivacy: false,
// };

// const RegisterScreenCA = () => {
//   const navigation = useNavigation();
//   const { register } = useAuth();

//   const [loading, setLoading] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [form, setForm] = useState(emptyForm);
//   const [errors, setErrors] = useState({});

//   const fullName = useMemo(
//     () => `${form.firstName} ${form.lastName}`.trim(),
//     [form.firstName, form.lastName]
//   );

//   const updateField = (key, value) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//     setErrors((prev) => ({ ...prev, [key]: '' }));
//   };

//   const toggleArrayValue = (key, value) => {
//     setForm((prev) => {
//       const exists = prev[key].includes(value);
//       return {
//         ...prev,
//         [key]: exists
//           ? prev[key].filter((item) => item !== value)
//           : [...prev[key], value],
//       };
//     });
//   };

//   const validateStep = () => {
//     const newErrors = {};
//     const currentYear = new Date().getFullYear();

//     if (currentStep === 1) {
//       if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
//       if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
//       if (!form.email.trim()) {
//         newErrors.email = 'Email is required';
//       } else if (!/\S+@\S+\.\S+/.test(form.email)) {
//         newErrors.email = 'Enter a valid email address';
//       }
//       if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
//       if (!form.password) {
//         newErrors.password = 'Password is required';
//       } else if (form.password.length < 8) {
//         newErrors.password = 'Password must be at least 8 characters';
//       }
//       if (!form.confirmPassword) {
//         newErrors.confirmPassword = 'Confirm your password';
//       } else if (form.password !== form.confirmPassword) {
//         newErrors.confirmPassword = 'Passwords do not match';
//       }
//     }

//     if (currentStep === 2) {
//       if (!form.caDesignation) newErrors.caDesignation = 'Select a designation';
//       if (!form.caNumber.trim()) newErrors.caNumber = 'CA number is required';
//       if (!form.provinceOfRegistration) {
//         newErrors.provinceOfRegistration = 'Select province of registration';
//       }
//       if (!form.yearAdmitted.trim()) {
//         newErrors.yearAdmitted = 'Year admitted is required';
//       } else if (
//         Number(form.yearAdmitted) < 1950 ||
//         Number(form.yearAdmitted) > currentYear
//       ) {
//         newErrors.yearAdmitted = `Year must be between 1950 and ${currentYear}`;
//       }
//       if (!form.yearsOfExperience.trim()) {
//         newErrors.yearsOfExperience = 'Years of experience is required';
//       }
//       if (!form.firmName.trim()) newErrors.firmName = 'Firm name is required';
//     }

//     if (currentStep === 3) {
//       if (!form.firmAddress.trim()) newErrors.firmAddress = 'Firm address is required';
//       if (!form.firmCity.trim()) newErrors.firmCity = 'City is required';
//       if (!form.firmProvince.trim()) newErrors.firmProvince = 'Province is required';
//       if (!form.firmPostalCode.trim()) {
//         newErrors.firmPostalCode = 'Postal code is required';
//       } else if (!/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(form.firmPostalCode)) {
//         newErrors.firmPostalCode = 'Enter a valid Canadian postal code';
//       }
//       if (!form.firmPhone.trim()) newErrors.firmPhone = 'Firm phone is required';
//       if (!form.firmEmail.trim()) {
//         newErrors.firmEmail = 'Firm email is required';
//       } else if (!/\S+@\S+\.\S+/.test(form.firmEmail)) {
//         newErrors.firmEmail = 'Enter a valid firm email';
//       }
//     }

//     if (currentStep === 4) {
//       if (!form.cpaMemberInGoodStanding) {
//         newErrors.cpaMemberInGoodStanding = 'You must confirm CPA good standing';
//       }
//       if (form.professionalLiabilityInsurance) {
//         if (!form.insuranceProvider.trim()) {
//           newErrors.insuranceProvider = 'Insurance provider is required';
//         }
//         if (!form.policyNumber.trim()) {
//           newErrors.policyNumber = 'Policy number is required';
//         }
//       }
//     }

//     if (currentStep === 5) {
//       if (!form.authorizeVerification) {
//         newErrors.authorizeVerification = 'Authorize credential verification';
//       }
//       if (!form.confirmAccuracy) {
//         newErrors.confirmAccuracy = 'Confirm that information is accurate';
//       }
//       if (!form.agreeToTerms) {
//         newErrors.agreeToTerms = 'You must accept terms';
//       }
//       if (!form.agreeToPrivacy) {
//         newErrors.agreeToPrivacy = 'You must accept privacy policy';
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleNext = () => {
//     if (!validateStep()) return;
//     setCurrentStep((prev) => Math.min(prev + 1, STEP_TITLES.length));
//   };

//   const handleBack = () => {
//     if (currentStep === 1) {
//       navigation.goBack();
//       return;
//     }
//     setCurrentStep((prev) => Math.max(prev - 1, 1));
//   };

//   const handleRegister = async () => {
//     if (!validateStep()) return;

//     setLoading(true);
//     try {
//       const result = await register(
//         {
//           name: fullName,
//           email: form.email,
//           password: form.password,
//           phone: form.phone,
//           firmName: form.firmName,
//           caNumber: form.caNumber,
//           specialization: form.taxSpecialties.join(', '),
//           yearsOfExperience: form.yearsOfExperience,
//           role: 'ca',
//           termsAccepted: form.agreeToTerms,
//           privacyAccepted: form.agreeToPrivacy,
//           professionalTermsAccepted: true,
//           termsAcceptedAt: new Date().toISOString(),
//           profile: {
//             ...form,
//             name: fullName,
//           },
//         },
//         'ca'
//       );

//       if (!result?.success) {
//         Alert.alert('Registration failed', result?.message || 'Please try again.');
//         return;
//       }

//       navigation.reset({
//         index: 0,
//         routes: [{ name: 'CAStack' }],
//       });
//     } catch (error) {
//       Alert.alert('Registration failed', 'Something went wrong. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderError = (key) =>
//     errors[key] ? <Text style={styles.errorText}>{errors[key]}</Text> : null;

//   const renderInput = ({
//     label,
//     field,
//     placeholder,
//     keyboardType = 'default',
//     secureTextEntry = false,
//     multiline = false,
//   }) => (
//     <View style={styles.fieldBlock}>
//       <Text style={styles.label}>{label}</Text>
//       <TextInput
//         style={[
//           styles.input,
//           multiline && styles.textArea,
//           errors[field] && styles.inputError,
//         ]}
//         placeholder={placeholder}
//         placeholderTextColor="#94A3B8"
//         keyboardType={keyboardType}
//         secureTextEntry={secureTextEntry}
//         multiline={multiline}
//         value={String(form[field] ?? '')}
//         onChangeText={(value) => updateField(field, value)}
//       />
//       {renderError(field)}
//     </View>
//   );

//   const renderSelectChips = (title, field, options) => (
//     <View style={styles.fieldBlock}>
//       <Text style={styles.label}>{title}</Text>
//       <View style={styles.chipsWrap}>
//         {options.map((option) => {
//           const selected = form[field].includes(option);
//           return (
//             <TouchableOpacity
//               key={option}
//               style={[styles.chip, selected && styles.chipActive]}
//               onPress={() => toggleArrayValue(field, option)}
//             >
//               <Text style={[styles.chipText, selected && styles.chipTextActive]}>
//                 {option}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     </View>
//   );

//   const renderSingleChoice = (title, field, options) => (
//     <View style={styles.fieldBlock}>
//       <Text style={styles.label}>{title}</Text>
//       <View style={styles.chipsWrap}>
//         {options.map((option) => {
//           const selected = form[field] === option;
//           return (
//             <TouchableOpacity
//               key={option}
//               style={[styles.chip, selected && styles.chipActive]}
//               onPress={() => updateField(field, option)}
//             >
//               <Text style={[styles.chipText, selected && styles.chipTextActive]}>
//                 {option}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//       {renderError(field)}
//     </View>
//   );

//   const renderSwitchRow = (label, field) => (
//     <View style={styles.switchRow} key={field}>
//       <Text style={styles.switchLabel}>{label}</Text>
//       <Switch
//         value={!!form[field]}
//         onValueChange={(value) => updateField(field, value)}
//         trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
//         thumbColor={form[field] ? '#2563EB' : '#F8FAFC'}
//       />
//     </View>
//   );

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <>
//             <View style={styles.heroCard}>
//               <Text style={styles.heroEyebrow}>TaxVault Professional</Text>
//               <Text style={styles.heroTitle}>Create your CA account</Text>
//               <Text style={styles.heroSubtitle}>
//                 Join as a verified Chartered Accountant with a cleaner mobile-first signup flow.
//               </Text>
//             </View>

//             <View style={styles.sectionCard}>
//               <Text style={styles.sectionTitle}>Account information</Text>
//               {renderInput({ label: 'First name *', field: 'firstName', placeholder: 'John' })}
//               {renderInput({ label: 'Last name *', field: 'lastName', placeholder: 'Doe' })}
//               {renderInput({
//                 label: 'Email *',
//                 field: 'email',
//                 placeholder: 'ca@firm.ca',
//                 keyboardType: 'email-address',
//               })}
//               {renderInput({
//                 label: 'Phone number *',
//                 field: 'phone',
//                 placeholder: '(780) 555-1234',
//                 keyboardType: 'phone-pad',
//               })}
//               {renderInput({
//                 label: 'Alternate phone',
//                 field: 'alternatePhone',
//                 placeholder: '(780) 555-5678',
//                 keyboardType: 'phone-pad',
//               })}
//               {renderInput({
//                 label: 'Password *',
//                 field: 'password',
//                 placeholder: 'Minimum 8 characters',
//                 secureTextEntry: true,
//               })}
//               {renderInput({
//                 label: 'Confirm password *',
//                 field: 'confirmPassword',
//                 placeholder: 'Re-enter password',
//                 secureTextEntry: true,
//               })}
//             </View>
//           </>
//         );

//       case 2:
//         return (
//           <>
//             <View style={styles.sectionCard}>
//               <Text style={styles.sectionTitle}>Professional information</Text>

//               {renderSingleChoice('CA designation *', 'caDesignation', CA_DESIGNATIONS)}

//               {renderInput({
//                 label: 'CA number / license number *',
//                 field: 'caNumber',
//                 placeholder: '123456',
//               })}

//               {renderSingleChoice(
//                 'Province of registration *',
//                 'provinceOfRegistration',
//                 PROVINCES
//               )}

//               {renderInput({
//                 label: 'Year admitted *',
//                 field: 'yearAdmitted',
//                 placeholder: '2012',
//                 keyboardType: 'numeric',
//               })}

//               {renderInput({
//                 label: 'Years of experience *',
//                 field: 'yearsOfExperience',
//                 placeholder: '10',
//                 keyboardType: 'numeric',
//               })}

//               {renderInput({
//                 label: 'Firm name *',
//                 field: 'firmName',
//                 placeholder: 'ABC Professional Corporation',
//               })}

//               {renderInput({
//                 label: 'Firm website',
//                 field: 'firmWebsite',
//                 placeholder: 'https://www.yourfirm.ca',
//                 keyboardType: 'url',
//               })}

//               {renderSelectChips('Areas of expertise', 'areasOfExpertise', EXPERTISE_AREAS)}
//               {renderSelectChips('Languages', 'languages', LANGUAGES)}
//             </View>
//           </>
//         );

//       case 3:
//         return (
//           <View style={styles.sectionCard}>
//             <Text style={styles.sectionTitle}>Firm details</Text>

//             {renderInput({
//               label: 'Firm address *',
//               field: 'firmAddress',
//               placeholder: '123 Main Street',
//             })}
//             {renderInput({
//               label: 'City *',
//               field: 'firmCity',
//               placeholder: 'Fort McMurray',
//             })}
//             {renderSingleChoice('Province *', 'firmProvince', PROVINCES)}
//             {renderInput({
//               label: 'Postal code *',
//               field: 'firmPostalCode',
//               placeholder: 'T9H 1A1',
//             })}
//             {renderInput({
//               label: 'Firm country',
//               field: 'firmCountry',
//               placeholder: 'Canada',
//             })}
//             {renderInput({
//               label: 'Firm phone *',
//               field: 'firmPhone',
//               placeholder: '(780) 555-0000',
//               keyboardType: 'phone-pad',
//             })}
//             {renderInput({
//               label: 'Firm email *',
//               field: 'firmEmail',
//               placeholder: 'info@firm.ca',
//               keyboardType: 'email-address',
//             })}
//             {renderInput({
//               label: 'Firm size',
//               field: 'firmSize',
//               placeholder: 'Solo / Small / Medium / Large',
//             })}
//             {renderInput({
//               label: 'Number of partners',
//               field: 'numberOfPartners',
//               placeholder: '2',
//               keyboardType: 'numeric',
//             })}
//             {renderInput({
//               label: 'Number of staff',
//               field: 'numberOfStaff',
//               placeholder: '8',
//               keyboardType: 'numeric',
//             })}
//             {renderInput({
//               label: 'Year established',
//               field: 'yearEstablished',
//               placeholder: '2015',
//               keyboardType: 'numeric',
//             })}
//           </View>
//         );

//       case 4:
//         return (
//           <>
//             <View style={styles.sectionCard}>
//               <Text style={styles.sectionTitle}>Credentials & compliance</Text>

//               {renderSwitchRow(
//                 'I have active professional liability insurance',
//                 'professionalLiabilityInsurance'
//               )}

//               {form.professionalLiabilityInsurance && (
//                 <>
//                   {renderInput({
//                     label: 'Insurance provider *',
//                     field: 'insuranceProvider',
//                     placeholder: 'Insurance company name',
//                   })}
//                   {renderInput({
//                     label: 'Policy number *',
//                     field: 'policyNumber',
//                     placeholder: 'POL-123456',
//                   })}
//                   {renderInput({
//                     label: 'Coverage amount',
//                     field: 'coverageAmount',
//                     placeholder: '$1,000,000',
//                   })}
//                   {renderInput({
//                     label: 'Expiry date',
//                     field: 'expiryDate',
//                     placeholder: 'YYYY-MM-DD',
//                   })}
//                 </>
//               )}

//               {renderSwitchRow(
//                 'I am a CPA member in good standing',
//                 'cpaMemberInGoodStanding'
//               )}
//               {renderError('cpaMemberInGoodStanding')}

//               {renderSwitchRow('Peer review completed', 'peerReviewCompleted')}
//               {renderSwitchRow('Disciplinary history to disclose', 'disciplinaryHistory')}

//               {form.disciplinaryHistory &&
//                 renderInput({
//                   label: 'Disciplinary details',
//                   field: 'disciplinaryDetails',
//                   placeholder: 'Provide details here',
//                   multiline: true,
//                 })}
//             </View>

//             <View style={styles.sectionCard}>
//               <Text style={styles.sectionTitle}>Practice information</Text>

//               {renderInput({
//                 label: 'Practice type',
//                 field: 'practiceType',
//                 placeholder: 'Sole / Partnership / LLP / Corporation',
//               })}
//               {renderInput({
//                 label: 'Service radius (km)',
//                 field: 'serviceRadius',
//                 placeholder: '50',
//                 keyboardType: 'numeric',
//               })}
//               {renderInput({
//                 label: 'Hours of operation',
//                 field: 'hoursOfOperation',
//                 placeholder: 'Mon-Fri 9:00 AM - 5:00 PM',
//               })}

//               {renderSwitchRow('Accepting new clients', 'acceptNewClients')}
//               {renderSwitchRow('Offers virtual services', 'offersVirtualServices')}
//               {renderSwitchRow('Offers in-person services', 'offersInPersonServices')}
//               {renderSwitchRow('Weekend availability', 'weekendAvailability')}
//               {renderSwitchRow('Offers CRA representation', 'acceptsCRA')}

//               {renderSelectChips('Primary client types', 'primaryClientType', PRIMARY_CLIENT_TYPES)}
//               {renderSelectChips('Tax specialties', 'taxSpecialties', TAX_SPECIALTIES)}
//             </View>
//           </>
//         );

//       case 5:
//         return (
//           <>
//             <View style={styles.sectionCard}>
//               <Text style={styles.sectionTitle}>Review your information</Text>

//               <View style={styles.summaryCard}>
//                 <Text style={styles.summaryTitle}>Account</Text>
//                 <Text style={styles.summaryText}>Name: {fullName || '-'}</Text>
//                 <Text style={styles.summaryText}>Email: {form.email || '-'}</Text>
//                 <Text style={styles.summaryText}>Phone: {form.phone || '-'}</Text>
//               </View>

//               <View style={styles.summaryCard}>
//                 <Text style={styles.summaryTitle}>Professional</Text>
//                 <Text style={styles.summaryText}>Designation: {form.caDesignation || '-'}</Text>
//                 <Text style={styles.summaryText}>CA Number: {form.caNumber || '-'}</Text>
//                 <Text style={styles.summaryText}>
//                   Registration Province: {form.provinceOfRegistration || '-'}
//                 </Text>
//                 <Text style={styles.summaryText}>Firm: {form.firmName || '-'}</Text>
//               </View>

//               <View style={styles.summaryCard}>
//                 <Text style={styles.summaryTitle}>Practice</Text>
//                 <Text style={styles.summaryText}>
//                   Client Types:{' '}
//                   {form.primaryClientType.length
//                     ? form.primaryClientType.join(', ')
//                     : '-'}
//                 </Text>
//                 <Text style={styles.summaryText}>
//                   Tax Specialties:{' '}
//                   {form.taxSpecialties.length
//                     ? form.taxSpecialties.join(', ')
//                     : '-'}
//                 </Text>
//               </View>
//             </View>

//             <View style={styles.sectionCard}>
//               <Text style={styles.sectionTitle}>Declarations</Text>

//               {renderSwitchRow(
//                 'I authorize verification of my credentials',
//                 'authorizeVerification'
//               )}
//               {renderError('authorizeVerification')}

//               {renderSwitchRow(
//                 'I confirm all information provided is accurate',
//                 'confirmAccuracy'
//               )}
//               {renderError('confirmAccuracy')}

//               {renderSwitchRow('I agree to the Terms & Conditions', 'agreeToTerms')}
//               {renderError('agreeToTerms')}

//               {renderSwitchRow('I agree to the Privacy Policy', 'agreeToPrivacy')}
//               {renderError('agreeToPrivacy')}
//             </View>
//           </>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.topBar}>
//         <TouchableOpacity onPress={handleBack} style={styles.backButton}>
//           <Text style={styles.backText}>{currentStep === 1 ? '← Back' : '← Previous'}</Text>
//         </TouchableOpacity>
//         <Text style={styles.brand}>TaxVault</Text>
//       </View>

//       <View style={styles.progressWrap}>
//         <View style={styles.progressHeader}>
//           <Text style={styles.progressTitle}>CA Registration</Text>
//           <Text style={styles.progressStep}>
//             Step {currentStep} of {STEP_TITLES.length}
//           </Text>
//         </View>

//         <View style={styles.progressTrack}>
//           <View
//             style={[
//               styles.progressFill,
//               { width: `${(currentStep / STEP_TITLES.length) * 100}%` },
//             ]}
//           />
//         </View>

//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.stepTabs}
//         >
//           {STEP_TITLES.map((title, index) => {
//             const stepNumber = index + 1;
//             const active = currentStep === stepNumber;
//             const completed = currentStep > stepNumber;

//             return (
//               <View
//                 key={title}
//                 style={[
//                   styles.stepPill,
//                   active && styles.stepPillActive,
//                   completed && styles.stepPillCompleted,
//                 ]}
//               >
//                 <Text
//                   style={[
//                     styles.stepPillText,
//                     (active || completed) && styles.stepPillTextActive,
//                   ]}
//                 >
//                   {stepNumber}. {title}
//                 </Text>
//               </View>
//             );
//           })}
//         </ScrollView>
//       </View>

//       <ScrollView
//         style={styles.scroll}
//         contentContainerStyle={styles.container}
//         showsVerticalScrollIndicator={false}
//       >
//         {renderStepContent()}

//         <View style={styles.bottomActions}>
//           {currentStep < STEP_TITLES.length ? (
//             <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
//               <Text style={styles.primaryButtonText}>Continue</Text>
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity
//               style={[styles.primaryButton, loading && styles.buttonDisabled]}
//               onPress={handleRegister}
//               disabled={loading}
//             >
//               {loading ? (
//                 <ActivityIndicator color="#FFFFFF" />
//               ) : (
//                 <Text style={styles.primaryButtonText}>Create CA Account</Text>
//               )}
//             </TouchableOpacity>
//           )}

//           <TouchableOpacity
//             style={styles.footerLink}
//             onPress={() => navigation.navigate('LoginScreenCA')}
//           >
//             <Text style={styles.footerLinkText}>
//               Already have an account? Login as CA
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#EEF4FF',
//   },
//   topBar: {
//     paddingHorizontal: 20,
//     paddingTop: 10,
//     paddingBottom: 12,
//     backgroundColor: '#FFFFFF',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E2E8F0',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   backButton: {
//     paddingVertical: 6,
//     paddingRight: 10,
//   },
//   backText: {
//     color: '#2563EB',
//     fontSize: 15,
//     fontWeight: '700',
//   },
//   brand: {
//     fontSize: 22,
//     fontWeight: '800',
//     color: '#0F172A',
//   },
//   progressWrap: {
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 20,
//     paddingBottom: 16,
//   },
//   progressHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 14,
//     marginBottom: 10,
//   },
//   progressTitle: {
//     fontSize: 18,
//     fontWeight: '800',
//     color: '#0F172A',
//   },
//   progressStep: {
//     fontSize: 13,
//     color: '#64748B',
//     fontWeight: '600',
//   },
//   progressTrack: {
//     height: 8,
//     backgroundColor: '#E2E8F0',
//     borderRadius: 999,
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: 8,
//     backgroundColor: '#2563EB',
//     borderRadius: 999,
//   },
//   stepTabs: {
//     gap: 8,
//     paddingTop: 12,
//   },
//   stepPill: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 999,
//     backgroundColor: '#F1F5F9',
//     marginRight: 8,
//   },
//   stepPillActive: {
//     backgroundColor: '#DBEAFE',
//   },
//   stepPillCompleted: {
//     backgroundColor: '#2563EB',
//   },
//   stepPillText: {
//     fontSize: 12,
//     color: '#475569',
//     fontWeight: '700',
//   },
//   stepPillTextActive: {
//     color: '#FFFFFF',
//   },
//   scroll: {
//     flex: 1,
//   },
//   container: {
//     padding: 20,
//     paddingBottom: 32,
//   },
//   heroCard: {
//     backgroundColor: '#0F172A',
//     borderRadius: 24,
//     padding: 22,
//     marginBottom: 16,
//   },
//   heroEyebrow: {
//     color: '#93C5FD',
//     fontSize: 12,
//     fontWeight: '800',
//     textTransform: 'uppercase',
//     letterSpacing: 1,
//     marginBottom: 8,
//   },
//   heroTitle: {
//     color: '#FFFFFF',
//     fontSize: 24,
//     fontWeight: '800',
//     marginBottom: 8,
//   },
//   heroSubtitle: {
//     color: '#CBD5E1',
//     fontSize: 14,
//     lineHeight: 21,
//   },
//   sectionCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 24,
//     padding: 18,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '800',
//     color: '#0F172A',
//     marginBottom: 16,
//   },
//   fieldBlock: {
//     marginBottom: 14,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#334155',
//     marginBottom: 8,
//   },
//   input: {
//     backgroundColor: '#F8FAFC',
//     borderWidth: 1,
//     borderColor: '#CBD5E1',
//     borderRadius: 16,
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     fontSize: 15,
//     color: '#0F172A',
//   },
//   textArea: {
//     minHeight: 110,
//     textAlignVertical: 'top',
//   },
//   inputError: {
//     borderColor: '#DC2626',
//     backgroundColor: '#FEF2F2',
//   },
//   errorText: {
//     marginTop: 6,
//     color: '#DC2626',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   chipsWrap: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 10,
//   },
//   chip: {
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 999,
//     backgroundColor: '#F1F5F9',
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//   },
//   chipActive: {
//     backgroundColor: '#2563EB',
//     borderColor: '#2563EB',
//   },
//   chipText: {
//     color: '#334155',
//     fontSize: 13,
//     fontWeight: '700',
//   },
//   chipTextActive: {
//     color: '#FFFFFF',
//   },
//   switchRow: {
//     backgroundColor: '#F8FAFC',
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     marginBottom: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     gap: 12,
//   },
//   switchLabel: {
//     flex: 1,
//     color: '#0F172A',
//     fontSize: 14,
//     fontWeight: '600',
//     lineHeight: 20,
//   },
//   summaryCard: {
//     backgroundColor: '#F8FAFC',
//     borderRadius: 18,
//     padding: 14,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//   },
//   summaryTitle: {
//     fontSize: 15,
//     fontWeight: '800',
//     color: '#0F172A',
//     marginBottom: 8,
//   },
//   summaryText: {
//     fontSize: 14,
//     color: '#475569',
//     marginBottom: 4,
//     lineHeight: 20,
//   },
//   bottomActions: {
//     marginTop: 8,
//   },
//   primaryButton: {
//     backgroundColor: '#2563EB',
//     borderRadius: 18,
//     paddingVertical: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#2563EB',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.2,
//     shadowRadius: 18,
//     elevation: 4,
//   },
//   primaryButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '800',
//   },
//   buttonDisabled: {
//     opacity: 0.7,
//   },
//   footerLink: {
//     marginTop: 16,
//     alignItems: 'center',
//     paddingVertical: 8,
//   },
//   footerLinkText: {
//     color: '#2563EB',
//     fontSize: 15,
//     fontWeight: '700',
//   },
// });

// export default RegisterScreenCA;


