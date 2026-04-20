import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRightIcon, 
  DocumentIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const ClientTable = ({ clients }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'attention':
        return <ExclamationTriangleIcon className="h-5 w-5 text-warning-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ready':
        return 'Ready to file';
      case 'attention':
        return 'Needs attention';
      default:
        return 'In progress';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'attention':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documents
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tasks
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Activity
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-medium">
                        {client.name.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{client.name}</div>
                      <div className="text-sm text-gray-500">{client.type}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(client.status)}
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(client.status)}`}>
                      {getStatusText(client.status)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <DocumentIcon className="h-4 w-4 mr-1" />
                    <span>{client.documentsUploaded}/{client.documentsRequired}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {client.pendingTasks > 0 ? (
                    <span className="text-sm text-warning-600 font-medium">
                      {client.pendingTasks} pending
                    </span>
                  ) : (
                    <span className="text-sm text-green-600">All clear</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {client.lastActivity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/ca/clients/${client.id}`}
                    className="text-primary-600 hover:text-primary-900 flex items-center justify-end"
                  >
                    View
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientTable;





