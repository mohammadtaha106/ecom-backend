import express from "express";
import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from "../controllers/cartController";
import { protect } from "../middleware/authMiddleware";


const router = express.Router();

router.get("/", protect, getCartProducts);
router.post("/", protect, addToCart);
router.delete("/", protect, removeAllFromCart);
router.put("/:id", protect, updateQuantity);

export default router;