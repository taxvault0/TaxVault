export const formatConsultationDate = (dateValue) => {
  if (!dateValue) return 'N/A';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'N/A';

  return date.toLocaleString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const getStatusLabel = (status = '') => {
  return String(status)
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

export const getParticipantName = (person) => {
  if (!person) return 'Unknown';
  return person.name || person.email || 'Unknown';
};