import { Router } from "express";
import { getProductReviews, createReview, deleteReview } from "../controllers/reviewController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router({ mergeParams: true });

router.get("/", getProductReviews);
router.post("/", authMiddleware, createReview);
router.delete("/:id", authMiddleware, deleteReview);

export default router;