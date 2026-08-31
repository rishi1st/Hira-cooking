import asyncHandler from "express-async-handler";
import Settings from "../models/Settings.js";

const SETTINGS_KEY = "site_settings";

// @desc    Get site settings (public - needed to render WhatsApp button/number)
// @route   GET /api/settings
// @access  Public
const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne({ key: SETTINGS_KEY });

  if (!settings) {
    settings = await Settings.create({
      key: SETTINGS_KEY,
      whatsappNumber: process.env.DEFAULT_WHATSAPP_NUMBER || "910000000000",
    });
  }

  res.json({ success: true, data: settings });
});

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne({ key: SETTINGS_KEY });

  if (!settings) {
    settings = new Settings({ key: SETTINGS_KEY });
  }

  const fields = [
    "whatsappNumber",
    "businessName",
    "businessNameHindi",
    "tagline",
    "taglineHindi",
    "contactPhone",
    "contactAddress",
    "defaultWhatsappLanguage",
  ];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      settings[field] = req.body[field];
    }
  });

  const updated = await settings.save();
  res.json({ success: true, data: updated });
});

export { getSettings, updateSettings };
