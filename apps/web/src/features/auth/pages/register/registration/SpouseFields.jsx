import React from 'react';
import FormField from './FormField';

const SpouseFields = ({ formData, errors, handleChange }) => {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <FormField
        label="Spouse Full Name"
        name="spouseName"
        value={formData.spouseName}
        onChange={handleChange}
        error={errors.spouseName}
      />

      <FormField
        label="Spouse Date of Birth"
        name="spouseDob"
        type="date"
        value={formData.spouseDob}
        onChange={handleChange}
        error={errors.spouseDob}
        placeholder="MM/DD/YYYY"
        maxDate={new Date()}
      />

      <FormField
        label="Spouse SIN Number (Optional)"
        name="spouseSin"
        value={formData.spouseSin}
        onChange={handleChange}
        error={errors.spouseSin}
      />

      <FormField
        label="Spouse Phone (Optional)"
        name="spousePhone"
        value={formData.spousePhone}
        onChange={handleChange}
        error={errors.spousePhone}
      />
    </div>
  );
};

export default SpouseFields;