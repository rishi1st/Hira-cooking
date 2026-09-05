import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useSelection } from "../context/SelectionContext.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";

const SECTION_IDS = ["home", "menu", "how-it-works", "enquiry"];

const Navbar = () => {
  const { t } = useLanguage();
  const { selectedCount } = useSelection();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const headerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // BUG FIX: the old effect only closed the mobile menu on a route change.
  // Every nav link on this page is a same-page hash anchor (#menu, #home...),
  // so the route never actually changes and the menu used to stay open,
  // covering the content, after a tap. Close it here instead, from the
  // click handler that does the scrolling.
  useEffect(() => setMenuOpen(false), [location.pathname]);

  // Publish the navbar's real rendered height as a CSS variable so any
  // sticky element further down the page (e.g. the menu's category bar)
  // can position itself against the actual height instead of a guessed
  // pixel value that drifts if the logo, language switcher, or font size
  // ever changes.
  useLayoutEffect(() => {
    const node = headerRef.current;
    if (!node) return;
    const setVar = () =>
      document.documentElement.style.setProperty("--navbar-height", `${node.offsetHeight}px`);
    setVar();
    const observer = new ResizeObserver(setVar);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const isHome = location.pathname === "/";

  const links = [
    { href: "#home", label: t("nav_home") },
    { href: "#menu", label: t("nav_menu") },
    { href: "#how-it-works", label: t("nav_how") },
    { href: "#enquiry", label: t("nav_contact") },
  ];

  // Smooth-scrolls to a section while compensating for the sticky navbar's
  // height, so the section title never lands hidden underneath it. Also
  // closes the mobile menu, which a plain anchor click never used to do.
  const handleNavClick = useCallback((e, href) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    setMenuOpen(false);
    if (!el) return;
    e.preventDefault();
    const navHeight = headerRef.current?.offsetHeight ?? 72;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 8;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  // Escape closes the mobile menu, matching the pattern already used for
  // the video modal elsewhere in the app.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Lightly highlight the section currently in view, the same way the
  // active category is highlighted in the menu, so the navbar always
  // reflects where the visitor actually is on the page.
  useEffect(() => {
    if (!isHome) return;
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome]);

  const linkClass = (href) =>
    `text-[15px] font-medium transition-colors ${
      activeSection === href.replace("#", "")
        ? "text-maroon font-semibold"
        : "text-charcoal/80 hover:text-maroon"
    }`;

  const mobileLinkClass = (href) =>
    `rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors ${
      activeSection === href.replace("#", "") ? "bg-blush text-maroon font-semibold" : "text-charcoal hover:bg-blush"
    }`;

  return (
    <header
      ref={headerRef}
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
                onClick={(e) => handleNavClick(e, link.href)}
                className={linkClass(link.href)}
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
              onClick={(e) => handleNavClick(e, "#menu")}
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-maroon transition-transform duration-200"
          >
            {menuOpen ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="animate-fadeUp border-t border-gold/20 bg-ivory px-5 pb-5 pt-3 md:hidden">
          <div className="mb-4">
            <LanguageSwitcher />
          </div>
          {isHome && (
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={mobileLinkClass(link.href)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#menu"
                onClick={(e) => handleNavClick(e, "#menu")}
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