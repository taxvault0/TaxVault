import React from 'react';
import { 
  DocumentTextIcon, 
  PhotoIcon, 
  DocumentIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const DocumentCard = ({ document, onVerify, onReject, onDownload }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'receipt':
        return <PhotoIcon className="h-8 w-8 text-gray-400" />;
      case 't4':
      case 't4a':
      case 't5':
        return <DocumentTextIcon className="h-8 w-8 text-gray-400" />;
      default:
        return <DocumentIcon className="h-8 w-8 text-gray-400" />;
    }
  };

  const getTypeLabel = (type) => {
    const types = {
      receipt: 'Receipt',
      t4: 'T4 Slip',
      t4a: 'T4A Slip',
      t5: 'T5 Slip',
      mileage: 'Mileage Log',
      invoice: 'Invoice'
    };
    return types[type] || type;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {getIcon(document.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {document.name}
            </h4>
            <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status)}`}>
              {document.status}
            </span>
          </div>
          
          <div className="mt-1 flex items-center text-sm text-gray-500">
            <span>{getTypeLabel(document.type)}</span>
            <span className="mx-2">•</span>
            <span>{document.date}</span>
            {document.amount && (
              <>
                <span className="mx-2">•</span>
                <span className="font-medium">${document.amount}</span>
              </>
            )}
          </div>
          
          {document.notes && (
            <p className="mt-2 text-sm text-gray-600">{document.notes}</p>
          )}
          
          <div className="mt-3 flex items-center space-x-4">
            <button
              onClick={() => onDownload(document)}
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
              Download
            </button>
            
            {document.status === 'pending' && onVerify && onReject && (
              <>
                <button
                  onClick={() => onVerify(document)}
                  className="inline-flex items-center text-sm text-green-600 hover:text-green-700"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Verify
                </button>
                <button
                  onClick={() => onReject(document)}
                  className="inline-flex items-center text-sm text-red-600 hover:text-red-700"
                >
                  <XCircleIcon className="h-4 w-4 mr-1" />
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;





