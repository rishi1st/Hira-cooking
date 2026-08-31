import multer from "multer";
import { storage } from "../config/cloudinary.js";

const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png|webp|mp4|mov|webm/;
  const mimetypeOk = file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/");
  const extOk = allowed.test(file.originalname.toLowerCase());

  if (mimetypeOk && extOk) {
    cb(null, true);
  } else {
    cb(new Error("Only image (jpg, png, webp) or video (mp4, mov, webm) files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB ceiling, mainly for video
});

export default upload;
