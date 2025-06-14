'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  sections: FooterSection[];
  newsletterTitle?: string;
  newsletterDescription?: string;
  copyrightText?: string;
  socialLinks?: {
    platform: 'facebook' | 'instagram' | 'twitter' | 'youtube';
    href: string;
  }[];
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  sections,
  newsletterTitle,
  newsletterDescription,
  copyrightText,
  socialLinks,
  className,
}) => {
  const { t } = useTranslation();

  const copyright = copyrightText || `© ${new Date().getFullYear()}, Вина Бейкуш`;

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        );
      case 'instagram':
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
          </svg>
        );
      case 'twitter':
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        );
      case 'youtube':
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <footer className={cn('bg-footer-bg text-dark-gray', className)}>
      <div className="container mx-auto px-4 py-12 lg:py-16">

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Left Column - For Users */}
          <div>
            <h4 className="text-dark-gray font-semibold mb-4 uppercase">ДЛЯ КОРИСТУВАЧА</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/payment-delivery" className="text-medium-gray hover:text-rose-600 transition-colors duration-200">
                  Оплата та доставка
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-medium-gray hover:text-rose-600 transition-colors duration-200">
                  Політика конфіденційності
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-medium-gray hover:text-rose-600 transition-colors duration-200">
                  Угода користувача
                </Link>
              </li>
            </ul>
          </div>

          {/* Center Column - Logo and Contact */}
          <div className="text-center">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/beykush-logo-white.png"
                alt="Beykush"
                width={100}
                height={100}
                className="h-[100px] w-auto mx-auto filter invert"
              />
            </Link>
            <div className="space-y-2 text-sm">
              <p>вул.Приморська 73/2, с.Черноморка,</p>
              <p>Очаківський р-н, Миколаївська обл., Україна</p>
              <p>
                <a href="mailto:info@beykushwinery.com" className="hover:text-rose-600 transition-colors">
                  info@beykushwinery.com
                </a>
              </p>
              <p>
                <a href="tel:+380500695777" className="hover:text-rose-600 transition-colors">
                  +38 (050) 069-57-77
                </a>
              </p>
            </div>
          </div>

          {/* Right Column - About Us */}
          <div>
            <h4 className="text-dark-gray font-semibold mb-4 uppercase">ПРО НАС</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-medium-gray hover:text-rose-600 transition-colors duration-200">
                  Контакти
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-medium-gray hover:text-rose-600 transition-colors duration-200">
                  Про нас
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-medium-gray hover:text-rose-600 transition-colors duration-200">
                  Блог
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm">{copyright}</p>

          {/* Payment Icons */}
          <div className="flex items-center gap-4">
            <Image
              src="/visa-logo.png"
              alt="Visa"
              width={50}
              height={30}
              className="h-6 w-auto"
            />
            <Image
              src="/mastercard-logo.png"
              alt="Mastercard"
              width={40}
              height={30}
              className="h-6 w-auto"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
