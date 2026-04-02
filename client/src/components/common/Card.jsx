import React from 'react';

export const Card = ({
  children,
  title,
  subtitle,
  actions,
  footer,
  padding = true,
  hoverable = false,
  bordered = true,
  className = '',
  onClick,
}) => {
  const baseClasses = 'bg-white rounded-xl transition-all duration-200';
  const paddingClass = padding ? 'p-6' : '';
  const borderClass = bordered ? 'border border-gray-200' : '';
  const hoverClass = hoverable ? 'hover:shadow-md hover:border-gray-300 cursor-pointer' : '';
  const clickableClass = onClick ? 'cursor-pointer' : '';

  const classes = [
    baseClasses,
    paddingClass,
    borderClass,
    hoverClass,
    clickableClass,
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div className={classes} onClick={handleClick}>
      {(title || subtitle || actions) && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}
      
      <div className={!padding && (title || subtitle || actions) ? 'pt-4' : ''}>
        {children}
      </div>
      
      {footer && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`border-b border-gray-200 pb-4 mb-4 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '', padding = true }) => (
  <div className={`${padding ? 'p-6' : ''} ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`border-t border-gray-200 pt-4 mt-4 ${className}`}>
    {children}
  </div>
);

// Специальные карточки для дашборда
export const StatsCard = ({
  title,
  value,
  change,
  icon,
  color = 'primary',
  formatValue = (v) => v,
}) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-700',
    secondary: 'bg-secondary-50 text-secondary-700',
    success: 'bg-green-50 text-green-700',
    danger: 'bg-red-50 text-red-700',
    warning: 'bg-yellow-50 text-yellow-700',
    info: 'bg-blue-50 text-blue-700',
  };

  const iconColorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    secondary: 'bg-secondary-100 text-secondary-600',
    success: 'bg-green-100 text-green-600',
    danger: 'bg-red-100 text-red-600',
    warning: 'bg-yellow-100 text-yellow-600',
    info: 'bg-blue-100 text-blue-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {change >= 0 ? '↗' : '↘'} {Math.abs(change)}%
              </span>
              <span className="text-sm text-gray-500 ml-2">за месяц</span>
            </div>
          )}
        </div>
        <div className={`${iconColorClasses[color]} p-3 rounded-lg`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

// Экспорт по умолчанию
const CardComponent = Card;
export default CardComponent;