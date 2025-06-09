import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'burgundy' | 'gold' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center font-medium rounded-lg
      transition-all duration-200 focus:outline-none focus-visible:ring-2
      focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const variants = {
      primary: `
        bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800
        focus-visible:ring-purple-600 shadow-sm hover:shadow-md
      `,
      secondary: `
        bg-white text-gray-900 border border-gray-300 hover:bg-gray-50
        active:bg-gray-100 focus-visible:ring-gray-500 shadow-sm
      `,
      burgundy: `
        bg-burgundy-600 text-white hover:bg-burgundy-700 active:bg-burgundy-800
        focus-visible:ring-burgundy-600 shadow-sm hover:shadow-md
      `,
      gold: `
        bg-gold-600 text-white hover:bg-gold-700 active:bg-gold-800
        focus-visible:ring-gold-600 shadow-sm hover:shadow-md
      `,
      ghost: `
        bg-transparent hover:bg-gray-100 active:bg-gray-200
        focus-visible:ring-gray-500
      `,
      danger: `
        bg-red-600 text-white hover:bg-red-700 active:bg-red-800
        focus-visible:ring-red-600 shadow-sm hover:shadow-md
      `,
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm gap-1.5',
      md: 'px-4 py-2.5 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          loading && 'cursor-wait',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="spinner" />
            <span className="sr-only">Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="-ml-0.5">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="-mr-0.5">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';