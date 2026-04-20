import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  UserGroupIcon,
  BriefcaseIcon,
  TruckIcon,
  CurrencyDollarIcon,
  BuildingOffice2Icon,
  Squares2X2Icon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

const defaultBreakdown = {
  employment: 0,
  gig: 0,
  selfEmployment: 0,
  business: 0,
  mixed: 0,
};

const breakdownConfig = [
  {
    key: 'employment',
    label: 'Employment Clients',
    icon: BriefcaseIcon,
    valueClass: 'text-blue-600',
    iconClass: 'text-blue-500',
    bgClass: 'bg-blue-50',
  },
  {
    key: 'gig',
    label: 'Gig Clients',
    icon: TruckIcon,
    valueClass: 'text-green-600',
    iconClass: 'text-green-500',
    bgClass: 'bg-green-50',
  },
  {
    key: 'selfEmployment',
    label: 'Self-Employed',
    icon: CurrencyDollarIcon,
    valueClass: 'text-purple-600',
    iconClass: 'text-purple-500',
    bgClass: 'bg-purple-50',
  },
  {
    key: 'business',
    label: 'Business Clients',
    icon: BuildingOffice2Icon,
    valueClass: 'text-indigo-600',
    iconClass: 'text-indigo-500',
    bgClass: 'bg-indigo-50',
  },
  {
    key: 'mixed',
    label: 'Mixed Profiles',
    icon: Squares2X2Icon,
    valueClass: 'text-orange-600',
    iconClass: 'text-orange-500',
    bgClass: 'bg-orange-50',
  },
];

const TotalClientsCard = ({
  total = 0,
  breakdown = defaultBreakdown,
  change,
  trend = 'up',
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const cardRef = useRef(null);

  const safeBreakdown = useMemo(
    () => ({
      employment: breakdown?.employment ?? 0,
      gig: breakdown?.gig ?? 0,
      selfEmployment: breakdown?.selfEmployment ?? 0,
      business: breakdown?.business ?? 0,
      mixed: breakdown?.mixed ?? 0,
    }),
    [breakdown]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const trendColor =
    trend === 'down' ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50';

  return (
    <div
      ref={cardRef}
      className={`relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${className}`}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full text-left focus:outline-none"
        aria-expanded={open}
        aria-label="Toggle total clients breakdown"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary-50 p-2.5">
                <UserGroupIcon className="h-6 w-6 text-primary-600" />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Total Clients</p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-3xl font-bold tracking-tight text-gray-900">{total}</p>

                  {typeof change !== 'undefined' && (
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${trendColor}`}
                    >
                      {trend === 'down' ? '↓' : '↑'} {change}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">Click to view profile breakdown</p>
          </div>

          <ChevronDownIcon
            className={`mt-1 h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      <div
        className={`absolute left-0 top-[calc(100%+10px)] z-30 w-[320px] max-w-[calc(100vw-2rem)] origin-top-left transition-all duration-200 ${
          open
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-1 scale-95 opacity-0'
        }`}
      >
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xl ring-1 ring-black/5">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">Client Breakdown</h4>
            <span className="text-xs text-gray-500">Tax profile mix</span>
          </div>

          <div className="space-y-2">
            {breakdownConfig.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between rounded-xl border border-gray-100 px-3 py-2.5 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${item.bgClass}`}>
                      <Icon className={`h-4 w-4 ${item.iconClass}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </div>

                  <span className={`text-sm font-bold ${item.valueClass}`}>
                    {safeBreakdown[item.key]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalClientsCard;
