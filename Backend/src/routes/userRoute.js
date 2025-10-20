import express from "express";
import { userProtect } from "../middleware/authMiddleware.js";
import userController from "../controller/userController.js";
import { uploadAvatars } from "../config/multer.js";

const router = express.Router();

router.get("/profile", userProtect, userController.getProfile);
router.post("/upload-avatar", userProtect, uploadAvatars.single("avatar"), userController.uploadAvatar);
router.put("/update-profile", userProtect, userController.updateProfile);

export default router;
