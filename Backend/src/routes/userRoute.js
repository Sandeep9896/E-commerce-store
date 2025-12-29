import express from "express";
import { userProtect } from "../middleware/authMiddleware.js";
import userController from "../controller/userController.js";
import { uploadAvatars } from "../config/multer.js";

const router = express.Router();

router.get("/profile", userProtect, userController.getProfile);
router.post("/upload-avatar", userProtect, uploadAvatars.single("avatar"), userController.uploadAvatar);
router.put("/update-profile", userProtect, userController.updateProfile);
router.post("/create-order", userProtect, userController.createOrder);
router.post("/addToCart", userProtect, userController.addToCart);
router.get("/cart", userProtect, userController.getCart);
router.delete("/cart/:productId", userProtect, userController.removeFromCart);
router.delete("/cart", userProtect, userController.clearCart);
router.put("/updateCart", userProtect, userController.updateCart);
router.get("/search/:query",  userController.searchProducts);
router.post("/cart-merge", userProtect, userController.mergeCart);
router.post("/addOrder", userProtect, userController.addOrder);
router.post('/fetch-orders', userProtect, userController.fetchOrders);
// router.get('/order/:orderId', userProtect, userController.getOrderDetails);
router.get('/related-products/:category', userController.relatedProducts);

export default router;
