import React from 'react';
import  Card  from '../common/Card';

const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = 'primary',
  formatValue = (v) => v,
  loading = false,
  onClick 
}) => {
  const colorConfig = {
    primary: {
      bg: 'bg-primary-50',
      text: 'text-primary-700',
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
      changePositive: 'text-primary-600',
      changeNegative: 'text-red-600'
    },
    secondary: {
      bg: 'bg-secondary-50',
      text: 'text-secondary-700',
      iconBg: 'bg-secondary-100',
      iconColor: 'text-secondary-600',
      changePositive: 'text-secondary-600',
      changeNegative: 'text-red-600'
    },
    success: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      changePositive: 'text-green-600',
      changeNegative: 'text-red-600'
    },
    warning: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      changePositive: 'text-yellow-600',
      changeNegative: 'text-red-600'
    },
    danger: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      changePositive: 'text-red-600',
      changeNegative: 'text-red-600'
    },
    info: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      changePositive: 'text-blue-600',
      changeNegative: 'text-red-600'
    }
  };

  const config = colorConfig[color];

  return (
    <Card 
      hoverable={!!onClick}
      onClick={onClick}
      className={`transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${config.text} mb-2`}>{title}</p>
          
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
              
              {change !== undefined && (
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    change >= 0 ? config.changePositive : config.changeNegative
                  }`}>
                    {change >= 0 ? '↗' : '↘'} {Math.abs(change)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-2">за месяц</span>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className={`${config.iconBg} p-3 rounded-xl`}>
          <span className={`text-2xl ${config.iconColor}`}>{icon}</span>
        </div>
      </div>
      
      {!loading && onClick && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className={`text-sm font-medium ${config.text} hover:underline flex items-center`}>
            Подробнее
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      )}
    </Card>
  );
};

export const StatsGrid = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {children}
    </div>
  );
};

export default StatsCard;