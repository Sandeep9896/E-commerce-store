import express from "express";
import { sellerProtect } from "../middleware/authMiddleware.js";
import sellerController from "../controller/sellerController.js";
import { uploadAvatars } from "../config/multer.js";

const router = express.Router();

router.get("/profile", sellerProtect, sellerController.getProfile);
router.post("/upload-seller-avatar", sellerProtect, uploadAvatars.single("avatar"), sellerController.uploadAvatar);
router.put("/update-profile", sellerProtect, sellerController.updateProfile);
router.get("/products", sellerProtect, sellerController.getProductsBySeller);
router.put("/products/:id", sellerProtect, sellerController.updateProduct);
// Express.js Example
router.post('/products/:id/feature-request', sellerProtect, sellerController.FeatureRequestProduct);

export default router;