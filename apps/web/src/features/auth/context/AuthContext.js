import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const normalizeTaxProfile = (user) => {
  const raw = user?.taxProfile || user?.profile?.taxProfile || {};

  return {
    employment: !!raw.employment,
    gigWork: !!raw.gigWork,
    selfEmployment: !!raw.selfEmployment,
    incorporatedBusiness: !!raw.incorporatedBusiness,

    spouse: !!raw.spouse,
    tfsa: !!raw.tfsa,
    rrsp: !!raw.rrsp,
    fhsa: !!raw.fhsa,
    ccb: !!raw.ccb,
    investments: !!raw.investments,
    donations: !!raw.donations,
    workFromHome: !!raw.workFromHome,
  };
};

const getPrimaryUserType = (taxProfile) => {
  if (taxProfile?.incorporatedBusiness) return 'business_owner';
  if (taxProfile?.gigWork) return 'gig-worker';
  if (taxProfile?.selfEmployment) return 'self-employed';
  return 'employee';
};

const normalizeSpouseData = (spouse) => {
  if (!spouse) return null;

  return {
    ...spouse,
    incomeSources: spouse.incomeSources || [],
    taxProfile: {
      employment: !!spouse?.taxProfile?.employment,
      gigWork: !!spouse?.taxProfile?.gigWork,
      selfEmployment: !!spouse?.taxProfile?.selfEmployment,
      incorporatedBusiness: !!spouse?.taxProfile?.incorporatedBusiness,
      spouse: !!spouse?.taxProfile?.spouse,
      tfsa: !!spouse?.taxProfile?.tfsa,
      rrsp: !!spouse?.taxProfile?.rrsp,
      fhsa: !!spouse?.taxProfile?.fhsa,
      ccb: !!spouse?.taxProfile?.ccb,
      investments: !!spouse?.taxProfile?.investments,
      donations: !!spouse?.taxProfile?.donations,
      workFromHome: !!spouse?.taxProfile?.workFromHome,
    },
    businessInfo: spouse?.businessInfo || {},
  };
};

const normalizeDocumentPreferences = (rawUser) => {
  const source =
    rawUser?.documentPreferences ||
    rawUser?.onboarding ||
    rawUser?.profile?.documentPreferences ||
    {};

  return {
    knowsSlipTypes:
      source.knowsSlipTypes !== undefined ? !!source.knowsSlipTypes : true,
    needsSuggestions: !!source.needsSuggestions,
    skippedAtRegistration: !!source.skippedAtRegistration,
    selectedSlips: Array.isArray(source.selectedSlips) ? source.selectedSlips : [],
    selectedReceiptCategories: Array.isArray(source.selectedReceiptCategories)
      ? source.selectedReceiptCategories
      : [],
  };
};

const deriveIncomeSources = (rawUser, taxProfile) => {
  if (Array.isArray(rawUser?.incomeSources) && rawUser.incomeSources.length > 0) {
    return rawUser.incomeSources;
  }

  const sources = [];
  if (taxProfile.employment) sources.push('employment');
  if (taxProfile.gigWork) sources.push('gig_work');
  if (taxProfile.selfEmployment) sources.push('self_employed');
  if (taxProfile.incorporatedBusiness) sources.push('business');
  return sources;
};

