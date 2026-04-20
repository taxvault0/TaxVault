import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const FormInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  helper,
  icon: Icon,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

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
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </div>
        )}
        
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full px-4 py-3 
            ${Icon ? 'pl-10' : ''} 
            ${isPassword ? 'pr-12' : ''}
            border rounded-lg
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-warning-500 bg-warning-50' : focused ? 'border-primary-500' : 'border-gray-300'}
          `}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
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

export default FormInput;





