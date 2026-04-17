import React from 'react';

const Badge = ({ children, variant = 'info', className = '' }) => {
  const variants = {
    success: 'bg-green-100 text-success-500',
    warning: 'bg-red-100 text-warning-500',
    info: 'bg-blue-100 text-primary-500',
    gold: 'bg-yellow-100 text-gold',
    primary: 'bg-primary-100 text-primary-500',
    secondary: 'bg-secondary-100 text-secondary-500',
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;





