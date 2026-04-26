import React, { useMemo, useRef, useState } from 'react';
import {
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  View,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

import { colors } from '@/styles/theme';
import { useAuth } from '@/features/auth/context/AuthContext';
import styles from './RegisterScreen.styles';

import {
  profileOptions,
  employmentStatuses,
  taxFilingStatuses,
  spouseEmploymentStatuses,
  businessTypes,
  platforms,
  dependentOptions,
  receiptOptions,
  vehicleOwnershipOptions,
  steps,
} from './RegisterScreen.constants';

import {
  formatDate,
  calculateAge,
  formatPhoneNumber,
  getVehicleUseOptions,
  isValidEmail,
} from './RegisterScreen.helpers';

import ProgressSteps from './components/ProgressSteps';
import NavButtons from './components/NavButtons';
import AccountStep from './components/AccountStep';
import PersonalStep from './components/PersonalStep';
import TaxStep from './components/TaxStep';
import IncomeStep from './components/IncomeStep';
import DeductionsStep from './components/DeductionsStep';
import ReviewStep from './components/ReviewStep';
import SelectorModal from './components/SelectorModal';

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || '';

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const scrollRef = useRef(null);
  const fieldRefs = useRef({});

  const [currentStep, setCurrentStep] = useState(1);
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showSpouseDobPicker, setShowSpouseDobPicker] = useState(false);
  const [showVehiclePurchaseDatePicker, setShowVehiclePurchaseDatePicker] =
    useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [selectorVisible, setSelectorVisible] = useState(false);
  const [selectorTitle, setSelectorTitle] = useState('');
  const [selectorOptions, setSelectorOptions] = useState([]);
  const [selectorValue, setSelectorValue] = useState('');
  const [selectorOnChange, setSelectorOnChange] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    sin: '',

    address: '',
    addressData: null,
    city: '',
    province: '',
    postalCode: '',
    country: 'Canada',

    taxProfile: {
      employment: true,
      gigWork: false,
      selfEmployment: false,
      incorporatedBusiness: false,
      unemployed: false,
    },
    employmentStatus: '',
    taxFilingStatus: '',
    maritalStatus: '',
    numberOfDependents: '0',

    businessName: '',
    businessType: '',
    businessNumber: '',
    yearEstablished: '',
    numberOfEmployees: '',
    platforms: [],
    averageWeeklyKm: '',
    employerName: '',
    employerBusinessNumber: '',
    employeeId: '',
    contractType: '',
    quarterlyFiling: false,

    hasInvestments: false,
    hasRentalIncome: false,
    hasForeignIncome: false,
    hasCrypto: false,
    hasRRSP: false,
    hasFHSA: false,
    hasTFSA: false,
    hasTuition: false,
    hasMedicalExpenses: false,
    hasCharitableDonations: false,
    hasChildCareExpenses: false,
    hasMovingExpenses: false,
    hasUnionDues: false,
    hasToolExpenses: false,
    hasHomeOffice: false,
    hasVehicleExpenses: false,

    spouseName: '',
    spouseSin: '',
    spouseDob: '',
    spousePhone: '',
    spouseIncome: '',
    spouseEmploymentStatus: '',
    spouseJobTitle: '',
    spouseEmployerName: '',
    spouseFinancialSituation: '',
    shareWithSpouse: false,
    spousePlatforms: [],
    spouseAverageWeeklyKm: '',
    spouseContractType: '',
    spouseQuarterlyFiling: false,
    spouseBusinessName: '',
    spouseBusinessType: '',
    spouseBusinessNumber: '',
    spouseYearEstablished: '',
    spouseNumberOfEmployees: '',
    spouseTaxProfile: {
      employment: false,
      gigWork: false,
      selfEmployment: false,
      incorporatedBusiness: false,
      unemployed: false,
    },

    agreeToTerms: false,
    agreeToPrivacy: false,
    confirmAccuracy: false,

    documentPreferences: {
      selectedReceiptCategories: [],
    },

    vehicleInfo: {
      hasVehiclePurchase: false,
      ownerPerson: '',
      ownershipType: '',
      mainUse: '',
      purchaseDate: '',
      purchasePrice: '',
      gstHstPaid: '',
      vin: '',
      billOfSale: null,
    },
  });

  const hasEmployment = !!formData.taxProfile.employment;
  const hasGigWork = !!formData.taxProfile.gigWork;
  const hasSelfEmployment = !!formData.taxProfile.selfEmployment;
  const hasBusiness = !!formData.taxProfile.incorporatedBusiness;

  const visibleSteps = steps;

  const getVehicleOwnerOptions = (data) => {
    const options = [];

    const userEligible =
      data.taxProfile.gigWork ||
      data.taxProfile.selfEmployment ||
      data.taxProfile.incorporatedBusiness;

    const spouseEligible =
      (data.maritalStatus === 'Married' ||
        data.maritalStatus === 'Common-Law') &&
      (data.spouseTaxProfile.gigWork ||
        data.spouseTaxProfile.selfEmployment ||
        data.spouseTaxProfile.incorporatedBusiness);

    if (userEligible) options.push('Primary Taxpayer');
    if (spouseEligible) options.push('Spouse');

    return options;
  };

  const getVehicleUseOptionsByOwner = (data) => {
    if (data.vehicleInfo.ownerPerson === 'Spouse') {
      return getVehicleUseOptions(data.spouseTaxProfile);
    }
    return getVehicleUseOptions(data.taxProfile);
  };

  const vehicleOwnerOptions = useMemo(
    () => getVehicleOwnerOptions(formData),
    [formData]
  );

  const vehicleUseOptions = useMemo(
    () => getVehicleUseOptionsByOwner(formData),
    [formData]
  );

  const getNextStep = (step) => Math.min(step + 1, steps.length);
  const getPreviousStep = (step) => Math.max(step - 1, 1);

  const scrollToField = (field) => {
    const y = fieldRefs.current[field];
    if (typeof y !== 'number') return;
    scrollRef.current?.scrollTo({ y: Math.max(y - 20, 0), animated: true });
  };

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
  };

  const updateVehicleField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      vehicleInfo: {
        ...prev.vehicleInfo,
        [field]: value,
      },
    }));
    clearFieldError(`vehicle${field.charAt(0).toUpperCase()}${field.slice(1)}`);
  };

  const clearVehicleFields = () => {
    setFormData((prev) => ({
      ...prev,
      vehicleInfo: {
        hasVehiclePurchase: false,
        ownerPerson: '',
        ownershipType: '',
        mainUse: '',
        purchaseDate: '',
        purchasePrice: '',
        gstHstPaid: '',
        vin: '',
        billOfSale: null,
      },
    }));
  };

  const toggleArrayItem = (field, value) => {
    setFormData((prev) => {
      const current = Array.isArray(prev[field]) ? prev[field] : [];
      const exists = current.includes(value);

      return {
        ...prev,
        [field]: exists
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  const toggleReceiptCategory = (value) => {
    setFormData((prev) => {
      const current = prev.documentPreferences.selectedReceiptCategories;
      const exists = current.includes(value);

      return {
        ...prev,
        documentPreferences: {
          ...prev.documentPreferences,
          selectedReceiptCategories: exists
            ? current.filter((item) => item !== value)
            : [...current, value],
        },
      };
    });
  };

  const updateSpouseTaxProfile = (key) => {
    setFormData((prev) => {
      const currentlySelected = !!prev.spouseTaxProfile[key];

      if (key === 'unemployed') {
        const nextUnemployed = !currentlySelected;

        return {
          ...prev,
          spouseTaxProfile: {
            employment: false,
            gigWork: false,
            selfEmployment: false,
            incorporatedBusiness: false,
            unemployed: nextUnemployed,
          },
          spouseEmploymentStatus: nextUnemployed
            ? 'Unemployed'
            : prev.spouseEmploymentStatus,
        };
      }

      return {
        ...prev,
        spouseTaxProfile: {
          ...prev.spouseTaxProfile,
          unemployed: false,
          [key]: !currentlySelected,
        },
        spouseEmploymentStatus:
          prev.spouseTaxProfile.unemployed &&
          prev.spouseEmploymentStatus === 'Unemployed'
            ? ''
            : prev.spouseEmploymentStatus,
      };
    });
  };

  const openSelector = ({
    title,
    options,
    value,
    fieldKey,
    onSelect,
  }) => {
    setSelectorTitle(title);
    setSelectorOptions(options);
    setSelectorValue(value);
    setSelectorOnChange(() => (selected) => {
      if (fieldKey) clearFieldError(fieldKey);
      onSelect?.(selected);
    });
    setSelectorVisible(true);
  };

  const setFieldRef = (field) => (event) => {
    const y = event?.nativeEvent?.layout?.y ?? 0;
    fieldRefs.current[field] = y;
  };

  const syncFamilyAndFilingStatus = (field, value) => {
    if (field === 'taxFilingStatus') {
      updateField('taxFilingStatus', value);
      if (value === 'Single') updateField('maritalStatus', 'Single');
      if (value === 'Married' || value === 'Common-Law') {
        updateField('maritalStatus', value);
      }
    }

    if (field === 'maritalStatus') {
      updateField('maritalStatus', value);
      if (value === 'Single') updateField('taxFilingStatus', 'Single');
      if (value === 'Married' || value === 'Common-Law') {
        updateField('taxFilingStatus', value);
      }
    }
  };

  const updateTaxProfile = (key) => {
    setFormData((prev) => {
      const currentlySelected = !!prev.taxProfile[key];

      if (key === 'unemployed') {
        const nextUnemployed = !currentlySelected;

        return {
          ...prev,
          taxProfile: {
            employment: false,
            gigWork: false,
            selfEmployment: false,
            incorporatedBusiness: false,
            unemployed: nextUnemployed,
          },
          employmentStatus: nextUnemployed ? 'Unemployed' : prev.employmentStatus,
        };
      }

      return {
        ...prev,
        taxProfile: {
          ...prev.taxProfile,
          unemployed: false,
          [key]: !currentlySelected,
        },
        employmentStatus:
          prev.taxProfile.unemployed && prev.employmentStatus === 'Unemployed'
            ? ''
            : prev.employmentStatus,
      };
    });
  };

  const renderStepHeader = (title, subtitle) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {!!subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    fieldKey,
    editable = true,
    multiline = false,
    keyboardType,
    autoCapitalize,
    autoCorrect = false,
  }) => (
    <View style={styles.field} onLayout={fieldKey ? setFieldRef(fieldKey) : undefined}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={(text) => {
          if (fieldKey) clearFieldError(fieldKey);
          onChangeText?.(text);
        }}
        placeholder={placeholder}
        editable={editable}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        style={[
          styles.input,
          multiline && styles.textArea,
          !editable && styles.inputDisabled,
          !!error && styles.inputError,
        ]}
        placeholderTextColor={colors.gray[400]}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  const renderPasswordInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    onToggleVisibility,
    error,
    fieldKey,
  }) => (
    <View style={styles.field} onLayout={fieldKey ? setFieldRef(fieldKey) : undefined}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.passwordWrap, !!error && styles.inputError]}>
        <TextInput
          value={value}
          onChangeText={(text) => {
            if (fieldKey) clearFieldError(fieldKey);
            onChangeText?.(text);
          }}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.passwordInput}
          placeholderTextColor={colors.gray[400]}
        />
        <TouchableOpacity style={styles.eyeButton} onPress={onToggleVisibility}>
          <Icon
            name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  const renderPicker = ({
    label,
    value,
    onValueChange,
    options,
    placeholder,
    error,
    fieldKey,
  }) => (
    <View style={styles.field} onLayout={fieldKey ? setFieldRef(fieldKey) : undefined}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.pickerWrap, !!error && styles.inputError]}
        onPress={() =>
          openSelector({
            title: label || placeholder || 'Select',
            options,
            value,
            fieldKey,
            onSelect: (selected) => onValueChange?.(selected),
          })
        }
      >
        <Text style={[styles.dateText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  const renderDateField = ({ label, value, onPress, error, fieldKey }) => (
    <View style={styles.field} onLayout={fieldKey ? setFieldRef(fieldKey) : undefined}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.dateInput, !!error && styles.inputError]}
        onPress={() => {
          if (fieldKey) clearFieldError(fieldKey);
          onPress?.();
        }}
      >
        <Text style={[styles.dateText, !value && styles.placeholderText]}>
          {value || `Select ${label?.toLowerCase()}`}
        </Text>
        <Icon name="calendar-month-outline" size={18} color={colors.textSecondary} />
      </TouchableOpacity>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  const renderTaxCard = (item, selected, onPress, disabled = false) => (
    <TouchableOpacity
      key={item.key}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.choiceChip,
        selected && styles.choiceChipActive,
        { width: '48%', opacity: disabled ? 0.5 : 1 },
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon
          name={item.icon}
          size={18}
          color={selected ? colors.white : colors.primaryScale[500]}
        />
        <View style={{ flex: 1 }}>
          <Text style={[styles.choiceChipText, selected && styles.choiceChipTextActive]}>
            {item.label}
          </Text>
          {!!item.description && (
            <Text
              style={[
                { fontSize: 12, color: selected ? colors.white : colors.textSecondary },
              ]}
            >
              {item.description}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleVehicleUpload = async () => {
    Alert.alert(
      'Upload not configured',
      'Hook up your document picker here to attach the vehicle bill of sale.'
    );
  };

  const validateStep = (step) => {
    const nextErrors = {};
    const needsSpouse =
      formData.maritalStatus === 'Married' ||
      formData.maritalStatus === 'Common-Law';

    if (step === 1) {
      if (!formData.firstName.trim()) nextErrors.firstName = 'First name is required.';
      if (!formData.lastName.trim()) nextErrors.lastName = 'Last name is required.';
      if (!isValidEmail(formData.email)) nextErrors.email = 'Enter a valid email address.';

      if (formData.phone.replace(/\D/g, '').length !== 10) {
        nextErrors.phone = 'Enter a valid phone number.';
      }

      if (formData.password.length < 8) {
        nextErrors.password = 'Password must be at least 8 characters.';
      }

      if (formData.password !== formData.confirmPassword) {
        nextErrors.confirmPassword = 'Passwords do not match.';
      }
    }

    if (step === 2) {
      if (!formData.dateOfBirth) {
        nextErrors.dateOfBirth = 'Date of birth is required.';
      }

      if (formData.dateOfBirth && calculateAge(formData.dateOfBirth) < 18) {
        nextErrors.dateOfBirth = 'You must be at least 18 years old.';
      }

      if (!formData.addressData?.formattedAddress) {
        nextErrors.address = 'Please select a valid address';
      }

      if (!formData.maritalStatus) {
        nextErrors.maritalStatus = 'Family status is required.';
      }

      if (needsSpouse) {
        if (!formData.spouseName.trim()) {
          nextErrors.spouseName = 'Spouse name is required.';
        }

        if (!formData.spouseDob) {
          nextErrors.spouseDob = 'Spouse date of birth is required.';
        }
      }
    }

    if (step === 3) {
      if (!formData.employmentStatus) {
        nextErrors.employmentStatus = 'Employment status is required.';
      }

      if (!formData.taxFilingStatus) {
        nextErrors.taxFilingStatus = 'Tax filing status is required.';
      }

      if (!Object.values(formData.taxProfile).some(Boolean)) {
        nextErrors.taxProfile = 'Select at least one tax profile option.';
      }

      if (needsSpouse) {
        if (!Object.values(formData.spouseTaxProfile).some(Boolean)) {
          nextErrors.spouseTaxProfile = 'Select at least one spouse tax profile option.';
        }

        if (!formData.spouseEmploymentStatus) {
          nextErrors.spouseEmploymentStatus = 'Spouse employment status is required.';
        }
      }
    }

    if (step === 4) {
      if (hasEmployment && !formData.employerName.trim()) {
        nextErrors.employerName = 'Employer name is required.';
      }

      if (hasGigWork && !formData.averageWeeklyKm.trim()) {
        nextErrors.averageWeeklyKm = 'Average weekly KM is required.';
      }

      if (hasSelfEmployment && !formData.contractType.trim()) {
        nextErrors.contractType = 'Contract type / service is required.';
      }

      if (hasBusiness) {
        if (!formData.businessName.trim()) {
          nextErrors.businessName = 'Business name is required.';
        }

        if (!formData.businessType) {
          nextErrors.businessType = 'Business type is required.';
        }

        if (!formData.businessNumber.trim()) {
          nextErrors.businessNumber = 'Business number is required.';
        }
      }
    }

    if (step === 5 && formData.vehicleInfo.hasVehiclePurchase) {
      if (!formData.vehicleInfo.ownerPerson) {
        nextErrors.vehicleOwnerPerson = 'Select who bought the vehicle.';
      }

      if (!formData.vehicleInfo.ownershipType) {
        nextErrors.vehicleOwnershipType = 'Select the ownership type.';
      }

      if (!formData.vehicleInfo.mainUse) {
        nextErrors.vehicleMainUse = 'Select the main vehicle use.';
      }

      if (!formData.vehicleInfo.purchaseDate) {
        nextErrors.vehiclePurchaseDate = 'Purchase date is required.';
      }

      if (!formData.vehicleInfo.purchasePrice) {
        nextErrors.vehiclePurchasePrice = 'Purchase price is required.';
      }

      if (!formData.vehicleInfo.gstHstPaid) {
        nextErrors.vehicleGstHstPaid = 'GST / HST amount is required.';
      }
    }

    if (step === 6) {
      if (!formData.agreeToTerms) {
        nextErrors.agreeToTerms = 'You must agree to the terms.';
      }

      if (!formData.agreeToPrivacy) {
        nextErrors.agreeToPrivacy = 'You must agree to the privacy policy.';
      }

      if (!formData.confirmAccuracy) {
        nextErrors.confirmAccuracy = 'Please confirm your information is accurate.';
      }
    }

    setFieldErrors(nextErrors);

    const firstField = Object.keys(nextErrors)[0];
    if (firstField) scrollToField(firstField);

    return Object.keys(nextErrors).length === 0;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
        <View style={styles.heroCard}>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Step {currentStep} of {visibleSteps[visibleSteps.length - 1].number}
          </Text>
        </View>

        <ProgressSteps
          steps={visibleSteps}
          currentStep={currentStep}
          styles={styles}
          colors={colors}
        />
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {currentStep === 1 && (
          <AccountStep
            styles={styles}
            colors={colors}
            formData={formData}
            fieldErrors={fieldErrors}
            updateField={updateField}
            renderInput={renderInput}
            renderPasswordInput={renderPasswordInput}
            renderStepHeader={renderStepHeader}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            setShowPassword={setShowPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            formatPhoneNumber={formatPhoneNumber}
          />
        )}

        {currentStep === 2 && (
          <PersonalStep
            styles={styles}
            colors={colors}
            formData={formData}
            updateField={updateField}
            clearFieldError={clearFieldError}
            fieldErrors={fieldErrors}
            renderStepHeader={renderStepHeader}
            renderDateField={renderDateField}
            renderInput={renderInput}
            renderPicker={renderPicker}
            showDobPicker={showDobPicker}
            setShowDobPicker={setShowDobPicker}
            showSpouseDobPicker={showSpouseDobPicker}
            setShowSpouseDobPicker={setShowSpouseDobPicker}
            formatDate={formatDate}
            formatPhoneNumber={formatPhoneNumber}
            setFieldRef={setFieldRef}
            setFormData={setFormData}
            scrollToField={scrollToField}
            taxFilingStatuses={taxFilingStatuses}
            syncFamilyAndFilingStatus={syncFamilyAndFilingStatus}
            dependentOptions={dependentOptions}
            GOOGLE_PLACES_API_KEY={GOOGLE_PLACES_API_KEY}
          />
        )}

        {currentStep === 3 && (
          <TaxStep
            styles={styles}
            formData={formData}
            updateField={updateField}
            updateTaxProfile={updateTaxProfile}
            updateSpouseTaxProfile={updateSpouseTaxProfile}
            syncFamilyAndFilingStatus={syncFamilyAndFilingStatus}
            fieldErrors={fieldErrors}
            clearFieldError={clearFieldError}
            renderStepHeader={renderStepHeader}
            renderTaxCard={renderTaxCard}
            renderPicker={renderPicker}
            profileOptions={profileOptions}
            employmentStatuses={employmentStatuses}
            spouseEmploymentStatuses={spouseEmploymentStatuses}
            taxFilingStatuses={taxFilingStatuses}
            setFieldRef={setFieldRef}
            setFormData={setFormData}
          />
        )}

        {currentStep === 4 && (
          <IncomeStep
            styles={styles}
            formData={formData}
            updateField={updateField}
            toggleArrayItem={toggleArrayItem}
            fieldErrors={fieldErrors}
            clearFieldError={clearFieldError}
            renderInput={renderInput}
            renderPicker={renderPicker}
            renderStepHeader={renderStepHeader}
            hasEmployment={hasEmployment}
            hasGigWork={hasGigWork}
            hasSelfEmployment={hasSelfEmployment}
            hasBusiness={hasBusiness}
            businessTypes={businessTypes}
            platforms={platforms}
            setFieldRef={setFieldRef}
          />
        )}

        {currentStep === 5 && (
          <DeductionsStep
            styles={styles}
            formData={formData}
            updateField={updateField}
            toggleReceiptCategory={toggleReceiptCategory}
            fieldErrors={fieldErrors}
            clearFieldError={clearFieldError}
            renderStepHeader={renderStepHeader}
            receiptOptions={receiptOptions}
            setFieldRef={setFieldRef}
            renderPicker={renderPicker}
            renderDateField={renderDateField}
            renderInput={renderInput}
            updateVehicleField={updateVehicleField}
            clearVehicleFields={clearVehicleFields}
            vehicleOwnerOptions={vehicleOwnerOptions}
            vehicleUseOptions={vehicleUseOptions}
            vehicleOwnershipOptions={vehicleOwnershipOptions}
            showVehiclePurchaseDatePicker={showVehiclePurchaseDatePicker}
            setShowVehiclePurchaseDatePicker={setShowVehiclePurchaseDatePicker}
            formatDate={formatDate}
            handleVehicleUpload={handleVehicleUpload}
          />
        )}

        {currentStep === 6 && (
          <ReviewStep
            styles={styles}
            formData={formData}
            updateField={updateField}
            renderStepHeader={renderStepHeader}
            fieldErrors={fieldErrors}
            setFieldRef={setFieldRef}
          />
        )}

        <SelectorModal
          visible={selectorVisible}
          title={selectorTitle}
          options={selectorOptions}
          value={selectorValue}
          onClose={() => setSelectorVisible(false)}
          onSelect={(selected) => {
            selectorOnChange?.(selected);
            setSelectorVisible(false);
          }}
          styles={styles}
        />
      </ScrollView>

      <NavButtons
        currentStep={currentStep}
        loading={loading}
        stepsLength={steps.length}
        renderNavButton={({ label, onPress, variant = 'primary', disabled }) => (
          <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={[
              styles.localNavButton,
              styles.navButtonHalf,
              variant === 'primary'
                ? styles.localNavButtonPrimary
                : styles.localNavButtonOutline,
              disabled && styles.localNavButtonDisabled,
            ]}
          >
            <Text
              style={[
                styles.localNavButtonText,
                variant === 'primary'
                  ? styles.localNavButtonTextPrimary
                  : styles.localNavButtonTextOutline,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        )}
        handlePrevious={() => setCurrentStep((prev) => getPreviousStep(prev))}
        handleNext={() => {
          if (validateStep(currentStep)) {
            setCurrentStep((prev) => getNextStep(prev));
          }
        }}
        handleSubmit={async () => {
          if (!validateStep(6)) return;

          try {
            setLoading(true);
            await register(formData);

            Alert.alert('Success', 'Your account has been created successfully.', [
              {
                text: 'OK',
                onPress: () => navigation.navigate('Login'),
              },
            ]);
          } catch (error) {
            Alert.alert(
              'Registration Failed',
              error?.message || 'Something went wrong while creating your account.'
            );
          } finally {
            setLoading(false);
          }
        }}
        styles={styles}
      />
    </SafeAreaView>
  );
};

export default RegisterScreen;