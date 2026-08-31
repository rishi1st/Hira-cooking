import React, { useEffect, useState } from "react";
import AdminLayout from "../components/admin/AdminLayout.jsx";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/api.js";

const emptyForm = { nameHindi: "", nameEnglish: "" };

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchCategories();
      setCategories(res.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nameHindi || !form.nameEnglish) {
      setError("Both Hindi and English names are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        await updateCategory(editingId, form);
      } else {
        await createCategory(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setForm({ nameHindi: cat.nameHindi, nameEnglish: cat.nameEnglish });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.nameEnglish}"?`)) return;
    setError(null);
    try {
      await deleteCategory(cat._id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout title="Manage Categories">
      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="card-surface mb-6 flex flex-col gap-3 p-5 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-semibold text-charcoal">Hindi Name</label>
          <input
            type="text"
            value={form.nameHindi}
            onChange={(e) => setForm((p) => ({ ...p, nameHindi: e.target.value }))}
            placeholder="स्टार्टर"
            className="w-full rounded-xl border border-gold/30 bg-white px-4 py-2.5 text-sm outline-none focus:border-maroon"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-semibold text-charcoal">English Name</label>
          <input
            type="text"
            value={form.nameEnglish}
            onChange={(e) => setForm((p) => ({ ...p, nameEnglish: e.target.value }))}
            placeholder="Starter"
            className="w-full rounded-xl border border-gold/30 bg-white px-4 py-2.5 text-sm outline-none focus:border-maroon"
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="btn-primary whitespace-nowrap disabled:opacity-60">
            {saving ? "Saving..." : editingId ? "Update" : "+ Add"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-full border border-gold/30 px-5 py-3.5 text-sm font-semibold text-charcoal"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="card-surface overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-charcoal/60">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="p-6 text-sm text-charcoal/60">No categories yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gold/15 bg-blush/40 text-xs uppercase text-charcoal/60">
              <tr>
                <th className="px-4 py-3">Hindi Name</th>
                <th className="px-4 py-3">English Name</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td className="px-4 py-3 font-medium text-charcoal">{cat.nameHindi}</td>
                  <td className="px-4 py-3 text-charcoal/70">{cat.nameEnglish}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => startEdit(cat)}
                        className="font-semibold text-maroon hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
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
    </AdminLayout>
  );
};

export default AdminCategories;
