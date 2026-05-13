import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/errors";

const prisma = new PrismaClient();

export const getCart = async (req: Request, res: Response) => {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.userId },
        include: { items: { include: { product: true } } },
      });
    }

    const parsed = {
      ...cart,
      items: cart.items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          fitment: JSON.parse(item.product.fitment as string),
        },
      })),
    };

    res.json(parsed);
  } catch (error) {
    if (error instanceof ApiError) return res.status(error.statusCode).json({ error: error.message });
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

export const addItem = async (req: Request, res: Response) => {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");
    const { productId, quantity = 1 } = req.body;

    if (!productId) throw new ApiError(400, "Product ID required");

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new ApiError(404, "Product not found");

    let cart = await prisma.cart.findUnique({ where: { userId: req.user.userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: req.user.userId } });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } },
    });

    res.json(updatedCart);
  } catch (error) {
    console.error("Add item error:", error);
    if (error instanceof ApiError) return res.status(error.statusCode).json({ error: error.message });
    res.status(500).json({ error: "Failed to add item" });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) throw new ApiError(400, "Quantity must be at least 1");

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    res.json({ message: "Item updated" });
  } catch (error) {
    if (error instanceof ApiError) return res.status(error.statusCode).json({ error: error.message });
    res.status(500).json({ error: "Failed to update item" });
  }
};

export const removeItem = async (req: Request, res: Response) => {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");
    const { itemId } = req.params;

    await prisma.cartItem.delete({ where: { id: itemId } });

    res.json({ message: "Item removed" });
  } catch (error) {
    if (error instanceof ApiError) return res.status(error.statusCode).json({ error: error.message });
    res.status(500).json({ error: "Failed to remove item" });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const cart = await prisma.cart.findUnique({ where: { userId: req.user.userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    res.json({ message: "Cart cleared" });
  } catch (error) {
    if (error instanceof ApiError) return res.status(error.statusCode).json({ error: error.message });
    res.status(500).json({ error: "Failed to clear cart" });
  }
};