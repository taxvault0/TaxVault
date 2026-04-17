import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { authAPI } from '@/services/api';
import { demoUsers } from '@/features/auth/utils/loginScenarios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const STORAGE_KEY = 'taxvault_user';
const TOKEN_KEY = 'token';

const BUILT_IN_CA_DEMO = {
  id: 'ca-demo-001',
  title: 'CA Demo Account',
  email: 'ca@demo.com',
  password: 'demo1234',
  role: 'ca',
  profile: {
    name: 'Gaurav Bhardwaj',
    firstName: 'Gaurav',
    lastName: 'Bhardwaj',
    phoneNumber: '',
    province: 'ON',
    city: '',
    userType: 'professional',
    firmName: 'TaxVault Advisory',
    caNumber: 'CA-2026-001',
    specialization: 'Personal Tax, Self-Employed, Small Business',
    yearsOfExperience: '8 years',
    taxProfile: {},
    maritalStatus: 'Single',
    dependents: [],
  },
};

const normalizeTaxProfile = (user = {}) => {
  const raw =
    user.taxProfile ||
    user.profile?.taxProfile ||
    user.onboarding?.taxProfile ||
    {};

  const spouseTaxProfile =
    raw.spouseTaxProfile ||
    user.spouseInfo?.taxProfile ||
    user.profile?.spouseInfo?.taxProfile ||
    {};

  return {
    employment: !!raw.employment,
    gigWork: !!raw.gigWork,
    selfEmployment: !!raw.selfEmployment,
    incorporatedBusiness: !!raw.incorporatedBusiness,
    spouse: !!raw.spouse || !!user.spouseInfo,
    tfsa: !!raw.tfsa,
    rrsp: !!raw.rrsp,
    fhsa: !!raw.fhsa,
    ccb: !!raw.ccb,
    investments: !!raw.investments,
    donations: !!raw.donations,
    spouseIncomeSources: Array.isArray(raw.spouseIncomeSources)
      ? raw.spouseIncomeSources
      : [],
    spouseTaxProfile: {
      employment: !!spouseTaxProfile.employment,
      gigWork: !!spouseTaxProfile.gigWork,
      selfEmployment: !!spouseTaxProfile.selfEmployment,
      incorporatedBusiness: !!spouseTaxProfile.incorporatedBusiness,
    },
  };
};

const getPrimaryUserType = (taxProfile = {}) => {
  if (taxProfile.incorporatedBusiness) return 'business_owner';
  if (taxProfile.gigWork) return 'gig-worker';
  if (taxProfile.selfEmployment) return 'self-employed';
  if (taxProfile.employment) return 'employee';
  return 'unemployed';
};

const getIncomeSourcesFromTaxProfile = (taxProfile = {}) => {
  const sources = [];
  if (taxProfile.employment) sources.push('employment');
  if (taxProfile.gigWork || taxProfile.selfEmployment) sources.push('gig-work');
  if (taxProfile.incorporatedBusiness) sources.push('business');
  return sources;
};

const buildDisplayName = (rawUser = {}) => {
  if (rawUser.name?.trim()) return rawUser.name.trim();

  const first = String(rawUser.firstName || '').trim();
  const last = String(rawUser.lastName || '').trim();
  return `${first} ${last}`.trim();
};

const buildUser = (rawUser = {}) => {
  const taxProfile = normalizeTaxProfile(rawUser);
  const resolvedName = buildDisplayName(rawUser);

  return {
    id: rawUser._id || rawUser.id || `user-${Date.now()}`,
    name: resolvedName,
    firstName: rawUser.firstName || '',
    lastName: rawUser.lastName || '',
    email: rawUser.email || '',
    phoneNumber: rawUser.phoneNumber || rawUser.phone || '',
    province: rawUser.province || rawUser.address?.province || '',
    city: rawUser.city || rawUser.address?.city || '',
    role: rawUser.role || 'user',
    userType:
      rawUser.userType ||
      (rawUser.role === 'ca' ? 'professional' : getPrimaryUserType(taxProfile)),
    taxProfile,
    incomeSources: Array.isArray(rawUser.incomeSources)
      ? rawUser.incomeSources
      : getIncomeSourcesFromTaxProfile(taxProfile),
    maritalStatus:
      rawUser.maritalStatus ||
      rawUser.familyStatus ||
      rawUser.onboarding?.personalDetails?.familyStatus ||
      'Single',
    spouseInfo: rawUser.spouseInfo || null,
    dependents: Array.isArray(rawUser.dependents) ? rawUser.dependents : [],
    businessName: rawUser.businessName || '',
    platforms: Array.isArray(rawUser.platforms) ? rawUser.platforms : [],
    firmName: rawUser.firmName || '',
    caNumber: rawUser.caNumber || '',
    specialization: rawUser.specialization || '',
    yearsOfExperience: rawUser.yearsOfExperience || '',
    raw: rawUser,
  };
};

const mapDemoUserToAuthShape = (demoUser) => {
  const profile = demoUser.profile || {};
  const taxProfile = profile.taxProfile || {};
  const spouseInfo = profile.spouseInfo || null;

  return {
    id: demoUser.id,
    name: profile.name || demoUser.title || '',
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    email: demoUser.email || '',
    phoneNumber: profile.phoneNumber || '',
    province: profile.province || '',
    city: profile.city || '',
    role: demoUser.role || 'user',
    password: demoUser.password || '',
    userType:
      profile.userType ||
      (demoUser.role === 'ca' ? 'professional' : getPrimaryUserType(taxProfile)),
    taxProfile: {
      ...taxProfile,
      spouse: !!spouseInfo,
      spouseTaxProfile: spouseInfo?.taxProfile || {},
    },
    incomeSources:
      Array.isArray(profile.incomeSources) && profile.incomeSources.length
        ? profile.incomeSources
        : getIncomeSourcesFromTaxProfile(taxProfile),
    maritalStatus: profile.maritalStatus || 'Single',
    spouseInfo,
    dependents: Array.isArray(profile.dependents) ? profile.dependents : [],
    businessName: profile.businessName || '',
    platforms: Array.isArray(profile.platforms) ? profile.platforms : [],
    firmName: profile.firmName || '',
    caNumber: profile.caNumber || '',
    specialization: profile.specialization || '',
    yearsOfExperience: profile.yearsOfExperience || '',
  };
};

