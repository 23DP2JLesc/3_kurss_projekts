import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { updateProfileSchema, UpdateProfileInput } from "@/utils/validation";
import { ApiError } from "@/utils/errors";

const prisma = new PrismaClient();

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.json({
      ...user.profile,
      warningMessage: user.warningMessage,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const body = updateProfileSchema.parse(req.body);
    const data = body as UpdateProfileInput;

    const profile = await prisma.profile.update({
      where: { userId: req.user.userId },
      data,
    });

    res.json(profile);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    if (error instanceof Error && error.message.includes("NotFound")) {
      return res.status(404).json({ error: "Profile not found" });
    }
    if (error instanceof Error && error.message.includes("validation")) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to update profile" });
  }
};
