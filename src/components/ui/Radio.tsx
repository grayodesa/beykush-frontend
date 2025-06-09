import React from 'react';
import { cn } from '@/lib/utils';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  required?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  error,
  helperText,
  orientation = 'vertical',
  className,
  required,
}) => {
  const hasError = !!error;
  const groupId = `radio-group-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <fieldset className={cn('space-y-2', className)}>
      {label && (
        <legend className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </legend>
      )}
      <div
        className={cn(
          'space-y-2',
          orientation === 'horizontal' && 'flex flex-wrap gap-6 space-y-0'
        )}
        role="radiogroup"
        aria-invalid={hasError}
        aria-describedby={
          hasError ? `${groupId}-error` : helperText ? `${groupId}-helper` : undefined
        }
      >
        {options.map((option) => {
          const radioId = `${name}-${option.value}`;
          return (
            <div key={option.value} className="flex items-center">
              <input
                id={radioId}
                name={name}
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange?.(e.target.value)}
                disabled={option.disabled}
                className={cn(
                  'h-4 w-4 border-gray-300 text-purple-600',
                  'focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
                  'transition-colors duration-200',
                  hasError && 'border-red-500'
                )}
                required={required}
              />
              <label
                htmlFor={radioId}
                className={cn(
                  'ml-3 text-sm font-medium text-gray-700 cursor-pointer select-none',
                  option.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
      {hasError && (
        <p id={`${groupId}-error`} className="error-message" role="alert">
          {error}
        </p>
      )}
      {helperText && !hasError && (
        <p id={`${groupId}-helper`} className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </fieldset>
  );
};