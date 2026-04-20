import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Calendar,
  PieChart,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Users,
  Briefcase,
  Car,
  Store,
  GraduationCap,
  Home,
  Award,
  Target,
  Zap,
  Download,
  Filter,
  RefreshCw,
  ChevronRight,
  BarChart3,
  LineChart,
  Activity,
  Bell,
  Shield,
  Sparkles
} from 'lucide-react';
import Card from 'components/ui/Card';
import Button from 'components/ui/Button';
import Badge from 'components/ui/Badge';
import {
  LineChart as RechartsLineChart,
  BarChart,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart
} from 'recharts';
import { useAuth } from '../../auth/context/AuthContext';

const CAAnalyticsDashboard = () => {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('6months');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [showForecast, setShowForecast] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with API calls
  const [workloadData, setWorkloadData] = useState({
    forecast: [
      { month: 'Jan', lastYear: 45, predicted: 52, actual: 48 },
      { month: 'Feb', lastYear: 38, predicted: 44, actual: 42 },
      { month: 'Mar', lastYear: 62, predicted: 68, actual: 65 },
      { month: 'Apr', lastYear: 85, predicted: 92, actual: 88 },
      { month: 'May', lastYear: 72, predicted: 78, actual: 75 },
      { month: 'Jun', lastYear: 58, predicted: 64, actual: 60 },
      { month: 'Jul', lastYear: 42, predicted: 48, actual: 45 },
      { month: 'Aug', lastYear: 35, predicted: 40, actual: 38 },
      { month: 'Sep', lastYear: 48, predicted: 54, actual: 50 },
      { month: 'Oct', lastYear: 55, predicted: 62, actual: 58 },
      { month: 'Nov', lastYear: 68, predicted: 74, actual: 70 },
      { month: 'Dec', lastYear: 92, predicted: 98, actual: 95 },
    ],
    insights: [
      {
        id: 1,
        type: 'warning',
        message: 'Based on last year, you can expect 15 gig worker clients to upload documents in the last week of April. Consider preparing reminder templates now.',
        actionable: true,
        action: 'Create Reminder Template'
      },
      {
        id: 2,
        type: 'warning',
        message: 'You have 23 ready-to-file clients, exceeding your average monthly capacity of 18. Consider prioritizing or delegating.',
        actionable: true,
        action: 'View Ready Clients'
      },
      {
        id: 3,
        type: 'info',
        message: 'Corporate tax deadline approaching in 45 days. 8 corporate clients still need to upload documents.',
        actionable: true,
        action: 'Send Reminders'
      },
      {
        id: 4,
        type: 'success',
        message: 'Good progress! You\'ve already processed 65% of this quarter\'s expected volume.',
        actionable: false
      }
    ]
  });

  const [clientBreakdown, setClientBreakdown] = useState({
    byType: [
      { name: 'Gig Workers', value: 45, color: '#FF6B35', icon: Car, count: 45, revenue: 11250 },
      { name: 'Business Owners', value: 28, color: '#005A9C', icon: Store, count: 28, revenue: 19600 },
      { name: 'Franchisees', value: 12, color: '#2E7D32', icon: Briefcase, count: 12, revenue: 14400 },
      { name: 'T4 Employees', value: 38, color: '#9C27B0', icon: Users, count: 38, revenue: 9500 },
      { name: 'Contractors', value: 22, color: '#ED6A5E', icon: GraduationCap, count: 22, revenue: 11000 },
      { name: 'Other', value: 15, color: '#6C757D', icon: Home, count: 15, revenue: 3750 }
    ],
    totalClients: 160,
    totalRevenue: 69500,
    nicheStrength: {
      specialization: 'Gig Economy',
      percentage: 45,
      averagePercentage: 15,
      comparison: '3x higher',
      insight: 'Your niche: Gig Economy Specialists. 45% of your clients are gig workers, which is three times higher than the average CA on our platform.'
    },
    serviceGaps: [
      {
        service: 'Rideshare Expense Optimization',
        demand: 78,
        yourOffering: false,
        insight: 'Add this service to attract more gig workers from the platform directory.'
      },
      {
        service: 'Franchise Tax Planning',
        demand: 65,
        yourOffering: true,
        insight: 'You already offer this - great for attracting franchise clients.'
      },
      {
        service: 'Cross-Border Taxation',
        demand: 42,
        yourOffering: false,
        insight: 'Growing demand among contractors, consider adding this service.'
      },
      {
        service: 'Estate Planning',
        demand: 35,
        yourOffering: true,
        insight: 'Well positioned for retiring business owners.'
      }
    ]
  });

  const [efficiencyData, setEfficiencyData] = useState({
    currentAverage: 8.5, // days
    platformAverage: 10.2,
    topTenPercent: 4.8,
    trend: [
      { month: 'Jan', days: 9.2 },
      { month: 'Feb', days: 8.8 },
      { month: 'Mar', days: 8.5 },
      { month: 'Apr', days: 8.3 },
      { month: 'May', days: 8.1 },
      { month: 'Jun', days: 7.9 },
      { month: 'Jul', days: 8.2 },
      { month: 'Aug', days: 8.4 },
      { month: 'Sep', days: 8.6 },
      { month: 'Oct', days: 8.5 },
      { month: 'Nov', days: 8.3 },
      { month: 'Dec', days: 8.1 }
    ],
    bottlenecks: [
      {
        stage: 'Document Collection',
        averageDays: 3.2,
        percentOfTime: 38,
        insight: 'Clients take an average of 3.2 days to upload requested documents.',
        recommendation: 'Send automated reminders after 2 days of inactivity.'
      },
      {
        stage: 'Initial Review',
        averageDays: 2.1,
        percentOfTime: 25,
        insight: 'Review time is efficient, averaging 2.1 days.',
        recommendation: 'You\'re doing well here - maintain this pace.'
      },
      {
        stage: 'Follow-up Questions',
        averageDays: 1.8,
        percentOfTime: 21,
        insight: 'Follow-up rounds add 1.8 days on average.',
        recommendation: 'Batch questions to reduce back-and-forth.'
      },
      {
        stage: 'Final Filing',
        averageDays: 1.4,
        percentOfTime: 16,
        insight: 'Filing takes 1.4 days after final review.',
        recommendation: 'Consider e-filing immediately after approval.'
      }
    ],
    clientTypeEfficiency: [
      { type: 'Gig Workers', avgDays: 6.2, benchmark: 7.5 },
      { type: 'Business Owners', avgDays: 9.8, benchmark: 10.2 },
      { type: 'Franchisees', avgDays: 12.5, benchmark: 11.8 },
      { type: 'T4 Employees', avgDays: 5.2, benchmark: 6.0 },
      { type: 'Contractors', avgDays: 8.5, benchmark: 9.2 }
    ]
  });

  const [revenueData, setRevenueData] = useState({
    outstandingInvoices: 23450,
    paidThisMonth: 18750,
    estimatedFees: 32400,
    ytdRevenue: 156750,
    forecast: [
      { month: 'Apr', projected: 24500, conservative: 22000, optimistic: 27000 },
      { month: 'May', projected: 26800, conservative: 24000, optimistic: 29500 },
      { month: 'Jun', projected: 31200, conservative: 28000, optimistic: 34500 }
    ],
    unpaidInvoices: [
      { id: 1, client: 'Marcus Chen', amount: 850, dueDate: '2025-03-15', status: 'overdue', daysOverdue: 5 },
      { id: 2, client: 'Priya Sharma', amount: 1200, dueDate: '2025-03-20', status: 'pending', daysOverdue: 0 },
      { id: 3, client: 'Mike Thompson', amount: 650, dueDate: '2025-03-10', status: 'overdue', daysOverdue: 12 },
      { id: 4, client: 'Sarah Johnson', amount: 950, dueDate: '2025-03-25', status: 'pending', daysOverdue: 0 },
      { id: 5, client: 'David Kim', amount: 1500, dueDate: '2025-03-18', status: 'pending', daysOverdue: 0 }
    ],
    profitabilityByType: [
      { type: 'Business Owners', percentOfClients: 18, percentOfRevenue: 32, margin: 'high' },
      { type: 'Franchisees', percentOfClients: 8, percentOfRevenue: 21, margin: 'high' },
      { type: 'Gig Workers', percentOfClients: 28, percentOfRevenue: 24, margin: 'medium' },
      { type: 'Contractors', percentOfClients: 14, percentOfRevenue: 16, margin: 'medium' },
      { type: 'T4 Employees', percentOfClients: 24, percentOfRevenue: 14, margin: 'low' },
      { type: 'Other', percentOfClients: 8, percentOfRevenue: 5, margin: 'low' }
    ],
    insights: [
      'Business owners represent 18% of clients but generate 32% of revenue - focus marketing on this segment',
      'Franchisees have the highest margin - consider developing specialized franchise packages',
      'T4 employees have lowest margin - consider automated packages or minimum fees',
      'Outstanding invoices total $23,450 - 12% of YTD revenue'
    ]
  });

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="text-warning-500" size={20} />;
      case 'success':
        return <CheckCircle className="text-success-500" size={20} />;
      default:
        return <Sparkles className="text-primary-500" size={20} />;
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-warning-50 border-warning-200';
      case 'success':
        return 'bg-success-50 border-success-200';
      default:
        return 'bg-primary-50 border-primary-200';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Practice Management</h1>
          <p className="text-gray-500 mt-1">
            Data-driven insights to optimize your practice and grow your business
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
            <option value="ytd">Year to Date</option>
          </select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            loading={refreshing}
            icon={<RefreshCw size={16} />}
          >
            Refresh
          </Button>
          <Button variant="primary" icon={<Download size={16} />}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Workload Forecasting */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="text-primary-500 mr-2" size={20} />
              <h2 className="text-lg font-semibold">Workload Forecasting</h2>
            </div>
            <button
              onClick={() => setShowForecast(!showForecast)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              {showForecast ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
        </Card.Header>
        <Card.Body>
          {/* Forecast Chart */}
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={workloadData.forecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="lastYear"
                  stackId="1"
                  stroke="#6C757D"
                  fill="#E4E7EB"
                  name="Last Year Actual"
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#FF6B35"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Predicted"
                />
                <Bar
                  dataKey="actual"
                  fill="#005A9C"
                  name="Current Year"
                  barSize={20}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Dynamic Insight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workloadData.insights.map((insight) => (
              <Card
                key={insight.id}
                className={`${getInsightColor(insight.type)} border`}
              >
                <Card.Body className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{insight.message}</p>
                      {insight.actionable && (
                        <button className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center">
                          {insight.action}
                          <ChevronRight size={14} className="ml-1" />
                        </button>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>

          {/* Capacity Warning */}
          {workloadData.forecast.find(m => m.month === 'Apr')?.predicted > 85 && (
            <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="text-warning-500 mr-2" size={18} />
                <p className="text-sm text-warning-700">
                  <span className="font-medium">Capacity Alert:</span> April is projected to exceed 85 documents. Consider temporary staffing or client communications.
                </p>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Client Type Breakdown & Niche Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <Card className="lg:col-span-1">
          <Card.Header>
            <div className="flex items-center">
              <PieChart className="text-primary-500 mr-2" size={20} />
              <h2 className="text-lg font-semibold">Client Portfolio</h2>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={clientBreakdown.byType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {clientBreakdown.byType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="mt-4 space-y-2">
              {clientBreakdown.byType.map((type, index) => {
                const Icon = type.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedSegment(type.name)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors ${
                      selectedSegment === type.name ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: type.color }}
                      />
                      <Icon size={14} className="text-gray-500 mr-2" />
                      <span className="text-sm">{type.name}</span>
                    </div>
                    <span className="text-sm font-medium">{type.count} clients</span>
                  </button>
                );
              })}
            </div>
          </Card.Body>
        </Card>

        {/* Niche Strength & Service Gaps */}
        <Card className="lg:col-span-2">
          <Card.Header>
            <div className="flex items-center">
              <Award className="text-primary-500 mr-2" size={20} />
              <h2 className="text-lg font-semibold">Niche Analysis</h2>
            </div>
          </Card.Header>
          <Card.Body>
            {/* Niche Strength Meter */}
            <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-white rounded-lg border border-primary-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Niche Strength: Gig Economy</h3>
                <Badge variant="success">Your Niche</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Your Portfolio</span>
                    <span className="font-semibold text-primary-600">{clientBreakdown.nicheStrength.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${clientBreakdown.nicheStrength.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Platform Average</span>
                    <span className="font-semibold">{clientBreakdown.nicheStrength.averagePercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-400 h-2 rounded-full"
                      style={{ width: `${clientBreakdown.nicheStrength.averagePercentage}%` }}
                    />
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-700">
                {clientBreakdown.nicheStrength.insight}
              </p>
            </div>

            {/* Service Gap Analysis */}
            <h3 className="font-medium text-gray-900 mb-3">Service Gap Analysis</h3>
            <div className="space-y-3">
              {clientBreakdown.serviceGaps.map((gap, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{gap.service}</span>
                      {gap.yourOffering ? (
                        <Badge variant="success" size="sm" className="ml-2">You Offer</Badge>
                      ) : (
                        <Badge variant="warning" size="sm" className="ml-2">Not Offered</Badge>
                      )}
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="flex-1 max-w-xs">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Platform Demand</span>
                          <span className="font-medium">{gap.demand}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-primary-500 h-1.5 rounded-full"
                            style={{ width: `${gap.demand}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{gap.insight}</p>
                  </div>
                  {!gap.yourOffering && (
                    <Button size="sm" variant="outline" className="ml-3">
                      Add Service
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Efficiency Benchmarking */}
      <Card>
        <Card.Header>
          <div className="flex items-center">
            <Clock className="text-primary-500 mr-2" size={20} />
            <h2 className="text-lg font-semibold">Time to File & Efficiency Benchmarking</h2>
          </div>
        </Card.Header>
        <Card.Body>
          {/* Benchmark Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-primary-50 border-primary-200">
              <Card.Body>
                <p className="text-xs text-primary-600">Your Average</p>
                <p className="text-2xl font-bold text-primary-700">{efficiencyData.currentAverage} days</p>
                <div className="flex items-center mt-1 text-xs text-green-600">
                  <ArrowDown size={12} className="mr-1" />
                  {((efficiencyData.platformAverage - efficiencyData.currentAverage) / efficiencyData.platformAverage * 100).toFixed(0)}% faster than avg
                </div>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <p className="text-xs text-gray-500">Platform Average</p>
                <p className="text-2xl font-bold text-gray-700">{efficiencyData.platformAverage} days</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <p className="text-xs text-gray-500">Top 10%</p>
                <p className="text-2xl font-bold text-success-600">{efficiencyData.topTenPercent} days</p>
                <p className="text-xs text-gray-500 mt-1">Your target</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <p className="text-xs text-gray-500">Efficiency Trend</p>
                <div className="h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={efficiencyData.trend.slice(-6)}>
                      <Line
                        type="monotone"
                        dataKey="days"
                        stroke="#005A9C"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Bottleneck Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Process Bottlenecks</h3>
              <div className="space-y-3">
                {efficiencyData.bottlenecks.map((bottleneck, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{bottleneck.stage}</span>
                      <span className="text-sm">{bottleneck.averageDays} days</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-warning-500 h-2 rounded-full"
                        style={{ width: `${bottleneck.percentOfTime}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600">{bottleneck.insight}</p>
                    <p className="text-xs text-primary-600 mt-1">{bottleneck.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Type Efficiency */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Efficiency by Client Type</h3>
              <div className="space-y-3">
                {efficiencyData.clientTypeEfficiency.map((item, index) => {
                  const isBetter = item.avgDays < item.benchmark;
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{item.type}</span>
                        <div className="flex items-center mt-1">
                          <span className="text-sm text-gray-600">{item.avgDays} days</span>
                          <span className="text-xs text-gray-400 mx-2">vs</span>
                          <span className="text-sm text-gray-600">{item.benchmark} days</span>
                        </div>
                      </div>
                      {isBetter ? (
                        <Badge variant="success" size="sm">Faster</Badge>
                      ) : (
                        <Badge variant="warning" size="sm">Slower</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Revenue Management */}
      <Card>
        <Card.Header>
          <div className="flex items-center">
            <DollarSign className="text-primary-500 mr-2" size={20} />
            <h2 className="text-lg font-semibold">Revenue Management</h2>
          </div>
        </Card.Header>
        <Card.Body>
          {/* Revenue Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <Card.Body>
                <p className="text-xs text-gray-500">Outstanding Invoices</p>
                <p className="text-2xl font-bold text-warning-600">{formatCurrency(revenueData.outstandingInvoices)}</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <p className="text-xs text-gray-500">Paid This Month</p>
                <p className="text-2xl font-bold text-success-600">{formatCurrency(revenueData.paidThisMonth)}</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <p className="text-xs text-gray-500">Estimated from Ready Clients</p>
                <p className="text-2xl font-bold text-primary-600">{formatCurrency(revenueData.estimatedFees)}</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <p className="text-xs text-gray-500">YTD Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueData.ytdRevenue)}</p>
              </Card.Body>
            </Card>
          </div>

          {/* Revenue Forecast */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <h3 className="font-medium text-gray-900 mb-3">Revenue Forecast</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData.forecast}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="conservative" fill="#9AA2B0" name="Conservative" />
                    <Bar dataKey="projected" fill="#005A9C" name="Projected" />
                    <Bar dataKey="optimistic" fill="#2E7D32" name="Optimistic" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Unpaid Invoices */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Unpaid Invoices</h3>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {revenueData.unpaidInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{invoice.client}</p>
                      <p className="text-xs text-gray-500">Due {invoice.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(invoice.amount)}</p>
                      {invoice.status === 'overdue' && (
                        <Badge variant="error" size="sm">Overdue</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3">
                View All Invoices
              </Button>
            </div>
          </div>

          {/* Profitability Analysis */}
          <div className="border-t pt-6">
            <h3 className="font-medium text-gray-900 mb-3">Client Profitability Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {revenueData.profitabilityByType.map((item, index) => (
                <Card key={index} className="bg-gray-50">
                  <Card.Body>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{item.type}</span>
                      <Badge variant={item.margin === 'high' ? 'success' : item.margin === 'medium' ? 'info' : 'warning'}>
                        {item.margin} margin
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">% of Clients</span>
                        <span className="font-medium">{item.percentOfClients}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">% of Revenue</span>
                        <span className="font-medium text-primary-600">{item.percentOfRevenue}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div
                          className="bg-primary-500 h-1.5 rounded-full"
                          style={{ width: `${(item.percentOfRevenue / item.percentOfClients) * 10}%` }}
                        />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>

            {/* Revenue Insights */}
            <div className="mt-4 p-4 bg-primary-50 rounded-lg">
              <div className="flex items-start">
                <Sparkles className="text-primary-500 mr-3 mt-1" size={18} />
                <div>
                  <h4 className="font-medium text-primary-700 mb-2">Key Insights</h4>
                  <ul className="space-y-1">
                    {revenueData.insights.map((insight, index) => (
                      <li key={index} className="text-sm text-primary-600 flex items-start">
                        <span className="mr-2">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Data Freshness Note */}
      <div className="text-center text-xs text-gray-400 pt-4 border-t border-gray-200">
        <p>📊 Data updated daily • Last sync: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default CAAnalyticsDashboard;







