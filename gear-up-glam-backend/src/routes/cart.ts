import { Router } from "express";
import { getCart, addItem, updateItem, removeItem, clearCart } from "@/controllers/cartController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/", getCart);
router.post("/items", addItem);
router.put("/items/:itemId", updateItem);
router.delete("/items/:itemId", removeItem);
router.delete("/", clearCart);

export default router;