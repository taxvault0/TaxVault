import { Home, Phone, Mail } from 'lucide-react';
import ErrorField from './ErrorField';
import GoogleAddressInput from 'components/address/GoogleAddressInput';

const FirmDetails = ({ formData, errors, handleChange }) => {
  const handleAddressChange = (address) => {
    handleChange({ target: { name: 'firmAddressData', value: address } });
    handleChange({ target: { name: 'firmAddress', value: address.formattedAddress } });
    handleChange({ target: { name: 'city', value: address.city } });
    handleChange({ target: { name: 'province', value: address.province } });
    handleChange({ target: { name: 'firmPostalCode', value: address.postalCode } });
    handleChange({ target: { name: 'firmCountry', value: address.country } });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Firm Details</h3>

      {/* ✅ GOOGLE ADDRESS */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Firm Address <span className="text-red-500">*</span>
        </label>

        <GoogleAddressInput
          value={formData.firmAddressData}
          onChange={handleAddressChange}
        />

        <ErrorField error={errors.firmAddress} />
      </div>

      {/* ✅ AUTO FILLED (READ ONLY) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            value={formData.city || ''}
            disabled
            className="w-full px-3 py-2 bg-gray-100 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Province
          </label>
          <input
            value={formData.province || ''}
            disabled
            className="w-full px-3 py-2 bg-gray-100 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Postal Code
          </label>
          <input
            value={formData.firmPostalCode || ''}
            disabled
            className="w-full px-3 py-2 bg-gray-100 border rounded-lg"
          />
        </div>
      </div>

      {/* COUNTRY */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Firm Country
        </label>
        <input
          value={formData.firmCountry || 'Canada'}
          disabled
          className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500"
        />
      </div>

      {/* PHONE */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Firm Phone <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="tel"
            name="firmPhone"
            value={formData.firmPhone}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
              errors.firmPhone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="(416) 555-0123"
          />
        </div>
        <ErrorField error={errors.firmPhone} />
      </div>

      {/* EMAIL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Firm Email <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="email"
            name="firmEmail"
            value={formData.firmEmail}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
              errors.firmEmail ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="info@firm.ca"
          />
        </div>
        <ErrorField error={errors.firmEmail} />
      </div>

      {/* SIZE */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Firm Size
        </label>
        <select
          name="firmSize"
          value={formData.firmSize}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="">Select size</option>
          <option value="Solo">Solo Practitioner</option>
          <option value="Small">Small (2-5 professionals)</option>
          <option value="Medium">Medium (6-20 professionals)</option>
          <option value="Large">Large (21+ professionals)</option>
        </select>
      </div>

      {/* NUMBERS */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          name="numberOfPartners"
          value={formData.numberOfPartners}
          onChange={handleChange}
          placeholder="Partners"
          className="w-full px-3 py-2 border rounded-lg"
        />

        <input
          type="number"
          name="numberOfStaff"
          value={formData.numberOfStaff}
          onChange={handleChange}
          placeholder="Staff"
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <input
        type="number"
        name="yearEstablished"
        value={formData.yearEstablished}
        onChange={handleChange}
        placeholder="Year Established"
        className="w-full px-3 py-2 border rounded-lg"
      />
    </div>
  );
};

export default FirmDetails;