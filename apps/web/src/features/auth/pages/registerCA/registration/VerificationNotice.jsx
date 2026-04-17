import { Verified } from 'lucide-react';

const VerificationNotice = () => {
  return (
    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <Verified className="text-primary-500 mr-3 mt-1" size={20} />
        <div>
          <p className="text-sm font-medium text-primary-700">
            Professional Verification Required
          </p>
          <p className="text-xs text-primary-600 mt-1">
            All CA registrations are verified with the provincial CPA body.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationNotice;