import { Request, Response, NextFunction } from "express";
import { ApiError, handleError } from "@/utils/errors";

export const errorHandler = (
  error: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { statusCode, message } = handleError(error);

  console.error(`[${new Date().toISOString()}] Error:`, error);

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};
