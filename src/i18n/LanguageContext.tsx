"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, LocalizedString } from '@/types';
import { translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  l: (localized?: LocalizedString | null, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('learninghub_language');
      if (saved === 'en' || saved === 'hinglish' || saved === 'hi') {
        return saved;
      }
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('learninghub_language', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language === 'hi' ? 'hi' : 'en';
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const dict = translations[language];
    if (dict && dict[key]) {
      return dict[key];
    }
    // Fallback to English
    if (translations.en[key]) {
      return translations.en[key];
    }
    return fallback || key;
  };

  const l = (localized?: LocalizedString | null, fallback = ''): string => {
    if (!localized) return fallback;
    if (language === 'hi' && localized.hi) return localized.hi;
    if (language === 'hinglish' && localized.hinglish) return localized.hinglish;
    if (localized.en) return localized.en;
    return localized.hi || localized.hinglish || fallback;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, l }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
