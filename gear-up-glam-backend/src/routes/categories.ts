import { Router } from "express";
import { getAll, create, update, deleteCategory } from "@/controllers/categoryController";
import { authMiddleware, adminMiddleware } from "../middleware/auth";

const router = Router();

// GET /api/categories - public
router.get("/", getAll);

// POST /api/categories - admin only
router.post("/", authMiddleware, adminMiddleware, create);

// PUT /api/categories/:id - admin only
router.put("/:id", authMiddleware, adminMiddleware, update);

// DELETE /api/categories/:id - admin only
router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

export default router;