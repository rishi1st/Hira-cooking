import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout.jsx";
import { fetchFoods, fetchCategories, deleteFood as deleteFoodApi } from "../services/api.js";

const AdminFoods = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadFoods = async () => {
    setLoading(true);
    try {
      const [foodsRes, catsRes] = await Promise.all([fetchFoods(), fetchCategories()]);
      setFoods(foodsRes.data.data);
      setCategories(catsRes.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoods();
  }, []);

  const filtered = useMemo(() => {
    return foods.filter((f) => {
      const matchesCategory = categoryFilter === "all" || f.category?._id === categoryFilter;
      const matchesSearch =
        !search ||
        f.hindiName.includes(search) ||
        f.englishName.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [foods, search, categoryFilter]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteFoodApi(deleteTarget._id);
      setFoods((prev) => prev.filter((f) => f._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout title="Food Management">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <input
            type="search"
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gold/30 bg-white px-4 py-2.5 text-sm outline-none focus:border-maroon sm:max-w-xs"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-xl border border-gold/30 bg-white px-4 py-2.5 text-sm outline-none focus:border-maroon sm:max-w-xs"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.nameEnglish}
              </option>
            ))}
          </select>
        </div>
        <Link to="/admin/foods/new" className="btn-primary whitespace-nowrap">
          + Add Food
        </Link>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div className="card-surface overflow-x-auto">
        {loading ? (
          <p className="p-6 text-sm text-charcoal/60">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-charcoal/60">No food items match your filters.</p>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-gold/15 bg-blush/40 text-xs uppercase text-charcoal/60">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filtered.map((food) => (
                <tr key={food._id}>
                  <td className="px-4 py-3">
                    <img src={food.imageUrl} alt={food.englishName} className="h-12 w-12 rounded-lg object-cover" />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-charcoal">{food.hindiName}</p>
                    <p className="text-xs text-charcoal/50">{food.englishName}</p>
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">{food.category?.nameEnglish}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        food.isAvailable ? "bg-forest/10 text-forest" : "bg-red-100 text-red-600"
                      }`}
                    >
                      {food.isAvailable ? "Available" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link to={`/admin/foods/${food._id}/edit`} className="font-semibold text-maroon hover:underline">
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(food)}
                        className="font-semibold text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-charcoal">Delete food item?</h3>
            <p className="mt-2 text-sm text-charcoal/65">
              This will permanently delete "{deleteTarget.englishName}". This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-full border border-gold/30 px-4 py-2 text-sm font-semibold text-charcoal"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminFoods;
