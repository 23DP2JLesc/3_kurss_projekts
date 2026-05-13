import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/errors.js";

const prisma = new PrismaClient();

// GET all categories - public
export const getAll = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    res.json({ data: categories });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// POST create category - admin only
export const create = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      throw new ApiError(400, "Category name is required");
    }

    // Check if category already exists
    const existing = await prisma.category.findUnique({
      where: { name: name.trim() },
    });

    if (existing) {
      throw new ApiError(400, "Category with this name already exists");
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to create category" });
  }
};

// PUT update category - admin only
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const existing = await prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new ApiError(404, "Category not found");
    }

    // Check for duplicate name (excluding current category)
    if (name && name.trim() !== existing.name) {
      const duplicate = await prisma.category.findUnique({
        where: { name: name.trim() },
      });

      if (duplicate) {
        throw new ApiError(400, "Category with this name already exists");
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: name?.trim() || existing.name,
        description: description?.trim() ?? existing.description,
      },
    });

    res.json(category);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to update category" });
  }
};

// DELETE category - admin only
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new ApiError(404, "Category not found");
    }

    await prisma.category.delete({
      where: { id },
    });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to delete category" });
  }
};