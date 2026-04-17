import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  DollarSign,
  Wallet,
  Receipt,
  Percent,
  Users,
  Package,
  MessageCircle,
  AlertTriangle,
  Clock,
  ArrowLeft,
  ArrowRight,
  FileText,
  Landmark,
} from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';

const RedirectCard = ({ to, icon: Icon, title, desc, tone = 'default' }) => {
  const toneClasses = {
    purple: 'border-purple-200 bg-purple-50 hover:bg-purple-100',
    green: 'border-green-200 bg-green-50 hover:bg-green-100',
    amber: 'border-amber-200 bg-amber-50 hover:bg-amber-100',
    blue: 'border-blue-200 bg-blue-50 hover:bg-blue-100',
    default: 'border-gray-200 bg-white hover:bg-gray-50',
  };

  return (
    <Link
      to={to}
      className={`rounded-2xl border p-4 transition ${toneClasses[tone]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-3 inline-flex rounded-xl bg-white/80 p-2">
            <Icon size={20} className="text-gray-800" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-xs text-gray-600">{desc}</p>
        </div>
        <ArrowRight size={16} className="mt-1 text-gray-500" />
      </div>
    </Link>
  );
};

const InfoPanel = ({ title, subtitle, icon: Icon, children }) => (
  <Card>
    <Card.Header>
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-gray-100 p-2">
          <Icon size={18} className="text-gray-700" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          {subtitle ? <p className="text-sm text-gray-500">{subtitle}</p> : null}
        </div>
      </div>
    </Card.Header>
    <Card.Body>{children}</Card.Body>
  </Card>
);

const BusinessOwnerDashboard = () => {
  const { user } = useAuth();

  const businessInfo = user?.businessInfo || {};
  const gstRegistered = Boolean(businessInfo.gstRegistered);
  const hasEmployees = Boolean(businessInfo.hasEmployees);
  const hasInventory = Boolean(businessInfo.hasInventory);

  const attentionItems = [
    'Review business income records',
    'Upload latest expense receipts',
    gstRegistered ? 'Check GST tracking records' : null,
    hasEmployees ? 'Review payroll records' : null,
    hasInventory ? 'Update inventory records' : null,
  ].filter(Boolean);

  const recentActivity = [
    'Business receipt uploaded',
    'Income record updated',
    'GST page reviewed',
    'Message received from CA',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Manage all business-related tax records in one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="info">Business Area</Badge>
          {gstRegistered && <Badge variant="warning">GST Registered</Badge>}
          {hasEmployees && <Badge variant="info">Payroll</Badge>}
          {hasInventory && <Badge variant="info">Inventory</Badge>}
        </div>
      </div>

      <Card className="border-indigo-200 bg-indigo-50">
        <Card.Body>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white p-3">
                <Building2 size={20} className="text-indigo-700" />
              </div>
              <div>
                <p className="font-semibold text-indigo-900">Switch back to Personal Dashboard</p>
                <p className="text-sm text-indigo-700">
                  Return to your T4, personal tax, and gig-income overview.
                </p>
              </div>
            </div>

            <Link to="/dashboard">
              <Button variant="outline">
                <ArrowLeft size={16} className="mr-2" />
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>

      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
        <Card.Header>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-purple-900">Business Area</h2>
              <p className="mt-1 text-sm text-purple-700">
                Open the section you want to manage.
              </p>
            </div>
            <Badge variant="info">All Business Items</Badge>
          </div>
        </Card.Header>

        <Card.Body>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <RedirectCard
              to="/business/income"
              icon={DollarSign}
              title="Business Income"
              desc="Track sales, invoices, and income records."
              tone="purple"
            />

            <RedirectCard
              to="/business/expenses"
              icon={Wallet}
              title="Business Expenses"
              desc="Review costs, deductions, and expenses."
              tone="purple"
            />

            <RedirectCard
              to="/receipts"
              icon={Receipt}
              title="Receipts"
              desc="Upload and manage business receipts."
              tone="purple"
            />

            <RedirectCard
              to="/mileage"
              icon={Landmark}
              title="Mileage"
              desc="Track business trips and vehicle deductions."
              tone="blue"
            />

            {gstRegistered && (
              <RedirectCard
                to="/business/gst-records"
                icon={Percent}
                title="GST Tracking"
                desc="Review GST records and summaries."
                tone="green"
              />
            )}

            {hasEmployees && (
              <RedirectCard
                to="/business/payroll"
                icon={Users}
                title="Payroll"
                desc="Manage employee-related tax records."
                tone="amber"
              />
            )}

            {hasInventory && (
              <RedirectCard
                to="/business/inventory"
                icon={Package}
                title="Inventory"
                desc="Track stock and inventory-related records."
                tone="green"
              />
            )}

            <RedirectCard
              to="/tax-checklist"
              icon={FileText}
              title="Business Checklist"
              desc="Review missing items and filing readiness."
              tone="blue"
            />
          </div>
        </Card.Body>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <InfoPanel
          title="What Needs Attention"
          subtitle="Business-focused next steps."
          icon={AlertTriangle}
        >
          <div className="space-y-3">
            {attentionItems.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
              >
                {item}
              </div>
            ))}
          </div>
        </InfoPanel>

        <InfoPanel
          title="Your Tax Professional"
          subtitle="Keep business help easy to access."
          icon={MessageCircle}
        >
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Assigned CA</p>
            <p className="mt-1 font-semibold text-gray-900">
              {user?.assignedCA || 'Not Assigned'}
            </p>
            <div className="mt-4">
              <Button variant="outline" fullWidth>
                Open Messages
              </Button>
            </div>
            <div className="mt-3">
              <Link to="/find-ca">
                <Button variant="primary" fullWidth>
                  Book Consultation
                </Button>
              </Link>
            </div>
          </div>
        </InfoPanel>

        <InfoPanel
          title="Recent Activity"
          subtitle="Recent updates across your business records."
          icon={Clock}
        >
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={item} className="rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
                {item}
              </div>
            ))}
          </div>
        </InfoPanel>
      </div>
    </div>
  );
};

export default BusinessOwnerDashboard;
