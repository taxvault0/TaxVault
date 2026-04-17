import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PillSelector = ({
  name,
  value,
  onChange,
  options = [],
  multiple = false,
  disabled = false,
}) => {
  const selectedValues = multiple ? value || [] : [value];

  const handleSelect = (optionValue) => {
    if (disabled) return;

    let nextValue;

    if (multiple) {
      const exists = selectedValues.includes(optionValue);
      nextValue = exists
        ? selectedValues.filter((item) => item !== optionValue)
        : [...selectedValues, optionValue];
    } else {
      nextValue = optionValue;
    }

    onChange({
      target: {
        name,
        value: nextValue,
        type: multiple ? 'pill-multi' : 'pill',
      },
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt, i) => {
        const optionValue = typeof opt === 'string' ? opt : opt.value;
        const optionLabel = typeof opt === 'string' ? opt : opt.label;
        const isSelected = selectedValues.includes(optionValue);

        return (
          <button
            key={i}
            type="button"
            onClick={() => handleSelect(optionValue)}
            disabled={disabled}
            className={[
              'rounded-full border px-4 py-2 text-sm font-medium transition',
              isSelected
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-600',
              disabled ? 'cursor-not-allowed opacity-60' : '',
            ].join(' ')}
          >
            {optionLabel}
          </button>
        );
      })}
    </div>
  );
};

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  options = [],
  isSelect = false,
  isTextarea = false,
  isPills = false,
  isMultiPills = false,
  disabled = false,
  placeholder = '',
  maxDate,
  minDate,
}) => {
  const baseClass =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500';

  const parseDateValue = (dateValue) => {
    if (!dateValue) return null;

    if (typeof dateValue === 'string') {
      const parts = dateValue.split('-');
      if (parts.length === 3) {
        const [year, month, day] = parts.map(Number);
        return new Date(year, month - 1, day);
      }
    }

    const parsed = new Date(dateValue);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const formatDateValue = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (date) => {
    onChange({
      target: {
        name,
        value: formatDateValue(date),
      },
    });
  };

  const normalizedMaxDate = maxDate ? new Date(maxDate) : undefined;
  const normalizedMinDate = minDate ? new Date(minDate) : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </label>

      {isPills || isMultiPills ? (
        <PillSelector
          name={name}
          value={value}
          onChange={onChange}
          options={options}
          multiple={isMultiPills}
          disabled={disabled}
        />
      ) : isSelect ? (
        <select
          id={name}
          name={name}
          value={value || ''}
          onChange={onChange}
          disabled={disabled}
          className={baseClass}
        >
          <option value="">Select</option>
          {options.map((opt, i) => {
            const optionValue = typeof opt === 'string' ? opt : opt.value;
            const optionLabel = typeof opt === 'string' ? opt : opt.label;

            return (
              <option key={i} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>
      ) : isTextarea ? (
        <textarea
          id={name}
          name={name}
          value={value || ''}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          rows={4}
          className={baseClass}
        />
      ) : type === 'date' ? (
        <DatePicker
          id={name}
          selected={parseDateValue(value)}
          onChange={handleDateChange}
          disabled={disabled}
          placeholderText={placeholder || 'MM/DD/YYYY'}
          dateFormat="MM/dd/yyyy"
          maxDate={normalizedMaxDate}
          minDate={normalizedMinDate}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          className={baseClass}
          wrapperClassName="w-full"
          autoComplete="off"
          isClearable
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={baseClass}
        />
      )}

      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
};

export default FormField;