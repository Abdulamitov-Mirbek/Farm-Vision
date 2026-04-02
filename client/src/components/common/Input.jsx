import React, { forwardRef, useState } from 'react';

const Input = forwardRef(({
  label,
  error,
  helperText,
  startIcon,
  endIcon,
  fullWidth = true,
  required = false,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const baseClasses = 'block w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0';
  const normalClasses = 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';
  const errorClasses = 'border-red-300 focus:border-red-500 focus:ring-red-500';
  const disabledClasses = 'bg-gray-50 text-gray-500 cursor-not-allowed';
  
  const paddingClasses = startIcon ? 'pl-10 pr-4' : endIcon ? 'pr-10 pl-4' : 'px-4';
  const sizeClasses = props.size === 'small' ? 'py-1.5 text-sm' : 'py-2.5';

  const classes = [
    baseClasses,
    error ? errorClasses : normalClasses,
    props.disabled && disabledClasses,
    paddingClasses,
    sizeClasses,
    className
  ].filter(Boolean).join(' ');

  const handleFocus = (e) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (props.onBlur) props.onBlur(e);
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {startIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {startIcon}
          </div>
        )}
        
        <input
          ref={ref}
          className={classes}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        
        {endIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {endIcon}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export const TextArea = forwardRef(({
  label,
  error,
  helperText,
  rows = 4,
  fullWidth = true,
  required = false,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const baseClasses = 'block w-full rounded-lg border border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500';
  const errorClasses = 'border-red-300 focus:border-red-500 focus:ring-red-500';
  const disabledClasses = 'bg-gray-50 text-gray-500 cursor-not-allowed';

  const classes = [
    baseClasses,
    error ? errorClasses : '',
    props.disabled && disabledClasses,
    'px-4 py-2.5',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        rows={rows}
        className={classes}
        {...props}
      />
      
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export const Select = forwardRef(({
  label,
  error,
  helperText,
  options = [],
  fullWidth = true,
  required = false,
  placeholder = 'Выберите...',
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const baseClasses = 'block w-full rounded-lg border border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500';
  const errorClasses = 'border-red-300 focus:border-red-500 focus:ring-red-500';
  const disabledClasses = 'bg-gray-50 text-gray-500 cursor-not-allowed';

  const classes = [
    baseClasses,
    error ? errorClasses : '',
    props.disabled && disabledClasses,
    'px-4 py-2.5',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        ref={ref}
        className={classes}
        defaultValue=""
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export const Checkbox = ({
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
  containerClassName = '',
}) => {
  return (
    <div className={`flex items-center ${containerClassName}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded ${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        } ${className}`}
      />
      {label && (
        <label className={`ml-2 text-sm ${disabled ? 'text-gray-500' : 'text-gray-700'} cursor-pointer`}>
          {label}
        </label>
      )}
    </div>
  );
};

export const Radio = ({
  label,
  checked,
  onChange,
  value,
  name,
  disabled = false,
  className = '',
  containerClassName = '',
}) => {
  return (
    <div className={`flex items-center ${containerClassName}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 ${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        } ${className}`}
      />
      {label && (
        <label className={`ml-2 text-sm ${disabled ? 'text-gray-500' : 'text-gray-700'} cursor-pointer`}>
          {label}
        </label>
      )}
    </div>
  );
};

export default Input;