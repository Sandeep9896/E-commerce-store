import express from "express";
import { sellerProtect } from "../middleware/authMiddleware.js";
import sellerController from "../controller/sellerController.js";

const router = express.Router();

router.get("/profile", sellerProtect, sellerController.getProfile);

export default router;