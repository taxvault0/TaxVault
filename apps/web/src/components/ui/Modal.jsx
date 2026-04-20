import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children, size = 'md', showClose = true }) => {
  if (!isOpen) return null;
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 flex items-center justify-center">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className={`relative bg-white rounded-xl shadow-soft w-full ${sizes[size]} z-10 animate-slide-up`}>
          {/* Header */}
          {(title || showClose) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              {title && <h3 className="text-xl font-semibold text-gray-900">{title}</h3>}
              {showClose && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;





