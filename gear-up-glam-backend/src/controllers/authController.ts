import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/jwt";
import { hashPassword, verifyPassword } from "../utils/password";
import { registerSchema, loginSchema, RegisterInput, LoginInput } from "../utils/validation";
import { ApiError } from "../utils/errors";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const body = registerSchema.parse(req.body);
    const { email, password, displayName } = body as RegisterInput;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError(400, "Email already registered");
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: {
            displayName,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    if (error instanceof Error && error.message.includes("validation")) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const body = loginSchema.parse(req.body);
    const { email, password } = body as LoginInput;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (user.banned) {
      throw new ApiError(403, "Your account has been banned");
    }

    // Verify password
    const passwordMatch = await verifyPassword(password, user.password);

    if (!passwordMatch) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    if (error instanceof Error && error.message.includes("validation")) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Login failed" });
  }
};

export const logout = async (req: Request, res: Response) => {
  // JWT is stateless, logout is handled on frontend by removing token
  res.json({ message: "Logout successful" });
};
