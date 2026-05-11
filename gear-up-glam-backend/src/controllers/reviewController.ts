import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ApiError } from "@/utils/errors";

const prisma = new PrismaClient();

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          include: { profile: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const parsed = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      user: {
        id: r.user.id,
        displayName: r.user.profile?.displayName || r.user.email,
        avatarUrl: r.user.profile?.avatarUrl || null,
      },
    }));

    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

export const createReview = async (req: Request, res: Response) => {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      throw new ApiError(400, "Rating must be between 1 and 5");
    }

    if (!comment || comment.trim().length === 0) {
      throw new ApiError(400, "Comment is required");
    }

    // Check if user already reviewed this product
    const existing = await prisma.review.findFirst({
      where: { userId: req.user.userId, productId },
    });

    if (existing) {
      throw new ApiError(400, "You already reviewed this product");
    }

    const review = await prisma.review.create({
      data: {
        userId: req.user.userId,
        productId,
        rating,
        comment: comment.trim(),
      },
      include: {
        user: { include: { profile: true } },
      },
    });

    res.status(201).json({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      user: {
        id: review.user.id,
        displayName: review.user.profile?.displayName || review.user.email,
        avatarUrl: review.user.profile?.avatarUrl || null,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to create review" });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const { id } = req.params;

    const review = await prisma.review.findUnique({ where: { id } });

    if (!review) throw new ApiError(404, "Review not found");

    // Only owner or admin can delete
    if (review.userId !== req.user.userId && req.user.role?.toLowerCase() !== "admin") {
      throw new ApiError(403, "Not authorized");
    }

    await prisma.review.delete({ where: { id } });

    res.json({ message: "Review deleted" });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to delete review" });
  }
};