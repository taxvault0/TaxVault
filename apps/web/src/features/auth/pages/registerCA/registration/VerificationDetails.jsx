import ErrorField from './ErrorField';

const VerificationDetails = ({
  formData,
  errors,
  handleChange,
  handleFileUpload,
  uploadedFiles,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Verification & Documents
      </h3>

      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <p className="text-sm font-medium text-primary-700">
          Professional Verification Required
        </p>
        <p className="text-xs text-primary-600 mt-1">
          Please upload your supporting documents so your registration can be
          reviewed.
        </p>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-800">Required Documents</h4>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CA Certificate <span className="text-red-500">*</span>
          </label>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center">
            <input
              id="caCertificate"
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) =>
                handleFileUpload('caCertificate', e.target.files?.[0] || null)
              }
            />
            <label htmlFor="caCertificate" className="cursor-pointer">
              <p className="text-sm text-gray-600">
                Click to upload CA certificate
              </p>
              <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG</p>
            </label>

            {(uploadedFiles?.caCertificate || formData?.caCertificate) && (
              <p className="text-sm text-green-600 mt-2">
                ✓{' '}
                {uploadedFiles?.caCertificate?.name ||
                  formData?.caCertificate ||
                  'File selected'}
              </p>
            )}
          </div>

          <ErrorField error={errors.caCertificate} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Headshot
          </label>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center">
            <input
              id="professionalHeadshot"
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={(e) =>
                handleFileUpload(
                  'professionalHeadshot',
                  e.target.files?.[0] || null
                )
              }
            />
            <label htmlFor="professionalHeadshot" className="cursor-pointer">
              <p className="text-sm text-gray-600">
                Click to upload professional headshot
              </p>
            </label>

            {(uploadedFiles?.professionalHeadshot ||
              formData?.professionalHeadshot) && (
              <p className="text-sm text-green-600 mt-2">
                ✓{' '}
                {uploadedFiles?.professionalHeadshot?.name ||
                  formData?.professionalHeadshot ||
                  'File selected'}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Firm Logo
          </label>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center">
            <input
              id="firmLogo"
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.webp,.svg"
              onChange={(e) =>
                handleFileUpload('firmLogo', e.target.files?.[0] || null)
              }
            />
            <label htmlFor="firmLogo" className="cursor-pointer">
              <p className="text-sm text-gray-600">Click to upload firm logo</p>
            </label>

            {(uploadedFiles?.firmLogo || formData?.firmLogo) && (
              <p className="text-sm text-green-600 mt-2">
                ✓ {uploadedFiles?.firmLogo?.name || formData?.firmLogo || 'File selected'}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-800">References</h4>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional References
          </label>
          <p className="text-xs text-gray-500 mb-3">
            References are optional in your current payload, but the field is
            preserved.
          </p>

          {(formData.professionalReferences || []).length > 0 ? (
            <div className="space-y-3">
              {(formData.professionalReferences || []).map((ref, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border rounded-lg bg-gray-50"
                >
                  <input
                    type="text"
                    value={ref?.name || ''}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                    placeholder="Reference name"
                  />
                  <input
                    type="text"
                    value={ref?.email || ''}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                    placeholder="Reference email"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No professional references added yet.
            </p>
          )}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <h4 className="font-medium text-gray-800">Authorizations</h4>

        <div>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              name="authorizeVerification"
              checked={!!formData.authorizeVerification}
              onChange={handleChange}
              className="mt-1"
            />
            <span className="text-sm text-gray-700">
              I authorize TaxVault to verify my credentials with the relevant
              CPA body
            </span>
          </label>
          <ErrorField error={errors.authorizeVerification} />
        </div>

        <div>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              name="backgroundCheckConsent"
              checked={!!formData.backgroundCheckConsent}
              onChange={handleChange}
              className="mt-1"
            />
            <span className="text-sm text-gray-700">
              I consent to a background check where required
            </span>
          </label>
          <ErrorField error={errors.backgroundCheckConsent} />
        </div>
      </div>
    </div>
  );
};

export default VerificationDetails;