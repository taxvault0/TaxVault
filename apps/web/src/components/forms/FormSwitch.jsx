import React from 'react';

const FormSwitch = ({
  label,
  name,
  checked,
  onChange,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <label className={`flex items-center justify-between cursor-pointer ${className}`}>
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}
      
      <div className="relative">
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
            w-11 h-6 rounded-full transition-colors duration-200
            ${checked ? 'bg-primary-500' : 'bg-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div
            className={`
              absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow
              transform transition-transform duration-200
              ${checked ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </div>
      </div>
    </label>
  );
};

export default FormSwitch;





