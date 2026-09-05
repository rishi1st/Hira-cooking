// One-off migration: re-point EXISTING Food documents at the client's new,
// finer-grained category scheme (37 categories, from the reviewed
// spreadsheet) and correct any inaccurate names -- WITHOUT touching
// imageUrl / imagePublicId / videoUrl / videoPublicId, since those 100+
// images and videos are already uploaded to Cloudinary and must not be
// re-uploaded or lost.
//
// Matching is done by hindiName, trimmed and whitespace-normalised, against
// the client's reviewed list in data/recategorizationData.js. Nothing here
// creates or deletes Food documents -- it only updates `category` and,
// where safe, `englishName` on documents that already exist.
//
// Usage:
//   node scripts/recategorizeFoods.js --dry-run    -> preview only, no writes
//   node scripts/recategorizeFoods.js              -> apply the changes
//
// Always run --dry-run first and read the summary before applying for real.

import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Food from "../models/Food.js";
import Category from "../models/Category.js";
import {
  newCategories,
  itemRecategorization,
  itemsNeedingNameReview,
} from "./recategorizationData.js";

dotenv.config();

const DRY_RUN = process.argv.includes("--dry-run");

const normalize = (str) => str.replace(/\s+/g, " ").trim();

const run = async () => {
  await connectDB();

  // 1. Ensure every new category exists. Matched by slug so re-running this
  //    script is safe (it will never create duplicate categories).
  const slugToCategoryId = {};
  for (const cat of newCategories) {
    let existing = await Category.findOne({ slug: cat.slug });
    if (!existing) {
      if (DRY_RUN) {
        console.log(`[dry-run] would create category: ${cat.nameEnglish} (${cat.slug})`);
      } else {
        existing = await Category.create(cat);
        console.log(`Created category: ${cat.nameEnglish} (${cat.slug})`);
      }
    }
    if (existing) slugToCategoryId[cat.slug] = existing._id;
  }

  // In dry-run mode categories don't actually exist yet, so food-matching
  // below can still be previewed against the slugs alone.

  // 2. Build a lookup of the client's reviewed list, keyed by normalized
  //    Hindi name.
  const bySlug = Object.fromEntries(newCategories.map((c) => [c.slug, c]));
  const reviewList = new Map(
    itemRecategorization.map((item) => [normalize(item.hindiName), item])
  );

  const allFoods = await Food.find({});
  console.log(`\nLoaded ${allFoods.length} existing Food documents.\n`);

  let matched = 0;
  let renamed = 0;
  let flaggedForReview = [];
  let unmatched = [];

  for (const food of allFoods) {
    const key = normalize(food.hindiName);
    const match = reviewList.get(key);

    if (!match) {
      unmatched.push(food.hindiName);
      continue;
    }

    matched++;
    const newCategoryId = slugToCategoryId[match.newCategorySlug];
    const categoryLabel = bySlug[match.newCategorySlug]?.nameEnglish ?? match.newCategorySlug;

    const nameNeedsReview = itemsNeedingNameReview.has(normalize(match.hindiName));
    const nameDiffers = match.accurateEnglishName !== food.englishName;

    if (DRY_RUN) {
      console.log(
        `[dry-run] "${food.hindiName}" -> category: ${categoryLabel}` +
          (nameDiffers && !nameNeedsReview
            ? ` | name: "${food.englishName}" -> "${match.accurateEnglishName}"`
            : "")
      );
    } else if (newCategoryId) {
      food.category = newCategoryId;
      // Only auto-correct the English name when the client's sheet didn't
      // flag this dish as needing manual verification.
      if (nameDiffers && !nameNeedsReview) {
        food.englishName = match.accurateEnglishName;
        renamed++;
      }
      await food.save();
    }

    if (nameNeedsReview) flaggedForReview.push(food.hindiName);
  }

  console.log("\n----- Summary -----");
  console.log(`Matched & re-categorized: ${matched}`);
  console.log(`Names auto-corrected: ${renamed}`);
  console.log(`Flagged for manual name review (not auto-renamed): ${flaggedForReview.length}`);
  flaggedForReview.forEach((name) => console.log(`   - ${name}`));
  console.log(`Existing Food docs with NO match in the client's sheet: ${unmatched.length}`);
  unmatched.forEach((name) => console.log(`   - ${name}`));

  if (DRY_RUN) {
    console.log("\nThis was a dry run -- nothing was written. Re-run without --dry-run to apply.");
  }

  process.exit(0);
};

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});