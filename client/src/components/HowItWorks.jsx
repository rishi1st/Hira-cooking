import React from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      title: t("how_step1_title"),
      desc: t("how_step1_desc"),
      icon: (
        <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      ),
    },
    {
      title: t("how_step2_title"),
      desc: t("how_step2_desc"),
      icon: (
        <path
          d="M12 4a4 4 0 100 8 4 4 0 000-8zM4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
    },
    {
      title: t("how_step3_title"),
      desc: t("how_step3_desc"),
      icon: (
        <path
          d="M21 11.5a8.5 8.5 0 01-12.4 7.55L4 20l1.02-4.46A8.5 8.5 0 1121 11.5z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
    },
  ];

  return (
    <section id="how-it-works" className="bg-blush/40 py-16 lg:py-24">
      <div className="container-shell">
        <div className="mx-auto max-w-xl text-center">
          <span className="section-eyebrow justify-center">{t("how_eyebrow")}</span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-maroon sm:text-4xl">
            {t("how_title")}
          </h2>
        </div>

        <div className="relative mt-14 grid gap-8 sm:grid-cols-3">
          <div className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent sm:block" />
          {steps.map((step, idx) => (
            <div key={step.title} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-blush/40 bg-maroon text-ivory shadow-card">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  {step.icon}
                </svg>
              </div>
              <span className="mt-4 font-display text-2xl font-bold text-gold-dark">0{idx + 1}</span>
              <h3 className="mt-1 text-lg font-semibold text-charcoal">{step.title}</h3>
              <p className="mt-1.5 max-w-[220px] text-sm leading-relaxed text-charcoal/65">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