const buildChecklistSuggestions = (
  taxProfile,
  profile = {},
  documentPreferences = {}
) => {
  const suggestedSlips = new Set(documentPreferences.selectedSlips || []);
  const suggestedReceipts = new Set(
    documentPreferences.selectedReceiptCategories || []
  );

  if (taxProfile.employment) {
    suggestedSlips.add('T4');
    if (profile.workFromHome || taxProfile.workFromHome) {
      suggestedSlips.add('HOME_OFFICE');
    }
  }

  if (taxProfile.gigWork) {
    suggestedSlips.add('T4A');
    suggestedReceipts.add('fuel');
    suggestedReceipts.add('maintenance');
    suggestedReceipts.add('parking_tolls');
    suggestedReceipts.add('mobile_internet');
    suggestedReceipts.add('vehicle_expenses');
    suggestedReceipts.add('insurance');
  }

  if (taxProfile.selfEmployment) {
    suggestedSlips.add('T4A');
    suggestedReceipts.add('mobile_internet');
    suggestedReceipts.add('supplies');
    suggestedReceipts.add('equipment');
    suggestedReceipts.add('professional_fees');
    suggestedReceipts.add('home_office');
  }

  if (taxProfile.incorporatedBusiness) {
    suggestedSlips.add('BUSINESS_RECORDS');
    suggestedSlips.add('GST_HST');
    suggestedSlips.add('PAYROLL');
    suggestedSlips.add('INVENTORY');
    suggestedReceipts.add('rent_utilities');
    suggestedReceipts.add('payroll_expenses');
    suggestedReceipts.add('inventory_purchases');
    suggestedReceipts.add('insurance');
    suggestedReceipts.add('supplies');
    suggestedReceipts.add('equipment');
    suggestedReceipts.add('professional_fees');
  }

  if (profile.hasInvestments || taxProfile.investments) suggestedSlips.add('T5');
  if (profile.hasT3) suggestedSlips.add('T3');
  if (profile.hasT5008) suggestedSlips.add('T5008');
  if (profile.hasRRSP || taxProfile.rrsp) suggestedSlips.add('RRSP');
  if (profile.hasFHSA || taxProfile.fhsa) suggestedSlips.add('FHSA');
  if (profile.hasTFSA || taxProfile.tfsa) suggestedSlips.add('TFSA');
  if (profile.hasTuition) suggestedSlips.add('TUITION');
  if (profile.hasMedicalExpenses) suggestedSlips.add('MEDICAL');
  if (profile.hasCharitableDonations || taxProfile.donations) {
    suggestedSlips.add('DONATIONS');
  }
  if (profile.hasChildCareExpenses) suggestedSlips.add('CHILD_CARE');
  if (profile.hasMovingExpenses) suggestedSlips.add('MOVING');
  if (profile.hasRentalIncome) suggestedSlips.add('RENTAL');
  if (profile.hasForeignIncome) suggestedSlips.add('FOREIGN');
  if (profile.hasCrypto) suggestedSlips.add('CRYPTO');
  if (profile.hasHomeOffice || taxProfile.workFromHome) {
    suggestedReceipts.add('home_office');
  }
  if (profile.hasVehicleExpenses) suggestedReceipts.add('vehicle_expenses');

  return {
    suggestedSlips: Array.from(suggestedSlips),
    suggestedReceiptCategories: Array.from(suggestedReceipts),
  };
};

const buildUserData = (rawUser) => {
  const taxProfile = normalizeTaxProfile(rawUser);
  const spouseRaw =
    rawUser?.spouse || rawUser?.spouseProfile || rawUser?.spouseInfo || null;
  const normalizedSpouse = normalizeSpouseData(spouseRaw);

  const profile = rawUser.profile || {};
  const documentPreferences = normalizeDocumentPreferences(rawUser);
  const incomeSources = deriveIncomeSources(rawUser, taxProfile);

  const vehiclePurchase =
    profile.vehiclePurchase ||
    rawUser.vehiclePurchase || {
      ownershipType: '',
      use: '',
      purchaseDate: '',
      purchasePrice: '',
      gst: '',
      vin: '',
      wantsBillOfSaleUpload: false,
      uploaded: false,
    };

  const onboarding = {
    ...documentPreferences,
    ...buildChecklistSuggestions(taxProfile, profile, documentPreferences),
  };

  return {
    id: rawUser.id || rawUser._id,
    name: rawUser.name,
    email: rawUser.email,
    role: rawUser.role || 'user',
    userType: rawUser.userType || getPrimaryUserType(taxProfile),
    incomeSources,
    taxProfile,
    phone: rawUser.phone || rawUser.phoneNumber || '',
    address: rawUser.address || '',
    city: rawUser.city || '',
    province: rawUser.province || '',
    postalCode: rawUser.postalCode || '',
    country: rawUser.country || 'Canada',
    assignedCAId: rawUser.assignedCAId || rawUser.caId || null,
    assignedCA: rawUser.assignedCA || null,
    hasSpouse: !!rawUser.hasSpouse,
    isMarried: !!rawUser.isMarried,
    maritalStatus: rawUser.maritalStatus || (rawUser.hasSpouse ? 'married' : ''),
    spouse: normalizedSpouse,
    spouseProfile: normalizedSpouse,
    spouseInfo: normalizedSpouse,
    dependents: rawUser.dependents || [],
    profile,
    vehiclePurchase,
    documentPreferences,
    onboarding,
    clientId:
      rawUser.clientId ||
      `TV-${String(rawUser.id || rawUser._id || '0001').toUpperCase()}`,
    memberSince: rawUser.memberSince || new Date().getFullYear().toString(),
    businessInfo: rawUser.businessInfo || {},
    householdProfile: rawUser.householdProfile || null,
    householdIncomeSources: rawUser.householdIncomeSources || [],
    ...(rawUser.businessName && { businessName: rawUser.businessName }),
    ...(rawUser.firmName && { firmName: rawUser.firmName }),
    ...(rawUser.caNumber && { caNumber: rawUser.caNumber }),
  };
};

