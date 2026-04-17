import { Home, Phone, Mail } from 'lucide-react';
import ErrorField from './ErrorField';
import { provinces } from '../modules';

const FirmDetails = ({
  formData,
  errors,
  handleChange
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Firm Details</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Firm Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            name="firmAddress"
            value={formData.firmAddress}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.firmAddress
                ? 'border-red-500 focus:ring-red-200 bg-red-50'
                : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
            }`}
            placeholder="123 Business Street"
          />
        </div>
        <ErrorField error={errors.firmAddress} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.city
                ? 'border-red-500 focus:ring-red-200 bg-red-50'
                : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
            }`}
            placeholder="Toronto"
          />
          <ErrorField error={errors.city} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Province <span className="text-red-500">*</span>
          </label>
          <select
            name="province"
            value={formData.province}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.province
                ? 'border-red-500 focus:ring-red-200 bg-red-50'
                : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
            }`}
          >
            <option value="">Province</option>
            {provinces.map((prov) => (
              <option key={prov.value} value={prov.value}>
                {prov.value}
              </option>
            ))}
          </select>
          <ErrorField error={errors.province} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Postal Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="firmPostalCode"
            value={formData.firmPostalCode}
            onChange={handleChange}
            maxLength={7}
            autoCapitalize="characters"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.firmPostalCode
                ? 'border-red-500 focus:ring-red-200 bg-red-50'
                : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
            }`}
            placeholder="A1A 1A1"
          />
          <ErrorField error={errors.firmPostalCode} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Firm Country
        </label>
        <input
          type="text"
          name="firmCountry"
          value={formData.firmCountry}
          disabled
          className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Firm Phone <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="tel"
              name="firmPhone"
              value={formData.firmPhone}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.firmPhone
                  ? 'border-red-500 focus:ring-red-200 bg-red-50'
                  : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
              }`}
              placeholder="(416) 555-0123"
            />
          </div>
          <ErrorField error={errors.firmPhone} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Firm Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              name="firmEmail"
              value={formData.firmEmail}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.firmEmail
                  ? 'border-red-500 focus:ring-red-200 bg-red-50'
                  : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
              }`}
              placeholder="info@firm.ca"
            />
          </div>
          <ErrorField error={errors.firmEmail} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Firm Size
          </label>
          <select
            name="firmSize"
            value={formData.firmSize}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
          >
            <option value="">Select size</option>
            <option value="Solo">Solo Practitioner</option>
            <option value="Small">Small (2-5 professionals)</option>
            <option value="Medium">Medium (6-20 professionals)</option>
            <option value="Large">Large (21+ professionals)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Partners
          </label>
          <input
            type="number"
            name="numberOfPartners"
            value={formData.numberOfPartners}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
            min="0"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Staff
          </label>
          <input
            type="number"
            name="numberOfStaff"
            value={formData.numberOfStaff}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
            min="0"
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Year Established
        </label>
        <input
          type="number"
          name="yearEstablished"
          value={formData.yearEstablished}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
          min="1900"
          max={new Date().getFullYear()}
          placeholder="2005"
        />
      </div>
    </div>
  );
};

export default FirmDetails;