import React from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

const Footer = ({ settings }) => {
  const { t, language } = useLanguage();
  const year = new Date().getFullYear();

  const businessName =
    language === "hi" ? settings?.businessNameHindi : settings?.businessName;

  return (
    <footer className="relative overflow-hidden bg-maroon-dark text-ivory">
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
      <div className="container-shell relative py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-lg font-display font-bold text-maroon-dark">
                श
              </span>
              <span className="font-display text-xl font-semibold">
                {businessName || "Shubh Bhoj Catering"}
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-ivory/70">{t("footer_tagline")}</p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-light">
              {t("footer_quick_links")}
            </h4>
            <ul className="space-y-2.5 text-sm text-ivory/75">
              <li><a href="#home" className="hover:text-gold-light">{t("nav_home")}</a></li>
              <li><a href="#menu" className="hover:text-gold-light">{t("nav_menu")}</a></li>
              <li><a href="#how-it-works" className="hover:text-gold-light">{t("nav_how")}</a></li>
              <li><a href="#enquiry" className="hover:text-gold-light">{t("nav_contact")}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-light">
              {t("footer_contact")}
            </h4>
            <ul className="space-y-2.5 text-sm text-ivory/75">
              {settings?.contactPhone && <li>{settings.contactPhone}</li>}
              {settings?.contactAddress && <li>{settings.contactAddress}</li>}
              {settings?.whatsappNumber && <li>+{settings.whatsappNumber}</li>}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-light">
              {language === "hi" ? "एडमिन" : "Admin"}
            </h4>
            <a
              href="/admin/login"
              className="inline-block rounded-full border border-ivory/25 px-4 py-2 text-sm text-ivory/75 transition hover:border-gold hover:text-gold-light"
            >
              {language === "hi" ? "एडमिन लॉगिन" : "Admin Login"}
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-ivory/10 pt-6 text-center text-xs text-ivory/50">
          © {year} {businessName || "Shubh Bhoj Catering"}. {t("footer_rights")}.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
