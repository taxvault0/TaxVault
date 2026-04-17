import React from 'react';
import Card from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend, color = 'primary', subtitle }) => {
  const colorClasses = {
    primary: 'text-primary-500 bg-primary-50',
    success: 'text-success-500 bg-green-50',
    warning: 'text-warning-500 bg-red-50',
    secondary: 'text-secondary-500 bg-secondary-50',
    gold: 'text-gold bg-yellow-50',
  };

  // Ensure value is a string or number
  const displayValue = value !== undefined && value !== null ? value : '0';

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title || 'Statistic'}</p>
          <p className={`text-2xl font-bold ${colorClasses[color]?.split(' ')[0] || 'text-gray-900'}`}>
            {displayValue}
          </p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        
        {Icon && (  // ← Changed from icon to Icon
          <div className={`p-3 rounded-lg ${colorClasses[color]?.split(' ')[1] || 'bg-gray-50'}`}>
            <Icon className={`text-2xl ${colorClasses[color]?.split(' ')[0] || 'text-gray-500'}`} />
          </div>
        )}
      </div>
      
      {trend !== undefined && trend !== null && (
        <div className="mt-3 flex items-center">
          {trend > 0 ? (
            <TrendingUp size={16} className="text-success-500 mr-1" />
          ) : (
            <TrendingDown size={16} className="text-warning-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${trend > 0 ? 'text-success-500' : 'text-warning-500'}`}>
            {Math.abs(trend)}%
          </span>
          <span className="text-xs text-gray-400 ml-2">vs last month</span>
        </div>
      )}
    </Card>
  );
};

export default StatsCard;





