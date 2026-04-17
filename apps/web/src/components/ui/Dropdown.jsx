import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const Dropdown = ({ trigger, children, align = 'left', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className={`
          absolute z-50 mt-2 w-48 rounded-lg bg-white shadow-soft border border-gray-200 py-1
          ${align === 'right' ? 'right-0' : 'left-0'}
          animate-slide-up
        `}>
          {children}
        </div>
      )}
    </div>
  );
};

Dropdown.Item = ({ children, onClick, danger = false }) => (
  <button
    onClick={onClick}
    className={`
      w-full text-left px-4 py-2 text-sm
      hover:bg-gray-50 transition-colors duration-150
      ${danger ? 'text-warning-500' : 'text-gray-700'}
    `}
  >
    {children}
  </button>
);

export default Dropdown;





