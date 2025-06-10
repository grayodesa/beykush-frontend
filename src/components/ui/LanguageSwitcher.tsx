'use client';

import { useI18n } from '@/lib/i18n/context';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLanguage('uk')}
        className={cn(
          'w-8 h-5 rounded-sm overflow-hidden border transition-all duration-200',
          language === 'uk' ? 'border-white shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
        )}
        aria-label="Українська"
      >
        <div className="w-full h-1/2 bg-blue-500"></div>
        <div className="w-full h-1/2 bg-yellow-400"></div>
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={cn(
          'w-8 h-5 rounded-sm overflow-hidden border transition-all duration-200',
          language === 'en' ? 'border-white shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
        )}
        aria-label="English"
      >
        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCAzMCI+CjxwYXRoIGZpbGw9IiMwMDI0N2QiIGQ9Ik0wLDB2MzBoNjBWMHoiLz4KPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTAsMHY2aDYwdjE4SDB2Nmg2MHYtNmgtNlY2aDZ2LTZ6Ii8+CjxwYXRoIGZpbGw9IiNjZjE0MmIiIGQ9Ik0wLDB2MmgyNnYxMUgwdjRoMjZ2MTNIMHY0aDI4VjE5aDMydi00SDI4VjJoMzJWMHoiLz4KPC9zdmc+')] bg-cover"></div>
      </button>
    </div>
  );
}
