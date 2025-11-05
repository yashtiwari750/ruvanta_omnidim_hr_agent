import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes.js";
import omnidimProxy from "./routes/omnidimProxy.js"; // if you have this file

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://ruvanta-hr-agent.vercel.app",
  "https://ruvanta-omnidim-hr-agent-pawr.vercel.app"
];

// ✅ Correct CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API Routes
app.use("/api/users", userRoutes);
app.use("/api/omnidim", omnidimProxy);

// ✅ Health route for testing
app.get("/", (req, res) => {
  res.send("✅ Backend is running and CORS is configured properly!");
});

// ✅ MongoDB Connection
const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
