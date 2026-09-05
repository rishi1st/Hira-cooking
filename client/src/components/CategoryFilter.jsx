import React from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

// Sticky, higher-contrast category bar. The active category now gets a
// filled pill, a lifted shadow and a live count badge, so it reads at a
// glance instead of relying on a subtle border-color change.
const CategoryFilter = ({ categories, active, onChange, counts = {}, totalCount }) => {
  const { t, language } = useLanguage();

  const pillClass = (isActive) =>
    `flex-shrink-0 snap-start inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "scale-[1.03] bg-maroon text-ivory shadow-card-hover"
        : "border border-gold/30 bg-white text-charcoal/70 hover:border-maroon/50 hover:text-maroon"
    }`;

  const countBadgeClass = (isActive) =>
    `flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold ${
      isActive ? "bg-gold text-maroon-dark" : "bg-blush text-maroon/70"
    }`;

  return (
    <div
      className="sticky z-30 -mx-5 bg-ivory/95 px-5 py-3 backdrop-blur sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-0"
      style={{ top: "var(--navbar-height, 64px)" }}
    >
      <div className="scrollbar-none flex snap-x gap-2.5 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center">
        <button type="button" onClick={() => onChange("all")} className={pillClass(active === "all")}>
          {t("menu_category_all")}
          {typeof totalCount === "number" && (
            <span className={countBadgeClass(active === "all")}>{totalCount}</span>
          )}
        </button>
        {categories.map((cat) => {
          const isActive = active === cat._id;
          const label = language === "hi" ? cat.nameHindi : cat.nameEnglish;
          const count = counts[cat._id];
          return (
            <button key={cat._id} type="button" onClick={() => onChange(cat._id)} className={pillClass(isActive)}>
              {label}
              {typeof count === "number" && <span className={countBadgeClass(isActive)}>{count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;