import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useSelection } from "../context/SelectionContext.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";

const Navbar = () => {
  const { t } = useLanguage();
  const { selectedCount } = useSelection();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const isHome = location.pathname === "/";

  const links = [
    { href: "#home", label: t("nav_home") },
    { href: "#menu", label: t("nav_menu") },
    { href: "#how-it-works", label: t("nav_how") },
    { href: "#enquiry", label: t("nav_contact") },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled ? "bg-ivory/95 shadow-[0_4px_20px_-8px_rgba(84,20,29,0.15)] backdrop-blur" : "bg-transparent"
      }`}
    >
      <nav className="container-shell flex items-center justify-between py-3.5">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-maroon text-lg font-display font-bold text-gold-light shadow-card">
            श्री
          </span>
          {/*  हीरा कुकिंग भण्डार  */}
          <span className="leading-tight">
            <span className="block font-display text-xl font-semibold text-maroon">हीरा कुकिंग भण्डार</span>
            <span className="block text-[11px] font-medium tracking-wide text-forest">कैटरिंग सर्विसेज़</span>
          </span>
        </Link>

        {isHome && (
          <div className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[15px] font-medium text-charcoal/80 transition-colors hover:text-maroon"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitcher />
          {isHome && (
            <a
              href="#menu"
              className="relative inline-flex items-center gap-2 rounded-full bg-maroon px-5 py-2.5 text-sm font-semibold text-ivory shadow-card transition hover:bg-maroon-dark"
            >
              {t("nav_cta")}
              {selectedCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-xs font-bold text-maroon-dark">
                  {selectedCount}
                </span>
              )}
            </a>
          )}
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-maroon/30 md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <span className="relative block h-3.5 w-4.5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-4.5 bg-maroon transition-transform ${
                menuOpen ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[6px] h-0.5 w-4.5 bg-maroon transition-opacity ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[12px] h-0.5 w-4.5 bg-maroon transition-transform ${
                menuOpen ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-gold/20 bg-ivory px-5 pb-5 pt-3 md:hidden">
          <div className="mb-4">
            <LanguageSwitcher />
          </div>
          {isHome && (
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-charcoal hover:bg-blush"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#menu"
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-maroon px-5 py-3 text-sm font-semibold text-ivory"
              >
                {t("nav_cta")}
                {selectedCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-xs font-bold text-maroon-dark">
                    {selectedCount}
                  </span>
                )}
              </a>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
