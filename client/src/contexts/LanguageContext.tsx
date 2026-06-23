import React, { createContext, useContext, useState } from "react";

export type Language = "tr" | "en" | "ru";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  /**
   * Translate a string.
   * @param tr Turkish text (default / fallback)
   * @param en English text
   * @param ru Russian text. Optional — when not provided, falls back to English (then Turkish).
   */
  t: (tr: string, en: string, ru?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem("lang");
    if (stored === "tr" || stored === "en" || stored === "ru") {
      return stored;
    }
    return "tr";
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
  };

  const t = (tr: string, en: string, ru?: string) => {
    if (lang === "en") return en;
    if (lang === "ru") return ru ?? en ?? tr;
    return tr;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
