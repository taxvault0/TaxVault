import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  ChevronRight,
  Clock,
  Users,
  Star,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';

const CAEarnings = () => {
  const [period, setPeriod] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState('March');

  // Mock earnings data
  const earningsData = {
    currentMonth: 1250,
    previousMonth: 980,
    yearToDate: 8750,
    projectedMonth: 1650,
    pendingPayout: 450,
    nextPayout: '2025-04-15',
    totalClients: 24,
    avgRating: 4.8
  };

  const monthlyData = [
    { month: 'Jan', earnings: 850, consultations: 8 },
    { month: 'Feb', earnings: 980, consultations: 10 },
    { month: 'Mar', earnings: 1250, consultations: 12 },
    { month: 'Apr', earnings: 1100, consultations: 11 },
    { month: 'May', earnings: 1350, consultations: 14 },
    { month: 'Jun', earnings: 1200, consultations: 12 }
  ];

  const recentTransactions = [
    {
      id: 1,
      client: 'Marcus Chen',
      date: '2025-03-15',
      amount: 82.50,
      type: 'Consultation',
      status: 'paid'
    },
    {
      id: 2,
      client: 'Priya Sharma',
      date: '2025-03-14',
      amount: 175.00,
      type: 'Consultation',
      status: 'paid'
    },
    {
      id: 3,
      client: 'Mike Thompson',
      date: '2025-03-12',
      amount: 150.00,
      type: 'Consultation',
      status: 'paid'
    },
    {
      id: 4,
      client: 'Sarah Johnson',
      date: '2025-03-10',
      amount: 60.00,
      type: 'Consultation',
      status: 'pending'
    },
    {
      id: 5,
      client: 'David Kim',
      date: '2025-03-08',
      amount: 270.00,
      type: 'Consultation',
      status: 'paid'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
          <p className="text-gray-500 mt-1">Track your consultation revenue</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-2xl font-bold text-primary-600">
                  {formatCurrency(earningsData.currentMonth)}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  ↑ {((earningsData.currentMonth - earningsData.previousMonth) / earningsData.previousMonth * 100).toFixed(0)}% vs last month
                </p>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <DollarSign className="text-primary-500" size={20} />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Year to Date</p>
                <p className="text-2xl font-bold text-success-600">
                  {formatCurrency(earningsData.yearToDate)}
                </p>
              </div>
              <div className="p-3 bg-success-50 rounded-lg">
                <TrendingUp className="text-success-500" size={20} />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Projected Month</p>
                <p className="text-2xl font-bold text-gold-600">
                  {formatCurrency(earningsData.projectedMonth)}
                </p>
              </div>
              <div className="p-3 bg-gold-50 rounded-lg">
                <BarChart3 className="text-gold-600" size={20} />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg. Rating</p>
                <p className="text-2xl font-bold text-gold">
                  {earningsData.avgRating} ★
                </p>
              </div>
              <div className="p-3 bg-gold-50 rounded-lg">
                <Star className="text-gold" size={20} />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Pending Payout Card */}
      <Card className="bg-primary-50 border-primary-200">
        <Card.Body>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg mr-4">
                <DollarSign className="text-primary-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Payout</p>
                <p className="text-2xl font-bold text-primary-700">
                  {formatCurrency(earningsData.pendingPayout)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Estimated payout: {new Date(earningsData.nextPayout).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button variant="primary">Request Early Payout</Button>
          </div>
        </Card.Body>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <Card>
          <Card.Header>
            <h3 className="font-medium">Monthly Earnings</h3>
          </Card.Header>
          <Card.Body>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#005A9C"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>

        {/* Consultation Volume */}
        <Card>
          <Card.Header>
            <h3 className="font-medium">Consultation Volume</h3>
          </Card.Header>
          <Card.Body>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="consultations" fill="#FF6B35" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Recent Transactions</h3>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Client</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Type</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium">{tx.client}</td>
                    <td className="py-3 text-gray-600">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="py-3 text-gray-600">{tx.type}</td>
                    <td className="py-3 text-right font-medium">{formatCurrency(tx.amount)}</td>
                    <td className="py-3">
                      <Badge variant={tx.status === 'paid' ? 'success' : 'warning'}>
                        {tx.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <Card.Body className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg mr-4">
              <Users className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Clients</p>
              <p className="text-xl font-bold">{earningsData.totalClients}</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center">
            <div className="p-3 bg-purple-50 rounded-lg mr-4">
              <Clock className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Consultation</p>
              <p className="text-xl font-bold">45 min</p>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg mr-4">
              <Star className="text-green-600 fill-current" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Rating</p>
              <p className="text-xl font-bold">{earningsData.avgRating} / 5.0</p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default CAEarnings;







