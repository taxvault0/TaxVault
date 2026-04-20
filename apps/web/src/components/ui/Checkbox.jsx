import React from 'react';
import { Check } from 'lucide-react';

const Checkbox = ({ label, checked, onChange, disabled = false, className = '' }) => {
  return (
    <label className={`flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />
        <div className={`
          w-5 h-5 border-2 rounded transition-colors duration-200
          flex items-center justify-center
          ${checked ? 'bg-primary-500 border-primary-500' : 'bg-white border-gray-300'}
          ${!disabled && 'hover:border-primary-500'}
        `}>
          {checked && <Check size={14} className="text-white" />}
        </div>
      </div>
      {label && <span className="ml-3 text-sm text-gray-700">{label}</span>}
    </label>
  );
};

export default Checkbox;





