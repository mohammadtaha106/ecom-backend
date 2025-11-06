import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getCoupon, validateCoupon } from "../controllers/couponController";

const router = express.Router();

router.get("/", protect, getCoupon);
router.post("/validate", protect, validateCoupon);

export default router;
