import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout.jsx";
import { fetchFoods, fetchCategories, fetchSettings } from "../services/api.js";

const StatCard = ({ label, value, icon, color }) => (
  <div className="card-surface flex items-center gap-4 p-5">
    <span
      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-xl"
      style={{ backgroundColor: `${color}22`, color }}
    >
      {icon}
    </span>
    <div>
      <div className="text-2xl font-bold text-charcoal">{value}</div>
      <div className="text-xs font-medium text-charcoal/55">{label}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ foods: 0, categories: 0, available: 0, whatsapp: "" });
  const [recentFoods, setRecentFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [foodsRes, catsRes, settingsRes] = await Promise.all([
          fetchFoods(),
          fetchCategories(),
          fetchSettings(),
        ]);
        const foods = foodsRes.data.data;
        setStats({
          foods: foods.length,
          categories: catsRes.data.data.length,
          available: foods.filter((f) => f.isAvailable).length,
          whatsapp: settingsRes.data.data.whatsappNumber,
        });
        setRecentFoods(foods.slice(0, 5));
      } catch (err) {
        // AdminLayout consumers already handle auth errors via the api interceptor
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Food Items" value={loading ? "-" : stats.foods} icon="🍛" color="#7A1F2B" />
        <StatCard label="Total Categories" value={loading ? "-" : stats.categories} icon="🏷️" color="#C89B3C" />
        <StatCard label="Available Items" value={loading ? "-" : stats.available} icon="✅" color="#2F4B3C" />
        <StatCard
          label="WhatsApp Number"
          value={loading ? "-" : `+${stats.whatsapp || "—"}`}
          icon="💬"
          color="#25D366"
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/admin/foods/new" className="btn-primary">
          + Add New Food Item
        </Link>
        <Link to="/" className="btn-primary">
          Home
        </Link>
        <Link to="/admin/categories" className="btn-secondary">
          Manage Categories
        </Link>
        <Link to="/admin/settings" className="btn-secondary">
          Website Settings
        </Link>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-charcoal">Recently Added Food</h2>
        <div className="card-surface overflow-hidden">
          {recentFoods.length === 0 && !loading ? (
            <p className="p-6 text-sm text-charcoal/60">No food items yet. Add your first dish.</p>
          ) : (
            <ul className="divide-y divide-gold/10">
              {recentFoods.map((food) => (
                <li key={food._id} className="flex items-center gap-4 p-4">
                  <img src={food.imageUrl} alt={food.englishName} className="h-12 w-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-charcoal">
                      {food.hindiName} <span className="text-charcoal/50">/ {food.englishName}</span>
                    </p>
                    <p className="text-xs text-charcoal/50">{food.category?.nameEnglish}</p>
                  </div>
                  <Link
                    to={`/admin/foods/${food._id}/edit`}
                    className="text-sm font-semibold text-maroon hover:underline"
                  >
                    Edit
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
