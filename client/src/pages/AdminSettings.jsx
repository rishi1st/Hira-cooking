import React, { useEffect, useState } from "react";
import AdminLayout from "../components/admin/AdminLayout.jsx";
import { fetchSettings, updateSettings } from "../services/api.js";

const AdminSettings = () => {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings()
      .then(({ data }) => setForm(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!/^\d{10,15}$/.test(form.whatsappNumber.replace(/\D/g, ""))) {
      setError("Please enter a valid WhatsApp number with country code (digits only), e.g. 919000000000");
      return;
    }

    setSaving(true);
    try {
      const { data } = await updateSettings(form);
      setForm(data.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <AdminLayout title="Website Settings">
        <p className="text-sm text-charcoal/60">Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Website Settings">
      <form onSubmit={handleSubmit} className="card-surface max-w-2xl space-y-5 p-6 sm:p-8">
        {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
        {success && (
          <div className="rounded-lg bg-forest/10 p-3 text-sm text-forest">Settings saved successfully.</div>
        )}

        <div className="rounded-2xl border-2 border-gold bg-gold-light/20 p-5">
          <label className="mb-1.5 block text-sm font-bold uppercase tracking-wide text-maroon-dark">
            Business WhatsApp Number *
          </label>
          <p className="mb-2 text-xs text-charcoal/60">
            Include country code, digits only (e.g. 91 for India). Example: 919876543210
          </p>
          <input
            type="text"
            value={form.whatsappNumber}
            onChange={handleChange("whatsappNumber")}
            className="w-full rounded-xl border-2 border-gold/50 bg-white px-4 py-3 text-sm outline-none focus:border-maroon"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-charcoal">
            Default WhatsApp Message Language
          </label>
          <select
            value={form.defaultWhatsappLanguage}
            onChange={handleChange("defaultWhatsappLanguage")}
            className="w-full rounded-xl border border-gold/30 bg-white px-4 py-2.5 text-sm outline-none focus:border-maroon"
          >
            <option value="hi">Hindi (recommended)</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-charcoal">Business Name (English)</label>
            <input
              type="text"
              value={form.businessName}
              onChange={handleChange("businessName")}
              className="w-full rounded-xl border border-gold/30 bg-white px-4 py-2.5 text-sm outline-none focus:border-maroon"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-charcoal">Business Name (Hindi)</label>
            <input
              type="text"
              value={form.businessNameHindi}
              onChange={handleChange("businessNameHindi")}
              className="w-full rounded-xl border border-gold/30 bg-white px-4 py-2.5 text-sm outline-none focus:border-maroon"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-charcoal">Tagline (English)</label>
            <input
              type="text"
              value={form.tagline}
              onChange={handleChange("tagline")}
              className="w-full rounded-xl border border-gold/30 bg-white px-4 py-2.5 text-sm outline-none focus:border-maroon"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-charcoal">Tagline (Hindi)</label>
            <input
              type="text"
              value={form.taglineHindi}
              onChange={handleChange("taglineHindi")}
              className="w-full rounded-xl border border-gold/30 bg-white px-4 py-2.5 text-sm outline-none focus:border-maroon"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-charcoal">Contact Phone</label>
          <input
            type="text"
            value={form.contactPhone}
            onChange={handleChange("contactPhone")}
            className="w-full rounded-xl border border-gold/30 bg-white px-4 py-2.5 text-sm outline-none focus:border-maroon"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-charcoal">Contact Address</label>
          <textarea
            rows={2}
            value={form.contactAddress}
            onChange={handleChange("contactAddress")}
            className="w-full resize-none rounded-xl border border-gold/30 bg-white px-4 py-2.5 text-sm outline-none focus:border-maroon"
          />
        </div>

        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </AdminLayout>
  );
};

export default AdminSettings;
