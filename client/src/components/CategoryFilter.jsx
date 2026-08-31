import React from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

const CategoryFilter = ({ categories, active, onChange }) => {
  const { t, language } = useLanguage();

  return (
    <div className="scrollbar-none -mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
      <button
        type="button"
        onClick={() => onChange("all")}
        className={`flex-shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
          active === "all"
            ? "bg-maroon text-ivory shadow-card"
            : "border border-gold/30 bg-white text-charcoal/70 hover:border-maroon/40"
        }`}
      >
        {t("menu_category_all")}
      </button>
      {categories.map((cat) => (
        <button
          key={cat._id}
          type="button"
          onClick={() => onChange(cat._id)}
          className={`flex-shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
            active === cat._id
              ? "bg-maroon text-ivory shadow-card"
              : "border border-gold/30 bg-white text-charcoal/70 hover:border-maroon/40"
          }`}
        >
          {language === "hi" ? cat.nameHindi : cat.nameEnglish}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
