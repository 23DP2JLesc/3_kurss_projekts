import { Router } from "express";
import { getUserOrders, createOrder, updateOrderStatus } from "../controllers/orderController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getUserOrders);
router.post("/", createOrder);
router.put("/:id/status", adminMiddleware, updateOrderStatus);

export default router;