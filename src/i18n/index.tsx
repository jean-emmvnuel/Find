import { createContext, use, useState, type ReactNode } from 'react';

import { en } from './locales/en';
import { fr, type TranslationKey } from './locales/fr';

export type Locale = 'fr' | 'en';
export type { TranslationKey };

const dictionaries: Record<Locale, Record<TranslationKey, string>> = { fr, en };

type I18n = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('fr');

  const t: I18n['t'] = (key, params) => {
    let text = dictionaries[locale][key];
    for (const [name, value] of Object.entries(params ?? {})) {
      text = text.replace(`{${name}}`, String(value));
    }
    return text;
  };

  return <I18nContext value={{ locale, setLocale, t }}>{children}</I18nContext>;
}

export function useI18n(): I18n {
  const context = use(I18nContext);
  if (!context) throw new Error('useI18n doit être utilisé dans <I18nProvider>');
  return context;
}
