import express from "express";
import { userProtect } from "../middleware/authMiddleware.js";
import userController from "../controller/userController.js";

const router = express.Router();

router.get("/profile", userProtect, userController.getProfile);

export default router;
