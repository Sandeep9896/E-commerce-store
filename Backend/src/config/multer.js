import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecommerce/products", // folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const storageAvatars = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "ecommerce/avatars", // folder name in Cloudinary
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
});

const upload = multer({ storage });

const uploadAvatars = multer({ storage: storageAvatars });

export { upload, uploadAvatars };
