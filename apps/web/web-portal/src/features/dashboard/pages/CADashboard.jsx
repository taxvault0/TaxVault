import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  DocumentIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  FolderOpenIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  ArrowTopRightOnSquareIcon,
  BellAlertIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import StatsCard from 'components/shared/StatsCard';
import ClientTable from 'components/shared/ClientTable';
import TotalClientsCard from 'features/ca/pages/TotalClientsCard';
import { useAuth } from '../../auth/context/AuthContext';
import Card from 'components/ui/Card';
import Badge from 'components/ui/Badge';
import { getCRAUpdates } from 'services/craUpdatesService';
import api from 'services/api';

const DEMO_USER_EMAILS = [
  'demo.ca@taxvault.com',
  'ca.demo@taxvault.com',
  'demo@example.com',
];

const isDemoUser = (user) => {
  const email = user?.email?.toLowerCase?.() || '';
  return DEMO_USER_EMAILS.includes(email);
};

const EMPTY_DASHBOARD = {
  clients: [],
  pendingReviews: [],
  recentActivity: [],
  todaysPlan: [],
  needsAttention: [],
  pipeline: [],
  stats: {
    totalClients: 0,
    readyToFile: 0,
    pendingReviews: 0,
    needsAttention: 0,
    unreadConversations: 0,
  },
};

