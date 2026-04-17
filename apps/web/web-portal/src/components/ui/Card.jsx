import React from 'react';

const Card = ({ children, className = '', onClick, hoverable = false }) => {
  const baseClasses = 'bg-white rounded-xl shadow-soft p-6';
  const hoverClasses = hoverable ? 'hover:shadow-lg transition-all duration-200 cursor-pointer' : '';
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

Card.Header = ({ children, className = '' }) => (
  <div className={`border-b border-gray-200 pb-4 mb-4 ${className}`}>
    {children}
  </div>
);

Card.Body = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '' }) => (
  <div className={`border-t border-gray-200 pt-4 mt-4 ${className}`}>
    {children}
  </div>
);

export default Card;





