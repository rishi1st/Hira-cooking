import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { fetchFoods, fetchCategories } from "../services/api.js";
import FoodCard from "./FoodCard.jsx";
import CategoryFilter from "./CategoryFilter.jsx";

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
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesCategory =
        activeCategory === "all" || food.category?._id === activeCategory;
      const matchesSearch =
        !search ||
        food.hindiName.includes(search) ||
        food.englishName.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [foods, activeCategory, search]);

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

        <div className="mx-auto mt-8 max-w-md">
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("menu_search_placeholder")}
              className="w-full rounded-full border border-gold/30 bg-white py-3 pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-maroon"
            />
          </div>
        </div>

        <div className="mt-6">
          <CategoryFilter categories={categories} active={activeCategory} onChange={setActiveCategory} />
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFoods.map((food) => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FoodMenu;
