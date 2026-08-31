import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useSelection } from "../context/SelectionContext.jsx";

// Sticky bottom bar that keeps the selection visible while browsing, per the
// requirement that the selected list stay available throughout the menu.
const SelectedItemsBar = () => {
  const { t, language } = useLanguage();
  const { selectedFoods, selectedCount, removeFood, clearSelection } = useSelection();
  const [expanded, setExpanded] = useState(false);

  if (selectedCount === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 animate-fadeUp">
      {expanded && (
        <div className="border-t border-gold/25 bg-white shadow-[0_-8px_24px_-12px_rgba(84,20,29,0.25)]">
          <div className="container-shell max-h-64 overflow-y-auto py-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-charcoal">{t("selection_bar_title")}</span>
              <button
                type="button"
                onClick={clearSelection}
                className="text-xs font-medium text-maroon underline-offset-2 hover:underline"
              >
                {t("selection_bar_clear")}
              </button>
            </div>
            <ul className="space-y-2">
              {selectedFoods.map((food) => (
                <li
                  key={food._id}
                  className="flex items-center justify-between rounded-lg bg-blush/50 px-3 py-2 text-sm"
                >
                  <span className="font-medium text-charcoal">
                    {language === "hi" ? food.hindiName : food.englishName}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFood(food._id)}
                    className="text-xs font-semibold text-maroon hover:underline"
                    aria-label={`${t("selection_bar_remove")} ${food.englishName}`}
                  >
                    {t("selection_bar_remove")}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="border-t border-gold/25 bg-maroon text-ivory shadow-[0_-10px_30px_-12px_rgba(84,20,29,0.4)]">
        <div className="container-shell flex items-center justify-between gap-4 py-3.5">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-3"
            aria-expanded={expanded}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-sm font-bold text-maroon-dark">
              {selectedCount}
            </span>
            <span className="text-left text-sm">
              <span className="block font-semibold">{t("selection_bar_title")}</span>
              <span className="block text-xs text-ivory/70">
                {expanded ? (language === "hi" ? "छुपाएं" : "Hide") : language === "hi" ? "देखें" : "View"}
              </span>
            </span>
          </button>

          <a
            href="#enquiry"
            className="flex items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-maroon-dark shadow transition hover:bg-gold-light"
          >
            {t("selection_bar_continue")}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SelectedItemsBar;
