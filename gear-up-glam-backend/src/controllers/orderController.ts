import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createOrderSchema, CreateOrderInput } from "@/utils/validation";
import { ApiError } from "@/utils/errors";

const prisma = new PrismaClient();

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      include: {
        items: { include: { product: true } },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const parsedOrders = orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          fitment: JSON.parse(item.product.fitment as string),
        },
      })),
    }));

    res.json(parsedOrders);
  } catch (error) {
    if (error instanceof ApiError) return res.status(error.statusCode).json({ error: error.message });
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const body = createOrderSchema.parse(req.body);
    const { items } = body as CreateOrderInput;

    if (items.length === 0) throw new ApiError(400, "Order must contain at least one item");

    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    let orderTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) throw new ApiError(404, `Product ${item.productId} not found`);
      if (product.stock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for ${product.name}. Available: ${product.stock}`);
      }
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
      orderTotal += product.price * item.quantity;
    }

    // Create order with status "pending"
    const order = await prisma.order.create({
      data: {
        userId: req.user.userId,
        total: orderTotal,
        status: "pending",
        items: { create: orderItems },
        payment: {
          create: {
            amount: orderTotal,
            status: "pending",
            method: "card",
          },
        },
      },
      include: {
        items: { include: { product: true } },
        payment: true,
      },
    });

    // Simulate payment processing — mark as completed
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "completed",
        payment: {
          update: { status: "completed" },
        },
      },
      include: {
        items: { include: { product: true } },
        payment: true,
      },
    });

    // Update stock for each product
    for (const item of orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    const parsed = {
      ...updatedOrder,
      items: updatedOrder.items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          fitment: JSON.parse(item.product.fitment as string),
        },
      })),
    };

    res.status(201).json({
      message: "Order created successfully",
      order: parsed,
    });
  } catch (error) {
    if (error instanceof ApiError) return res.status(error.statusCode).json({ error: error.message });
    if (error instanceof Error && error.message.includes("validation")) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");

    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "completed", "cancelled"].includes(status)) {
      throw new ApiError(400, "Invalid status");
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        payment: {
          update: {
            status: status === "completed" ? "completed" : status === "cancelled" ? "failed" : "pending",
          },
        },
      },
      include: { payment: true },
    });

    res.json(order);
  } catch (error) {
    if (error instanceof ApiError) return res.status(error.statusCode).json({ error: error.message });
    res.status(500).json({ error: "Failed to update order status" });
  }
};