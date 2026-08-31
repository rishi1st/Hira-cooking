import React from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

const Hero = ({ settings }) => {
  const { t, language } = useLanguage();

  const tagline = language === "hi" ? settings?.taglineHindi : settings?.tagline;

  return (
    <section id="home" className="relative overflow-hidden bg-paisley-fade pb-16 pt-12 sm:pt-16 lg:pb-24 lg:pt-20">
      {/* Decorative corner motifs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-maroon/10 blur-3xl" />

      <div className="container-shell relative grid items-center gap-12 lg:grid-cols-2">
        <div className="animate-fadeUp text-center lg:text-left">
          <span className="section-eyebrow justify-center lg:justify-start">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L8.5 5.5L13 7L8.5 8.5L7 13L5.5 8.5L1 7L5.5 5.5L7 1Z" fill="#C89B3C" />
            </svg>
            {tagline || t("hero_eyebrow")}
          </span>

          <h1 className="mt-4 font-display text-[2.6rem] font-semibold leading-[1.08] text-maroon sm:text-6xl lg:text-[3.6rem]">
            {t("hero_title_1")}
            <span className="block text-forest">{t("hero_title_2")}</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-charcoal/75 sm:text-lg lg:mx-0">
            {t("hero_subtitle")}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3.5 sm:flex-row sm:justify-center lg:justify-start">
            <a href="#menu" className="btn-primary w-full sm:w-auto">
              {t("hero_cta_primary")}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            {settings?.whatsappNumber && (
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full sm:w-auto"
              >
                {t("hero_cta_secondary")}
              </a>
            )}
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-gold/25 pt-8">
            {[
              ["500+", t("hero_stat_events")],
              ["2,00,000+", t("hero_stat_guests")],
              ["15+", t("hero_stat_years")],
            ].map(([value, label]) => (
              <div key={label} className="text-center lg:text-left">
                <div className="font-display text-2xl font-bold text-maroon sm:text-3xl">{value}</div>
                <div className="mt-1 text-[11px] font-medium leading-tight text-charcoal/60 sm:text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative animate-fadeUp [animation-delay:150ms]">
          <div className="relative mx-auto max-w-md overflow-hidden rounded-[2rem] border-4 border-white shadow-card-hover">
            <img
              src="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=900&auto=format&fit=crop"
              alt="Indian wedding catering spread with traditional thali"
              className="h-[420px] w-full object-cover sm:h-[480px]"
              loading="eager"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-maroon-dark/80 to-transparent p-5">
              <p className="font-display text-lg font-semibold text-ivory">
                {language === "hi" ? "पारंपरिक स्वाद, प्रीमियम प्रस्तुति" : "Traditional Flavours, Premium Presentation"}
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-4 shadow-card sm:block">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest/10 text-forest">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <div className="text-sm font-semibold text-charcoal">{t("menu_veg")}</div>
                <div className="text-xs text-charcoal/55">
                  {language === "hi" ? "100% स्वच्छ रसोई" : "100% hygienic kitchen"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
