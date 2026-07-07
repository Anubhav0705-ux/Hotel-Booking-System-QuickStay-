import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";

import hotelRoutes from "./routes/hotelRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

await connectDB();

// --- Middleware ---
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

  console.log("CLIENT_URL =", process.env.CLIENT_URL);
console.log("Allowed Origins =", allowedOrigins);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

// Serve uploaded room images (e.g. http://localhost:5000/uploads/rooms/xxx.jpg)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// --- Health check ---
app.get("/", (req, res) => {
  res.send("Hotel Booking API is running");
});

// --- Routes ---
app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
