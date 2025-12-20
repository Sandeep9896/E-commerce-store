import express from "express";
import authController from "../controller/authController.js";
import userController from '../controller/userController.js';
import adminController from '../controller/adminController.js';
import sellerController from '../controller/sellerController.js';

const router = express.Router();

router.post("/login", authController.login);
router.post("/register/customer", userController.register);
router.post("/register/seller", sellerController.register);
router.post("/register/admin", adminController.register); // Temporary route to create an admin
router.post("/refresh-token", authController.refreshAccessToken);
router.post("/logout", authController.logOut);
router.post("/health", authController.healthCheck);

export default router;
