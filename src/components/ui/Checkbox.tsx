import React from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    return (
      <div className="space-y-1">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              className={cn(
                'h-4 w-4 rounded border-gray-300 text-purple-600',
                'focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
                'transition-colors duration-200',
                hasError && 'border-red-500',
                className
              )}
              aria-invalid={hasError}
              aria-describedby={
                hasError ? `${checkboxId}-error` : helperText ? `${checkboxId}-helper` : undefined
              }
              {...props}
            />
          </div>
          {label && (
            <label
              htmlFor={checkboxId}
              className="ml-3 text-sm font-medium text-gray-700 cursor-pointer select-none"
            >
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
        </div>
        {hasError && (
          <p id={`${checkboxId}-error`} className="error-message ml-7" role="alert">
            {error}
          </p>
        )}
        {helperText && !hasError && (
          <p id={`${checkboxId}-helper`} className="text-sm text-gray-500 ml-7">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
