import React, { createContext, useContext, useEffect } from "react";
import { useLocation } from "wouter";

export type Language = "tr" | "en" | "ru";

export const LANGUAGES: Language[] = ["tr", "en", "ru"];
/** Languages that carry a URL prefix. Turkish is the default and lives at the un-prefixed root. */
export const PREFIXED_LANGUAGES: Language[] = ["en", "ru"];

interface LanguageContextType {
  lang: Language;
  /** Switch language by navigating to the same page under the new language prefix. */
  setLang: (lang: Language) => void;
  /**
   * Translate a string.
   * @param tr Turkish text (default / fallback)
   * @param en English text
   * @param ru Russian text. Optional — when not provided, falls back to English (then Turkish).
   */
  t: (tr: string, en: string, ru?: string) => string;
  /**
   * Build an href for the active language. Pass an app-relative path that already
   * works at the Turkish root (e.g. "/dogal-gaz#talep") and it will be prefixed
   * with the active language when needed (e.g. "/ru/dogal-gaz#talep").
   * Use this for links that live OUTSIDE the language-scoped <Router base> (rare).
   */
  withLang: (path: string, target?: Language) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/** Detect the active language from a raw pathname (e.g. "/ru/dogal-gaz" -> "ru"). */
export function detectLangFromPath(pathname: string): Language {
  const seg = pathname.split("/").filter(Boolean)[0];
  if (seg === "en" || seg === "ru") return seg;
  return "tr";
}

/** The wouter base path for a given language. Turkish has no base. */
export function baseForLang(lang: Language): string {
  return lang === "tr" ? "" : `/${lang}`;
}

/**
 * Prefix an app-relative path (relative to the TR root) with a language prefix.
 * Preserves hash and query. e.g. prefixPath("/dogal-gaz#talep", "ru") -> "/ru/dogal-gaz#talep"
 */
export function prefixPath(path: string, lang: Language): string {
  const base = baseForLang(lang);
  if (!path.startsWith("/")) path = `/${path}`;
  // Avoid double slash for root
  if (path === "/") return base === "" ? "/" : base;
  return `${base}${path}`;
}

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  // The full browser pathname is the source of truth for language.
  const [location] = useLocation(); // NOTE: this provider is mounted OUTSIDE <Router base>, so location is the full path.
  const lang = detectLangFromPath(location);

  // Persist last chosen language (used only as a hint, URL always wins).
  useEffect(() => {
    try {
      localStorage.setItem("lang", lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const setLang = (newLang: Language) => {
    // Strip any existing language prefix from the current full path, then re-prefix.
    const current = window.location.pathname;
    const segments = current.split("/").filter(Boolean);
    if (segments[0] === "en" || segments[0] === "ru") {
      segments.shift();
    }
    const bare = "/" + segments.join("/");
    const normalizedBare = bare === "/" ? "/" : bare.replace(/\/$/, "");
    const target = prefixPath(normalizedBare, newLang);
    // Preserve hash so in-page anchors keep working across language switches.
    const hash = window.location.hash || "";
    window.location.assign(`${target}${hash}`);
  };

  const t = (tr: string, en: string, ru?: string) => {
    if (lang === "en") return en;
    if (lang === "ru") return ru ?? en ?? tr;
    return tr;
  };

  const withLang = (path: string, target: Language = lang) => prefixPath(path, target);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, withLang }}>
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
