'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { MenuItem } from './Header';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  logo?: React.ReactNode;
  className?: string;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  menuItems,
  logo,
  className,
}) => {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  // Lock body scroll when nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !navRef.current) return;

    const nav = navRef.current;
    const focusableElements = nav.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    firstFocusable?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    nav.addEventListener('keydown', handleTab);
    return () => nav.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const isActiveLink = (href: string) => pathname === href;

  if (!isOpen) return null;

  const navContent = (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      {/* Navigation Panel */}
      <nav
        ref={navRef}
        className={cn(
          'fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl',
          'transform transition-transform duration-300 ease-in-out',
          'animate-slide-in-right',
          className
        )}
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex-shrink-0">
            {logo || (
              <Link href="/" className="font-serif text-xl font-bold text-burgundy-700">
                Beykush
              </Link>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
            aria-label="Close navigation"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto">
          <ul className="py-4">
            {menuItems.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleExpanded(item.label)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{item.label}</span>
                      <svg
                        className={cn(
                          'h-5 w-5 text-gray-400 transition-transform duration-200',
                          expandedItems.includes(item.label) && 'rotate-180'
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {expandedItems.includes(item.label) && (
                      <ul className="bg-gray-50">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              href={child.href || '#'}
                              className={cn(
                                'block px-8 py-3 text-sm transition-colors',
                                child.href && isActiveLink(child.href)
                                  ? 'text-purple-600 bg-purple-50'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                              )}
                              onClick={onClose}
                            >
                              {child.label}
                              {child.badge && (
                                <span className="ml-2 px-2 py-0.5 text-xs bg-wine-red/10 text-wine-red rounded-full">
                                  {child.badge}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href || '#'}
                    className={cn(
                      'block px-4 py-3 font-medium transition-colors',
                      item.href && isActiveLink(item.href)
                        ? 'text-purple-600 bg-purple-50'
                        : 'text-gray-900 hover:bg-gray-50'
                    )}
                    onClick={onClose}
                  >
                    {item.label}
                    {item.badge && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-wine-red/10 text-wine-red rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-4 space-y-3">
          <Link
            href="/account"
            className="block w-full px-4 py-2 text-center text-purple-600 font-medium border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
            onClick={onClose}
          >
            My Account
          </Link>
          <Link
            href="/contact"
            className="block w-full px-4 py-2 text-center text-white font-medium bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            onClick={onClose}
          >
            Contact Us
          </Link>
        </div>
      </nav>
    </div>
  );

  // Only render portal on client side
  if (typeof document === 'undefined') return null;

  return createPortal(navContent, document.body);
};