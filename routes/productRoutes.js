
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getProductsByCategory, getRecommendedProducts, toggleFeaturedProduct } from "../controllers/productController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import express from "express";
const router = express.Router();

router.get("/", protect, adminOnly, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.post("/", protect, adminOnly, createProduct);
router.patch("/:id", protect, adminOnly, toggleFeaturedProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);
router.get("/recommendations", getRecommendedProducts); 
router.get("/category/:category", getProductsByCategory); 

export default router;