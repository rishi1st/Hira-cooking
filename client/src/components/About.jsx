import React from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import PaisleyDivider from "./PaisleyDivider.jsx";

const About = () => {
  const { t } = useLanguage();

  const points = [t("about_point_1"), t("about_point_2"), t("about_point_3"), t("about_point_4")];

  return (
    <section id="about" className="py-16 lg:py-24">
      <div className="container-shell grid items-center gap-12 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-4">
          <img
            src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=600&auto=format&fit=crop"
            alt="Chef preparing traditional Indian catering dishes"
            className="h-48 w-full rounded-2xl object-cover shadow-card sm:h-64"
            loading="lazy"
          />
          <img
            src="https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=600&auto=format&fit=crop"
            alt="Elegant Indian wedding food buffet setup"
            className="mt-8 h-48 w-full rounded-2xl object-cover shadow-card sm:h-64"
            loading="lazy"
          />
        </div>

        <div>
          <span className="section-eyebrow">{t("about_eyebrow")}</span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-maroon sm:text-4xl">
            {t("about_title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-charcoal/75">{t("about_body")}</p>

          <ul className="mt-7 grid gap-3.5 sm:grid-cols-2">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-2.5 rounded-xl bg-blush/60 p-3.5">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-forest text-ivory">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-sm font-medium leading-snug text-charcoal/85">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <PaisleyDivider className="mt-16" />
    </section>
  );
};

export default About;
