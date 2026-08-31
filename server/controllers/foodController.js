import asyncHandler from "express-async-handler";
import Food from "../models/Food.js";
import { cloudinary } from "../config/cloudinary.js";

// @desc    Get all foods (supports ?category=slug or id, ?search=, ?available=true)
// @route   GET /api/foods
// @access  Public
const getFoods = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.available === "true") {
    filter.isAvailable = true;
  }

  if (req.query.search) {
    filter.$or = [
      { hindiName: { $regex: req.query.search, $options: "i" } },
      { englishName: { $regex: req.query.search, $options: "i" } },
    ];
  }

  const foods = await Food.find(filter)
    .populate("category", "nameHindi nameEnglish slug")
    .sort({ displayOrder: 1, createdAt: -1 });

  res.json({ success: true, count: foods.length, data: foods });
});

// @desc    Get single food
// @route   GET /api/foods/:id
// @access  Public
const getFoodById = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id).populate(
    "category",
    "nameHindi nameEnglish slug"
  );

  if (!food) {
    res.status(404);
    throw new Error("Food item not found");
  }

  res.json({ success: true, data: food });
});

// @desc    Create food item
// @route   POST /api/foods
// @access  Private/Admin
const createFood = asyncHandler(async (req, res) => {
  const { hindiName, englishName, description, category, isVeg, isAvailable, displayOrder } =
    req.body;

  if (!hindiName || !englishName || !description || !category) {
    res.status(400);
    throw new Error("Hindi name, English name, description and category are required");
  }

  const imageFile = req.files?.image?.[0];
  const videoFile = req.files?.video?.[0];

  if (!imageFile) {
    res.status(400);
    throw new Error("A food image is required");
  }

  const food = await Food.create({
    hindiName,
    englishName,
    description,
    category,
    isVeg: isVeg === undefined ? true : isVeg === "true" || isVeg === true,
    isAvailable: isAvailable === undefined ? true : isAvailable === "true" || isAvailable === true,
    displayOrder: displayOrder || 0,
    imageUrl: imageFile.path,
    imagePublicId: imageFile.filename,
    videoUrl: videoFile ? videoFile.path : null,
    videoPublicId: videoFile ? videoFile.filename : null,
  });

  const populated = await food.populate("category", "nameHindi nameEnglish slug");
  res.status(201).json({ success: true, data: populated });
});

// @desc    Update food item
// @route   PUT /api/foods/:id
// @access  Private/Admin
const updateFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);

  if (!food) {
    res.status(404);
    throw new Error("Food item not found");
  }

  const { hindiName, englishName, description, category, isVeg, isAvailable, displayOrder } =
    req.body;

  if (hindiName) food.hindiName = hindiName;
  if (englishName) food.englishName = englishName;
  if (description) food.description = description;
  if (category) food.category = category;
  if (isVeg !== undefined) food.isVeg = isVeg === "true" || isVeg === true;
  if (isAvailable !== undefined) food.isAvailable = isAvailable === "true" || isAvailable === true;
  if (displayOrder !== undefined) food.displayOrder = displayOrder;

  const imageFile = req.files?.image?.[0];
  const videoFile = req.files?.video?.[0];

  if (imageFile) {
    if (food.imagePublicId) {
      await cloudinary.uploader.destroy(food.imagePublicId).catch(() => {});
    }
    food.imageUrl = imageFile.path;
    food.imagePublicId = imageFile.filename;
  }

  if (videoFile) {
    if (food.videoPublicId) {
      await cloudinary.uploader.destroy(food.videoPublicId, { resource_type: "video" }).catch(() => {});
    }
    food.videoUrl = videoFile.path;
    food.videoPublicId = videoFile.filename;
  }

  const updated = await food.save();
  const populated = await updated.populate("category", "nameHindi nameEnglish slug");
  res.json({ success: true, data: populated });
});

// @desc    Delete food item
// @route   DELETE /api/foods/:id
// @access  Private/Admin
const deleteFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);

  if (!food) {
    res.status(404);
    throw new Error("Food item not found");
  }

  if (food.imagePublicId) {
    await cloudinary.uploader.destroy(food.imagePublicId).catch(() => {});
  }
  if (food.videoPublicId) {
    await cloudinary.uploader.destroy(food.videoPublicId, { resource_type: "video" }).catch(() => {});
  }

  await food.deleteOne();
  res.json({ success: true, message: "Food item deleted" });
});

export { getFoods, getFoodById, createFood, updateFood, deleteFood };
