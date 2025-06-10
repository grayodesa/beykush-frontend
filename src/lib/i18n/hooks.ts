import { useI18n } from './context';

export function useTranslation() {
  const { t, language, formatCurrency, formatNumber } = useI18n();

  return {
    t,
    language,
    formatCurrency,
    formatNumber,
  };
}

// Utility function to get nested translation value
export function getTranslation(
  translations: Record<string, unknown>,
  path: string,
  fallback: string = ''
): string {
  const keys = path.split('.');
  let value: unknown = translations;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return fallback;
    }
  }

  return typeof value === 'string' ? value : fallback;
}
