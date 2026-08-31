import React from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

const LanguageSwitcher = ({ compact = false }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center rounded-full border border-gold/40 bg-white/70 p-1 backdrop-blur ${
        compact ? "text-xs" : "text-sm"
      }`}
      role="group"
      aria-label="Language switcher"
    >
      <button
        type="button"
        onClick={() => setLanguage("hi")}
        aria-pressed={language === "hi"}
        className={`rounded-full px-3 py-1.5 font-semibold transition-colors ${
          language === "hi" ? "bg-maroon text-ivory" : "text-maroon/70 hover:text-maroon"
        }`}
      >
        हिं
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={`rounded-full px-3 py-1.5 font-semibold transition-colors ${
          language === "en" ? "bg-maroon text-ivory" : "text-maroon/70 hover:text-maroon"
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
