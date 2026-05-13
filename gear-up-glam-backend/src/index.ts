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
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173"
].filter((origin): origin is string => Boolean(origin));

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/products/:productId/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/categories", categoryRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler (must be last middleware)
app.use(errorHandler);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 Frontend URL: ${allowedOrigins[0]}`);
  console.log(`🗄️  Database: ${process.env.DATABASE_URL?.split("@")[1]}`);
});
