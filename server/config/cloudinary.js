import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Cloudinary is used so large image/video files never touch MongoDB directly.
// Only the resulting secure URL is stored on the Food document.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video/");
    return {
      folder: "shubh-bhoj-catering/food",
      resource_type: isVideo ? "video" : "image",
      transformation: isVideo
        ? undefined
        : [{ width: 1200, height: 1200, crop: "limit", quality: "auto" }],
      allowed_formats: isVideo
        ? ["mp4", "mov", "webm"]
        : ["jpg", "jpeg", "png", "webp"],
    };
  },
});

export { cloudinary, storage };
