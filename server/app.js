import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import violationRoutes from "./routes/violationRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Server running 🚀" });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Atlas connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/violations", violationRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
