import mongoose from "mongoose";

// Singleton document holding site-wide, admin-editable configuration.
const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "site_settings",
      unique: true,
    },
    whatsappNumber: {
      type: String,
      required: true,
      trim: true,
      // E.164 without the leading '+', e.g. 919000000000
    },
    businessName: {
      type: String,
      default: "Shubh Bhoj Catering",
    },
    businessNameHindi: {
      type: String,
      default: "शुभ भोज कैटरिंग",
    },
    tagline: {
      type: String,
      default: "Premium Catering for Weddings & Celebrations",
    },
    taglineHindi: {
      type: String,
      default: "शादी और उत्सव के लिए प्रीमियम कैटरिंग",
    },
    contactPhone: {
      type: String,
      default: "",
    },
    contactAddress: {
      type: String,
      default: "",
    },
    defaultWhatsappLanguage: {
      type: String,
      enum: ["hi", "en"],
      default: "hi",
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
