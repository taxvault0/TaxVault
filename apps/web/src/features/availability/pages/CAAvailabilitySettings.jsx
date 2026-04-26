import React, { useState } from 'react';
import api from 'services/api';

const CAAvailabilitySettings = () => {
  const [hours, setHours] = useState({
    monday: [{ start: '09:00', end: '17:00' }],
  });

  const save = async () => {
    await api.put('/ca/availability', {
      hoursOfOperation: hours,
    });
    alert('Saved');
  };

  return (
    <div>
      <h2>Set Availability</h2>

      <button onClick={save}>Save Availability</button>
    </div>
  );
};

export default CAAvailabilitySettings;