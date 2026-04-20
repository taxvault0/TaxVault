import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, User, Briefcase, Store, Car } from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import { useAuth } from '../context/AuthContext';

const LoginUser = () => {
  const navigate = useNavigate();
  const { login, demoLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  // Demo user configurations
  const demoUsers = {
    user: {
      email: 'user@demo.com',
      password: 'demo1234',
      label: 'Regular User',
      icon: User,
      path: '/dashboard'
    },
    ca: {
      email: 'ca@demo.com',
      password: 'demo1234',
      label: 'CA Professional',
      icon: Briefcase,
      path: '/ca/dashboard'
    },
    Business: {
      email: 'Business@demo.com',
      password: 'demo1234',
      label: 'Business Owner',
      icon: Store,
      path: '/Business/dashboard'
    },
    gig: {
      email: 'gig@test.com',
      password: 'password123',
      label: 'Gig Worker',
      icon: Car,
      path: '/dashboard'
    },
    employee: {
      email: 'employee@test.com',
      password: 'password123',
      label: 'Employee',
      icon: User,
      path: '/dashboard'
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        // Determine navigation based on user role
        if (result.user?.role === 'ca') {
          navigate('/ca/dashboard');
        } else if (result.user?.userType === 'Business-owner') {
          navigate('/Business/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setErrors({ general: result.error || 'Login failed' });
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please check your credentials.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (userType) => {
    setDemoLoading(prev => ({ ...prev, [userType]: true }));
    setErrors({});
    
    try {
      const demoUser = demoUsers[userType];
      if (!demoUser) {
        setErrors({ general: 'Invalid demo user type' });
        return;
      }

      // First fill the form (optional)
      setFormData({
        email: demoUser.email,
        password: demoUser.password
      });

      // Then attempt login
      const result = await login(demoUser.email, demoUser.password);
      
      if (result.success) {
        navigate(demoUser.path);
      } else {
        setErrors({ general: result.error || 'Demo login failed' });
      }
    } catch (error) {
      setErrors({ general: 'Demo login failed. Please try again.' });
    } finally {
      setDemoLoading(prev => ({ ...prev, [userType]: false }));
    }
  };

  const fillDemoCredentials = (userType) => {
    const demoUser = demoUsers[userType];
    if (demoUser) {
      setFormData({
        email: demoUser.email,
        password: demoUser.password
      });
      setErrors({});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-8">
          <ArrowLeft size={20} className="mr-2" />
          Back to role selection
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600">TaxVault</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">User Login</h2>
          <p className="text-gray-600 mt-2">Access your tax documents and receipts</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl">
          <Card.Body className="p-8">
            {/* Demo Login Buttons */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-sm text-gray-500 mb-3 text-center">Quick Demo Access</p>
              
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-3 mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin('user')}
                  loading={demoLoading.user}
                  className="flex items-center justify-center gap-1"
                >
                  <User size={14} />
                  Regular User
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin('ca')}
                  loading={demoLoading.ca}
                  className="flex items-center justify-center gap-1"
                >
                  <Briefcase size={14} />
                  CA Professional
                </Button>
              </div>
              
              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin('Business')}
                  loading={demoLoading.Business}
                  className="flex items-center justify-center gap-1"
                >
                  <Store size={14} />
                  Business Owner
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin('gig')}
                  loading={demoLoading.gig}
                  className="flex items-center justify-center gap-1"
                >
                  <Car size={14} />
                  Gig Worker
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-warning-50 text-warning-600 p-3 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.email ? 'border-warning-500' : 'border-gray-300'
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="text-xs text-warning-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.password ? 'border-warning-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-warning-500 mt-1">{errors.password}</p>}
              </div>

              {/* Fill Demo Buttons */}
              <div className="flex flex-wrap gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('user')}
                  className="text-xs text-primary-600 hover:text-primary-700 px-2 py-1"
                >
                  Fill User
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('Business')}
                  className="text-xs text-primary-600 hover:text-primary-700 px-2 py-1"
                >
                  Fill Business
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('gig')}
                  className="text-xs text-primary-600 hover:text-primary-700 px-2 py-1"
                >
                  Fill Gig
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('ca')}
                  className="text-xs text-primary-600 hover:text-primary-700 px-2 py-1"
                >
                  Fill CA
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-primary-500 rounded" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" variant="primary" fullWidth loading={loading}>
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register/user" className="text-primary-600 hover:text-primary-700 font-medium">
                  Register here
                </Link>
              </p>
            </div>

            {/* Demo Credentials Note */}
            <p className="text-xs text-gray-400 text-center mt-4">
              Demo: user@demo.com / Business@demo.com (demo1234) | gig@test.com (password123)
            </p>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default LoginUser;
