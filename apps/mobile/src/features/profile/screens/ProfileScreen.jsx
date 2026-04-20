import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Header from '@/components/layout/AppHeader';
import { colors, typography } from '@/styles/theme';
import { useAuth } from '@/features/auth/context/AuthContext';
import { PROVINCES } from '@/utils/taxUtils';

const INCOME_OPTIONS = [
  { key: 'employment', label: 'Employment', icon: 'briefcase-outline' },
  { key: 'gigWork', label: 'Gig work', icon: 'car-outline' },
  { key: 'selfEmployment', label: 'Self-employed', icon: 'account-tie-outline' },
  { key: 'incorporatedBusiness', label: 'Corporation / Business owner', icon: 'domain' },
];

const REGISTERED_OPTIONS = [
  { key: 'hasTFSA', label: 'TFSA', icon: 'bank-outline' },
  { key: 'hasRRSP', label: 'RRSP', icon: 'chart-box-outline' },
  { key: 'hasFHSA', label: 'FHSA', icon: 'home-city-outline' },
];

const INVESTMENT_OPTIONS = [
  { key: 'hasInvestments', label: 'Investments', icon: 'finance' },
  { key: 'hasCharitableDonations', label: 'Donations', icon: 'heart-outline' },
];

const SPOUSE_INCOME_OPTIONS = [
  { key: 'employment', label: 'Employment', icon: 'briefcase-outline' },
  { key: 'unemployed', label: 'Unemployed', icon: 'account-off-outline' },
  { key: 'gigWork', label: 'Gig work', icon: 'car-outline' },
  { key: 'selfEmployment', label: 'Self-employed', icon: 'account-tie-outline' },
  { key: 'incorporatedBusiness', label: 'Corporation / Business owner', icon: 'domain' },
];

const SPOUSE_REGISTERED_OPTIONS = [
  { key: 'hasTFSA', label: 'TFSA', icon: 'bank-outline' },
  { key: 'hasRRSP', label: 'RRSP', icon: 'chart-box-outline' },
  { key: 'hasFHSA', label: 'FHSA', icon: 'home-city-outline' },
];

const SPOUSE_INVESTMENT_OPTIONS = [
  { key: 'hasInvestments', label: 'Investments', icon: 'finance' },
  { key: 'hasCharitableDonations', label: 'Donations', icon: 'heart-outline' },
];

const MARITAL_STATUS = ['Single', 'Married', 'Common-Law', 'Separated', 'Divorced', 'Widowed'];
const GIG_APPS = ['Uber', 'Instacart', 'DoorDash', 'SkipTheDishes', 'Other'];

