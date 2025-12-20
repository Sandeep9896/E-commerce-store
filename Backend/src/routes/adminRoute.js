import express from "express";
import { adminProtect } from "../middleware/authMiddleware.js";
import adminController from "../controller/adminController.js";

const router = express.Router();

router.get("/profile", adminProtect, adminController.getProfile);
router.post('/api/products/:id/approve-feature', adminProtect, adminController.approveFeatureRequest);


export default router;