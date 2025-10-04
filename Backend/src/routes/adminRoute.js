import express from "express";
import { adminProtect } from "../middleware/authMiddleware.js";
import adminController from "../controller/adminController.js";

const router = express.Router();

router.get("/profile", adminProtect, adminController.getProfile);

export default router;