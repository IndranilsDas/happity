'use client';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export interface CustomDatePickerProps {
  value?: Date | undefined; // Replaces selectedDate
  onChange: (date: Date | null) => void;
  disabled?: boolean;
}

export function CustomDatePicker({
  value, // Updated prop name
  onChange,
  disabled = false, // Default to false if not provided
}: CustomDatePickerProps) {
  return (
    <div className="w-full">
      <DatePicker
        selected={value} // Updated to use value
        onChange={onChange}
        disabled={disabled}
        placeholderText="Select date"
        className="w-full border rounded px-3 py-2 text-sm"
        dateFormat="dd MMM yyyy"
      />
    </div>
  );
}