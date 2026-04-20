import { Award, Calendar, Clock, Building, Globe } from 'lucide-react';
import ErrorField from './ErrorField';
import {
  CA_DESIGNATIONS as caDesignations,
  PROVINCES as provinces,
  AREAS_OF_EXPERTISE as expertiseAreas,
  LANGUAGES as languages,
} from '@shared/caRegistration/options';

const getOptionValue = (option) => {
  if (typeof option === 'string') return option;

  return (
    option?.value ??
    option?.code ??
    option?.id ??
    option?.key ??
    option?.name ??
    option?.label ??
    ''
  );
};

const getOptionLabel = (option) => {
  if (typeof option === 'string') return option;

  return (
    option?.label ??
    option?.name ??
    option?.title ??
    option?.value ??
    option?.code ??
    ''
  );
};

const ProfessionalDetails = ({
  formData,
  errors,
  handleChange,
  handleArrayChange,
}) => {
  const selectedAreas = Array.isArray(formData.areasOfExpertise)
    ? formData.areasOfExpertise
    : [];

  const selectedLanguages = Array.isArray(formData.languages)
    ? formData.languages
    : [];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Professional Information
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          CA Designation <span className="text-red-500">*</span>
        </label>
        <select
          name="caDesignation"
          value={formData.caDesignation}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.caDesignation
              ? 'border-red-500 focus:ring-red-200 bg-red-50'
              : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
          }`}
        >
          <option value="">Select your designation</option>
          {caDesignations.map((des, index) => {
            const value = getOptionValue(des);
            const label = getOptionLabel(des);

            return (
              <option key={value || index} value={value}>
                {label}
              </option>
            );
          })}
        </select>
        <ErrorField error={errors.caDesignation} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CA Number / License Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Award
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              name="caNumber"
              value={formData.caNumber}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.caNumber
                  ? 'border-red-500 focus:ring-red-200 bg-red-50'
                  : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
              }`}
              placeholder="CPA-123456"
            />
          </div>
          <ErrorField error={errors.caNumber} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Province of Registration <span className="text-red-500">*</span>
          </label>
          <select
            name="provinceOfRegistration"
            value={formData.provinceOfRegistration}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.provinceOfRegistration
                ? 'border-red-500 focus:ring-red-200 bg-red-50'
                : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
            }`}
          >
            <option value="">Select province</option>
            {provinces.map((prov, index) => {
              const value = getOptionValue(prov);
              const label = getOptionLabel(prov);

              return (
                <option key={value || index} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
          <ErrorField error={errors.provinceOfRegistration} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year Admitted <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              name="yearAdmitted"
              value={formData.yearAdmitted}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.yearAdmitted
                  ? 'border-red-500 focus:ring-red-200 bg-red-50'
                  : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
              }`}
              placeholder="2010"
              inputMode="numeric"
              maxLength={4}
            />
          </div>
          <ErrorField error={errors.yearAdmitted} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Years of Experience <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Clock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="number"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.yearsOfExperience
                  ? 'border-red-500 focus:ring-red-200 bg-red-50'
                  : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
              }`}
              placeholder="12"
              min="0"
            />
          </div>
          <ErrorField error={errors.yearsOfExperience} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Firm Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Building
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            name="firmName"
            value={formData.firmName}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.firmName
                ? 'border-red-500 focus:ring-red-200 bg-red-50'
                : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
            }`}
            placeholder="Smith & Associates LLP"
          />
        </div>
        <ErrorField error={errors.firmName} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Firm Website (Optional)
        </label>
        <div className="relative">
          <Globe
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="url"
            name="firmWebsite"
            value={formData.firmWebsite}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
            placeholder="https://www.smithassociates.ca"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Areas of Expertise
        </label>
        <div className="grid grid-cols-2 gap-3">
          {expertiseAreas.slice(0, 10).map((area, index) => {
            const value = getOptionValue(area);
            const label = getOptionLabel(area);

            return (
              <label key={value || index} className="flex items-center">
                <input
                  type="checkbox"
                  value={value}
                  checked={selectedAreas.includes(value)}
                  onChange={() => handleArrayChange('areasOfExpertise', value)}
                  className="w-4 h-4 text-primary-500 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Languages Spoken
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {languages.map((lang, index) => {
            const value = getOptionValue(lang);
            const label = getOptionLabel(lang);

            return (
              <label key={value || index} className="flex items-center">
                <input
                  type="checkbox"
                  value={value}
                  checked={selectedLanguages.includes(value)}
                  onChange={() => handleArrayChange('languages', value)}
                  className="w-4 h-4 text-primary-500 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{label}</span>
              </label>
            );
          })}
        </div>

        {selectedLanguages.includes('Other') && (
          <div className="mt-4">
            <input
              type="text"
              name="otherLanguage"
              value={formData.otherLanguage || ''}
              onChange={handleChange}
              placeholder="Enter other language"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.otherLanguage
                  ? 'border-red-500 focus:ring-red-200 bg-red-50'
                  : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
              }`}
            />
            <ErrorField error={errors.otherLanguage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalDetails;