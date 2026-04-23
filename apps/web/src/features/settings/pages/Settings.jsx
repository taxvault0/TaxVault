import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Shield,
  Lock,
  Globe,
  Moon,
  Sun,
  CreditCard,
  Plug,
  Trash2,
  LogOut,
  Smartphone,
  Mail,
  Monitor,
  FileText,
  ChevronRight,
  AlertTriangle,
  Building2,
  Briefcase,
  User,
  Landmark,
  KeyRound,
  History,
  Palette,
  Database,
  BadgeHelp,
  Clock3,
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import { useAuth } from '../../auth/context/AuthContext';

const ROLE_LABELS = {
  ca: 'CA Professional',
  business_owner: 'Business Owner',
  tax_client: 'Tax Client',
};

const buildSections = (role) => {
  const sections = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  if (role === 'ca') {
    sections.push({
      id: 'office-hours',
      label: 'Office Hours',
      icon: Clock3,
    });
  }

  sections.push({
    id: 'danger',
    label: 'Danger Zone',
    icon: Trash2,
    danger: true,
  });

  return sections;
};

const getRoleLabel = (user) => ROLE_LABELS[user?.role] || 'Tax Client';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const role = user?.role || 'tax_client';

  const [activeSection, setActiveSection] = useState('account');
  const [saveState, setSaveState] = useState('idle');

  const sections = useMemo(() => buildSections(role), [role]);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);

    if (typeof document !== 'undefined') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const [settings, setSettings] = useState({
    account: {
      email: user?.email || 'john@example.com',
      phone: user?.phone || user?.phoneNumber || '+1 (416) 555-0123',
      language: user?.language || 'English',
      timezone: user?.timezone || 'America/Edmonton',
      country: user?.country || 'Canada',
    },
    security: {
      twoFactorEnabled: Boolean(user?.security?.twoFactorEnabled),
      biometricLogin: Boolean(user?.security?.biometricLogin),
      sessionAlerts: true,
      passwordLastChanged: '14 days ago',
      activeSessions: 3,
    },
    notifications: {
      email: true,
      sms: false,
      push: true,
      taxDeadlineAlerts: true,
      documentRequests: true,
      marketingUpdates: false,
      caMessages: true,
      weeklySummary: true,
    },
    preferences: {
      theme: 'System',
      dateFormat: 'DD/MM/YYYY',
      currency: 'CAD',
      dashboardView: role === 'ca' ? 'Clients Overview' : 'My Tax Summary',
      compactMode: false,
      startWeekOn: 'Monday',
    },
    privacy: {
      profileVisibility: 'Private',
      documentSharing: role === 'ca' ? 'Team Only' : 'Assigned CA Only',
      analyticsConsent: true,
      marketingConsent: false,
      downloadAllowed: true,
    },
    integrations: {
      craConnected: false,
      quickbooksConnected: role === 'business_owner',
      googleDriveConnected: false,
      dropboxConnected: false,
      payrollConnected: false,
    },
    billing: {
      plan:
        role === 'ca'
          ? 'Professional Plan'
          : role === 'business_owner'
          ? 'Business Plan'
          : 'Starter Plan',
      renewalDate: '2026-12-31',
      autoRenew: true,
      paymentMethod: 'Visa ending in 4242',
      billingEmail: user?.email || 'john@example.com',
    },
    roleSettings: {
      taxClient: {
        defaultTaxYear: '2025',
        assignedTaxProfessionalVisibility: 'Enabled',
        documentReminders: 'Enabled',
      },
      businessOwner: {
        businessProfile: user?.businessInfo?.businessName || 'Not configured',
        gstWorkflow: true,
        expenseReviewMode: 'Monthly',
      },
      ca: {
        bookingVisibility: true,
        intakeMode: 'Approval Required',
        firmProfileStatus: 'Published',
      },
    },
  });

  const roleSection = useMemo(() => {
    if (role === 'ca') {
      return {
        title: 'Professional Preferences',
        description:
          'Manage how clients discover your profile and how intake works.',
        icon: Briefcase,
        cards: [
          {
            label: 'Booking visibility',
            value: settings.roleSettings.ca.bookingVisibility
              ? 'Enabled'
              : 'Disabled',
          },
          { label: 'Intake mode', value: settings.roleSettings.ca.intakeMode },
          {
            label: 'Firm profile',
            value: settings.roleSettings.ca.firmProfileStatus,
          },
        ],
      };
    }

    if (role === 'business_owner') {
      return {
        title: 'Business Settings',
        description:
          'Manage accounting workflows and business-specific defaults.',
        icon: Building2,
        cards: [
          {
            label: 'Business profile',
            value: settings.roleSettings.businessOwner.businessProfile,
          },
          {
            label: 'GST workflow',
            value: settings.roleSettings.businessOwner.gstWorkflow
              ? 'Enabled'
              : 'Disabled',
          },
          {
            label: 'Expense review',
            value: settings.roleSettings.businessOwner.expenseReviewMode,
          },
        ],
      };
    }

    return {
      title: 'Tax Preferences',
      description:
        'Control personal tax workflow defaults and reminders.',
      icon: FileText,
      cards: [
        {
          label: 'Default tax year',
          value: settings.roleSettings.taxClient.defaultTaxYear,
        },
        {
          label: 'Assigned tax professional',
          value:
            settings.roleSettings.taxClient.assignedTaxProfessionalVisibility,
        },
        {
          label: 'Document reminders',
          value: settings.roleSettings.taxClient.documentReminders,
        },
      ],
    };
  }, [role, settings.roleSettings]);

  const toggleSetting = (section, key) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key],
      },
    }));
  };

  const updateSetting = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const updateNestedSetting = (section, subsection, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [key]: value,
        },
      },
    }));
  };

  const handleSave = () => {
    setSaveState('saved');
    window.setTimeout(() => setSaveState('idle'), 1800);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account, security, notifications, privacy, billing, and integrations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700">
            {getRoleLabel(user)}
          </div>
          {saveState === 'saved' && (
            <div className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
              Changes saved
            </div>
          )}
          <Button
            variant="outline"
            className="text-warning-600 hover:text-warning-700"
            onClick={logout}
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4 xl:col-span-3">
          <Card className="sticky top-6">
            <Card.Body className="space-y-2 p-4">
              {sections.map((section) => (
                <SidebarItem
                  key={section.id}
                  icon={section.icon}
                  label={section.label}
                  danger={section.danger}
                  active={activeSection === section.id}
                  onClick={() => scrollToSection(section.id)}
                />
              ))}
            </Card.Body>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-8 xl:col-span-9">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <StatCard label="Plan" value={settings.billing.plan} />
            <StatCard label="2FA" value={settings.security.twoFactorEnabled ? 'Enabled' : 'Disabled'} />
            <StatCard label="Sessions" value={String(settings.security.activeSessions)} />
            <StatCard label="Notifications" value={settings.notifications.email || settings.notifications.push ? 'On' : 'Off'} />
          </div>

          <SettingsSection
            id="account"
            active={activeSection === 'account'}
            icon={User}
            title="Account"
            description="Basic account information and regional preferences."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputField
                label="Email"
                value={settings.account.email}
                onChange={(value) => updateSetting('account', 'email', value)}
              />
              <InputField
                label="Phone"
                value={settings.account.phone}
                onChange={(value) => updateSetting('account', 'phone', value)}
              />
              <SelectField
                label="Language"
                value={settings.account.language}
                options={['English', 'French']}
                onChange={(value) => updateSetting('account', 'language', value)}
              />
              <SelectField
                label="Time Zone"
                value={settings.account.timezone}
                options={['America/Edmonton', 'America/Toronto', 'America/Vancouver']}
                onChange={(value) => updateSetting('account', 'timezone', value)}
              />
              <SelectField
                label="Country"
                value={settings.account.country}
                options={['Canada', 'United States']}
                onChange={(value) => updateSetting('account', 'country', value)}
              />
            </div>
          </SettingsSection>

          <SettingsSection
            id="security"
            active={activeSection === 'security'}
            icon={Shield}
            title="Security"
            description="Protect your account and control sign-in settings."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <InfoCard icon={KeyRound} title="Password" value={settings.security.passwordLastChanged} subtitle="Last changed" />
              <InfoCard icon={History} title="Active Sessions" value={String(settings.security.activeSessions)} subtitle="Signed in devices" />
              <InfoCard icon={Shield} title="Protection" value={settings.security.twoFactorEnabled ? 'Strong' : 'Basic'} subtitle="Security status" />
            </div>

            <div className="mt-4 space-y-3">
              <ToggleRow
                icon={Smartphone}
                title="Two-factor authentication"
                description="Add an extra verification step during sign-in."
                checked={settings.security.twoFactorEnabled}
                onToggle={() => toggleSetting('security', 'twoFactorEnabled')}
              />
              <ToggleRow
                icon={Monitor}
                title="Biometric login"
                description="Allow device biometrics when supported."
                checked={settings.security.biometricLogin}
                onToggle={() => toggleSetting('security', 'biometricLogin')}
              />
              <ToggleRow
                icon={Mail}
                title="Session alerts"
                description="Notify you when a new device signs in."
                checked={settings.security.sessionAlerts}
                onToggle={() => toggleSetting('security', 'sessionAlerts')}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="outline">Change Password</Button>
              <Button variant="outline">Manage Devices</Button>
              <Button variant="outline">View Login History</Button>
            </div>
          </SettingsSection>

          <SettingsSection
            id="notifications"
            active={activeSection === 'notifications'}
            icon={Bell}
            title="Notifications"
            description="Choose how and when the platform contacts you."
          >
            <div className="space-y-3">
              <ToggleRow
                icon={Mail}
                title="Email notifications"
                description="Receive workflow, document, and account updates by email."
                checked={settings.notifications.email}
                onToggle={() => toggleSetting('notifications', 'email')}
              />
              <ToggleRow
                icon={Smartphone}
                title="SMS notifications"
                description="Receive text reminders for urgent items."
                checked={settings.notifications.sms}
                onToggle={() => toggleSetting('notifications', 'sms')}
              />
              <ToggleRow
                icon={Bell}
                title="Push notifications"
                description="Allow browser or mobile push alerts."
                checked={settings.notifications.push}
                onToggle={() => toggleSetting('notifications', 'push')}
              />
              <ToggleRow
                icon={FileText}
                title="Document requests"
                description="Get alerted when new tax documents are requested."
                checked={settings.notifications.documentRequests}
                onToggle={() => toggleSetting('notifications', 'documentRequests')}
              />
              <ToggleRow
                icon={AlertTriangle}
                title="Tax deadline alerts"
                description="Receive reminders about filing and payment deadlines."
                checked={settings.notifications.taxDeadlineAlerts}
                onToggle={() => toggleSetting('notifications', 'taxDeadlineAlerts')}
              />
              <ToggleRow
                icon={Mail}
                title="Messages from tax professional"
                description="Notify me when my CA or advisor sends a message."
                checked={settings.notifications.caMessages}
                onToggle={() => toggleSetting('notifications', 'caMessages')}
              />
              <ToggleRow
                icon={Bell}
                title="Weekly summary"
                description="Send a weekly digest of upcoming actions and missing items."
                checked={settings.notifications.weeklySummary}
                onToggle={() => toggleSetting('notifications', 'weeklySummary')}
              />
            </div>
          </SettingsSection>

          <SettingsSection
            id="preferences"
            active={activeSection === 'preferences'}
            icon={Globe}
            title="Preferences"
            description="Personalize appearance, layout, and defaults."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <SelectField
                label="Theme"
                value={settings.preferences.theme}
                options={['System', 'Light', 'Dark']}
                onChange={(value) => updateSetting('preferences', 'theme', value)}
              />
              <SelectField
                label="Date Format"
                value={settings.preferences.dateFormat}
                options={['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']}
                onChange={(value) => updateSetting('preferences', 'dateFormat', value)}
              />
              <SelectField
                label="Currency"
                value={settings.preferences.currency}
                options={['CAD', 'USD']}
                onChange={(value) => updateSetting('preferences', 'currency', value)}
              />
              <SelectField
                label="Default Dashboard"
                value={settings.preferences.dashboardView}
                options={role === 'ca' ? ['Clients Overview', 'Firm Activity'] : ['My Tax Summary', 'Documents', 'Receipts']}
                onChange={(value) => updateSetting('preferences', 'dashboardView', value)}
              />
              <SelectField
                label="Week Starts On"
                value={settings.preferences.startWeekOn}
                options={['Monday', 'Sunday']}
                onChange={(value) => updateSetting('preferences', 'startWeekOn', value)}
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <ThemePreview icon={Monitor} label="System" selected={settings.preferences.theme === 'System'} onClick={() => updateSetting('preferences', 'theme', 'System')} />
              <ThemePreview icon={Sun} label="Light" selected={settings.preferences.theme === 'Light'} onClick={() => updateSetting('preferences', 'theme', 'Light')} />
              <ThemePreview icon={Moon} label="Dark" selected={settings.preferences.theme === 'Dark'} onClick={() => updateSetting('preferences', 'theme', 'Dark')} />
            </div>

            <div className="mt-4 space-y-3">
              <ToggleRow
                icon={Palette}
                title="Compact mode"
                description="Show denser tables and cards across the app."
                checked={settings.preferences.compactMode}
                onToggle={() => toggleSetting('preferences', 'compactMode')}
              />
            </div>
          </SettingsSection>

          <SettingsSection
            id="privacy"
            active={activeSection === 'privacy'}
            icon={Lock}
            title="Privacy"
            description="Control visibility, sharing, and consent."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <SelectField
                label="Profile Visibility"
                value={settings.privacy.profileVisibility}
                options={['Private', 'Assigned Team Only', 'Public']}
                onChange={(value) => updateSetting('privacy', 'profileVisibility', value)}
              />
              <SelectField
                label="Document Sharing"
                value={settings.privacy.documentSharing}
                options={['Assigned CA Only', 'Team Only', 'Private']}
                onChange={(value) => updateSetting('privacy', 'documentSharing', value)}
              />
            </div>

            <div className="mt-4 space-y-3">
              <ToggleRow
                icon={Database}
                title="Analytics consent"
                description="Allow anonymous product analytics to improve the platform."
                checked={settings.privacy.analyticsConsent}
                onToggle={() => toggleSetting('privacy', 'analyticsConsent')}
              />
              <ToggleRow
                icon={Mail}
                title="Marketing consent"
                description="Allow product tips, releases, and promotional emails."
                checked={settings.privacy.marketingConsent}
                onToggle={() => toggleSetting('privacy', 'marketingConsent')}
              />
              <ToggleRow
                icon={FileText}
                title="Allow data export"
                description="Let administrators prepare downloadable account exports."
                checked={settings.privacy.downloadAllowed}
                onToggle={() => toggleSetting('privacy', 'downloadAllowed')}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="outline">Download My Data</Button>
              <Button variant="outline">View Activity Log</Button>
              <Button variant="outline">Manage Consent</Button>
            </div>
          </SettingsSection>

          <SettingsSection
            id="integrations"
            active={activeSection === 'integrations'}
            icon={Plug}
            title="Integrations"
            description="Connect external services for tax, storage, and bookkeeping."
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <IntegrationCard
                icon={Landmark}
                title="CRA Account"
                description="Import notices and account data securely."
                connected={settings.integrations.craConnected}
                onClick={() => toggleSetting('integrations', 'craConnected')}
              />
              <IntegrationCard
                icon={Briefcase}
                title="QuickBooks"
                description="Sync business income, expenses, and bookkeeping records."
                connected={settings.integrations.quickbooksConnected}
                onClick={() => toggleSetting('integrations', 'quickbooksConnected')}
              />
              <IntegrationCard
                icon={Globe}
                title="Google Drive"
                description="Import and back up tax files from Drive."
                connected={settings.integrations.googleDriveConnected}
                onClick={() => toggleSetting('integrations', 'googleDriveConnected')}
              />
              <IntegrationCard
                icon={Database}
                title="Dropbox"
                description="Sync folders and upload documents faster."
                connected={settings.integrations.dropboxConnected}
                onClick={() => toggleSetting('integrations', 'dropboxConnected')}
              />
              <IntegrationCard
                icon={Building2}
                title="Payroll Provider"
                description="Connect payroll data for employee-related workflows."
                connected={settings.integrations.payrollConnected}
                onClick={() => toggleSetting('integrations', 'payrollConnected')}
              />
            </div>
          </SettingsSection>

          <SettingsSection
            id="billing"
            active={activeSection === 'billing'}
            icon={CreditCard}
            title="Billing"
            description="Manage subscription, payment details, and invoices."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <StatCard label="Current Plan" value={settings.billing.plan} />
              <StatCard label="Renewal Date" value={settings.billing.renewalDate} />
              <StatCard label="Auto Renew" value={settings.billing.autoRenew ? 'Enabled' : 'Disabled'} />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputField
                label="Billing Email"
                value={settings.billing.billingEmail}
                onChange={(value) => updateSetting('billing', 'billingEmail', value)}
              />
              <InputField
                label="Payment Method"
                value={settings.billing.paymentMethod}
                onChange={(value) => updateSetting('billing', 'paymentMethod', value)}
              />
            </div>

            <div className="mt-4 space-y-3">
              <ToggleRow
                icon={CreditCard}
                title="Auto renew subscription"
                description="Automatically renew the current plan on the renewal date."
                checked={settings.billing.autoRenew}
                onToggle={() => toggleSetting('billing', 'autoRenew')}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="outline">Manage Subscription</Button>
              <Button variant="outline">Update Payment Method</Button>
              <Button variant="outline">Billing History</Button>
            </div>
          </SettingsSection>

          {role === 'ca' && (
            <SettingsSection
              id="office-hours"
              active={activeSection === 'office-hours'}
              icon={Clock3}
              title="Office Hours"
              description="Manage your weekly availability and consultation timings."
            >
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-gray-100 p-2 text-gray-700">
                      <Clock3 size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Office Hours</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Set the hours when clients can book or expect your practice to be available.
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => navigate('/ca/settings/office-hours')}
                  >
                    Manage Office Hours
                  </Button>
                </div>
              </div>
            </SettingsSection>
          )}

          <SettingsSection
            id="role"
            active={false}
            icon={roleSection.icon}
            title={roleSection.title}
            description={roleSection.description}
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {roleSection.cards.map((item) => (
                <StatCard key={item.label} label={item.label} value={item.value} />
              ))}
            </div>

            {role === 'tax_client' && (
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <SelectField
                  label="Default Tax Year"
                  value={settings.roleSettings.taxClient.defaultTaxYear}
                  options={['2024', '2025', '2026']}
                  onChange={(value) => updateNestedSetting('roleSettings', 'taxClient', 'defaultTaxYear', value)}
                />
                <SelectField
                  label="Assigned Tax Professional Visibility"
                  value={settings.roleSettings.taxClient.assignedTaxProfessionalVisibility}
                  options={['Enabled', 'Hidden']}
                  onChange={(value) => updateNestedSetting('roleSettings', 'taxClient', 'assignedTaxProfessionalVisibility', value)}
                />
                <SelectField
                  label="Document Reminders"
                  value={settings.roleSettings.taxClient.documentReminders}
                  options={['Enabled', 'Disabled']}
                  onChange={(value) => updateNestedSetting('roleSettings', 'taxClient', 'documentReminders', value)}
                />
              </div>
            )}

            {role === 'business_owner' && (
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <InputField
                  label="Business Profile Name"
                  value={settings.roleSettings.businessOwner.businessProfile}
                  onChange={(value) => updateNestedSetting('roleSettings', 'businessOwner', 'businessProfile', value)}
                />
                <SelectField
                  label="Expense Review Mode"
                  value={settings.roleSettings.businessOwner.expenseReviewMode}
                  options={['Weekly', 'Monthly', 'Quarterly']}
                  onChange={(value) => updateNestedSetting('roleSettings', 'businessOwner', 'expenseReviewMode', value)}
                />
                <div className="pt-6">
                  <ToggleRow
                    icon={Building2}
                    title="GST Workflow"
                    description="Enable GST-related review flows."
                    checked={settings.roleSettings.businessOwner.gstWorkflow}
                    onToggle={() =>
                      updateNestedSetting(
                        'roleSettings',
                        'businessOwner',
                        'gstWorkflow',
                        !settings.roleSettings.businessOwner.gstWorkflow
                      )
                    }
                  />
                </div>
              </div>
            )}

            {role === 'ca' && (
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <SelectField
                  label="Intake Mode"
                  value={settings.roleSettings.ca.intakeMode}
                  options={['Approval Required', 'Auto Accept']}
                  onChange={(value) => updateNestedSetting('roleSettings', 'ca', 'intakeMode', value)}
                />
                <SelectField
                  label="Firm Profile Status"
                  value={settings.roleSettings.ca.firmProfileStatus}
                  options={['Published', 'Draft']}
                  onChange={(value) => updateNestedSetting('roleSettings', 'ca', 'firmProfileStatus', value)}
                />
                <div className="pt-6">
                  <ToggleRow
                    icon={Briefcase}
                    title="Booking Visibility"
                    description="Let clients discover your booking link."
                    checked={settings.roleSettings.ca.bookingVisibility}
                    onToggle={() =>
                      updateNestedSetting(
                        'roleSettings',
                        'ca',
                        'bookingVisibility',
                        !settings.roleSettings.ca.bookingVisibility
                      )
                    }
                  />
                </div>
              </div>
            )}
          </SettingsSection>

          <SettingsSection
            id="danger"
            active={activeSection === 'danger'}
            icon={Trash2}
            title="Danger Zone"
            description="Sensitive account actions that affect access and data."
          >
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-red-900">Deactivate or permanently delete account</p>
                  <p className="mt-1 text-sm text-red-700">
                    These actions may remove account access, documents, integrations, and billing history.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                    Deactivate Account
                  </Button>
                  <Button variant="outline" className="border-red-400 text-red-800 hover:bg-red-100">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Need help before making changes? Contact support or export your data first.
            </div>
          </SettingsSection>

          <Card>
            <Card.Body className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium text-gray-900">Need help with account setup?</p>
                <p className="text-sm text-gray-500">Open support, read documentation, or ask your assigned professional.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline">
                  <BadgeHelp size={16} className="mr-2" />
                  Help Center
                </Button>
                <Button variant="outline">Contact Support</Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, active = false, danger = false, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-colors ${
      active
        ? 'bg-primary-50 text-primary-700'
        : danger
        ? 'text-red-700 hover:bg-red-50'
        : 'text-gray-700 hover:bg-gray-50'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </div>
    <ChevronRight size={16} className="opacity-60" />
  </button>
);

