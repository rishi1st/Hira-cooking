import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useSelection } from "../context/SelectionContext.jsx";
import { openWhatsappEnquiry } from "../utils/whatsapp.js";

const EnquiryForm = ({ settings }) => {
  const { t, language } = useLanguage();
  const { selectedFoods, selectedCount, removeFood } = useSelection();

  const [form, setForm] = useState({ name: "", mobile: "", address: "", people: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = t("form_error_name");
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) next.mobile = t("form_error_mobile");
    if (!form.address.trim()) next.address = t("form_error_address");
    const peopleNum = Number(form.people);
    if (!form.people || !Number.isFinite(peopleNum) || peopleNum <= 0 || !Number.isInteger(peopleNum)) {
      next.people = t("form_error_people");
    }
    if (selectedCount === 0) next.food = t("form_error_food");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    openWhatsappEnquiry({
      whatsappNumber: settings?.whatsappNumber,
      name: form.name.trim(),
      mobile: form.mobile.trim(),
      address: form.address.trim(),
      people: form.people,
      foods: selectedFoods,
      language: settings?.defaultWhatsappLanguage || "hi",
    });
    setSubmitted(true);
  };

  return (
    <section id="enquiry" className="bg-blush/40 py-16 lg:py-24">
      <div className="container-shell">
        <div className="mx-auto max-w-xl text-center">
          <span className="section-eyebrow justify-center">{t("form_eyebrow")}</span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-maroon sm:text-4xl">
            {t("form_title")}
          </h2>
          <p className="mt-2 text-sm text-charcoal/60 sm:text-base">{t("form_subtitle")}</p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <div className="card-surface p-6 sm:p-9">
            {/* Selected dishes summary */}
            <div className="mb-7">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-charcoal/60">
                {t("form_selected_summary")} ({selectedCount})
              </h3>
              {selectedCount === 0 ? (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{t("form_error_food")}</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedFoods.map((food) => (
                    <span
                      key={food._id}
                      className="inline-flex items-center gap-2 rounded-full bg-maroon/10 py-1.5 pl-3.5 pr-2 text-sm font-medium text-maroon"
                    >
                      {language === "hi" ? food.hindiName : food.englishName}
                      <button
                        type="button"
                        onClick={() => removeFood(food._id)}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-maroon/15 hover:bg-maroon/25"
                        aria-label={`Remove ${food.englishName}`}
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 2l6 6M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-charcoal">
                  {t("form_name")}
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                  placeholder={t("form_name_placeholder")}
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-maroon ${
                    errors.name ? "border-red-400" : "border-gold/30"
                  }`}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="mobile" className="mb-1.5 block text-sm font-semibold text-charcoal">
                  {t("form_mobile")}
                </label>
                <input
                  id="mobile"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={form.mobile}
                  onChange={handleChange("mobile")}
                  placeholder={t("form_mobile_placeholder")}
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-maroon ${
                    errors.mobile ? "border-red-400" : "border-gold/30"
                  }`}
                  aria-invalid={!!errors.mobile}
                />
                {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
              </div>

              <div>
                <label htmlFor="address" className="mb-1.5 block text-sm font-semibold text-charcoal">
                  {t("form_address")}
                </label>
                <textarea
                  id="address"
                  rows={3}
                  value={form.address}
                  onChange={handleChange("address")}
                  placeholder={t("form_address_placeholder")}
                  className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-maroon ${
                    errors.address ? "border-red-400" : "border-gold/30"
                  }`}
                  aria-invalid={!!errors.address}
                />
                {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
              </div>

              {/* Number of people - highlighted per business requirement */}
              <div className="rounded-2xl border-2 border-gold bg-gradient-to-br from-gold-light/40 to-blush/50 p-5">
                <label htmlFor="people" className="mb-1 block text-sm font-bold uppercase tracking-wide text-maroon-dark">
                  {t("form_people")}
                </label>
                <p className="mb-3 text-xs font-medium text-maroon-dark/70">{t("form_people_hint")}</p>
                <input
                  id="people"
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={form.people}
                  onChange={handleChange("people")}
                  placeholder={t("form_people_placeholder")}
                  className={`w-full rounded-xl border-2 bg-white px-5 py-4 text-center font-display text-3xl font-bold text-maroon outline-none transition focus:border-maroon ${
                    errors.people ? "border-red-400" : "border-gold/50"
                  }`}
                  aria-invalid={!!errors.people}
                />
                {errors.people && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.people}</p>}
              </div>

              <button type="submit" className="btn-whatsapp mt-2 w-full">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12.001 2C6.478 2 2 6.478 2 12c0 1.88.52 3.638 1.42 5.14L2 22l4.995-1.397A9.947 9.947 0 0012 22c5.523 0 10-4.478 10-10S17.523 2 12.001 2zm0 18.077a8.05 8.05 0 01-4.109-1.128l-.294-.176-3.058.856.836-2.98-.192-.306A8.05 8.05 0 0112.001 3.923c4.455 0 8.077 3.622 8.077 8.077 0 4.455-3.622 8.077-8.077 8.077z" />
                </svg>
                {t("form_whatsapp_cta")}
              </button>

              {submitted && (
                <p className="text-center text-sm font-medium text-forest">
                  {language === "hi"
                    ? "व्हाट्सऐप खुल गया है। कृपया संदेश भेजें।"
                    : "WhatsApp has opened. Please send the message."}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnquiryForm;
