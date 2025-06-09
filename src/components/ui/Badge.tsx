import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'wine-red' | 'wine-white' | 'wine-rose' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'sm',
  dot = false,
  removable = false,
  onRemove,
  className,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    primary: 'bg-purple-100 text-purple-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    error: 'bg-red-100 text-red-800',
    'wine-red': 'bg-wine-red/10 text-wine-red',
    'wine-white': 'bg-wine-white/10 text-gray-800 border border-gray-200',
    'wine-rose': 'bg-wine-rose/10 text-burgundy-700',
    neutral: 'bg-gray-100 text-gray-800',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full mr-1.5',
            variant === 'primary' && 'bg-purple-600',
            variant === 'success' && 'bg-green-600',
            variant === 'warning' && 'bg-amber-600',
            variant === 'error' && 'bg-red-600',
            variant === 'wine-red' && 'bg-wine-red',
            variant === 'wine-white' && 'bg-gray-600',
            variant === 'wine-rose' && 'bg-burgundy-600',
            variant === 'neutral' && 'bg-gray-600'
          )}
        />
      )}
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className={cn(
            'ml-1 -mr-0.5 h-3.5 w-3.5 rounded-full inline-flex items-center justify-center',
            'hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-1',
            'transition-colors duration-200',
            variant === 'primary' && 'focus:ring-purple-600',
            variant === 'success' && 'focus:ring-green-600',
            variant === 'warning' && 'focus:ring-amber-600',
            variant === 'error' && 'focus:ring-red-600',
            variant === 'wine-red' && 'focus:ring-wine-red',
            variant === 'wine-white' && 'focus:ring-gray-600',
            variant === 'wine-rose' && 'focus:ring-burgundy-600',
            variant === 'neutral' && 'focus:ring-gray-600'
          )}
          aria-label="Remove"
        >
          <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </span>
  );
};