const formatDisplayDate = (value) => {
  if (!value) return 'Recent';
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Recent';

  return new Intl.DateTimeFormat('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const getPriorityClasses = (priority) => {
  switch (priority) {
    case 'high':
      return 'bg-rose-100 text-rose-700 border border-rose-200';
    case 'medium':
      return 'bg-amber-100 text-amber-700 border border-amber-200';
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
};

const getCategoryClasses = (category) => {
  switch (category) {
    case 'deadline':
      return 'bg-red-50 text-red-700';
    case 'policy':
      return 'bg-violet-50 text-violet-700';
    case 'service change':
      return 'bg-blue-50 text-blue-700';
    case 'efile':
      return 'bg-emerald-50 text-emerald-700';
    case 'security':
      return 'bg-amber-50 text-amber-700';
    case 'benefit':
      return 'bg-cyan-50 text-cyan-700';
    case 'business tax':
      return 'bg-indigo-50 text-indigo-700';
    default:
      return 'bg-slate-50 text-slate-700';
  }
};

const getPriorityLabel = (priority) => {
  switch (priority) {
    case 'high':
      return 'High priority';
    case 'medium':
      return 'Medium priority';
    default:
      return 'Low priority';
  }
};

const CADashboard = () => {
  const { user } = useAuth();
  const demoMode = isDemoUser(user);

  const [dashboardData, setDashboardData] = useState(EMPTY_DASHBOARD);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState('');

  const [craUpdates, setCraUpdates] = useState([]);
  const [loadingCraUpdates, setLoadingCraUpdates] = useState(true);
  const [craLastSyncedAt, setCraLastSyncedAt] = useState(null);
  const [craFeedMode, setCraFeedMode] = useState('backend');

  const mockClients = {
    total: 24,
    readyCount: 8,
    attentionCount: 3,
    data: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        status: 'active',
        lastActivity: '2 hours ago',
        documents: 12,
        taxProfile: {
          employment: true,
          gigWork: false,
          selfEmployment: false,
          incorporatedBusiness: false,
        },
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        status: 'pending',
        lastActivity: '1 day ago',
        documents: 8,
        taxProfile: {
          employment: true,
          gigWork: true,
          selfEmployment: false,
          incorporatedBusiness: false,
        },
      },
      {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        status: 'active',
        lastActivity: '3 days ago',
        documents: 15,
        taxProfile: {
          employment: false,
          gigWork: true,
          selfEmployment: true,
          incorporatedBusiness: false,
        },
      },
      {
        id: 4,
        name: 'Alice Brown',
        email: 'alice@example.com',
        status: 'active',
        lastActivity: '5 days ago',
        documents: 7,
        taxProfile: {
          employment: true,
          gigWork: false,
          selfEmployment: false,
          incorporatedBusiness: true,
        },
      },
      {
        id: 5,
        name: 'Charlie Wilson',
        email: 'charlie@example.com',
        status: 'inactive',
        lastActivity: '1 week ago',
        documents: 3,
        taxProfile: {
          employment: true,
          gigWork: true,
          selfEmployment: true,
          incorporatedBusiness: true,
        },
      },
    ],
  };

  const mockPendingReviews = [
    { id: 1, clientName: 'John Doe', documentType: 'T4 Slip', submittedAt: '2026-03-25' },
    { id: 2, clientName: 'Jane Smith', documentType: 'Rental Income', submittedAt: '2026-03-25' },
    { id: 3, clientName: 'Bob Johnson', documentType: 'Medical Receipts', submittedAt: '2026-03-24' },
    { id: 4, clientName: 'Alice Brown', documentType: 'Charitable Donations', submittedAt: '2026-03-23' },
  ];

  const mockActivity = [
    { id: 1, description: 'John Doe uploaded T4 slip', time: '2 hours ago', type: 'upload' },
    { id: 2, description: 'Jane Smith submitted gig income docs', time: '5 hours ago', type: 'submit' },
    { id: 3, description: 'Bob Johnson requested review', time: '1 day ago', type: 'request' },
    { id: 4, description: 'Alice Brown updated business info', time: '2 days ago', type: 'update' },
    { id: 5, description: 'Charlie Wilson added corporate docs', time: '3 days ago', type: 'upload' },
    { id: 6, description: 'New client registered', time: '4 days ago', type: 'new' },
  ];

  const demoTodaysPlan = [
    {
      id: 1,
      time: '9:30 AM',
      title: 'Consultation Call',
      client: 'John Doe',
      type: 'Consultation',
      status: 'Upcoming',
    },
    {
      id: 2,
      time: '11:00 AM',
      title: 'Document Review Meeting',
      client: 'Jane Smith',
      type: 'Review',
      status: 'Today',
    },
    {
      id: 3,
      time: '2:00 PM',
      title: 'Tax Filing Appointment',
      client: 'Alice Brown',
      type: 'Tax Filing',
      status: 'Priority',
    },
    {
      id: 4,
      time: '4:30 PM',
      title: 'Business Return Review',
      client: 'Charlie Wilson',
      type: 'Business',
      status: 'Today',
    },
  ];

  const demoPipeline = [
    { label: 'New', count: 4, color: 'bg-slate-100 text-slate-700' },
    { label: 'Pending Docs', count: 8, color: 'bg-amber-100 text-amber-700' },
    { label: 'In Review', count: 5, color: 'bg-blue-100 text-blue-700' },
    { label: 'Filing Today', count: 3, color: 'bg-purple-100 text-purple-700' },
    { label: 'Completed', count: 11, color: 'bg-emerald-100 text-emerald-700' },
  ];

  const demoNeedsAttention = [
    {
      id: 1,
      name: 'Jane Smith',
      issue: 'Missing supporting gig receipts',
      level: 'Medium',
    },
    {
      id: 2,
      name: 'Charlie Wilson',
      issue: 'Business return documents incomplete',
      level: 'High',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      issue: 'No activity for 3 days',
      level: 'Low',
    },
  ];

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      if (!user) {
        setDashboardData(EMPTY_DASHBOARD);
        setDashboardLoading(false);
        return;
      }

      if (demoMode) {
        setDashboardData({
          clients: mockClients.data || [],
          pendingReviews: mockPendingReviews || [],
          recentActivity: mockActivity || [],
          todaysPlan: demoTodaysPlan || [],
          needsAttention: demoNeedsAttention || [],
          pipeline: demoPipeline || [],
          stats: {
            totalClients: mockClients.total || 0,
            readyToFile: mockClients.readyCount || 0,
            pendingReviews: mockPendingReviews.length || 0,
            needsAttention: mockClients.attentionCount || 0,
            unreadConversations: 6,
          },
        });
        setDashboardError('');
        setDashboardLoading(false);
        return;
      }

      try {
        setDashboardLoading(true);
        setDashboardError('');

        const response = await api.get('/ca/dashboard');

        if (!isMounted) return;

        const payload = response?.data?.data || response?.data || {};

        setDashboardData({
          clients: Array.isArray(payload.clients) ? payload.clients : [],
          pendingReviews: Array.isArray(payload.pendingReviews) ? payload.pendingReviews : [],
          recentActivity: Array.isArray(payload.recentActivity) ? payload.recentActivity : [],
          todaysPlan: Array.isArray(payload.todaysPlan) ? payload.todaysPlan : [],
          needsAttention: Array.isArray(payload.needsAttention) ? payload.needsAttention : [],
          pipeline: Array.isArray(payload.pipeline) ? payload.pipeline : [],
          stats: {
            totalClients: Number(payload?.stats?.totalClients || 0),
            readyToFile: Number(payload?.stats?.readyToFile || 0),
            pendingReviews: Number(payload?.stats?.pendingReviews || 0),
            needsAttention: Number(payload?.stats?.needsAttention || 0),
            unreadConversations: Number(payload?.stats?.unreadConversations || 0),
          },
        });
      } catch (error) {
        console.error('Failed to load CA dashboard:', error);

        if (!isMounted) return;

        setDashboardError('Failed to load dashboard data.');
        setDashboardData(EMPTY_DASHBOARD);
      } finally {
        if (isMounted) {
          setDashboardLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [user, demoMode]);

  useEffect(() => {
    let isMounted = true;

    const loadCRAUpdates = async () => {
      setLoadingCraUpdates(true);

      try {
        const result = await getCRAUpdates({ limit: 3 });

        if (!isMounted) return;

        setCraUpdates(result?.updates || []);
        setCraLastSyncedAt(result?.lastSyncedAt || new Date().toISOString());
        setCraFeedMode(result?.source || 'backend');
      } catch (error) {
        if (!isMounted) return;

        setCraUpdates([]);
        setCraLastSyncedAt(new Date().toISOString());
        setCraFeedMode('fallback');
      } finally {
        if (isMounted) {
          setLoadingCraUpdates(false);
        }
      }
    };

    loadCRAUpdates();

    return () => {
      isMounted = false;
    };
  }, []);

  const clients = dashboardData.clients || [];
  const pendingReviews = dashboardData.pendingReviews || [];
  const recentActivity = dashboardData.recentActivity || [];
  const todaysPlan = dashboardData.todaysPlan || [];
  const needsAttention = dashboardData.needsAttention || [];
  const pipeline = dashboardData.pipeline || [];
  const statsData = dashboardData.stats || EMPTY_DASHBOARD.stats;

  const urgentActions = [
    {
      id: 1,
      title: 'Documents waiting for review',
      value: pendingReviews.length,
      link: '/ca/reviews',
    },
    {
      id: 2,
      title: 'Clients ready to file',
      value: statsData.readyToFile,
      link: '/ca/clients',
    },
    {
      id: 3,
      title: 'Clients needing attention',
      value: statsData.needsAttention,
      link: '/ca/clients',
    },
    {
      id: 4,
      title: 'Unread client conversations',
      value: statsData.unreadConversations,
      link: '/ca/messages',
    },
  ];

  const profileCounts = useMemo(() => {
    return {
      employment: clients.filter((c) => c.taxProfile?.employment).length,
      gig: clients.filter((c) => c.taxProfile?.gigWork).length,
      selfEmployment: clients.filter((c) => c.taxProfile?.selfEmployment).length,
      business: clients.filter((c) => c.taxProfile?.incorporatedBusiness).length,
      mixed: clients.filter((c) => Object.values(c.taxProfile || {}).filter(Boolean).length > 1)
        .length,
    };
  }, [clients]);

  const stats = [
    {
      title: 'Total Clients',
      value: statsData.totalClients,
      change: 0,
      trend: 'up',
      icon: UserGroupIcon,
    },
    {
      title: 'Pending Reviews',
      value: statsData.pendingReviews,
      change: 0,
      trend: 'up',
      icon: ClockIcon,
    },
    {
      title: 'Ready to File',
      value: statsData.readyToFile,
      change: 0,
      trend: 'up',
      icon: CheckCircleIcon,
    },
    {
      title: 'Needs Attention',
      value: statsData.needsAttention,
      change: 0,
      trend: 'down',
      icon: ExclamationTriangleIcon,
    },
  ];

  if (!user) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">CA Dashboard</h2>
        <p className="text-gray-600">
          Please log in to access the CA dashboard and manage your clients.
        </p>
      </div>
    );
  }

  if (dashboardLoading) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0] || 'CA'}!
          </h1>
          <p className="mt-1 text-sm text-gray-600">Loading your dashboard...</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-xl border border-gray-200 bg-white"
            />
          ))}
        </div>
      </div>
    );
  }

  const showEmptyState =
    !demoMode &&
    clients.length === 0 &&
    pendingReviews.length === 0 &&
    recentActivity.length === 0 &&
    todaysPlan.length === 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0] || 'CA'}!
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Here&apos;s your operational view for today.
          </p>
          {dashboardError ? <p className="mt-2 text-sm text-red-600">{dashboardError}</p> : null}
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="info" className="px-3 py-1.5 text-sm">
            {demoMode ? 'CA Dashboard (Demo)' : 'CA Dashboard'}
          </Badge>
          <Link
            to="/ca/calendar"
            className="inline-flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 transition hover:bg-primary-100"
          >
            <CalendarDaysIcon className="h-4 w-4" />
            Open Calendar
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TotalClientsCard
          total={statsData.totalClients}
          change={0}
          trend="up"
          breakdown={profileCounts}
        />

        {stats
          .filter((stat) => stat.title !== 'Total Clients')
          .map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
      </div>

      {showEmptyState ? (
        <Card>
          <Card.Body className="p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900">No dashboard data yet</h3>
            <p className="mt-2 text-sm text-gray-600">
              Your dashboard will show real clients, reviews, activity, and filing tasks once
              data is available.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <Link
                to="/ca/clients"
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                View Clients
              </Link>
              <Link
                to="/ca/requests"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Consultation Requests
              </Link>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <div className="space-y-5 xl:col-span-8">
            <Card className="overflow-hidden border-primary-100 bg-gradient-to-br from-primary-50 via-white to-white">
              <Card.Body className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Plan</h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Meetings, consultations, and tax filing appointments for today.
                    </p>
                  </div>
                  <Link
                    to="/ca/calendar"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    Full calendar
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>

                {todaysPlan.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
                    No meetings or appointments scheduled for today.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {todaysPlan.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-primary-600">
                              {item.time || '-'}
                            </p>
                            <h3 className="mt-1 text-sm font-semibold text-gray-900">
                              {item.title || 'Untitled'}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">{item.client || 'No client'}</p>
                          </div>
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                            {item.status || 'Upcoming'}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
                            {item.type || 'General'}
                          </span>
                          <Link
                            to="/ca/calendar"
                            className="text-sm font-medium text-primary-600 hover:text-primary-700"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">Client Pipeline</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Track where clients are in the filing workflow.
                    </p>
                  </div>
                  <Link
                    to="/ca/clients"
                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    Open clients →
                  </Link>
                </div>
              </Card.Header>

              <Card.Body className="pt-0">
                {pipeline.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
                    No pipeline data available yet.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {pipeline.map((item, index) => (
                      <span
                        key={item.label || index}
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          item.color || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.label}: {item.count}
                      </span>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>

            <Card className="overflow-hidden">
              <Card.Header>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">Recent Clients</h3>
                  </div>
                  <Link
                    to="/ca/clients"
                    className="text-xs font-medium text-primary-600 hover:text-primary-700"
                  >
                    View all →
                  </Link>
                </div>
              </Card.Header>

              <Card.Body className="p-0">
                {clients.length === 0 ? (
                  <div className="p-4 text-sm text-gray-600">No clients yet.</div>
                ) : (
                  <div className="max-h-[260px] overflow-y-auto">
                    <ClientTable clients={clients.slice(0, 5)} compact />
                  </div>
                )}
              </Card.Body>
            </Card>

            <Card className="overflow-hidden">
              <Card.Header>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900">
                      <BellAlertIcon className="h-5 w-5 text-primary-500" />
                      Official CRA Updates
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Official CRA filing, deadline, EFILE, service, and security updates for
                      preparers.
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    Source: CRA
                  </span>
                </div>
              </Card.Header>

              <Card.Body className="space-y-4 pt-0">
                <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-3">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShieldCheckIcon className="h-4 w-4 text-blue-600" />
                        <p className="text-sm font-semibold text-gray-900">What&apos;s Going On at CRA</p>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Keep accountants updated with official tax season guidance and filing changes.
                      </p>
                    </div>

                    <a
                      href="https://www.canada.ca/en/revenue-agency/news/newsroom.html"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
                    >
                      CRA Newsroom
                      <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    </a>
                  </div>

                  {loadingCraUpdates ? (
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
                      {[1, 2, 3].map((item) => (
                        <div
                          key={item}
                          className="animate-pulse rounded-xl border border-gray-200 bg-white p-3"
                        >
                          <div className="h-3 w-20 rounded bg-gray-200" />
                          <div className="mt-2 h-3 w-10/12 rounded bg-gray-200" />
                          <div className="mt-2 h-2.5 w-full rounded bg-gray-100" />
                          <div className="mt-1.5 h-2.5 w-4/5 rounded bg-gray-100" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
                      {craUpdates.map((update) => (
                        <article
                          key={update.id}
                          className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                          <div className="mb-2 flex flex-wrap items-center gap-1.5">
                            <span className="text-[11px] font-medium text-gray-500">
                              {formatDisplayDate(update.publishedAt)}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getCategoryClasses(update.category)}`}
                            >
                              {update.category}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getPriorityClasses(update.priority)}`}
                            >
                              {getPriorityLabel(update.priority)}
                            </span>
                          </div>

                          <h4 className="line-clamp-2 text-sm font-semibold leading-5 text-gray-900">
                            {update.title}
                          </h4>

                          <p className="mt-1.5 line-clamp-3 text-xs leading-5 text-gray-600">
                            {update.summary}
                          </p>

                          <div className="mt-3 flex items-center justify-between gap-2">
                            <span className="text-[11px] font-medium text-gray-500">
                              {update.source || 'CRA'}
                            </span>

                            <a
                              href={update.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
                            >
                              View
                              <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </article>
                      ))}

                      {craUpdates.length === 0 && (
                        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-3 text-sm text-gray-600">
                          No CRA updates are available right now.
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between border-t border-blue-100 pt-3">
                    <div>
                      <p className="text-xs font-medium text-gray-600">
                        Last synced: {formatDisplayDate(craLastSyncedAt)}
                      </p>
                      <p className="mt-1 text-[11px] text-gray-500">
                        {craFeedMode === 'fallback'
                          ? 'Fallback official links are showing until backend sync is connected.'
                          : 'Live backend feed is connected to official CRA content.'}
                      </p>
                    </div>

                    <a
                      href="https://www.canada.ca/en/revenue-agency/services/e-services/feeds.html"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-primary-600 hover:text-primary-700"
                    >
                      RSS / feeds →
                    </a>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>

          <div className="space-y-5 xl:col-span-4">
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-900">Urgent Actions</h3>
                  <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
                </div>
              </Card.Header>
              <Card.Body className="pt-0">
                <div className="space-y-1">
                  {urgentActions.map((item) => (
                    <Link
                      key={item.id}
                      to={item.link}
                      className="flex items-center justify-between rounded-lg px-3 py-2 transition hover:bg-gray-50"
                    >
                      <span className="text-sm text-gray-700">{item.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                        <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>
                <h3 className="text-base font-semibold text-gray-900">Clients Needing Attention</h3>
              </Card.Header>
              <Card.Body className="space-y-3 pt-0">
                {needsAttention.length === 0 ? (
                  <div className="text-sm text-gray-600">No clients need attention right now.</div>
                ) : (
                  needsAttention.map((item, index) => (
                    <div key={item.id || index} className="rounded-xl border border-gray-200 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="mt-1 text-sm text-gray-600">{item.issue}</p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            item.level === 'High'
                              ? 'bg-rose-100 text-rose-700'
                              : item.level === 'Medium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {item.level || 'Low'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>
                <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
              </Card.Header>
              <Card.Body className="pt-0">
                {recentActivity.length === 0 ? (
                  <div className="text-sm text-gray-600">No recent activity yet.</div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {recentActivity.slice(0, 5).map((item, index) => (
                        <div key={item.id || index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                              <DocumentIcon className="h-4 w-4 text-primary-600" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-gray-900">{item.description}</p>
                            <p className="text-xs text-gray-500">{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Link
                        to="/ca/activity"
                        className="text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        View all activity →
                      </Link>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>

            {pendingReviews.length > 0 && (
              <Card className="border-warning-200 bg-warning-50">
                <Card.Body className="p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ClockIcon className="h-5 w-5 text-warning-400" />
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-warning-800">Pending Reviews</h3>
                      <div className="mt-2 text-sm text-warning-700">
                        <p>You have {pendingReviews.length} documents waiting for review.</p>
                      </div>
                      <div className="mt-3">
                        <Link
                          to="/ca/reviews"
                          className="text-sm font-medium text-warning-800 hover:text-warning-900"
                        >
                          View pending reviews →
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}

            <Card>
              <Card.Header>
                <h3 className="text-base font-semibold text-gray-900">Quick Actions</h3>
              </Card.Header>
              <Card.Body className="space-y-1 pt-0">
                <Link
                  to="/ca/clients"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-50"
                >
                  <UserGroupIcon className="h-5 w-5 text-primary-500" />
                  <span className="text-sm text-gray-700">View Clients</span>
                </Link>
                <Link
                  to="/ca/requests"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-50"
                >
                  <BriefcaseIcon className="h-5 w-5 text-primary-500" />
                  <span className="text-sm text-gray-700">Consultation Requests</span>
                </Link>
                <Link
                  to="/ca/calendar"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-50"
                >
                  <CalendarDaysIcon className="h-5 w-5 text-primary-500" />
                  <span className="text-sm text-gray-700">View Calendar</span>
                </Link>
                <Link
                  to="/ca/messages"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-50"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary-500" />
                  <span className="text-sm text-gray-700">Client Messages</span>
                </Link>
                <Link
                  to="/ca/reviews"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-50"
                >
                  <FolderOpenIcon className="h-5 w-5 text-primary-500" />
                  <span className="text-sm text-gray-700">Review Documents</span>
                </Link>
              </Card.Body>
            </Card>

            {demoMode && (
              <Card className="border-primary-200 bg-primary-50">
                <Card.Body className="p-4">
                  <p className="text-sm font-medium text-primary-800">Demo Mode</p>
                  <p className="mt-1 text-xs text-primary-600">
                    Using mock data for demonstration. No real client information is displayed.
                  </p>
                </Card.Body>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CADashboard;