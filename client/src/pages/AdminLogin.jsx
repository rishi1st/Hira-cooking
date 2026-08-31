import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AdminLogin = () => {
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(form.email, form.password);
    if (ok) navigate("/admin/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paisley-fade bg-ivory px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-maroon font-display text-2xl font-bold text-gold-light shadow-card">
            श
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold text-maroon">Admin Login</h1>
          <p className="mt-1 text-sm text-charcoal/60">Sign in to manage your catering website</p>
        </div>

        <form onSubmit={handleSubmit} className="card-surface space-y-5 p-7">
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-charcoal">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full rounded-xl border border-gold/30 bg-white px-4 py-3 text-sm outline-none focus:border-maroon"
              placeholder="admin@shubhbhoj.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-charcoal">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              className="w-full rounded-xl border border-gold/30 bg-white px-4 py-3 text-sm outline-none focus:border-maroon"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
