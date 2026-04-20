import React, { useState } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';

const FormDatePicker = ({
  label,
  name,
  value,
  onChange,
  placeholder = 'Select date',
  error,
  helper,
  required = false,
  disabled = false,
  className = '',
  min,
  max,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-warning-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          id={name}
          name={name}
          type="date"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full px-4 py-3
            border rounded-lg
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-warning-500 bg-warning-50' : focused ? 'border-primary-500' : 'border-gray-300'}
          `}
          {...props}
        />
        
        <Calendar 
          size={18} 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
        />
      </div>
      
      {helper && !error && (
        <p className="mt-1 text-sm text-gray-500">{helper}</p>
      )}
      
      {error && (
        <div className="mt-1 flex items-center text-sm text-warning-500">
          <AlertCircle size={14} className="mr-1" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FormDatePicker;





