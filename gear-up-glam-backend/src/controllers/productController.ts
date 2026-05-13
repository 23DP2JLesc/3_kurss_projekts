import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createProductSchema, updateProductSchema, CreateProductInput, UpdateProductInput } from "../utils/validation";
import { ApiError } from "../utils/errors";

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, brand, search, limit = "50", offset = "0" } = req.query;

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (brand) {
      where.brand = brand;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
        { brand: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      orderBy: { createdAt: "desc" },
    });

    // Parse fitment JSON for each product
    const parsedProducts = products.map((p) => ({
      ...p,
      fitment: JSON.parse(p.fitment as string),
    }));

    const total = await prisma.product.count({ where });

    res.json({
      data: parsedProducts,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const parsed = {
      ...product,
      fitment: JSON.parse(product.fitment as string),
    };

    res.json(parsed);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const body = createProductSchema.parse(req.body);
    const { fitment, ...data } = body as CreateProductInput;

    const product = await prisma.product.create({
      data: {
        ...data,
        fitment: JSON.stringify(fitment),
      },
    });

    const parsed = {
      ...product,
      fitment: JSON.parse(product.fitment as string),
    };

    res.status(201).json(parsed);
  } catch (error) {
    if (error instanceof Error && error.message.includes("validation")) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = updateProductSchema.parse(req.body);
    const { fitment, ...data } = body as UpdateProductInput;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        ...(fitment && { fitment: JSON.stringify(fitment) }),
      },
    });

    const parsed = {
      ...product,
      fitment: JSON.parse(product.fitment as string),
    };

    res.json(parsed);
  } catch (error) {
    if (error instanceof Error && error.message.includes("NotFound")) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (error instanceof Error && error.message.includes("validation")) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id },
    });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.message.includes("NotFound")) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(500).json({ error: "Failed to delete product" });
  }
};
