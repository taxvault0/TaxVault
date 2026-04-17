import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Briefcase, 
  Shield, 
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Clock,
  Award,
  Star,
  Users,
  Building,
  FileText,
  Lock,
  Globe,
  ChevronRight,
  Sparkles,
  MapPin,
  Camera,
  Share2
} from 'lucide-react';

const RoleSelect = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, value: '50K+', label: 'Active Users' },
    { icon: Star, value: '4.9', label: 'Trust Score' },
    { icon: Building, value: '2.5K+', label: 'Partner CAs' }
  ];

  const features = {
    individual: [
      { icon: Camera, text: 'Receipt scanning' },
      { icon: MapPin, text: 'Mileage tracking' },
      { icon: Share2, text: 'CA collaboration' }
    ],
    professional: [
      { icon: Users, text: 'Client management' },
      { icon: FileText, text: 'Document verification' },
      { icon: TrendingUp, text: 'Analytics dashboard' }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">TaxVault</span>
              <span className="ml-2 px-2 py-0.5 bg-primary-50 text-primary-600 text-xs font-medium rounded-full">Canada</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-sm text-gray-600 hover:text-gray-900">Login</button>
              <button className="text-sm bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Split Layout */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 rounded-full mb-6">
                <Sparkles size={14} className="text-primary-500" />
                <span className="text-xs font-medium text-primary-600">Trusted by 50,000+ Canadians</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Your Financial Future,
                <span className="block text-primary-500 mt-2">
                  Powered by Intelligence
                </span>
              </h1>
              
              <p className="text-gray-600 mb-6 text-lg">
                The first tax platform built for Canadians, combining enterprise security with AI-driven insights.
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-6 mb-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <stat.icon className="w-5 h-5 text-primary-500" />
                    <div>
                      <span className="font-bold text-gray-900">{stat.value}</span>
                      <span className="text-xs text-gray-500 ml-1">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: Lock, text: 'Bank-level Encryption' },
                  { icon: Globe, text: 'Canadian Data' },
                  { icon: Award, text: 'CPA Partner' }
                ].map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                    <badge.icon size={12} className="text-green-600" />
                    <span>{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Cards Grid */}
            <div className="grid gap-4">
              {/* Individual Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-xs bg-primary-50 text-primary-600 px-2 py-1 rounded-full">Most Popular</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Individual</h3>
                <p className="text-sm text-gray-500 mb-4">For gig workers & self-employed</p>
                
                <div className="flex gap-3 mb-4">
                  {features.individual.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1 text-xs text-gray-600">
                      <feat.icon size={12} className="text-primary-500" />
                      <span>{feat.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/login/user')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register/user')}
                    className="flex-1 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 flex items-center justify-center gap-1"
                  >
                    Sign Up
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* CA Card - Now in Blue Shades */}
              <div className="bg-gradient-to-r from-primary-50 to-white rounded-xl border-2 border-primary-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">Professional</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-1">CA Professional</h3>
                <p className="text-sm text-gray-500 mb-4">For accounting firms & tax professionals</p>
                
                <div className="flex gap-3 mb-4">
                  {features.professional.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1 text-xs text-gray-600">
                      <feat.icon size={12} className="text-primary-500" />
                      <span>{feat.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/login/ca')}
                    className="flex-1 px-3 py-2 border border-primary-200 rounded-lg text-sm text-primary-700 hover:bg-primary-50"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register/ca')}
                    className="flex-1 px-3 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 flex items-center justify-center gap-1"
                  >
                    Register
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>© 2026 TaxVault Canada</span>
            <div className="flex gap-4">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RoleSelect; 









