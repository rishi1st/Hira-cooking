import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "M4 6h16M4 12h16M4 18h7" },
  { to: "/admin/foods", label: "Food Items", icon: "M4 6h16M4 12h16M4 18h16" },
  { to: "/admin/categories", label: "Categories", icon: "M3 4h18M3 10h18M3 16h18" },
  { to: "/admin/settings", label: "Settings", icon: "M12 4a4 4 0 100 8 4 4 0 000-8z" },
];

const AdminLayout = ({ children, title }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-blush/30">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-gold/20 bg-white px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30"
          aria-label="Open menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <span className="font-display text-lg font-semibold text-maroon">Admin Panel</span>
        <div className="w-9" />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-maroon-dark text-ivory transition-transform duration-200 lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-maroon-dark font-display font-bold">
                श्री
              </span>
              <span className="font-display text-lg font-semibold">Hira cooking Bhandar</span>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="text-ivory/70 lg:hidden"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <nav className="mt-4 flex flex-col gap-1 px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? "bg-gold text-maroon-dark" : "text-ivory/75 hover:bg-white/10"
                  }`
                }
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d={item.icon} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
            <p className="mb-2 truncate text-xs text-ivory/60">{admin?.email}</p>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-ivory/20 py-2.5 text-sm font-medium text-ivory/85 hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="min-h-screen flex-1 px-4 py-6 sm:px-8 sm:py-8">
          <h1 className="mb-6 font-display text-2xl font-semibold text-maroon sm:text-3xl">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
