import React from "react";

// The signature decorative motif for the site: a slim, repeated paisley/leaf
// line used to separate major sections without feeling like a generic <hr>.
const PaisleyDivider = ({ className = "" }) => (
  <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
    <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60" />
    <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
      <path
        d="M14 2C9 2 5 6 5 11c0 4 3 7 7 7 2 0 3-1 3-3 0-1.5-1-2-2-2-1 0-1.5.6-1.5 1.3 0 .4.3.7.7.7"
        stroke="#C89B3C"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="21" cy="10" r="1.6" fill="#7A1F2B" />
    </svg>
    <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60" />
  </div>
);

export default PaisleyDivider;
