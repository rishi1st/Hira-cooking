import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminFoods from "./pages/AdminFoods.jsx";
import AdminFoodForm from "./pages/AdminFoodForm.jsx";
import AdminCategories from "./pages/AdminCategories.jsx";
import AdminSettings from "./pages/AdminSettings.jsx";
import ProtectedRoute from "./components/admin/ProtectedRoute.jsx";

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-4 text-center">
    <h1 className="font-display text-5xl font-bold text-maroon">404</h1>
    <p className="mt-2 text-charcoal/60">Page not found</p>
    <a href="/" className="btn-primary mt-6">
      Back to Home
    </a>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/foods"
        element={
          <ProtectedRoute>
            <AdminFoods />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/foods/new"
        element={
          <ProtectedRoute>
            <AdminFoodForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/foods/:id/edit"
        element={
          <ProtectedRoute>
            <AdminFoodForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute>
            <AdminCategories />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <AdminSettings />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
