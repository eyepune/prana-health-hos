/// <reference path="../types/globals.d.ts" />
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from '../data/translations.json';

type Language = "EN" | "HI" | "TE" | "TA" | "MR" | "BN" | "ES" | "AR" | "FR";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("EN");

  // Load from localeStorage if possible
  useEffect(() => {
    const saved = localStorage.getItem("prana_lang") as Language;
    if (saved) setLangState(saved);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("prana_lang", newLang);
  };

  const t = (translations as any)[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
