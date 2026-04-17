import { AlertCircle } from 'lucide-react';

const ErrorAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <p className="ml-3 text-sm text-red-700">{message}</p>
      </div>
    </div>
  );
};

export default ErrorAlert;