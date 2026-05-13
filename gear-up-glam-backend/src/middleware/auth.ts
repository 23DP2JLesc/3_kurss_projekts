import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt.js";
import { ApiError } from "../utils/errors.js";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "No authorization token provided");
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      throw new ApiError(401, "Invalid or expired token");
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(401).json({ error: "Unauthorized" });
  }
};

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role?.toLowerCase() !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};
