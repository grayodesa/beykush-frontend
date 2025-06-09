'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';
import { Badge } from '@/components/ui/Badge';

export interface MenuItem {
  label: string;
  href?: string;
  children?: MenuItem[];
  badge?: string;
  featured?: boolean;
}

export interface HeaderProps {
  logo?: React.ReactNode;
  menuItems: MenuItem[];
  cartItemCount?: number;
  onCartClick?: () => void;
  onSearchClick?: () => void;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  logo,
  menuItems,
  cartItemCount = 0,
  onCartClick,
  onSearchClick,
  className,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveMenu(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const isActiveLink = (href: string) => pathname === href;

  return (
    <header className={cn('sticky top-0 z-40 bg-white shadow-header', className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            {logo || (
              <Link href="/" className="font-serif text-2xl font-bold text-burgundy-700">
                Beykush
              </Link>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav ref={menuRef} className="hidden lg:flex lg:items-center lg:space-x-8">
            {menuItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    className={cn(
                      'inline-flex items-center px-1 py-2 text-sm font-medium transition-colors',
                      isActiveLink(item.href)
                        ? 'text-purple-600'
                        : 'text-gray-700 hover:text-purple-600'
                    )}
                  >
                    {item.label}
                    {item.badge && (
                      <Badge variant="wine-red" size="sm" className="ml-2">
                        {item.badge}
                      </Badge>
                    )}
                    {item.children && (
                      <svg
                        className="ml-1 h-4 w-4"
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
                    )}
                  </Link>
                ) : (
                  <button
                    className={cn(
                      'inline-flex items-center px-1 py-2 text-sm font-medium transition-colors',
                      'text-gray-700 hover:text-purple-600'
                    )}
                  >
                    {item.label}
                    {item.children && (
                      <svg
                        className="ml-1 h-4 w-4"
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
                    )}
                  </button>
                )}

                {/* Mega Menu Dropdown */}
                {item.children && activeMenu === item.label && (
                  <div className="absolute left-0 mt-2 w-screen max-w-md lg:max-w-3xl">
                    <div className="shadow-xl rounded-lg overflow-hidden">
                      <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8 lg:grid-cols-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href || '#'}
                            className={cn(
                              'group -m-3 p-3 flex items-start rounded-lg hover:bg-gray-50 transition-colors',
                              child.featured && 'lg:col-span-2 bg-purple-50 hover:bg-purple-100'
                            )}
                          >
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                <svg
                                  className="h-6 w-6 text-purple-600"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                  />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-4">
                              <p className="text-base font-medium text-gray-900 group-hover:text-purple-600">
                                {child.label}
                              </p>
                              {child.badge && (
                                <Badge variant="wine-red" size="sm" className="mt-1">
                                  {child.badge}
                                </Badge>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              onClick={onSearchClick}
              className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
              aria-label={t.common.search}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="p-2 text-gray-600 hover:text-purple-600 transition-colors relative"
              aria-label={t.navigation.cart}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-purple-600 transition-colors"
              aria-label={mobileMenuOpen ? t.common.close : 'Menu'}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            {menuItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href || '#'}
                  className={cn(
                    'block px-3 py-2 text-base font-medium rounded-md',
                    item.href && isActiveLink(item.href)
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                  {item.badge && (
                    <Badge variant="wine-red" size="sm" className="ml-2">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
                {item.children && (
                  <div className="pl-6 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href || '#'}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-purple-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};