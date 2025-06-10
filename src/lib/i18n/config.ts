import { Language } from './types';

export const defaultLanguage: Language = 'uk';
export const languages: Language[] = ['uk']; // Add 'en' here when English support is added
export const languageNames: Record<Language, string> = {
  uk: 'Українська',
  en: 'English',
};
