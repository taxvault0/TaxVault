import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Building,
  Award,
  FileCheck,
  Shield,
  Briefcase,
  Globe,
  Users,
  Calendar,
  DollarSign,
  Eye,
  EyeOff,
  Check,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  CreditCard,
  BadgeCheck,
  GraduationCap,
  BookOpen,
  Scale,
  Hammer,
  Star,
  FileText,
  Fingerprint,
  Key,
  ShieldCheck,
  Verified,
  Scroll,
  Stamp,
  Certificate,
  Gavel,
  Library,
  Network,
  Target,
  TrendingUp,
  PieChart,
  Calculator,
  Receipt,
  Landmark,
  Wallet,
  CreditCard as CreditCardIcon,
  Home,
  Globe2,
  MailOpen,
  MessageCircle,
  Video,
  CalendarClock,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  HelpCircle,
  Info,
  Upload,
  Download,
  Printer,
  Share2,
  Copy,
  Edit,
  Trash2,
  Plus,
  Minus,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  MoreVertical,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Link as LinkIcon,
  CheckSquare,
  Square
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import TermsModal from 'components/shared/TermsModal';
import { USER_TERMS, PRIVACY_POLICY, CA_TERMS } from 'constants/terms';
import { useAuth } from '../context/AuthContext';

// Error display components
const ErrorAlert = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{message}</p>
        </div>
      </div>
    </div>
  );
};

const ErrorField = ({ error }) => {
  if (!error) return null;
  return (
    <p className="text-sm text-red-600 mt-1 flex items-center">
      <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
      {error}
    </p>
  );
};

