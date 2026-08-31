import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout.jsx";
import { fetchCategories, fetchFoodById, createFood, updateFood } from "../services/api.js";

const emptyForm = {
  hindiName: "",
  englishName: "",
  description: "",
  category: "",
  isVeg: true,
  isAvailable: true,
};

const AdminFoodForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const catsRes = await fetchCategories();
        setCategories(catsRes.data.data);

        if (isEdit) {
          const foodRes = await fetchFoodById(id);
          const food = foodRes.data.data;
          setForm({
            hindiName: food.hindiName,
            englishName: food.englishName,
            description: food.description,
            category: food.category?._id || "",
            isVeg: food.isVeg,
            isAvailable: food.isAvailable,
          });
          setImagePreview(food.imageUrl);
        } else if (catsRes.data.data.length > 0) {
          setForm((prev) => ({ ...prev, category: catsRes.data.data[0]._id }));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!form.hindiName || !form.englishName || !form.description || !form.category) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!isEdit && !imageFile) {
      setError("Please upload a food image.");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (imageFile) formData.append("image", imageFile);
    if (videoFile) formData.append("video", videoFile);

    setSaving(true);
    try {
      if (isEdit) {
        await updateFood(id, formData);
      } else {
        await createFood(formData);
      }
      setSuccess(true);
      setTimeout(() => navigate("/admin/foods"), 900);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title={isEdit ? "Edit Food Item" : "Add Food Item"}>
        <p className="text-sm text-charcoal/60">Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEdit ? "Edit Food Item" : "Add Food Item"}>
      <form onSubmit={handleSubmit} className="card-surface max-w-3xl space-y-5 p-6 sm:p-8">
        {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
        {success && (
          <div className="rounded-lg bg-forest/10 p-3 text-sm text-forest">
            Saved successfully! Redirecting...
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-charcoal">Hindi Name *</label>
            <input
              type="text"
              value={form.hindiName}
              onChange={handleChange("hindiName")}
              placeholder="पूरी सब्जी"
              className="w-full rounded-xl border border-gold/30 bg-white px-4 py-2.5 text-sm outline-none focus:border-maroon"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-charcoal">English Name *</label>
            <input
              type="text"
              value={form.englishName}
              onChange={handleChange("englishName")}
              placeholder="Puri Sabji"
              className="w-full rounded-xl border border-gold/30 bg-white px-4 py-2.5 text-sm outline-none focus:border-maroon"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-charcoal">Description *</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={handleChange("description")}
            className="w-full resize-none rounded-xl border border-gold/30 bg-white px-4 py-2.5 text-sm outline-none focus:border-maroon"
            required
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-charcoal">Category *</label>
            <select
              value={form.category}
              onChange={handleChange("category")}
              className="w-full rounded-xl border border-gold/30 bg-white px-4 py-2.5 text-sm outline-none focus:border-maroon"
              required
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.nameEnglish} / {c.nameHindi}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-6 pb-1">
            <label className="flex items-center gap-2 text-sm font-medium text-charcoal">
              <input type="checkbox" checked={form.isVeg} onChange={handleChange("isVeg")} className="h-4 w-4" />
              Vegetarian
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-charcoal">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={handleChange("isAvailable")}
                className="h-4 w-4"
              />
              Available on site
            </label>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-charcoal">
              Food Image {isEdit ? "" : "*"}
            </label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageChange}
              className="w-full rounded-xl border border-gold/30 bg-white px-4 py-2.5 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-maroon file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-ivory"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-3 h-32 w-32 rounded-lg object-cover" />
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-charcoal">Food Video (optional)</label>
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              className="w-full rounded-xl border border-gold/30 bg-white px-4 py-2.5 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-gold file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-maroon-dark"
            />
            {videoFile && <p className="mt-2 text-xs text-charcoal/60">{videoFile.name}</p>}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? "Saving..." : isEdit ? "Update Food Item" : "Add Food Item"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/foods")}
            className="rounded-full border border-gold/30 px-6 py-3.5 text-sm font-semibold text-charcoal"
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminFoodForm;
