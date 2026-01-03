import { ChangeEvent } from 'react';

interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function SliderField({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.1,
}: SliderFieldProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-right">
          {value.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
