'use client'
import { useRef } from 'react';

type DateFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  children?: React.ReactNode;
};

export default function DateField({
  label,
  value,
  onChange,
  min,
  className = "",
  inputClassName = "",
  disabled = false,
  children
}: DateFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openPicker = () => {
    if (disabled) return;

    const input = inputRef.current;
    if (!input) return;

    (input as any).showPicker?.() || input.focus();
  };

  return (
    <div
      className={`px-6 py-4 cursor-pointer ${className}`}
      onClick={openPicker}
    >
      <div className="text-[#989898] text-[14px] uppercase">
        {label}
      </div>

      <input
        ref={inputRef}
        type="date"
        value={value}
        min={min}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`text-gray-700 text-sm mt-1 bg-transparent outline-none pointer-events-none ${inputClassName}`}
      />

      {/* custom content */}
      {children}
    </div>
  );
}