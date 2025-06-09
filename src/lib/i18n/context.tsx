'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Language, TranslationKeys } from './types';
import { defaultLanguage, languages } from './config';
import { translations } from './translations';

interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslationKeys;
  formatCurrency: (amount: number) => string;
  formatNumber: (number: number) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  const setLanguage = useCallback((newLanguage: Language) => {
    if (languages.includes(newLanguage)) {
      setLanguageState(newLanguage);
      // You can add localStorage persistence here when needed
      // localStorage.setItem('language', newLanguage);
    }
  }, []);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat(language === 'uk' ? 'uk-UA' : 'en-US', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, [language]);

  const formatNumber = useCallback((number: number) => {
    return new Intl.NumberFormat(language === 'uk' ? 'uk-UA' : 'en-US').format(number);
  }, [language]);

  const value: I18nContextType = {
    language,
    setLanguage,
    t: translations[language],
    formatCurrency,
    formatNumber,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}