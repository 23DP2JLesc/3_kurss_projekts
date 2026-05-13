import "dotenv/config";
import express from "express";
import cors from "cors";
import { errorHandler } from "@/middleware/errorHandler";
import cartRoutes from "@/routes/cart";
import categoryRoutes from "@/routes/categories";
import authRoutes from "@/routes/auth";
import productRoutes from "@/routes/products";
import reviewRoutes from "@/routes/reviews";
import orderRoutes from "@/routes/orders";
import profileRoutes from "@/routes/profile";
import userRoutes from "@/routes/users";


const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: frontendUrl,
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
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
  console.log(`📝 Frontend URL: ${allowedOrigins[0]}`);
  console.log(`🗄️  Database: ${process.env.DATABASE_URL?.split("@")[1]}`);
});
