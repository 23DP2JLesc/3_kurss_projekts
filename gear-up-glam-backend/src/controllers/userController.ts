import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/errors";

const prisma = new PrismaClient();

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        banned: true,
        createdAt: true,
        profile: {
          select: {
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      throw new ApiError(400, "Invalid role. Must be 'user' or 'admin'");
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        role: true,
        banned: true,
      },
    });

    res.json(user);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    if (error instanceof Error && error.message.includes("NotFound")) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(500).json({ error: "Failed to update user role" });
  }
};

export const banUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { banned, warning_message } = req.body;

    const updateData: any = {};

    if (typeof banned === "boolean") {
      updateData.banned = banned;
    }

    if (warning_message !== undefined) {
      updateData.warningMessage = warning_message;
    }

    if (Object.keys(updateData).length === 0) {
      throw new ApiError(400, "No valid fields to update");
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        banned: true,
      },
    });

    res.json(user);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    if (error instanceof Error && error.message.includes("NotFound")) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(500).json({ error: "Failed to update user status" });
  }
};
