import ErrorField from './ErrorField';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CredentialsDetails = ({
  formData,
  errors,
  handleChange,
  handleFileUpload,
  uploadedFiles,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Professional Credentials
      </h3>

      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <p className="text-sm font-medium text-amber-800">
          Verification Required
        </p>
        <p className="text-xs text-amber-700 mt-1">
          Your credentials will be reviewed before your profile is approved.
        </p>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-800">
          Professional Liability Insurance
        </h4>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="professionalLiabilityInsurance"
            checked={!!formData.professionalLiabilityInsurance}
            onChange={handleChange}
          />
          <span className="text-sm text-gray-700">
            I have active professional liability insurance
          </span>
        </label>
        <ErrorField error={errors.professionalLiabilityInsurance} />

        {formData.professionalLiabilityInsurance && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Insurance Provider <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="insuranceProvider"
                value={formData.insuranceProvider || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.insuranceProvider
                    ? 'border-red-500 focus:ring-red-200 bg-red-50'
                    : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                }`}
                placeholder="Insurance company name"
              />
              <ErrorField error={errors.insuranceProvider} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Policy Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="policyNumber"
                value={formData.policyNumber || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.policyNumber
                    ? 'border-red-500 focus:ring-red-200 bg-red-50'
                    : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                }`}
                placeholder="POL-123456"
              />
              <ErrorField error={errors.policyNumber} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coverage Amount
              </label>
              <input
                type="text"
                name="coverageAmount"
                value={formData.coverageAmount || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                placeholder="$1,000,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.expiryDate
                    ? 'border-red-500 focus:ring-red-200 bg-red-50'
                    : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                }`}
              />
              <ErrorField error={errors.expiryDate} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insurance Certificate
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center">
                <input
                  id="insuranceCertificate"
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    handleFileUpload('insuranceCertificate', e.target.files?.[0])
                  }
                />
                <label htmlFor="insuranceCertificate" className="cursor-pointer">
                  <p className="text-sm text-gray-600">
                    Click to upload insurance certificate
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, PNG, JPG
                  </p>
                </label>
                {uploadedFiles?.insuranceCertificate && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {uploadedFiles.insuranceCertificate.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-800">CPA Membership</h4>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="cpaMemberInGoodStanding"
            checked={!!formData.cpaMemberInGoodStanding}
            onChange={handleChange}
          />
          <span className="text-sm text-gray-700">
            I am a member in good standing with the CPA body
          </span>
        </label>
        <ErrorField error={errors.cpaMemberInGoodStanding} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            License Verification Number
          </label>
          <input
            type="text"
            name="licenseVerification"
            value={formData.licenseVerification || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
            placeholder="Enter verification number if available"
          />
          <ErrorField error={errors.licenseVerification} />
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-800">Peer Review</h4>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="peerReviewCompleted"
            checked={!!formData.peerReviewCompleted}
            onChange={handleChange}
          />
          <span className="text-sm text-gray-700">
            I completed peer review within the last 3 years
          </span>
        </label>

        {formData.peerReviewCompleted && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peer Review Date
              </label>

              <DatePicker
                selected={
                  formData.peerReviewDate
                    ? new Date(`${formData.peerReviewDate}T00:00:00`)
                    : null
                }
                onChange={(date) =>
                  handleChange({
                    target: {
                      name: 'peerReviewDate',
                      value: date
                        ? `${date.getFullYear()}-${String(
                            date.getMonth() + 1
                          ).padStart(2, '0')}-${String(
                            date.getDate()
                          ).padStart(2, '0')}`
                        : '',
                    },
                  })
                }
                dateFormat="yyyy-MM-dd"
                placeholderText="Select date"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.peerReviewDate
                    ? 'border-red-500 focus:ring-red-200 bg-red-50'
                    : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'
                }`}
                maxDate={new Date()}
                showPopperArrow={false}
              />

              <ErrorField error={errors.peerReviewDate} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Outcome
              </label>
              <select
                name="peerReviewOutcome"
                value={formData.peerReviewOutcome || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
              >
                <option value="">Select outcome</option>
                <option value="Pass">Pass</option>
                <option value="Pass with Conditions">Pass with Conditions</option>
                <option value="Pending">Pending</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peer Review Report
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center">
                <input
                  id="peerReviewReport"
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) =>
                    handleFileUpload('peerReviewReport', e.target.files?.[0])
                  }
                />
                <label htmlFor="peerReviewReport" className="cursor-pointer">
                  <p className="text-sm text-gray-600">
                    Click to upload peer review report
                  </p>
                </label>
                {uploadedFiles?.peerReviewReport && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {uploadedFiles.peerReviewReport.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-800">Disciplinary History</h4>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="disciplinaryHistory"
            checked={!!formData.disciplinaryHistory}
            onChange={handleChange}
          />
          <span className="text-sm text-gray-700">
            I have disciplinary history to disclose
          </span>
        </label>

        {formData.disciplinaryHistory && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Details
            </label>
            <textarea
              name="disciplinaryDetails"
              value={formData.disciplinaryDetails || ''}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
              placeholder="Provide details of disciplinary history"
            />
            <ErrorField error={errors.disciplinaryDetails} />
          </div>
        )}

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="backgroundCheckConsent"
            checked={!!formData.backgroundCheckConsent}
            onChange={handleChange}
          />
          <span className="text-sm text-gray-700">
            I consent to a background check if required
          </span>
        </label>
      </div>
    </div>
  );
};

export default CredentialsDetails;