const ProfileScreen = ({ navigation }) => {
  const auth = useAuth();
  const user = auth?.user || {};

  const [form, setForm] = useState(() => buildInitialForm(user));
  const [editing, setEditing] = useState({
    personal: false,
    address: false,
    marital: false,
    income: false,
    registered: false,
    investments: false,
    spouse: false,
    business: false,
    gig: false,
  });
  const [initialForm] = useState(() => buildInitialForm(user));

  const assignedCA = user?.assignedCA || user?.ca || null;
  const showBusinessSection = shouldShowBusinessSection(form);
  const showGigSection = !!form.taxProfile.gigWork;
  const showSpouseSection = isMarriedStatus(form.maritalStatus);
  const isDirty = JSON.stringify(form) !== JSON.stringify(initialForm);

  const provinceName = useMemo(() => {
    return PROVINCES.find((p) => p.code === form.province)?.name || form.province || 'Not provided';
  }, [form.province]);

  const initials = `${form.firstName?.[0] || ''}${form.lastName?.[0] || ''}`.toUpperCase() || 'U';

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateTaxProfile = (key, value) => {
    setForm((prev) => ({
      ...prev,
      taxProfile: {
        ...prev.taxProfile,
        [key]: value,
      },
    }));
  };

  const toggleTaxProfile = (key) => {
    setForm((prev) => ({
      ...prev,
      taxProfile: {
        ...prev.taxProfile,
        [key]: !prev.taxProfile?.[key],
      },
    }));
  };

  const updateBusinessField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateSpouseField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      spouseProfile: {
        ...prev.spouseProfile,
        [key]: value,
      },
    }));
  };

  const toggleSpouseTaxProfile = (key) => {
    setForm((prev) => ({
      ...prev,
      spouseProfile: {
        ...prev.spouseProfile,
        taxProfile: {
          ...prev.spouseProfile.taxProfile,
          [key]: !prev.spouseProfile.taxProfile?.[key],
        },
      },
    }));
  };

  const updateGigPlatforms = (platform) => {
    setForm((prev) => {
      const exists = prev.platforms.includes(platform);
      return {
        ...prev,
        platforms: exists
          ? prev.platforms.filter((item) => item !== platform)
          : [...prev.platforms, platform],
      };
    });
  };

  const setSectionEditing = (key, value) => {
    setEditing((prev) => ({ ...prev, [key]: value }));
  };

  const onSelectMaritalStatus = (status) => {
    setForm((prev) => ({
      ...prev,
      maritalStatus: status,
      spouseProfile: isMarriedStatus(status) ? prev.spouseProfile : buildEmptySpouseProfile(),
    }));
  };

  const onCancel = () => {
    setForm(initialForm);
    navigation?.goBack?.();
  };

  const onSave = async () => {
    try {
      // Replace with your real update action.
      // Example: await auth?.updateUserProfile?.(form);
      Alert.alert('Saved', 'Profile updated successfully.');
    } catch (error) {
      Alert.alert('Error', 'Could not save profile changes.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" showBack={!!navigation?.canGoBack?.()} />

      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.profileTopCard}>
            <View style={styles.profileTopRow}>
              <View style={styles.avatarWrap}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={styles.profileTextWrap}>
                <Text style={styles.name}>{[form.firstName, form.lastName].filter(Boolean).join(' ') || 'User'}</Text>
                <Text style={styles.email}>{form.email || 'email@example.com'}</Text>
                <Text style={styles.caption}>{getRoleLabel(form)}</Text>
              </View>
            </View>
            <View style={styles.topMetaRow}>
              <View style={styles.topMetaCard}>
                <Text style={styles.topMetaLabel}>Tax ID</Text>
                <Text style={styles.topMetaValue}>{form.taxId}</Text>
              </View>
              <View style={styles.topMetaCard}>
                <Text style={styles.topMetaLabel}>Province</Text>
                <Text style={styles.topMetaValue}>{provinceName}</Text>
              </View>
            </View>
          </View>

          <EditableSection
            title="Personal information"
            subtitle="Show details first. Edit only when needed."
            isEditing={editing.personal}
            onEdit={() => setSectionEditing('personal', true)}
            onDone={() => setSectionEditing('personal', false)}
          >
            {editing.personal ? (
              <>
                <Input label="First name" value={form.firstName} onChangeText={(v) => updateField('firstName', v)} />
                <Input label="Last name" value={form.lastName} onChangeText={(v) => updateField('lastName', v)} />
                <Input label="Preferred name" value={form.preferredName} onChangeText={(v) => updateField('preferredName', v)} />
                <Input label="Email" value={form.email} keyboardType="email-address" onChangeText={(v) => updateField('email', v)} />
                <Input label="Phone number" value={form.phone} keyboardType="phone-pad" onChangeText={(v) => updateField('phone', v)} />
                <Input label="Date of birth" value={form.dateOfBirth} onChangeText={(v) => updateField('dateOfBirth', v)} />
              </>
            ) : (
              <SummaryList
                items={[
                  ['First name', form.firstName],
                  ['Last name', form.lastName],
                  ['Preferred name', form.preferredName || 'Not provided'],
                  ['Email', form.email],
                  ['Phone number', form.phone],
                  ['Date of birth', form.dateOfBirth || 'Not provided'],
                ]}
              />
            )}
          </EditableSection>

          <EditableSection
            title="Address"
            subtitle="Separate address tabs/fields for better structure."
            isEditing={editing.address}
            onEdit={() => setSectionEditing('address', true)}
            onDone={() => setSectionEditing('address', false)}
          >
            {editing.address ? (
              <>
                <View style={styles.row}>
                  <View style={styles.half}><Input label="House number" value={form.houseNumber} onChangeText={(v) => updateField('houseNumber', v)} /></View>
                  <View style={styles.half}><Input label="Apt no." value={form.aptNo} onChangeText={(v) => updateField('aptNo', v)} /></View>
                </View>
                <Input label="Street" value={form.street} onChangeText={(v) => updateField('street', v)} />
                <View style={styles.row}>
                  <View style={styles.half}><Input label="City" value={form.city} onChangeText={(v) => updateField('city', v)} /></View>
                  <View style={styles.half}><Input label="Province" value={form.province} onChangeText={(v) => updateField('province', v)} /></View>
                </View>
                <View style={styles.row}>
                  <View style={styles.half}><Input label="Country" value={form.country} onChangeText={(v) => updateField('country', v)} /></View>
                  <View style={styles.half}><Input label="Pin code" value={form.postalCode} onChangeText={(v) => updateField('postalCode', v)} /></View>
                </View>
              </>
            ) : (
              <SummaryList
                items={[
                  ['House number', form.houseNumber || 'Not provided'],
                  ['Apt no.', form.aptNo || 'Not provided'],
                  ['Street', form.street || 'Not provided'],
                  ['City', form.city || 'Not provided'],
                  ['Province', form.province || 'Not provided'],
                  ['Country', form.country || 'Not provided'],
                  ['Pin code', form.postalCode || 'Not provided'],
                ]}
              />
            )}
          </EditableSection>

          <EditableSection
            title="Marital status"
            subtitle="Spouse section appears only for married or common-law."
            isEditing={editing.marital}
            onEdit={() => setSectionEditing('marital', true)}
            onDone={() => setSectionEditing('marital', false)}
          >
            {editing.marital ? (
              <View style={styles.pillRow}>
                {MARITAL_STATUS.map((status) => {
                  const active = form.maritalStatus === status;
                  return (
                    <TouchableOpacity
                      key={status}
                      activeOpacity={0.85}
                      onPress={() => onSelectMaritalStatus(status)}
                      style={[styles.statusPill, active && styles.statusPillActive]}
                    >
                      <Text style={[styles.statusPillText, active && styles.statusPillTextActive]}>{status}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <SummaryList items={[['Marital status', form.maritalStatus || 'Not provided']]} />
            )}
          </EditableSection>

          <EditableSection
            title="Income profile"
            subtitle="Primary client income sources."
            isEditing={editing.income}
            onEdit={() => setSectionEditing('income', true)}
            onDone={() => setSectionEditing('income', false)}
          >
            {editing.income ? (
              <OptionGrid options={INCOME_OPTIONS} values={form.taxProfile} onToggle={toggleTaxProfile} />
            ) : (
              <TagSummary options={INCOME_OPTIONS} values={form.taxProfile} />
            )}
          </EditableSection>

          <EditableSection
            title="Registered accounts"
            subtitle="TFSA, RRSP and FHSA in a separate section."
            isEditing={editing.registered}
            onEdit={() => setSectionEditing('registered', true)}
            onDone={() => setSectionEditing('registered', false)}
          >
            {editing.registered ? (
              <OptionGrid options={REGISTERED_OPTIONS} values={form} onToggle={(key) => updateField(key, !form[key])} />
            ) : (
              <TagSummary options={REGISTERED_OPTIONS} values={form} />
            )}
          </EditableSection>

          <EditableSection
            title="Investments & donations"
            subtitle="Investment and donation details in their own section."
            isEditing={editing.investments}
            onEdit={() => setSectionEditing('investments', true)}
            onDone={() => setSectionEditing('investments', false)}
          >
            {editing.investments ? (
              <OptionGrid options={INVESTMENT_OPTIONS} values={form} onToggle={(key) => updateField(key, !form[key])} />
            ) : (
              <TagSummary options={INVESTMENT_OPTIONS} values={form} />
            )}
          </EditableSection>

          {showGigSection && (
            <EditableSection
              title="Gig work apps"
              subtitle="Apps selected during account creation should be shown here too."
              isEditing={editing.gig}
              onEdit={() => setSectionEditing('gig', true)}
              onDone={() => setSectionEditing('gig', false)}
            >
              {editing.gig ? (
                <>
                  <OptionGrid
                    options={GIG_APPS.map((item) => ({ key: item, label: item, icon: 'apps' }))}
                    values={Object.fromEntries(GIG_APPS.map((item) => [item, form.platforms.includes(item)]))}
                    onToggle={updateGigPlatforms}
                    compact
                  />
                  {form.platforms.includes('Other') && (
                    <Input
                      label="Other app name"
                      value={form.otherPlatformName}
                      onChangeText={(v) => updateField('otherPlatformName', v)}
                    />
                  )}
                </>
              ) : (
                <SummaryList
                  items={[[
                    'Selected apps',
                    form.platforms.length
                      ? [...form.platforms.filter((p) => p !== 'Other'), form.platforms.includes('Other') && form.otherPlatformName ? form.otherPlatformName : form.platforms.includes('Other') ? 'Other' : null]
                          .filter(Boolean)
                          .join(', ')
                      : 'None selected',
                  ]]}
                />
              )}
            </EditableSection>
          )}

          {showSpouseSection && (
            <EditableSection
              title="Spouse profile"
              subtitle="Structured like the client profile with proper separations."
              isEditing={editing.spouse}
              onEdit={() => setSectionEditing('spouse', true)}
              onDone={() => setSectionEditing('spouse', false)}
            >
              {editing.spouse ? (
                <>
                  <Input label="Spouse name" value={form.spouseProfile.name} onChangeText={(v) => updateSpouseField('name', v)} />
                  <Input label="Spouse SIN" value={form.spouseProfile.sin} onChangeText={(v) => updateSpouseField('sin', v)} />
                  <Input label="Spouse date of birth" value={form.spouseProfile.dateOfBirth} onChangeText={(v) => updateSpouseField('dateOfBirth', v)} />
                  <Input label="Spouse income" value={form.spouseProfile.income} onChangeText={(v) => updateSpouseField('income', v)} />

                  <Text style={styles.subSectionTitle}>Spouse income profile</Text>
                  <OptionGrid options={SPOUSE_INCOME_OPTIONS} values={form.spouseProfile.taxProfile} onToggle={toggleSpouseTaxProfile} compact />

                  <Text style={styles.subSectionTitle}>Spouse registered accounts</Text>
                  <OptionGrid options={SPOUSE_REGISTERED_OPTIONS} values={form.spouseProfile.taxProfile} onToggle={toggleSpouseTaxProfile} compact />

                  <Text style={styles.subSectionTitle}>Spouse investments & donations</Text>
                  <OptionGrid options={SPOUSE_INVESTMENT_OPTIONS} values={form.spouseProfile.taxProfile} onToggle={toggleSpouseTaxProfile} compact />
                </>
              ) : (
                <>
                  <SummaryList
                    items={[
                      ['Spouse name', form.spouseProfile.name || 'Not provided'],
                      ['Spouse SIN', maskSensitive(form.spouseProfile.sin)],
                      ['Spouse date of birth', form.spouseProfile.dateOfBirth || 'Not provided'],
                      ['Spouse income', form.spouseProfile.income || 'Not provided'],
                    ]}
                  />
                  <Text style={styles.inlineLabel}>Income profile</Text>
                  <TagSummary options={SPOUSE_INCOME_OPTIONS} values={form.spouseProfile.taxProfile} />
                  <Text style={styles.inlineLabel}>Registered accounts</Text>
                  <TagSummary options={SPOUSE_REGISTERED_OPTIONS} values={form.spouseProfile.taxProfile} />
                  <Text style={styles.inlineLabel}>Investments & donations</Text>
                  <TagSummary options={SPOUSE_INVESTMENT_OPTIONS} values={form.spouseProfile.taxProfile} />
                </>
              )}
            </EditableSection>
          )}

          {showBusinessSection && (
            <EditableSection
              title="Business profile"
              subtitle="Shown when business-related income applies."
              isEditing={editing.business}
              onEdit={() => setSectionEditing('business', true)}
              onDone={() => setSectionEditing('business', false)}
            >
              {editing.business ? (
                <>
                  <Input label="Business name" value={form.businessName} onChangeText={(v) => updateBusinessField('businessName', v)} />
                  <Input label="Business type" value={form.businessType} onChangeText={(v) => updateBusinessField('businessType', v)} />
                  <Input label="Business number" value={form.businessNumber} onChangeText={(v) => updateBusinessField('businessNumber', v)} />
                  <Input label="GST number" value={form.gstNumber} onChangeText={(v) => updateBusinessField('gstNumber', v)} />
                  <Input label="HST number" value={form.hstNumber} onChangeText={(v) => updateBusinessField('hstNumber', v)} />
                  <Input label="QST number" value={form.qstNumber} onChangeText={(v) => updateBusinessField('qstNumber', v)} />
                </>
              ) : (
                <SummaryList
                  items={[
                    ['Business name', form.businessName || 'Not provided'],
                    ['Business type', form.businessType || 'Not provided'],
                    ['Business number', form.businessNumber || 'Not provided'],
                    ['GST number', form.gstNumber || 'Not provided'],
                    ['HST number', form.hstNumber || 'Not provided'],
                    ['QST number', form.qstNumber || 'Not provided'],
                  ]}
                />
              )}
            </EditableSection>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assigned tax professional</Text>
            <View style={styles.assignedRow}>
              <View style={styles.assignedIcon}>
                <Icon name="account-tie-outline" size={20} color={colors.primary[500]} />
              </View>
              <View>
                <Text style={styles.assignedName}>{assignedCA?.name || assignedCA?.fullName || 'Not Assigned'}</Text>
                <Text style={styles.assignedSubtext}>Assigned CA</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.85} onPress={onCancel}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveBtn, !isDirty && styles.saveBtnDisabled]}
            activeOpacity={0.85}
            onPress={onSave}
            disabled={!isDirty}
          >
            <Icon name="content-save-outline" size={18} color="#FFFFFF" />
            <Text style={styles.saveBtnText}>Save changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const EditableSection = ({ title, subtitle, isEditing, onEdit, onDone, children }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeaderRow}>
      <View style={styles.sectionHeaderText}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      </View>
      <TouchableOpacity style={styles.editButton} onPress={isEditing ? onDone : onEdit} activeOpacity={0.85}>
        <Text style={styles.editButtonText}>{isEditing ? 'Done' : 'Edit'}</Text>
      </TouchableOpacity>
    </View>
    {children}
  </View>
);

const Input = ({ label, value, onChangeText, keyboardType = 'default', multiline = false }) => (
  <View style={styles.inputWrap}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      multiline={multiline}
      placeholder={label}
      placeholderTextColor="#98A2B3"
      style={[styles.input, multiline && styles.inputMultiline]}
    />
  </View>
);

const SummaryList = ({ items }) => (
  <View style={styles.summaryList}>
    {items.map(([label, value], index) => (
      <View key={`${label}-${index}`} style={[styles.summaryRow, index === items.length - 1 && styles.summaryRowLast]}>
        <Text style={styles.summaryLabel}>{label}</Text>
        <Text style={styles.summaryValue}>{value || 'Not provided'}</Text>
      </View>
    ))}
  </View>
);

const TagSummary = ({ options, values }) => {
  const selected = options.filter((item) => !!values?.[item.key]);
  return selected.length ? (
    <View style={styles.tagWrap}>
      {selected.map((item) => (
        <View key={item.key} style={styles.tag}>
          <Text style={styles.tagText}>{item.label}</Text>
        </View>
      ))}
    </View>
  ) : (
    <Text style={styles.emptyText}>No options selected.</Text>
  );
};

const OptionGrid = ({ options, values, onToggle, compact = false }) => (
  <View style={styles.optionGrid}>
    {options.map((item) => {
      const active = !!values?.[item.key];
      return (
        <TouchableOpacity
          key={item.key}
          activeOpacity={0.85}
          onPress={() => onToggle(item.key)}
          style={[styles.optionCard, compact && styles.optionCardCompact, active && styles.optionCardActive]}
        >
          <View style={[styles.optionIconWrap, active && styles.optionIconWrapActive]}>
            <Icon name={active ? 'check' : item.icon || 'circle-outline'} size={18} color={active ? colors.primary[500] : colors.text.primary} />
          </View>
          <Text style={[styles.optionText, active && styles.optionTextActive]}>{item.label}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const buildInitialForm = (user) => ({
  firstName: user?.profile?.firstName || user?.firstName || splitName(user?.name).firstName,
  lastName: user?.profile?.lastName || user?.lastName || splitName(user?.name).lastName,
  preferredName: user?.preferredName || user?.profile?.preferredName || '',
  email: user?.email || user?.profile?.email || '',
  phone: user?.profile?.phone || user?.phone || user?.phoneNumber || '',
  dateOfBirth: user?.profile?.dateOfBirth || user?.dateOfBirth || '',
  taxId: user?.taxId || user?.clientTaxId || user?.profile?.taxId || generateTaxId(user),
  houseNumber: user?.profile?.houseNumber || user?.houseNumber || '',
  aptNo: user?.profile?.aptNo || user?.aptNo || '',
  street: user?.profile?.street || user?.street || extractStreet(user),
  city: user?.profile?.city || user?.city || '',
  province: user?.profile?.province || user?.province || '',
  country: user?.profile?.country || user?.country || 'Canada',
  postalCode: user?.profile?.postalCode || user?.postalCode || '',
  maritalStatus: user?.profile?.maritalStatus || user?.maritalStatus || 'Single',
  taxProfile: {
    employment: !!(user?.taxProfile?.employment ?? user?.profile?.taxProfile?.employment ?? true),
    gigWork: !!(user?.taxProfile?.gigWork ?? user?.profile?.taxProfile?.gigWork),
    selfEmployment: !!(user?.taxProfile?.selfEmployment ?? user?.profile?.taxProfile?.selfEmployment),
    incorporatedBusiness: !!(user?.taxProfile?.incorporatedBusiness ?? user?.taxProfile?.corporation ?? user?.profile?.taxProfile?.incorporatedBusiness),
  },
  hasTFSA: !!(user?.profile?.hasTFSA || user?.taxProfile?.tfsa),
  hasRRSP: !!(user?.profile?.hasRRSP || user?.taxProfile?.rrsp),
  hasFHSA: !!(user?.profile?.hasFHSA || user?.taxProfile?.fhsa),
  hasInvestments: !!(user?.profile?.hasInvestments || user?.taxProfile?.investments),
  hasCharitableDonations: !!(user?.profile?.hasCharitableDonations || user?.taxProfile?.donations),
  platforms: user?.profile?.platforms || user?.platforms || [],
  otherPlatformName: user?.profile?.otherPlatformName || user?.otherPlatformName || '',
  businessName: user?.profile?.businessName || user?.businessInfo?.businessName || user?.firmName || '',
  businessType: user?.profile?.businessType || user?.businessInfo?.businessType || '',
  businessNumber: user?.profile?.businessNumber || user?.businessInfo?.businessNumber || '',
  gstNumber: user?.profile?.gstNumber || user?.businessInfo?.gstNumber || '',
  hstNumber: user?.profile?.hstNumber || user?.businessInfo?.hstNumber || '',
  qstNumber: user?.profile?.qstNumber || user?.businessInfo?.qstNumber || '',
  spouseProfile: {
    name: user?.spouseInfo?.name || user?.profile?.spouseName || '',
    sin: user?.spouseInfo?.sin || user?.profile?.spouseSin || '',
    dateOfBirth: user?.spouseInfo?.dateOfBirth || user?.profile?.spouseDob || '',
    income: user?.spouseInfo?.income || user?.profile?.spouseIncome || '',
    taxProfile: {
      employment: !!user?.spouseProfile?.taxProfile?.employment,
      unemployed: !!user?.spouseProfile?.taxProfile?.unemployed,
      gigWork: !!user?.spouseProfile?.taxProfile?.gigWork,
      selfEmployment: !!user?.spouseProfile?.taxProfile?.selfEmployment,
      incorporatedBusiness: !!user?.spouseProfile?.taxProfile?.incorporatedBusiness,
      hasTFSA: !!user?.spouseProfile?.taxProfile?.hasTFSA,
      hasRRSP: !!user?.spouseProfile?.taxProfile?.hasRRSP,
      hasFHSA: !!user?.spouseProfile?.taxProfile?.hasFHSA,
      hasInvestments: !!user?.spouseProfile?.taxProfile?.hasInvestments,
      hasCharitableDonations: !!user?.spouseProfile?.taxProfile?.hasCharitableDonations,
    },
  },
});

const buildEmptySpouseProfile = () => ({
  name: '',
  sin: '',
  dateOfBirth: '',
  income: '',
  taxProfile: {
    employment: false,
    unemployed: false,
    gigWork: false,
    selfEmployment: false,
    incorporatedBusiness: false,
    hasTFSA: false,
    hasRRSP: false,
    hasFHSA: false,
    hasInvestments: false,
    hasCharitableDonations: false,
  },
});

const splitName = (name = '') => {
  const parts = String(name).trim().split(' ').filter(Boolean);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' '),
  };
};

const extractStreet = (user) => user?.profile?.address || user?.address || '';
const isMarriedStatus = (status) => status === 'Married' || status === 'Common-Law';
const shouldShowBusinessSection = (form) => !!(form.taxProfile.selfEmployment || form.taxProfile.incorporatedBusiness || form.businessName || form.businessType);
const generateTaxId = (user) => `TX-${String(user?.id || user?._id || '000001').slice(-6).toUpperCase()}`;
const maskSensitive = (value) => {
  if (!value) return 'Not provided';
  const raw = String(value).replace(/\s/g, '');
  if (raw.length <= 3) return raw;
  return `••••••${raw.slice(-3)}`;
};
const getRoleLabel = (form) => {
  if (form.taxProfile.incorporatedBusiness) return 'Business owner';
  if (form.taxProfile.selfEmployment) return 'Self-employed';
  if (form.taxProfile.gigWork) return 'Gig worker';
  return 'Individual';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  page: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 136,
  },
  profileTopCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E7ECF3',
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarWrap: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E9F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary[500],
  },
  profileTextWrap: {
    flex: 1,
  },
  name: {
    ...typography.h5,
    color: colors.text.primary,
    marginBottom: 2,
  },
  email: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  caption: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  topMetaRow: {
    flexDirection: 'row',
    gap: 10,
  },
  topMetaCard: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: '#F8FAFD',
    borderWidth: 1,
    borderColor: '#E7ECF3',
    padding: 12,
  },
  topMetaLabel: {
    ...typography.caption,
    color: '#667085',
    marginBottom: 4,
  },
  topMetaValue: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '700',
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E7ECF3',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  sectionHeaderText: {
    flex: 1,
    paddingRight: 10,
  },
  sectionTitle: {
    ...typography.h6,
    color: colors.text.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  editButton: {
    minWidth: 64,
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    ...typography.caption,
    color: colors.primary[500],
    fontWeight: '700',
  },
  inputWrap: {
    marginBottom: 14,
  },
  inputLabel: {
    ...typography.caption,
    color: '#667085',
    marginBottom: 6,
  },
  input: {
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DDE3EC',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    color: colors.text.primary,
    ...typography.body,
  },
  inputMultiline: {
    minHeight: 84,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  half: {
    flex: 1,
  },
  summaryList: {
    borderWidth: 1,
    borderColor: '#E7ECF3',
    borderRadius: 16,
    overflow: 'hidden',
  },
  summaryRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E7ECF3',
    backgroundColor: '#FFFFFF',
  },
  summaryRowLast: {
    borderBottomWidth: 0,
  },
  summaryLabel: {
    ...typography.caption,
    color: '#667085',
    marginBottom: 4,
  },
  summaryValue: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#DDE3EC',
    backgroundColor: '#FFFFFF',
  },
  statusPillActive: {
    backgroundColor: '#EEF4FF',
    borderColor: '#BFD1FF',
  },
  statusPillText: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  statusPillTextActive: {
    color: colors.primary[500],
    fontWeight: '700',
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionCard: {
    width: '48.5%',
    minHeight: 72,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDE3EC',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionCardCompact: {
    minHeight: 64,
  },
  optionCardActive: {
    backgroundColor: '#F3F7FF',
    borderColor: '#BFD1FF',
  },
  optionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F2F4F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  optionIconWrapActive: {
    backgroundColor: '#FFFFFF',
  },
  optionText: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  optionTextActive: {
    fontWeight: '700',
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#EEF4FF',
    borderWidth: 1,
    borderColor: '#C9D8FF',
  },
  tagText: {
    ...typography.caption,
    color: colors.primary[500],
    fontWeight: '700',
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  subSectionTitle: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 10,
  },
  inlineLabel: {
    ...typography.caption,
    color: '#667085',
    marginTop: 14,
    marginBottom: 8,
  },
  assignedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assignedIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  assignedName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  assignedSubtext: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 22,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E7ECF3',
    shadowColor: '#101828',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  cancelBtn: {
    flex: 0.95,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1.35,
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  saveBtnDisabled: {
    opacity: 0.55,
  },
  saveBtnText: {
    ...typography.body,
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 8,
  },
});

export default ProfileScreen;
