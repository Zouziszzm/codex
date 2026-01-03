import { ChangeEvent } from 'react';

interface FormFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: 'text' | 'textarea' | 'number' | 'date';
  required?: boolean;
  placeholder?: string;
}

export function FormField({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder,
}: FormFieldProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    onChange(newValue);
  };

  const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={handleChange}
          required={required}
          placeholder={placeholder}
          className={`${baseClasses} min-h-[100px]`}
          rows={4}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={handleChange}
          required={required}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}
    </div>
  );
}
