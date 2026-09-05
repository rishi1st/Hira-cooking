import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useSelection } from "../context/SelectionContext.jsx";
import { fetchFoods, fetchCategories } from "../services/api.js";
import FoodCard from "./FoodCard.jsx";
import CategoryFilter from "./CategoryFilter.jsx";

// How many cards are mounted at a time. With 1000+ dishes, rendering
// everything at once is what makes the page feel slow — this keeps the DOM
// and the number of in-flight image requests small no matter how big the
// catalogue grows.
const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 250;

const FoodCardSkeleton = () => (
  <div className="card-surface overflow-hidden">
    <div className="skeleton aspect-[4/3] w-full" />
    <div className="space-y-2 p-4">
      <div className="skeleton h-5 w-2/3 rounded" />
      <div className="skeleton h-3 w-1/3 rounded" />
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton mt-3 h-9 w-full rounded-full" />
    </div>
  </div>
);

const FoodMenu = () => {
  const { t } = useLanguage();
  const { selectedCount } = useSelection();
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sentinelRef = useRef(null);
  const menuTopRef = useRef(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [foodsRes, catsRes] = await Promise.all([
          fetchFoods({ available: true }),
          fetchCategories(),
        ]);
        setFoods(foodsRes.data.data);
        setCategories(catsRes.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Debounce the search box so filtering (and the resulting re-render of
  // cards) doesn't fire on every single keystroke.
  useEffect(() => {
    const id = setTimeout(() => setSearch(searchInput), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [searchInput]);

  // Shuffle once per page load (per useMemo, tied to when `foods` first
  // arrives) so every visitor sees a different order on "All" — but the
  // order stays fixed for the rest of their session, so infinite scroll
  // doesn't repeat or skip dishes as more of them load in.
  const shuffledFoods = useMemo(() => {
    const arr = [...foods];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [foods]);

  const filteredFoods = useMemo(() => {
    const source = activeCategory === "all" ? shuffledFoods : foods;
    const matched = source.filter((food) => {
      const matchesCategory =
        activeCategory === "all" || food.category?._id === activeCategory;
      const matchesSearch =
        !search ||
        food.hindiName.includes(search) ||
        food.englishName.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Dishes with a real photo are visually far more convincing than a
    // placeholder, so surface them first. Array.prototype.sort is stable in
    // modern JS engines, so this only reorders by "has an image" and leaves
    // everything else (the shuffle, or the category's natural order) intact.
    return [...matched].sort(
      (a, b) => Number(Boolean(b.imageUrl)) - Number(Boolean(a.imageUrl))
    );
  }, [foods, shuffledFoods, activeCategory, search]);

  // Dish count per category, shown as badges in the filter bar.
  const categoryCounts = useMemo(() => {
    const counts = {};
    for (const food of foods) {
      const catId = food.category?._id;
      if (catId) counts[catId] = (counts[catId] || 0) + 1;
    }
    return counts;
  }, [foods]);

  // Reset how many cards are shown whenever the visible set changes.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, search]);

  // Jump back to the top of the menu (search + category bar) whenever a new
  // category is picked. Without this, a user who has scrolled deep into a
  // long list (e.g. past 450+ loaded dishes) would switch categories and
  // land on empty space, since the grid resets to the first page but their
  // scroll position doesn't move.
  const scrollToMenuTop = useCallback(() => {
    menuTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleCategoryChange = useCallback(
    (categoryId) => {
      setActiveCategory(categoryId);
      scrollToMenuTop();
    },
    [scrollToMenuTop]
  );

  // Show a "back to top of menu" button once the search/category bar has
  // scrolled out of view, so a user deep in the loaded list can get back to
  // the start of the category (or clear/change it) in one tap, without
  // scrolling all the way back by hand.
  useEffect(() => {
    const node = menuTopRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowBackToTop(!entry.isIntersecting),
      { rootMargin: "-120px 0px 0px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const visibleFoods = filteredFoods.slice(0, visibleCount);
  const hasMore = visibleCount < filteredFoods.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredFoods.length));
  }, [filteredFoods.length]);

  // Infinite scroll: grow the visible window as the sentinel div nears the
  // viewport, instead of the user having to click through pages.
  useEffect(() => {
    if (!hasMore) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "900px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <section id="menu" className="py-16 lg:py-24">
      <div className="container-shell">
        <div className="mx-auto max-w-xl text-center">
          <span className="section-eyebrow justify-center">{t("menu_eyebrow")}</span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-maroon sm:text-4xl">
            {t("menu_title")}
          </h2>
          <p className="mt-2 text-sm text-charcoal/60 sm:text-base">{t("menu_subtitle")}</p>
        </div>

        <div
          ref={menuTopRef}
          className="mx-auto mt-8 max-w-md"
          style={{ scrollMarginTop: "var(--navbar-height, 96px)" }}
        >
          <div className="relative">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40"
            >
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.6" />
              <path d="M16 16l-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t("menu_search_placeholder")}
              className="w-full rounded-full border border-gold/30 bg-white py-3 pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-maroon"
            />
          </div>
        </div>

        <div className="mt-6">
          <CategoryFilter
            categories={categories}
            active={activeCategory}
            onChange={handleCategoryChange}
            counts={categoryCounts}
            totalCount={foods.length}
          />
        </div>

        <div className="mt-10">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          {!error && loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <FoodCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!error && !loading && filteredFoods.length === 0 && (
            <div className="rounded-xl border border-gold/20 bg-blush/40 p-10 text-center text-sm text-charcoal/60">
              {t("menu_empty")}
            </div>
          )}

          {!error && !loading && filteredFoods.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleFoods.map((food) => (
                  <FoodCard key={food._id} food={food} />
                ))}
              </div>

              {hasMore && (
                <>
                  {/* Invisible trigger for infinite scroll */}
                  <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />
                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      onClick={loadMore}
                      className="rounded-full border border-gold/40 bg-white px-6 py-2.5 text-sm font-semibold text-maroon shadow-sm transition hover:border-maroon/50"
                    >
                      {t("menu_load_more") || "Load more"}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToMenuTop}
          className={`fixed left-5 z-40 flex items-center gap-2 rounded-full bg-maroon px-4 py-3 text-sm font-semibold text-ivory shadow-card-hover transition hover:bg-maroon-dark ${
            selectedCount > 0 ? "bottom-24" : "bottom-6"
          }`}
          aria-label={t("menu_back_to_top") || "Back to top of menu"}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 13V3M3 7l5-5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="hidden sm:inline">{t("menu_back_to_top") || "Back to top"}</span>
        </button>
      )}
    </section>
  );
};

export default FoodMenu;