const persistUser = (rawUser, setUser) => {
  const userData = buildUserData(rawUser);
  setUser(userData);
  localStorage.setItem('user', JSON.stringify(userData));
  return userData;
};

// Demo users
const DEMO_USERS = {
  'user@demo.com': {
    id: 'demo-user-1',
    name: 'John Doe',
    email: 'user@demo.com',
    role: 'user',
    userType: 'employee',
    password: 'demo1234',
    incomeSources: ['employment'],
    taxProfile: {
      employment: true,
      gigWork: false,
      selfEmployment: false,
      incorporatedBusiness: false,
      spouse: false,
      rrsp: true,
      donations: true,
    },
    documentPreferences: {
      knowsSlipTypes: true,
      needsSuggestions: false,
      skippedAtRegistration: false,
      selectedSlips: ['T4', 'RRSP', 'DONATIONS'],
      selectedReceiptCategories: ['medical', 'donations'],
    },
    hasSpouse: false,
    isMarried: false,
    maritalStatus: 'single',
    clientId: 'TV-DEMO-USER-1',
  },
  'ca@demo.com': {
    id: 'demo-ca-1',
    name: 'Jane Smith, CA',
    email: 'ca@demo.com',
    role: 'ca',
    userType: 'professional',
    password: 'demo1234',
    firmName: 'Smith & Associates',
    caNumber: '123456',
    clientId: 'TV-DEMO-CA-1',
  },
  'Business@demo.com': {
    id: 'demo-business-1',
    name: 'Mike Wilson',
    email: 'Business@demo.com',
    role: 'business_owner',
    userType: 'business_owner',
    password: 'demo1234',
    incomeSources: ['self_employed', 'business'],
    businessName: 'Wilson Retail',
    businessInfo: {
      businessName: 'Wilson Retail',
      businessType: 'Sole Proprietor',
      gstRegistered: false,
      hasEmployees: false,
      hasInventory: true,
    },
    taxProfile: {
      employment: false,
      gigWork: false,
      selfEmployment: true,
      incorporatedBusiness: true,
      spouse: false,
    },
    documentPreferences: {
      knowsSlipTypes: false,
      needsSuggestions: true,
      skippedAtRegistration: false,
      selectedSlips: [],
      selectedReceiptCategories: [],
    },
    hasSpouse: false,
    isMarried: false,
    maritalStatus: 'single',
    clientId: 'TV-DEMO-BUSINESS-1',
  },
  'gig@test.com': {
    id: 'test-gig-1',
    name: 'Sarah Johnson',
    email: 'gig@test.com',
    role: 'user',
    userType: 'gig-worker',
    password: 'password123',
    incomeSources: ['gig_work'],
    taxProfile: {
      employment: false,
      gigWork: true,
      selfEmployment: false,
      incorporatedBusiness: false,
      spouse: false,
    },
    documentPreferences: {
      knowsSlipTypes: false,
      needsSuggestions: true,
      skippedAtRegistration: false,
      selectedSlips: [],
      selectedReceiptCategories: [],
    },
    hasSpouse: false,
    isMarried: false,
    maritalStatus: 'single',
    clientId: 'TV-GIG-1001',
  },
  'employee@test.com': {
    id: 'test-emp-1',
    name: 'Tom Brown',
    email: 'employee@test.com',
    role: 'user',
    userType: 'employee',
    password: 'password123',
    incomeSources: ['employment'],
    taxProfile: {
      employment: true,
      gigWork: false,
      selfEmployment: false,
      incorporatedBusiness: false,
      spouse: false,
      workFromHome: true,
    },
    documentPreferences: {
      knowsSlipTypes: true,
      needsSuggestions: false,
      skippedAtRegistration: false,
      selectedSlips: ['T4'],
      selectedReceiptCategories: ['home_office'],
    },
    hasSpouse: false,
    isMarried: false,
    maritalStatus: 'single',
    clientId: 'TV-EMP-1001',
  },
  'mixed@test.com': {
    id: 'test-mixed-1',
    name: 'Alex Martin',
    email: 'mixed@test.com',
    role: 'business_owner',
    userType: 'business_owner',
    password: 'password123',
    incomeSources: ['employment', 'gig_work', 'self_employed', 'business'],
    assignedCAId: 'demo-ca-1',
    assignedCA: {
      id: 'demo-ca-1',
      name: 'Jane Smith, CA',
      firmName: 'Smith & Associates',
    },
    taxProfile: {
      employment: true,
      gigWork: true,
      selfEmployment: true,
      incorporatedBusiness: true,
      spouse: false,
      rrsp: true,
      investments: true,
    },
    hasSpouse: false,
    isMarried: false,
    maritalStatus: 'single',
    businessName: 'Martin Consulting Inc.',
    businessInfo: {
      businessName: 'Martin Consulting Inc.',
      businessType: 'Corporation',
      gstRegistered: true,
      hasEmployees: true,
      hasInventory: false,
    },
    documentPreferences: {
      knowsSlipTypes: true,
      needsSuggestions: false,
      skippedAtRegistration: false,
      selectedSlips: ['T4', 'T4A', 'RRSP', 'T5', 'BUSINESS_RECORDS', 'GST_HST'],
      selectedReceiptCategories: [
        'fuel',
        'maintenance',
        'mobile_internet',
        'supplies',
        'equipment',
        'professional_fees',
      ],
    },
    clientId: 'TV-MIXED-1001',
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isDemoMode = true;

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(buildUserData(parsedUser));
          return;
        }

        if (token) {
          const response = await authAPI.getMe();
          const backendUser = response?.data?.user;

          if (backendUser) {
            persistUser(backendUser, setUser);
            return;
          }
        }

        setUser(null);
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password, role = 'user') => {
    const demoUser = DEMO_USERS[email];

    if (demoUser && demoUser.password === password) {
      if (role === 'ca' && demoUser.role !== 'ca') {
        toast.error('This account is not a CA account');
        return { success: false, error: 'Invalid account type' };
      }

      if (role === 'user' && !['user', 'business_owner'].includes(demoUser.role)) {
        toast.error('This account is not a user account');
        return { success: false, error: 'Invalid account type' };
      }

      const userData = persistUser(demoUser, setUser);
      toast.success(`Welcome back, ${userData.name}!`);
      return { success: true, user: userData };
    }

    try {
      const response = await authAPI.login({ email, password });
      const token = response?.data?.token;
      const rawUser = response?.data?.user;

      if (!token || !rawUser) {
        toast.error('Invalid login response');
        return { success: false, error: 'Invalid login response' };
      }

      if (role === 'ca' && rawUser.role !== 'ca') {
        toast.error('This account is not a CA account');
        return { success: false, error: 'Invalid account type' };
      }

      if (role === 'user' && !['user', 'business_owner'].includes(rawUser.role)) {
        toast.error('This account is not a user account');
        return { success: false, error: 'Invalid account type' };
      }

      localStorage.setItem('token', token);
      const userData = persistUser(rawUser, setUser);

      toast.success(`Welcome back, ${userData.name}!`);
      return { success: true, user: userData };
    } catch (error) {
      toast.error('Invalid email or password');
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const demoLogin = async (userType) => {
    try {
      const emailMap = {
        user: 'user@demo.com',
        ca: 'ca@demo.com',
        Business: 'Business@demo.com',
        'Business-owner': 'Business@demo.com',
        business: 'Business@demo.com',
        business_owner: 'Business@demo.com',
        gig: 'gig@test.com',
        'gig-worker': 'gig@test.com',
        employee: 'employee@test.com',
        mixed: 'mixed@test.com',
      };

      const email = emailMap[userType];
      if (!email) {
        toast.error('Invalid demo user type');
        return { success: false, error: 'Invalid demo user type' };
      }

      const demoUser = DEMO_USERS[email];
      const userData = persistUser(demoUser, setUser);

      toast.success(`Logged in as ${userData.name}`);
      return { success: true, user: userData };
    } catch (error) {
      toast.error('Demo login failed');
      return { success: false, error: error.message };
    }
  };

  const loginDemoUser = (demoUser) => {
    const userData = persistUser(demoUser, setUser);
    toast.success(`Logged in as ${userData.name}`);
    return { success: true, user: userData };
  };

  const verifyMfa = async () => {
    toast.error('MFA not available in demo mode');
    return { success: false };
  };

  const register = async (userData, token = null) => {
    try {
      if (token) {
        localStorage.setItem('token', token);
        const builtUser = persistUser(userData, setUser);
        toast.success('Registration successful!');
        return { success: true, user: builtUser };
      }

      const data = await authAPI.register(userData);

      const responseToken = data?.token;
      const rawUser = data?.user || data?.data?.user || data?.data;

      if (!rawUser) {
        throw new Error(data?.message || 'Invalid registration response');
      }

      if (userData?.role === 'ca' && rawUser?.role !== 'ca') {
        throw new Error('CA registration failed - backend returned non-CA role');
      }

      if (userData?.role === 'user' && rawUser?.role !== 'user') {
        throw new Error('User registration failed - backend returned invalid role');
      }

      if (responseToken) {
        localStorage.setItem('token', responseToken);
      }

      const builtUser = persistUser(rawUser, setUser);

      toast.success('Registration successful!');
      return { success: true, user: builtUser };
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Registration failed';

      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const updateUserType = (newUserType) => {
    setUser((prev) => {
      if (!prev) return prev;

      const updated = {
        ...prev,
        userType: newUserType,
      };

      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });

    toast.success(`User type updated to ${newUserType}`);
  };

  const updateTaxProfile = (nextTaxProfile) => {
    setUser((prev) => {
      if (!prev) return prev;

      const updatedTaxProfile = {
        employment: !!nextTaxProfile.employment,
        gigWork: !!nextTaxProfile.gigWork,
        selfEmployment: !!nextTaxProfile.selfEmployment,
        incorporatedBusiness: !!nextTaxProfile.incorporatedBusiness,
        spouse: !!nextTaxProfile.spouse,
        tfsa: !!nextTaxProfile.tfsa,
        rrsp: !!nextTaxProfile.rrsp,
        fhsa: !!nextTaxProfile.fhsa,
        ccb: !!nextTaxProfile.ccb,
        investments: !!nextTaxProfile.investments,
        donations: !!nextTaxProfile.donations,
        workFromHome: !!nextTaxProfile.workFromHome,
      };

      const nextDocumentPreferences =
        prev.documentPreferences || {
          knowsSlipTypes: true,
          needsSuggestions: false,
          skippedAtRegistration: false,
          selectedSlips: [],
          selectedReceiptCategories: [],
        };

      const onboarding = buildChecklistSuggestions(
        updatedTaxProfile,
        prev.profile || {},
        nextDocumentPreferences
      );

      const updated = {
        ...prev,
        taxProfile: updatedTaxProfile,
        userType: getPrimaryUserType(updatedTaxProfile),
        onboarding: {
          ...nextDocumentPreferences,
          ...onboarding,
        },
      };

      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });

    toast.success('Tax profiles updated');
  };

  const updateDocumentPreferences = (nextPreferences) => {
    setUser((prev) => {
      if (!prev) return prev;

      const normalized = {
        knowsSlipTypes:
          nextPreferences?.knowsSlipTypes !== undefined
            ? !!nextPreferences.knowsSlipTypes
            : true,
        needsSuggestions: !!nextPreferences?.needsSuggestions,
        skippedAtRegistration: !!nextPreferences?.skippedAtRegistration,
        selectedSlips: Array.isArray(nextPreferences?.selectedSlips)
          ? nextPreferences.selectedSlips
          : [],
        selectedReceiptCategories: Array.isArray(
          nextPreferences?.selectedReceiptCategories
        )
          ? nextPreferences.selectedReceiptCategories
          : [],
      };

      const onboarding = buildChecklistSuggestions(
        prev.taxProfile || {},
        prev.profile || {},
        normalized
      );

      const updated = {
        ...prev,
        documentPreferences: normalized,
        onboarding: {
          ...normalized,
          ...onboarding,
        },
      };

      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });

    toast.success('Document preferences updated');
  };

  const value = {
    user,
    loading,
    login,
    demoLogin,
    loginDemoUser,
    verifyMfa,
    register,
    logout,
    updateUserType,
    updateTaxProfile,
    updateDocumentPreferences,
    isAuthenticated: !!user,
    isCA: user?.role === 'ca',
    isAdmin: user?.role === 'admin',
    isGigWorker: !!user?.taxProfile?.gigWork,
    isSelfEmployed: !!user?.taxProfile?.selfEmployment,
    isBusinessOwner:
      user?.role === 'business_owner' || !!user?.taxProfile?.incorporatedBusiness,
    isEmployee: !!user?.taxProfile?.employment,
    isDemoMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};