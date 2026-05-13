import { Router } from "express";
import { getAllUsers, updateUserRole, banUser } from "@/controllers/userController";
import { authMiddleware, adminMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get("/", getAllUsers);
router.put("/:id/role", updateUserRole);
router.put("/:id/status", banUser);

export default router;
