import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";
import Food from "../models/Food.js";

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ displayOrder: 1, nameEnglish: 1 });
  res.json({ success: true, count: categories.length, data: categories });
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { nameHindi, nameEnglish, displayOrder } = req.body;

  if (!nameHindi || !nameEnglish) {
    res.status(400);
    throw new Error("Both Hindi and English category names are required");
  }

  const category = await Category.create({
    nameHindi,
    nameEnglish,
    slug: slugify(nameEnglish),
    displayOrder: displayOrder || 0,
  });

  res.status(201).json({ success: true, data: category });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const { nameHindi, nameEnglish, displayOrder } = req.body;

  if (nameHindi) category.nameHindi = nameHindi;
  if (nameEnglish) {
    category.nameEnglish = nameEnglish;
    category.slug = slugify(nameEnglish);
  }
  if (displayOrder !== undefined) category.displayOrder = displayOrder;

  const updated = await category.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const foodCount = await Food.countDocuments({ category: category._id });
  if (foodCount > 0) {
    res.status(400);
    throw new Error(
      `Cannot delete: ${foodCount} food item(s) still use this category. Reassign or delete them first.`
    );
  }

  await category.deleteOne();
  res.json({ success: true, message: "Category deleted" });
});

export { getCategories, createCategory, updateCategory, deleteCategory };
