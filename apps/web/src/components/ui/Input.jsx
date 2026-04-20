import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ 
  label, 
  error, 
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  helper,
  icon,
  className = '',
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-warning-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full px-4 py-3 
            ${icon ? 'pl-10' : ''} 
            ${isPassword ? 'pr-12' : ''}
            border rounded-lg
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-warning-500' : focused ? 'border-primary-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      
      {helper && !error && (
        <p className="mt-1 text-sm text-gray-500">{helper}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-warning-500">{error}</p>
      )}
    </div>
  );
};

export default Input;