const RegisterCA = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [formError, setFormError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [professionalTermsAccepted, setProfessionalTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showProfessionalTermsModal, setShowProfessionalTermsModal] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    // Account Information
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    alternatePhone: '',
    
    // Professional Information
    caDesignation: '',
    caNumber: '',
    provinceOfRegistration: '',
    yearAdmitted: '',
    firmName: '',
    firmWebsite: '',
    yearsOfExperience: '',
    areasOfExpertise: [],
    languages: [],
    professionalDesignations: [],
    
    // Firm Information
    firmAddress: '',
    firmCity: '',
    firmProvince: '',
    firmPostalCode: '',
    firmCountry: 'Canada',
    firmPhone: '',
    firmEmail: '',
    firmSize: '',
    numberOfPartners: '',
    numberOfStaff: '',
    yearEstablished: '',
    
    // Professional Credentials
    professionalLiabilityInsurance: false,
    insuranceProvider: '',
    policyNumber: '',
    coverageAmount: '',
    expiryDate: '',
    peerReviewCompleted: false,
    peerReviewDate: '',
    peerReviewOutcome: '',
    peerReviewBody: '',
    
    // Regulatory Compliance
    cpaMemberInGoodStanding: false,
    licenseVerification: '',
    disciplinaryHistory: false,
    disciplinaryDetails: '',
    criminalRecordCheck: false,
    backgroundCheckConsent: false,
    
    // Practice Information
    practiceType: '',
    clientIndustries: [],
    averageClientsPerYear: '',
    minimumFee: '',
    maximumFee: '',
    acceptsCRA: false,
    offersVirtualServices: false,
    offersInPersonServices: true,
    serviceRadius: '',
    hoursOfOperation: '',
    weekendAvailability: false,
    emergencyContact: false,
    
    // Tax Specialties
    taxSpecialties: [],
    provincialSpecialties: [],
    internationalTax: false,
    usTax: false,
    crossBorder: false,
    estatePlanning: false,
    corporateRestructuring: false,
    mergersAcquisitions: false,
    
    // Client Demographics
    primaryClientType: [],
    averageClientSize: '',
    smallestClientRevenue: '',
    largestClientRevenue: '',
    nonprofitClients: false,
    indigenousClients: false,
    newcomerClients: false,
    
    // Technology & Tools
    accountingSoftware: [],
    taxSoftware: [],
    practiceManagementSoftware: '',
    offersPortalAccess: true,
    acceptsDigitalDocuments: true,
    usesEncryption: true,
    twoFactorAuth: true,
    
    // Billing & Payment
    billingMethod: '',
    acceptsCreditCard: false,
    acceptsInterac: false,
    acceptsCheque: true,
    paymentPlans: false,
    flatFees: false,
    hourlyRates: false,
    contingencyFees: false,
    
    // Professional Memberships
    professionalMemberships: [],
    localChapter: '',
    committeeMemberships: [],
    conferenceAttendance: false,
    continuingEducation: true,
    cpdHours: '',
    
    // References
    professionalReferences: [
      { name: '', email: '', phone: '', relationship: '', yearsKnown: '' }
    ],
    clientReferences: [
      { name: '', email: '', phone: '', company: '', yearsServed: '' }
    ],
    
    // Marketing Preferences
    profilePublic: true,
    acceptNewClients: true,
    featuredProfessional: false,
    receiveReferrals: true,
    newsletterSubscribed: true,
    
    // Verification Documents
    caCertificate: null,
    insuranceCertificate: null,
    peerReviewReport: null,
    criminalRecordCheck: null,
    professionalHeadshot: null,
    firmLogo: null,
    
    // Terms
    agreeToTerms: false,
    agreeToPrivacy: false,
    confirmAccuracy: false,
    authorizeVerification: false
  });

  const provinces = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
    'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island',
    'Quebec', 'Saskatchewan', 'Northwest Territories', 'Nunavut', 'Yukon'
  ];

  const caDesignations = [
    { value: 'CPA', label: 'Chartered Professional Accountant (CPA)' },
    { value: 'CA', label: 'Chartered Accountant (CA)' },
    { value: 'CMA', label: 'Certified Management Accountant (CMA)' },
    { value: 'CGA', label: 'Certified General Accountant (CGA)' },
    { value: 'CPA-USA', label: 'CPA (US)' },
    { value: 'other', label: 'Other International Designation' }
  ];

  const expertiseAreas = [
    'Personal Tax', 'Corporate Tax', 'GST/HST', 'Payroll', 'Bookkeeping',
    'Audit & Assurance', 'Financial Planning', 'Estate Planning', 'Business Valuation',
    'Mergers & Acquisitions', 'Insolvency', 'Forensic Accounting', 'International Tax',
    'US Cross-Border', 'Non-Profit Organizations', 'Indigenous Organizations',
    'Real Estate', 'Construction', 'Technology', 'Healthcare', 'Legal Professionals',
    'Entertainment', 'Agriculture', 'Fishing', 'Mining', 'Oil & Gas'
  ];

  const taxSpecialties = [
    'Personal Income Tax', 'Corporate Tax Planning', 'GST/HST Returns',
    'PST Returns', 'QST Returns', 'Payroll Remittances', 'T2 Corporation Returns',
    'T1 Personal Returns', 'T3 Trust Returns', 'T4/T4A Preparation',
    'T5013 Partnership Returns', 'Scientific Research & Experimental Development (SR&ED)',
    'Capital Gains Planning', 'Estate Planning', 'Tax Litigation',
    'Voluntary Disclosures', 'Tax Audits', 'CRA Representation'
  ];

  const provincialSpecialties = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
    'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island',
    'Quebec', 'Saskatchewan', 'Northwest Territories', 'Nunavut', 'Yukon',
    'Multiple Provinces', 'All Provinces'
  ];

  const clientIndustries = [
    'Construction', 'Real Estate', 'Technology', 'Healthcare',
    'Professional Services', 'Retail', 'Manufacturing', 'Transportation',
    'Agriculture', 'Mining', 'Oil & Gas', 'Hospitality',
    'Non-Profit', 'Indigenous Organizations', 'Entertainment', 'Education'
  ];

  const primaryClientTypes = [
    'Individuals', 'Families', 'Small Businesses', 'Corporations',
    'Non-Profits', 'Indigenous Organizations', 'High-Net-Worth Individuals',
    'Professionals (Doctors, Lawyers)', 'Contractors', 'Gig Workers',
    'Newcomers to Canada', 'Seniors', 'Students', 'Farmers'
  ];

  const accountingSoftware = [
    'QuickBooks Online', 'QuickBooks Desktop', 'Xero', 'Sage 50',
    'Sage Intacct', 'FreshBooks', 'Wave', 'Zero', 'Oracle NetSuite',
    'Microsoft Dynamics', 'SAP', 'Other'
  ];

  const taxSoftware = [
    'Profile', 'TaxPrep', 'DT Max', 'CanTax', 'QuickTax',
    'TurboTax', 'UFile', 'TaxCycle', 'CCH iFirm', 'Other'
  ];

  const billingMethods = [
    'Hourly Rate', 'Flat Fee', 'Value-Based', 'Retainer',
    'Contingency', 'Subscription', 'Project-Based'
  ];

  const professionalMemberships = [
    'CPA Canada', 'Provincial CPA Body', 'CICA', 'CMA Canada',
    'CGA Canada', 'AICPA', 'CRA Advisory Committee',
    'Canadian Tax Foundation', 'STEP Canada', 'CFA Institute',
    'IIA', 'CIA', 'CISA'
  ];

  const languages = [
    'English', 'French', 'Spanish', 'Mandarin', 'Cantonese',
    'Punjabi', 'Tagalog', 'Arabic', 'German', 'Italian',
    'Portuguese', 'Russian', 'Urdu', 'Hindi', 'Vietnamese'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleFileUpload = (field, file) => {
    setUploadedFiles(prev => ({ ...prev, [field]: file }));
    setFormData(prev => ({ ...prev, [field]: file.name }));
  };

  const validateStep = () => {
    const newErrors = {};
    let hasErrors = false;

    if (currentStep === 1) {
      if (!formData.firstName?.trim()) {
        newErrors.firstName = 'First name is required';
        hasErrors = true;
      }
      if (!formData.lastName?.trim()) {
        newErrors.lastName = 'Last name is required';
        hasErrors = true;
      }
      if (!formData.email?.trim()) {
        newErrors.email = 'Email address is required';
        hasErrors = true;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address (e.g., name@example.com)';
        hasErrors = true;
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
        hasErrors = true;
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
        hasErrors = true;
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match. Please check and try again.';
        hasErrors = true;
      }
      if (!formData.phone?.trim()) {
        newErrors.phone = 'Phone number is required';
        hasErrors = true;
      }
    }

    if (currentStep === 2) {
      if (!formData.caDesignation) {
        newErrors.caDesignation = 'Please select your CA designation';
        hasErrors = true;
      }
      if (!formData.caNumber?.trim()) {
        newErrors.caNumber = 'CA number is required';
        hasErrors = true;
      }
      if (!formData.provinceOfRegistration) {
        newErrors.provinceOfRegistration = 'Please select your province of registration';
        hasErrors = true;
      }
      if (!formData.yearAdmitted) {
        newErrors.yearAdmitted = 'Year admitted is required';
        hasErrors = true;
      } else if (formData.yearAdmitted < 1950 || formData.yearAdmitted > new Date().getFullYear()) {
        newErrors.yearAdmitted = `Year must be between 1950 and ${new Date().getFullYear()}`;
        hasErrors = true;
      }
      if (!formData.firmName?.trim()) {
        newErrors.firmName = 'Firm name is required';
        hasErrors = true;
      }
      if (!formData.yearsOfExperience) {
        newErrors.yearsOfExperience = 'Years of experience is required';
        hasErrors = true;
      } else if (formData.yearsOfExperience < 0 || formData.yearsOfExperience > 70) {
        newErrors.yearsOfExperience = 'Please enter a valid number of years (0-70)';
        hasErrors = true;
      }
    }

    if (currentStep === 3) {
      if (!formData.firmAddress?.trim()) {
        newErrors.firmAddress = 'Firm address is required';
        hasErrors = true;
      }
      if (!formData.firmCity?.trim()) {
        newErrors.firmCity = 'City is required';
        hasErrors = true;
      }
      if (!formData.firmProvince) {
        newErrors.firmProvince = 'Please select a province';
        hasErrors = true;
      }
      if (!formData.firmPostalCode?.trim()) {
        newErrors.firmPostalCode = 'Postal code is required';
        hasErrors = true;
      } else if (!/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(formData.firmPostalCode)) {
        newErrors.firmPostalCode = 'Please enter a valid Canadian postal code (e.g., A1A 1A1)';
        hasErrors = true;
      }
      if (!formData.firmPhone?.trim()) {
        newErrors.firmPhone = 'Firm phone number is required';
        hasErrors = true;
      }
      if (!formData.firmEmail?.trim()) {
        newErrors.firmEmail = 'Firm email is required';
        hasErrors = true;
      } else if (!/\S+@\S+\.\S+/.test(formData.firmEmail)) {
        newErrors.firmEmail = 'Please enter a valid email address';
        hasErrors = true;
      }
    }

    if (currentStep === 4) {
      if (!formData.professionalLiabilityInsurance) {
        newErrors.professionalLiabilityInsurance = 'You must confirm that you have professional liability insurance';
        hasErrors = true;
      }
      if (formData.professionalLiabilityInsurance) {
        if (!formData.insuranceProvider?.trim()) {
          newErrors.insuranceProvider = 'Insurance provider name is required';
          hasErrors = true;
        }
        if (!formData.policyNumber?.trim()) {
          newErrors.policyNumber = 'Policy number is required';
          hasErrors = true;
        }
        if (!formData.expiryDate) {
          newErrors.expiryDate = 'Policy expiry date is required';
          hasErrors = true;
        }
      }
      if (!formData.cpaMemberInGoodStanding) {
        newErrors.cpaMemberInGoodStanding = 'You must confirm that you are a CPA member in good standing';
        hasErrors = true;
      }
    }

    if (currentStep === 5) {
      // Practice Information - no required fields for now
    }

    if (currentStep === 6) {
      // Specialties - no required fields
    }

    if (currentStep === 7) {
      if (!uploadedFiles.caCertificate) {
        newErrors.caCertificate = 'CA certificate is required for verification';
        hasErrors = true;
      }
      if (!formData.authorizeVerification) {
        newErrors.authorizeVerification = 'You must authorize verification of your credentials';
        hasErrors = true;
      }
    }

    if (currentStep === 8) {
      if (!termsAccepted) newErrors.terms = 'You must agree to the Terms and Conditions';
      if (!privacyAccepted) newErrors.privacy = 'You must agree to the Privacy Policy';
      if (!professionalTermsAccepted) newErrors.professionalTerms = 'You must agree to the Professional Terms';
      if (!formData.confirmAccuracy) {
        newErrors.confirmAccuracy = 'You must confirm that all information is accurate';
        hasErrors = true;
      }
    }

    setErrors(newErrors);
    
    // Show a summary error if there are validation errors
    if (hasErrors) {
      setFormError(`Please fix the ${Object.keys(newErrors).length} error(s) above before proceeding.`);
    } else {
      setFormError('');
    }
    
    return !hasErrors;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
      setFormError('');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) return;

    setLoading(true);
    try {
      // Register CA with all form data
      const result = await register({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: 'ca',
        profile: formData,
        termsAccepted: true,
        privacyAccepted: true,
        professionalTermsAccepted: true,
        termsAcceptedAt: new Date().toISOString()
      });
      
      if (result.success) {
        // Show success message and redirect to verification pending page
        navigate('/ca/verification-pending');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Account', icon: User },
    { number: 2, title: 'Professional', icon: Award },
    { number: 3, title: 'Firm Details', icon: Building },
    { number: 4, title: 'Credentials', icon: Shield },
    { number: 5, title: 'Practice', icon: Briefcase },
    { number: 6, title: 'Specialties', icon: Target },
    { number: 7, title: 'Verification', icon: FileCheck },
    { number: 8, title: 'Review', icon: Check }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary-600">TaxVault</h1>
          </Link>
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">CA Registration</h2>
          <p className="text-gray-600 mt-2">Join as a Chartered Accountant and grow your practice</p>
        </div>

        {/* Verification Notice */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Verified className="text-primary-500 mr-3 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="text-sm font-medium text-primary-700">Professional Verification Required</p>
              <p className="text-xs text-primary-600 mt-1">
                All CA registrations are verified with the provincial CPA body. 
                Please have your CA number and supporting documents ready.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step.number
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check size={20} />
                    ) : (
                      <step.icon size={20} />
                    )}
                  </div>
                  <span className="text-xs mt-2 text-gray-600">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step.number ? 'bg-primary-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Registration Form */}
        <Card className="shadow-xl">
          <Card.Body className="p-8">
            <form onSubmit={handleSubmit}>
              {/* Form Error Alert */}
              {formError && <ErrorAlert message={formError} />}

              {/* Step 1: Account Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Account Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.firstName 
                              ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                              : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                          }`}
                          placeholder="John"
                        />
                      </div>
                      <ErrorField error={errors.firstName} />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.lastName 
                              ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                              : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                          }`}
                          placeholder="Doe"
                        />
                      </div>
                      <ErrorField error={errors.lastName} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.email 
                            ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                            : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                        }`}
                        placeholder="ca@accountingfirm.ca"
                      />
                    </div>
                    <ErrorField error={errors.email} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.password 
                              ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                              : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                          }`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                        </button>
                      </div>
                      <ErrorField error={errors.password} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.confirmPassword 
                              ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                              : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                          }`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showConfirmPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                        </button>
                      </div>
                      <ErrorField error={errors.confirmPassword} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.phone 
                              ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                              : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                          }`}
                          placeholder="(416) 555-0123"
                        />
                      </div>
                      <ErrorField error={errors.phone} />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alternate Phone (Optional)
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="tel"
                          name="alternatePhone"
                          value={formData.alternatePhone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                          placeholder="(416) 555-0124"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <Shield className="text-primary-500 mr-3 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-sm font-medium text-primary-700">Secure & Encrypted</p>
                        <p className="text-xs text-primary-600 mt-1">
                          Your professional information is protected with bank-level AES-256 encryption.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Professional Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Professional Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CA Designation <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="caDesignation"
                      value={formData.caDesignation}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.caDesignation 
                          ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                          : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                      }`}
                    >
                      <option value="">Select your designation</option>
                      {caDesignations.map(des => (
                        <option key={des.value} value={des.value}>{des.label}</option>
                      ))}
                    </select>
                    <ErrorField error={errors.caDesignation} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CA Number / License Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="caNumber"
                          value={formData.caNumber}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.caNumber 
                              ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                              : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                          }`}
                          placeholder="123456"
                        />
                      </div>
                      <ErrorField error={errors.caNumber} />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Province of Registration <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="provinceOfRegistration"
                        value={formData.provinceOfRegistration}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.provinceOfRegistration 
                            ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                            : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                        }`}
                      >
                        <option value="">Select province</option>
                        {provinces.map(prov => (
                          <option key={prov} value={prov}>{prov}</option>
                        ))}
                      </select>
                      <ErrorField error={errors.provinceOfRegistration} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year Admitted <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="number"
                          name="yearAdmitted"
                          value={formData.yearAdmitted}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.yearAdmitted 
                              ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                              : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                          }`}
                          placeholder="2010"
                          min="1950"
                          max={new Date().getFullYear()}
                        />
                      </div>
                      <ErrorField error={errors.yearAdmitted} />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Years of Experience <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="number"
                          name="yearsOfExperience"
                          value={formData.yearsOfExperience}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.yearsOfExperience 
                              ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                              : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                          }`}
                          placeholder="12"
                          min="0"
                          max="70"
                        />
                      </div>
                      <ErrorField error={errors.yearsOfExperience} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Firm Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        name="firmName"
                        value={formData.firmName}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.firmName 
                            ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                            : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                        }`}
                        placeholder="Smith & Associates LLP"
                      />
                    </div>
                    <ErrorField error={errors.firmName} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Firm Website (Optional)
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="url"
                        name="firmWebsite"
                        value={formData.firmWebsite}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                        placeholder="https://www.smithassociates.ca"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Areas of Expertise
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {expertiseAreas.slice(0, 10).map(area => (
                        <label key={area} className="flex items-center">
                          <input
                            type="checkbox"
                            value={area}
                            checked={formData.areasOfExpertise.includes(area)}
                            onChange={() => handleArrayChange('areasOfExpertise', area)}
                            className="w-4 h-4 text-primary-500 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{area}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Languages Spoken
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {languages.map(lang => (
                        <label key={lang} className="flex items-center">
                          <input
                            type="checkbox"
                            value={lang}
                            checked={formData.languages.includes(lang)}
                            onChange={() => handleArrayChange('languages', lang)}
                            className="w-4 h-4 text-primary-500 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Firm Details */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Firm Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Firm Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        name="firmAddress"
                        value={formData.firmAddress}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.firmAddress 
                            ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                            : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                        }`}
                        placeholder="123 Business Street"
                      />
                    </div>
                    <ErrorField error={errors.firmAddress} />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firmCity"
                        value={formData.firmCity}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.firmCity 
                            ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                            : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                        }`}
                        placeholder="Toronto"
                      />
                      <ErrorField error={errors.firmCity} />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Province <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="firmProvince"
                        value={formData.firmProvince}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.firmProvince 
                            ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                            : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                        }`}
                      >
                        <option value="">Province</option>
                        {provinces.map(prov => (
                          <option key={prov} value={prov}>{prov}</option>
                        ))}
                      </select>
                      <ErrorField error={errors.firmProvince} />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firmPostalCode"
                        value={formData.firmPostalCode}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.firmPostalCode 
                            ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                            : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                        }`}
                        placeholder="A1A 1A1"
                      />
                      <ErrorField error={errors.firmPostalCode} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Firm Country
                    </label>
                    <input
                      type="text"
                      name="firmCountry"
                      value={formData.firmCountry}
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Firm Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="tel"
                          name="firmPhone"
                          value={formData.firmPhone}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.firmPhone 
                              ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                              : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                          }`}
                          placeholder="(416) 555-0123"
                        />
                      </div>
                      <ErrorField error={errors.firmPhone} />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Firm Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="email"
                          name="firmEmail"
                          value={formData.firmEmail}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.firmEmail 
                              ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                              : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                          }`}
                          placeholder="info@firm.ca"
                        />
                      </div>
                      <ErrorField error={errors.firmEmail} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Firm Size
                      </label>
                      <select
                        name="firmSize"
                        value={formData.firmSize}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                      >
                        <option value="">Select size</option>
                        <option value="solo">Solo Practitioner</option>
                        <option value="small">Small (2-5 professionals)</option>
                        <option value="medium">Medium (6-20 professionals)</option>
                        <option value="large">Large (21+ professionals)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Partners
                      </label>
                      <input
                        type="number"
                        name="numberOfPartners"
                        value={formData.numberOfPartners}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                        min="0"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Staff
                      </label>
                      <input
                        type="number"
                        name="numberOfStaff"
                        value={formData.numberOfStaff}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                        min="0"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year Established
                    </label>
                    <input
                      type="number"
                      name="yearEstablished"
                      value={formData.yearEstablished}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                      min="1900"
                      max={new Date().getFullYear()}
                      placeholder="2005"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Professional Credentials */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Professional Credentials</h3>
                  
                  <div className="bg-warning-50 p-4 rounded-lg mb-4">
                    <div className="flex items-start">
                      <AlertCircle className="text-warning-500 mr-3 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-sm font-medium text-warning-700">Verification Required</p>
                        <p className="text-xs text-warning-600 mt-1">
                          Your credentials will be verified with the provincial CPA body.
                          Please ensure all information is accurate.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Liability Insurance */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                      <Shield className="text-primary-500 mr-2" size={18} />
                      Professional Liability Insurance
                    </h4>
                    
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="professionalLiabilityInsurance"
                          checked={formData.professionalLiabilityInsurance}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary-500 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          I have active professional liability insurance
                        </span>
                      </label>
                      {errors.professionalLiabilityInsurance && (
                        <ErrorField error={errors.professionalLiabilityInsurance} />
                      )}

                      {formData.professionalLiabilityInsurance && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Insurance Provider <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="insuranceProvider"
                              value={formData.insuranceProvider}
                              onChange={handleChange}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.insuranceProvider 
                                  ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                                  : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                              }`}
                              placeholder="Insurance company name"
                            />
                            <ErrorField error={errors.insuranceProvider} />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Policy Number <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="policyNumber"
                              value={formData.policyNumber}
                              onChange={handleChange}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.policyNumber 
                                  ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                                  : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                              }`}
                              placeholder="POL-123456"
                            />
                            <ErrorField error={errors.policyNumber} />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Coverage Amount
                            </label>
                            <input
                              type="text"
                              name="coverageAmount"
                              value={formData.coverageAmount}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                              placeholder="$1,000,000"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Expiry Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleChange}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                errors.expiryDate 
                                  ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                                  : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                              }`}
                            />
                            <ErrorField error={errors.expiryDate} />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Insurance Certificate
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                              <input
                                type="file"
                                id="insuranceCertificate"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileUpload('insuranceCertificate', e.target.files[0])}
                              />
                              <label htmlFor="insuranceCertificate" className="cursor-pointer">
                                <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                                <p className="text-sm text-gray-600">
                                  Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  PDF, PNG, JPG up to 10MB
                                </p>
                              </label>
                              {uploadedFiles.insuranceCertificate && (
                                <p className="text-sm text-green-600 mt-2">
                                  ✓ {uploadedFiles.insuranceCertificate.name}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CPA Membership */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                      <Award className="text-primary-500 mr-2" size={18} />
                      CPA Membership
                    </h4>
                    
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="cpaMemberInGoodStanding"
                          checked={formData.cpaMemberInGoodStanding}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary-500 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          I am a member in good standing with the CPA body
                        </span>
                      </label>
                      {errors.cpaMemberInGoodStanding && (
                        <ErrorField error={errors.cpaMemberInGoodStanding} />
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          License Verification Number (Optional)
                        </label>
                        <input
                          type="text"
                          name="licenseVerification"
                          value={formData.licenseVerification}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                          placeholder="Enter verification code if available"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Peer Review */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                      <FileCheck className="text-primary-500 mr-2" size={18} />
                      Peer Review
                    </h4>
                    
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="peerReviewCompleted"
                          checked={formData.peerReviewCompleted}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary-500 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          I have completed peer review within the last 3 years
                        </span>
                      </label>

                      {formData.peerReviewCompleted && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Peer Review Date
                            </label>
                            <input
                              type="date"
                              name="peerReviewDate"
                              value={formData.peerReviewDate}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Outcome
                            </label>
                            <select
                              name="peerReviewOutcome"
                              value={formData.peerReviewOutcome}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                            >
                              <option value="">Select outcome</option>
                              <option value="pass">Pass</option>
                              <option value="pass-with-conditions">Pass with Conditions</option>
                              <option value="pending">Pending</option>
                            </select>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Peer Review Report
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                              <input
                                type="file"
                                id="peerReviewReport"
                                className="hidden"
                                accept=".pdf"
                                onChange={(e) => handleFileUpload('peerReviewReport', e.target.files[0])}
                              />
                              <label htmlFor="peerReviewReport" className="cursor-pointer">
                                <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                                <p className="text-sm text-gray-600">
                                  Click to upload peer review report
                                </p>
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Disciplinary History */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                      <Gavel className="text-primary-500 mr-2" size={18} />
                      Disciplinary History
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="disciplinaryHistory"
                            value="false"
                            checked={formData.disciplinaryHistory === false}
                            onChange={() => setFormData(prev => ({ ...prev, disciplinaryHistory: false }))}
                            className="w-4 h-4 text-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            No disciplinary history
                          </span>
                        </label>
                      </div>
                      
                      <div>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="disciplinaryHistory"
                            value="true"
                            checked={formData.disciplinaryHistory === true}
                            onChange={() => setFormData(prev => ({ ...prev, disciplinaryHistory: true }))}
                            className="w-4 h-4 text-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            I have disciplinary history to disclose
                          </span>
                        </label>
                      </div>

                      {formData.disciplinaryHistory && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Please provide details
                          </label>
                          <textarea
                            name="disciplinaryDetails"
                            value={formData.disciplinaryDetails}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                            placeholder="Explain the nature of the disciplinary action, dates, and current status..."
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Criminal Record Check */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                      <Fingerprint className="text-primary-500 mr-2" size={18} />
                      Criminal Record Check
                    </h4>
                    
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="criminalRecordCheck"
                          checked={formData.criminalRecordCheck}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary-500 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          I consent to a criminal record check
                        </span>
                      </label>

                      {formData.criminalRecordCheck && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Criminal Record Check (if available)
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                            <input
                              type="file"
                              id="criminalRecordCheck"
                              className="hidden"
                              accept=".pdf"
                              onChange={(e) => handleFileUpload('criminalRecordCheck', e.target.files[0])}
                            />
                            <label htmlFor="criminalRecordCheck" className="cursor-pointer">
                              <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                              <p className="text-sm text-gray-600">
                                Click to upload document
                              </p>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Practice Information */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Practice Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Practice Type
                      </label>
                      <select
                        name="practiceType"
                        value={formData.practiceType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                      >
                        <option value="">Select practice type</option>
                        <option value="sole">Sole Proprietorship</option>
                        <option value="partnership">Partnership</option>
                        <option value="llp">LLP</option>
                        <option value="corporation">Professional Corporation</option>
                        <option value="multi">Multi-disciplinary Practice</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Accepting New Clients?
                      </label>
                      <select
                        name="acceptNewClients"
                        value={formData.acceptNewClients}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                      >
                        <option value="true">Yes, accepting new clients</option>
                        <option value="false">No, not at this time</option>
                        <option value="selective">Selective - only certain types</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Client Types
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {primaryClientTypes.map(type => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            value={type}
                            checked={formData.primaryClientType.includes(type)}
                            onChange={() => handleArrayChange('primaryClientType', type)}
                            className="w-4 h-4 text-primary-500 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Average Clients/Year
                      </label>
                      <input
                        type="number"
                        name="averageClientsPerYear"
                        value={formData.averageClientsPerYear}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                        placeholder="150"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Fee ($)
                      </label>
                      <input
                        type="number"
                        name="minimumFee"
                        value={formData.minimumFee}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                        placeholder="500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maximum Fee ($)
                      </label>
                      <input
                        type="number"
                        name="maximumFee"
                        value={formData.maximumFee}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                        placeholder="5000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Offerings
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="acceptsCRA"
                            checked={formData.acceptsCRA}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary-500 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">CRA Representation</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="offersVirtualServices"
                            checked={formData.offersVirtualServices}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary-500 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Virtual/Remote Services</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="offersInPersonServices"
                            checked={formData.offersInPersonServices}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary-500 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">In-Person Meetings</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="weekendAvailability"
                            checked={formData.weekendAvailability}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary-500 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Weekend Appointments</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="emergencyContact"
                            checked={formData.emergencyContact}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary-500 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Emergency Tax Support</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Service Radius (km)
                        </label>
                        <input
                          type="number"
                          name="serviceRadius"
                          value={formData.serviceRadius}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                          placeholder="50"
                        />
                      </div>
                      
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hours of Operation
                        </label>
                        <input
                          type="text"
                          name="hoursOfOperation"
                          value={formData.hoursOfOperation}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                          placeholder="e.g., Mon-Fri 9am-5pm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Specialties & Technology */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Specialties & Technology</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Specialties
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {taxSpecialties.map(specialty => (
                        <label key={specialty} className="flex items-center">
                          <input
                            type="checkbox"
                            value={specialty}
                            checked={formData.taxSpecialties.includes(specialty)}
                            onChange={() => handleArrayChange('taxSpecialties', specialty)}
                            className="w-4 h-4 text-primary-500 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{specialty}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Provincial Specialties
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {provincialSpecialties.map(prov => (
                        <label key={prov} className="flex items-center">
                          <input
                            type="checkbox"
                            value={prov}
                            checked={formData.provincialSpecialties.includes(prov)}
                            onChange={() => handleArrayChange('provincialSpecialties', prov)}
                            className="w-4 h-4 text-primary-500 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{prov}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="internationalTax"
                        checked={formData.internationalTax}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-500 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">International Tax</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="usTax"
                        checked={formData.usTax}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-500 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">US Tax</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="crossBorder"
                        checked={formData.crossBorder}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-500 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Cross-Border</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="estatePlanning"
                        checked={formData.estatePlanning}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-500 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Estate Planning</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="corporateRestructuring"
                        checked={formData.corporateRestructuring}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-500 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Corporate Restructuring</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="mergersAcquisitions"
                        checked={formData.mergersAcquisitions}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-500 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Mergers & Acquisitions</span>
                    </label>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-medium text-gray-800 mb-4">Technology & Software</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Accounting Software
                        </label>
                        <div className="space-y-2">
                          {accountingSoftware.map(software => (
                            <label key={software} className="flex items-center">
                              <input
                                type="checkbox"
                                value={software}
                                checked={formData.accountingSoftware.includes(software)}
                                onChange={() => handleArrayChange('accountingSoftware', software)}
                                className="w-4 h-4 text-primary-500 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">{software}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tax Software
                        </label>
                        <div className="space-y-2">
                          {taxSoftware.map(software => (
                            <label key={software} className="flex items-center">
                              <input
                                type="checkbox"
                                value={software}
                                checked={formData.taxSoftware.includes(software)}
                                onChange={() => handleArrayChange('taxSoftware', software)}
                                className="w-4 h-4 text-primary-500 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">{software}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Practice Management Software
                        </label>
                        <input
                          type="text"
                          name="practiceManagementSoftware"
                          value={formData.practiceManagementSoftware}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                          placeholder="e.g., Karbon, Canopy, etc."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="offersPortalAccess"
                            checked={formData.offersPortalAccess}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary-500 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Client Portal Access</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="acceptsDigitalDocuments"
                            checked={formData.acceptsDigitalDocuments}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary-500 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Digital Document Signing</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="usesEncryption"
                            checked={formData.usesEncryption}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary-500 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">End-to-End Encryption</span>
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="twoFactorAuth"
                            checked={formData.twoFactorAuth}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary-500 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Two-Factor Authentication</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Verification & Documents */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Verification & Documents</h3>
                  
                  <div className="bg-warning-50 p-4 rounded-lg mb-4">
                    <div className="flex items-start">
                      <Upload className="text-warning-500 mr-3 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-sm font-medium text-warning-700">Document Upload Required</p>
                        <p className="text-xs text-warning-600 mt-1">
                          Please upload the following documents to verify your professional status.
                          All documents are encrypted and securely stored.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Required Documents */}
                  <div className="space-y-4">
                    {/* CA Certificate */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                        <Award className="text-primary-500 mr-2" size={18} />
                        CA Certificate / License
                        <span className="text-red-500 text-xs ml-2">Required</span>
                      </h4>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                        <input
                          type="file"
                          id="caCertificate"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload('caCertificate', e.target.files[0])}
                        />
                        <label htmlFor="caCertificate" className="cursor-pointer">
                          <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                          <p className="text-sm text-gray-600">
                            Click to upload your CA certificate or license
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PDF, PNG, JPG up to 10MB
                          </p>
                        </label>
                        {uploadedFiles.caCertificate && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ {uploadedFiles.caCertificate.name}
                          </p>
                        )}
                      </div>
                      {errors.caCertificate && <ErrorField error={errors.caCertificate} />}
                    </div>

                    {/* Professional Headshot */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                        <User className="text-primary-500 mr-2" size={18} />
                        Professional Headshot
                        <span className="text-gray-500 text-xs ml-2">Optional</span>
                      </h4>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                        <input
                          type="file"
                          id="professionalHeadshot"
                          className="hidden"
                          accept=".jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload('professionalHeadshot', e.target.files[0])}
                        />
                        <label htmlFor="professionalHeadshot" className="cursor-pointer">
                          <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                          <p className="text-sm text-gray-600">
                            Click to upload your professional photo
                          </p>
                        </label>
                        {uploadedFiles.professionalHeadshot && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ {uploadedFiles.professionalHeadshot.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Firm Logo */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                        <Building className="text-primary-500 mr-2" size={18} />
                        Firm Logo
                        <span className="text-gray-500 text-xs ml-2">Optional</span>
                      </h4>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                        <input
                          type="file"
                          id="firmLogo"
                          className="hidden"
                          accept=".jpg,.jpeg,.png,.svg"
                          onChange={(e) => handleFileUpload('firmLogo', e.target.files[0])}
                        />
                        <label htmlFor="firmLogo" className="cursor-pointer">
                          <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                          <p className="text-sm text-gray-600">
                            Click to upload your firm logo
                          </p>
                        </label>
                        {uploadedFiles.firmLogo && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ {uploadedFiles.firmLogo.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Professional References */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-medium text-gray-800 mb-4">Professional References</h4>
                    
                    {formData.professionalReferences.map((ref, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4 relative">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newRefs = formData.professionalReferences.filter((_, i) => i !== index);
                              setFormData(prev => ({ ...prev, professionalReferences: newRefs }));
                            }}
                            className="absolute top-2 right-2 text-gray-400 hover:text-warning-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Reference Name
                            </label>
                            <input
                              type="text"
                              value={ref.name}
                              onChange={(e) => {
                                const newRefs = [...formData.professionalReferences];
                                newRefs[index].name = e.target.value;
                                setFormData(prev => ({ ...prev, professionalReferences: newRefs }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                              placeholder="John Smith, CA"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              value={ref.email}
                              onChange={(e) => {
                                const newRefs = [...formData.professionalReferences];
                                newRefs[index].email = e.target.value;
                                setFormData(prev => ({ ...prev, professionalReferences: newRefs }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                              placeholder="john@accountingfirm.ca"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone
                            </label>
                            <input
                              type="text"
                              value={ref.phone}
                              onChange={(e) => {
                                const newRefs = [...formData.professionalReferences];
                                newRefs[index].phone = e.target.value;
                                setFormData(prev => ({ ...prev, professionalReferences: newRefs }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                              placeholder="(416) 555-0123"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Relationship
                            </label>
                            <input
                              type="text"
                              value={ref.relationship}
                              onChange={(e) => {
                                const newRefs = [...formData.professionalReferences];
                                newRefs[index].relationship = e.target.value;
                                setFormData(prev => ({ ...prev, professionalReferences: newRefs }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                              placeholder="Partner / Colleague"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Years Known
                            </label>
                            <input
                              type="text"
                              value={ref.yearsKnown}
                              onChange={(e) => {
                                const newRefs = [...formData.professionalReferences];
                                newRefs[index].yearsKnown = e.target.value;
                                setFormData(prev => ({ ...prev, professionalReferences: newRefs }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                              placeholder="5"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          professionalReferences: [
                            ...prev.professionalReferences,
                            { name: '', email: '', phone: '', relationship: '', yearsKnown: '' }
                          ]
                        }));
                      }}
                    >
                      <Plus size={16} className="mr-2" />
                      Add Another Reference
                    </Button>
                  </div>

                  {/* Consent Checkboxes */}
                  <div className="space-y-3 pt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="authorizeVerification"
                        checked={formData.authorizeVerification}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-500 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        I authorize TaxVault to verify my professional credentials with the provincial CPA body
                      </span>
                    </label>
                    {errors.authorizeVerification && (
                      <ErrorField error={errors.authorizeVerification} />
                    )}

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="backgroundCheckConsent"
                        checked={formData.backgroundCheckConsent}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-500 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        I consent to a background check as part of the verification process
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 8: Review & Submit */}
              {currentStep === 8 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Review & Submit</h3>
                  
                  <div className="bg-green-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center">
                      <CheckCircle className="text-green-500 mr-3" size={24} />
                      <div>
                        <p className="font-medium text-green-700">Almost done!</p>
                        <p className="text-sm text-green-600">
                          Please review your information before submitting for verification.
                          Our team will review your application within 2-3 business days.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Summary */}
                  <Card>
                    <Card.Header>
                      <h4 className="font-medium flex items-center">
                        <Award className="mr-2 text-primary-500" size={18} />
                        Professional Summary
                      </h4>
                    </Card.Header>
                    <Card.Body className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Name:</span> {formData.firstName} {formData.lastName}</p>
                      <p><span className="text-gray-500">Designation:</span> {caDesignations.find(d => d.value === formData.caDesignation)?.label}</p>
                      <p><span className="text-gray-500">CA Number:</span> {formData.caNumber}</p>
                      <p><span className="text-gray-500">Province:</span> {formData.provinceOfRegistration}</p>
                      <p><span className="text-gray-500">Experience:</span> {formData.yearsOfExperience} years</p>
                      <p><span className="text-gray-500">Firm:</span> {formData.firmName}</p>
                    </Card.Body>
                  </Card>

                  {/* Credentials Summary */}
                  <Card>
                    <Card.Header>
                      <h4 className="font-medium flex items-center">
                        <Shield className="mr-2 text-primary-500" size={18} />
                        Credentials Status
                      </h4>
                    </Card.Header>
                    <Card.Body>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          {formData.professionalLiabilityInsurance ? (
                            <CheckCircle className="text-green-500 mr-2" size={16} />
                          ) : (
                            <XCircle className="text-warning-500 mr-2" size={16} />
                          )}
                          <span className="text-sm">Professional Liability Insurance</span>
                        </div>
                        <div className="flex items-center">
                          {formData.cpaMemberInGoodStanding ? (
                            <CheckCircle className="text-green-500 mr-2" size={16} />
                          ) : (
                            <XCircle className="text-warning-500 mr-2" size={16} />
                          )}
                          <span className="text-sm">CPA Member in Good Standing</span>
                        </div>
                        <div className="flex items-center">
                          {!formData.disciplinaryHistory ? (
                            <CheckCircle className="text-green-500 mr-2" size={16} />
                          ) : (
                            <XCircle className="text-warning-500 mr-2" size={16} />
                          )}
                          <span className="text-sm">Disciplinary History</span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>

                  {/* Documents Uploaded */}
                  <Card>
                    <Card.Header>
                      <h4 className="font-medium flex items-center">
                        <FileText className="mr-2 text-primary-500" size={18} />
                        Documents Uploaded
                      </h4>
                    </Card.Header>
                    <Card.Body>
                      <div className="space-y-2">
                        {uploadedFiles.caCertificate && (
                          <div className="flex items-center text-sm">
                            <CheckCircle className="text-green-500 mr-2" size={14} />
                            CA Certificate: {uploadedFiles.caCertificate.name}
                          </div>
                        )}
                        {uploadedFiles.insuranceCertificate && (
                          <div className="flex items-center text-sm">
                            <CheckCircle className="text-green-500 mr-2" size={14} />
                            Insurance Certificate: {uploadedFiles.insuranceCertificate.name}
                          </div>
                        )}
                        {uploadedFiles.peerReviewReport && (
                          <div className="flex items-center text-sm">
                            <CheckCircle className="text-green-500 mr-2" size={14} />
                            Peer Review Report: {uploadedFiles.peerReviewReport.name}
                          </div>
                        )}
                        {!uploadedFiles.caCertificate && (
                          <p className="text-sm text-warning-500">
                            ⚠ CA Certificate not uploaded (required)
                          </p>
                        )}
                      </div>
                    </Card.Body>
                  </Card>

                  {/* Terms and Conditions */}
                  <div className="space-y-4 mt-6 border-t pt-6">
                    <h4 className="font-medium text-gray-800">Terms & Agreements</h4>
                    
                    {/* Terms of Service */}
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setTermsAccepted(!termsAccepted)}
                        className="flex items-center focus:outline-none"
                      >
                        {termsAccepted ? (
                          <CheckSquare className="text-primary-600" size={20} />
                        ) : (
                          <Square className="text-gray-400" size={20} />
                        )}
                      </button>
                      <span className="ml-2 text-sm text-gray-600">
                        I agree to the{' '}
                        <button
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="text-primary-600 hover:underline font-medium"
                        >
                          Terms and Conditions
                        </button>
                      </span>
                    </div>
                    {errors.terms && <p className="text-xs text-red-500 ml-7">{errors.terms}</p>}

                    {/* Privacy Policy */}
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setPrivacyAccepted(!privacyAccepted)}
                        className="flex items-center focus:outline-none"
                      >
                        {privacyAccepted ? (
                          <CheckSquare className="text-primary-600" size={20} />
                        ) : (
                          <Square className="text-gray-400" size={20} />
                        )}
                      </button>
                      <span className="ml-2 text-sm text-gray-600">
                        I agree to the{' '}
                        <button
                          type="button"
                          onClick={() => setShowPrivacyModal(true)}
                          className="text-primary-600 hover:underline font-medium"
                        >
                          Privacy Policy
                        </button>
                      </span>
                    </div>
                    {errors.privacy && <p className="text-xs text-red-500 ml-7">{errors.privacy}</p>}

                    {/* Professional Terms */}
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setProfessionalTermsAccepted(!professionalTermsAccepted)}
                        className="flex items-center focus:outline-none"
                      >
                        {professionalTermsAccepted ? (
                          <CheckSquare className="text-primary-600" size={20} />
                        ) : (
                          <Square className="text-gray-400" size={20} />
                        )}
                      </button>
                      <span className="ml-2 text-sm text-gray-600">
                        I agree to the{' '}
                        <button
                          type="button"
                          onClick={() => setShowProfessionalTermsModal(true)}
                          className="text-primary-600 hover:underline font-medium"
                        >
                          Professional Terms for Chartered Accountants
                        </button>
                      </span>
                    </div>
                    {errors.professionalTerms && <p className="text-xs text-red-500 ml-7">{errors.professionalTerms}</p>}

                    {/* Accuracy Confirmation */}
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="confirmAccuracy"
                        checked={formData.confirmAccuracy}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-500 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        I confirm that all information provided is accurate and complete
                      </span>
                    </label>
                    {errors.confirmAccuracy && <ErrorField error={errors.confirmAccuracy} />}
                  </div>

                  {/* Terms Modal */}
                  <TermsModal
                    isOpen={showTermsModal}
                    onClose={() => setShowTermsModal(false)}
                    title="Terms and Conditions"
                    content={USER_TERMS.content}
                    onAccept={() => {
                      setTermsAccepted(true);
                      setShowTermsModal(false);
                    }}
                  />

                  {/* Privacy Modal */}
                  <TermsModal
                    isOpen={showPrivacyModal}
                    onClose={() => setShowPrivacyModal(false)}
                    title="Privacy Policy"
                    content={PRIVACY_POLICY.content}
                    onAccept={() => {
                      setPrivacyAccepted(true);
                      setShowPrivacyModal(false);
                    }}
                  />

                  {/* Professional Terms Modal */}
                  <TermsModal
                    isOpen={showProfessionalTermsModal}
                    onClose={() => setShowProfessionalTermsModal(false)}
                    title="Professional Terms for Chartered Accountants"
                    content={CA_TERMS.content}
                    onAccept={() => {
                      setProfessionalTermsAccepted(true);
                      setShowProfessionalTermsModal(false);
                    }}
                  />

                  <div className="bg-primary-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <Shield className="text-primary-500 mr-3 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-sm font-medium text-primary-700">Verification Process</p>
                        <p className="text-xs text-primary-600 mt-1">
                          Our team will verify your credentials with the provincial CPA body.
                          This typically takes 2-3 business days. You'll receive an email once verified.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    icon={<ChevronLeft size={16} />}
                  >
                    Previous
                  </Button>
                )}
                
                <div className="flex-1" />
                
                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNext}
                    icon={<ChevronRight size={16} />}
                    iconPosition="right"
                  >
                    Next Step
                    {Object.keys(errors).length > 0 && (
                      <span className="ml-2 bg-white text-primary-600 px-2 py-0.5 rounded-full text-xs font-bold">
                        {Object.keys(errors).length}
                      </span>
                    )}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    icon={<Check size={16} />}
                  >
                    Submit for Verification
                  </Button>
                )}
              </div>
            </form>
          </Card.Body>
        </Card>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-600">
          Already have a CA account?{' '}
          <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
            Sign In
          </Link>
        </p>

        {/* Security Badge */}
        <div className="flex items-center justify-center mt-6 text-xs text-gray-400">
          <Shield size={14} className="mr-1" />
          <span>Bank-level encryption • Professional verification • PIPEDA compliant</span>
        </div>
      </div>
    </div>
  );
};

export default RegisterCA;
