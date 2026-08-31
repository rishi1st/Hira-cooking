import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { loginAdmin as loginAdminApi } from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem("adminInfo");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await loginAdminApi({ email, password });
      const adminData = data.data;
      localStorage.setItem("adminToken", adminData.token);
      localStorage.setItem("adminInfo", JSON.stringify(adminData));
      setAdmin(adminData);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    setAdmin(null);
  }, []);

  const value = useMemo(
    () => ({ admin, isAuthenticated: !!admin, loading, error, login, logout }),
    [admin, loading, error, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
