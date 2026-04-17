import React, { useMemo, useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Briefcase,
  Car,
  Building2,
  FileText,
  CheckCircle2,
  Shield,
  Calendar,
  BadgeCheck,
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import { useAuth } from '../../auth/context/AuthContext';

const INCOME_SOURCE_OPTIONS = [
  { id: 'employment', label: 'Employment (T4)', icon: Briefcase, classes: 'bg-blue-50 text-blue-700' },
  { id: 'self_employed', label: 'Self-Employed / Business', icon: Building2, classes: 'bg-purple-50 text-purple-700' },
  { id: 'gig_work', label: 'Gig Work', icon: Car, classes: 'bg-green-50 text-green-700' },
  { id: 'incorporated', label: 'Corporation', icon: FileText, classes: 'bg-indigo-50 text-indigo-700' },
];

const getAccountRoleLabel = (user) => {
  if (user?.role === 'ca') return 'CA Professional';
  if (user?.role === 'business_owner') return 'Business Owner';
  return 'Tax Client';
};

const getInitialIncomeSources = (user) => {
  if (Array.isArray(user?.incomeSources) && user.incomeSources.length > 0) {
    return user.incomeSources;
  }

  const taxProfile = user?.taxProfile || {};
  const sources = [];

  if (taxProfile.employment) sources.push('employment');
  if (taxProfile.selfEmployment || taxProfile.incorporatedBusiness) sources.push('self_employed');
  if (taxProfile.gigWork) sources.push('gig_work');
  if (taxProfile.incorporatedBusiness) sources.push('incorporated');

  return sources;
};

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || 'John Doe',
    preferredName: user?.preferredName || '',
    email: user?.email || 'john@example.com',
    phone: user?.phone || user?.phoneNumber || '+1 (416) 555-0123',
    address:
      user?.address ||
      [user?.city, user?.province, user?.postalCode].filter(Boolean).join(', ') ||
      '123 Main St, Toronto, ON M5V 2H1',
    memberSince: user?.memberSince || '2024',
    language: user?.language || 'English',
    dateOfBirth: user?.dateOfBirth || '',
    taxIdMasked: user?.taxIdMasked || '***-***-123',
    assignedCA: user?.assignedCA || 'Not Assigned',
    firmName: user?.firmName || '',
    licenseNumber: user?.licenseNumber || '',
    bio: user?.bio || '',
    incomeSources: getInitialIncomeSources(user),
    businessInfo: {
      businessName: user?.businessInfo?.businessName || '',
      businessType: user?.businessInfo?.businessType || 'Sole Proprietor',
      industry: user?.businessInfo?.industry || '',
      gstNumber: user?.businessInfo?.gstNumber || '',
      fiscalYearEnd: user?.businessInfo?.fiscalYearEnd || '',
      hasEmployees: Boolean(user?.businessInfo?.hasEmployees),
    },
    stats: {
      documents: 24,
      receipts: 156,
      profileCompletion: 82,
    },
  });

  const role = user?.role || 'tax_client';

  const activeProfiles = useMemo(() => {
    return INCOME_SOURCE_OPTIONS.filter((item) => profile.incomeSources.includes(item.id));
  }, [profile.incomeSources]);

  const hasBusinessIncome = useMemo(
    () =>
      profile.incomeSources.includes('self_employed') ||
      profile.incomeSources.includes('gig_work') ||
      profile.incomeSources.includes('incorporated'),
    [profile.incomeSources]
  );

  const updateField = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const updateBusinessField = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      businessInfo: {
        ...prev.businessInfo,
        [field]: value,
      },
    }));
  };

  const toggleIncomeSource = (sourceId) => {
    setProfile((prev) => {
      const exists = prev.incomeSources.includes(sourceId);
      return {
        ...prev,
        incomeSources: exists
          ? prev.incomeSources.filter((item) => item !== sourceId)
          : [...prev.incomeSources, sourceId],
      };
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Keep identity, tax profile, and role-specific details up to date.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700">
            {getAccountRoleLabel(user)}
          </div>
          <Button variant="outline" onClick={() => setIsEditing((prev) => !prev)}>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
          <Button>Save Changes</Button>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <Card.Body>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15">
                <User size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{profile.preferredName || profile.name}</h2>
                <p className="text-sm opacity-90">{profile.email}</p>
                <p className="mt-1 text-xs opacity-75">Member since {profile.memberSince}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-center">
                <p className="text-xs opacity-75">Profile Completion</p>
                <p className="text-xl font-bold">{profile.stats.profileCompletion}%</p>
              </div>
              <Button variant="outline" className="bg-white text-primary-600 hover:bg-gray-100">
                <Camera size={16} className="mr-2" />
                Upload Photo
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Documents" value={profile.stats.documents} />
        <StatCard label="Receipts" value={profile.stats.receipts} />
        <StatCard label="Verification" value="Verified" icon={BadgeCheck} />
      </div>

      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <p className="mt-1 text-sm text-gray-500">Identity and primary contact details.</p>
        </Card.Header>
        <Card.Body className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ProfileField label="Full Name" value={profile.name} editable={isEditing} onChange={(value) => updateField('name', value)} />
          <ProfileField label="Preferred Name" value={profile.preferredName} editable={isEditing} onChange={(value) => updateField('preferredName', value)} />
          <ProfileField label="Email Address" value={profile.email} editable={isEditing} onChange={(value) => updateField('email', value)} />
          <ProfileField label="Phone Number" value={profile.phone} editable={isEditing} onChange={(value) => updateField('phone', value)} />
          <ProfileField label="Address" value={profile.address} editable={isEditing} onChange={(value) => updateField('address', value)} />
          <SelectField label="Preferred Language" value={profile.language} editable={isEditing} options={['English', 'French']} onChange={(value) => updateField('language', value)} />
          <ProfileField label="Date of Birth" value={profile.dateOfBirth} editable={isEditing} onChange={(value) => updateField('dateOfBirth', value)} />
          <ProfileField label="Tax ID" value={profile.taxIdMasked} editable={false} />
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Tax Profile</h2>
          <p className="mt-1 text-sm text-gray-500">This belongs on profile because it defines the user, not app preferences.</p>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {INCOME_SOURCE_OPTIONS.map((source) => {
              const Icon = source.icon;
              const checked = profile.incomeSources.includes(source.id);

              return (
                <label
                  key={source.id}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                    checked ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${source.classes}`}>
                      <Icon size={16} />
                    </div>
                    <span className="font-medium text-gray-900">{source.label}</span>
                  </div>

                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleIncomeSource(source.id)}
                    disabled={!isEditing}
                    className="h-4 w-4"
                  />
                </label>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {activeProfiles.map((profileItem) => {
              const Icon = profileItem.icon;
              return (
                <div
                  key={profileItem.id}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${profileItem.classes}`}
                >
                  <Icon size={14} />
                  {profileItem.label}
                </div>
              );
            })}
          </div>
        </Card.Body>
      </Card>

      {hasBusinessIncome && (
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold">Business Profile</h2>
            <p className="mt-1 text-sm text-gray-500">Shown only when business-related income applies.</p>
          </Card.Header>
          <Card.Body className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ProfileField label="Business Name" value={profile.businessInfo.businessName} editable={isEditing} onChange={(value) => updateBusinessField('businessName', value)} />
            <SelectField label="Business Type" value={profile.businessInfo.businessType} editable={isEditing} options={['Sole Proprietor', 'Corporation', 'Partnership', 'Freelancer']} onChange={(value) => updateBusinessField('businessType', value)} />
            <ProfileField label="Industry" value={profile.businessInfo.industry} editable={isEditing} onChange={(value) => updateBusinessField('industry', value)} />
            <ProfileField label="GST / HST Number" value={profile.businessInfo.gstNumber} editable={isEditing} onChange={(value) => updateBusinessField('gstNumber', value)} />
            <ProfileField label="Fiscal Year End" value={profile.businessInfo.fiscalYearEnd} editable={isEditing} onChange={(value) => updateBusinessField('fiscalYearEnd', value)} />
            <SelectField label="Has Employees" value={profile.businessInfo.hasEmployees ? 'Yes' : 'No'} editable={isEditing} options={['Yes', 'No']} onChange={(value) => updateBusinessField('hasEmployees', value === 'Yes')} />
          </Card.Body>
        </Card>
      )}

      {role === 'ca' && (
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold">Professional Profile</h2>
            <p className="mt-1 text-sm text-gray-500">CA-specific public and professional identity.</p>
          </Card.Header>
          <Card.Body className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ProfileField label="Firm Name" value={profile.firmName} editable={isEditing} onChange={(value) => updateField('firmName', value)} />
            <ProfileField label="License Number" value={profile.licenseNumber} editable={isEditing} onChange={(value) => updateField('licenseNumber', value)} />
            <div className="md:col-span-2">
              <TextAreaField label="Professional Bio" value={profile.bio} editable={isEditing} onChange={(value) => updateField('bio', value)} />
            </div>
          </Card.Body>
        </Card>
      )}

      {(role === 'tax_client' || role === 'business_owner') && (
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold">Assigned Tax Professional</h2>
          </Card.Header>
          <Card.Body>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Assigned CA</p>
              <p className="mt-1 font-medium text-gray-900">{profile.assignedCA}</p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline">Open Messages</Button>
                <Button variant="outline">Request Change</Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Verification & Status</h2>
        </Card.Header>
        <Card.Body className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <StatusTile icon={CheckCircle2} title="Identity" value="Verified" />
          <StatusTile icon={Shield} title="Security" value="Protected" />
          <StatusTile icon={Calendar} title="Last Updated" value="Today" />
        </Card.Body>
      </Card>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon }) => (
  <Card className="p-4 text-center">
    <div className="flex items-center justify-center gap-2">
      {Icon ? <Icon size={16} className="text-primary-600" /> : null}
      <p className="text-2xl font-bold text-primary-600">{value}</p>
    </div>
    <p className="text-sm text-gray-500">{label}</p>
  </Card>
);

const StatusTile = ({ icon: Icon, title, value }) => (
  <div className="rounded-2xl bg-gray-50 p-4">
    <div className="mb-2 flex items-center gap-2 text-gray-700">
      <Icon size={16} />
      <p className="text-sm font-medium">{title}</p>
    </div>
    <p className="font-semibold text-gray-900">{value}</p>
  </div>
);

const ProfileField = ({ label, value, editable, onChange = () => {} }) => (
  <div>
    <p className="mb-1 text-sm text-gray-500">{label}</p>
    {editable ? (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-gray-400"
      />
    ) : (
      <p className="rounded-xl bg-gray-50 px-3 py-2 font-medium text-gray-900">{value || 'Not provided'}</p>
    )}
  </div>
);

const TextAreaField = ({ label, value, editable, onChange = () => {} }) => (
  <div>
    <p className="mb-1 text-sm text-gray-500">{label}</p>
    {editable ? (
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-gray-400"
      />
    ) : (
      <p className="rounded-xl bg-gray-50 px-3 py-2 font-medium text-gray-900">{value || 'Not provided'}</p>
    )}
  </div>
);

const SelectField = ({ label, value, editable, options, onChange }) => (
  <div>
    <p className="mb-1 text-sm text-gray-500">{label}</p>
    {editable ? (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-gray-400"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    ) : (
      <p className="rounded-xl bg-gray-50 px-3 py-2 font-medium text-gray-900">{value}</p>
    )}
  </div>
);

export default ProfilePage;
