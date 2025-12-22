import express from "express";
import { upload } from "../config/multer.js";
import productController from "../controller/productController.js";
import { sellerProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// router.post("/upload", upload.array("images", 5), productController.uploadProductImage);
router.post("/upload", sellerProtect,(req, res, next) => {
  upload.array("images", 5)(req, res, (err) => {
    if (err) {
        console.error("Multer Error:", err);
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
}, productController.uploadProduct);

router.get("/", productController.productPagination);
router.get("/featured", productController.featuredProducts);
router.get("/:id", productController.getProductById);
// router.put("/:id", upload.array("images", 5), productController.updateProduct);
// router.delete("/:id", productController.deleteProduct);


export default router;
