import React from 'react';

const FormRadio = ({
  label,
  name,
  value,
  checked,
  onChange,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <label className={`flex items-center cursor-pointer ${className}`}>
      <div className="relative flex items-center">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div
          className={`
            w-5 h-5 border-2 rounded-full transition-colors duration-200
            flex items-center justify-center
            ${checked ? 'border-primary-500' : 'border-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary-500'}
          `}
        >
          {checked && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
        </div>
      </div>
      {label && (
        <span className="ml-3 text-sm text-gray-700">{label}</span>
      )}
    </label>
  );
};

export default FormRadio;





