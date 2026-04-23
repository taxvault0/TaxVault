import React, { useMemo, useState } from 'react';
import './CAOfficeHoursPage.css';

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

const DEFAULT_OFFICE_HOURS = {
  monday: { closed: false, open: '09:00', close: '17:00' },
  tuesday: { closed: false, open: '09:00', close: '17:00' },
  wednesday: { closed: false, open: '09:00', close: '17:00' },
  thursday: { closed: false, open: '09:00', close: '17:00' },
  friday: { closed: false, open: '09:00', close: '17:00' },
  saturday: { closed: true, open: '', close: '' },
  sunday: { closed: true, open: '', close: '' },
};

const formatTime = (value) => {
  if (!value || !value.includes(':')) return '';
  const [hourStr, minute] = value.split(':');
  let hour = Number(hourStr);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${String(hour).padStart(2, '0')}:${minute} ${suffix}`;
};

const CAOfficeHoursPage = () => {
  const [officeHours, setOfficeHours] = useState(DEFAULT_OFFICE_HOURS);
  const [errors, setErrors] = useState({});
  const [saveMessage, setSaveMessage] = useState('');

  const updateDay = (dayKey, patch) => {
    setOfficeHours((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        ...patch,
      },
    }));

    setErrors((prev) => {
      const next = { ...prev };
      delete next[`${dayKey}.open`];
      delete next[`${dayKey}.close`];
      delete next[`${dayKey}.range`];
      return next;
    });

    setSaveMessage('');
  };

  const handleClosedToggle = (dayKey, closed) => {
    setOfficeHours((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        closed,
        open: closed ? '' : prev[dayKey].open || '09:00',
        close: closed ? '' : prev[dayKey].close || '17:00',
      },
    }));

    setErrors((prev) => {
      const next = { ...prev };
      delete next[`${dayKey}.open`];
      delete next[`${dayKey}.close`];
      delete next[`${dayKey}.range`];
      return next;
    });

    setSaveMessage('');
  };

  const validate = () => {
    const nextErrors = {};

    DAYS.forEach(({ key }) => {
      const row = officeHours[key];

      if (row.closed) return;

      if (!row.open) {
        nextErrors[`${key}.open`] = 'Opening time is required';
      }

      if (!row.close) {
        nextErrors[`${key}.close`] = 'Closing time is required';
      }

      if (row.open && row.close && row.open >= row.close) {
        nextErrors[`${key}.range`] = 'Closing time must be after opening time';
      }
    });

    return nextErrors;
  };

  const handleApplyWeekdays = () => {
    setOfficeHours((prev) => ({
      ...prev,
      monday: { closed: false, open: '09:00', close: '17:00' },
      tuesday: { closed: false, open: '09:00', close: '17:00' },
      wednesday: { closed: false, open: '09:00', close: '17:00' },
      thursday: { closed: false, open: '09:00', close: '17:00' },
      friday: { closed: false, open: '09:00', close: '17:00' },
    }));
    setErrors({});
    setSaveMessage('');
  };

  const handleApplyClosedWeekends = () => {
    setOfficeHours((prev) => ({
      ...prev,
      saturday: { closed: true, open: '', close: '' },
      sunday: { closed: true, open: '', close: '' },
    }));
    setErrors({});
    setSaveMessage('');
  };

  const handleSave = async () => {
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSaveMessage('');
      return;
    }

    try {
      // Replace this with your real API call
      // await api.put('/ca/profile/office-hours', { officeHours });

      console.log('Saving office hours:', officeHours);
      setSaveMessage('Office hours saved successfully.');
    } catch (error) {
      console.error(error);
      setSaveMessage('Could not save office hours.');
    }
  };

  const summary = useMemo(() => {
    return DAYS.map(({ key, label }) => {
      const row = officeHours[key];
      if (row.closed) return `${label}: Closed`;
      return `${label}: ${formatTime(row.open)} - ${formatTime(row.close)}`;
    });
  }, [officeHours]);

  return (
    <div className="office-hours-page">
      <div className="office-hours-header-card">
        <div>
          <h1 className="office-hours-title">Office Hours</h1>
          <p className="office-hours-subtitle">
            Manage the hours clients can expect your practice to be available.
          </p>
        </div>
      </div>

      <div className="office-hours-card">
        <div className="office-hours-toolbar">
          <button
            type="button"
            className="secondary-btn"
            onClick={handleApplyWeekdays}
          >
            Apply Mon–Fri 9:00 AM – 5:00 PM
          </button>
          <button
            type="button"
            className="secondary-btn"
            onClick={handleApplyClosedWeekends}
          >
            Close Weekends
          </button>
        </div>

        <div className="office-hours-table-wrap">
          <table className="office-hours-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Status</th>
                <th>Open</th>
                <th>Close</th>
              </tr>
            </thead>
            <tbody>
              {DAYS.map(({ key, label }) => {
                const row = officeHours[key];
                const isClosed = !!row.closed;

                return (
                  <tr key={key}>
                    <td className="day-cell">{label}</td>

                    <td>
                      <label className="closed-checkbox">
                        <input
                          type="checkbox"
                          checked={isClosed}
                          onChange={(e) =>
                            handleClosedToggle(key, e.target.checked)
                          }
                        />
                        <span>Closed</span>
                      </label>
                    </td>

                    <td>
                      <input
                        type="time"
                        className={`time-input ${
                          errors[`${key}.open`] || errors[`${key}.range`]
                            ? 'input-error'
                            : ''
                        }`}
                        value={row.open}
                        disabled={isClosed}
                        onChange={(e) =>
                          updateDay(key, { open: e.target.value })
                        }
                      />
                      {errors[`${key}.open`] && (
                        <p className="field-error">{errors[`${key}.open`]}</p>
                      )}
                    </td>

                    <td>
                      <input
                        type="time"
                        className={`time-input ${
                          errors[`${key}.close`] || errors[`${key}.range`]
                            ? 'input-error'
                            : ''
                        }`}
                        value={row.close}
                        disabled={isClosed}
                        onChange={(e) =>
                          updateDay(key, { close: e.target.value })
                        }
                      />
                      {errors[`${key}.close`] && (
                        <p className="field-error">{errors[`${key}.close`]}</p>
                      )}
                      {errors[`${key}.range`] && (
                        <p className="field-error">{errors[`${key}.range`]}</p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {saveMessage ? (
          <div
            className={`save-message ${
              saveMessage.toLowerCase().includes('success')
                ? 'success'
                : 'error'
            }`}
          >
            {saveMessage}
          </div>
        ) : null}

        <div className="office-hours-actions">
          <button type="button" className="primary-btn" onClick={handleSave}>
            Save Office Hours
          </button>
        </div>
      </div>

      <div className="office-hours-card">
        <h2 className="summary-title">Weekly Summary</h2>
        <div className="summary-list">
          {summary.map((item) => (
            <div key={item} className="summary-row">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CAOfficeHoursPage;