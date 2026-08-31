import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    hindiName: {
      type: String,
      required: [true, "Hindi name is required"],
      trim: true,
    },
    englishName: {
      type: String,
      required: [true, "English name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 600,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    imageUrl: {
      type: String,
      required: [true, "Food image is required"],
    },
    imagePublicId: {
      type: String, // Cloudinary public_id, used for clean deletion
    },
    videoUrl: {
      type: String,
      default: null,
    },
    videoPublicId: {
      type: String,
      default: null,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

foodSchema.index({ category: 1 });
foodSchema.index({ hindiName: "text", englishName: "text", description: "text" });

const Food = mongoose.model("Food", foodSchema);
export default Food;
