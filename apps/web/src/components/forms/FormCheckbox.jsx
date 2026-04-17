import React from 'react';
import { Check } from 'lucide-react';

const FormCheckbox = ({
  label,
  name,
  checked,
  onChange,
  error,
  helper,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="flex items-start cursor-pointer">
        <div className="relative flex items-center h-5">
          <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          <div
            className={`
              w-5 h-5 border-2 rounded transition-colors duration-200
              flex items-center justify-center
              ${checked ? 'bg-primary-500 border-primary-500' : 'bg-white border-gray-300'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary-500'}
            `}
          >
            {checked && <Check size={14} className="text-white" />}
          </div>
        </div>
        {label && (
          <span className="ml-3 text-sm text-gray-700">{label}</span>
        )}
      </label>
      
      {helper && !error && (
        <p className="mt-1 text-sm text-gray-500 ml-8">{helper}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-warning-500 ml-8">{error}</p>
      )}
    </div>
  );
};

export default FormCheckbox;





