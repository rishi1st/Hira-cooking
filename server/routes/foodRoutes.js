import express from "express";
import {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
} from "../controllers/foodController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

const mediaUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

router.route("/").get(getFoods).post(protect, mediaUpload, createFood);

router
  .route("/:id")
  .get(getFoodById)
  .put(protect, mediaUpload, updateFood)
  .delete(protect, deleteFood);

export default router;
