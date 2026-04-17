import React from 'react';
import { User } from 'lucide-react';

const Avatar = ({ src, name, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const getInitials = () => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`rounded-full object-cover ${sizes[size]} ${className}`}
      />
    );
  }

  return (
    <div className={`
      rounded-full bg-gradient-to-br from-primary-500 to-secondary-500
      flex items-center justify-center text-white font-medium
      ${sizes[size]} ${className}
    `}>
      {name ? getInitials() : <User size={16} />}
    </div>
  );
};

export default Avatar;





