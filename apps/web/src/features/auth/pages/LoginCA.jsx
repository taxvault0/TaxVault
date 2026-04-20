import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Briefcase, Award } from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Checkbox from 'components/ui/Checkbox';
import Badge from 'components/ui/Badge';
import { useAuth } from '../context/AuthContext';

const LoginCA = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    caNumber: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // CA Number validation
    if (!formData.caNumber) {
      newErrors.caNumber = 'CA number is required';
    } else if (!/^\d+$/.test(formData.caNumber)) {
      newErrors.caNumber = 'CA number must contain only digits';
    } else if (formData.caNumber.length < 6) {
      newErrors.caNumber = 'CA number must be at least 6 digits';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const result = await login(formData.email, formData.password, 'ca', formData.caNumber);
      if (result.success) {
        navigate('/ca/dashboard');
      } else {
        setErrors({ form: 'Invalid credentials or CA number' });
      }
    } catch (error) {
      setErrors({ form: 'Login failed. Please check your credentials.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-secondary-600 transition-colors group"
      >
        <ArrowLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
        <span>Back to role selection</span>
      </button>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo and Professional Badge */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-secondary-600">TaxVault</h1>
          <div className="flex items-center justify-center mt-3">
            <Badge variant="gold" className="text-sm px-3 py-1">
              <Award size={14} className="inline mr-1" />
              Verified Professional
            </Badge>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            CA Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your client management dashboard
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 sm:px-10 border-2 border-secondary-200 shadow-xl">
          {/* Professional header */}
          <div className="flex items-center justify-center mb-6">
            <div className="bg-secondary-50 px-4 py-2 rounded-full flex items-center">
              <Briefcase size={16} className="text-secondary-600 mr-2" />
              <span className="text-sm font-medium text-secondary-700">
                Chartered Accountant Portal
              </span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* CA Number field - Specific to CA login */}
            <Input
              label="CA Membership Number"
              name="caNumber"
              type="text"
              placeholder="123456"
              value={formData.caNumber}
              onChange={handleChange}
              error={errors.caNumber}
              icon={<Award size={18} className="text-secondary-500" />}
              required
              maxLength={10}
              helperText="Enter your CPA/CA membership number"
            />

            {/* Email field */}
            <Input
              label="Professional Email"
              name="email"
              type="email"
              placeholder="ca@accountingfirm.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<Mail size={18} />}
              required
            />

            {/* Password field */}
            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={<Lock size={18} />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <Checkbox
                label="Remember me"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <Link
                to="/forgot-password"
                className="text-sm text-secondary-600 hover:text-secondary-700 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error message */}
            {errors.form && (
              <div className="bg-warning-50 border border-warning-200 rounded-lg p-3 animate-shake">
                <p className="text-sm text-warning-700">{errors.form}</p>
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              variant="secondary"
              fullWidth
              size="lg"
              loading={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In as CA'}
            </Button>
          </form>

          {/* Register link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have a professional account?{' '}
              <Link
                to="/register/ca"
                className="text-secondary-600 hover:text-secondary-700 font-medium transition-colors"
              >
                Register as CA
              </Link>
            </p>
          </div>

          {/* Professional verification note */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs text-blue-700 leading-relaxed">
                <span className="font-semibold block mb-1">🔐 Professional verification required:</span>
                All CA accounts undergo professional verification with CPA Canada. 
                Please have your membership number ready. New registrations may take 
                24-48 hours to verify.
              </p>
            </div>
          </div>

          {/* Security features specific to CA accounts */}
          <div className="mt-4 flex justify-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
              2FA Required
            </span>
            <span>•</span>
            <span className="flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
              Audit Log
            </span>
            <span>•</span>
            <span className="flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
              Client Access
            </span>
          </div>
        </Card>

        {/* Trust indicators */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 All CA communications are encrypted and audited for compliance
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginCA;









