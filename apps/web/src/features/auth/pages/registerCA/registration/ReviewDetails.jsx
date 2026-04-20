import ErrorField from './ErrorField';

const Section = ({ title, children }) => (
  <div className="border border-gray-200 rounded-lg p-4 space-y-2">
    <h4 className="font-semibold text-gray-800">{title}</h4>
    <div className="text-sm text-gray-700 space-y-1">{children}</div>
  </div>
);

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-4">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-800 text-right break-words">
      {value || '—'}
    </span>
  </div>
);

const ReviewDetails = ({
  formData,
  errors,
  handleChange,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">
        Review & Submit
      </h3>

      <p className="text-sm text-gray-600">
        Please review your information before submitting your registration.
      </p>

      <Section title="Account Information">
        <Row
          label="Name"
          value={`${formData.firstName || ''} ${formData.lastName || ''}`.trim()}
        />
        <Row label="Email" value={formData.email} />
        <Row label="Primary Phone" value={formData.phone} />
        <Row label="Alternate Phone" value={formData.alternatePhone} />
      </Section>

      <Section title="Professional Information">
        <Row label="Designation" value={formData.caDesignation} />
        <Row label="CA Number" value={formData.caNumber} />
        <Row
          label="Province of Registration"
          value={formData.provinceOfRegistration}
        />
        <Row label="Year Admitted" value={formData.yearAdmitted} />
        <Row label="Years of Experience" value={formData.yearsOfExperience} />
        <Row label="Firm Name" value={formData.firmName} />
        <Row label="Firm Website" value={formData.firmWebsite} />
        <Row label="Languages" value={(formData.languages || []).join(', ')} />
      </Section>

      <Section title="Firm Details">
        <Row label="Address" value={formData.firmAddress} />
        <Row label="City" value={formData.city} />
        <Row label="Province" value={formData.province} />
        <Row label="Postal Code" value={formData.firmPostalCode} />
        <Row label="Country" value={formData.firmCountry} />
        <Row label="Firm Phone" value={formData.firmPhone} />
        <Row label="Firm Email" value={formData.firmEmail} />
      </Section>

      <Section title="Credentials">
        <Row
          label="Professional Liability Insurance"
          value={formData.professionalLiabilityInsurance ? 'Yes' : 'No'}
        />
        <Row label="Insurance Provider" value={formData.insuranceProvider} />
        <Row label="Policy Number" value={formData.policyNumber} />
        <Row label="Expiry Date" value={formData.expiryDate} />
        <Row
          label="CPA Member in Good Standing"
          value={formData.cpaMemberInGoodStanding ? 'Yes' : 'No'}
        />
        <Row
          label="Peer Review Completed"
          value={formData.peerReviewCompleted ? 'Yes' : 'No'}
        />
        <Row label="Peer Review Date" value={formData.peerReviewDate} />
        <Row label="Peer Review Outcome" value={formData.peerReviewOutcome} />
        <Row
          label="Disciplinary History"
          value={formData.disciplinaryHistory ? 'Yes' : 'No'}
        />
      </Section>

      <Section title="Practice & Specialties">
        <Row label="Practice Type" value={formData.practiceType} />
        <Row
          label="Accepting New Clients"
          value={formData.acceptingNewClients ? 'Yes' : 'No'}
        />
        <Row
          label="Services Offered"
          value={(formData.servicesOffered || []).join(', ')}
        />
        <Row
          label="Client Types"
          value={(formData.clientTypes || []).join(', ')}
        />
        <Row
          label="Tax Specialties"
          value={(formData.taxSpecialties || []).join(', ')}
        />
        <Row
          label="Provincial Specialties"
          value={(formData.provincialSpecialties || []).join(', ')}
        />
        <Row
          label="Accounting Software"
          value={(formData.accountingSoftware || []).join(', ')}
        />
        <Row
          label="Tax Software"
          value={(formData.taxSoftware || []).join(', ')}
        />
      </Section>

      <Section title="Verification">
        <Row
          label="Authorize Verification"
          value={formData.authorizeVerification ? 'Yes' : 'No'}
        />
        <Row
          label="Background Check Consent"
          value={formData.backgroundCheckConsent ? 'Yes' : 'No'}
        />
      </Section>

      <div className="border border-gray-200 rounded-lg p-4 space-y-4">
        <h4 className="font-semibold text-gray-800">Agreements</h4>

        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={formData.agreeToTerms || false}
            onChange={(e) =>
              handleChange({
                target: {
                  name: 'agreeToTerms',
                  type: 'checkbox',
                  checked: e.target.checked,
                },
              })
            }
          />
          <span className="text-sm text-gray-700">
            I agree to the Terms and Conditions.
          </span>
        </label>
        <ErrorField error={errors.agreeToTerms} />

        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={formData.agreeToPrivacy || false}
            onChange={(e) =>
              handleChange({
                target: {
                  name: 'agreeToPrivacy',
                  type: 'checkbox',
                  checked: e.target.checked,
                },
              })
            }
          />
          <span className="text-sm text-gray-700">
            I agree to the Privacy Policy.
          </span>
        </label>
        <ErrorField error={errors.agreeToPrivacy} />

        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={formData.agreedProfessionalTerms || false}
            onChange={(e) =>
              handleChange({
                target: {
                  name: 'agreedProfessionalTerms',
                  type: 'checkbox',
                  checked: e.target.checked,
                },
              })
            }
          />
          <span className="text-sm text-gray-700">
            I agree to the Professional Terms.
          </span>
        </label>
        <ErrorField error={errors.agreedProfessionalTerms} />

        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={formData.confirmAccuracy || false}
            onChange={(e) =>
              handleChange({
                target: {
                  name: 'confirmAccuracy',
                  type: 'checkbox',
                  checked: e.target.checked,
                },
              })
            }
          />
          <span className="text-sm text-gray-700">
            I confirm that all information provided is accurate and complete.
          </span>
        </label>
        <ErrorField error={errors.confirmAccuracy} />
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          After submission, your application will be reviewed before approval.
        </p>
      </div>
    </div>
  );
};

export default ReviewDetails;