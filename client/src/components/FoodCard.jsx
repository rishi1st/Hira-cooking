import React, { useState, memo } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useSelection } from "../context/SelectionContext.jsx";
import { optimizeImageUrl } from "../utils/optimizeImage.js";
import VideoModal from "./VideoModal.jsx";

// Wrapped in React.memo: with 1000+ cards on screen, a state change in one
// card (or in the parent's search/category state) should never force every
// other card to re-render and re-diff its image and buttons.
const FoodCard = memo(({ food }) => {
  const { t, language } = useLanguage();
  const { isSelected, toggleFood } = useSelection();
  const [showVideo, setShowVideo] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const selected = isSelected(food._id);
  const primaryName = language === "hi" ? food.hindiName : food.englishName;
  const secondaryName = language === "hi" ? food.englishName : food.hindiName;

  // A card in a 3-column grid is roughly 350-420px wide on desktop and up
  // to ~420px on mobile; 480px covers retina without shipping a full photo.
  const cardImageUrl = optimizeImageUrl(food.imageUrl, { width: 480, quality: 65 });

  return (
    <>
      <div
        className={`card-surface group relative flex flex-col overflow-hidden transition-transform duration-300 animate-fadeUp hover:-translate-y-1 hover:shadow-card-hover ${
          selected ? "ring-2 ring-gold" : ""
        }`}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-blush">
          {!imgLoaded && <div className="skeleton absolute inset-0" />}
          <img
            src={cardImageUrl}
            alt={primaryName}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            onLoad={() => setImgLoaded(true)}
            className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />

          {food.isVeg && (
            <span className="absolute left-3 top-3 flex h-5 w-5 items-center justify-center rounded-sm border-2 border-forest bg-white">
              <span className="h-2 w-2 rounded-full bg-forest" />
            </span>
          )}

          {food.videoUrl && (
            <button
              type="button"
              onClick={() => setShowVideo(true)}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-black/75"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M3 2l7 4-7 4V2z" />
              </svg>
              {t("menu_watch_video")}
            </button>
          )}

          {selected && (
            <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-gold text-maroon-dark shadow">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-display text-xl font-semibold leading-tight text-maroon">{primaryName}</h3>
          <p className="mt-0.5 text-xs font-medium text-charcoal/50">{secondaryName}</p>
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-charcoal/70">
            {food.description}
          </p>

          <button
            type="button"
            onClick={() => toggleFood(food)}
            aria-pressed={selected}
            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-all duration-200 ${
              selected
                ? "bg-forest text-ivory hover:bg-forest-light"
                : "border-2 border-maroon text-maroon hover:bg-maroon hover:text-ivory"
            }`}
          >
            {selected ? (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7l4 4 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t("menu_selected")}
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                {t("menu_select")}
              </>
            )}
          </button>
        </div>
      </div>

      {showVideo && (
        <VideoModal videoUrl={food.videoUrl} title={primaryName} onClose={() => setShowVideo(false)} />
      )}
    </>
  );
});

FoodCard.displayName = "FoodCard";

export default FoodCard;