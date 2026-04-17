export const handleArrayChange = (prev, field, value) => ({
  ...prev,
  [field]: prev[field].includes(value)
    ? prev[field].filter(item => item !== value)
    : [...prev[field], value]
});

export const handleFileUploadValue = (file) => file?.name || '';