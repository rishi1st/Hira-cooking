import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import translations from "../i18n/translations.js";

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem("siteLanguage") || "hi");

  useEffect(() => {
    localStorage.setItem("siteLanguage", language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "hi" ? "en" : "hi"));
  }, []);

  const t = useCallback(
    (key) => translations[language]?.[key] ?? translations.hi[key] ?? key,
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, toggleLanguage, t }),
    [language, toggleLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
