import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:bg-primary-300',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 disabled:bg-secondary-300',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 disabled:text-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 disabled:text-gray-400',
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2.5 text-sm',
    large: 'px-6 py-3 text-base',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled || loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer';

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClass,
    disabledClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      
      {!loading && startIcon && <span className="mr-2">{startIcon}</span>}
      
      {children}
      
      {!loading && endIcon && <span className="ml-2">{endIcon}</span>}
    </button>
  );
};

export const IconButton = ({
  children,
  variant = 'ghost',
  size = 'medium',
  rounded = false,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  };

  const sizeClasses = {
    small: 'p-1.5',
    medium: 'p-2',
    large: 'p-3',
  };

  const roundedClass = rounded ? 'rounded-full' : 'rounded-lg';

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    roundedClass
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;