const SettingsSection = ({ id, active, icon: Icon, title, description, children }) => (
  <div id={id} className="scroll-mt-6">
    <Card className={active ? 'ring-2 ring-primary-100' : ''}>
      <Card.Header>
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-gray-100 p-2 text-gray-700">
            <Icon size={18} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </Card.Header>
      <Card.Body>{children}</Card.Body>
    </Card>
  </div>
);

const ToggleRow = ({ icon: Icon, title, description, checked, onToggle }) => (
  <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-gray-100 p-2 text-gray-700">
        <Icon size={16} />
      </div>
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </div>

    <button
      type="button"
      onClick={onToggle}
      className={`relative h-7 w-12 rounded-full transition ${checked ? 'bg-primary-600' : 'bg-gray-300'}`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${checked ? 'right-1' : 'left-1'}`}
      />
    </button>
  </div>
);

const InputField = ({ label, value, onChange }) => (
  <div>
    <p className="mb-1 text-sm text-gray-500">{label}</p>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-gray-400"
    />
  </div>
);

const SelectField = ({ label, value, options, onChange }) => (
  <div>
    <p className="mb-1 text-sm text-gray-500">{label}</p>
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
  </div>
);

const IntegrationCard = ({ icon: Icon, title, description, connected, onClick }) => (
  <div className="rounded-2xl border border-gray-200 p-4">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-gray-100 p-2 text-gray-700">
          <Icon size={16} />
        </div>
        <div>
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
          connected ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}
      >
        {connected ? 'Connected' : 'Not connected'}
      </span>
    </div>

    <div className="mt-4">
      <Button variant="outline" onClick={onClick}>
        {connected ? 'Disconnect' : 'Connect'}
      </Button>
    </div>
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="rounded-2xl bg-gray-50 p-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="mt-1 font-semibold text-gray-900">{value}</p>
  </div>
);

const InfoCard = ({ icon: Icon, title, value, subtitle }) => (
  <div className="rounded-2xl bg-gray-50 p-4">
    <div className="mb-2 flex items-center gap-2 text-gray-700">
      <Icon size={16} />
      <p className="text-sm font-medium">{title}</p>
    </div>
    <p className="text-lg font-semibold text-gray-900">{value}</p>
    <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
  </div>
);

const ThemePreview = ({ icon: Icon, label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-sm ${
      selected ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700'
    }`}
  >
    <Icon size={16} />
    {label}
  </button>
);

export default SettingsPage;