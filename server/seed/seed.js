// Seeds the database with sample categories, food items and a default admin
// so the application can be demonstrated immediately.
//
// Usage:
//   npm run seed            -> import sample data
//   npm run seed:destroy    -> wipe Food, Category, Settings, Admin collections

import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Food from "../models/Food.js";
import Category from "../models/Category.js";
import Admin from "../models/Admin.js";
import Settings from "../models/Settings.js";
import { categories, foods } from "./seedData.js";

dotenv.config();
await connectDB();

const placeholderImage = (label) =>
  `https://placehold.co/800x600/7A1F2B/F3E1D0?text=${encodeURIComponent(label)}`;

const importData = async () => {
  try {
    await Food.deleteMany();
    await Category.deleteMany();

    const createdCategories = await Category.insertMany(categories);
    const slugToId = Object.fromEntries(createdCategories.map((c) => [c.slug, c._id]));

    const foodDocs = foods.map(({ categorySlug, imageQuery, ...rest }) => ({
      ...rest,
      category: slugToId[categorySlug],
      imageUrl: placeholderImage(rest.englishName),
      // NOTE: replace with real Cloudinary images from the Admin Panel after seeding.
    }));

    await Food.insertMany(foodDocs);

    const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      await Admin.create({
        name: "Business Owner",
        email: process.env.ADMIN_EMAIL || "admin@shubhbhoj.com",
        password: process.env.ADMIN_PASSWORD || "ChangeThisPassword123!",
        role: "superadmin",
      });
    }

    const settingsExists = await Settings.findOne({ key: "site_settings" });
    if (!settingsExists) {
      await Settings.create({
        key: "site_settings",
        whatsappNumber: process.env.DEFAULT_WHATSAPP_NUMBER || "918340574346",
      });
    }

    console.log("✅ Sample data imported successfully");
    console.log(`   Categories: ${createdCategories.length}`);
    console.log(`   Foods: ${foodDocs.length}`);
    console.log(`   Admin login: ${process.env.ADMIN_EMAIL || "admin@shubhbhoj.com"}`);
    process.exit(0);
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Food.deleteMany();
    await Category.deleteMany();
    await Settings.deleteMany();
    await Admin.deleteMany();
    console.log("🗑️  All data destroyed");
    process.exit(0);
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
