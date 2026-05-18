import "dotenv/config";
import express from "express";
import cors from "cors";

import { errorHandler } from "./middleware/errorHandler.js";

import cartRoutes from "./routes/cart.js";
import categoryRoutes from "./routes/categories.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import reviewRoutes from "./routes/reviews.js";
import orderRoutes from "./routes/orders.js";
import profileRoutes from "./routes/profile.js";
import userRoutes from "./routes/users.js";

const app = express();
const PORT = Number(process.env.PORT) || 8080;

// CORS SETUP
const allowedOrigins = [
  process.env.FRONTEND_URL, 
  "https://zoological-patience-production-aede.up.railway.app",
  "http://localhost:5173"
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

/**
 * API ROUTES
 * IMPORTANT: Everything is prefixed with /api
 */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/products/:productId/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/categories", categoryRoutes);

// Health Check for Railway
app.get("/health", (req, res) => res.json({ status: "ok", message: "Server is healthy" }));

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend running on port ${PORT}`);
});