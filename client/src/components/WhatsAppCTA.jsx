import React from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useSelection } from "../context/SelectionContext.jsx";

// Small floating WhatsApp shortcut for quick general contact (separate from
// the full enquiry form flow, which sends the detailed structured message).
const WhatsAppCTA = ({ settings }) => {
  const { t } = useLanguage();
  const { selectedCount } = useSelection();

  if (!settings?.whatsappNumber) return null;

  // Hide when the sticky selection bar is showing, to avoid overlapping CTAs.
  const bottomOffset = selectedCount > 0 ? "bottom-24" : "bottom-6";

  return (
    <a
      href={`https://wa.me/${settings.whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.7)] transition-all duration-300 hover:scale-105 ${bottomOffset}`}
      aria-label={t("whatsapp_float")}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12.001 2C6.478 2 2 6.478 2 12c0 1.88.52 3.638 1.42 5.14L2 22l4.995-1.397A9.947 9.947 0 0012 22c5.523 0 10-4.478 10-10S17.523 2 12.001 2zm0 18.077a8.05 8.05 0 01-4.109-1.128l-.294-.176-3.058.856.836-2.98-.192-.306A8.05 8.05 0 0112.001 3.923c4.455 0 8.077 3.622 8.077 8.077 0 4.455-3.622 8.077-8.077 8.077z" />
      </svg>
    </a>
  );
};

export default WhatsAppCTA;