const mergedDemoUsers = [...(Array.isArray(demoUsers) ? demoUsers : []), BUILT_IN_CA_DEMO];
const DEMO_USERS = mergedDemoUsers.reduce((acc, item) => {
  const email = String(item.email || '').trim().toLowerCase();
  if (!email) return acc;
  acc[email] = mapDemoUserToAuthShape(item);
  return acc;
}, {});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const persistAuth = async (authUser, authToken = null) => {
    const built = buildUser(authUser);
    setUser(built);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(built));

    if (authToken) {
      setToken(authToken);
      await SecureStore.setItemAsync(TOKEN_KEY, authToken);
    }
  };

  const clearAuth = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setUser(null);
    setToken(null);
  };

  const hydrateFromToken = async () => {
    const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);

    if (!storedToken) {
      await clearAuth();
      return { success: false };
    }

    setToken(storedToken);

    try {
      const meResponse = await authAPI.getMe();
      const backendUser =
        meResponse?.data?.user ||
        meResponse?.data?.data ||
        meResponse?.data;

      if (!backendUser) {
        await clearAuth();
        return { success: false };
      }

      await persistAuth(backendUser, storedToken);
      return { success: true, user: buildUser(backendUser) };
    } catch (error) {
      await clearAuth();
      return { success: false };
    }
  };

  const initializeAuth = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      const storedUser = await AsyncStorage.getItem(STORAGE_KEY);

      if (storedToken) {
        setToken(storedToken);

        const hydrated = await hydrateFromToken();
        if (hydrated.success) return;
      }

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.log('Auth init error:', e);
      await clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates = {}) => {
    try {
      const currentUser = user || {};
      const nextRawUser = {
        ...(currentUser.raw || currentUser),
        ...updates,
        taxProfile: {
          ...(currentUser.taxProfile || {}),
          ...(updates.taxProfile || {}),
        },
        spouseInfo:
          updates.spouseInfo !== undefined ? updates.spouseInfo : currentUser.spouseInfo || null,
        dependents: Array.isArray(updates.dependents)
          ? updates.dependents
          : currentUser.dependents || [],
        platforms: Array.isArray(updates.platforms)
          ? updates.platforms
          : currentUser.platforms || [],
        incomeSources: Array.isArray(updates.incomeSources)
          ? updates.incomeSources
          : currentUser.incomeSources || [],
      };

      const nextUser = buildUser(nextRawUser);
      setUser(nextUser);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));

      Toast.show({
        type: 'success',
        text1: 'Profile updated',
      });

      return { success: true, user: nextUser };
    } catch (error) {
      console.log('updateUser error:', error);
      Alert.alert('Update failed', 'Unable to save profile changes right now.');
      return { success: false };
    }
  };

  const login = async (email, password, role = 'user') => {
    try {
      const normalizedEmail = String(email || '').trim().toLowerCase();
      const normalizedPassword = String(password || '').trim();
      const normalizedRole = role === 'ca' ? 'ca' : 'user';
      const demoUser = DEMO_USERS[normalizedEmail];

      if (
        demoUser &&
        demoUser.password === normalizedPassword &&
        demoUser.role === normalizedRole
      ) {
        await persistAuth(demoUser);
        Toast.show({
          type: 'success',
          text1: normalizedRole === 'ca' ? 'CA Demo Login' : 'Demo Login',
          text2: `Logged in as ${demoUser.name}`,
        });
        return { success: true, user: buildUser(demoUser) };
      }

      const res = await authAPI.login({
        email: normalizedEmail,
        password: normalizedPassword,
        role: normalizedRole,
      });

      const authUser = res?.data?.user;
      const authToken = res?.data?.token;

      if (!authToken) {
        Alert.alert(
          'Login failed',
          normalizedRole === 'ca' ? 'Invalid CA credentials' : 'Invalid credentials'
        );
        return { success: false };
      }

      await SecureStore.setItemAsync(TOKEN_KEY, authToken);
      setToken(authToken);

      const meResponse = await authAPI.getMe();
      const backendUser =
        authUser ||
        meResponse?.data?.user ||
        meResponse?.data?.data ||
        null;

      if (!backendUser) {
        await clearAuth();
        Alert.alert(
          'Login failed',
          normalizedRole === 'ca' ? 'Unable to load CA account' : 'Unable to load account'
        );
        return { success: false };
      }

      const resolvedUser = {
        ...backendUser,
        role: backendUser.role || normalizedRole,
      };

      await persistAuth(resolvedUser, authToken);

      Toast.show({
        type: 'success',
        text1: 'Logged in',
        text2: `Welcome back, ${buildDisplayName(resolvedUser) || 'User'}`,
      });

      return { success: true, user: buildUser(resolvedUser) };
    } catch (err) {
      Alert.alert(
        'Login failed',
        role === 'ca' ? 'Invalid CA credentials' : 'Invalid credentials'
      );
      return { success: false };
    }
  };

  const demoLogin = async (role = 'user') => {
    try {
      const normalizedRole = role === 'ca' ? 'ca' : 'user';
      const matchedDemoUser = Object.values(DEMO_USERS).find(
        (item) => item.role === normalizedRole
      );

      if (!matchedDemoUser) {
        Alert.alert(
          'Demo login failed',
          normalizedRole === 'ca' ? 'No CA demo account found' : 'No demo user found'
        );
        return { success: false };
      }

      await persistAuth(matchedDemoUser);
      Toast.show({
        type: 'success',
        text1: normalizedRole === 'ca' ? 'CA Demo Login' : 'Demo Login',
        text2: `Logged in as ${matchedDemoUser.name}`,
      });
      return { success: true, user: buildUser(matchedDemoUser) };
    } catch (err) {
      Alert.alert('Demo login failed', 'Unable to login with demo account');
      return { success: false };
    }
  };

  const register = async (data, role = 'user') => {
  try {
    const normalizedRole = role === 'ca' ? 'ca' : 'user';

    console.log(
      'AUTH REGISTER REQUEST:',
      JSON.stringify({ ...data, role: normalizedRole }, null, 2)
    );

    const res = await authAPI.register({ ...data, role: normalizedRole });

    console.log(
      'AUTH REGISTER RAW RESPONSE:',
      JSON.stringify(res?.data || null, null, 2)
    );

    const authUser = res?.data?.user;
    const authToken = res?.data?.token;
    const success = !!res?.data?.success;

    if (!success) {
      throw new Error(res?.data?.message || 'Unable to create account');
    }

    if (!authToken || !authUser) {
      throw new Error('Registration succeeded but user/token missing');
    }

    await SecureStore.setItemAsync(TOKEN_KEY, authToken);
    setToken(authToken);

    let backendUser = authUser;

    try {
      const meResponse = await authAPI.getMe();
      console.log(
        'AUTH REGISTER GETME RESPONSE:',
        JSON.stringify(meResponse?.data || null, null, 2)
      );

      backendUser =
        authUser ||
        meResponse?.data?.user ||
        meResponse?.data?.data ||
        null;
    } catch (meError) {
      console.log(
        'AUTH REGISTER GETME ERROR:',
        JSON.stringify(meError?.response?.data || meError?.message || null, null, 2)
      );
    }

    if (backendUser) {
      await persistAuth(
        { ...backendUser, role: backendUser.role || normalizedRole },
        authToken
      );
    }

    return {
      success: true,
      token: authToken,
      user: backendUser ? buildUser(backendUser) : buildUser(authUser),
    };
  } catch (err) {
    console.log(
      'AUTH REGISTER ERROR RESPONSE:',
      JSON.stringify(err?.response?.data || null, null, 2)
    );
    console.log('AUTH REGISTER ERROR MESSAGE:', err?.message);
    console.log(
      'AUTH REGISTER ERROR FULL:',
      JSON.stringify(
        {
          message: err?.message,
          status: err?.response?.status,
          data: err?.response?.data,
        },
        null,
        2
      )
    );

    throw new Error(
      err?.response?.data?.errors?.[0]?.message ||
      err?.response?.data?.message ||
      err?.message ||
      'Unable to create account'
    );
  }
};

  const logout = async () => {
    await clearAuth();
    Toast.show({
      type: 'success',
      text1: 'Logged out',
    });
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      demoLogin,
      register,
      logout,
      updateUser,
      hydrateFromToken,
      isAuthenticated: !!user && !!token,
      isCA: user?.role === 'ca',
      isUser: user?.role === 'user',
      demoUsers: Object.values(DEMO_USERS),
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};