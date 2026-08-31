import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    nameHindi: {
      type: String,
      required: [true, "Hindi category name is required"],
      trim: true,
    },
    nameEnglish: {
      type: String,
      required: [true, "English category name is required"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
